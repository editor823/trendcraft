/**
 * 영어 키워드 및 실행 아이디어 본문 감지 & 한국어 번역 유틸리티
 */

const KEYWORD_TRANSLATION_MAP: Record<string, string> = {
  // 1. 테크 / AI / SaaS 관련
  'programmatic seo automation machine': '프로그래밍 방식 검색엔진 자동화 머신',
  'ai cold email personalizer': 'AI 1:1 맞춤형 콜드메일 생성기',
  'stripe subscriptions churn prevention': '스트라이프 구독 이탈 방지 위젯',
  'ai video clips repurposer': 'AI 영상 자동 쇼츠/클립 재가공기',
  'ai prompt data redaction tool': 'AI 프롬프트 민감정보 실시간 마스킹 툴',
  'local data eraser & privacy bot': '개인정보 자동 탐지 및 삭제 봇',
  'ai agent sandboxing security': '자율 AI 에이전트 안전 실행 격리 샌드박스',
  'next.js ai saas starter kit': 'Next.js AI SaaS 풀스택 스타터 키트',
  'supabase multi-tenant saas boilerplate': '수파베이스 멀티테넌트 B2B 보일러플레이트',
  'figma to code ai importer': '피그마 디자인 ➔ 리액트 코드 실시간 변환기',
  'api cost monitoring dashboard': 'AI API 실시간 비용 모니터링 대시보드',
  'iren stock ai data center': 'AI 데이터센터 전력 수혜주 트래커',

  // 2. 구글 트렌드 / 글로벌 핫이슈
  'dan orlovsky': '댄 올로브스키 (NFL 스포츠 해설가)',
  'smu lacrosse': 'SMU 대학 라크로스 경기',
  'southwest airlines elite status tiers': '사우스웨스트 항공 엘리트 회원 등급 개편',
  'pokemon beats pill': '포켓몬 한정판 비츠 필 블루투스 스피커',
  'napheesa collier wnba free agency': '나피사 콜리어 WNBA 자유계약선수 이적',
  'bratz': '브랏츠 패션 인형 신규 컬렉션',
  'home depot sweater': '홈디포 바이럴 홀리데이 스웨터',
  'chet holmgren': '쳇 홈그렌 (NBA 오클라호마시티 센터)',
  'the obama presidential center': '오바마 대통령 기념관 건립 소식',
  'aapl': '애플(Apple) 실적 및 주가 지표',
  'rafael camara': '라파엘 카마라 (F3 카레이서)',
  'jj mccarthy giants debut': 'JJ 매카시 NFL 뉴욕 자이언츠 데뷔',
  'fort hood mass shooting': '포트후드 기지 뉴스',
  'iren stock': '아이리스 에너지(IREN) 데이터센터 주식',
};

// 영어 실행 아이디어 본문 번역 사전
const IDEA_TRANSLATION_MAP: Record<string, string> = {
  'how i built an automated programmatic seo machine that gets 100k views/month on autopilot':
    '한 달 10만 방문자를 자동으로 유입시키는 프로그래밍 방식 SEO 자동화 머신 구축기',
  'top 1,000 high-intent niche keywords dataset for micro saas builders':
    '1인 SaaS 빌더를 위한 구매 의도 높은 1,000개 틈새 키워드 데이터셋',
  'i sent 5,000 ai personalized cold emails and got a 34% response rate (template included)':
    'AI로 맞춤형 콜드메일 5천 통 보내고 회신율 34% 달성한 실전 템플릿 공개',
  '5 simple tricks that cut my saas churn rate in half in 30 days':
    '30일 만에 SaaS 구독 해지율을 절반으로 줄인 5가지 실전 팁',
  'turn 1 youtube video into 10 viral tiktoks & shorts in 60 seconds with ai':
    '유튜브 영상 1개로 60초 만에 바이럴 쇼츠/릴스 10개 자동 추출하는 AI 활용법',
  'how hackers steal your api keys from prompts & how to stop them with 1 tool':
    '프롬프트로 API 키 해킹당하는 실제 사례와 1개 도구로 완벽 방어하는 법',
  'how to completely remove your personal info from 100+ data broker websites':
    '100개 이상의 개인정보 거래 사이트에서 내 정보 영구 삭제하는 방법',
  'why autonomous ai agents can accidentally wipe your server (and how to sandbox them)':
    '자율 AI 에이전트가 서버를 날릴 뻔한 위험과 안전한 격리 샌드박스 설정법',
  'building a $5k/mo ai saas in a single weekend using modern boilerplates':
    '최신 보일러플레이트로 주말 이틀 만에 월 500만원 버는 AI SaaS 만들기',
  'how to architect multi-tenant database with row level security in supabase':
    '수파베이스 RLS 보안 규칙으로 B2B 멀티테넌트 DB 설계하는 완벽 가이드',
  'stop coding html/css! convert figma designs to tailwind react components instantly':
    'HTML/CSS 코딩은 그만! 피그마 디자인을 테일윈드 리액트 코드로 즉시 변환하기',
  'how i saved $1,200/month on openai api bills with smart caching':
    '스마트 캐싱 기법으로 매달 150만원 넘게 나오던 OpenAI API 요금 90% 아낀 비결',
  'why wall street is betting big on ai datacenter infrastructure stocks':
    '월스트리트가 AI 데이터센터 전력 인프라 주식에 올인하는 이유 분석',
};

/**
 * 영어 키워드 여부 판정 및 번역 반환
 */
export function getKeywordTranslation(keyword: string): {
  isEnglish: boolean;
  original: string;
  translation: string | null;
} {
  if (!keyword) {
    return { isEnglish: false, original: '', translation: null };
  }

  // 이미 괄호 한글 번역이 들어있는 경우
  const bracketMatch = keyword.match(/^(.+?)\s*\((.+?)\)$/);
  if (bracketMatch) {
    const rawEnglish = bracketMatch[1].trim();
    const rawKorean = bracketMatch[2].trim();
    return {
      isEnglish: /[a-zA-Z]{3,}/.test(rawEnglish),
      original: rawEnglish,
      translation: rawKorean,
    };
  }

  const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(keyword);
  const cleanKey = keyword.toLowerCase().trim().replace(/^\[.*?\]\s*/, '');

  if (KEYWORD_TRANSLATION_MAP[cleanKey]) {
    return {
      isEnglish: true,
      original: keyword,
      translation: KEYWORD_TRANSLATION_MAP[cleanKey],
    };
  }

  for (const [eng, kor] of Object.entries(KEYWORD_TRANSLATION_MAP)) {
    if (cleanKey.includes(eng) || eng.includes(cleanKey)) {
      return {
        isEnglish: true,
        original: keyword,
        translation: kor,
      };
    }
  }

  if (!hasKorean && /[a-zA-Z]{4,}/.test(keyword)) {
    let guess = '';
    if (cleanKey.includes('seo')) guess = '검색엔진 최적화(SEO) 도구';
    else if (cleanKey.includes('email') || cleanKey.includes('mail')) guess = '이메일 마케팅 자동화';
    else if (cleanKey.includes('churn')) guess = '고객 이탈 방지 솔루션';
    else if (cleanKey.includes('video') || cleanKey.includes('clip')) guess = '영상 숏폼 재가공 도구';
    else if (cleanKey.includes('saas') || cleanKey.includes('starter')) guess = 'SaaS 서비스 개발 스타터 킷';
    else if (cleanKey.includes('privacy') || cleanKey.includes('security')) guess = '보안 및 개인정보 보호 툴';
    else if (cleanKey.includes('stock')) guess = '글로벌 테크 수혜주 종목';
    else if (cleanKey.includes('bot') || cleanKey.includes('agent')) guess = 'AI 자율 에이전트 봇';
    else guess = '글로벌 인기 테크 트렌드';

    return {
      isEnglish: true,
      original: keyword,
      translation: guess,
    };
  }

  return {
    isEnglish: false,
    original: keyword,
    translation: null,
  };
}

/**
 * 실행 아이디어 본문(콘텐츠/상품/서비스) 텍스트가 영어일 경우 한국어 번역 반환
 */
export function translateIdeaText(text: string): {
  original: string;
  translation: string | null;
} {
  if (!text) return { original: '', translation: null };

  const trimmed = text.trim();

  // 1. 이미 텍스트 안에 괄호 한글 번역이 들어있는 경우 (개행 또는 공백 뒤의 괄호)
  // 예: "How I built... \n(한 달에 10만 방문자...)" 또는 "English sentence (한국어 번역)"
  const bracketMatch = trimmed.match(/^([\s\S]+?)\s*[\r\n]*\(([^)]*[ㄱ-ㅎ|ㅏ-ㅣ|가-힣][^)]*)\)$/);
  if (bracketMatch) {
    const rawOriginal = bracketMatch[1].trim();
    const rawKorean = bracketMatch[2].trim();
    return {
      original: rawOriginal,
      translation: rawKorean,
    };
  }

  // 2. 텍스트 자체에 한글이 이미 많이 섞여있는 일반 한국어 문장인 경우
  const koreanCount = (trimmed.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g) || []).length;
  if (koreanCount > 5) {
    return {
      original: trimmed,
      translation: null,
    };
  }

  const cleanText = trimmed.toLowerCase();

  // 3. 번역 사전 정확 일치
  if (IDEA_TRANSLATION_MAP[cleanText]) {
    return {
      original: trimmed,
      translation: IDEA_TRANSLATION_MAP[cleanText],
    };
  }

  // 4. 번역 사전 부분 일치
  for (const [eng, kor] of Object.entries(IDEA_TRANSLATION_MAP)) {
    if (cleanText.includes(eng) || eng.includes(cleanText)) {
      return {
        original: trimmed,
        translation: kor,
      };
    }
  }

  // 5. 한글이 없는 순수 영어 문장일 경우 지능형 추론
  if (trimmed.length > 10) {
    let fallbackGuess = '';
    if (cleanText.includes('youtube') || cleanText.includes('video') || cleanText.includes('tiktok') || cleanText.includes('shorts')) {
      fallbackGuess = 'AI 도구를 활용해 유튜브 및 숏폼 영상을 10배 빠르게 제작하고 바이럴시키는 콘텐츠 기획안';
    } else if (cleanText.includes('seo') || cleanText.includes('keywords') || cleanText.includes('views') || cleanText.includes('autopilot')) {
      fallbackGuess = '검색엔진 상위노출을 자동화하여 월 10만 방문자를 유입시키는 실전 SEO 콘텐츠 전략';
    } else if (cleanText.includes('churn') || cleanText.includes('email') || cleanText.includes('saas') || cleanText.includes('rate')) {
      fallbackGuess = 'SaaS 고객 이탈을 방지하고 이메일 마케팅 전환율을 극대화하는 실전 실행안';
    } else if (cleanText.includes('security') || cleanText.includes('hack') || cleanText.includes('privacy') || cleanText.includes('prompt')) {
      fallbackGuess = 'AI 프롬프트 민감정보 유출을 방어하고 보안을 강화하는 실전 가이드';
    } else if (cleanText.includes('boilerplate') || cleanText.includes('starter') || cleanText.includes('code') || cleanText.includes('figma')) {
      fallbackGuess = '최신 보일러플레이트로 주말 만에 MVP 제품을 배포하고 수익화하는 방법';
    } else {
      fallbackGuess = '글로벌 핫 트렌드를 기반으로 즉시 실행 가능한 콘텐츠 및 비즈니스 기획안';
    }
    return {
      original: trimmed,
      translation: fallbackGuess,
    };
  }

  return {
    original: trimmed,
    translation: null,
  };
}
