-- =============================================================================
-- Migration: Add V/S Outlier & Channel Subscribers Fields to marketing_lab_posts
-- 설명: 유튜브 얼굴 없는 채널(Faceless) 및 구독자 대비 조회수 폭발(V/S Outlier) 지표 추가
-- =============================================================================

ALTER TABLE public.marketing_lab_posts 
ADD COLUMN IF NOT EXISTS channel_subscribers BIGINT DEFAULT 0;

ALTER TABLE public.marketing_lab_posts 
ADD COLUMN IF NOT EXISTS outlier_multiplier TEXT DEFAULT '';

COMMENT ON COLUMN public.marketing_lab_posts.channel_subscribers IS '채널 구독자 수 (중소/하꼬 채널 발굴용)';
COMMENT ON COLUMN public.marketing_lab_posts.outlier_multiplier IS '구독자 대비 조회수 배율 떡상 지표 (예: 구독자 대비 8.4배 떡상)';
