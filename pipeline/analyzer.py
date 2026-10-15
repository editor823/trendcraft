"""
TrendCraft AI Trend Analyzer (analyzer.py)
- Supabase `raw_trends`에서 기간별(daily, weekly, monthly) 원시 키워드 로드
- Google AI Studio (Gemini 2.5 Flash Free API) Structured Outputs(JSON Schema) 호출
- 노이즈 필터링, SPIKE vs LONG_TAIL 판정, 테마 클러스터링, 3대 실행 아이디어 생성
- Supabase `trend_clusters` 및 `trend_items` 테이블에 일괄 Upsert
"""

import os
import sys
import json
import datetime
import argparse
import logging
from typing import List, Literal
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from supabase import create_client, Client
from google import genai
from google.genai import types

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("TrendCraft.Analyzer")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


# ---------------------------------------------------------------------------
# 1. Gemini 2.5 Flash 응답 강제를 위한 Pydantic JSON 스키마 정의
# ---------------------------------------------------------------------------
class AnalyzedTrendItem(BaseModel):
    keyword: str = Field(description="정제된 핵심 트렌드 키워드")
    trend_type: Literal["SPIKE", "LONG_TAIL"] = Field(
        description="단기 급상승 화제성(SPIKE) 또는 지속적/계절성 꾸준한 수요(LONG_TAIL)"
    )
    score: int = Field(description="트렌드 파급력 및 비즈니스 기회 점수 (1~100)", ge=1, le=100)
    growth_rate: str = Field(description="예상/관측 성장세 지표 (예: '+340%', '+85%', 'Steady +25%')")
    content_idea: str = Field(
        description="유튜브 영상 또는 블로그 포스팅 제목 및 썸네일 후킹 카피 제안 (구체적 포맷 포함)"
    )
    product_idea: str = Field(
        description="소싱 또는 자체 브랜딩 가능한 이커머스 실물/디지털 상품 기획안"
    )
    service_idea: str = Field(
        description="인디 개발자/기획자가 즉시 구축할 수 있는 웹/앱/SaaS MVP 핵심 기능 제안"
    )
    sources: List[str] = Field(
        description="해당 키워드가 포착된 출처 목록 (naver, youtube, google, reddit, producthunt 중 해당 항목)"
    )


class AnalyzedThemeCluster(BaseModel):
    region: Literal["KR", "GLOBAL", "ALL"] = Field(description="클러스터의 주요 타깃 권역")
    cluster_name: str = Field(description="직관적이고 매력적인 상위 트렌드 테마명 (예: '초개인화 AI 에이전트 툴')")
    cluster_summary: str = Field(description="이 테마가 왜 부상하고 있는지 핵심 배경 및 시장 기회 2문장 요약")
    items: List[AnalyzedTrendItem] = Field(description="클러스터에 속하는 정제된 키워드 및 실행 아이디어 목록")


class TrendAnalysisResponse(BaseModel):
    clusters: List[AnalyzedThemeCluster] = Field(description="클러스터링된 트렌드 테마 및 아이템 전체 목록")


# ---------------------------------------------------------------------------
# 2. Supabase 원시 데이터 조회
# ---------------------------------------------------------------------------
def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("SUPABASE_URL 및 SUPABASE_KEY 환경 변수가 설정되지 않았습니다.")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_raw_keywords(supabase: Client, period_type: Literal["daily", "weekly", "monthly"]) -> List[dict]:
    days_map = {"daily": 1, "weekly": 7, "monthly": 30}
    days = days_map.get(period_type, 1)
    since_dt = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=days)).isoformat()

    resp = (
        supabase.table("raw_trends")
        .select("source, region, keyword, rank, traffic_volume")
        .gte("collected_at", since_dt)
        .order("rank", desc=False)
        .limit(250)
        .execute()
    )
    return resp.data or []


# ---------------------------------------------------------------------------
# 3. Gemini 2.5 Flash API 호출 및 JSON 구조화 분석
# ---------------------------------------------------------------------------
def analyze_trends_with_gemini(
    raw_records: List[dict],
    period_type: Literal["daily", "weekly", "monthly"],
) -> TrendAnalysisResponse:
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.")

    client = genai.Client(api_key=GEMINI_API_KEY)

    system_instruction = (
        "당신은 창작자, 이커머스 기획자, 인디 개발자를 위한 최고의 트렌드 인텔리전스 수석 애널리스트입니다.
"
        "주어진 원시 트렌드 키워드 목록을 분석하여 다음 4가지 원칙을 엄격히 수행하세요:
"
        "1. 노이즈 제거: 단순 TV 방송/드라마 제목, 연예인 일회성 가십, 사건/사고, 의미 없는 중복 키워드를 철저히 제외하세요.
"
        "2. 유형 분류: 단기 폭발적 화제성 키워드는 'SPIKE', 지속적 검색 수요나 재구매/구독 니즈가 있는 키워드는 'LONG_TAIL'로 분류하세요.
"
        "3. 클러스터링: 연관된 키워드들을 묶어 직관적인 상위 비즈니스 테마(cluster_name)로 군집화하세요.
"
        "4. 실행 아이디어 도출: 각 키워드마다 즉시 실행 가능한 구체적인 [콘텐츠 주제(유튜브/블로그 제목+썸네일 카피)], "
        "[이커머스 실물/디지털 상품 기획], [웹/앱 마이크로 SaaS MVP 기능]을 한국어로 명확하게 작성하세요."
    )

    user_prompt = (
        f"분석 주기: {period_type.upper()}
"
        f"수집된 원시 트렌드 데이터 ({len(raw_records)}건):
"
        f"{json.dumps(raw_records, ensure_ascii=False, indent=2)}

"
        "위 데이터를 바탕으로 KR, GLOBAL, ALL 권역별 핵심 테마 클러스터(4~6개)와 각 클러스터당 3~5개의 고가치 키워드 아이템을 도출해 주세요."
    )

    logger.info(f"Gemini 2.5 Flash 모델에 {len(raw_records)}건의 원시 키워드 분석 요청 중...")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=TrendAnalysisResponse,
            temperature=0.3,
        ),
    )

    parsed_dict = json.loads(response.text)
    return TrendAnalysisResponse.model_validate(parsed_dict)


# ---------------------------------------------------------------------------
# 4. Supabase `trend_clusters` & `trend_items` 일괄 Upsert
# ---------------------------------------------------------------------------
def upsert_analyzed_trends(
    supabase: Client,
    analysis: TrendAnalysisResponse,
    period_type: Literal["daily", "weekly", "monthly"],
    target_date: str,
) -> None:
    for cluster in analysis.clusters:
        cluster_payload = {
            "period_type": period_type,
            "region": cluster.region,
            "cluster_name": cluster.cluster_name,
            "cluster_summary": cluster.cluster_summary,
            "target_date": target_date,
        }

        cluster_resp = (
            supabase.table("trend_clusters")
            .upsert(cluster_payload, on_conflict="period_type,region,target_date,cluster_name")
            .execute()
        )

        if not cluster_resp.data:
            logger.error(f"클러스터 저장 실패: {cluster.cluster_name}")
            continue

        cluster_id = cluster_resp.data[0]["id"]
        items_payload = [
            {
                "cluster_id": cluster_id,
                "keyword": item.keyword,
                "trend_type": item.trend_type,
                "score": item.score,
                "growth_rate": item.growth_rate,
                "content_idea": item.content_idea,
                "product_idea": item.product_idea,
                "service_idea": item.service_idea,
                "sources": item.sources,
            }
            for item in cluster.items
        ]

        if items_payload:
            supabase.table("trend_items").upsert(
                items_payload, on_conflict="cluster_id,keyword"
            ).execute()
            logger.info(
                f"[{cluster.region}] '{cluster.cluster_name}' 클러스터 및 {len(items_payload)}개 실행 카드 Upsert 완료."
            )


def main() -> None:
    parser = argparse.ArgumentParser(description="TrendCraft Gemini AI Trend Analyzer")
    parser.add_argument(
        "--period",
        type=str,
        choices=["daily", "weekly", "monthly"],
        default="daily",
        help="분석할 집계 주기 (daily | weekly | monthly)",
    )
    args = parser.parse_args()
    period_type: Literal["daily", "weekly", "monthly"] = args.period  # type: ignore

    supabase = get_supabase_client()
    raw_records = fetch_raw_keywords(supabase, period_type=period_type)

    if not raw_records:
        logger.warning(f"최근 '{period_type}' 구간의 원시 키워드가 없습니다. collector.py를 먼저 실행하세요.")
        sys.exit(0)

    analysis_result = analyze_trends_with_gemini(raw_records, period_type=period_type)
    today_str = datetime.date.today().isoformat()
    upsert_analyzed_trends(supabase, analysis_result, period_type=period_type, target_date=today_str)
    logger.info("=== TrendCraft AI 분석 및 DB 적재 파이프라인 정상 종료 ===")


if __name__ == "__main__":
    main()
