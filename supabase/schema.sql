-- =============================================================================
-- TrendCraft: PostgreSQL Schema for Supabase (100% Free-Tier Optimized)
-- Includes: Extensions, Tables, Constraints, Indexes, RLS Policies,
--           500MB Free-Tier Storage Guard (Retention Function), and Seed Data
-- =============================================================================

-- 1. 필수 확장 모듈 활성화
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. 기존 테이블 초기화 (필요 시 주석 해제)
-- DROP TABLE IF EXISTS public.trend_items CASCADE;
-- DROP TABLE IF EXISTS public.trend_clusters CASCADE;
-- DROP TABLE IF EXISTS public.raw_trends CASCADE;

-- =============================================================================
-- [Table 1] raw_trends: 외부 채널에서 원시 수집된 키워드 데이터
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.raw_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source TEXT NOT NULL CHECK (source IN ('naver', 'youtube', 'google', 'reddit', 'producthunt')),
    region TEXT NOT NULL CHECK (region IN ('KR', 'GLOBAL')),
    keyword TEXT NOT NULL,
    rank INT NOT NULL CHECK (rank > 0),
    traffic_volume TEXT DEFAULT 'N/A',
    collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.raw_trends IS '외부 채널(네이버, 유튜브, 구글, 레딧, 프로덕트헌트) 원시 수집 트렌드 키워드';

-- raw_trends 인덱스 (수집 일시 및 지역/소스별 조회 최적화)
CREATE INDEX IF NOT EXISTS idx_raw_trends_collected_at ON public.raw_trends (collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_trends_source_region ON public.raw_trends (source, region, collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_raw_trends_keyword_trgm ON public.raw_trends USING gin (keyword gin_trgm_ops);

-- =============================================================================
-- [Table 2] trend_clusters: AI가 기간별/지역별로 군집화한 메인 테마
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.trend_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
    region TEXT NOT NULL CHECK (region IN ('KR', 'GLOBAL', 'ALL')),
    cluster_name TEXT NOT NULL,
    cluster_summary TEXT NOT NULL,
    target_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_cluster_period_region_date_name UNIQUE (period_type, region, target_date, cluster_name)
);

COMMENT ON TABLE public.trend_clusters IS 'Gemini AI가 기간별/지역별로 클러스터링한 핵심 트렌드 테마';

-- trend_clusters 인덱스 (대시보드 상단 필터: 주기 + 지역 + 날짜 복합 인덱스)
CREATE INDEX IF NOT EXISTS idx_trend_clusters_filter 
    ON public.trend_clusters (period_type, region, target_date DESC);
CREATE INDEX IF NOT EXISTS idx_trend_clusters_target_date 
    ON public.trend_clusters (target_date DESC);

-- =============================================================================
-- [Table 3] trend_items: 정제된 키워드 및 실행 아이디어 상세
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.trend_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID NOT NULL REFERENCES public.trend_clusters(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    trend_type TEXT NOT NULL CHECK (trend_type IN ('SPIKE', 'LONG_TAIL')),
    score INT NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    growth_rate TEXT NOT NULL DEFAULT '+0%',
    content_idea TEXT NOT NULL,
    product_idea TEXT NOT NULL,
    service_idea TEXT NOT NULL,
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    app_opportunity_score INT DEFAULT 75 CHECK (app_opportunity_score >= 1 AND app_opportunity_score <= 100),
    competitor_count TEXT DEFAULT 'LOW' CHECK (competitor_count IN ('LOW', 'MID', 'HIGH')),
    ai_app_prompt TEXT,
    unbundled_target TEXT,
    reverse_eng_prompt TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_cluster_keyword UNIQUE (cluster_id, keyword)
);

COMMENT ON TABLE public.trend_items IS '클러스터별 정제 키워드 및 3대 실행 아이디어(콘텐츠, 상품, 서비스)';

-- trend_items 인덱스 (클러스터 조인, 급상승/롱테일 분리, 점수 정렬, JSONB 및 키워드 검색 최적화)
CREATE INDEX IF NOT EXISTS idx_trend_items_cluster_id ON public.trend_items (cluster_id);
CREATE INDEX IF NOT EXISTS idx_trend_items_type_score ON public.trend_items (trend_type, score DESC);
CREATE INDEX IF NOT EXISTS idx_trend_items_keyword_trgm ON public.trend_items USING gin (keyword gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_trend_items_sources_gin ON public.trend_items USING gin (sources);

-- =============================================================================
-- Row Level Security (RLS) 정책 설정
-- - 프론트엔드(anon, authenticated)는 읽기(SELECT)만 허용
-- - 데이터 파이프라인(service_role)은 모든 쓰기/수정/삭제 권한 보유
-- =============================================================================
ALTER TABLE public.raw_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_items ENABLE ROW LEVEL SECURITY;

-- 1) Public Read Policies (누구나 대시보드에서 조회 가능)
DROP POLICY IF EXISTS "Allow public read access on raw_trends" ON public.raw_trends;
CREATE POLICY "Allow public read access on raw_trends"
    ON public.raw_trends FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow public read access on trend_clusters" ON public.trend_clusters;
CREATE POLICY "Allow public read access on trend_clusters"
    ON public.trend_clusters FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow public read access on trend_items" ON public.trend_items;
CREATE POLICY "Allow public read access on trend_items"
    ON public.trend_items FOR SELECT
    TO anon, authenticated
    USING (true);

-- 2) Service Role Write Policies (GitHub Actions 배치 파이프라인 전용)
DROP POLICY IF EXISTS "Allow service_role full access on raw_trends" ON public.raw_trends;
CREATE POLICY "Allow service_role full access on raw_trends"
    ON public.raw_trends FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access on trend_clusters" ON public.trend_clusters;
CREATE POLICY "Allow service_role full access on trend_clusters"
    ON public.trend_clusters FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access on trend_items" ON public.trend_items;
CREATE POLICY "Allow service_role full access on trend_items"
    ON public.trend_items FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- [유지비 0원 가드] 500MB 무료 DB 용량 관리용 자동 정리 함수 (RPC 호출 가능)
-- 원시 데이터(raw_trends)는 30일 경과 시 자동 삭제하여 용량 포화 방지
-- =============================================================================
CREATE OR REPLACE FUNCTION public.cleanup_old_raw_trends(retention_days INT DEFAULT 30)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count INT;
BEGIN
    DELETE FROM public.raw_trends
    WHERE collected_at < NOW() - (retention_days || ' days')::INTERVAL;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;
