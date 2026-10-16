-- ============================================================================
-- TrendCraft: [마케팅 연구소 (Marketing Lab)] Supabase DB Schema & Seed Data
-- File: supabase/marketing_lab_schema.sql
-- Description:
--   1. marketing_lab_posts : 7대 SNS 채널별 성공 공식 분해(Deconstruct) 데이터 테이블
--   2. marketing_lab_ideas : 크로스오버 재창조(Synthesize) 및 내 아이디어 보관함 테이블
-- ============================================================================

-- UUID 생성 확장 활성화
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. 마케팅 연구용 SNS 게시글 분석 테이블 (marketing_lab_posts)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketing_lab_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel TEXT NOT NULL CHECK (
        channel IN (
            'youtube',      -- 유튜브 (YouTube)
            'naver_blog',   -- 네이버 블로그 (Naver Blog)
            'seo_blog',     -- 워드프레스/구글 블로그 (SEO Blog)
            'instagram',    -- 인스타그램 (Instagram)
            'threads',      -- 쓰레드 (Threads)
            'x',            -- X (Twitter)
            'facebook'      -- 페이스북 (Facebook)
        )
    ),
    viral_type TEXT NOT NULL CHECK (
        viral_type IN (
            'spike',        -- 급상승 떡상 (단기 폭발형)
            'steady',       -- 꾸준한 바이럴 (지속 확산형)
            'long_tail'     -- 롱테일 (검색 유입 스테디셀러형)
        )
    ),
    title TEXT NOT NULL,                              -- 포스팅 제목 / 대표 헤드라인
    hook_copy TEXT NOT NULL,                          -- 초반 3초 / 첫 문장 후킹 카피
    author_name TEXT NOT NULL,                        -- 크리에이터 / 채널명
    source_url TEXT,                                  -- 원본 게시물 참조 URL
    views_count BIGINT NOT NULL DEFAULT 0,            -- 조회수 / 도달수
    likes_count INTEGER NOT NULL DEFAULT 0,           -- 좋아요 / 공감수
    comments_count INTEGER NOT NULL DEFAULT 0,        -- 댓글 / 토론수
    shares_count INTEGER NOT NULL DEFAULT 0,          -- 공유 / 저장 / 리포스트수
    engagement_rate NUMERIC(5, 2) NOT NULL DEFAULT 0, -- 반응 폭발 지수 (Engagement Rate %)
    growth_velocity TEXT NOT NULL,                    -- 폭발 속도 지표 (예: '+1,480% / 24h')
    keywords TEXT[] NOT NULL DEFAULT '{}',            -- 해시태그 및 핵심 SEO 키워드 배열

    -- AI 성공 요인 3줄 분해 (왜 터졌을까?)
    ai_hook_point TEXT NOT NULL,                      -- [1] 후킹 포인트 분석
    ai_visual_structure TEXT NOT NULL,                -- [2] 썸네일 / 비주얼 / 본문 구조 분석
    ai_comment_trigger TEXT NOT NULL,                 -- [3] 댓글 / 공유 / 체류시간 유도 장치

    -- 우측 연구 워크스페이스 연동을 위한 추천 크로스오버 블루프린트 (JSONB)
    crossover_blueprints JSONB NOT NULL DEFAULT '[]'::jsonb,

    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스 생성 (채널별, 바이럴 타입별 필터링 및 반응도 정렬 최적화)
CREATE INDEX IF NOT EXISTS idx_marketing_lab_posts_channel
    ON public.marketing_lab_posts (channel);

CREATE INDEX IF NOT EXISTS idx_marketing_lab_posts_viral_type
    ON public.marketing_lab_posts (viral_type);

CREATE INDEX IF NOT EXISTS idx_marketing_lab_posts_channel_viral
    ON public.marketing_lab_posts (channel, viral_type, engagement_rate DESC);

-- ----------------------------------------------------------------------------
-- 2. 나만의 크로스오버 재창조 & 아이디어 보관함 테이블 (marketing_lab_ideas)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.marketing_lab_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_post_id UUID REFERENCES public.marketing_lab_posts(id) ON DELETE SET NULL,
    source_channel TEXT NOT NULL CHECK (
        source_channel IN ('youtube', 'naver_blog', 'seo_blog', 'instagram', 'threads', 'x', 'facebook')
    ),
    target_channel TEXT NOT NULL CHECK (
        target_channel IN ('youtube', 'naver_blog', 'seo_blog', 'instagram', 'threads', 'x', 'facebook')
    ),
    fusion_topic TEXT NOT NULL,                       -- 융합할 내 브랜드 / 소재 / 아이템
    cross_media_strategy TEXT NOT NULL,               -- [AI 제안 1] 크로스 미디어 이식 공식
    custom_title TEXT NOT NULL,                       -- [AI 제안 2] 신규 기획: 제목 / 후킹 카피
    custom_thumbnail_concept TEXT NOT NULL,           -- [AI 제안 2] 신규 기획: 썸네일 / 비주얼 연출
    content_outline TEXT NOT NULL,                    -- [AI 제안 2] 신규 기획: 전개 구조 (도입-전개-전환)
    memo TEXT NOT NULL DEFAULT '',                    -- [AI 제안 3] 마케터 연구 메모 & 추가 액션 플랜
    tags TEXT[] NOT NULL DEFAULT '{}',                -- 커스텀 태그 배열
    is_pinned BOOLEAN NOT NULL DEFAULT false,         -- 중요 아이디어 상단 고정 여부
    status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN ('draft', 'ready', 'published')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_marketing_lab_ideas_created_at
    ON public.marketing_lab_ideas (is_pinned DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_marketing_lab_ideas_target_channel
    ON public.marketing_lab_ideas (target_channel);

-- updated_at 자동 갱신 트리거 함수
CREATE OR REPLACE FUNCTION public.update_marketing_lab_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_marketing_lab_ideas_updated_at ON public.marketing_lab_ideas;
CREATE TRIGGER trg_marketing_lab_ideas_updated_at
    BEFORE UPDATE ON public.marketing_lab_ideas
    FOR EACH ROW
    EXECUTE FUNCTION public.update_marketing_lab_updated_at();

-- ----------------------------------------------------------------------------
-- 3. Row Level Security (RLS) 정책 설정
-- ----------------------------------------------------------------------------
ALTER TABLE public.marketing_lab_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_lab_ideas ENABLE ROW LEVEL SECURITY;

-- 대시보드 조회 및 연구 저장이 즉시 동작하도록 공개/익명 접근 허용 정책 구성
-- (멀티 테넌트 인증 도입 시 auth.uid() 조건으로 확장 가능)
DROP POLICY IF EXISTS "Allow public read on marketing_lab_posts" ON public.marketing_lab_posts;
CREATE POLICY "Allow public read on marketing_lab_posts"
    ON public.marketing_lab_posts
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public insert on marketing_lab_posts" ON public.marketing_lab_posts;
CREATE POLICY "Allow public insert on marketing_lab_posts"
    ON public.marketing_lab_posts
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public all on marketing_lab_ideas" ON public.marketing_lab_ideas;
CREATE POLICY "Allow public all on marketing_lab_ideas"
    ON public.marketing_lab_ideas
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 4. 초기 시드 데이터 (7대 SNS 채널 × 바이럴 유형 대표 성공 사례)
-- ----------------------------------------------------------------------------
INSERT INTO public.marketing_lab_posts (
    channel, viral_type, title, hook_copy, author_name, source_url,
    views_count, likes_count, comments_count, shares_count, engagement_rate, growth_velocity,
    keywords, ai_hook_point, ai_visual_structure, ai_comment_trigger
) VALUES
-- [1] YouTube (유튜브)
(
    'youtube',
    'spike',
    '월급 250만원 직장인이 퇴근 후 하루 40분으로 자동화 수익 파이프라인 만든 현실 과정 (엑셀 템플릿 공개)',
    '“아직도 부업을 시간 갈아 넣어 하시나요? 제가 지난 6개월간 직접 깨지며 만든 노코드 자동화 시트, 오늘 조건 없이 다 풉니다.”',
    '디지털노마드 연구소',
    'https://youtube.com',
    942000, 48200, 6410, 19300, 14.85, '+1,640% (48h 내 급상승 1위)',
    ARRAY['#직장인부업', '#노코드자동화', '#파이프라인', '#생산성툴', '#유튜브떡상공식'],
    '구체적인 숫자(월급 250만원, 하루 40분, 6개월)와 손실 회피 심리(“아직도 시간 갈아 넣어 하시나요?”)를 결합해 초반 5초 이탈률을 12% 이하로 방어함.',
    '좌측에 붉은색 마이너스 통장 잔고, 우측에 초록색 입금 알림 대시보드를 배치한 고대비 분할 썸네일 + 노란색 4단어 핵심 카피(“하루 40분 자동화”)로 모바일 시인성 극대화.',
    '고정 댓글에 “본인의 현재 직무와 하루 가용 시간을 남겨주시면 맞춤형 자동화 루틴 PDF와 시트 사본 링크를 보내드립니다”라는 가치 교환형 콜투액션(CTA) 배치.'
),
(
    'youtube',
    'steady',
    '비전공자 마케터가 AI 에이전트 3개로 주간 리포트 시간을 8시간에서 15분으로 줄인 실전 워크플로우',
    '“챗GPT한테 그냥 요약해달라고 하면 100% 실패합니다. 실무자가 바로 보고서에 복붙하는 프롬프트 체이닝 3단계입니다.”',
    '그로스해킹 아카이브',
    'https://youtube.com',
    385000, 21900, 1840, 11200, 9.60, '주간 평균 +4.5만 조회수 지속 유입',
    ARRAY['#AI마케팅', '#업무자동화', '#프롬프트엔지니어링', '#마케터실무', '#생산성'],
    '흔한 통념(“그냥 요약 시키기”)을 부정하며 시작해 기존 AI 활용에 실망했던 실무자 층의 호기심을 즉각 자극함.',
    '화면 녹화 70% + 발표자 PIP 30% 구도로 신뢰도를 높이고, 챕터별 타임스탬프와 Before/After 소요 시간 타이머 그래픽을 상단에 고정 배치함.',
    '“여러분 팀에서 가장 시간 많이 잡아먹는 반복 업무 1가지는 무엇인가요? 댓글 최다 득표 업무를 다음 영상에서 자동화해 드립니다”로 차기 기획과 댓글 참여를 동시 달성.'
),
(
    'youtube',
    'long_tail',
    '2026 구글 애널리틱스 GA4 이벤트 트래킹 & 전환 퍼널 세팅 바이블 (초보자 1시간 마스터)',
    '“이 영상 하나만 북마크해 두세요. 외주 대행사에 150만원 주고 맡기던 GA4 전환 세팅을 60분 만에 직접 끝내드립니다.”',
    '데이터마케팅 스쿨',
    'https://youtube.com',
    218000, 14300, 920, 16800, 11.20, '유튜브 검색 1위 11개월 연속 유지',
    ARRAY['#GA4세팅', '#구글애널리틱스', '#퍼포먼스마케팅', '#전환추적', '#GTM가이드'],
    '외주 비용(150만원)이라는 명확한 금전적 대체 가치를 제시하여 시청을 곧 비용 절감으로 인식하게 만듦.',
    '단계별 체크리스트 오버레이와 확대 하이라이트 줌(Zoom-in) 편집을 활용해 따라 하기 쉬운 튜토리얼 UX를 구현, 평균 시청 지속 시간 24분 기록.',
    '영상 설명란에 타임라인별 오류 해결 Q&A 인덱스를 제공하고 “막히는 구간 타임코드를 댓글로 달아주시면 24시간 내 답변드립니다”로 검색 가중치 상승.'
),

-- [2] Naver Blog (네이버 블로그)
(
    'naver_blog',
    'spike',
    '성수동 팝업스토어 오픈 3일 만에 대기줄 400명 만든 로컬 바이럴 체크리스트 5가지 (현장 사진有)',
    '“광고비 3,000만원 태우고도 파리 날리는 팝업과 오픈런 2시간 대기줄 만드는 팝업은 딱 ‘입구 동선 3미터’에서 갈립니다.”',
    '브랜드 디렉터 제이',
    'https://section.blog.naver.com',
    124000, 3420, 890, 4120, 13.40, '스마트블록 상단 노출 후 일 조회수 +890% 폭발',
    ARRAY['#성수동팝업', '#팝업스토어기획', '#오프라인마케팅', '#브랜드마케팅', '#공간기획'],
    '구체적 지역명(성수동) + 압도적 수치(대기줄 400명) + 의외의 핵심 원인(입구 동선 3미터)으로 스마트블록 클릭률(CTR)을 압도함.',
    '직접 촬영한 현장 동선 도식화 이미지 8장과 3줄 요약 인용구 블록을 교차 배치하여 모바일 스크롤 피로도를 낮추고 체류시간 4분 30초 달성.',
    '포스팅 하단에 “팝업 오픈 전 필수 점검 엑셀 시트(32개 항목)가 필요하신 분은 공감+비밀댓글로 이메일 남겨주세요” 장치로 댓글 890개 돌파.'
),
(
    'naver_blog',
    'long_tail',
    '스마트스토어 상세페이지 전환율 1.2%에서 6.8%로 끌어올린 첫 화면 GIF 배치 공식 완벽 정리',
    '“상세페이지 맨 위에 브랜드 철학부터 적고 계신가요? 고객은 2.5초 안에 내 문제가 해결되는지만 보고 뒤로가기를 누릅니다.”',
    '이커머스 연금술사',
    'https://section.blog.naver.com',
    189000, 5120, 1120, 6840, 10.85, '네이버 검색 월간 1.6만 유입 스테디셀러',
    ARRAY['#스마트스토어상세페이지', '#전환율높이는법', '#상세페이지기획', '#셀러꿀팁', '#GIF활용'],
    '셀러들의 가장 흔한 실수(브랜드 철학 나열)를 찌르고 구체적인 전환율 상승 수치(1.2% → 6.8%)를 제목 전면에 내세움.',
    '잘된 상세페이지 vs 망한 상세페이지 와이어프레임 비교 표와 GIF 용량 최적화 가이드를 소제목(H2/H3) 구조로 일목요연하게 정리.',
    '“현재 운영 중인 스토어 카테고리를 댓글로 남겨주시면 해당 업종에 가장 잘 먹히는 첫 화면 후킹 문구 3가지를 추천해 드립니다”로 진성 셀러 소통 유도.'
),

-- [3] SEO Blog (워드프레스/구글 블로그)
(
    'seo_blog',
    'long_tail',
    '2026 B2B SaaS 리드 제너레이션 퍼널 벤치마크 리포트: 콜드메일 대신 오가닉 검색으로 월 400건 문의 만든 구조',
    '“콜드메일 오픈율이 3% 미만으로 떨어진 지금, 구매 의도가 명확한 B2B 의사결정권자를 데려오는 유일한 자산은 ‘비교형 프로그래매틱 SEO’입니다.”',
    'Growth Engine Lab',
    'https://google.com',
    312000, 4200, 640, 9450, 12.10, '구글 스니펫(Featured Snippet) 14개 키워드 동시 점유',
    ARRAY['#B2BSaaS', '#프로그래매틱SEO', '#리드제너레이션', '#콘텐츠마케팅', '#구글상위노출'],
    '콜드메일의 하락세라는 시장 페인포인트를 데이터로 짚어내고 ‘비교형 프로그래매틱 SEO’라는 명확한 대안 솔루션을 제시함.',
    '목차(TOC) 스키마 마크업, 핵심 지표 요약 테이블, 인터랙티브 ROI 계산기 위젯을 본문 상단에 배치해 구글 Core Web Vitals 및 체류시간 점수를 극대화.',
    '본문 중간(Mid-roll)과 하단에 ‘SaaS 비교 랜딩페이지 HTML/Notion 와이어프레임 키트’ 뉴스레터 구독 폼을 결합해 이메일 전환율 8.4% 기록.'
),
(
    'seo_blog',
    'steady',
    '검색엔진과 AI 답변엔진(GEO)에 동시에 인용되는 아티클 구조화 작성법 7단계',
    '“이제 구글 1페이지 노출만으로는 부족합니다. Perplexity와 ChatGPT 검색이 가장 먼저 인용하는 문장 구조에는 명확한 패턴이 있습니다.”',
    'NextSEO Archive',
    'https://google.com',
    145000, 2890, 410, 5600, 9.75, '백링크 340개 자연 획득 및 오가닉 트래픽 월 +38% 성장',
    ARRAY['#GEO최적화', '#AI검색최적화', '#테크니컬SEO', '#워드프레스블로그', '#콘텐츠구조화'],
    'SEO에서 GEO(Generative Engine Optimization)로의 패러다임 전환을 선점하여 마케터와 블로거들의 북마크 심리를 자극함.',
    '질문형 H2 헤더 + 45단어 이내의 정의형 첫 문단 + JSON-LD FAQ 스키마 코드 블록을 세트로 제공하여 즉시 복사해 쓸 수 있도록 구성.',
    '아티클 하단 디스커스(Disqus) 토론창에 “본인 사이트의 도메인 점수와 주력 키워드를 남기면 GEO 인용 가능성을 진단해 드립니다” 이벤트 운영.'
),

-- [4] Instagram (인스타그램)
(
    'instagram',
    'spike',
    '[릴스 240만뷰] 카피라이터가 올리브영 매대에서 무조건 집어 들게 만드는 한 줄 문구 법칙 4가지',
    '“같은 비타민 세럼인데 왜 왼쪽 제품만 품절될까요? 패키지에 적힌 ‘이 단어’ 하나 차이입니다.”',
    '@copy_alchemy',
    'https://instagram.com',
    2410000, 118000, 4320, 89400, 16.90, '업로드 12시간 만에 저장수 5만 회 돌파',
    ARRAY['#카피라이팅', '#릴스떡상', '#브랜딩전략', '#올리브영마케팅', '#마케터그램'],
    '누구나 익숙한 공간(올리브영 매대)에서 벌어지는 품절 현상을 시각적 비교로 보여주며 1.5초 만에 스크롤을 멈추게 함.',
    '0~2초 현장 매대 클로즈업 훅 → 3~12초 빠른 컷 편집(1.2초 간격)과 화면 중앙 강조형 캡션 → 마지막 2초 핵심 요약 리스트를 빠르게 지나가게 해 일시정지/재시청 유도.',
    '“캡션에 업종별 금지 단어 30개와 대체 표현 사전을 정리해 뒀습니다. 나중에 쓰려면 무조건 [저장]부터 누르고 친구 태그하세요!”로 저장률 3.7% 달성.'
),
(
    'instagram',
    'steady',
    '[카드뉴스] 1인 브랜드가 광고비 0원으로 진성 팬 1만 명 모으는 인스타그램 프로필 깔때기 설계도',
    '“릴스가 백만 뷰 터져도 팔로우로 안 이어진다면? 프로필 소개글 3줄이 손님을 쫓아내고 있기 때문입니다.”',
    '@solo_brand_lab',
    'https://instagram.com',
    460000, 31200, 1950, 42100, 15.40, '저장 대비 공유 비율 1:1.3으로 지속 확산 중',
    ARRAY['#인스타그램브랜딩', '#1인기업', '#프로필꾸미기', '#콘텐츠마케팅', '#퍼스널브랜딩'],
    '조회수는 높지만 팔로워가 늘지 않는 크리에이터들의 가장 아픈 지점을 첫 장 카피로 정확히 타격함.',
    '1장(강렬한 타이포 훅) → 2~5장(잘못된 예시 X vs 고전환 예시 O 직관적 도식) → 6~8장(빈칸 채우기 템플릿) → 9장(저장 유도 요약표) 9장 완결형 캐러셀.',
    '“댓글에 ‘프로필’ 세 글자만 남겨주시면 DM으로 노션 프로필 진단 시트를 즉시 자동 발송해 드립니다(매니챗 연동)”로 댓글 1,950개 폭발.'
),

-- [5] Threads (쓰레드)
(
    'threads',
    'spike',
    '마케팅 대행사 7년 차가 클라이언트 미팅에서 절대 쓰지 않는 말 5가지 (타래로 이어집니다 🧵)',
    '“클라이언트한테 ‘요즘 젠지(Gen-Z)들이 좋아해요’라고 말하는 순간, 그 제안서는 바로 쓰레기통으로 갑니다.”',
    '@agency_insider_kr',
    'https://threads.net',
    680000, 29400, 3820, 14900, 15.80, '업로드 6시간 만에 리포스트 8,000회 및 인용 토론 폭발',
    ARRAY['#쓰레드마케팅', '#대행사실무', '#제안서작성', '#B2B영업', '#카피라이팅'],
    '업계의 흔한 클리셰(‘요즘 젠지들이 좋아해요’)를 강하게 비판하는 반직관적 첫 문장으로 마케터·대표들의 시선을 강탈함.',
    '첫 게시물은 단 2문장으로 여백을 살리고, 이어지는 댓글 타래(Thread)에 1번부터 5번까지 짧은 호흡의 대체 화법을 구조화하여 마지막 타래까지 완독 유도.',
    '마지막 타래에 “현업에서 들었던 가장 황당한 마케팅 피드백이나 유행어는 무엇이었나요?”라는 열린 질문을 던져 3,800개 이상의 경험담 댓글 릴레이 형성.'
),

-- [6] X (Twitter)
(
    'x',
    'spike',
    '사이드 프로젝트 런칭 첫날 결제 120건 만든 랜딩페이지 히어로 섹션 A/B 테스트 결과 공유',
    '“기능 설명을 전부 지우고 고객이 겪는 ‘짜증 나는 순간’ 하나만 적었더니 결제 전환율이 1.4%에서 5.9%로 뛰었습니다. 실제 화면 비교 타래👇”',
    '@indie_maker_seo',
    'https://x.com',
    820000, 19800, 1140, 15600, 13.95, '북마크 2.4만 회 돌파 및 테크/스타트업 커뮤니티 확산',
    ARRAY['#인디해커', '#랜딩페이지', '#AB테스트', '#스타트업마케팅', '#전환율최적화'],
    '실제 매출/결제 건수(120건)와 전환율 변화(1.4% → 5.9%)를 첫 트윗에 압축 제시해 북마크 욕구를 즉각 자극함.',
    '트윗 상단에 Before/After 랜딩페이지 스크린샷 2장을 나란히 첨부하고, 빨간색 화살표 어노테이션으로 변경된 카피 위치를 직관적으로 표시함.',
    '“현재 만들고 계신 프로덕트의 한 줄 소개와 타깃 고객을 멘션으로 남겨주시면 히어로 섹션 카피를 무료로 리라이팅해 드립니다”로 실시간 인용 알티(RT) 폭발.'
),

-- [7] Facebook (페이스북)
(
    'facebook',
    'steady',
    '3040 직장인 타깃 건기식 브랜드가 메타(Meta) 광고 ROAS 420% 방어한 ‘네이티브 스토리텔링’ 소재 공식',
    '“화려한 스튜디오 촬영 컷보다 스마트폰 메모장 캡처 한 장이 클릭률 3.2배 더 높게 나왔습니다. 왜 그럴까요?”',
    '퍼포먼스 마케팅 랩',
    'https://facebook.com',
    295000, 8400, 1620, 6300, 11.45, '마케팅 실무자 그룹 24곳에 공유되며 3주 연속 인기글 유지',
    ARRAY['#메타광고', '#퍼포먼스마케팅', '#ROAS개선', '#광고소재기획', '#스토리텔링'],
    '고비용 스튜디오 촬영 vs 스마트폰 메모장 캡처라는 극명한 대비를 통해 광고 피로도에 지친 마케터들의 고정관념을 깨뜨림.',
    '첫 번째 이미지는 실제 아이폰 메모장 UI에 적힌 진솔한 후기 캡처, 두 번째부터는 광고 관리자 CTR/CPC 실제 성과 그래프를 배치해 신뢰도 확보.',
    '“메타 광고 효율이 떨어질 때 여러분이 가장 먼저 바꾸는 요소는 무엇인가요? (1. 썸네일 2. 첫 문장 3. 타깃팅) 댓글로 번호와 이유를 공유해 주세요!”로 투표형 댓글 유도.'
);

-- 초기 아이디어 보관함 샘플 데이터 2건
INSERT INTO public.marketing_lab_ideas (
    source_channel, target_channel, fusion_topic,
    cross_media_strategy, custom_title, custom_thumbnail_concept, content_outline,
    memo, tags, is_pinned, status
) VALUES
(
    'instagram',
    'naver_blog',
    '프리미엄 데스크테리어 조명 브랜드 런칭 캠페인',
    '인스타그램 릴스 240만뷰 사례의 [1.5초 비교 훅 + 금지 단어 대조법]을 네이버 블로그 스마트블록 상위노출용 [비교 분석형 롱폼 리뷰]로 이식합니다. 초반 3줄에서 일반 스탠드와 눈 피로도 차이를 직관적 GIF로 대조해 이탈을 막고 체류시간 4분 이상을 확보합니다.',
    '하루 8시간 모니터 보는 직장인이 데스크 조명 바꿨더니 눈 시림 사라진 이유 (일반 LED vs 시력보호 조명 3종 실측 비교)',
    '좌측: 어두운 방 모니터 반사광으로 눈 찌푸린 사진 (붉은색 X) / 우측: 비대칭 스크린바로 깔끔하게 정돈된 데스크 셋업 (초록색 O + 조도계 수치 오버레이)',
    '1. [후킹 도입] 퇴근 후 눈이 침침한 이유가 모니터가 아니라 조명 각도 때문이라는 충격 사실 제시\n2. [시각적 비교] 스마트폰 슬로우모션으로 찍은 플리커 현상 GIF 2종 비교\n3. [핵심 근거] 색온도(4000K)와 연색성(Ra95) 실측 표 정리\n4. [댓글/전환 유도] 내 책상 가로 사이즈 댓글 남기면 맞춤 설치 가이드 PDF 증정',
    '이번 주 금요일 스마트블록 발행 예정. 촬영 시 아이폰 슬로우모션 플리커 비교 컷 필수 확보할 것!',
    ARRAY['#데스크테리어', '#스마트블록이식', '#릴스공식활용'],
    true,
    'ready'
),
(
    'youtube',
    'threads',
    'AI 마케팅 자동화 SaaS 초기 유저 확보',
    '유튜브 94만뷰 사례의 [구체적 시간 절감 수치 + 조건 없는 시트 무료 배포] 공식을 쓰레드(Threads)의 [반직관적 첫 문장 + 5단 타래(Thread) + 댓글 자동 DM] 포맷으로 압축 이식합니다.',
    '마케터가 주간 보고서 쓰는 데 3시간 넘게 걸린다면 성실한 게 아니라 도구가 틀린 겁니다 (실제 15분 컷 자동화 타래 🧵)',
    '텍스트 중심 2문장 첫 게시물 + 두 번째 타래에 Before(8시간) vs After(15분) 노션/슬랙 자동 알림 짧은 5초 화면 녹화 GIF 첨부',
    '1. [본문 첫 트윗] 통념 파괴 후킹 2문장 + 타래 예고\n2. [타래 1~3] 광고 데이터 수집 → AI 요약 → 슬랙 발송 3단계 핵심 프롬프트 공개\n3. [타래 4] 실제 절감된 팀 리소스 수치 증명\n4. [타래 5 CTA] 댓글에 "자동화" 남기면 노코드 템플릿 링크 즉시 공유',
    '화요일 오전 8시 30분 출근 시간대 업로드 테스트 예정.',
    ARRAY['#쓰레드타래', '#B2B리드젠', '#유튜브공식이식'],
    false,
    'draft'
);
