"""
TrendCraft Data Collector (collector.py)
- 국내 소스: 네이버 데이터랩/쇼핑 인사이트 공식 Open API, 한국 유튜브 인기 급상승 피드
- 글로벌 소스: Google Trends Daily RSS (KR/US), Reddit 인기 서브레딧 피드, Product Hunt 일간 랭킹 RSS
- 수집된 데이터를 Supabase `raw_trends` 테이블에 일괄 적재(Batch Insert)하거나 dry-run으로 미리 확인합니다.
"""

import os
import sys
import argparse
import datetime
import logging
from typing import List, Dict, Any
import requests
import feedparser
from dotenv import load_dotenv
from supabase import create_client, Client
from tenacity import retry, stop_after_attempt, wait_exponential

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("TrendCraft.Collector")

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")  # service_role key 권장
NAVER_CLIENT_ID = os.getenv("NAVER_CLIENT_ID", "")
NAVER_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET", "")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
PRODUCTHUNT_TOKEN = os.getenv("PRODUCTHUNT_TOKEN", "")

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"


def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("SUPABASE_URL 및 SUPABASE_KEY 환경 변수가 설정되지 않았습니다.")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


# ---------------------------------------------------------------------------
# 1. 국내 소스 수집기 (Naver Shopping Insight & YouTube Korea)
# ---------------------------------------------------------------------------
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_naver_trends() -> List[Dict[str, Any]]:
    """
    네이버 데이터랩 쇼핑인사이트 분야별 인기 검색어 / 트렌드 API 호출
    """
    results: List[Dict[str, Any]] = []
    if not NAVER_CLIENT_ID or not NAVER_CLIENT_SECRET:
        logger.warning("NAVER API 키 미설정: 네이버 쇼핑/검색 수집을 건너뜁니다.")
        return results

    url = "https://openapi.naver.com/v1/datalab/shopping/categories"
    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
        "Content-Type": "application/json",
    }

    today = datetime.date.today()
    start_date = (today - datetime.timedelta(days=7)).strftime("%Y-%m-%d")
    end_date = today.strftime("%Y-%m-%d")

    categories = [
        {"name": "AI 스마트기기/가전", "param": ["50000003"]},
        {"name": "제로슈거/헬시플레저 식품", "param": ["50000006"]},
        {"name": "홈케어/더마 뷰티", "param": ["50000002"]},
    ]

    body = {
        "startDate": start_date,
        "endDate": end_date,
        "timeUnit": "date",
        "category": categories,
    }

    try:
        resp = requests.post(url, headers=headers, json=body, timeout=15)
        resp.raise_for_status()
        data = resp.json().get("results", [])
        for rank, cat in enumerate(data, start=1):
            title = cat.get("title", "")
            data_points = cat.get("data", [])
            last_ratio = data_points[-1].get("ratio", 0) if data_points else 0
            if title:
                results.append({
                    "source": "naver",
                    "region": "KR",
                    "keyword": f"네이버 쇼핑 인기 테마: {title}",
                    "rank": rank,
                    "traffic_volume": f"상대 클릭지수 {last_ratio:.1f}",
                })
    except Exception as exc:
        logger.error(f"네이버 데이터랩 수집 오류: {exc}")

    return results


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_youtube_kr_trends(max_results: int = 20) -> List[Dict[str, Any]]:
    """
    한국 유튜브 인기 급상승 동영상 (YouTube Data API v3)
    """
    results: List[Dict[str, Any]] = []
    if not YOUTUBE_API_KEY:
        logger.warning("YOUTUBE_API_KEY 미설정: YouTube 수집을 건너뜁니다.")
        return results

    url = "https://www.googleapis.com/youtube/v3/videos"
    params = {
        "part": "snippet,statistics",
        "chart": "mostPopular",
        "regionCode": "KR",
        "maxResults": max_results,
        "key": YOUTUBE_API_KEY,
    }

    try:
        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()
        items = resp.json().get("items", [])
        for rank, item in enumerate(items, start=1):
            snippet = item.get("snippet", {})
            stats = item.get("statistics", {})
            title = snippet.get("title", "").strip()
            view_count = stats.get("viewCount", "0")
            if title:
                results.append({
                    "source": "youtube",
                    "region": "KR",
                    "keyword": title[:120],
                    "rank": rank,
                    "traffic_volume": f"{int(view_count):,} views",
                })
    except Exception as exc:
        logger.error(f"유튜브 인기 급상승 수집 오류: {exc}")

    return results


# ---------------------------------------------------------------------------
# 2. 글로벌 & 국내 Google Trends Daily RSS 수집기
# ---------------------------------------------------------------------------
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_google_trends_rss(geo: str = "KR") -> List[Dict[str, Any]]:
    """
    Google Trends 일간 급상승 RSS 피드 파싱 (KR 및 US/GLOBAL 지원)
    """
    url = f"https://trends.google.com/trending/rss?geo={geo}"
    region_code = "KR" if geo.upper() == "KR" else "GLOBAL"
    results: List[Dict[str, Any]] = []

    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=15)
        resp.raise_for_status()
        feed = feedparser.parse(resp.text)
        for rank, entry in enumerate(feed.entries[:20], start=1):
            title = entry.get("title", "").strip()
            traffic = entry.get("ht_approx_traffic", "N/A")
            if title:
                results.append({
                    "source": "google",
                    "region": region_code,
                    "keyword": title,
                    "rank": rank,
                    "traffic_volume": str(traffic),
                })
    except Exception as exc:
        logger.error(f"Google Trends RSS ({geo}) 수집 오류: {exc}")

    return results


# ---------------------------------------------------------------------------
# 3. 글로벌 Reddit 피드 수집기 (RSS 방식 폴백 지원)
# ---------------------------------------------------------------------------
def fetch_reddit_trends(
    subreddits: List[str] = ["technology", "sideproject", "entrepreneur"],
    limit_per_sub: int = 5,
) -> List[Dict[str, Any]]:
    """
    Reddit 서브레딧 RSS 피드 수집 (차단 방지 및 안정성 극대화)
    """
    results: List[Dict[str, Any]] = []
    headers = {"User-Agent": USER_AGENT}
    rank_counter = 1

    for sub in subreddits:
        # RSS 피드는 일반 HTTP 403 차단이 적고 안정적으로 파싱 가능
        rss_url = f"https://www.reddit.com/r/{sub}/hot/.rss?limit={limit_per_sub}"
        try:
            resp = requests.get(rss_url, headers=headers, timeout=15)
            if resp.status_code == 200:
                feed = feedparser.parse(resp.text)
                for entry in feed.entries[:limit_per_sub]:
                    title = entry.get("title", "").strip()
                    if title:
                        results.append({
                            "source": "reddit",
                            "region": "GLOBAL",
                            "keyword": f"[r/{sub}] {title[:100]}",
                            "rank": rank_counter,
                            "traffic_volume": "Reddit Hot",
                        })
                        rank_counter += 1
            else:
                logger.warning(f"Reddit r/{sub} RSS 피드 응답 코드: {resp.status_code}")
        except Exception as exc:
            logger.error(f"Reddit r/{sub} 수집 오류: {exc}")

    return results


# ---------------------------------------------------------------------------
# 4. 글로벌 Product Hunt 일간 트렌드 피드 수집기
# ---------------------------------------------------------------------------
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_producthunt_trends(max_items: int = 15) -> List[Dict[str, Any]]:
    """
    Product Hunt 공식 Atom/RSS 피드에서 최신 프로덕트 키워드 수집
    """
    results: List[Dict[str, Any]] = []
    rss_url = "https://www.producthunt.com/feed"

    try:
        resp = requests.get(rss_url, headers={"User-Agent": USER_AGENT}, timeout=15)
        resp.raise_for_status()
        feed = feedparser.parse(resp.text)
        for rank, entry in enumerate(feed.entries[:max_items], start=1):
            title = entry.get("title", "").strip()
            if title:
                results.append({
                    "source": "producthunt",
                    "region": "GLOBAL",
                    "keyword": title[:120],
                    "rank": rank,
                    "traffic_volume": f"PH Daily #{rank}",
                })
    except Exception as exc:
        logger.error(f"Product Hunt 피드 수집 오류: {exc}")

    return results


# ---------------------------------------------------------------------------
# 5. 통합 실행 및 Supabase `raw_trends` 적재
# ---------------------------------------------------------------------------
def collect_all_sources() -> List[Dict[str, Any]]:
    logger.info("=== TrendCraft 원시 트렌드 데이터 수집 시작 ===")
    all_trends: List[Dict[str, Any]] = []

    # 구글 트렌드 (한국 + 미국)
    all_trends.extend(fetch_google_trends_rss(geo="KR"))
    all_trends.extend(fetch_google_trends_rss(geo="US"))

    # 네이버 & 유튜브 (API 키 설정 시 작동)
    all_trends.extend(fetch_naver_trends())
    all_trends.extend(fetch_youtube_kr_trends())

    # 레딧 & 프로덕트헌트 (글로벌 테크/창업)
    all_trends.extend(fetch_reddit_trends())
    all_trends.extend(fetch_producthunt_trends())

    logger.info(f"총 {len(all_trends)}건의 원시 키워드 수집 완료.")
    return all_trends


def save_raw_trends_to_supabase(trends: List[Dict[str, Any]]) -> int:
    if not trends:
        logger.warning("저장할 수집 데이터가 없습니다.")
        return 0

    try:
        supabase = get_supabase_client()
        now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
        payload = [{**item, "collected_at": now_iso} for item in trends]

        response = supabase.table("raw_trends").insert(payload).execute()
        inserted_count = len(response.data) if response.data else 0
        logger.info(f"Supabase raw_trends 테이블에 {inserted_count}건 적재 완료!")

        # 30일 경과 원시 데이터 자동 정리 (500MB 무료 한도 유지)
        try:
            supabase.rpc("cleanup_old_raw_trends", {"retention_days": 30}).execute()
        except Exception as exc:
            logger.warning(f"오래된 raw_trends 정리 RPC 호출 알림 (함수 미생성 시 무시 가능): {exc}")

        return inserted_count
    except Exception as exc:
        logger.error(f"Supabase raw_trends 테이블 INSERT 실패: {exc}")
        logger.info(
            "안내: Supabase 대시보드의 SQL Editor에서 supabase/schema.sql 스크립트가 실행되어 "
            "raw_trends 테이블이 생성되었는지 확인해 주세요."
        )
        return 0


def main():
    parser = argparse.ArgumentParser(description="TrendCraft 트렌드 데이터 수집 파이프라인")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="DB에 실제로 저장하지 않고 수집 결과만 터미널에 출력합니다.",
    )
    args = parser.parse_args()

    collected = collect_all_sources()

    if args.dry_run:
        logger.info("=== [DRY-RUN 모드] 수집된 키워드 미리보기 (DB 저장 생략) ===")
        for idx, item in enumerate(collected[:15], start=1):
            print(f"[{idx:02d}] ({item['source'].upper():^11}) [{item['region']}] {item['keyword']} ({item['traffic_volume']})")
        if len(collected) > 15:
            print(f"... 외 {len(collected) - 15}개 키워드 추가 수집됨 (총 {len(collected)}개)")
    else:
        save_raw_trends_to_supabase(collected)


if __name__ == "__main__":
    main()
