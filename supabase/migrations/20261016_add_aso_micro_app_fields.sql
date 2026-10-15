-- =============================================================================
-- Migration: Add ASO Micro App Factory Fields to trend_items
-- 설명: 유튜브 ASO 마이크로 앱 공장 전략(검색어 선정 -> 2시간 컷 AI 앱 빌드)을 위한 컬럼 추가
-- =============================================================================

ALTER TABLE public.trend_items 
ADD COLUMN IF NOT EXISTS app_opportunity_score INT DEFAULT 75 CHECK (app_opportunity_score >= 1 AND app_opportunity_score <= 100);

ALTER TABLE public.trend_items 
ADD COLUMN IF NOT EXISTS competitor_count TEXT DEFAULT 'LOW' CHECK (competitor_count IN ('LOW', 'MID', 'HIGH'));

ALTER TABLE public.trend_items 
ADD COLUMN IF NOT EXISTS ai_app_prompt TEXT;

COMMENT ON COLUMN public.trend_items.app_opportunity_score IS 'ASO 앱스토어 진입 기회 점수 (1~100점)';
COMMENT ON COLUMN public.trend_items.competitor_count IS '앱스토어 내 경쟁 강도 (LOW: 빈집 틈새 / MID: 해볼만함 / HIGH: 대형 경쟁사 존재)';
COMMENT ON COLUMN public.trend_items.ai_app_prompt IS 'Claude Code, Cursor 등 AI 코딩 툴에 즉시 붙여넣는 2시간 컷 One-Click 개발 지시 프롬프트';
