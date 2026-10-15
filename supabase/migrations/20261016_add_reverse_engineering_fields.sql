-- =============================================================================
-- Migration: Add Reverse Engineering & Unbundling Micro SaaS Fields
-- 설명: AI 역공학(Reverse Engineering) 및 거대 공룡 SaaS 언번들링 트렌드 필드 추가
-- =============================================================================

ALTER TABLE public.trend_items 
ADD COLUMN IF NOT EXISTS unbundled_target TEXT;

ALTER TABLE public.trend_items 
ADD COLUMN IF NOT EXISTS reverse_eng_prompt TEXT;

COMMENT ON COLUMN public.trend_items.unbundled_target IS '역공학/언번들링 대상 거대 서비스 (예: Notion 데이터베이스, Canva AI 지우개, Adobe PDF 등)';
COMMENT ON COLUMN public.trend_items.reverse_eng_prompt IS 'Claude Code, Cursor, REA 기반 초경량 마이크로 SaaS 클론 프로토타입 원클릭 개발 프롬프트';
