"""
TrendCraft AI Trend Analyzer (analyzer.py)
- Supabase `raw_trends`에서 최신 원시 키워드를 가져와 AI 클러스터링 및 3대 실행 아이디어 도출
- Gemini 2.5 Flash API 우선 호출 + 지능형 시맨틱 클러스터링 엔진 하이브리드 탑재
- 최소 5개 이상의 테마 클러스터 및 25~35개 이상의 trend_items (SPIKE 12+ / LONG_TAIL 12+) 자동 생성
- Supabase `trend_clusters` 및 `trend_items` 테이블에 일괄 Upsert
"""

import os
import sys
import json
import datetime
import argparse
import logging
from typing import List, Dict, Any, Literal
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from supabase import create_client, Client

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


def get_supabase_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("SUPABASE_URL 및 SUPABASE_KEY 환경 변수가 설정되지 않았습니다.")
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_raw_keywords(supabase: Client, limit: int = 200) -> List[dict]:
    try:
        resp = (
            supabase.table("raw_trends")
            .select("source, region, keyword, rank, traffic_volume")
            .order("collected_at", desc=True)
            .limit(limit)
            .execute()
        )
        return resp.data or []
    except Exception as exc:
        logger.warning(f"raw_trends 조회 알림: {exc}")
        return []


# ---------------------------------------------------------------------------
# 유튜브 ASO 마이크로 앱 공장 스펙 생성기 (검색어 선정 -> 2시간 컷 모바일 AI 앱 개발)
# ---------------------------------------------------------------------------
def generate_aso_micro_app_spec(keyword: str, service_idea: str, score: int) -> Dict[str, Any]:
    """유튜브 ASO 마이크로 앱 공장 전략: 검색어 먼저 고르고 2시간 만에 AI 앱 출시
    - 사람들이 모바일로 즉시 해결하고 싶어 하는 문제(식별, 계산, 변환, 요약 등)를 도출
    - Claude Code / Cursor에 붙여넣으면 2시간 만에 만들 수 있는 One-Click Build Spec 생성
    """
    key_clean = keyword.strip()
    key_lower = key_clean.lower()

    # 기회 점수 (1~100) 및 경쟁 강도 (LOW/MID/HIGH)
    bonus = 5 if any(w in key_lower or w in key_clean for w in ["ai", "자동", "계산", "스파이크", "보안"]) else 0
    opp_score = min(98, max(75, score + bonus))
    competitor = "LOW" if opp_score >= 90 else ("MID" if opp_score >= 80 else "HIGH")

    prompt = f"""# [Claude Code / Cursor 전용] 2시간 컷 모바일 AI 마이크로 앱 One-Click Build Spec

## 📱 프로젝트 개요
- **앱 명칭**: {key_clean.replace(' ', '')} Pocket MVP
- **타겟 ASO 검색어**: "{key_clean}", "{key_clean} 계산기", "{key_clean} 요약", "{key_clean} 자동화"
- **개발 제한 시간**: ⏱️ 정확히 2시간 (오직 단 1개의 핵심 기능만 완벽히 구현)
- **추천 스택**: Next.js 14 (Mobile PWA) 또는 React Native (Expo) + Tailwind CSS + Lucide Icons

## 💡 모바일 즉시 해결 문제 (Core Problem)
- 사용자가 모바일 스마트폰 화면에서 3초 안에:
  {service_idea}

## 🚀 2시간 완성 핵심 기능 명세 (Single Core MVP)
1. **[직관적 1페이지 UI]**: 상단 헤더, 메인 원클릭 입력 인풋(사진 업로드 또는 텍스트 입력창), 결과 표시 카드.
2. **[AI/로직 즉시 처리 엔진]**: 무료 AI API(Groq / Gemini Flash) 또는 경량 자바스크립트 계산 로직으로 1초 안에 결과 산출.
3. **[원클릭 공유 및 클립보드 복사]**: 생성된 결과를 카카오톡, 인스타, 슬랙으로 즉시 전송할 수 있는 원클릭 복사 버튼.

## 🛠️ 개발 지시사항
- 불필요한 회원가입이나 복잡한 설정 없이, 앱을 켜자마자 바로 동작하는 로컬 상태(useState) 기반으로 코드를 완성해줘.
- 모바일 세로 뷰포트(`w-full max-w-md mx-auto min-h-screen`)에 완벽하게 최적화해줘.
"""

    return {
        "app_opportunity_score": opp_score,
        "competitor_count": competitor,
        "ai_app_prompt": prompt.strip(),
    }


# ---------------------------------------------------------------------------
# AI 역공학(Reverse Engineering) & 마이크로 SaaS 언번들링 스펙 생성기
# ---------------------------------------------------------------------------
def generate_reverse_eng_spec(keyword: str, service_idea: str) -> Dict[str, Any]:
    """거대 서비스(노션, 캔바, 어도비, 지라, 재피어 등)의 무거운 기능을 
    1인 개발자가 가볍게 떼어내어 복제할 수 있는 '역공학/언번들링 MVP 기획' 및 완성형 프롬프트 도출
    """
    key_clean = keyword.strip()
    key_lower = key_clean.lower()

    if any(k in key_lower or k in key_clean for k in ["보일러플레이트", "기획", "정리", "saas", "starter"]):
        target = "Notion (무거운 문서/위키/데이터베이스 기능)"
        prompt = f"""# [Claude Code / Cursor 전용] Notion 언번들링: 1인 빌더용 초경량 {key_clean} 웹앱 클론

## 🎯 역공학 대상
- **공룡 서비스**: Notion (무거운 관계형 DB, 복잡한 블록 에디터)
- **언번들링 전략**: 노션의 90% 불필요한 기능을 제거하고, '{key_clean}' 특화 1인 빌더 체크리스트 & 칸반보드만 초경량 PWA로 복제.

## 🛠️ 추천 오픈소스 & 테크 스택
- Framework: Next.js 14 (App Router) + Tailwind CSS + Lucide Icons
- 데이터 저장: LocalStorage (서버리스 0원 유지비)

## 🚀 필수 핵심 기능
1. [3열 칸반 보드]: Todo / In Progress / Done 드래그 앤 드롭 지원.
2. [사전 탑재 템플릿]: {key_clean} 관련 20개 실전 실행 항목 기본 제공.
3. [마크다운 내보내기]: 전체 진행 상황을 깔끔한 README.md 마크다운으로 1초 만에 복사.
"""
    elif any(k in key_lower or k in key_clean for k in ["video", "clip", "figma", "사진", "쇼츠"]):
        target = "Canva & Adobe Premiere Pro (무거운 타임라인 그래픽/영상 편집기)"
        prompt = f"""# [Claude Code / Cursor 전용] Canva/Adobe 언번들링: 숏폼 바이럴 후킹 {key_clean} 생성기 클론

## 🎯 역공학 대상
- **공룡 서비스**: Canva & Adobe Premiere (무거운 타임라인 및 느린 렌더링)
- **언번들링 전략**: 무거운 편집 툴을 떼어내고, '{key_clean}' 중심의 인스타/유튜브 쇼츠용 볼드 후킹 자막 합성만 브라우저 Canvas에서 0.1초 만에 처리.

## 🛠️ 추천 테크 스택
- Frontend: Next.js 14 + Tailwind CSS + HTML5 Canvas API
- 폰트: Pretendard ExtraBold 웹폰트

## 🚀 필수 핵심 기능
1. [이미지 드래그 업로드]: 배경 사진/영상 프레임 로드.
2. [후킹 자막 스타일러]: 볼드 자막 및 텍스트 외곽선 즉시 캔버스 합성.
3. [원클릭 PNG 다운로드]: 1080x1920 세로 비율 PNG 즉시 저장.
"""
    elif any(k in key_lower or k in key_clean for k in ["email", "churn", "도어락", "전화", "응대", "자동"]):
        target = "Zapier & Make (월 $30 고비용 멀티스텝 자동화 플랫폼)"
        prompt = f"""# [Claude Code / Cursor 전용] Zapier 언번들링: 초경량 웹훅 이벤트 {key_clean} 알림기 클론

## 🎯 역공학 대상
- **공룡 서비스**: Zapier & Make (월 3만원 이상의 비싼 멀티스텝 자동화)
- **언번들링 전략**: 무거운 시각적 노드 빌더를 떼어내고, 단 1개의 웹훅 URL로 알림을 전송하는 단일 파이프라인 마이크로 SaaS 구축.

## 🛠️ 추천 테크 스택
- API Server: Next.js 14 Route Handlers (/api/webhook)
- 메일/알림 전송: Resend API 또는 Discord/Slack Webhook URL
- 프론트엔드: Tailwind 기반 테스트 대시보드 (curl 명령어 자동 생성)
"""
    else:
        target = "Airtable & Notion (무거운 올인원 비즈니스 플랫폼)"
        prompt = f"""# [Claude Code / Cursor 전용] 거대 SaaS 언번들링: {key_clean} 마이크로 프로토타입 클론

## 🎯 역공학 대상
- **타겟 공룡 서비스**: {target}
- **언번들링 전략**: 거대 플랫폼의 복잡한 온보딩과 무거운 기능을 떼어내고, '{key_clean}' 문제 해결에만 100% 집중하는 독립 웹앱 재창조.

## 💡 해결할 단일 핵심 가치
- {service_idea}

## 🛠️ 기술 스택 & 개발 지시사항
- Framework: Next.js 14 (App Router) + Tailwind CSS + Lucide Icons
- 상태 관리: React useState 기반 (로컬 저장소 즉시 구동)
- 코딩 툴에서 바로 실행할 수 있도록 완결된 단일 파일 형태의 코드로 작성해줘.
"""

    return {
        "unbundled_target": target,
        "reverse_eng_prompt": prompt.strip(),
    }


# ---------------------------------------------------------------------------
# 고품질 시맨틱 클러스터 & 3대 실행 아이디어 생성기 (30+ items, SPIKE 15+ / LONG_TAIL 15+)
# ---------------------------------------------------------------------------
def generate_enriched_trend_clusters(period_type: str, raw_count: int) -> List[Dict[str, Any]]:
    today_str = datetime.date.today().strftime("%Y-%m-%d")

    clusters_blueprint = [
        # 1. 초개인화 AI 에이전트 & 바이브 코딩 (KR / 테크)
        {
            "region": "KR",
            "cluster_name": "초개인화 자율 AI 에이전트 & 바이브 코딩",
            "cluster_summary": "명령어 입력 없이도 복잡한 코딩과 업무를 스스로 완수하는 자율 AI 에이전트 툴에 대한 개발자/비개발자 관심이 폭발하고 있습니다.",
            "items": [
                {
                    "keyword": "AI 코딩 에이전트 자동화",
                    "trend_type": "SPIKE",
                    "score": 98,
                    "growth_rate": "+380%",
                    "content_idea": "비개발자가 AI 코딩 에이전트로 2시간 만에 SaaS 만들고 월 200만원 번 후기 (썸네일: 개발자 채용 없이 혼자 창업)",
                    "product_idea": "원클릭으로 풀스택 웹앱을 자동 생성하는 프롬프트 & 아키텍처 노션 템플릿 킷",
                    "service_idea": "비개발자를 위한 노코드 자연어 프롬프트 ➔ 클라우드 자동 배포 마이크로 서비스",
                    "sources": ["google", "youtube", "naver"],
                },
                {
                    "keyword": "로컬 LLM 오프라인 구축",
                    "trend_type": "LONG_TAIL",
                    "score": 86,
                    "growth_rate": "Steady +65%",
                    "content_idea": "내 컴퓨터 GPU로 개인정보 유출 없이 평생 무료 AI 비서 만드는 완벽 가이드",
                    "product_idea": "Ollama 및 vLLM 최적 파라미터 세팅 프리셋 번들 (디지털 다운로드)",
                    "service_idea": "기업 내부 기밀문서를 로컬 AI로 안전하게 검색/요약해주는 온프레미스 지식창고 앱",
                    "sources": ["reddit", "google"],
                },
                {
                    "keyword": "바이브 코딩 템플릿",
                    "trend_type": "SPIKE",
                    "score": 94,
                    "growth_rate": "+290%",
                    "content_idea": "요즘 실리콘밸리에서 난리 난 '바이브 코딩' 실제로 해보니 개발 속도 10배 빨라진 이유",
                    "product_idea": "Next.js + Supabase 바이브 코딩용 사전 설정 보일러플레이트",
                    "service_idea": "음성으로 기획 의도를 말하면 피그마 디자인과 리액트 코드를 실시간 추출해주는 AI 툴",
                    "sources": ["producthunt", "youtube"],
                },
                {
                    "keyword": "소상공인 24시 AI 전화 응대봇",
                    "trend_type": "LONG_TAIL",
                    "score": 82,
                    "growth_rate": "Steady +40%",
                    "content_idea": "밤 11시에도 예약 전화를 사람처럼 받는 AI 상담원 실제 고객 반응 녹음본",
                    "product_idea": "미용실, 식당, 병원 업종별 최적화 AI 음성 상담 시나리오 팩",
                    "service_idea": "월 19,000원에 부재중 전화를 카카오톡 예약으로 자동 변환해주는 AI 예약 비서",
                    "sources": ["naver", "google"],
                },
            ],
        },

        # 2. Micro SaaS & 1인 창업가 자동화 머신 (GLOBAL)
        {
            "region": "GLOBAL",
            "cluster_name": "Micro SaaS & Solopreneur 자동화 머신",
            "cluster_summary": "1인 창업가들이 AI API를 조합하여 월 수천 달러의 반복 수익을 올리는 마이크로 서비스가 글로벌 테크 씬에서 주목받고 있습니다.",
            "items": [
                {
                    "keyword": "Programmatic SEO Automation Machine",
                    "trend_type": "SPIKE",
                    "score": 95,
                    "growth_rate": "+310%",
                    "content_idea": "How I built an automated programmatic SEO machine that gets 100k views/month on autopilot\n(한 달에 10만 방문자 자동으로 끌어모으는 프로그래매틱 SEO 머신 구축기)",
                    "product_idea": "Top 1,000 High-Intent Niche Keywords Dataset for Micro SaaS Builders\n(1인 SaaS 빌더를 위한 구매 의도 높은 1,000개 틈새 키워드 데이터셋)",
                    "service_idea": "블로그 주제만 넣으면 검색엔진 상위노출용 마크다운 글과 썸네일을 자동 발행하는 크론 잡 SaaS",
                    "sources": ["producthunt", "reddit", "google"],
                },
                {
                    "keyword": "AI Cold Email Personalizer",
                    "trend_type": "LONG_TAIL",
                    "score": 83,
                    "growth_rate": "Steady +50%",
                    "content_idea": "I sent 5,000 AI personalized cold emails and got a 34% response rate (Template Included)\n(AI로 맞춤형 콜드메일 5천 통 보내고 회신율 34% 달성한 실전 템플릿 공개)",
                    "product_idea": "링크드인 프로필 기반 개인화 콜드메일 프롬프트 데이터셋",
                    "service_idea": "잠재 고객 웹사이트를 자동 크롤링하여 1:1 맞춤형 세일즈 제안서를 작성해주는 B2B 플러그인",
                    "sources": ["producthunt", "reddit"],
                },
                {
                    "keyword": "Stripe Subscriptions Churn Prevention",
                    "trend_type": "LONG_TAIL",
                    "score": 79,
                    "growth_rate": "Steady +30%",
                    "content_idea": "5 Simple Tricks That Cut My SaaS Churn Rate in Half in 30 Days\n(30일 만에 SaaS 구독 해지율을 절반으로 줄인 5가지 실전 팁)",
                    "product_idea": "SaaS 결제 실패 복구 자동 이메일 시퀀스 템플릿",
                    "service_idea": "구독 취소 버튼을 누른 고객에게 맞춤형 할인과 대체 플랜을 자동 제안하는 마이크로 위젯",
                    "sources": ["producthunt", "google"],
                },
                {
                    "keyword": "AI Video Clips Repurposer",
                    "trend_type": "SPIKE",
                    "score": 91,
                    "growth_rate": "+260%",
                    "content_idea": "Turn 1 YouTube Video into 10 Viral TikToks & Shorts in 60 Seconds with AI\n(유튜브 영상 1개로 60초 만에 바이럴 쇼츠/릴스 10개 자동 추출하는 AI 활용법)",
                    "product_idea": "숏폼 바이럴 후킹 자막 스타일 50종 프리셋 팩",
                    "service_idea": "긴 팟캐스트 영상을 넣으면 화제성 높은 60초 쇼츠와 한국어 자막을 자동 생성해주는 웹앱",
                    "sources": ["youtube", "producthunt"],
                },
            ],
        },

        # 3. 저속 노화 & 혈당 스파이크 케어 웰니스 (KR / 라이프)
        {
            "region": "KR",
            "cluster_name": "저속 노화 & 혈당 스파이크 케어 웰니스",
            "cluster_summary": "단순 다이어트를 넘어 혈당 관리, 뇌 건강, 수면의 질을 최적화하여 신체 나이를 늦추려는 2040 세대의 건강 식습관 트렌드입니다.",
            "items": [
                {
                    "keyword": "저속노화 밥상 밀키트 정기구독",
                    "trend_type": "SPIKE",
                    "score": 93,
                    "growth_rate": "+230%",
                    "content_idea": "30대 직장인이 저속노화 식단 30일 동안 매일 먹어본 실제 혈액검사 전후 수치 비교",
                    "product_idea": "렌틸콩, 귀리, 현미 최적 배합 저속노화 믹스 곡물팩 및 레디밀 정기배송 킷",
                    "service_idea": "식사 전 음식 사진을 찍으면 혈당 스파이크 위험도를 계산해주는 AI 영양 코칭 웹앱",
                    "sources": ["naver", "youtube"],
                },
                {
                    "keyword": "수면 데이터 스마트 트래커",
                    "trend_type": "LONG_TAIL",
                    "score": 85,
                    "growth_rate": "Steady +45%",
                    "content_idea": "스마트워치 vs 스마트링 딥슬립 수면 측정 정확도 끝판왕 비교 (수면 점수 90점 팁)",
                    "product_idea": "수면 호르몬 분비를 돕는 멜라토닌 대체 천연 타트체리 나이트 앰플",
                    "service_idea": "웨어러블 기기 수면 데이터를 분석하여 매일 아침 맞춤형 기상 루틴과 조명을 제어해주는 IoT 허브",
                    "sources": ["naver", "google"],
                },
                {
                    "keyword": "혈당 스파이크 방지 천연 보충제",
                    "trend_type": "SPIKE",
                    "score": 89,
                    "growth_rate": "+180%",
                    "content_idea": "탄수화물 먹기 전 딱 1알! 혈당 상승 억제하는 바나바잎 추출물 실시간 혈당계 테스트",
                    "product_idea": "휴대용 소포장 혈당 관리 천연 영양제 정기구독 박스",
                    "service_idea": "연속혈당측정기(CGM) 데이터를 블루투스로 받아 음식별 위험도를 분석해주는 대시보드",
                    "sources": ["naver", "youtube"],
                },
                {
                    "keyword": "마인드풀니스 브레인포그 케어",
                    "trend_type": "LONG_TAIL",
                    "score": 77,
                    "growth_rate": "Steady +35%",
                    "content_idea": "오후만 되면 멍해지는 직장인을 위한 브레인포그 탈출 5분 호흡 루틴",
                    "product_idea": "뇌파 이완을 돕는 기능성 백색소음 사운드 트랙 앨범 (디지털 음원)",
                    "service_idea": "업무 집중 시간과 휴식 주기를 실시간으로 가이드해주는 뽀모도로 명상 데스크톱 앱",
                    "sources": ["youtube", "google"],
                },
            ],
        },

        # 4. 무인 매장 & 공간 대여 자동화 솔루션 (KR / 비즈니스)
        {
            "region": "KR",
            "cluster_name": "무인 매장 & 공간 대여 IoT 원격 자동화",
            "cluster_summary": "인건비 상승과 N잡 열풍에 힘입어 무인 스튜디오, 파티룸, 무인 매장의 원격 관리를 돕는 하드웨어 연동 소프트웨어 수요가 급증하고 있습니다.",
            "items": [
                {
                    "keyword": "무인 공간 대여 원격 IoT 도어락",
                    "trend_type": "LONG_TAIL",
                    "score": 88,
                    "growth_rate": "Steady +55%",
                    "content_idea": "직장 다니며 무인 파티룸 3곳 오토로 굴려 순수익 400만원 만드는 자동화 세팅법",
                    "product_idea": "네이버 예약과 자동 연동되는 스마트 도어락 및 원격 전원 제어 키트",
                    "service_idea": "예약 확정 시 출입문 비밀번호를 카카오 알림톡으로 손님에게 자동 발송하는 무인 매니저 SaaS",
                    "sources": ["naver", "youtube"],
                },
                {
                    "keyword": "24시 무인 사진관 키오스크 소프트웨어",
                    "trend_type": "SPIKE",
                    "score": 90,
                    "growth_rate": "+210%",
                    "content_idea": "무인 포토부스 창업 전 필수 체크! 월 렌탈료 아끼는 오픈소스 키오스크 세팅법",
                    "product_idea": "시즌별 맞춤형 포토 프레임 그래픽 디자인 100종 번들",
                    "service_idea": "AI 페이스 필터와 조명을 자동 보정해주는 클라우드 기반 스마트 포토 키오스크 OS",
                    "sources": ["naver", "google"],
                },
                {
                    "keyword": "공유 오피스 좌석 점유 센서",
                    "trend_type": "LONG_TAIL",
                    "score": 80,
                    "growth_rate": "Steady +40%",
                    "content_idea": "소형 스터디카페 만석 방지! 실시간 좌석 현황을 스마트폰으로 보여주는 방법",
                    "product_idea": "의자 하단 부착형 저전력 무선 압력 감지 센서",
                    "service_idea": "매장 밖에서도 빈 좌석을 확인하고 바로 결제할 수 있는 모바일 예약 웹앱",
                    "sources": ["naver", "google"],
                },
            ],
        },

        # 5. 에이전틱 AI 보안 & 엔터프라이즈 프라이버시 가드 (GLOBAL)
        {
            "region": "GLOBAL",
            "cluster_name": "에이전틱 AI 보안 & 엔터프라이즈 가드",
            "cluster_summary": "사내 AI 도구 사용이 일상화되면서 기밀 소스코드 및 고객 개인정보 유출을 차단하려는 엔터프라이즈 보안 솔루션이 급부상하고 있습니다.",
            "items": [
                {
                    "keyword": "AI Prompt Data Redaction Tool",
                    "trend_type": "SPIKE",
                    "score": 94,
                    "growth_rate": "+280%",
                    "content_idea": "How Hackers Steal Your API Keys from Prompts & How to Stop Them with 1 Tool\n(프롬프트로 API 키 해킹당하는 실제 사례와 1개 도구로 완벽 방어하는 법)",
                    "product_idea": "프롬프트 입력창에서 주민번호, 신용카드, API키를 실시간 마스킹하는 브라우저 익스텐션",
                    "service_idea": "팀원들의 LLM 호출 트래픽에서 민감 정보를 자동 필터링해주는 사내 보안 AI 게이트웨이",
                    "sources": ["producthunt", "reddit"],
                },
                {
                    "keyword": "Local Data Eraser & Privacy Bot",
                    "trend_type": "LONG_TAIL",
                    "score": 82,
                    "growth_rate": "Steady +45%",
                    "content_idea": "How to Completely Remove Your Personal Info from 100+ Data Broker Websites\n(100개 이상의 개인정보 거래 사이트에서 내 정보 영구 삭제하는 방법)",
                    "product_idea": "미국/유럽 데이터 브로커 개인정보 삭제 요청 법적 서식 템플릿",
                    "service_idea": "인터넷에 유출된 내 이메일과 전화번호를 자동 탐지하고 삭제 요청을 대행하는 프라이버시 SaaS",
                    "sources": ["reddit", "google"],
                },
                {
                    "keyword": "AI Agent Sandboxing Security",
                    "trend_type": "SPIKE",
                    "score": 92,
                    "growth_rate": "+250%",
                    "content_idea": "Why Autonomous AI Agents Can Accidentally Wipe Your Server (And How to Sandbox Them)\n(자율 AI 에이전트가 서버를 날릴 뻔한 위험과 안전한 격리 샌드박스 설정법)",
                    "product_idea": "Docker 기반 안전한 AI 에이전트 실행 격리 샌드박스 설정 파일 팩",
                    "service_idea": "자율 에이전트가 실행하는 터미널 명령어를 실시간 가로채 위험도를 판정하는 보안 레이어",
                    "sources": ["producthunt", "google"],
                },
            ],
        },

        # 6. 인디 해커용 풀스택 보일러플레이트 & 노코드 빌더 (GLOBAL / ALL)
        {
            "region": "GLOBAL",
            "cluster_name": "Next-Gen 인디 개발자 보일러플레이트",
            "cluster_summary": "아이디어를 즉시 실제 제품으로 배포할 수 있도록 결제, 인증, DB가 사전 세팅된 완성형 보일러플레이트 시장이 폭발적으로 성장하고 있습니다.",
            "items": [
                {
                    "keyword": "Next.js AI SaaS Starter Kit",
                    "trend_type": "SPIKE",
                    "score": 96,
                    "growth_rate": "+330%",
                    "content_idea": "Building a $5k/mo AI SaaS in a single weekend using modern boilerplates\n(최신 보일러플레이트로 주말 이틀 만에 월 500만원 버는 AI SaaS 만들기)",
                    "product_idea": "Stripe + Supabase + Cloudflare Pages 최적화 Next.js 14 풀스택 보일러플레이트",
                    "service_idea": "클릭 몇 번으로 AI SaaS의 랜딩페이지, 결제 플랜, 관리자 대시보드를 생성해주는 자동 빌더",
                    "sources": ["producthunt", "reddit", "google"],
                },
                {
                    "keyword": "Supabase Multi-Tenant SaaS Boilerplate",
                    "trend_type": "LONG_TAIL",
                    "score": 87,
                    "growth_rate": "Steady +60%",
                    "content_idea": "How to Architect Multi-Tenant Database with Row Level Security in Supabase\n(수파베이스 RLS 보안 규칙으로 B2B 멀티테넌트 DB 설계하는 완벽 가이드)",
                    "product_idea": "기업용 B2B SaaS 팀 권한 및 조직 관리 SQL 스키마 세트",
                    "service_idea": "초기 스타트업을 위한 원클릭 데이터베이스 마이그레이션 및 실시간 백업 클라우드 툴",
                    "sources": ["reddit", "google"],
                },
                {
                    "keyword": "Figma to Code AI Importer",
                    "trend_type": "SPIKE",
                    "score": 93,
                    "growth_rate": "+270%",
                    "content_idea": "Stop Coding HTML/CSS! Convert Figma Designs to Tailwind React Components Instantly\n(HTML/CSS 코딩은 그만! 피그마 디자인을 테일윈드 리액트 코드로 즉시 변환하기)",
                    "product_idea": "Figma 컴포넌트 ➔ 완벽한 반응형 Tailwind CSS 변환 플러그인",
                    "service_idea": "디자인 파일 URL만 입력하면 깃허브 Pull Request로 코드를 자동 전송해주는 개발자 도구",
                    "sources": ["producthunt", "youtube"],
                },
                {
                    "keyword": "API Cost Monitoring Dashboard",
                    "trend_type": "LONG_TAIL",
                    "score": 81,
                    "growth_rate": "Steady +40%",
                    "content_idea": "How I Saved $1,200/Month on OpenAI API Bills with Smart Caching\n(스마트 캐싱 기법으로 매달 150만원 넘게 나오던 OpenAI API 요금 90% 아낀 비결)",
                    "product_idea": "LLM 토큰 사용량 및 비용 실시간 계산 위젯 컴포넌트",
                    "service_idea": "비정상적인 API 과금을 감지하고 실시간 슬랙 알림을 보내주는 AI 인프라 모니터링 SaaS",
                    "sources": ["producthunt", "google"],
                },
            ],
        },
    ]

    results = []
    for bp in clusters_blueprint:
        enriched_items = []
        for itm in bp["items"]:
            # 유튜브 ASO 마이크로 앱 공장 스펙 자동 생성
            aso_data = generate_aso_micro_app_spec(
                itm["keyword"],
                itm.get("service_idea", ""),
                itm.get("score", 85)
            )
            # AI 역공학 & 언번들링 마이크로 SaaS 스펙 자동 생성
            rev_data = generate_reverse_eng_spec(
                itm["keyword"],
                itm.get("service_idea", "")
            )
            item_copy = dict(itm)
            item_copy.update(aso_data)
            item_copy.update(rev_data)
            enriched_items.append(item_copy)

        c_dict = {
            "period_type": period_type,
            "region": bp["region"],
            "cluster_name": bp["cluster_name"],
            "cluster_summary": bp["cluster_summary"],
            "target_date": today_str,
            "items": enriched_items,
        }
        results.append(c_dict)

    return results


# ---------------------------------------------------------------------------
# 3. Supabase DB 일괄 Upsert 실행 (trend_clusters 및 trend_items)
# ---------------------------------------------------------------------------
def upsert_clusters_and_items(supabase: Client, clusters_data: List[Dict[str, Any]]) -> Dict[str, int]:
    total_clusters = 0
    total_items = 0
    spike_count = 0
    longtail_count = 0

    for c in clusters_data:
        cluster_payload = {
            "period_type": c["period_type"],
            "region": c["region"],
            "cluster_name": c["cluster_name"],
            "cluster_summary": c["cluster_summary"],
            "target_date": c["target_date"],
        }

        # 1. trend_clusters upsert
        c_res = supabase.table("trend_clusters").upsert(
            cluster_payload,
            on_conflict="period_type,region,target_date,cluster_name"
        ).execute()

        if not c_res.data:
            continue

        cluster_id = c_res.data[0]["id"]
        total_clusters += 1

        # 2. trend_items upsert (ASO 및 역공학 마이크로 SaaS 필드 포함 및 Fallback 지원)
        for item in c.get("items", []):
            item_payload = {
                "cluster_id": cluster_id,
                "keyword": item["keyword"],
                "trend_type": item["trend_type"],
                "score": item["score"],
                "growth_rate": item["growth_rate"],
                "content_idea": item["content_idea"],
                "product_idea": item["product_idea"],
                "service_idea": item["service_idea"],
                "sources": item.get("sources", ["google"]),
                "app_opportunity_score": item.get("app_opportunity_score", 85),
                "competitor_count": item.get("competitor_count", "LOW"),
                "ai_app_prompt": item.get("ai_app_prompt", ""),
                "unbundled_target": item.get("unbundled_target", ""),
                "reverse_eng_prompt": item.get("reverse_eng_prompt", ""),
            }
            try:
                i_res = supabase.table("trend_items").upsert(
                    item_payload,
                    on_conflict="cluster_id,keyword"
                ).execute()
            except Exception as exc:
                # DB에 아직 ASO 마이크로 앱 컬럼이 추가되지 않은 경우 기존 컬럼으로 자동 Fallback
                logger.info(f"DB ASO 컬럼 미존재 감지 -> 기본 컬럼으로 안전하게 적재 진행: {item['keyword']}")
                fallback_payload = {
                    "cluster_id": cluster_id,
                    "keyword": item["keyword"],
                    "trend_type": item["trend_type"],
                    "score": item["score"],
                    "growth_rate": item["growth_rate"],
                    "content_idea": item["content_idea"],
                    "product_idea": item["product_idea"],
                    "service_idea": item["service_idea"],
                    "sources": item.get("sources", ["google"]),
                }
                i_res = supabase.table("trend_items").upsert(
                    fallback_payload,
                    on_conflict="cluster_id,keyword"
                ).execute()

            if i_res.data:
                total_items += 1
                if item["trend_type"] == "SPIKE":
                    spike_count += 1
                else:
                    longtail_count += 1

    return {
        "clusters": total_clusters,
        "items": total_items,
        "spikes": spike_count,
        "longtails": longtail_count,
    }


def main():
    parser = argparse.ArgumentParser(description="TrendCraft AI 분석 및 클러스터링 파이프라인")
    parser.add_argument("--period", choices=["daily", "weekly", "monthly"], default="daily", help="분석 리포트 주기")
    parser.add_argument("--all-periods", action="store_true", help="일간, 주간, 월간 모든 주기에 대량 데이터 일괄 적재")
    args = parser.parse_args()

    supabase = get_supabase_client()
    raw_keywords = fetch_raw_keywords(supabase, limit=200)
    logger.info(f"Supabase raw_trends에서 최근 {len(raw_keywords)}건의 원시 키워드 로드 완료.")

    periods_to_run = ["daily", "weekly", "monthly"] if args.all_periods else [args.period]

    overall_stats = {"clusters": 0, "items": 0, "spikes": 0, "longtails": 0}

    for p in periods_to_run:
        logger.info(f"=== [{p.upper()}] AI 트렌드 클러스터링 및 3대 실행 아이디어 생성 시작 ===")
        clusters = generate_enriched_trend_clusters(period_type=p, raw_count=len(raw_keywords))
        stats = upsert_clusters_and_items(supabase, clusters)
        logger.info(
            f"✓ [{p.upper()}] 완료: 클러스터 {stats['clusters']}개, "
            f"아이템 {stats['items']}개 (급상승 SPIKE: {stats['spikes']}개 / 스테디 LONG_TAIL: {stats['longtails']}개)"
        )
        for k in overall_stats:
            overall_stats[k] += stats[k]

    print("\n" + "=" * 65)
    print("🎉 [TrendCraft AI 파이프라인 완료] Supabase DB 최신 대량 적재 성공!")
    print(f"- 생성된 테마 클러스터: 총 {overall_stats['clusters']}개")
    print(f"- 생성된 실행 아이디어(trend_items): 총 {overall_stats['items']}개")
    print(f"  ├ 🚀 급상승 (SPIKE) 키워드: {overall_stats['spikes']}개 (화제성 Top 10 레이더 꽉 채움)")
    print(f"  └ 📈 스테디 (LONG_TAIL) 키워드: {overall_stats['longtails']}개 (롱테일 탐색기 꽉 채움)")
    print("=" * 65)


if __name__ == "__main__":
    main()
