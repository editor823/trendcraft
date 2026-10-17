"""
TrendCraft Marketing Lab Single Runner (run_marketing_pipeline.py)
===================================================================
마케팅 연구소(Marketing Lab) 7대 SNS 데이터 수집 및 AI 분석 자동화 파이프라인
단일 실행 진입점 (Single Entry Point)

[실행 방법]
$ python pipeline/run_marketing_pipeline.py
"""

import os
import sys
import time
import datetime
import logging
from dotenv import load_dotenv

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("TrendCraft.MarketingPipeline")

# 동일 폴더 모듈 import 지원
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.insert(0, script_dir)

from marketing_collector import collect_all_marketing_posts
from marketing_analyzer import process_and_save_marketing_posts


def print_banner():
    banner = r"""
  ╔═══════════════════════════════════════════════════════════════════╗
  ║   🔬 TrendCraft [마케팅 연구소 (Marketing Lab)] 파이프라인 v1.0   ║
  ║      7대 SNS 바이럴 성공 사례 실시간 수집 & AI 3줄 역공학 분석    ║
  ╚═══════════════════════════════════════════════════════════════════╝
    """
    print(banner)


def check_prerequisites() -> bool:
    """Supabase 연결 정보 등 필수 환경변수 사전 점검"""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")

    if not supabase_url or not supabase_key:
        logger.error("❌ SUPABASE_URL 또는 SUPABASE_KEY가 설정되지 않았습니다.")
        logger.error("   pipeline/.env 파일에 Supabase 접속 정보를 확인해 주세요.")
        return False

    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        logger.info("🔑 Gemini API Key 감지: 고성능 LLM 실시간 생성 모드로 분석합니다.")
    else:
        logger.info("ℹ️ Gemini API Key 미설정: 내장 시맨틱 바이럴 역공학 엔진으로 안전하게 분석합니다.")

    return True


def run_pipeline():
    start_time = time.time()
    print_banner()

    if not check_prerequisites():
        sys.exit(1)

    logger.info("🚀 1단계: 7대 SNS 채널 바이럴 성공 데이터 수집 시작...")
    raw_posts = collect_all_marketing_posts()

    if not raw_posts:
        logger.warning("⚠️ 수집된 게시글이 없습니다. 파이프라인을 종료합니다.")
        return

    logger.info(f"✅ 1단계 완료: 총 {len(raw_posts)}건의 데이터 수집 성공!")

    logger.info("🧠 2단계: AI 역공학 3줄 분석 & Supabase DB 적재 시작...")
    summary = process_and_save_marketing_posts(raw_posts, reset_table=True)

    elapsed = round(time.time() - start_time, 2)

    print("\n" + "=" * 65)
    print("🎉 [마케팅 연구소 파이프라인 100% 실존 데이터 적재 완료 보고서]")
    print(f" • 실행 시각     : {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f" • 총 수집/분석  : {summary['total_analyzed']} 건")
    print(f" • 신규 DB 등록  : {summary['db_saved']} 건")
    print(f" • 기존 DB 갱신  : {summary['db_updated']} 건")
    print(f" • 초기화된 구버전 데이터 : {summary.get('deleted_legacy_it', 0)} 건 (기존 가짜/불일치 전량 삭제)")
    print(f" • 소요 시간     : {elapsed} 초")
    print("=" * 65)
    print("\n[🎯 실제 정상 작동 검증 URL 샘플 3건]")
    sample_count = 0
    for p in raw_posts:
        if p.get("channel") in ("youtube", "naver_blog"):
            sample_count += 1
            print(f" {sample_count}. [{p.get('channel').upper()}] {p.get('title')}")
            print(f"    🔗 {p.get('source_url')}")
            if sample_count >= 3:
                break
    print("=" * 65)
    print("👉 프론트엔드 대시보드(http://localhost:3000)의 [🔬 마케팅 연구소] 탭에서 확인하세요!\n")


if __name__ == "__main__":
    run_pipeline()
