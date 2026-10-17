'use client';

// ============================================================================
// TrendCraft: [마케팅 연구소 (Marketing Lab)] 메인 프론트엔드 컴포넌트
// File: frontend/components/MarketingLab.tsx
// Stack: Next.js (App Router) + Tailwind CSS + Lucide Icons + Supabase
// ============================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FlaskConical,
  Flame,
  TrendingUp,
  Compass,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Bookmark,
  Trash2,
  Pin,
  Search,
  RefreshCw,
  Layers,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Lightbulb,
  LayoutTemplate,
  MessageCircleQuestion,
  Database,
  Plus,
  ExternalLink,
  CheckCircle2,
  Wand2,
  FileText,
  Tag,
  ChevronRight,
  SlidersHorizontal,
  Image as ImageIcon,
  Clock,
  AlignLeft,
  Type,
  Target,
  Cpu,
} from 'lucide-react';

import {
  SnsChannel,
  ViralPattern,
  PostViralType,
  MarketingLabPost,
  MarketingLabIdea,
  ChannelSpecificBlueprint,
  UniqueSnsFormula,
  RecommendedTargetChannel,
  TitleKeywordPlacement,
  SNS_CHANNELS,
  VIRAL_PATTERNS,
} from '../types/marketing';

// ----------------------------------------------------------------------------
// Supabase REST 연동 헬퍼 (환경변수 설정 시 실제 DB 연동, 미설정 시 내장 시드 폴백)
// 프로젝트에서 @supabase/supabase-js 클라이언트를 직접 주입할 수도 있습니다.
// ----------------------------------------------------------------------------
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const IS_SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

async function supabaseRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  if (!IS_SUPABASE_CONFIGURED) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
        ...(options.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`Supabase HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    console.warn('[MarketingLab] Supabase 연동 폴백 모드 전환:', error);
    return null;
  }
}

// ----------------------------------------------------------------------------
// 원문 링크(URL) 상세 페이지 유효성 검증 헬퍼
// 단순 메인 도메인(https://youtube.com 등)이나 빈값, 가상 파라미터는 비활성화 처리
// ----------------------------------------------------------------------------
export function isValidDetailSourceUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || trimmed.startsWith('javascript:')) return false;

  // 단순 메인 홈페이지 도메인인 경우 상세 링크가 아님
  const mainDomainPatterns = [
    /^https?:\/\/(www\.)?youtube\.com\/?$/i,
    /^https?:\/\/youtu\.be\/?$/i,
    /^https?:\/\/section\.blog\.naver\.com\/?$/i,
    /^https?:\/\/blog\.naver\.com\/?$/i,
    /^https?:\/\/(www\.)?instagram\.com\/?$/i,
    /^https?:\/\/(www\.)?threads\.net\/?$/i,
    /^https?:\/\/(www\.)?x\.com\/?$/i,
    /^https?:\/\/(www\.)?twitter\.com\/?$/i,
    /^https?:\/\/(www\.)?facebook\.com\/?$/i,
  ];
  if (mainDomainPatterns.some((pattern) => pattern.test(trimmed))) {
    return false;
  }

  // sample_ 또는 dummy 가상 파라미터 포함 여부
  if (trimmed.includes('sample_') || trimmed.includes('.example.com')) {
    return false;
  }

  return true;
}

// ----------------------------------------------------------------------------
// 초기 내장 시드 데이터 (7대 SNS 채널 × 3대 바이럴 유형 대표 레퍼런스)
// ----------------------------------------------------------------------------
export const INITIAL_MARKETING_POSTS: MarketingLabPost[] = [
  // 1. YouTube
  {
    id: 'post-yt-1',
    channel: 'youtube',
    viral_type: 'spike',
    title:
      '월급 250만원 직장인이 퇴근 후 하루 40분으로 자동화 수익 파이프라인 만든 현실 과정 (엑셀 템플릿 공개)',
    hook_copy:
      '“아직도 부업을 시간 갈아 넣어 하시나요? 제가 지난 6개월간 직접 깨지며 만든 노코드 자동화 시트, 오늘 조건 없이 다 풉니다.”',
    author_name: '디지털노마드 연구소',
    source_url: 'https://www.youtube.com/watch?v=kccbN1_q58k',
    views_count: 942000,
    likes_count: 48200,
    comments_count: 6410,
    shares_count: 19300,
    engagement_rate: 14.85,
    growth_velocity: '+1,640% (48h 내 급상승 1위)',
    keywords: ['#직장인부업', '#노코드자동화', '#파이프라인', '#생산성툴', '#유튜브떡상공식'],
    title_keyword_placement: 'middle',
    title_hook_type: '수치 충격 + 현실 손실 회피형',
    image_count_info: '썸네일 1장 · 화면 도식표 6장',
    char_count: 3820,
    content_duration_or_slides: '영상 14분 32초',
    unique_sns_formula: {
      title: '유튜브 고대비 썸네일 × 초반 30초 결핍 타격 공식',
      coreMetric: '초반 30초 시청 지속시간(68%+) × 고정댓글 템플릿 신청률',
      strategy:
        '썸네일 좌우 극명한 적자 vs 흑자 분할 대비로 CTR 12% 달성 ➔ 인트로에서 시간 낭비 부업 통념을 깨뜨려 이탈 방어 ➔ 고정댓글에 엑셀 시트 링크를 배포하며 댓글 참여 폭발 유도.',
    },
    recommended_targets: [
      {
        targetChannel: 'naver_blog',
        channelName: '네이버 블로그',
        reason:
          '유튜브 롱폼의 단계별 엑셀 화면을 네이버의 스마트블록용 Before & After 비교 GIF로 전환 시 체류시간 4분 이상을 안정적으로 확보할 수 있습니다.',
      },
      {
        targetChannel: 'threads',
        channelName: '쓰레드',
        reason:
          '퇴근 후 직장인 부업이라는 대중적 공감 소재를 5단 텍스트 타래(Thread)로 압축 배포 시 리포스트와 실시간 토론 대화가 폭발합니다.',
      },
    ],
    ai_hook_point:
      '구체적인 숫자(월급 250만원, 하루 40분, 6개월)와 손실 회피 심리(“아직도 시간 갈아 넣어 하시나요?”)를 결합해 초반 5초 이탈률을 12% 이하로 방어함.',
    ai_visual_structure:
      '좌측에 붉은색 마이너스 통장 잔고, 우측에 초록색 입금 알림 대시보드를 배치한 고대비 분할 썸네일 + 노란색 4단어 핵심 카피(“하루 40분 자동화”)로 모바일 시인성 극대화.',
    ai_comment_trigger:
      '고정 댓글에 “본인의 현재 직무와 하루 가용 시간을 남겨주시면 맞춤형 자동화 루틴 PDF와 시트 사본 링크를 보내드립니다”라는 가치 교환형 콜투액션(CTA) 배치.',
    published_at: '2026-10-14T09:00:00Z',
  },
  {
    id: 'post-yt-2',
    channel: 'youtube',
    viral_type: 'steady',
    title:
      '비전공자 마케터가 AI 에이전트 3개로 주간 리포트 시간을 8시간에서 15분으로 줄인 실전 워크플로우',
    hook_copy:
      '“챗GPT한테 그냥 요약해달라고 하면 100% 실패합니다. 실무자가 바로 보고서에 복붙하는 프롬프트 체이닝 3단계입니다.”',
    author_name: '그로스해킹 아카이브',
    source_url: 'https://www.youtube.com/watch?v=jgpJVI3t_CE',
    views_count: 385000,
    likes_count: 21900,
    comments_count: 1840,
    shares_count: 11200,
    engagement_rate: 9.6,
    growth_velocity: '주간 평균 +4.5만 조회수 지속 유입',
    keywords: ['#AI마케팅', '#업무자동화', '#프롬프트엔지니어링', '#마케터실무', '#생산성'],
    title_keyword_placement: 'front',
    title_hook_type: '통념 파괴 + 시간 극단 절감형',
    image_count_info: '화면 녹화 컷 8개 · 프롬프트 예시표 3장',
    char_count: 2950,
    content_duration_or_slides: '영상 11분 15초',
    unique_sns_formula: {
      title: '유튜브 실무 프롬프트 체이닝 튜토리얼 공식',
      coreMetric: '평균 시청시간 8분+ × 더보기란 프롬프트 복사 타임코드 클릭률',
      strategy:
        '“그냥 요약시키면 실패한다”는 통념 반박으로 시작해 전문성을 입증하고, Before 8시간 vs After 15분 타이머 그래픽을 화면 상단에 고정하여 완독을 견인함.',
    },
    recommended_targets: [
      {
        targetChannel: 'x',
        channelName: 'X (Twitter)',
        reason:
          '프롬프트 체이닝 전후 캡처와 수치 비교(8시간➔15분)는 X 테크/스타트업 커뮤니티에서 리트윗 및 북마크 1순위로 확산되는 검증된 포맷입니다.',
      },
      {
        targetChannel: 'seo_blog',
        channelName: 'SEO 블로그',
        reason:
          '프롬프트 복붙 템플릿과 단계별 아키텍처는 구글 Featured Snippet 및 Perplexity AI 답변 인용에 최적화된 고부가가치 자산입니다.',
      },
    ],
    ai_hook_point:
      '흔한 통념(“그냥 요약 시키기”)을 부정하며 시작해 기존 AI 활용에 실망했던 실무자 층의 호기심을 즉각 자극함.',
    ai_visual_structure:
      '화면 녹화 70% + 발표자 PIP 30% 구도로 신뢰도를 높이고, 챕터별 타임스탬프와 Before/After 소요 시간 타이머 그래픽을 상단에 고정 배치함.',
    ai_comment_trigger:
      '“여러분 팀에서 가장 시간 많이 잡아먹는 반복 업무 1가지는 무엇인가요? 댓글 최다 득표 업무를 다음 영상에서 자동화해 드립니다”로 차기 기획과 댓글 참여를 동시 달성.',
    published_at: '2026-10-10T12:00:00Z',
  },
  {
    id: 'post-yt-3',
    channel: 'youtube',
    viral_type: 'long_tail',
    title:
      '2026 구글 애널리틱스 GA4 이벤트 트래킹 & 전환 퍼널 세팅 바이블 (초보자 1시간 마스터)',
    hook_copy:
      '“이 영상 하나만 북마크해 두세요. 외주 대행사에 150만원 주고 맡기던 GA4 전환 세팅을 60분 만에 직접 끝내드립니다.”',
    author_name: '데이터마케팅 스쿨',
    source_url: 'https://www.youtube.com/watch?v=o04_O3iR9e0',
    views_count: 218000,
    likes_count: 14300,
    comments_count: 920,
    shares_count: 16800,
    engagement_rate: 11.2,
    growth_velocity: '유튜브 검색 1위 11개월 연속 유지',
    keywords: ['#GA4세팅', '#구글애널리틱스', '#퍼포먼스마케팅', '#전환추적', '#GTM가이드'],
    title_keyword_placement: 'front',
    title_hook_type: '금전적 대체 가치 제시형 (150만원 절약)',
    image_count_info: 'GTM 설정 화면 14장 · 이벤트 매핑 표 4장',
    char_count: 4500,
    content_duration_or_slides: '영상 58분 풀마스터',
    unique_sns_formula: {
      title: '유튜브 롱테일 검색 1위 튜토리얼 공식',
      coreMetric: '유튜브 검색 유입률(82%) × 타임스탬프 챕터 완독률',
      strategy:
        '외주 비용 150만원을 60분 만에 절감해 준다는 명확한 금전적 앵커링을 제시해 긴 영상임에도 북마크와 반복 시청을 유도함.',
    },
    recommended_targets: [
      {
        targetChannel: 'seo_blog',
        channelName: 'SEO 블로그',
        reason:
          'GA4 이벤트 트래킹은 연중 지속 검색되는 대표 롱테일 키워드로, H2/H3 구조화 아티클로 발행 시 구글 상위노출 1위를 수년간 장악할 수 있습니다.',
      },
      {
        targetChannel: 'naver_blog',
        channelName: '네이버 블로그',
        reason:
          '초보 셀러/소상공인을 타깃으로 설정 단계별 화면 캡처 중심 네이버 블로그 스마트블록 가이드로 변환하면 체류시간과 북마크가 극대화됩니다.',
      },
    ],
    ai_hook_point:
      '외주 비용(150만원)이라는 명확한 금전적 대체 가치를 제시하여 시청을 곧 비용 절감으로 인식하게 만듦.',
    ai_visual_structure:
      '단계별 체크리스트 오버레이와 확대 하이라이트 줌(Zoom-in) 편집을 활용해 따라 하기 쉬운 튜토리얼 UX를 구현, 평균 시청 지속 시간 24분 기록.',
    ai_comment_trigger:
      '영상 설명란에 타임라인별 오류 해결 Q&A 인덱스를 제공하고 “막히는 구간 타임코드를 댓글로 달아주시면 24시간 내 답변드립니다”로 검색 가중치 상승.',
    published_at: '2026-09-20T08:30:00Z',
  },

  // 2. Naver Blog
  {
    id: 'post-nb-1',
    channel: 'naver_blog',
    viral_type: 'spike',
    title:
      '성수동 팝업스토어 오픈 3일 만에 대기줄 400명 만든 로컬 바이럴 체크리스트 5가지 (현장 사진有)',
    hook_copy:
      '“광고비 3,000만원 태우고도 파리 날리는 팝업과 오픈런 2시간 대기줄 만드는 팝업은 딱 ‘입구 동선 3미터’에서 갈립니다.”',
    author_name: '브랜드 디렉터 제이',
    source_url: 'https://blog.naver.com/naver_diary/223298471204',
    views_count: 124000,
    likes_count: 3420,
    comments_count: 890,
    shares_count: 4120,
    engagement_rate: 13.4,
    growth_velocity: '스마트블록 상단 노출 후 일 조회수 +890% 폭발',
    keywords: ['#성수동팝업', '#팝업스토어기획', '#오프라인마케팅', '#브랜드마케팅', '#공간기획'],
    title_keyword_placement: 'front',
    title_hook_type: '지역명 + 군중 심리 (대기줄 400명) + 의외의 원인',
    image_count_info: '현장 실사 사진 18장 · 동선 GIF 2개',
    char_count: 2780,
    content_duration_or_slides: '스크롤 5분 분량',
    unique_sns_formula: {
      title: '네이버 스마트블록 DIA+ 체류시간 극대화 공식',
      coreMetric: '모바일 체류시간(4분 30초) × 공감+비밀댓글 참여수(890개)',
      strategy:
        '생생한 실사 컷 18장과 3줄 인용구 블록을 300자마다 교차 배치해 모바일 이탈을 방지하고, 하단 비밀댓글 체크리스트 폼으로 알고리즘 참여 지수를 독점함.',
    },
    recommended_targets: [
      {
        targetChannel: 'instagram',
        channelName: '인스타그램',
        reason:
          '성수동 팝업의 현장감 있는 비주얼과 공간 동선 팁은 인스타그램 릴스(1.5초 훅)와 캐러셀 카드뉴스 1장 표지 시인성에 최적화되어 있습니다.',
      },
      {
        targetChannel: 'threads',
        channelName: '쓰레드',
        reason:
          '“광고비 3,000만원 쓰고 망하는 팝업 vs 대기줄 400명 팝업의 차이”는 쓰레드 마케터와 기획자들의 열띤 댓글 인용 토론을 일으키기에 제격입니다.',
      },
    ],
    ai_hook_point:
      '구체적 지역명(성수동) + 압도적 수치(대기줄 400명) + 의외의 핵심 원인(입구 동선 3미터)으로 스마트블록 클릭률(CTR)을 압도함.',
    ai_visual_structure:
      '직접 촬영한 현장 동선 도식화 이미지 8장과 3줄 요약 인용구 블록을 교차 배치하여 모바일 스크롤 피로도를 낮추고 체류시간 4분 30초 달성.',
    ai_comment_trigger:
      '포스팅 하단에 “팝업 오픈 전 필수 점검 엑셀 시트(32개 항목)가 필요하신 분은 공감+비밀댓글로 이메일 남겨주세요” 장치로 댓글 890개 돌파.',
    published_at: '2026-10-13T11:20:00Z',
  },
  {
    id: 'post-nb-2',
    channel: 'naver_blog',
    viral_type: 'long_tail',
    title:
      '스마트스토어 상세페이지 전환율 1.2%에서 6.8%로 끌어올린 첫 화면 GIF 배치 공식 완벽 정리',
    hook_copy:
      '“상세페이지 맨 위에 브랜드 철학부터 적고 계신가요? 고객은 2.5초 안에 내 문제가 해결되는지만 보고 뒤로가기를 누릅니다.”',
    author_name: '이커머스 연금술사',
    source_url: 'https://blog.naver.com/naver_seller/223281945112',
    views_count: 189000,
    likes_count: 5120,
    comments_count: 1120,
    shares_count: 6840,
    engagement_rate: 10.85,
    growth_velocity: '네이버 검색 월간 1.6만 유입 스테디셀러',
    keywords: ['#스마트스토어상세페이지', '#전환율높이는법', '#상세페이지기획', '#셀러꿀팁', '#GIF활용'],
    title_keyword_placement: 'front',
    title_hook_type: '상식 반박 + 전환율 수치 대비형 (1.2% ➔ 6.8%)',
    image_count_info: 'Before/After 비교 컷 10장 · GIF 4개',
    char_count: 3150,
    content_duration_or_slides: '스크롤 6분 분량',
    unique_sns_formula: {
      title: '네이버 상세페이지 비교 분석 스테디셀러 공식',
      coreMetric: '검색 유입 스테디 지속력 × 본문 스크롤 완독률',
      strategy:
        '대표 썸네일에 1:1 비교표 배치 + 첫 화면 2.5초 GIF 배치 가이드를 소제목(H2/H3)으로 일목요연하게 정리해 네이버 쇼핑 셀러들의 스크랩을 유도함.',
    },
    recommended_targets: [
      {
        targetChannel: 'x',
        channelName: 'X (Twitter)',
        reason:
          '상세페이지 Before/After 비교 캡처와 구체적 전환율 수치는 X 빌드인퍼블릭 커뮤니티에서 폭발적인 북마크를 달성하는 핵심 소재입니다.',
      },
      {
        targetChannel: 'instagram',
        channelName: '인스타그램',
        reason:
          '“망하는 상세페이지 vs 터지는 상세페이지” 8장 캐러셀 카드뉴스로 재구성하고 캡션에서 무료 진단 DM 이벤트를 연계하면 팔로워 유입이 극대화됩니다.',
      },
    ],
    ai_hook_point:
      '셀러들의 가장 흔한 실수(브랜드 철학 나열)를 찌르고 구체적인 전환율 상승 수치(1.2% → 6.8%)를 제목 전면에 내세움.',
    ai_visual_structure:
      '잘된 상세페이지 vs 망한 상세페이지 와이어프레임 비교 표와 GIF 용량 최적화 가이드를 소제목(H2/H3) 구조로 일목요연하게 정리.',
    ai_comment_trigger:
      '“현재 운영 중인 스토어 카테고리를 댓글로 남겨주시면 해당 업종에 가장 잘 먹히는 첫 화면 후킹 문구 3가지를 추천해 드립니다”로 진성 셀러 소통 유도.',
    published_at: '2026-10-02T15:00:00Z',
  },

  // 3. SEO Blog (WordPress / Google)
  {
    id: 'post-seo-1',
    channel: 'seo_blog',
    viral_type: 'long_tail',
    title:
      '2026 B2B SaaS 리드 제너레이션 퍼널 벤치마크 리포트: 콜드메일 대신 오가닉 검색으로 월 400건 문의 만든 구조',
    hook_copy:
      '“콜드메일 오픈율이 3% 미만으로 떨어진 지금, 구매 의도가 명확한 B2B 의사결정권자를 데려오는 유일한 자산은 ‘비교형 프로그래매틱 SEO’입니다.”',
    author_name: 'Growth Engine Lab',
    source_url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko',
    views_count: 312000,
    likes_count: 4200,
    comments_count: 640,
    shares_count: 9450,
    engagement_rate: 12.1,
    growth_velocity: '구글 스니펫(Featured Snippet) 14개 키워드 동시 점유',
    keywords: ['#B2BSaaS', '#프로그래매틱SEO', '#리드제너레이션', '#콘텐츠마케팅', '#구글상위노출'],
    title_keyword_placement: 'front',
    title_hook_type: '시장 한계 지적 + 대안 프레임워크 제시',
    image_count_info: '아키텍처 도식 SVG 5장 · ROI 계산 위젯 1개',
    char_count: 5400,
    content_duration_or_slides: '체류시간 7분 20초',
    unique_sns_formula: {
      title: '구글 E-E-A-T 및 Featured Snippet 장악 공식',
      coreMetric: '도메인 권위도(DA) 상승 × 오가닉 검색 스니펫 점유율 × 백링크 수',
      strategy:
        'H2 질문형 헤더 바로 아래 45단어 명확한 정의 + 비교 매트릭스 표 배치로 Perplexity/ChatGPT/구글이 1순위로 인용하게 만듦.',
    },
    recommended_targets: [
      {
        targetChannel: 'threads',
        channelName: '쓰레드',
        reason:
          '“콜드메일은 끝났습니다”라는 도발적 명제로 B2B 창업가·마케터들의 심리를 자극해 댓글 타래 토론을 폭발시킬 수 있습니다.',
      },
      {
        targetChannel: 'youtube',
        channelName: '유튜브',
        reason:
          '오가닉 리드젠 퍼널 아키텍처 화면 녹화 롱폼 영상으로 전환하면 고단가 기업 고객의 데모 신청 전환율을 극대화할 수 있습니다.',
      },
    ],
    ai_hook_point:
      '콜드메일의 하락세라는 시장 페인포인트를 데이터로 짚어내고 ‘비교형 프로그래매틱 SEO’라는 명확한 대안 솔루션을 제시함.',
    ai_visual_structure:
      '목차(TOC) 스키마 마크업, 핵심 지표 요약 테이블, 인터랙티브 ROI 계산기 위젯을 본문 상단에 배치해 구글 Core Web Vitals 및 체류시간 점수를 극대화.',
    ai_comment_trigger:
      '본문 중간(Mid-roll)과 하단에 ‘SaaS 비교 랜딩페이지 HTML/Notion 와이어프레임 키트’ 뉴스레터 구독 폼을 결합해 이메일 전환율 8.4% 기록.',
    published_at: '2026-09-28T10:00:00Z',
  },
  {
    id: 'post-seo-2',
    channel: 'seo_blog',
    viral_type: 'steady',
    title: '검색엔진과 AI 답변엔진(GEO)에 동시에 인용되는 아티클 구조화 작성법 7단계',
    hook_copy:
      '“이제 구글 1페이지 노출만으로는 부족합니다. Perplexity와 ChatGPT 검색이 가장 먼저 인용하는 문장 구조에는 명확한 패턴이 있습니다.”',
    author_name: 'NextSEO Archive',
    source_url: 'https://developers.google.com/search/blog/2023/02/google-search-and-ai-content?hl=ko',
    views_count: 145000,
    likes_count: 2890,
    comments_count: 410,
    shares_count: 5600,
    engagement_rate: 9.75,
    growth_velocity: '백링크 340개 자연 획득 및 오가닉 트래픽 월 +38% 성장',
    keywords: ['#GEO최적화', '#AI검색최적화', '#테크니컬SEO', '#워드프레스블로그', '#콘텐츠구조화'],
    title_keyword_placement: 'front',
    title_hook_type: '차세대 패러다임 제시 + 단계별 실전 가이드',
    image_count_info: 'JSON-LD 스키마 도식 3장 · 인용 구조 비교표 2장',
    char_count: 4100,
    content_duration_or_slides: '체류시간 6분 10초',
    unique_sns_formula: {
      title: 'GEO(Generative Engine Optimization) AI 답변 인용 공식',
      coreMetric: 'AI 검색엔진 인용 빈도 × 45단어 스니펫 추출률',
      strategy:
        '질문형 H2 헤더 + 45단어 이내의 정의형 첫 문단 + JSON-LD FAQ 스키마 코드 블록을 세트로 제공하여 AI 봇이 손쉽게 요약하도록 설계.',
    },
    recommended_targets: [
      {
        targetChannel: 'threads',
        channelName: '쓰레드',
        reason:
          '“SEO 다음은 GEO입니다”라는 한 줄 통념 파괴로 마케터들의 호기심을 즉시 자극하는 텍스트 타래로 이식하기에 가장 좋습니다.',
      },
      {
        targetChannel: 'x',
        channelName: 'X (Twitter)',
        reason:
          'AI 검색 인용 전후 프롬프트 비교 스크린샷과 함께 체크리스트를 공유하면 테크 인플루언서들의 인용 알티(RT)를 쉽게 얻을 수 있습니다.',
      },
    ],
    ai_hook_point:
      'SEO에서 GEO(Generative Engine Optimization)로의 패러다임 전환을 선점하여 마케터와 블로거들의 북마크 심리를 자극함.',
    ai_visual_structure:
      '질문형 H2 헤더 + 45단어 이내의 정의형 첫 문단 + JSON-LD FAQ 스키마 코드 블록을 세트로 제공하여 즉시 복사해 쓸 수 있도록 구성.',
    ai_comment_trigger:
      '아티클 하단 토론창에 “본인 사이트의 도메인 점수와 주력 키워드를 남기면 GEO 인용 가능성을 진단해 드립니다” 이벤트 운영.',
    published_at: '2026-10-06T14:10:00Z',
  },

  // 4. Instagram
  {
    id: 'post-ig-1',
    channel: 'instagram',
    viral_type: 'spike',
    title:
      '[릴스 240만뷰] 카피라이터가 올리브영 매대에서 무조건 집어 들게 만드는 한 줄 문구 법칙 4가지',
    hook_copy:
      '“같은 비타민 세럼인데 왜 왼쪽 제품만 품절될까요? 패키지에 적힌 ‘이 단어’ 하나 차이입니다.”',
    author_name: '@copy_alchemy',
    source_url: 'https://www.instagram.com/p/C6Z7gB6yN_q/',
    views_count: 2410000,
    likes_count: 118000,
    comments_count: 4320,
    shares_count: 89400,
    engagement_rate: 16.9,
    growth_velocity: '업로드 12시간 만에 저장수 5만 회 돌파',
    keywords: ['#카피라이팅', '#릴스떡상', '#브랜딩전략', '#올리브영마케팅', '#마케터그램'],
    title_keyword_placement: 'back',
    title_hook_type: '일상 공간 비교 + 호기심 유발 (이 단어 하나 차이)',
    image_count_info: '영상 1개 (18초) · 자막 컷 14개',
    char_count: 820,
    content_duration_or_slides: '릴스 18초 완결',
    unique_sns_formula: {
      title: '인스타그램 1.5초 스크롤 스톱 & 저장 루프 공식',
      coreMetric: '초반 2초 이탈률 15% 이하 × 저장률(3.7%) × 댓글 자동 DM 수',
      strategy:
        '매대 앞 1.5초 줌인으로 스크롤 정지 ➔ 마지막 2초 핵심 리스트 순식간 패스로 일시정지 유도 ➔ 캡션에 금지단어 모음 저장 유도.',
    },
    recommended_targets: [
      {
        targetChannel: 'naver_blog',
        channelName: '네이버 블로그',
        reason:
          '올리브영 품절 문구 4가지를 네이버 블로그 스마트블록용 실사 비교 리뷰로 확장 시 상위노출과 높은 체류시간을 확보할 수 있습니다.',
      },
      {
        targetChannel: 'threads',
        channelName: '쓰레드',
        reason:
          '“카피라이터가 올리브영 매대에서 절대 안 사는 문구 vs 사는 문구” 5단 타래로 쓰레드 마케터와 2030 소비자들의 폭발적 공감을 얻습니다.',
      },
    ],
    ai_hook_point:
      '누구나 익숙한 공간(올리브영 매대)에서 벌어지는 품절 현상을 시각적 비교로 보여주며 1.5초 만에 스크롤을 멈추게 함.',
    ai_visual_structure:
      '0~2초 현장 매대 클로즈업 훅 → 3~12초 빠른 컷 편집(1.2초 간격)과 화면 중앙 강조형 캡션 → 마지막 2초 핵심 요약 리스트를 빠르게 지나가게 해 일시정지/재시청 유도.',
    ai_comment_trigger:
      '“캡션에 업종별 금지 단어 30개와 대체 표현 사전을 정리해 뒀습니다. 나중에 쓰려면 무조건 [저장]부터 누르고 친구 태그하세요!”로 저장률 3.7% 달성.',
    published_at: '2026-10-15T06:00:00Z',
  },
  {
    id: 'post-ig-2',
    channel: 'instagram',
    viral_type: 'steady',
    title:
      '[카드뉴스] 1인 브랜드가 광고비 0원으로 진성 팬 1만 명 모으는 인스타그램 프로필 깔때기 설계도',
    hook_copy:
      '“릴스가 백만 뷰 터져도 팔로우로 안 이어진다면? 프로필 소개글 3줄이 손님을 쫓아내고 있기 때문입니다.”',
    author_name: '@solo_brand_lab',
    source_url: 'https://www.instagram.com/p/C7X2r8kSgT9/',
    views_count: 460000,
    likes_count: 31200,
    comments_count: 1950,
    shares_count: 42100,
    engagement_rate: 15.4,
    growth_velocity: '저장 대비 공유 비율 1:1.3으로 지속 확산 중',
    keywords: ['#인스타그램브랜딩', '#1인기업', '#프로필꾸미기', '#콘텐츠마케팅', '#퍼스널브랜딩'],
    title_keyword_placement: 'front',
    title_hook_type: '성과 대비 결핍 지적 (조회수 터져도 팔로우 0)',
    image_count_info: '캐러셀 카드 9장 (정방형 1:1)',
    char_count: 1420,
    content_duration_or_slides: '카드뉴스 9장',
    unique_sns_formula: {
      title: '인스타그램 9장 완결형 캐러셀 깔때기 공식',
      coreMetric: '마지막 장 도달률(45%+) × 저장수(Save) × DM 키워드 발송수',
      strategy:
        '1장 강렬한 타이포 훅 ➔ 2~5장 잘못된 예시 X vs 고전환 예시 O 직관적 도식 ➔ 6~8장 빈칸 채우기 템플릿 ➔ 9장 저장 및 DM 유도로 완결.',
    },
    recommended_targets: [
      {
        targetChannel: 'naver_blog',
        channelName: '네이버 블로그',
        reason:
          '9장의 카드뉴스 와이어프레임을 롱폼 블로그 글로 풀어서 실제 적용 템플릿과 노션 링크를 배포하면 진성 이웃 추가가 폭발합니다.',
      },
      {
        targetChannel: 'threads',
        channelName: '쓰레드',
        reason:
          '“프로필 소개글 3줄로 팔로워 10배 늘리는 법”을 텍스트 중심 타래로 구성하면 1인 창업가들의 북마크와 리포스트가 쏟아집니다.',
      },
    ],
    ai_hook_point:
      '조회수는 높지만 팔로워가 늘지 않는 크리에이터들의 가장 아픈 지점을 첫 장 카피로 정확히 타격함.',
    ai_visual_structure:
      '1장(강렬한 타이포 훅) → 2~5장(잘못된 예시 X vs 고전환 예시 O 직관적 도식) → 6~8장(빈칸 채우기 템플릿) → 9장(저장 유도 요약표) 9장 완결형 캐러셀.',
    ai_comment_trigger:
      '“댓글에 ‘프로필’ 세 글자만 남겨주시면 DM으로 노션 프로필 진단 시트를 즉시 자동 발송해 드립니다(매니챗 연동)”로 댓글 1,950개 폭발.',
    published_at: '2026-10-11T09:00:00Z',
  },

  // 5. Threads
  {
    id: 'post-th-1',
    channel: 'threads',
    viral_type: 'spike',
    title:
      '마케팅 대행사 7년 차가 클라이언트 미팅에서 절대 쓰지 않는 말 5가지 (타래로 이어집니다 🧵)',
    hook_copy:
      '“클라이언트한테 ‘요즘 젠지(Gen-Z)들이 좋아해요’라고 말하는 순간, 그 제안서는 바로 쓰레기통으로 갑니다.”',
    author_name: '@agency_insider_kr',
    source_url: 'https://www.threads.net/@meta/post/C4j8lVrvY9x',
    views_count: 680000,
    likes_count: 29400,
    comments_count: 3820,
    shares_count: 14900,
    engagement_rate: 15.8,
    growth_velocity: '업로드 6시간 만에 리포스트 8,000회 및 인용 토론 폭발',
    keywords: ['#쓰레드마케팅', '#대행사실무', '#제안서작성', '#B2B영업', '#카피라이팅'],
    title_keyword_placement: 'middle',
    title_hook_type: '업계 클리셰 저격 + 권위자 폭로형',
    image_count_info: '텍스트 전용 (이미지 없음)',
    char_count: 1450,
    content_duration_or_slides: '5단 타래(Thread) 완결',
    unique_sns_formula: {
      title: '쓰레드 텍스트 통념 파괴 & 타래 완독 공식',
      coreMetric: '첫 게시물 머무는 시간 × 타래 완독률 × 답글 토론 릴레이(3,800개)',
      strategy:
        '첫 글은 단 2문장과 여백으로 호기심 극대화 ➔ 1~5번 타래로 짧은 호흡 템포 ➔ 마지막에 업계 경험담을 묻는 열린 질문으로 댓글 폭발.',
    },
    recommended_targets: [
      {
        targetChannel: 'youtube',
        channelName: '유튜브',
        reason:
          '클라이언트 미팅 금기어 5가지는 쇼츠 30초 콩트 및 롱폼 썰 풀기 영상으로 즉시 전환해 높은 조회수를 얻을 수 있습니다.',
      },
      {
        targetChannel: 'naver_blog',
        channelName: '네이버 블로그',
        reason:
          '실제 통과된 제안서 vs 탈락한 제안서 비교 컷을 첨부하여 실무자 직장생활 전문 칼럼으로 발행하기에 완벽합니다.',
      },
    ],
    ai_hook_point:
      '업계의 흔한 클리셰(‘요즘 젠지들이 좋아해요’)를 강하게 비판하는 반직관적 첫 문장으로 마케터·대표들의 시선을 강탈함.',
    ai_visual_structure:
      '첫 게시물은 단 2문장으로 여백을 살리고, 이어지는 댓글 타래(Thread)에 1번부터 5번까지 짧은 호흡의 대체 화법을 구조화하여 마지막 타래까지 완독 유도.',
    ai_comment_trigger:
      '마지막 타래에 “현업에서 들었던 가장 황당한 마케팅 피드백이나 유행어는 무엇이었나요?”라는 열린 질문을 던져 3,800개 이상의 경험담 댓글 릴레이 형성.',
    published_at: '2026-10-15T11:30:00Z',
  },

  // 6. X (Twitter)
  {
    id: 'post-x-1',
    channel: 'x',
    viral_type: 'spike',
    title:
      '사이드 프로젝트 런칭 첫날 결제 120건 만든 랜딩페이지 히어로 섹션 A/B 테스트 결과 공유',
    hook_copy:
      '“기능 설명을 전부 지우고 고객이 겪는 ‘짜증 나는 순간’ 하나만 적었더니 결제 전환율이 1.4%에서 5.9%로 뛰었습니다. 실제 화면 비교 타래👇”',
    author_name: '@indie_maker_seo',
    source_url: 'https://x.com/OpenAI/status/1789718785860767784',
    views_count: 820000,
    likes_count: 19800,
    comments_count: 1140,
    shares_count: 15600,
    engagement_rate: 13.95,
    growth_velocity: '북마크 2.4만 회 돌파 및 테크/스타트업 커뮤니티 확산',
    keywords: ['#인디해커', '#랜딩페이지', '#AB테스트', '#스타트업마케팅', '#전환율최적화'],
    title_keyword_placement: 'middle',
    title_hook_type: '실제 결제 데이터 + Before/After 전환율 수치 제시',
    image_count_info: '랜딩페이지 비교 스크린샷 2장 (화살표 어노테이션)',
    char_count: 1120,
    content_duration_or_slides: '트윗 4개 타래',
    unique_sns_formula: {
      title: 'X(Twitter) 빌드인퍼블릭 & 북마크 장악 공식',
      coreMetric: '북마크수(2.4만) × 인용 알티(RT) × 멘션 피드백 요청수',
      strategy:
        '기능 나열 대신 고객 짜증 해결 문구로 전환율 1.4%➔5.9% 상승한 실제 스크린샷 증명 ➔ 하단에 무료 카피 진단 멘션 이벤트로 인용 폭발.',
    },
    recommended_targets: [
      {
        targetChannel: 'seo_blog',
        channelName: 'SEO 블로그',
        reason:
          '랜딩페이지 히어로 섹션 A/B 테스트 결과는 검색 유입형 전문 케이스 스터디 아티클로 최적화하여 오가닉 백링크를 다수 유치할 수 있습니다.',
      },
      {
        targetChannel: 'naver_blog',
        channelName: '네이버 블로그',
        reason:
          '1인 창업가/스타트업을 위한 고전환 웹사이트 제작 실측 비교 포스팅으로 전환하면 스마트블록 IT/비즈니스 상위에 쉽게 오릅니다.',
      },
    ],
    ai_hook_point:
      '실제 매출/결제 건수(120건)와 전환율 변화(1.4% → 5.9%)를 첫 트윗에 압축 제시해 북마크 욕구를 즉각 자극함.',
    ai_visual_structure:
      '트윗 상단에 Before/After 랜딩페이지 스크린샷 2장을 나란히 첨부하고, 빨간색 화살표 어노테이션으로 변경된 카피 위치를 직관적으로 표시함.',
    ai_comment_trigger:
      '“현재 만들고 계신 프로덕트의 한 줄 소개와 타깃 고객을 멘션으로 남겨주시면 히어로 섹션 카피를 무료로 리라이팅해 드립니다”로 실시간 인용 알티(RT) 폭발.',
    published_at: '2026-10-14T18:00:00Z',
  },

  // 7. Facebook
  {
    id: 'post-fb-1',
    channel: 'facebook',
    viral_type: 'steady',
    title:
      '3040 직장인 타깃 건기식 브랜드가 메타(Meta) 광고 ROAS 420% 방어한 ‘네이티브 스토리텔링’ 소재 공식',
    hook_copy:
      '“화려한 스튜디오 촬영 컷보다 스마트폰 메모장 캡처 한 장이 클릭률 3.2배 더 높게 나왔습니다. 왜 그럴까요?”',
    author_name: '퍼포먼스 마케팅 랩',
    source_url: 'https://www.facebook.com/MetaforBusiness/posts/10159483920194841',
    views_count: 295000,
    likes_count: 8400,
    comments_count: 1620,
    shares_count: 6300,
    engagement_rate: 11.45,
    growth_velocity: '마케팅 실무자 그룹 24곳에 공유되며 3주 연속 인기글 유지',
    keywords: ['#메타광고', '#퍼포먼스마케팅', '#ROAS개선', '#광고소재기획', '#스토리텔링'],
    title_keyword_placement: 'middle',
    title_hook_type: '반직관적 비주얼 (스튜디오 촬영 vs 메모장 캡처)',
    image_count_info: '아이폰 메모장 캡처 1장 · 광고관리자 성과 그래프 1장',
    char_count: 1680,
    content_duration_or_slides: '단일 포스팅 + 2장 이미지',
    unique_sns_formula: {
      title: '페이스북 네이티브 스토리텔링 & 광고 피로도 회피 공식',
      coreMetric: '광고 느낌 없는 체류시간 × 3040 페이스북 그룹 공유 × 투표형 댓글',
      strategy:
        '화려한 스튜디오 촬영 대신 스마트폰 메모장 캡처로 광고 거부감을 낮추고, 실패 에피소드로 몰입시킨 후 투표형 질문으로 진성 반응 유도.',
    },
    recommended_targets: [
      {
        targetChannel: 'instagram',
        channelName: '인스타그램',
        reason:
          '아이폰 메모장 캡처 감성은 인스타그램 캐러셀 1장 표지 훅으로도 피로도 없이 즉각 적용되어 높은 저장률을 기록합니다.',
      },
      {
        targetChannel: 'naver_blog',
        channelName: '네이버 블로그',
        reason:
          '진솔한 내돈내산 톤앤매너로 제품 섭취 일지 및 성분 비교 리뷰를 작성하면 네이버 DIA+ 로직의 높은 가중치를 받습니다.',
      },
    ],
    ai_hook_point:
      '고비용 스튜디오 촬영 vs 스마트폰 메모장 캡처라는 극명한 대비를 통해 광고 피로도에 지친 마케터들의 고정관념을 깨뜨림.',
    ai_visual_structure:
      '첫 번째 이미지는 실제 아이폰 메모장 UI에 적힌 진솔한 후기 캡처, 두 번째부터는 광고 관리자 CTR/CPC 실제 성과 그래프를 배치해 신뢰도 확보.',
    ai_comment_trigger:
      '“메타 광고 효율이 떨어질 때 여러분이 가장 먼저 바꾸는 요소는 무엇인가요? (1. 썸네일 2. 첫 문장 3. 타깃팅) 댓글로 번호와 이유를 공유해 주세요!”로 투표형 댓글 유도.',
    published_at: '2026-10-08T09:15:00Z',
  },
];

// 초기 아이디어 보관함 샘플 데이터
export const INITIAL_SAVED_IDEAS: MarketingLabIdea[] = [
  {
    id: 'idea-seed-1',
    source_post_id: 'post-ig-1',
    source_channel: 'instagram',
    target_channel: 'naver_blog',
    fusion_topic: '프리미엄 데스크테리어 조명 브랜드 런칭 캠페인',
    cross_media_strategy:
      '인스타그램 릴스 240만뷰 사례의 [1.5초 비교 훅 + 금지 단어 대조법]을 네이버 블로그 스마트블록 상위노출용 [비교 분석형 롱폼 리뷰]로 이식합니다. 초반 3줄에서 일반 스탠드와 눈 피로도 차이를 직관적 GIF로 대조해 이탈을 막고 체류시간 4분 이상을 확보합니다.',
    custom_title:
      '하루 8시간 모니터 보는 직장인이 데스크 조명 바꿨더니 눈 시림 사라진 이유 (일반 LED vs 시력보호 조명 3종 실측 비교)',
    custom_thumbnail_concept:
      '좌측: 어두운 방 모니터 반사광으로 눈 찌푸린 사진 (붉은색 X) / 우측: 비대칭 스크린바로 깔끔하게 정돈된 데스크 셋업 (초록색 O + 조도계 수치 오버레이)',
    content_outline:
      '1. [후킹 도입] 퇴근 후 눈이 침침한 이유가 모니터가 아니라 조명 각도 때문이라는 사실 제시\n2. [시각적 비교] 스마트폰 슬로우모션으로 찍은 플리커 현상 GIF 2종 비교\n3. [핵심 근거] 색온도(4000K)와 연색성(Ra95) 실측 표 정리\n4. [댓글/전환 유도] 내 책상 가로 사이즈 댓글 남기면 맞춤 설치 가이드 PDF 증정',
    memo: '이번 주 금요일 스마트블록 발행 예정. 촬영 시 아이폰 슬로우모션 플리커 비교 컷 필수 확보할 것!',
    tags: ['#데스크테리어', '#스마트블록이식', '#릴스공식활용'],
    is_pinned: true,
    status: 'ready',
    created_at: '2026-10-15T15:20:00Z',
  },
  {
    id: 'idea-seed-2',
    source_post_id: 'post-yt-1',
    source_channel: 'youtube',
    target_channel: 'threads',
    fusion_topic: 'AI 마케팅 자동화 SaaS 초기 유저 확보',
    cross_media_strategy:
      '유튜브 94만뷰 사례의 [구체적 시간 절감 수치 + 조건 없는 시트 무료 배포] 공식을 쓰레드(Threads)의 [반직관적 첫 문장 + 5단 타래(Thread) + 댓글 자동 DM] 포맷으로 압축 이식합니다.',
    custom_title:
      '마케터가 주간 보고서 쓰는 데 3시간 넘게 걸린다면 성실한 게 아니라 도구가 틀린 겁니다 (실제 15분 컷 자동화 타래 🧵)',
    custom_thumbnail_concept:
      '텍스트 중심 2문장 첫 게시물 + 두 번째 타래에 Before(8시간) vs After(15분) 노션/슬랙 자동 알림 짧은 5초 화면 녹화 GIF 첨부',
    content_outline:
      '1. [본문 첫 트윗] 통념 파괴 후킹 2문장 + 타래 예고\n2. [타래 1~3] 광고 데이터 수집 → AI 요약 → 슬랙 발송 3단계 핵심 프롬프트 공개\n3. [타래 4] 실제 절감된 팀 리소스 수치 증명\n4. [타래 5 CTA] 댓글에 "자동화" 남기면 노코드 템플릿 링크 즉시 공유',
    memo: '화요일 오전 8시 30분 출근 시간대 업로드 테스트 예정.',
    tags: ['#쓰레드타래', '#B2B리드젠', '#유튜브공식이식'],
    is_pinned: false,
    status: 'draft',
    created_at: '2026-10-14T19:00:00Z',
  },
];

// 빠른 융합 소재 프리셋
const QUICK_FUSION_TOPICS = [
  'AI 업무 자동화 노션 템플릿 런칭',
  '성수동 비건 베이커리 팝업스토어 홍보',
  '직장인 체형교정 데스크테리어 의자 캠페인',
  'B2B 마케팅 SaaS 무료 체험 리드 확보',
  '1인 지식창업가 전자책 & 뉴스레터 구독 퍼널',
];

// 각 SNS 채널별 고유 성공 문법, 콘텐츠 볼륨 스펙, 추천 타깃 기본값
const CHANNEL_DEFAULT_DECONSTRUCT_SPECS: Record<
  SnsChannel,
  {
    unique_sns_formula: UniqueSnsFormula;
    recommended_targets: RecommendedTargetChannel[];
    title_keyword_placement: TitleKeywordPlacement;
    title_hook_type: string;
    image_count_info: string;
    char_count: number;
    content_duration_or_slides: string;
  }
> = {
  youtube: {
    unique_sns_formula: {
      title: '유튜브 0~30초 시청 지속 시간(AVD) & 고정댓글 대화량',
      name: '유튜브 0~30초 시청 지속 시간(AVD) & 고정댓글 대화량',
      coreMetric: '초반 30초 잔존율(>70%) × CTR(클릭률 >10%)',
      core_logic: '오프닝 5초 안에 결론의 충격적인 단면을 선공개하고 본론에서 단계별 전개로 이탈을 방어함.',
      strategy: '오프닝 5초 안에 결론의 충격적인 단면을 선공개하고 본론에서 단계별 전개로 이탈을 방어함.',
      algorithm_factor: '초반 30초 시청 유지율(AVD) 및 고정 댓글 대화 체인 수',
    },
    recommended_targets: [
      {
        targetChannel: 'naver_blog',
        channelName: '네이버 블로그',
        reason: '영상 스크립트를 롱폼 텍스트로 전환하여 네이버 검색 유입 및 체류시간 확보에 최적',
      },
      {
        targetChannel: 'instagram',
        channelName: '인스타그램',
        reason: '핵심 하이라이트 30초를 릴스와 10장 카드뉴스로 재가공하여 도달 극대화',
      },
    ],
    title_keyword_placement: 'front',
    title_hook_type: '수치 충격형 & 공감 저격',
    image_count_info: '썸네일 2종 (A/B 테스트)',
    char_count: 1850,
    content_duration_or_slides: '14분 20초 (롱폼)',
  },
  naver_blog: {
    unique_sns_formula: {
      title: '스마트블록 DIA+ 체류시간 & 전문성 부스팅',
      name: '스마트블록 DIA+ 체류시간 & 전문성 부스팅',
      coreMetric: '스크롤 완독 체류시간(3분 이상) × 이미지 10장 이상 체류',
      core_logic: '초반 3줄 인용구로 검색 의도 즉시 충족 + 고화질 캡처 10장 이상 배치하여 스크롤 체류 유도.',
      strategy: '초반 3줄 인용구로 검색 의도 즉시 충족 + 고화질 캡처 10장 이상 배치하여 스크롤 체류 유도.',
      algorithm_factor: '스마트블록 C-Rank 신뢰도 및 DIA+ 문서 완독률',
    },
    recommended_targets: [
      {
        targetChannel: 'threads',
        channelName: '쓰레드',
        reason: '블로그 핵심 3줄 인용구와 요약을 쓰레드 타래로 공유하여 빠른 바이럴 유도',
      },
      {
        targetChannel: 'seo_blog',
        channelName: 'SEO 블로그',
        reason: '검색 의도 분석 구조를 구글 E-E-A-T 구조로 이식하여 글로벌 구글 검색 유입 선점',
      },
    ],
    title_keyword_placement: 'front',
    title_hook_type: '스마트블록 키워드 직관형',
    image_count_info: '이미지 12장 · GIF 2개',
    char_count: 2350,
    content_duration_or_slides: '스크롤 3분 40초',
  },
  seo_blog: {
    unique_sns_formula: {
      title: '구글 검색 E-E-A-T & 피처드 스니펫 선점',
      name: '구글 검색 E-E-A-T & 피처드 스니펫 선점',
      coreMetric: '검색 엔진 크롤러 인덱싱 속도 × 백링크 및 스니펫 점유',
      core_logic: 'H2/H3 명확한 위계 목차 + 45단어 직관적 정의 스니펫 박스 배치로 생성형 AI 검색(GEO)까지 대응.',
      strategy: 'H2/H3 명확한 위계 목차 + 45단어 직관적 정의 스니펫 박스 배치로 생성형 AI 검색(GEO)까지 대응.',
      algorithm_factor: 'E-E-A-T 전문성 기둥 및 스키마 마크업 인덱싱',
    },
    recommended_targets: [
      {
        targetChannel: 'threads',
        channelName: '쓰레드',
        reason: '전문 기술/지식 분석 결과를 5단 타래로 요약하여 B2B 오디언스 인게이지먼트 확보',
      },
      {
        targetChannel: 'x',
        channelName: 'X (Twitter)',
        reason: '핵심 데이터 도표와 인사이트를 280자 단일 트윗으로 공유하여 리트윗 촉발',
      },
    ],
    title_keyword_placement: 'front',
    title_hook_type: '해결책 제시형 E-E-A-T',
    image_count_info: '도표/차트 3장',
    char_count: 3100,
    content_duration_or_slides: '완독 5분',
  },
  instagram: {
    unique_sns_formula: {
      title: '10장 카드뉴스 저장/공유 & ManyChat DM 유도',
      name: '10장 카드뉴스 저장/공유 & ManyChat DM 유도',
      coreMetric: '저장수(Saves) + DM 자동 발송 트리거 전환율',
      core_logic: '1장 커버 강렬한 비포/애프터 + 2~9장 템플릿 + 10장 키워드 댓글 유도로 저장과 DM 폭발.',
      strategy: '1장 커버 강렬한 비포/애프터 + 2~9장 템플릿 + 10장 키워드 댓글 유도로 저장과 DM 폭발.',
      algorithm_factor: '알고리즘 최고 가중치인 저장(Save) 및 DM 공유 비율',
    },
    recommended_targets: [
      {
        targetChannel: 'naver_blog',
        channelName: '네이버 블로그',
        reason: '카드뉴스 10장의 요약본을 네이버 상세 설명 및 서식 다운로드 포스팅으로 확장',
      },
      {
        targetChannel: 'threads',
        channelName: '쓰레드',
        reason: '인스타 비주얼 콘텐츠의 핵심 뒷이야기를 쓰레드 텍스트로 풀어 오가닉 바이럴',
      },
    ],
    title_keyword_placement: 'middle',
    title_hook_type: '시각적 비포/애프터 대비',
    image_count_info: '카드뉴스 10장',
    char_count: 650,
    content_duration_or_slides: '카드뉴스 10슬라이드',
  },
  threads: {
    unique_sns_formula: {
      title: '첫 줄 스크롤 스토퍼 & 타래 논쟁 유도',
      name: '첫 줄 스크롤 스토퍼 & 타래 논쟁 유도',
      coreMetric: '답글(Replies) 대화 체인 수 × 프로필 클릭률',
      core_logic: '한 줄 띄어쓰기 가독성 + 본인만의 뾰족한 소신으로 타래 토론 폭발 유도.',
      strategy: '한 줄 띄어쓰기 가독성 + 본인만의 뾰족한 소신으로 타래 토론 폭발 유도.',
      algorithm_factor: '알고리즘 최우선 가중치인 답글(Reply) 체인 길이',
    },
    recommended_targets: [
      {
        targetChannel: 'youtube',
        channelName: '유튜브',
        reason: '쓰레드에서 격렬한 토론이 일어난 소재를 유튜브 롱폼 영상의 토론 주제로 채택',
      },
      {
        targetChannel: 'naver_blog',
        channelName: '네이버 블로그',
        reason: '타래의 반응 좋은 의견들을 종합 정리하여 네이버 칼럼 포스팅으로 재가공',
      },
    ],
    title_keyword_placement: 'front',
    title_hook_type: '통념 파괴형 논쟁 훅',
    image_count_info: '텍스트 타래 5단 (이미지 1장)',
    char_count: 480,
    content_duration_or_slides: '5단 스레드 타래',
  },
  x: {
    unique_sns_formula: {
      title: '280자 수치 강조 훅 & 북마크 유도 체크리스트',
      name: '280자 수치 강조 훅 & 북마크 유도 체크리스트',
      coreMetric: '북마크(Bookmarks) 수 × 리트윗(Retweets)',
      core_logic: '숫자/통계 전면 배치 + 데이터 캡처 첨부 + 타래 마지막에 저장용 체크리스트 제공.',
      strategy: '숫자/통계 전면 배치 + 데이터 캡처 첨부 + 타래 마지막에 저장용 체크리스트 제공.',
      algorithm_factor: '피드 노출 가중치 5배인 북마크(Bookmark) 전환율',
    },
    recommended_targets: [
      {
        targetChannel: 'threads',
        channelName: '쓰레드',
        reason: 'X의 수치 기반 팩트 트윗을 쓰레드 감성 타래로 변환하여 2030 오디언스 공략',
      },
      {
        targetChannel: 'seo_blog',
        channelName: 'SEO 블로그',
        reason: '트윗에 포함된 팩트/통계 수치를 구글 검색 최적화 전문 리포트로 확장',
      },
    ],
    title_keyword_placement: 'front',
    title_hook_type: '수치/팩트 충격형',
    image_count_info: '인포그래픽/캡처 1장',
    char_count: 240,
    content_duration_or_slides: '단일 훅 트윗 + 3단 타래',
  },
  facebook: {
    unique_sns_formula: {
      title: '공감형 스토리텔링 & 메모장 캡처 바이럴',
      name: '공감형 스토리텔링 & 메모장 캡처 바이럴',
      coreMetric: '공유(Shares) 수 × 댓글 태그(친구 소환)',
      core_logic: '첫 3줄 현실적인 결핍 묘사 + 메모장/카톡 캡처 + 댓글 링크 유도로 자연스러운 공유 촉발.',
      strategy: '첫 3줄 현실적인 결핍 묘사 + 메모장/카톡 캡처 + 댓글 링크 유도로 자연스러운 공유 촉발.',
      algorithm_factor: '친구/그룹 공유 및 댓글 내 친구 소환 태깅율',
    },
    recommended_targets: [
      {
        targetChannel: 'instagram',
        channelName: '인스타그램',
        reason: '메모장 감성 스토리를 인스타그램 카드뉴스로 정돈하여 시각적 확산',
      },
      {
        targetChannel: 'naver_blog',
        channelName: '네이버 블로그',
        reason: '페이스북 스토리텔링을 네이버 블로그의 이웃 공감형 수기 포스팅으로 연동',
      },
    ],
    title_keyword_placement: 'middle',
    title_hook_type: '현실 밀착 공감형',
    image_count_info: '메모장 캡처 3장',
    char_count: 950,
    content_duration_or_slides: '카드 4장',
  },
};

function hydratePostWithDeconstructSpec(post: MarketingLabPost): MarketingLabPost {
  const seedPost = INITIAL_MARKETING_POSTS.find((p) => p.id === post.id);
  const chSpec = CHANNEL_DEFAULT_DECONSTRUCT_SPECS[post.channel] || CHANNEL_DEFAULT_DECONSTRUCT_SPECS.youtube;

  return {
    ...post,
    title_keyword_placement: post.title_keyword_placement || seedPost?.title_keyword_placement || chSpec.title_keyword_placement,
    title_hook_type: post.title_hook_type || seedPost?.title_hook_type || chSpec.title_hook_type,
    image_count_info: post.image_count_info || seedPost?.image_count_info || chSpec.image_count_info,
    char_count: post.char_count ?? seedPost?.char_count ?? chSpec.char_count,
    content_duration_or_slides: post.content_duration_or_slides || seedPost?.content_duration_or_slides || chSpec.content_duration_or_slides,
    unique_sns_formula: post.unique_sns_formula || seedPost?.unique_sns_formula || chSpec.unique_sns_formula,
    recommended_targets:
      post.recommended_targets && post.recommended_targets.length > 0
        ? post.recommended_targets
        : seedPost?.recommended_targets || chSpec.recommended_targets,
  };
}

// ----------------------------------------------------------------------------
// AI 크로스오버 재창조 엔진 (선택된 분석 데이터 × 타깃 채널 × 내 소재 융합 생성기)
// ----------------------------------------------------------------------------
function generateCrossoverSynthesis(
  post: MarketingLabPost,
  targetChannel: SnsChannel,
  topic: string
): ChannelSpecificBlueprint {
  const sourceMeta =
    SNS_CHANNELS.find((c) => c.id === post.channel) || SNS_CHANNELS[0];
  const targetMeta =
    SNS_CHANNELS.find((c) => c.id === targetChannel) || SNS_CHANNELS[1];
  const cleanTopic = topic.trim() || '신규 브랜드 캠페인 & 핵심 상품';

  const channelAdaptationMap: Record<SnsChannel, ChannelSpecificBlueprint> = {
    naver_blog: {
      targetChannel: 'naver_blog',
      title: `${cleanTopic} 직접 써보고 정착한 이유: 실패 없는 선택 기준 5가지 총정리 (실측 비교표有)`,
      strategy: `[${sourceMeta.shortLabel} ➔ 네이버 블로그 스마트블록 이식] ${sourceMeta.shortLabel}에서 검증된 후킹 포인트(${post.ai_hook_point.slice(0, 36)}...)를 네이버 DIA+ 로직이 선호하는 '초반 3줄 요약 인용구 + 직접 찍은 비교 GIF' 구조로 변환하여 스마트블록 상단 노출과 체류시간 4분 이상을 확보합니다.`,
      visualConcept: `대표 썸네일: 정방형(1:1) 고화질 실사용 비교 컷 + 깔끔한 고딕체 타이틀 배너 / 본문 상단: 2.5초 만에 차이를 보여주는 Before & After 움짤(GIF) 배치`,
      outlineSteps: [
        `1. [도입 3줄 인용구] 독자의 페인포인트를 찌르는 질문형 첫 문장 + 핵심 결론 3줄 요약 박스`,
        `2. [비교 검증 섹션] "${cleanTopic}" 도입 전후 데이터 및 경쟁 대안과의 1:1 비교 표(Table) 제시`,
        `3. [디테일 리뷰] 현장감 있는 실사 이미지 6~8장과 소제목(H2) 키워드 반복 배치로 검색 의도 충족`,
        `4. [공감·비밀댓글 유도] "포스팅에 다 못 담은 ${cleanTopic} 비공개 견적/체크리스트는 공감+비밀댓글 남겨주세요"`,
      ],
      algorithmRationale:
        '네이버 DIA+ 알고리즘은 문서 첫머리에서 독자의 검색 의도를 즉각 해소(체류시간 4분+ 트리거)하고, 직접 촬영한 사진/GIF의 메타데이터와 댓글/공감 반응 비율을 최우선으로 평가합니다. 3줄 인용구와 비교 GIF는 반송률(Bounce Rate)을 30% 이하로 낮춥니다.',
      naverBlogPack: {
        smartblockTitle: `${cleanTopic} 실측 비교 추천: 90%가 놓치는 핵심 기준 5가지`,
        intro3LineQuotes: `“${cleanTopic} 선택할 때 아직도 광고글만 보고 계신가요?”\n“직접 내돈내산으로 3주간 테스트해본 뒤 정착한 진짜 이유만 정리했습니다.”\n“이 글 하나로 헛돈 쓰는 시간과 비용을 80% 아껴드립니다.”`,
        imageAndGifPrompts:
          '① 첫 화면 Before vs After 플리커/변화 2.5초 반복 GIF\n② 실측 데이터 비교 표 (4열 5행 고해상도 그래픽)\n③ 실제 손으로 쥐고 사용하는 클로즈업 사진 4장 이상\n④ 최종 총평 체크리스트 카드 이미지 1장',
      },
    },
    seo_blog: {
      targetChannel: 'seo_blog',
      title: `2026 ${cleanTopic} 완벽 가이드: 전환율을 4.2배 높이는 데이터 기반 설계 프레임워크`,
      strategy: `[${sourceMeta.shortLabel} ➔ 워드프레스/구글 SEO & GEO 이식] 원본의 바이럴 트리거를 구글 Featured Snippet 및 AI 검색엔진(Perplexity/ChatGPT)이 인용하기 가장 좋은 '질문형 H2 헤더 + 45단어 핵심 정의 + 구조화 비교 테이블' 아티클로 재창조합니다.`,
      visualConcept: `본문 최상단 Key Takeaways 요약 카드 UI + 수치 비교 데이터 차트(SVG/WebP) + 인터랙티브 체크리스트 테이블 배치`,
      outlineSteps: [
        `1. [TL;DR 요약 박스] AI 답변엔진(GEO) 인용을 겨냥한 45단어 이내의 명확한 정의와 핵심 수치 제시`,
        `2. [H2 질문형 구조화] "왜 기존 ${cleanTopic} 방식은 실패하는가?" 데이터 근거와 업계 벤치마크 비교`,
        `3. [Step-by-Step 가이드] 실무자가 즉시 복사해 적용할 수 있는 5단계 실행 템플릿 및 비교 매트릭스 표`,
        `4. [리드 마그넷 전환] 본문 중단 및 하단에 "${cleanTopic} 실전 노션 키트" 뉴스레터 구독 폼 배치`,
      ],
      algorithmRationale:
        '구글 검색과 AI 답변엔진(GEO)은 E-E-A-T(경험·전문성·권위·신뢰) 기준을 충족하는 독창적 데이터와 구조화된 스키마(FAQ/Table)를 우선 인용합니다. H2 아래 40~45단어 정밀 정의문은 Perplexity/ChatGPT 검색에서 Featured Snippet으로 추출될 확률을 3.8배 높입니다.',
      seoBlogPack: {
        eeatStrategy:
          '저자의 실무 7년 경력 데이터 표기 + 120개 A/B 테스트 샘플 통계 인용 + 외부 공신력 학술/업계 벤치마크 아웃바운드 링크 2건 삽입',
        h2H3Outline: [
          'H1: 2026 ' + cleanTopic + ' 전략 프레임워크',
          '  H2: ' + cleanTopic + '이란 무엇인가? (45단어 핵심 정의)',
          '  H2: 기존 방식이 실패하는 3가지 구조적 원인 (데이터 분석)',
          '  H2: 성공률 94%를 달성하는 4단계 실전 파이프라인 (표 포함)',
          '  H2: 자주 묻는 질문 (FAQ Schema 연동)',
        ],
        geoSnippetParagraph:
          `${cleanTopic}의 핵심은 단순한 기능 확장이 아니라 고객의 페인포인트를 단일 화면에서 수치로 해소하는 것입니다. 2026년 벤치마크 데이터에 따르면 전환 퍼널 상단에서 비교 표를 제공한 그룹이 대조군 대비 4.2배 높은 오가닉 체류시간과 3.8배 높은 리드 전환율을 기록했습니다.`,
      },
    },
    threads: {
      targetChannel: 'threads',
      title: `${cleanTopic} 할 때 가장 먼저 버려야 할 고정관념 5가지 (실무에서 겪은 진짜 이유 타래로 풉니다 🧵)`,
      strategy: `[${sourceMeta.shortLabel} ➔ 쓰레드(Threads) 5단 타래 이식] 원본의 성공 요인을 쓰레드의 텍스트 친화적 알고리즘에 맞춰 '통념을 부수는 2문장 첫 게시물 + 5개 댓글 타래 연재 + 열린 토론 질문' 구조로 전환해 리포스트와 인용 대화를 폭발시킵니다.`,
      visualConcept: `첫 게시물은 이미지 없이 여백 있는 2문장 텍스트로 시선 집중 + 2번째 타래에 핵심 비교 스크린샷 1장 첨부`,
      outlineSteps: [
        `1. [첫 게시물 (본문)] 업계의 흔한 통념을 정면으로 반박하는 강렬한 2문장 훅 + "타래로 이어집니다 👇"`,
        `2. [타래 1~3] ${cleanTopic} 현장에서 직접 부딪히며 찾은 Before/After 핵심 인사이트 3가지 (각 3줄 이내)`,
        `3. [타래 4] 실제 적용 후 달라진 수치 변화 및 핵심 한 줄 요약`,
        `4. [타래 5 토론 유도] "여러분이 ${cleanTopic} 진행하면서 가장 막혔던 순간은 언제였나요?" 열린 질문으로 댓글 릴레이 유도`,
      ],
      algorithmRationale:
        '쓰레드 알고리즘은 [첫 게시물에 머문 시간]과 [타래(Thread) 완독 및 인용/답글 수]를 가장 높게 평가합니다. 이미지를 없애고 텍스트 여백을 주어 글 자체에 집중하게 만들고, 마지막 타래에 논쟁형 열린 질문을 던지면 알고리즘이 추천 피드에 게시물을 강하게 부스팅합니다.',
      threadsPack: {
        firstPostPunchline: `“${cleanTopic} 하실 때 다들 ‘이것’부터 챙기시죠?\n죄송하지만 그거 다 시간 낭비입니다. 현업에서 직접 깨지고 찾은 진짜 본질 타래로 풉니다 🧵👇”`,
        fiveStepThread: [
          `1/5 첫 번째 고정관념: 화려함보다 단순함이 10배 더 팔립니다.`,
          `2/5 두 번째: 고객은 솔루션에 관심 없습니다. 내 고통이 끝나는지에만 반응합니다.`,
          `3/5 세 번째: ${cleanTopic}에서 가장 중요한 1가지는 '초반 3초'의 명확한 약속입니다.`,
          `4/5 네 번째: 실제 적용 후 전환 지표가 3.4배 상승한 전후 데이터 요약.`,
          `5/5 다섯 번째: 오늘 바로 써먹는 1줄 템플릿과 실행 루틴.`,
        ],
        openDebateQuestion: `“여러분이 ${cleanTopic} 시도하면서 가장 억울했던 실패나 의외의 성공 경험은 무엇이었나요? 댓글로 남겨주시면 제 노하우를 답글로 공유해 드립니다.”`,
      },
    },
    x: {
      targetChannel: 'x',
      title: `${cleanTopic}에 딱 '이 구조' 하나 적용했더니 전환 지표가 3.4배 뛰었습니다. 실제 적용 과정 타래 👇`,
      strategy: `[${sourceMeta.shortLabel} ➔ X(Twitter) 빌드인퍼블릭 & 북마크 타래 이식] 원본의 데이터 검증 포인트를 X 유저들이 가장 열광하는 '구체적 성과 수치 + Before/After 화면 캡처 어노테이션 + 북마크 유도형 압축 타래'로 변환합니다.`,
      visualConcept: `트윗 첨부 이미지: 좌우 2분할 스크린샷 비교 + 핵심 변경 포인트를 가리키는 빨간색 화살표 및 수치 배지 어노테이션`,
      outlineSteps: [
        `1. [첫 트윗] 달성한 구체적 수치 결과 + 변경한 핵심 요소 1가지 요약 + 비교 이미지 2장 첨부`,
        `2. [트윗 2~4] 기존 방식의 문제점 → 가설 설정 → 수정 후 실제 지표 변화 데이터 공개`,
        `3. [트윗 5] 누구나 10분 만에 적용할 수 있는 체크리스트 4항목 정리 (북마크 유도)`,
        `4. [트윗 6 멘션 트리거] "현재 준비 중인 ${cleanTopic} 링크나 한 줄 소개를 멘션으로 남기시면 피드백 드립니다"`,
      ],
      algorithmRationale:
        'X(Twitter) 알고리즘은 단순 좋아요보다 [북마크(저장) 수 × 인용 알티(Quote RT) × 멘션 답글 체인]에 최대 가중치를 둡니다. 구체적인 수치 지표와 Before/After 어노테이션 캡처는 저장 가치를 폭발적으로 높여 탐색 탭 추천을 유도합니다.',
      xPack: {
        highlightTweet: `사이드 프로젝트로 ${cleanTopic} 런칭하고 첫 주에 성과 3.4배 만든 치트키.\n\n복잡한 기능 싹 지우고 고객의 '가장 짜증 나는 순간' 딱 1개만 해결했습니다.\n\n실제 A/B 테스트 지표와 비교 화면 타래로 공개합니다 👇`,
        visualAnnotationTip:
          `좌측: 기존 실패 화면 (빨간색 박스 "주의: 정보 과부하") / 우측: ${cleanTopic} 개선 화면 (초록색 화살표 "핵심 CTA 3.4배 클릭")`,
        bookmarkChecklist: [
          `[ ] 타깃 독자의 '가장 짜증 나는 순간' 1문장 정의`,
          `[ ] 첫 화면에서 3초 만에 결과물 증명`,
          `[ ] 경쟁 대안 대비 뚜렷한 1:1 차별점 제시`,
          `[ ] 지금 즉시 실행 가능한 무료 샘플/템플릿 링크 연결`,
        ],
      },
    },
    instagram: {
      targetChannel: 'instagram',
      title: `[저장 필수] ${cleanTopic}, 상위 1%만 몰래 쓰는 한 줄 디테일 차이 4가지`,
      strategy: `[${sourceMeta.shortLabel} ➔ 인스타그램 릴스/캐러셀 이식] 원본 콘텐츠의 핵심 인사이트를 1.5초 시각적 스크롤 스톱 훅과 8장 완결형 카드뉴스(또는 18초 릴스)로 압축합니다. 캡션 하단 키워드 댓글 트리거(매니챗 DM 연동)로 저장과 댓글을 동시에 폭발시킵니다.`,
      visualConcept: `1장 표지: 극명한 대비를 이루는 2분할 비주얼(왼쪽 빨간색 X vs 오른쪽 초록색 O) + 화면 중앙 강렬한 2줄 타이포그래피`,
      outlineSteps: [
        `1. [1장 / 0~2초 훅] "${cleanTopic}, 아직도 이렇게 하시나요?" 직관적 시각 비교로 스크롤 정지 유도`,
        `2. [2~5장 핵심 대비] 흔히 저지르는 실수 3가지 vs 반응이 터지는 실전 공식 1:1 대조`,
        `3. [6~7장 실전 치트키] 오늘 바로 따라 할 수 있는 빈칸 채우기 공식 제시 (일시정지 및 캡처 유도)`,
        `4. [8장 & 캡션 CTA] "나중에 보려면 [저장] 누르고, 댓글에 '공식' 남기시면 DM으로 전체 요약본 보내드려요!"`,
      ],
      algorithmRationale:
        '인스타그램 릴스/탐색 피드는 [초반 1.5초 이탈률 15% 이하]와 [저장(Save) 대비 도달 비율], [DM 공유 수]를 기준으로 바이럴 계수를 계산합니다. 표지의 시각적 X/O 대조와 캡션의 매니챗 자동 DM 키워드는 댓글과 저장을 동시 달성합니다.',
      instagramPack: {
        coverVisualHook: `1장 표지: 좌측 빨간색 X (기존 흔한 실수) vs 우측 초록색 O (${cleanTopic} 정답 공식) 2분할 고대비 타이포그래피`,
        carouselCards: [
          `1장: "${cleanTopic}, 상위 1%만 아는 비밀 4가지 (저장 필수)"`,
          `2장: 흔히 저지르는 치명적 실수 #1 (원인 분석)`,
          `3장: 해결책 1:1 대조 공식 (Before vs After)`,
          `4장: 실전에서 바로 터지는 황금 치트키 템플릿`,
          `5장: 실제 적용 브랜드 성공 사례 요약`,
          `6장: 빈칸 채우기 가이드 (캡처해서 보관)`,
          `7장: 오늘 당장 실행할 수 있는 액션 플랜 3단계`,
          `8장: [저장] 누르고 댓글에 "가이드" 남기면 무료 PDF 발송!`,
        ],
        autoDmKeywordCta: `댓글에 "${cleanTopic.slice(0, 4)}"을 남겨주시면 DM으로 2026 최신 템플릿 PDF를 즉시 자동 발송해 드립니다!`,
      },
    },
    youtube: {
      targetChannel: 'youtube',
      title: `[실전 공개] ${cleanTopic}, 돈 안 쓰고 성과 3.8배 만든 현실 공식 (실제 템플릿 무료 배포)`,
      strategy: `[${sourceMeta.shortLabel} ➔ 유튜브 롱폼/쇼츠 이식] 원본의 핵심 훅(${post.ai_hook_point.slice(0, 38)}...)을 초반 5초 인트로 내레이션과 화면 분할 썸네일로 변환합니다. "${cleanTopic}"의 Before/After 수치 대비를 전면에 내세워 클릭률(CTR) 9% 이상을 노립니다.`,
      visualConcept: `좌측(어두운 톤): 기존 방식의 실패/비효율 상황 + 붉은색 경고 텍스트 / 우측(고채도): "${cleanTopic}" 도입 후 폭발적 지표 상승 화면 + 노란색 4단어 훅 ("딱 1가지 차이")`,
      outlineSteps: [
        `1. [00:00~00:15 후킹] "${cleanTopic}"에서 90%가 겪는 흔한 실패 통념 파괴 및 결과 지표 선공개`,
        `2. [00:15~02:30 문제 진단] 원본 성공 공식의 비교 구조를 차용해 왜 기존 방식이 안 먹히는지 시각적 증명`,
        `3. [02:30~06:00 핵심 솔루션] ${cleanTopic}에 바로 적용하는 3단계 실전 프레임워크 화면 공유`,
        `4. [06:00~엔딩 댓글 트리거] 고정 댓글에 "본인의 현재 고민을 남기면 맞춤 체크리스트 PDF 발송" CTA 배치`,
      ],
      algorithmRationale:
        '유튜브 알고리즘의 최우선 지표는 [썸네일 클릭률(CTR 8%+)]과 [초반 30초 시청 지속률(65%+)], [평균 시청 지속 시간(AVD)]입니다. 손실 회피 썸네일과 인트로의 즉각적인 결과 공개는 초반 이탈을 막아 추천 알고리즘을 견인합니다.',
      youtubePack: {
        splitThumbnailConcept: `좌측(어두운 회색): “광고비 날리고 실패” (붉은색 X) / 우측(선명한 초록/노랑): “${cleanTopic} 도입 후 3.8배 폭발” (초록색 체크)`,
        intro30sScript: `“아직도 ${cleanTopic} 하실 때 남들 다 하는 옛날 방식 그대로 따라 하고 계신가요? 지난 6개월간 수백 번 실패하며 찾은 진짜 현실 공식, 오늘 영상 하나로 끝내드립니다.”`,
        pinnedCtaLeadMagnet: `📌 고정 댓글: “영상에서 설명드린 ${cleanTopic} 실전 엑셀/노션 템플릿은 아래 구글 드라이브 링크에서 무료로 다운받으실 수 있습니다. 응원 댓글 한 줄 부탁드립니다!”`,
      },
    },
    facebook: {
      targetChannel: 'facebook',
      title: `"처음엔 다들 안 될 거라고 했습니다." ${cleanTopic} 담당자가 광고비 절반 줄이고 오히려 반응 터뜨린 의외의 방법`,
      strategy: `[${sourceMeta.shortLabel} ➔ 페이스북 네이티브 스토리텔링 & 메타 광고 소재 이식] 원본의 핵심 훅을 광고처럼 보이지 않는 '스마트폰 메모장 캡처 / 실제 후기 에피소드' 형태의 네이티브 스토리텔링 포맷으로 재구성하여 그룹 공유와 ROAS를 극대화합니다.`,
      visualConcept: `첫 번째 이미지: 아이폰 기본 메모장 UI에 진솔하게 적힌 핵심 요약 캡처 / 두 번째 이미지: 실제 성과 전후 비교 그래프`,
      outlineSteps: [
        `1. [첫 문단 공감 스토리] 누구나 겪어봤을 법한 생생한 실패 에피소드와 반전 결과로 ‘더보기’ 클릭 유도`,
        `2. [핵심 인사이트] ${cleanTopic}에서 화려한 포장 대신 고객의 진짜 페인포인트 1가지를 파고든 과정 서술`,
        `3. [실전 적용 팁] 당장 내일부터 써먹을 수 있는 3가지 체크포인트 정리`,
        `4. [투표형 댓글 유도] "${cleanTopic}에서 여러분이 가장 중요하게 보는 기준은 몇 번인가요? (1. 가격 2. 시간절감 3. 사후관리)"`,
      ],
      algorithmRationale:
        '페이스북 피드 및 메타(Meta) 광고 알고리즘은 광고 피로도를 회피하는 [네이티브 사용자 경험(UGC 스타일)]과 [장문 스토리텔링 더보기 클릭률], [그룹 공유수]를 높게 평가합니다. 아이폰 메모장 캡처는 광고 거부감을 60% 이상 절감합니다.',
      facebookPack: {
        notepadCaptureConcept: `아이폰 메모장 상단 날짜 표기 + 진솔하게 써 내려간 "${cleanTopic} 담당자의 3개월간의 솔직한 회고록" 손글씨 폰트 그래픽`,
        storylineNarrative: `“지난달까지만 해도 팀 회의에서 고개도 못 들었습니다. 광고비를 쏟아부어도 전환이 안 나오니까요.\n그런데 '딱 이 1가지'를 바꾼 뒤로 기적이 일어났습니다...”`,
        pollVotingDevice: `“${cleanTopic} 도입할 때 여러분이 가장 걸림돌이라고 생각하는 부분은 무엇인가요?\n1. 비용 부담\n2. 세팅의 어려움\n3. 팀원 설득\n댓글로 번호를 남겨주시면 관련 해결 가이드를 보내드립니다.”`,
      },
    },
  };

  return channelAdaptationMap[targetChannel] || channelAdaptationMap.naver_blog;
}

// 숫자 포맷터 (예: 942000 -> 94.2만)
function formatKoreanMetric(num: number): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(num >= 100000 ? 1 : 2).replace(/\.0$/, '')}만`;
  }
  return num.toLocaleString('ko-KR');
}

export default function MarketingLab() {
  // --------------------------------------------------------------------------
  // 1. 좌측 [공부 (Deconstruct)] 상태 관리
  // --------------------------------------------------------------------------
  const [selectedChannel, setSelectedChannel] = useState<SnsChannel>('youtube');
  const [selectedViralFilter, setSelectedViralFilter] = useState<ViralPattern>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [posts, setPosts] = useState<MarketingLabPost[]>(INITIAL_MARKETING_POSTS);
  const [activePostId, setActivePostId] = useState<string>(INITIAL_MARKETING_POSTS[0].id);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);

  // 새 레퍼런스 추가 모달 상태
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false);
  const [newPostTitle, setNewPostTitle] = useState<string>('');
  const [newPostHook, setNewPostHook] = useState<string>('');
  const [newPostAuthor, setNewPostAuthor] = useState<string>('');
  const [newPostViralType, setNewPostViralType] = useState<PostViralType>('spike');
  const [newPostKeywords, setNewPostKeywords] = useState<string>('#트렌드분석, #바이럴공식, #성공사례');

  // --------------------------------------------------------------------------
  // 2. 우측 [연구 (Synthesize)] 상태 관리
  // --------------------------------------------------------------------------
  const [targetChannel, setTargetChannel] = useState<SnsChannel>('naver_blog');
  const [fusionTopic, setFusionTopic] = useState<string>(
    'AI 업무 자동화 노션 템플릿 런칭'
  );
  const [crossMediaStrategy, setCrossMediaStrategy] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customThumbnailConcept, setCustomThumbnailConcept] = useState<string>('');
  const [contentOutline, setContentOutline] = useState<string>('');
  const [memoText, setMemoText] = useState<string>('');
  const [customTagsInput, setCustomTagsInput] = useState<string>(
    '#크로스오버연구, #성공공식이식, #신규콘텐츠기획'
  );
  const [ideaStatus, setIdeaStatus] = useState<'draft' | 'ready' | 'published'>('ready');
  const [blueprint, setBlueprint] = useState<ChannelSpecificBlueprint | null>(null);
  const [algorithmRationale, setAlgorithmRationale] = useState<string>('');

  // 보관함 (Supabase marketing_lab_ideas 연동) 상태
  const [savedIdeas, setSavedIdeas] = useState<MarketingLabIdea[]>(INITIAL_SAVED_IDEAS);
  const [vaultFilterChannel, setVaultFilterChannel] = useState<SnsChannel | 'all'>('all');
  const [isSavingIdea, setIsSavingIdea] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [workspacePulse, setWorkspacePulse] = useState<boolean>(false);

  // 토스트 알림 헬퍼
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  // 현재 선택된 분석 게시글 객체
  const activePost = useMemo(() => {
    return posts.find((p) => p.id === activePostId) || posts[0];
  }, [posts, activePostId]);

  // 현재 활성 채널 메타데이터
  const currentChannelMeta = useMemo(() => {
    return SNS_CHANNELS.find((c) => c.id === selectedChannel) || SNS_CHANNELS[0];
  }, [selectedChannel]);

  const targetChannelMeta = useMemo(() => {
    return SNS_CHANNELS.find((c) => c.id === targetChannel) || SNS_CHANNELS[1];
  }, [targetChannel]);

  // --------------------------------------------------------------------------
  // 3. Supabase 초기 데이터 로드 (환경변수 설정 시 실제 DB 조회)
  // --------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    async function fetchInitialData() {
      if (!IS_SUPABASE_CONFIGURED) return;
      setIsLoadingPosts(true);
      const [dbPosts, dbIdeas] = await Promise.all([
        supabaseRequest<MarketingLabPost[]>(
          'marketing_lab_posts?select=*&order=engagement_rate.desc'
        ),
        supabaseRequest<MarketingLabIdea[]>(
          'marketing_lab_ideas?select=*&order=is_pinned.desc,created_at.desc'
        ),
      ]);
      if (!isMounted) return;
      if (dbPosts && dbPosts.length > 0) {
        const hydratedPosts = dbPosts.map(hydratePostWithDeconstructSpec);
        setPosts(hydratedPosts);
        setActivePostId(hydratedPosts[0].id);
      }
      if (dbIdeas && dbIdeas.length > 0) {
        setSavedIdeas(dbIdeas);
      }
      setIsLoadingPosts(false);
    }
    fetchInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // --------------------------------------------------------------------------
  // 4. 선택된 게시글/타깃채널/소재 변경 시 AI 크로스오버 제안 자동 합성
  // --------------------------------------------------------------------------
  const runAiSynthesis = useCallback(
    (post: MarketingLabPost, target: SnsChannel, topic: string) => {
      const result = generateCrossoverSynthesis(post, target, topic);
      setBlueprint(result);
      setAlgorithmRationale(result.algorithmRationale || '');
      setCrossMediaStrategy(result.strategy);
      setCustomTitle(result.title);
      setCustomThumbnailConcept(result.visualConcept);
      setContentOutline(result.outlineSteps.join('\n'));
    },
    []
  );

  useEffect(() => {
    if (activePost) {
      runAiSynthesis(activePost, targetChannel, fusionTopic);
    }
  }, [activePost, targetChannel, fusionTopic, runAiSynthesis]);

  // --------------------------------------------------------------------------
  // 5. 좌측 게시글 필터링
  // --------------------------------------------------------------------------
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchChannel = post.channel === selectedChannel;
      const matchViral =
        selectedViralFilter === 'all' || post.viral_type === selectedViralFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.hook_copy.toLowerCase().includes(q) ||
        post.keywords.some((k) => k.toLowerCase().includes(q)) ||
        post.author_name.toLowerCase().includes(q);
      return matchChannel && matchViral && matchSearch;
    });
  }, [posts, selectedChannel, selectedViralFilter, searchQuery]);

  // 채널 탭 변경 시 해당 채널의 첫 번째 카드를 자동 선택하고,
  // 크로스오버 효과를 극대화하기 위해 기본 타깃 채널을 다른 채널로 스마트 추천
  const handleSelectChannel = (channel: SnsChannel) => {
    setSelectedChannel(channel);
    const channelPosts = posts.filter((p) => p.channel === channel);
    if (channelPosts.length > 0) {
      setActivePostId(channelPosts[0].id);
    }
    if (targetChannel === channel) {
      const recommendedTarget: Record<SnsChannel, SnsChannel> = {
        youtube: 'naver_blog',
        naver_blog: 'instagram',
        seo_blog: 'threads',
        instagram: 'naver_blog',
        threads: 'youtube',
        x: 'seo_blog',
        facebook: 'instagram',
      };
      setTargetChannel(recommendedTarget[channel]);
    }
  };

  // "이 분석으로 연구하기" 버튼 핸들러 (좌측 -> 우측 워크스페이스 즉시 연동)
  const handleStudyWithPost = (post: MarketingLabPost) => {
    setActivePostId(post.id);
    // 원본 채널과 동일한 타깃 채널이면 가장 시너지가 높은 타깃 채널로 자동 스위칭 제안
    let nextTarget = targetChannel;
    if (post.channel === targetChannel) {
      nextTarget = post.channel === 'instagram' ? 'naver_blog' : 'instagram';
      setTargetChannel(nextTarget);
    }
    runAiSynthesis(post, nextTarget, fusionTopic);
    setWorkspacePulse(true);
    setTimeout(() => setWorkspacePulse(false), 900);

    const srcName =
      SNS_CHANNELS.find((c) => c.id === post.channel)?.shortLabel || post.channel;
    const tgtName =
      SNS_CHANNELS.find((c) => c.id === nextTarget)?.shortLabel || nextTarget;
    showToast(
      `🔬 [${srcName}] 성공 공식이 우측 [${tgtName}] 크로스오버 연구소로 연동되었습니다!`
    );
  };

  // 클립보드 복사 핸들러 (Canvas 및 모든 브라우저 호환)
  const handleCopyText = async (key: string, text: string, label: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedKey(key);
      showToast(`📋 ${label} 내용이 클립보드에 복사되었습니다.`);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 2000);
    } catch {
      showToast('클립보드 복사 중 오류가 발생했습니다.');
    }
  };

  // --------------------------------------------------------------------------
  // 6. 우측 연구 결과 Supabase DB 저장 핸들러 (marketing_lab_ideas)
  // --------------------------------------------------------------------------
  const handleSaveIdeaToDb = async () => {
    if (!activePost) return;
    setIsSavingIdea(true);

    const parsedTags = customTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const newIdeaPayload: Omit<MarketingLabIdea, 'id' | 'created_at'> = {
      source_post_id: activePost.id,
      source_channel: activePost.channel,
      target_channel: targetChannel,
      fusion_topic: fusionTopic.trim() || '나만의 크로스오버 캠페인',
      cross_media_strategy: crossMediaStrategy,
      custom_title: customTitle,
      custom_thumbnail_concept: customThumbnailConcept,
      content_outline: contentOutline,
      algorithm_rationale: algorithmRationale,
      memo:
        memoText.trim() ||
        `[${currentChannelMeta.shortLabel} ➔ ${targetChannelMeta.shortLabel}] 원본 "${activePost.title.slice(0, 28)}..." 후킹 공식 이식 완료`,
      tags: parsedTags.length > 0 ? parsedTags : ['#마케팅연구소', '#크로스오버'],
      is_pinned: false,
      status: ideaStatus,
    };

    // Supabase 연동 시도 후 로컬 상태 동기화
    const dbInserted = await supabaseRequest<MarketingLabIdea[]>(
      'marketing_lab_ideas',
      {
        method: 'POST',
        body: JSON.stringify(newIdeaPayload),
      }
    );

    const savedRecord: MarketingLabIdea =
      dbInserted && dbInserted[0]
        ? dbInserted[0]
        : {
            ...newIdeaPayload,
            id: `idea-${Date.now()}`,
            created_at: new Date().toISOString(),
          };

    setSavedIdeas((prev) => [savedRecord, ...prev]);
    setMemoText('');
    setIsSavingIdea(false);
    showToast(
      IS_SUPABASE_CONFIGURED
        ? '✅ Supabase DB (marketing_lab_ideas)에 연구 아이디어가 저장되었습니다!'
        : '✅ 아이디어 보관함에 저장되었습니다! (Supabase 연결 시 DB에 자동 영구 저장됩니다)'
    );
  };

  // 보관함 아이디어 고정(Pin) 토글
  const handleTogglePinIdea = async (idea: MarketingLabIdea) => {
    const nextPinned = !idea.is_pinned;
    setSavedIdeas((prev) =>
      prev
        .map((item) =>
          item.id === idea.id ? { ...item, is_pinned: nextPinned } : item
        )
        .sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned))
    );
    if (IS_SUPABASE_CONFIGURED) {
      await supabaseRequest(`marketing_lab_ideas?id=eq.${idea.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_pinned: nextPinned }),
      });
    }
    showToast(nextPinned ? '📌 상단에 고정되었습니다.' : '고정이 해제되었습니다.');
  };

  // 보관함 아이디어 삭제
  const handleDeleteIdea = async (id: string) => {
    setSavedIdeas((prev) => prev.filter((item) => item.id !== id));
    if (IS_SUPABASE_CONFIGURED) {
      await supabaseRequest(`marketing_lab_ideas?id=eq.${id}`, {
        method: 'DELETE',
      });
    }
    showToast('🗑️ 보관함에서 아이디어가 삭제되었습니다.');
  };

  // 보관함 아이디어를 우측 편집 워크스페이스로 다시 불러오기
  const handleLoadIdeaToWorkspace = (idea: MarketingLabIdea) => {
    setTargetChannel(idea.target_channel);
    setFusionTopic(idea.fusion_topic);
    setCrossMediaStrategy(idea.cross_media_strategy);
    setCustomTitle(idea.custom_title);
    setCustomThumbnailConcept(idea.custom_thumbnail_concept);
    setContentOutline(idea.content_outline);
    if (idea.algorithm_rationale) {
      setAlgorithmRationale(idea.algorithm_rationale);
    }
    setMemoText(idea.memo);
    setCustomTagsInput(idea.tags.join(', '));
    setIdeaStatus(idea.status);
    showToast('📂 보관된 아이디어를 워크스페이스로 불러왔습니다.');
  };

  // 좌측 새 레퍼런스 등록 핸들러
  const handleAddNewReferencePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostHook.trim()) {
      showToast('포스팅 제목과 후킹 카피를 입력해 주세요.');
      return;
    }

    const tags = newPostKeywords
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const newPostRecord: MarketingLabPost = {
      id: `post-custom-${Date.now()}`,
      channel: selectedChannel,
      viral_type: newPostViralType,
      title: newPostTitle.trim(),
      hook_copy: newPostHook.trim(),
      author_name: newPostAuthor.trim() || `@${selectedChannel}_creator`,
      source_url: 'https://trendcraft.ai',
      views_count: 185000,
      likes_count: 9400,
      comments_count: 720,
      shares_count: 4800,
      engagement_rate: 13.2,
      growth_velocity: '신규 등록 레퍼런스 (+620% 급상승)',
      keywords: tags.length > 0 ? tags : ['#신규레퍼런스', '#바이럴공식'],
      ai_hook_point: `초반 첫 문장("${newPostHook.trim().slice(0, 30)}...")에서 타깃 독자의 구체적 결핍을 즉시 건드려 스크롤 이탈을 방지함.`,
      ai_visual_structure: `${currentChannelMeta.shortLabel} 알고리즘에 최적화된 전후 비교 레이아웃과 핵심 키워드 강조 구조.`,
      ai_comment_trigger:
        '본문 하단에 실무 템플릿/체크리스트 제공 조건부 댓글 참여 장치를 배치해 초기 반응 지수를 견인함.',
      published_at: new Date().toISOString(),
    };

    if (IS_SUPABASE_CONFIGURED) {
      const { id: _unusedId, ...dbPayload } = newPostRecord;
      await supabaseRequest('marketing_lab_posts', {
        method: 'POST',
        body: JSON.stringify(dbPayload),
      });
    }

    setPosts((prev) => [newPostRecord, ...prev]);
    setActivePostId(newPostRecord.id);
    setIsNewPostModalOpen(false);
    setNewPostTitle('');
    setNewPostHook('');
    setNewPostAuthor('');
    showToast(`✨ [${currentChannelMeta.shortLabel}] 신규 성공 사례가 분석 리스트에 추가되었습니다!`);
  };

  // 보관함 필터링된 아이디어 목록
  const filteredSavedIdeas = useMemo(() => {
    if (vaultFilterChannel === 'all') return savedIdeas;
    return savedIdeas.filter(
      (idea) =>
        idea.target_channel === vaultFilterChannel ||
        idea.source_channel === vaultFilterChannel
    );
  }, [savedIdeas, vaultFilterChannel]);

  // 전체 기획안 통합 복사 포맷
  const fullBlueprintMarkdown = useMemo(() => {
    if (!activePost) return '';
    const sections = [
      `# [TrendCraft 마케팅 연구소] 크로스오버 기획안`,
      `- **원본 벤치마킹**: [${currentChannelMeta.shortLabel}] ${activePost.title}`,
      `- **이식 방향**: ${currentChannelMeta.shortLabel} ➔ ${targetChannelMeta.shortLabel}`,
      `- **융합 소재**: ${fusionTopic}`,
      ``,
      `## 💡 알고리즘 반영 근거 (Why this structure)`,
      algorithmRationale || '알고리즘 최적화 분석 기반',
      ``,
      `## 1. 크로스 미디어 이식 공식`,
      crossMediaStrategy,
      ``,
      `## 2. 신규 콘텐츠 / 상품 기획안`,
      `- **추천 제목/후킹 카피**: ${customTitle}`,
      `- **썸네일/비주얼 연출**: ${customThumbnailConcept}`,
      `- **전개 구조 및 댓글 유도**:`,
      contentOutline,
    ];

    if (blueprint?.naverBlogPack && targetChannel === 'naver_blog') {
      sections.push(
        ``,
        `## 3. 네이버 블로그 특화 패키지`,
        `- **스마트블록 제목**: ${blueprint.naverBlogPack.smartblockTitle}`,
        `- **초반 3줄 인용구**:\n${blueprint.naverBlogPack.intro3LineQuotes}`,
        `- **권장 이미지/GIF 프롬프트**:\n${blueprint.naverBlogPack.imageAndGifPrompts}`
      );
    } else if (blueprint?.seoBlogPack && targetChannel === 'seo_blog') {
      sections.push(
        ``,
        `## 3. 구글 SEO 블로그 특화 패키지`,
        `- **E-E-A-T 전략**: ${blueprint.seoBlogPack.eeatStrategy}`,
        `- **H2/H3 계층 목차**:\n${blueprint.seoBlogPack.h2H3Outline.map((h) => `  - ${h}`).join('\n')}`,
        `- **피처드 스니펫 단락**: ${blueprint.seoBlogPack.geoSnippetParagraph}`
      );
    } else if (blueprint?.threadsPack && targetChannel === 'threads') {
      sections.push(
        ``,
        `## 3. 쓰레드(Threads) 특화 패키지`,
        `- **첫 문장 훅**: ${blueprint.threadsPack.firstPostPunchline}`,
        `- **5단 타래 구성**:\n${blueprint.threadsPack.fiveStepThread.map((tp, i) => `  ${i + 1}/5: ${tp}`).join('\n')}`,
        `- **논쟁/토론 유도 질문**: ${blueprint.threadsPack.openDebateQuestion}`
      );
    } else if (blueprint?.xPack && targetChannel === 'x') {
      sections.push(
        ``,
        `## 3. X(트위터) 특화 패키지`,
        `- **수치 강조 단일 훅 트윗**: ${blueprint.xPack.highlightTweet}`,
        `- **비주얼 데이터 요약**: ${blueprint.xPack.visualAnnotationTip}`,
        `- **북마크 유도 체크리스트**:\n${blueprint.xPack.bookmarkChecklist.map((c) => `  - [ ] ${c}`).join('\n')}`
      );
    }

    sections.push(
      ``,
      `## 연구원 메모`,
      memoText || '(메모 없음)'
    );

    return sections.join('\n');
  }, [
    activePost,
    currentChannelMeta,
    targetChannelMeta,
    fusionTopic,
    algorithmRationale,
    crossMediaStrategy,
    customTitle,
    customThumbnailConcept,
    contentOutline,
    blueprint,
    targetChannel,
    memoText,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 text-slate-900 dark:text-slate-100">
      {/* 상단 토스트 알림 배너 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-indigo-500/40 bg-white/95 text-indigo-900 shadow-2xl backdrop-blur-md dark:bg-slate-900/95 dark:text-indigo-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =====================================================================
          섹션 1: 마케팅 연구소 헤더 & 7대 SNS 서브 채널 탭 네비게이션
         ===================================================================== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/90 dark:bg-slate-900/70 dark:shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                <FlaskConical className="h-3.5 w-3.5" />
                MARKETING LAB · DECONSTRUCT &amp; SYNTHESIZE
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Database className="h-3 w-3" />
                {IS_SUPABASE_CONFIGURED
                  ? 'Supabase Live DB 연결됨'
                  : 'Supabase Schema Ready (인메모리 연동 모드)'}
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              7대 SNS 성공 공식 분해 &amp; 크로스오버 재창조 워크스페이스
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              좌측에서 채널별 떡상·스테디·롱테일 공식을 3줄로 해부(공부)하고, 우측에서 내 브랜드 소재와 타 채널 포맷으로 융합(연구)하세요.
            </p>
          </div>

          {/* 요약 카운터 배지 */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center dark:border-slate-800 dark:bg-slate-950/70">
              <div className="text-xs text-slate-500 dark:text-slate-400">분석된 레퍼런스</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{posts.length}건</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-center dark:border-slate-800 dark:bg-slate-950/70">
              <div className="text-xs text-slate-500 dark:text-slate-400">내 아이디어 보관함</div>
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                {savedIdeas.length}건
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsNewPostModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-indigo-600/20 dark:text-indigo-200 dark:hover:bg-indigo-600/30"
            >
              <Plus className="h-4 w-4" />
              새 레퍼런스 등록
            </button>
          </div>
        </div>

        {/* 7대 SNS 서브 채널 탭 바 */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {SNS_CHANNELS.map((channel) => {
            const isSelected = selectedChannel === channel.id;
            const channelCount = posts.filter((p) => p.channel === channel.id).length;
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => handleSelectChannel(channel.id)}
                className={`group relative flex flex-col items-start justify-between rounded-xl border py-3 px-4 text-left transition-all ${
                  isSelected
                    ? `${channel.activeBorder} shadow-md ring-1 ring-indigo-500/20 dark:ring-white/10`
                    : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:border-slate-300 hover:bg-white hover:text-slate-900 dark:border-slate-800/80 dark:bg-slate-950/50 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-1">
                  <span className="text-base font-bold tracking-tight">
                    {channel.shortLabel}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-sm font-semibold ${
                      isSelected
                        ? 'bg-white/25 text-inherit dark:bg-white/15 dark:text-white'
                        : 'bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {channelCount}
                  </span>
                </div>
                <span className="mt-1 text-xs opacity-75">
                  {channel.englishName}
                </span>
                {isSelected && (
                  <span
                    className={`mt-2 h-1 w-full rounded-full bg-gradient-to-r ${channel.accentGradient}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 선택된 채널의 핵심 알고리즘 공략 요약 바 */}
        <div className="mt-3 flex flex-col justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800/80 dark:bg-slate-950/60 dark:text-slate-300 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md border px-2.5 py-1 text-xs font-bold ${currentChannelMeta.badgeColor}`}
            >
              {currentChannelMeta.label} 핵심 알고리즘
            </span>
            <span className="text-slate-800 font-medium dark:text-slate-200">{currentChannelMeta.algorithmFocus}</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400">
            권장 포맷: <strong className="text-slate-900 font-bold dark:text-slate-100">{currentChannelMeta.keyFormat}</strong>
          </div>
        </div>
      </div>

      {/* =====================================================================
          섹션 2: 메인 2-단 레이아웃 (좌측: 공부/Deconstruct | 우측: 연구/Synthesize)
         ===================================================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* -------------------------------------------------------------------
            [좌측 6칸] SNS 성공 공식 분해 (공부 / Deconstruct)
           ------------------------------------------------------------------- */}
        <div className="flex flex-col gap-4 xl:col-span-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/70 dark:shadow-lg">
            {/* 패널 헤더 */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      좌측: SNS 성공 공식 분해 (공부 / Deconstruct)
                    </h3>
                    <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-300 border border-amber-500/20">
                      STEP 1
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    왜 터졌을까? 조회수 폭발 지표와 AI 3줄 성공 요인(후킹·비주얼·댓글 장치)을 해부합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 바이럴 패턴 3대 필터 (Spike / Steady / Long-tail) + 검색창 */}
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {VIRAL_PATTERNS.map((pattern) => {
                  const isActive = selectedViralFilter === pattern.id;
                  return (
                    <button
                      key={pattern.id}
                      type="button"
                      onClick={() => setSelectedViralFilter(pattern.id)}
                      className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition ${
                        isActive
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-500/15 dark:text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-bold">{pattern.label}</span>
                      <span className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-400">
                        {pattern.subLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 키워드/카피 검색 입력 */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`${currentChannelMeta.shortLabel} 내 제목, 후킹 카피, 해시태그 검색...`}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:bg-slate-950"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    초기화
                  </button>
                )}
              </div>
            </div>

            {/* 게시글 분석 카드 리스트 */}
            <div className="mt-4 space-y-4">
              {isLoadingPosts ? (
                <div className="flex items-center justify-center py-12 text-sm text-slate-500 dark:text-slate-400">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin text-indigo-500" />
                  분석 데이터를 불러오는 중...
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center dark:border-slate-800 dark:bg-slate-950/40">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    선택한 필터 조건에 해당하는 분석 게시글이 없습니다.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    바이럴 필터를 ‘전체 패턴’으로 전환하거나 상단의 [새 레퍼런스 등록] 버튼을 눌러 추가해 보세요.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedViralFilter('all');
                      setSearchQuery('');
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                  >
                    전체 패턴 보기
                  </button>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isSelected = post.id === activePost?.id;
                  const viralMeta =
                    VIRAL_PATTERNS.find((v) => v.id === post.viral_type) ||
                    VIRAL_PATTERNS[1];
                  const chSpec =
                    CHANNEL_DEFAULT_DECONSTRUCT_SPECS[post.channel] ||
                    CHANNEL_DEFAULT_DECONSTRUCT_SPECS.youtube;

                  const keywordPlacement =
                    post.title_keyword_placement || chSpec.title_keyword_placement;
                  const hookType = post.title_hook_type || chSpec.title_hook_type;
                  const imageCount = post.image_count_info || chSpec.image_count_info;
                  const charCount = post.char_count ?? chSpec.char_count;
                  const durationOrSlides =
                    post.content_duration_or_slides || chSpec.content_duration_or_slides;
                  const formula = post.unique_sns_formula || chSpec.unique_sns_formula;

                  return (
                    <div
                      key={post.id}
                      className={`group rounded-2xl border p-5 transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/40 shadow-md ring-1 ring-indigo-500/30 dark:bg-slate-900/95 dark:shadow-xl dark:ring-indigo-500/40'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-sm dark:border-slate-800/90 dark:bg-slate-950/60 dark:hover:border-slate-700 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      {/* 카드 상단 메타 배지 & 폭발 지표 */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${viralMeta.badgeStyle}`}
                          >
                            {viralMeta.label}
                          </span>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {post.author_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <TrendingUp className="h-3 w-3" />
                            반응지수 {post.engagement_rate}% · {post.growth_velocity}
                          </span>
                        </div>
                      </div>

                      {/* 포스팅 제목 & 원문 링크 */}
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <h4 className="text-xl font-bold leading-snug text-slate-900 dark:text-white flex-1">
                          {post.title}
                        </h4>
                        {/* 원문 상세 링크 (유효 링크 시 새 창 이동, 비어있거나 메인 홈 링크 시 비활성화 툴팁) */}
                        {isValidDetailSourceUrl(post.source_url) ? (
                          <a
                            href={post.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-indigo-400 hover:bg-slate-200 hover:text-slate-900 transition-all shadow-sm dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-800 dark:hover:text-white"
                            title="실제 원문 게시글 새창으로 열기"
                          >
                            <span>원문 링크</span>
                            <ExternalLink className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast('ℹ️ 해당 레퍼런스의 상세 원문 링크를 확인·수집 중입니다.');
                            }}
                            className="inline-flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-slate-100/60 px-3 py-1.5 text-xs font-medium text-slate-400 opacity-80 dark:border-slate-700/80 dark:bg-slate-800/40 dark:text-slate-500 transition-opacity hover:opacity-100"
                            title="상세 원문 페이지 링크 준비 중 (클릭 시 안내)"
                          >
                            <span>원문 준비 중</span>
                            <ExternalLink className="h-3.5 w-3.5 opacity-40" />
                          </button>
                        )}
                      </div>

                      {/* 제목 방식 정밀 분석: 키워드 배치 & 후킹 기법 뱃지 */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-300">
                          <Type className="h-3.5 w-3.5" />
                          키워드: {
                            keywordPlacement === 'front'
                              ? '전면 배치 (검색·주목도 극대화)'
                              : keywordPlacement === 'middle'
                              ? '중간 배치 (맥락 자연 유도)'
                              : '후면 배치 (호기심 유발 후 반전)'
                          }
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-fuchsia-500/30 bg-fuchsia-50 px-2.5 py-1 text-xs font-semibold text-fuchsia-800 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
                          <Target className="h-3.5 w-3.5" />
                          후킹 기법: {hookType}
                        </span>
                      </div>

                      {/* 콘텐츠 볼륨 스펙 뱃지 바 (이미지 장수, 공백 제외 글자수, 영상 재생시간/슬라이드) */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-800/80 dark:bg-slate-900/70">
                        <span className="font-bold text-slate-600 dark:text-slate-400 mr-1 flex items-center gap-1.5">
                          <Cpu className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                          콘텐츠 볼륨 스펙:
                        </span>
                        {imageCount && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700 shadow-xs dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-200">
                            <ImageIcon className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                            {imageCount}
                          </span>
                        )}
                        {charCount !== undefined && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700 shadow-xs dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-200">
                            <AlignLeft className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                            공백 제외 {charCount.toLocaleString('ko-KR')}자
                          </span>
                        )}
                        {durationOrSlides && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-700 shadow-xs dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-200">
                            <Clock className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                            {durationOrSlides}
                          </span>
                        )}
                      </div>

                      {/* 후킹 카피 인용 박스 */}
                      <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50/80 p-4 dark:border-amber-500/25 dark:bg-amber-500/5">
                        <div className="flex items-center justify-between text-sm font-semibold text-amber-800 dark:text-amber-300">
                          <span>⚡ 초반 3초 / 첫 문장 후킹 카피</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(
                                `hook-${post.id}`,
                                post.hook_copy,
                                '후킹 카피'
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 dark:text-slate-400 dark:hover:text-amber-200"
                          >
                            {copiedKey === `hook-${post.id}` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            복사
                          </button>
                        </div>
                        <p className="mt-2 text-base font-medium leading-relaxed text-amber-950 dark:text-amber-100">
                          {post.hook_copy}
                        </p>
                      </div>

                      {/* 조회수 / 반응 폭발 지표 4단 그리드 */}
                      <div className="mt-3 grid grid-cols-4 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center dark:border-slate-800/80 dark:bg-slate-950/80">
                        <div>
                          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Eye className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                            조회/도달
                          </div>
                          <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                            {formatKoreanMetric(post.views_count)}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Heart className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                            좋아요/공감
                          </div>
                          <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                            {formatKoreanMetric(post.likes_count)}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <MessageSquare className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                            댓글/토론
                          </div>
                          <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                            {formatKoreanMetric(post.comments_count)}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Share2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                            공유/저장
                          </div>
                          <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                            {formatKoreanMetric(post.shares_count)}
                          </div>
                        </div>
                      </div>

                      {/* 사용된 해시태그 / 키워드 */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        {post.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      {/* AI 성공 요인 분해 (왜 터졌을까? 3줄 분석) */}
                      <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 space-y-3 dark:border-indigo-500/25 dark:bg-indigo-950/20">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-indigo-800 dark:text-indigo-300">
                          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          AI 성공 요인 분해 (왜 터졌을까? 3줄 핵심 해부)
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex items-start gap-2.5">
                            <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-sm font-bold text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30">
                              <Lightbulb className="h-3.5 w-3.5" />
                              후킹 포인트
                            </span>
                            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                              {post.ai_hook_point}
                            </p>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-sm font-bold text-sky-700 border border-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:border-sky-500/30">
                              <LayoutTemplate className="h-3.5 w-3.5" />
                              비주얼 구조
                            </span>
                            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                              {post.ai_visual_structure}
                            </p>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-sm font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
                              <MessageCircleQuestion className="h-3.5 w-3.5" />
                              댓글 유도 장치
                            </span>
                            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                              {post.ai_comment_trigger}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* [이 SNS만의 고유 성공 공식] 전용 박스 */}
                      {formula && (
                        <div className="mt-4 rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50/80 via-purple-50/40 to-white p-4 shadow-xs dark:border-violet-500/35 dark:from-violet-950/40 dark:via-purple-950/20 dark:to-slate-900/60 dark:shadow-sm">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-violet-100 text-xs font-bold text-violet-700 border border-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/30">
                                ★
                              </span>
                              <span className="text-sm font-bold text-violet-900 dark:text-violet-200">
                                {formula.name || formula.title}
                              </span>
                            </div>
                            <span className="rounded-full border border-violet-200 bg-violet-100/80 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:border-violet-500/40 dark:bg-violet-900/40 dark:text-violet-300">
                              채널 고유 성공 문법
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                            {formula.core_logic || formula.strategy}
                          </p>
                          {(formula.algorithm_factor || formula.coreMetric) && (
                            <div className="mt-2.5 flex items-start gap-1.5 text-xs text-violet-800 dark:text-violet-300/90 pt-2 border-t border-violet-200/80 dark:border-violet-900/40">
                              <span className="shrink-0 font-bold text-violet-700 dark:text-violet-300">알고리즘 반영 요소:</span>
                              <span className="text-slate-600 dark:text-slate-300">
                                {formula.algorithm_factor || formula.coreMetric}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 카드 하단 액션 버튼: "이 분석으로 연구하기" */}
                      <div className="mt-4 flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {isSelected
                            ? '✅ 현재 우측 연구 워크스페이스에 연동됨'
                            : '우측 워크스페이스로 데이터를 보내 내 콘텐츠로 재창조합니다.'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStudyWithPost(post)}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500'
                              : 'border border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white'
                          }`}
                        >
                          <span>이 분석으로 연구하기</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            [우측 6칸] 나만의 크로스오버 재창조 워크스페이스 (연구 / Synthesize)
           ------------------------------------------------------------------- */}
        <div className="flex flex-col gap-4 xl:col-span-6">
          <div
            className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 dark:bg-slate-900/70 dark:shadow-lg ${
              workspacePulse
                ? 'border-indigo-400 ring-2 ring-indigo-500/50'
                : 'border-slate-200 dark:border-slate-800/90'
            }`}
          >
            {/* 패널 헤더 */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/30">
                  <Wand2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      우측: 나만의 크로스오버 재창조 워크스페이스 (연구 / Synthesize)
                    </h3>
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30">
                      STEP 2
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    선택된 SNS 성공 공식을 다른 미디어 채널과 내 브랜드 소재에 이식하여 새로운 기획안을 완성합니다.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleCopyText(
                    'full-blueprint',
                    fullBlueprintMarkdown,
                    '전체 연구 기획안(Markdown)'
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-400 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:border-indigo-500/50 dark:hover:text-white"
              >
                {copiedKey === 'full-blueprint' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                )}
                전체 기획안 복사
              </button>
            </div>

            {/* 현재 연동된 원본 레퍼런스 요약 배너 */}
            {activePost && (
              <div className="mt-4 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 via-slate-50 to-white p-4 dark:border-indigo-500/30 dark:from-indigo-950/60 dark:via-slate-900/90 dark:to-slate-900/90">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30">
                      연동된 원본 DNA
                    </span>
                    <span
                      className={`rounded-md border px-2.5 py-0.5 text-xs font-bold ${currentChannelMeta.badgeColor}`}
                    >
                      {currentChannelMeta.shortLabel}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span
                      className={`rounded-md border px-2.5 py-0.5 text-xs font-bold ${targetChannelMeta.badgeColor}`}
                    >
                      {targetChannelMeta.shortLabel} 이식
                    </span>
                  </div>
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">
                    원본 반응지수 {activePost.engagement_rate}% 검증 공식
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  “{activePost.title}”
                </p>
              </div>
            )}

            {/* 최적 궁합 SNS 추천 시스템 (Cross-Match Recommender) */}
            {(() => {
              const activeRecTargets =
                activePost?.recommended_targets && activePost.recommended_targets.length > 0
                  ? activePost.recommended_targets
                  : activePost
                  ? (CHANNEL_DEFAULT_DECONSTRUCT_SPECS[activePost.channel] || CHANNEL_DEFAULT_DECONSTRUCT_SPECS.youtube).recommended_targets
                  : [];

              if (activeRecTargets.length === 0) return null;

              return (
                <div className="mt-3.5 rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50/80 via-indigo-50/40 to-white p-4 shadow-xs dark:border-sky-500/35 dark:from-sky-950/40 dark:via-indigo-950/30 dark:to-slate-900/60 dark:shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                      <span className="text-sm font-bold text-sky-900 dark:text-sky-200">
                        최적 궁합 SNS 추천 (Cross-Match Recommender)
                      </span>
                    </div>
                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800 border border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30">
                      [{currentChannelMeta.shortLabel}] DNA 기반 분석
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {activeRecTargets.map((rec) => {
                      const recChannel = rec.targetChannel || rec.target_channel || 'naver_blog';
                      const targetMeta =
                        SNS_CHANNELS.find((c) => c.id === recChannel) || SNS_CHANNELS[0];
                      const isCurrentlyTarget = targetChannel === recChannel;

                      return (
                        <button
                          key={recChannel}
                          type="button"
                          onClick={() => {
                            setTargetChannel(recChannel);
                            showToast(`🎯 타깃 채널을 추천 SNS [${targetMeta.shortLabel}]로 전환했습니다.`);
                          }}
                          className={`group text-left rounded-xl border p-3.5 transition-all ${
                            isCurrentlyTarget
                              ? 'border-sky-500 bg-sky-50/90 ring-1 ring-sky-500/50 shadow-sm dark:border-sky-400 dark:bg-sky-900/40'
                              : 'border-slate-200 bg-white hover:border-sky-400 hover:bg-sky-50/50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-sky-500/50 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${targetMeta.badgeColor}`}
                            >
                              {targetMeta.shortLabel} 이식 추천
                            </span>
                            <span className="text-xs font-bold text-sky-600 dark:text-sky-300 group-hover:underline">
                              {isCurrentlyTarget ? '✓ 선택됨' : '적용하기 →'}
                            </span>
                          </div>
                          <p className="mt-2 text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                            {rec.reason}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* 컨트롤 박스: "어떤 채널/소재와 융합할 것인가?" */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4 dark:border-slate-800 dark:bg-slate-950/70">
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-700 dark:text-indigo-300">
                <SlidersHorizontal className="h-4 w-4" />
                어떤 채널 · 소재와 융합할 것인가? (Crossover Parameter)
              </div>

              {/* 1) 이식할 타깃 SNS 채널 선택 */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  ① 이식할 타깃 채널 선택 (원본: {currentChannelMeta.shortLabel} ➔ 타깃: {targetChannelMeta.shortLabel})
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                  {SNS_CHANNELS.map((ch) => {
                    const isTarget = targetChannel === ch.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setTargetChannel(ch.id)}
                        className={`rounded-xl border px-3.5 py-2.5 text-base font-bold transition ${
                          isTarget
                            ? `${ch.activeBorder} shadow-sm`
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        {ch.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2) 융합할 내 브랜드/상품/주제 소재 입력 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    ② 융합할 내 콘텐츠 소재 / 상품 / 캠페인 주제
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (activePost) {
                        runAiSynthesis(activePost, targetChannel, fusionTopic);
                        showToast('✨ 입력하신 소재로 AI 크로스오버 기획안을 재합성했습니다!');
                      }
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    AI 제안 다시 생성
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fusionTopic}
                    onChange={(e) => setFusionTopic(e.target.value)}
                    placeholder="예: 성수동 비건 베이커리 팝업, AI 회의록 SaaS 런칭, 스마트스토어 조명..."
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-base font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                  />
                </div>
                {/* 빠른 프리셋 칩 */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 mr-1 font-medium">빠른 소재 적용:</span>
                  {QUICK_FUSION_TOPICS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFusionTopic(preset)}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        fusionTopic === preset
                          ? 'border-indigo-400 bg-indigo-50 text-indigo-700 font-bold dark:border-indigo-500/60 dark:bg-indigo-500/20 dark:text-indigo-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------------
                💡 왜 이 구조로 작성해야 하는가? (알고리즘 반영 이유) 전용 박스
               --------------------------------------------------------------- */}
            {algorithmRationale && (
              <div className="mt-4 rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50/90 via-slate-50/60 to-white p-4 shadow-xs dark:border-amber-500/35 dark:from-amber-950/30 dark:via-slate-900/80 dark:to-slate-900/80 dark:shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30">
                      💡
                    </span>
                    <h4 className="text-base font-bold text-amber-900 dark:text-amber-200">
                      왜 이 구조로 작성해야 하는가? (알고리즘 반영 이유)
                    </h4>
                  </div>
                  <span className="rounded-full border border-amber-300 bg-amber-100/80 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                    {targetChannelMeta.shortLabel} 알고리즘 문법 반영
                  </span>
                </div>
                <p className="mt-2.5 text-sm font-medium leading-relaxed text-amber-950 dark:text-amber-100/90 whitespace-pre-line">
                  {algorithmRationale}
                </p>
              </div>
            )}

            {/* ---------------------------------------------------------------
                AI 제안 카드 1) 크로스 미디어 이식 (Cross-Media Adaptation)
               --------------------------------------------------------------- */}
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-3 dark:border-emerald-500/30 dark:bg-emerald-950/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-800 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300">
                    1
                  </span>
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    크로스 미디어 이식 공식 ({currentChannelMeta.shortLabel} ➔{' '}
                    {targetChannelMeta.shortLabel})
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      'card-cross-media',
                      crossMediaStrategy,
                      '크로스 미디어 이식 전략'
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
                >
                  {copiedKey === 'card-cross-media' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  복사
                </button>
              </div>
              <textarea
                rows={3}
                value={crossMediaStrategy}
                onChange={(e) => setCrossMediaStrategy(e.target.value)}
                className="w-full rounded-xl border border-emerald-200 bg-white p-3.5 text-base font-medium leading-relaxed text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-emerald-500/20 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-emerald-400"
              />
            </div>

            {/* ---------------------------------------------------------------
                AI 제안 카드 2) 신규 콘텐츠 / 상품 기획 (New Content Planning)
               --------------------------------------------------------------- */}
            <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 space-y-4 dark:border-indigo-500/30 dark:bg-indigo-950/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-800 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300">
                    2
                  </span>
                  <h4 className="text-base font-bold text-indigo-900 dark:text-indigo-200">
                    신규 콘텐츠 · 상품 기획안 (제목 / 썸네일 / 전개 구조)
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      'card-content-plan',
                      `[제목]\n${customTitle}\n\n[썸네일/비주얼]\n${customThumbnailConcept}\n\n[전개 구조]\n${contentOutline}`,
                      '신규 콘텐츠 기획안'
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-800 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                >
                  {copiedKey === 'card-content-plan' ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  기획안 복사
                </button>
              </div>

              {/* 맞춤형 제목 / 후킹 카피 */}
              <div>
                <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">
                  🎯 배운 요소를 적용한 나만의 제목 / 첫 줄 후킹 카피
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-lg font-bold text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-white"
                />
              </div>

              {/* 썸네일 / 비주얼 구조 */}
              <div>
                <label className="block text-sm font-semibold text-sky-900 dark:text-sky-300 mb-1.5">
                  🖼️ 나만의 썸네일 / 비주얼 레이아웃 연출안
                </label>
                <textarea
                  rows={2}
                  value={customThumbnailConcept}
                  onChange={(e) => setCustomThumbnailConcept(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-base font-medium leading-relaxed text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100"
                />
              </div>

              {/* 본문/영상 4단 전개 구조 */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 dark:text-amber-300 mb-1.5">
                  📐 본문 · 영상 4단 전개 구조 &amp; 댓글 트리거 설계
                </label>
                <textarea
                  rows={4}
                  value={contentOutline}
                  onChange={(e) => setContentOutline(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-base font-medium leading-relaxed text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100"
                />
              </div>
            </div>

            {/* ---------------------------------------------------------------
                [신규] 타깃 채널별 100% 맞춤형 특화 콘텐츠 기획서 (Channel-Specific Pack)
               --------------------------------------------------------------- */}
            {/* ---------------------------------------------------------------
                [신규] 타깃 채널별 100% 맞춤형 특화 콘텐츠 기획서 (Channel-Specific Pack)
               --------------------------------------------------------------- */}
            {blueprint && (
              <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50/60 p-4 space-y-4 dark:border-sky-500/30 dark:bg-sky-950/15">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-sky-200/80 dark:border-sky-800/40">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sm font-bold text-sky-700 border border-sky-200 dark:bg-sky-500/20 dark:text-sky-300">
                      ★
                    </span>
                    <h4 className="text-base font-bold text-sky-900 dark:text-sky-200">
                      [{targetChannelMeta.label}] 100% 맞춤형 알고리즘 최적화 패키지
                    </h4>
                  </div>
                  <span className="rounded-full border border-sky-200 bg-sky-100/80 px-2.5 py-0.5 text-xs font-semibold text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">
                    전용 알고리즘 문법 탑재
                  </span>
                </div>

                {/* 네이버 블로그 특화 팩 */}
                {targetChannel === 'naver_blog' && blueprint.naverBlogPack && (
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        🟢 네이버 스마트블록 노출형 제목
                      </span>
                      <div className="mt-1 rounded-lg border border-emerald-200 bg-white p-2.5 text-sm font-bold text-slate-900 dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-white">
                        {blueprint.naverBlogPack.smartblockTitle}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        ⚡ DIA+ 체류시간 부스팅 초반 3줄 인용구
                      </span>
                      <div className="mt-1 rounded-lg border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-800 whitespace-pre-line font-medium dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200">
                        {blueprint.naverBlogPack.intro3LineQuotes}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        🖼️ 권장 이미지 장수 및 이미지/GIF 프롬프트
                      </span>
                      <div className="mt-1 rounded-lg border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-800 whitespace-pre-line font-medium dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200">
                        {blueprint.naverBlogPack.imageAndGifPrompts}
                      </div>
                    </div>
                  </div>
                )}

                {/* 구글 SEO 블로그 특화 팩 */}
                {targetChannel === 'seo_blog' && blueprint.seoBlogPack && (
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                        🔍 E-E-A-T 전문성 기둥 (Experience · Expertise · Authoritativeness · Trust)
                      </span>
                      <div className="mt-1.5 rounded-lg border border-blue-200 bg-white p-3 text-sm leading-relaxed text-slate-800 font-medium whitespace-pre-line dark:border-blue-500/30 dark:bg-blue-950/30 dark:text-blue-100">
                        {blueprint.seoBlogPack.eeatStrategy}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                        📑 구글 검색 크롤러 최적화 H2 / H3 계층 목차
                      </span>
                      <div className="mt-1.5 space-y-1.5 rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950/80">
                        {blueprint.seoBlogPack.h2H3Outline.map((item, idx) => (
                          <div
                            key={idx}
                            className={`font-mono text-xs ${
                              item.startsWith('H2')
                                ? 'font-bold text-blue-700 dark:text-blue-300'
                                : 'pl-4 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                        🎯 40~50단어 피처드 스니펫 &amp; GEO(생성형 검색) 타깃 단락
                      </span>
                      <div className="mt-1 rounded-lg border border-blue-200 bg-white p-3 text-sm leading-relaxed text-slate-800 font-medium dark:border-blue-500/30 dark:bg-blue-950/20 dark:text-blue-100">
                        {blueprint.seoBlogPack.geoSnippetParagraph}
                      </div>
                    </div>
                  </div>
                )}

                {/* 쓰레드(Threads) 특화 팩 */}
                {targetChannel === 'threads' && blueprint.threadsPack && (
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                        ⚡ 타래 첫 문장 스크롤 스토퍼 (줄바꿈 최적화)
                      </span>
                      <div className="mt-1 rounded-lg border border-rose-200 bg-white p-3 text-sm font-bold text-slate-900 whitespace-pre-line leading-relaxed dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-white">
                        {blueprint.threadsPack.firstPostPunchline}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                        🧵 5단 스레드 타래 분할 전개 (Thread Posts)
                      </span>
                      <div className="mt-2 space-y-2">
                        {blueprint.threadsPack.fiveStepThread.map((postText, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-800 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200"
                          >
                            <span className="inline-block mb-1 font-bold text-rose-600 dark:text-rose-400">
                              타래 [{idx + 1}/5]
                            </span>
                            <p className="whitespace-pre-line font-medium">{postText}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                        💬 댓글/타래 논쟁 유도 질문 (Threads 알고리즘 핵심)
                      </span>
                      <div className="mt-1 rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-sm font-semibold text-rose-900 dark:border-rose-500/20 dark:bg-rose-950/20 dark:text-rose-200">
                        {blueprint.threadsPack.openDebateQuestion}
                      </div>
                    </div>
                  </div>
                )}

                {/* X(트위터) 특화 팩 */}
                {targetChannel === 'x' && blueprint.xPack && (
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          𝕏 280자 수치 강조 단일 훅 트윗
                        </span>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          {blueprint.xPack.highlightTweet.length}자
                        </span>
                      </div>
                      <div className="mt-1 rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 whitespace-pre-line leading-relaxed dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                        {blueprint.xPack.highlightTweet}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        📊 비주얼 데이터 어노테이션 (인포그래픽 / 캡처 가이드)
                      </span>
                      <div className="mt-1 rounded-lg border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-700 font-medium dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
                        {blueprint.xPack.visualAnnotationTip}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        📌 북마크 유도 5단 체크리스트
                      </span>
                      <div className="mt-2 space-y-1.5 rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-950/80">
                        {blueprint.xPack.bookmarkChecklist.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">✔</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 인스타그램 특화 팩 */}
                {targetChannel === 'instagram' && blueprint.instagramPack && (
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-xs font-bold text-pink-700 dark:text-pink-400">
                        📸 10장 카드뉴스 슬라이드 워크플로우
                      </span>
                      <div className="mt-2 space-y-1.5 rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-950/80">
                        {blueprint.instagramPack.carouselCards.map((slide, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-800 dark:text-slate-200">
                            <span className="shrink-0 rounded bg-pink-100 px-1.5 py-0.5 text-xs font-bold text-pink-700 dark:bg-pink-500/20 dark:text-pink-300">
                              {idx + 1}장
                            </span>
                            <span className="leading-relaxed">{slide}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-pink-700 dark:text-pink-400">
                        💬 댓글 / DM 자동화(ManyChat) 유도 트리거
                      </span>
                      <div className="mt-1 rounded-lg border border-pink-200 bg-pink-50/80 p-2.5 text-sm font-bold text-pink-900 dark:border-pink-500/30 dark:bg-pink-950/30 dark:text-pink-200">
                        {blueprint.instagramPack.autoDmKeywordCta}
                      </div>
                    </div>
                  </div>
                )}

                {/* 유튜브 특화 팩 */}
                {targetChannel === 'youtube' && blueprint.youtubePack && (
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-xs font-bold text-red-700 dark:text-red-400">
                        🎬 0~30초 이탈 방지 훅 스크립트
                      </span>
                      <div className="mt-1 rounded-lg border border-red-200 bg-white p-3 text-sm font-bold text-slate-900 whitespace-pre-line leading-relaxed dark:border-red-500/30 dark:bg-red-950/30 dark:text-white">
                        {blueprint.youtubePack.intro30sScript}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-red-700 dark:text-red-400">
                        ⏱️ 분할 썸네일 연출 기법
                      </span>
                      <div className="mt-1 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-700 font-medium dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300">
                        {blueprint.youtubePack.splitThumbnailConcept}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-red-700 dark:text-red-400">
                        📌 고정 댓글 리드 마그넷 트리거
                      </span>
                      <div className="mt-1 rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-xs text-red-700 font-semibold dark:border-slate-700 dark:bg-slate-900 dark:text-red-200">
                        {blueprint.youtubePack.pinnedCtaLeadMagnet}
                      </div>
                    </div>
                  </div>
                )}

                {/* 페이스북 특화 팩 */}
                {targetChannel === 'facebook' && blueprint.facebookPack && (
                  <div className="space-y-3.5">
                    <div>
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                        👥 공감형 스토리라인 &amp; 문제 제기
                      </span>
                      <div className="mt-1 rounded-lg border border-blue-200 bg-white p-3 text-sm font-medium text-slate-800 whitespace-pre-line leading-relaxed dark:border-blue-500/30 dark:bg-blue-950/30 dark:text-slate-100">
                        {blueprint.facebookPack.storylineNarrative}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                        🔗 투표 참여 및 공유 유도 CTA
                      </span>
                      <div className="mt-1 rounded-lg border border-blue-200 bg-blue-50/70 p-2.5 text-sm font-bold text-blue-900 dark:border-blue-500/20 dark:bg-blue-950/20 dark:text-blue-200">
                        {blueprint.facebookPack.pollVotingDevice}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ---------------------------------------------------------------
                AI 제안 카드 3) 메모 & 아이디어 보관함 (Supabase DB 저장 및 클립보드 복사)
               --------------------------------------------------------------- */}
            <div className="mt-4 rounded-xl border border-purple-200 bg-purple-50/60 p-4 space-y-3 dark:border-purple-500/30 dark:bg-purple-950/15">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-sm font-bold text-purple-800 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-300">
                    3
                  </span>
                  <h4 className="text-base font-bold text-purple-900 dark:text-purple-200">
                    메모 &amp; 아이디어 보관함 (Supabase DB 저장 · 클립보드 지원)
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={ideaStatus}
                    onChange={(e) =>
                      setIdeaStatus(
                        e.target.value as 'draft' | 'ready' | 'published'
                      )
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-purple-500 focus:outline-none font-medium dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="draft">📝 초안 (Draft)</option>
                    <option value="ready">🚀 발행 준비 (Ready)</option>
                    <option value="published">✅ 발행 완료 (Published)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    연구 메모 / 실행 액션 아이템
                  </label>
                  <input
                    type="text"
                    value={memoText}
                    onChange={(e) => setMemoText(e.target.value)}
                    placeholder="예: 금요일 오전 9시 스마트블록 발행, 매니챗 키워드 '조명' 세팅..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:placeholder-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    분류 태그 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={customTagsInput}
                    onChange={(e) => setCustomTagsInput(e.target.value)}
                    placeholder="#크로스오버, #릴스이식, #상세페이지"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      'vault-quick-copy',
                      fullBlueprintMarkdown,
                      '아이디어 전체 기획안'
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-white"
                >
                  <Copy className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  클립보드 복사
                </button>
                <button
                  type="button"
                  disabled={isSavingIdea}
                  onClick={handleSaveIdeaToDb}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50"
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  {isSavingIdea
                    ? 'Supabase 저장 중...'
                    : '보관함에 아이디어 저장 (Supabase DB)'}
                </button>
              </div>

              {/* 저장된 아이디어 보관함 리스트 */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                    📚 저장된 내 아이디어 보관함 ({filteredSavedIdeas.length}건)
                  </span>
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setVaultFilterChannel('all')}
                      className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                        vaultFilterChannel === 'all'
                          ? 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      전체
                    </button>
                    {SNS_CHANNELS.map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setVaultFilterChannel(ch.id)}
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                          vaultFilterChannel === ch.id
                            ? 'bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/40'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        {ch.shortLabel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-80 space-y-2.5 overflow-y-auto pr-1">
                  {filteredSavedIdeas.map((idea) => {
                    const srcMeta = SNS_CHANNELS.find(
                      (c) => c.id === idea.source_channel
                    );
                    const tgtMeta = SNS_CHANNELS.find(
                      (c) => c.id === idea.target_channel
                    );
                    return (
                      <div
                        key={idea.id}
                        className={`rounded-xl border p-3.5 transition ${
                          idea.is_pinned
                            ? 'border-amber-400 bg-amber-50/50 dark:border-amber-500/40 dark:bg-slate-900/95'
                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/75 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            {idea.is_pinned && (
                              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-transparent">
                                📌 고정
                              </span>
                            )}
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {srcMeta?.shortLabel} ➔ {tgtMeta?.shortLabel}
                            </span>
                            <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
                              {idea.fusion_topic}
                            </span>
                            <span
                              className={`rounded px-2 py-0.5 text-xs font-semibold ${
                                idea.status === 'ready'
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                  : idea.status === 'published'
                                  ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {idea.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleLoadIdeaToWorkspace(idea)}
                              className="rounded px-2 py-0.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/15"
                            >
                              불러오기
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(
                                  `idea-${idea.id}`,
                                  `[${idea.fusion_topic}]\n제목: ${idea.custom_title}\n전략: ${idea.cross_media_strategy}\n썸네일: ${idea.custom_thumbnail_concept}\n구조:\n${idea.content_outline}\n메모: ${idea.memo}`,
                                  '보관함 아이디어'
                                )
                              }
                              className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                              title="클립보드 복사"
                            >
                              {copiedKey === `idea-${idea.id}` ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTogglePinIdea(idea)}
                              className={`rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                                idea.is_pinned
                                  ? 'text-amber-500'
                                  : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                              }`}
                              title="상단 고정"
                            >
                              <Pin className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteIdea(idea.id)}
                              className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-500 dark:hover:bg-rose-500/15 dark:hover:text-rose-400"
                              title="삭제"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="mt-2 text-base font-bold text-slate-900 dark:text-white">
                          {idea.custom_title}
                        </p>
                        {idea.memo && (
                          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                            💡 메모: {idea.memo}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {idea.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          모달: 새 SNS 성공 사례 레퍼런스 등록
         ===================================================================== */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm dark:bg-slate-950/80">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ➕ [{currentChannelMeta.shortLabel}] 새 바이럴 성공 사례 등록
              </h3>
              <button
                type="button"
                onClick={() => setIsNewPostModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                닫기 ✕
              </button>
            </div>

            <form onSubmit={handleAddNewReferencePost} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  바이럴 성장 유형
                </label>
                <select
                  value={newPostViralType}
                  onChange={(e) =>
                    setNewPostViralType(e.target.value as PostViralType)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  <option value="spike">🔥 급상승 떡상 (Spike)</option>
                  <option value="steady">📈 꾸준한 바이럴 (Steady)</option>
                  <option value="long_tail">🌲 롱테일 스테디셀러 (Long-tail)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  포스팅 제목 / 대표 헤드라인
                </label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="예: 광고비 0원으로 릴스 100만뷰 만든 첫 2초 편집 공식"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  초반 3초 / 첫 문장 후킹 카피
                </label>
                <textarea
                  rows={2}
                  required
                  value={newPostHook}
                  onChange={(e) => setNewPostHook(e.target.value)}
                  placeholder="예: 아직도 영상 시작할 때 인사부터 하시나요? 그 순간 80%가 이탈합니다."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    채널 / 작성자명
                  </label>
                  <input
                    type="text"
                    value={newPostAuthor}
                    onChange={(e) => setNewPostAuthor(e.target.value)}
                    placeholder="@creator_handle"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    해시태그 / 키워드 (쉼표 구분)
                  </label>
                  <input
                    type="text"
                    value={newPostKeywords}
                    onChange={(e) => setNewPostKeywords(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  AI 3줄 분해 및 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
