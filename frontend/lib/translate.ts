/**
 * 영어 키워드 감지 및 직관적인 한국어 번역 제공 유틸리티
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

  // 1. 이미 키워드 안에 괄호 한글 번역이 들어있는 경우 (예: "Next.js AI Kit (넥스트JS AI 키트)")
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

  // 2. 한글이 없고 영어가 대부분인 키워드인지 감지
  const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(keyword);
  const cleanKey = keyword.toLowerCase().trim().replace(/^\[.*?\]\s*/, '');

  // 번역 사전 매칭
  if (KEYWORD_TRANSLATION_MAP[cleanKey]) {
    return {
      isEnglish: true,
      original: keyword,
      translation: KEYWORD_TRANSLATION_MAP[cleanKey],
    };
  }

  // 부분 단어 매칭 시도
  for (const [eng, kor] of Object.entries(KEYWORD_TRANSLATION_MAP)) {
    if (cleanKey.includes(eng) || eng.includes(cleanKey)) {
      return {
        isEnglish: true,
        original: keyword,
        translation: kor,
      };
    }
  }

  // 한글이 없고 영어가 4글자 이상이면 일반적 스마트 번역 제공
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
