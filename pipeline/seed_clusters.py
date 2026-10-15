"""
TrendCraft 초기 대시보드 시드 데이터 적재 스크립트 (seed_clusters.py)
Supabase `trend_clusters` 및 `trend_items` 테이블에 기간별(daily, weekly, monthly),
지역별(KR, GLOBAL) 실제 트렌드 분석 클러스터 및 3대 실행 아이디어를 일괄 Upsert/Insert합니다.
"""

import os
import sys
import datetime
from dotenv import load_dotenv
from supabase import create_client

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("[ERROR] SUPABASE_URL 및 SUPABASE_KEY 환경변수가 설정되지 않았습니다.")
    sys.exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

today_str = datetime.date.today().strftime("%Y-%m-%d")

CLUSTERS_DATA = [
    # 1. 일간 - KR
    {
        "cluster": {
            "period_type": "daily",
            "region": "KR",
            "cluster_name": "초개인화 AI 생산성 & 워크플로우 툴",
            "cluster_summary": "단순 챗봇을 넘어 코딩, 문서화, 일정 관리를 스스로 대행하는 자율 AI 에이전트 도구에 대한 국내 관심도가 폭증하고 있습니다.",
            "target_date": today_str,
        },
        "items": [
            {
                "keyword": "AI 코딩 에이전트",
                "trend_type": "SPIKE",
                "score": 96,
                "growth_rate": "+340%",
                "content_idea": "비개발자가 AI 에이전트로 30분 만에 웹서비스 론칭하고 첫 결제 받은 생생한 후기 (썸네일: 코드 한 줄 없이 월 100만원 벌기)",
                "product_idea": "프롬프트 복사-붙여넣기만으로 웹앱을 완성하는 100가지 실전 템플릿 노션 킷 (디지털 다운로드 상품)",
                "service_idea": "비개발자 창업자를 위한 노코드 + AI 에이전트 자동 디플로이 및 버그 진단 마이크로 SaaS",
                "sources": ["naver", "youtube", "google"],
            },
            {
                "keyword": "로컬 LLM 설치 자동화",
                "trend_type": "LONG_TAIL",
                "score": 84,
                "growth_rate": "+85%",
                "content_idea": "내 컴퓨터 GPU로 개인정보 유출 없이 평생 무료 AI 비서 구축하는 완벽 가이드",
                "product_idea": "Ollama/vLLM 원클릭 세팅 스크립트 및 최적 파라미터 세팅 프리셋 번들",
                "service_idea": "기업 내부 문서를 로컬 AI로 안전하게 검색하고 요약해주는 온프레미스 지식창고 데스크톱 앱",
                "sources": ["youtube", "reddit"],
            },
            {
                "keyword": "수출 경기 지표",
                "trend_type": "SPIKE",
                "score": 88,
                "growth_rate": "+150%",
                "content_idea": "2026년 하반기 K-뷰티 및 K-푸드 글로벌 수출 폭증 품목 3가지 분석",
                "product_idea": "소상공인 해외 수출용 영문/일문 상세페이지 자동 번역 및 현지화 템플릿",
                "service_idea": "관세청 공개 데이터를 기반으로 품목별 수출 기회 점수를 매겨주는 무역 인텔리전스 대시보드",
                "sources": ["naver", "google"],
            },
        ],
    },

    # 2. 일간 - GLOBAL
    {
        "cluster": {
            "period_type": "daily",
            "region": "GLOBAL",
            "cluster_name": "Micro SaaS & Solopreneur 자동화 생태계",
            "cluster_summary": "1인 창업가(Solopreneur)들이 AI API를 조합하여 월 수천 달러의 반복 매출을 올리는 마이크로 서비스가 글로벌 테크 씬에서 주목받고 있습니다.",
            "target_date": today_str,
        },
        "items": [
            {
                "keyword": "AI SEO 자동화 파이프라인",
                "trend_type": "SPIKE",
                "score": 92,
                "growth_rate": "+270%",
                "content_idea": "How I built an automated programmatic SEO machine that gets 100k views/month on autopilot",
                "product_idea": "Top 500 High-Intent Niche Keywords Dataset for Indie Hackers",
                "service_idea": "블로그 주제만 입력하면 검색엔진 상위노출용 마크다운 글과 썸네일을 자동 발행하는 크론 잡 SaaS",
                "sources": ["producthunt", "reddit", "google"],
            },
            {
                "keyword": "B2B 콜드콜 AI 음성 봇",
                "trend_type": "LONG_TAIL",
                "score": 78,
                "growth_rate": "Steady +45%",
                "content_idea": "사람처럼 숨소리까지 내는 최신 AI 음성 상담원 실시간 테스트 (고객 반응 모음)",
                "product_idea": "산업군별(부동산, 병원, 피트니스) 최적화 AI 콜 시나리오 프롬프트 패키지",
                "service_idea": "소상공인 매장을 위한 24시간 예약 및 문의 자동 응대 AI 전화 서비스",
                "sources": ["producthunt", "youtube"],
            },
            {
                "keyword": "IREN Stock AI Data Center",
                "trend_type": "SPIKE",
                "score": 85,
                "growth_rate": "+190%",
                "content_idea": "Why Wall Street is Betting Big on AI Datacenter Infrastructure Stocks",
                "product_idea": "AI 인프라 및 전력 수혜주 포트폴리오 트래커 노션 대시보드",
                "service_idea": "글로벌 데이터센터 전력 소비량 및 GPU 호스팅 가격 실시간 비교 플랫폼",
                "sources": ["google", "reddit"],
            },
        ],
    },

    # 3. 주간 - KR
    {
        "cluster": {
            "period_type": "weekly",
            "region": "KR",
            "cluster_name": "저속 노화 & 슬로 에이징 푸드 라이프스타일",
            "cluster_summary": "단순 다이어트를 넘어 혈당 관리, 뇌 건강, 수면의 질을 최적화하여 신체 나이를 늦추려는 2040 세대의 건강 식습관 트렌드입니다.",
            "target_date": today_str,
        },
        "items": [
            {
                "keyword": "저속노화 밥상 밀키트",
                "trend_type": "SPIKE",
                "score": 89,
                "growth_rate": "+190%",
                "content_idea": "30대 직장인이 저속노화 식단 30일 동안 매일 먹어본 실제 혈액검사 전후 비교",
                "product_idea": "렌틸콩, 귀리, 현미 최적 배합 저속노화 믹스 곡물팩 및 레디밀 정기구독",
                "service_idea": "음식 사진을 찍으면 혈당 스파이크 위험도와 슬로에이징 점수를 산출해주는 AI 영양 코칭 앱",
                "sources": ["naver", "youtube"],
            },
            {
                "keyword": "수면 데이터 트래커 링",
                "trend_type": "LONG_TAIL",
                "score": 81,
                "growth_rate": "Steady +35%",
                "content_idea": "스마트워치 vs 스마트링 딥슬립 수면 측정 정확도 끝판왕 비교",
                "product_idea": "수면 호르몬 분비를 돕는 멜라토닌 대체 천연 타트체리 나이트 앰플",
                "service_idea": "웨어러블 수면 데이터를 분석하여 매일 아침 맞춤형 기상 루틴과 온도를 제어해주는 IoT 허브",
                "sources": ["naver", "google"],
            },
        ],
    },

    # 4. 주간 - GLOBAL
    {
        "cluster": {
            "period_type": "weekly",
            "region": "GLOBAL",
            "cluster_name": "에이전틱 AI 보안 & 프라이버시 가드",
            "cluster_summary": "AI 도구 사용이 일상화되면서 기업 및 개인의 소스코드 및 민감 데이터 유출을 방지하려는 보안 수요가 급증하고 있습니다.",
            "target_date": today_str,
        },
        "items": [
            {
                "keyword": "AI Data Redaction Tool",
                "trend_type": "SPIKE",
                "score": 91,
                "growth_rate": "+240%",
                "content_idea": "How Hackers Steal Your API Keys from Prompts & How to Stop Them",
                "product_idea": "프롬프트 입력 전 주민번호/카드번호를 자동 마스킹하는 브라우저 익스텐션",
                "service_idea": "팀원들의 LLM 프롬프트 사용 내역에서 민감 정보를 실시간 필터링해주는 사내 AI 게이트웨이",
                "sources": ["producthunt", "reddit"],
            },
        ],
    },

    # 5. 월간 - KR
    {
        "cluster": {
            "period_type": "monthly",
            "region": "KR",
            "cluster_name": "공간 대여 & 무인 스토어 자동화 솔루션",
            "cluster_summary": "인건비 상승과 N잡 열풍에 힘입어 무인 스튜디오, 파티룸, 무인 매장의 원격 관리를 돕는 하드웨어 연동 소프트웨어 수요가 꾸준히 증가하고 있습니다.",
            "target_date": today_str,
        },
        "items": [
            {
                "keyword": "무인 매장 원격 IoT 제어",
                "trend_type": "LONG_TAIL",
                "score": 86,
                "growth_rate": "Steady +50%",
                "content_idea": "직장 다니며 무인 파티룸 3곳 오토로 굴려 순수익 400만원 만드는 자동화 세팅법",
                "product_idea": "스마트 도어락 및 스마트 조명 원클릭 예약 연동 키트",
                "service_idea": "네이버 예약 완료 시 출입문 비밀번호를 고객에게 카카오 알림톡으로 자동 발송하는 무인 매장 매니저 SaaS",
                "sources": ["naver", "youtube"],
            },
        ],
    },

    # 6. 월간 - GLOBAL
    {
        "cluster": {
            "period_type": "monthly",
            "region": "GLOBAL",
            "cluster_name": "Next-Gen Indie Developer Boilerplates",
            "cluster_summary": "아이디어를 즉시 실제 제품으로 배포할 수 있도록 결제, 인증, DB가 사전 세팅된 보일러플레이트 시장이 성숙해지고 있습니다.",
            "target_date": today_str,
        },
        "items": [
            {
                "keyword": "Next.js AI SaaS Starter Kit",
                "trend_type": "SPIKE",
                "score": 94,
                "growth_rate": "+310%",
                "content_idea": "Building a $5k/mo AI SaaS in a single weekend using modern boilerplates",
                "product_idea": "Stripe + Supabase + Cloudflare Pages 최적화 Next.js 14 풀스택 보일러플레이트",
                "service_idea": "클릭 몇 번으로 AI SaaS의 랜딩페이지와 과금 모델을 생성해주는 자동 빌더 도구",
                "sources": ["producthunt", "reddit", "google"],
            },
        ],
    },
]


def seed_database():
    print(f"=== Supabase 트렌드 클러스터 시드 데이터 적재 시작 (Target Date: {today_str}) ===")
    total_clusters = 0
    total_items = 0

    for cluster_data in CLUSTERS_DATA:
        c_info = cluster_data["cluster"]
        items = cluster_data["items"]

        # 1. trend_clusters 테이블에 upsert
        c_res = supabase.table("trend_clusters").upsert(
            c_info,
            on_conflict="period_type,region,target_date,cluster_name"
        ).execute()

        if not c_res.data:
            print(f"[WARN] 클러스터 생성 실패: {c_info['cluster_name']}")
            continue

        cluster_id = c_res.data[0]["id"]
        total_clusters += 1
        print(f"✓ 클러스터 등록 완료: [{c_info['period_type'].upper()}/{c_info['region']}] {c_info['cluster_name']}")

        # 2. trend_items 테이블에 upsert
        for item in items:
            item_payload = {
                **item,
                "cluster_id": cluster_id,
            }
            i_res = supabase.table("trend_items").upsert(
                item_payload,
                on_conflict="cluster_id,keyword"
            ).execute()
            if i_res.data:
                total_items += 1

    print(f"\n🎉 성공: 총 {total_clusters}개 클러스터 및 {total_items}개 실행 아이템 적재 완료!")


if __name__ == "__main__":
    seed_database()
