/**
 * AI 역공학(Reverse Engineering) & 마이크로 SaaS 언번들링 헬퍼 (reverseEngHelper.ts)
 * - 거대 공룡 서비스(Notion, Canva, Adobe, Jira, Zapier 등)의 무거운 기능을 1인 개발자가 가볍게 떼어내어 복제하는 MVP 기획
 * - Claude Code / Cursor / AI 에이전트용 역공학 원클릭 빌드 스펙 생성
 */

import { TrendItem } from '@/types/trend';

export interface ReverseEngSpec {
  unbundledTarget: string;       // 대상 거대 서비스 (예: Notion 데이터베이스, Canva AI 누끼)
  clonedFeature: string;         // 떼어내어 복제할 단일 핵심 기능
  unbundlingRationale: string;   // 왜 분리해야 하는가 (사용자 불만 및 기회 요인)
  recommendedStack: string;      // 오픈소스 & API 추천 스택
  prompt: string;                // Claude Code / Cursor에 붙여넣을 완성형 빌드 프롬프트
}

/**
 * 키워드 및 트렌드 아이템을 분석하여 역공학/언번들링 마이크로 SaaS 스펙 반환
 */
export function getReverseEngSpec(item: TrendItem): ReverseEngSpec {
  // DB에 직접 저장된 역공학 필드가 있는 경우 우선 사용
  if (item.reverse_eng_prompt && item.unbundled_target) {
    return {
      unbundledTarget: item.unbundled_target,
      clonedFeature: item.service_idea || item.product_idea,
      unbundlingRationale: '거대 서비스의 과도한 기능 복잡도와 높은 월 구독료를 해결하는 틈새 초경량 솔루션',
      recommendedStack: 'Next.js 14 + Tailwind CSS + Lucide Icons + Supabase/Local SQLite',
      prompt: item.reverse_eng_prompt,
    };
  }

  const keyLower = item.keyword.toLowerCase();

  // 1. 노션(Notion) 언번들링 계열 (노트, 데이터베이스, 문서, 위키)
  if (keyLower.includes('보일러플레이트') || keyLower.includes('기획') || keyLower.includes('정리') || keyLower.includes('saas') || keyLower.includes('starter')) {
    const unbundledTarget = 'Notion (노션의 무거운 위키/문서 데이터베이스 기능)';
    const clonedFeature = '오직 1인 SaaS 빌더만을 위한 초경량 로컬 마크다운 칸반보드 & 론칭 체크리스트';
    const unbundlingRationale = '노션은 너무 많은 기능과 느린 로딩 속도로 인해, 단순히 프로덕트 론칭 진행도만 빠르게 관리하고 싶은 인디 개발자에게 오히려 방해가 됨.';
    const recommendedStack = 'Next.js 14 + Tailwind + Zustand (로컬 브라우저 저장소 연동)';
    const prompt = `# [Claude Code / Cursor 전용] Notion 언번들링: 1인 SaaS 론칭 체크리스트 & 칸반보드 클론

## 🎯 역공학 대상
- **공룡 서비스**: Notion (무거운 관계형 DB, 복잡한 블록 에디터)
- **언번들링 전략**: 노션의 90% 불필요한 기능을 버리고, '1인 빌더 론칭 체크리스트' 단 1개만 초경량 PWA로 복제.

## 🛠️ 추천 오픈소스 & 테크 스택
- Framework: Next.js 14 (App Router)
- UI: Tailwind CSS + Lucide-react (반응형 다크모드 기본)
- 데이터 저장: LocalStorage (서버 없이 100% 무료 유지비)

## 🚀 필수 핵심 기능 명세
1. [3열 칸반 보드]: Todo / In Progress / Done 드래그 앤 드롭 지원 (HTML5 Drag & Drop).
2. [사전 탑재 론칭 템플릿]: Stripe 연동, 도메인 연결, GA4 설치 등 20개 기본 체크리스트 프리셋.
3. [마크다운 내보내기]: 전체 진행 상황을 깔끔한 README.md 마크다운으로 1초 만에 복사하는 버튼.

## 💡 개발 지시사항
- 회원가입 없이 즉시 브라우저에서 동작하도록 구현해줘.
- 불필요한 외부 라이브러리 의존성을 최소화하고 단일 페이지로 깔끔하게 작성해줘.`;

    return { unbundledTarget, clonedFeature, unbundlingRationale, recommendedStack, prompt };
  }

  // 2. 캔바/어도비(Canva / Adobe) 언번들링 계열 (디자인, 이미지, 쇼츠 자막, 영상)
  if (keyLower.includes('video') || keyLower.includes('clip') || keyLower.includes('figma') || keyLower.includes('사진') || keyLower.includes('쇼츠')) {
    const unbundledTarget = 'Canva & Adobe Premiere (무거운 타임라인 영상 편집기)';
    const clonedFeature = '클릭 한 번으로 유튜브 쇼츠 바이럴 자막과 썸네일 박스를 합성해주는 원클릭 웹 툴';
    const unbundlingRationale = '프리미어 프로나 캔바는 렌더링이 느리고 배울 게 너무 많음. 크리에이터가 원하는 건 3초 만에 나오는 자막 프리셋뿐임.';
    const recommendedStack = 'HTML5 Canvas API + Web Audio API + Tailwind CSS';
    const prompt = `# [Claude Code / Cursor 전용] Canva/Adobe 언번들링: 숏폼 바이럴 자막 & 썸네일 생성기 클론

## 🎯 역공학 대상
- **공룡 서비스**: Canva & Adobe Premiere Pro (무거운 타임라인 편집기)
- **언번들링 전략**: 무거운 렌더링 타임라인을 전부 제거하고, '인스타/유튜브 쇼츠용 볼드 후킹 자막 생성'만 떼어내어 100% 브라우저 클라이언트에서 처리.

## 🛠️ 추천 오픈소스 & 테크 스택
- Frontend: Next.js 14 + Tailwind CSS
- 이미지 합성: HTML5 Canvas 2D Context (클라이언트 측 즉시 렌더링)
- 폰트: Pretendard ExtraBold 웹폰트

## 🚀 필수 핵심 기능 명세
1. [이미지 드래그 업로드]: 썸네일용 배경 사진 즉시 로드.
2. [후킹 자막 스타일러]: 텍스트 입력 시 유튜브 상위 1% 스타일(노란색/흰색 볼드체 + 블랙 외곽선) 자동 렌더링.
3. [원클릭 PNG 다운로드]: 캔버스 결과를 1080x1920 세로 비율 PNG로 0.1초 만에 저장.

## 💡 개발 지시사항
- 서버 비용 0원을 위해 모든 이미지 합성을 브라우저 Canvas 안에서 완료해줘.`;

    return { unbundledTarget, clonedFeature, unbundlingRationale, recommendedStack, prompt };
  }

  // 3. 재피어/슬랙(Zapier / Slack) 언번들링 계열 (자동화, 알림, 이메일, 웹훅)
  if (keyLower.includes('email') || keyLower.includes('churn') || keyLower.includes('도어락') || keyLower.includes('전화') || keyLower.includes('응대')) {
    const unbundledTarget = 'Zapier & Make (월 $30 넘는 값비싼 SaaS 자동화 플랫폼)';
    const clonedFeature = '서버리스 웹훅 하나로 고객 알림톡과 이메일을 자동 트리거하는 단일 파이프라인';
    const unbundlingRationale = '소상공인이나 인디 창업가는 재피어의 수천 개 앱 연동이 필요 없고, 단지 결제/예약 시 알림 1개만 저렴하게 보내고 싶어 함.';
    const recommendedStack = 'Next.js API Route + Resend/Nodemailer + Supabase Webhook';
    const prompt = `# [Claude Code / Cursor 전용] Zapier 언번들링: 초경량 웹훅 이벤트 알림 디스패처 클론

## 🎯 역공학 대상
- **공룡 서비스**: Zapier & Make (월 3만원 이상의 비싼 멀티스텝 자동화 툴)
- **언번들링 전략**: 무거운 시각적 노드 빌더를 제거하고, '단 1개의 웹훅 URL로 알림 이메일/디스코드 발송' 기능만 독립 SaaS로 분리.

## 🛠️ 추천 테크 스택
- API Server: Next.js 14 Route Handlers (/api/webhook)
- 메일 전송: Resend API 또는 Discord Webhook URL
- 프론트엔드: Tailwind 기반 테스트 대시보드 (curl 명령어 자동 생성)

## 🚀 필수 핵심 기능 명세
1. [고유 웹훅 엔드포인트 생성]: 사용자별 API Key 기반 엔드포인트 URL 발급.
2. [테스트 발송기 UI]: 대시보드에서 JSON 페이로드를 입력하고 [테스트 전송] 버튼을 누르면 실시간 수신 로그 확인.
3. [복사 가능한 코드 스니펫]: cURL, Python requests, JavaScript fetch 샘플 코드 1클릭 복사 제공.`;

    return { unbundledTarget, clonedFeature, unbundlingRationale, recommendedStack, prompt };
  }

  // 4. 일반 범용 언번들링 (Airtable / HubSpot / Notion 등)
  const unbundledTarget = 'Airtable & Notion (무거운 올인원 비즈니스 플랫폼)';
  const clonedFeature = `오직 '${item.keyword}' 문제만을 1초 만에 해결하는 초경량 특화 유틸리티 SaaS`;
  const unbundlingRationale = '대기업용 소프트웨어는 너무 무겁고 옵션이 많아, 일반 사용자가 원하는 단 하나의 결과물을 얻기까지 학습 곡선이 너무 큼.';
  const recommendedStack = 'Next.js 14 + Tailwind CSS + Lucide Icons + Vercel 원클릭 배포';
  const prompt = `# [Claude Code / Cursor 전용] 거대 SaaS 언번들링: ${item.keyword} 마이크로 프로토타입 클론

## 🎯 역공학 대상
- **타겟 공룡 서비스**: ${unbundledTarget}
- **언번들링 전략**: 거대 플랫폼의 복잡한 온보딩과 무거운 기능을 완전히 떼어내고, '${item.keyword}'와 관련된 단 1개의 핵심 가치만 독립 웹앱으로 재창조.

## 💡 해결할 단일 핵심 문제
- ${item.service_idea || item.product_idea}

## 🛠️ 기술 스택 & 개발 지시사항
- Framework: Next.js 14 (App Router) + Tailwind CSS
- 상태 관리: React useState 기반 (DB 없이 로컬 저장만으로 즉시 구동 가능하도록 설계)
- UI 레이아웃: 반응형 모던 대시보드 (상단 직관적 인풋 -> 중앙 실시간 결과 카드 -> 하단 원클릭 클립보드 복사)
- 코딩 툴에서 바로 실행할 수 있도록 완결된 단일 파일 형태의 코드로 작성해줘.`;

  return { unbundledTarget, clonedFeature, unbundlingRationale, recommendedStack, prompt };
}
