# TrendCraft 배포 및 유지비 0원(Free-Tier) 상시 운영 가이드

## 1. 아키텍처 및 환경 변수 설정 (Cloudflare Pages + Supabase + GitHub Actions)

### (1) Supabase 프로젝트 세팅 및 키 확인
1. [Supabase Dashboard](https://supabase.com/dashboard)에서 새 프로젝트를 생성합니다 (Free Plan: 500MB DB, 무제한 API 요청).
2. 좌측 메뉴 **SQL Editor**로 이동하여 `supabase/schema.sql` 전체 스크립트를 붙여넣고 **Run**을 클릭합니다.
3. **Project Settings > API** 메뉴에서 다음 3가지 값을 복사합니다:
   - `Project URL` (`https://xxxx.supabase.co`)
   - `anon` `public` 키 (프론트엔드 조회 전용, RLS에 의해 `SELECT`만 허용됨)
   - `service_role` `secret` 키 (GitHub Actions 파이프라인 전용, RLS 우회 및 Upsert 허용)

### (2) GitHub Actions Secrets 등록 (배치 파이프라인용)
GitHub 저장소의 **Settings > Secrets and variables > Actions > New repository secret**에 다음 시크릿을 등록합니다:

| Secret 이름 | 설명 및 발급처 | 필수 여부 |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Supabase 프로젝트 URL | 필수 |
| `SUPABASE_KEY` | Supabase **`service_role`** Secret Key (DB 적재용) | 필수 |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/) 무료 발급 API 키 (`gemini-2.5-flash`) | 필수 |
| `NAVER_CLIENT_ID` | [네이버 개발자 센터](https://developers.naver.com/) 데이터랩/쇼핑인사이트 Client ID | 선택 (권장) |
| `NAVER_CLIENT_SECRET` | 네이버 개발자 센터 Client Secret | 선택 (권장) |
| `YOUTUBE_API_KEY` | Google Cloud Console YouTube Data API v3 키 | 선택 (권장) |

### (3) Cloudflare Pages 연동 및 환경 변수 설정 (프론트엔드 배포)
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages > Create application > Pages > Connect to Git**을 선택하고 저장소를 연결합니다.
2. 빌드 설정(Build settings)을 다음과 같이 구성합니다:
   - **Framework preset**: `Next.js` (또는 정적 Export 시 `Next.js (Static HTML Export)`)
   - **Root directory**: `frontend`
   - **Build command**: `npx @cloudflare/next-on-pages` (또는 `npm run build`)
   - **Build output directory**: `.vercel/output/static` (정적 Export 시 `out`)
3. **Environment variables (Production & Preview)** 섹션에 다음 변수를 등록합니다:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://xxxx.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOi...` (`anon` 공개 키만 입력! 절대 `service_role` 키를 프론트엔드에 넣지 마세요)
   - `NODE_VERSION` = `20`

---

## 2. 비용 0원으로 상시 자동 운영하기 위한 유지보수 체크리스트

### 체크리스트 1: Supabase 무료 플랜 7일 미사용 일시중지(Auto-Pause) 방지
- **이슈**: Supabase Free 플랜은 7일간 DB 활동이 없으면 프로젝트가 자동으로 일시 중지(Pause)됩니다.
- **해결 완료**: `.github/workflows/pipeline.yml`의 Daily Cron Job이 매일 오전 6시(KST)마다 `raw_trends` 및 `trend_clusters`에 데이터를 Insert/Upsert하므로 별도의 핑 서버 없이도 **영구적으로 일시 중지가 방지**됩니다.

### 체크리스트 2: Supabase 500MB 스토리지 한도 초과 방지
- **이슈**: 매일 수백 건의 원시 키워드(`raw_trends`)가 누적되면 장기 운영 시 500MB 용량에 도달할 수 있습니다.
- **해결 완료**: `schema.sql`에 포함된 `cleanup_old_raw_trends(retention_days := 30)` 스토어드 함수가 `collector.py` 실행 시마다 자동 호출되어 30일이 지난 원시 로그를 삭제합니다. 정제된 `trend_clusters`와 `trend_items`만 영구 보존하므로 연간 20MB 미만으로 유지됩니다.

### 체크리스트 3: Gemini 2.5 Flash 무료 API 할당량(Rate Limit) 최적화
- **이슈**: Google AI Studio 무료 티어는 분당 요청 수(RPM) 및 일일 요청 수(RPD) 제한이 존재합니다.
- **해결 완료**: 키워드마다 개별 API를 호출하지 않고, `analyzer.py`에서 수집된 키워드 뭉치 전체를 **단 1회의 배치 프롬프트 + Pydantic `response_schema`**로 묶어 처리합니다. 하루 API 호출 횟수가 1~3회에 불과하여 무료 한도의 1% 미만만 소모합니다.

### 체크리스트 4: GitHub Actions 무료 실행 시간(월 2,000분) 및 크론 비활성화 관리
- **이슈**: Public 저장소는 GitHub Actions가 완전 무료(무제한)이며, Private 저장소도 월 2,000분이 무료 제공됩니다. 단, 60일간 커밋 활동이 없으면 GitHub가 Scheduled Workflow를 자동 비활성화할 수 있습니다.
- **운영 팁**: 파이프라인 실행 시간은 1회당 약 25~40초(월간 총 20분 내외)로 무료 한도 내에서 여유롭게 동작합니다. 60일 비활성화 알림 이메일 수신 시 Actions 탭에서 **Enable workflow** 버튼만 1회 클릭해 주면 됩니다.
