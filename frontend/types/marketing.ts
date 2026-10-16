// ============================================================================
// TrendCraft: [마케팅 연구소 (Marketing Lab)] TypeScript Type Definitions
// File: frontend/types/marketing.ts
// ============================================================================

/** 메인 헤더 대메뉴 탭 식별자 */
export type MainNavTab = 'trend_intelligence' | 'marketing_lab';

/** 마케팅 연구소 내부 7대 SNS 서브 채널 식별자 */
export type SnsChannel =
  | 'youtube'      // 유튜브 (YouTube)
  | 'naver_blog'   // 네이버 블로그 (Naver Blog)
  | 'seo_blog'     // 워드프레스/구글 블로그 (SEO Blog)
  | 'instagram'    // 인스타그램 (Instagram)
  | 'threads'      // 쓰레드 (Threads)
  | 'x'            // X (Twitter)
  | 'facebook';    // 페이스북 (Facebook)

/** 좌측 '공부 (Deconstruct)' 바이럴 패턴 필터 식별자 */
export type ViralPattern =
  | 'all'          // 전체 보기
  | 'spike'        // 급상승 떡상 (단기 폭발형)
  | 'steady'       // 꾸준한 바이럴 (지속 확산형)
  | 'long_tail';   // 롱테일 (검색 유입 스테디셀러형)

/** DB 저장용 실제 바이럴 타입 ('all' 제외) */
export type PostViralType = Exclude<ViralPattern, 'all'>;

/** 7대 SNS 채널 메타데이터 인터페이스 */
export interface SnsChannelMeta {
  id: SnsChannel;
  label: string;
  shortLabel: string;
  englishName: string;
  badgeColor: string;
  activeBorder: string;
  accentGradient: string;
  algorithmFocus: string;
  keyFormat: string;
}

/** 바이럴 패턴 필터 메타데이터 인터페이스 */
export interface ViralPatternMeta {
  id: ViralPattern;
  label: string;
  subLabel: string;
  badgeStyle: string;
  description: string;
}

/** AI 성공 요인 3줄 분해 구조체 (왜 터졌을까?) */
export interface AiDeconstructBreakdown {
  hookPoint: string;        // 1) 후킹 포인트 (초반 이탈 방어 & 클릭 유도 장치)
  visualStructure: string;  // 2) 썸네일 / 비주얼 / 본문 레이아웃 구조
  commentTrigger: string;   // 3) 댓글 / 공유 / 저장 유도 장치
}

/** 좌측 '공부 (Deconstruct)'용 SNS 성공 사례 게시글 모델 (Supabase marketing_lab_posts 매핑) */
export interface MarketingLabPost {
  id: string;
  channel: SnsChannel;
  viral_type: PostViralType;
  title: string;
  hook_copy: string;
  author_name: string;
  source_url?: string | null;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  engagement_rate: number;
  growth_velocity: string;
  keywords: string[];
  ai_hook_point: string;
  ai_visual_structure: string;
  ai_comment_trigger: string;
  published_at: string;
  created_at?: string;
}

/** 우측 '연구 (Synthesize)' AI 크로스오버 생성 결과 구조체 */
export interface SynthesizedBlueprint {
  sourcePostId: string;
  sourceChannel: SnsChannel;
  targetChannel: SnsChannel;
  fusionTopic: string;
  /** 1) 크로스 미디어 이식 가이드 */
  crossMediaStrategy: {
    formulaName: string;
    adaptationSteps: string[];
    algorithmTip: string;
  };
  /** 2) 신규 콘텐츠 / 상품 기획 제안 */
  newContentPlan: {
    customTitle: string;
    hookVariation: string;
    thumbnailConcept: string;
    structureOutline: string[];
    commentCtaDevice: string;
  };
}

/** 우측 '메모 & 아이디어 보관함' 저장 모델 (Supabase marketing_lab_ideas 매핑) */
export interface MarketingLabIdea {
  id: string;
  source_post_id?: string | null;
  source_channel: SnsChannel;
  target_channel: SnsChannel;
  fusion_topic: string;
  cross_media_strategy: string;
  custom_title: string;
  custom_thumbnail_concept: string;
  content_outline: string;
  memo: string;
  tags: string[];
  is_pinned: boolean;
  status: 'draft' | 'ready' | 'published';
  created_at: string;
  updated_at?: string;
}

/** 새 아이디어 생성 요청 페이로드 타입 */
export type CreateMarketingIdeaPayload = Omit<
  MarketingLabIdea,
  'id' | 'created_at' | 'updated_at'
>;

/** 7대 SNS 채널 상수 정의 */
export const SNS_CHANNELS: SnsChannelMeta[] = [
  {
    id: 'youtube',
    label: '유튜브 (YouTube)',
    shortLabel: '유튜브',
    englishName: 'YouTube',
    badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    activeBorder: 'border-rose-500 bg-rose-500/10 text-rose-300',
    accentGradient: 'from-rose-500 to-orange-500',
    algorithmFocus: '클릭률(CTR) × 초반 30초 시청 지속시간 × 고정댓글 대화량',
    keyFormat: '롱폼 영상 & 쇼츠 (썸네일 분할 대비 + 5초 문제제기 훅)',
  },
  {
    id: 'naver_blog',
    label: '네이버 블로그 (Naver Blog)',
    shortLabel: '네이버 블로그',
    englishName: 'Naver Blog',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    activeBorder: 'border-emerald-500 bg-emerald-500/10 text-emerald-300',
    accentGradient: 'from-emerald-500 to-teal-500',
    algorithmFocus: '스마트블록 의도 매칭(DIA+) × 체류시간(3분+) × 공감·비밀댓글',
    keyFormat: '스마트블록 맞춤형 리뷰/가이드 (초반 3줄 요약 + 직접 찍은 GIF/도표)',
  },
  {
    id: 'seo_blog',
    label: '워드프레스/구글 블로그 (SEO Blog)',
    shortLabel: 'SEO 블로그',
    englishName: 'SEO Blog',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    activeBorder: 'border-blue-500 bg-blue-500/10 text-blue-300',
    accentGradient: 'from-blue-500 to-cyan-500',
    algorithmFocus: '구글 스니펫(Featured Snippet) & AI 답변엔진(GEO) 구조화 인용',
    keyFormat: '심층 아티클 & 비교 리포트 (H2 질문형 헤더 + 비교표 + 리드 마그넷)',
  },
  {
    id: 'instagram',
    label: '인스타그램 (Instagram)',
    shortLabel: '인스타그램',
    englishName: 'Instagram',
    badgeColor: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    activeBorder: 'border-pink-500 bg-pink-500/10 text-pink-300',
    accentGradient: 'from-pink-500 via-purple-500 to-amber-500',
    algorithmFocus: '1.5초 스크롤 스톱률 × 재시청(Loop) × 저장(Save) 및 DM 공유수',
    keyFormat: '릴스 & 캐러셀 카드뉴스 (시각적 대비 훅 + 캡션 키워드 자동 DM)',
  },
  {
    id: 'threads',
    label: '쓰레드 (Threads)',
    shortLabel: '쓰레드',
    englishName: 'Threads',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    activeBorder: 'border-purple-400 bg-purple-500/10 text-purple-200',
    accentGradient: 'from-purple-500 to-indigo-500',
    algorithmFocus: '첫 2문장 반직관적 훅 × 타래(Thread) 완독률 × 인용/답글 토론열기',
    keyFormat: '텍스트 타래(Thread) 연재 (통념 파괴 첫 문장 + 5단 실무 팁 + 열린 질문)',
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    shortLabel: 'X (Twitter)',
    englishName: 'X (Twitter)',
    badgeColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    activeBorder: 'border-sky-500 bg-sky-500/10 text-sky-300',
    accentGradient: 'from-sky-500 to-blue-600',
    algorithmFocus: '북마크(Bookmark) 비율 × 인용 알티(Quote RT) × 시각적 증명 이미지',
    keyFormat: '단문 인사이트 & 빌드인퍼블릭 타래 (Before/After 수치 증명 + 스크린샷)',
  },
  {
    id: 'facebook',
    label: '페이스북 (Facebook)',
    shortLabel: '페이스북',
    englishName: 'Facebook',
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    activeBorder: 'border-indigo-500 bg-indigo-500/10 text-indigo-300',
    accentGradient: 'from-indigo-500 to-blue-500',
    algorithmFocus: '네이티브 스토리텔링 몰입도 × 커뮤니티/그룹 공유 × 번호 선택형 댓글',
    keyFormat: '네이티브 스토리형 카드 & 메타 광고 소재 (메모장/실제 후기 캡처 + 투표형 질문)',
  },
];

/** 3대 바이럴 필터 상수 정의 */
export const VIRAL_PATTERNS: ViralPatternMeta[] = [
  {
    id: 'all',
    label: '전체 패턴',
    subLabel: 'All Patterns',
    badgeStyle: 'bg-slate-800 text-slate-300 border-slate-700',
    description: '모든 바이럴 성장 곡선 사례를 한눈에 비교합니다.',
  },
  {
    id: 'spike',
    label: '🔥 급상승 떡상 (Spike)',
    subLabel: '24~72h 단기 폭발',
    badgeStyle: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    description: '알고리즘 추천 피드를 타고 단기간에 조회수와 공유가 폭발한 콘텐츠',
  },
  {
    id: 'steady',
    label: '📈 꾸준한 바이럴 (Steady)',
    subLabel: '지속 확산·공유형',
    badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    description: '저장·공유·커뮤니티 회자를 통해 수주간 반응이 꺾이지 않는 콘텐츠',
  },
  {
    id: 'long_tail',
    label: '🌲 롱테일 (Long-tail)',
    subLabel: '검색 유입 스테디셀러',
    badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    description: '명확한 검색 의도(SEO/스마트블록)를 선점해 수개월간 리드를 만드는 자산형 콘텐츠',
  },
];
