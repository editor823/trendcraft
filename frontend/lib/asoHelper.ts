/**
 * ASO 마이크로 앱 공장 헬퍼 (asoHelper.ts)
 * 유튜브 ASO 마이크로 앱 전략: 검색어 먼저 고르고 2시간 만에 AI 모바일 앱 출시
 * Claude Code / Cursor에 즉시 붙여넣을 수 있는 One-Click 빌드 스펙 자동 생성
 */

import { TrendItem } from '@/types/trend';

export interface ASOMicroAppSpec {
  appName: string;
  category: string;
  opportunityScore: number;
  competitorCount: 'LOW' | 'MID' | 'HIGH';
  targetAudience: string;
  coreFeature: string;
  prompt: string;
}

/**
 * 키워드 및 트렌드 아이템을 분석하여 ASO 마이크로 앱 빌드 스펙 반환
 */
export function getASOMicroAppSpec(item: TrendItem): ASOMicroAppSpec {
  // DB에 직접 저장된 ASO 필드가 있는 경우 우선 사용
  if (item.ai_app_prompt && item.app_opportunity_score) {
    return {
      appName: `${item.keyword} 마이크로 앱`,
      category: '생산성 / 유틸리티',
      opportunityScore: item.app_opportunity_score,
      competitorCount: item.competitor_count || 'LOW',
      targetAudience: '모바일 검색 사용자',
      coreFeature: item.service_idea || item.product_idea,
      prompt: item.ai_app_prompt,
    };
  }

  const keyLower = item.keyword.toLowerCase();

  // 1. 키워드 성격별 스마트 스펙 맵핑
  if (keyLower.includes('혈당') || keyLower.includes('저속노화') || keyLower.includes('다이어트') || keyLower.includes('건강')) {
    const prompt = `# [Cursor / Claude Code 프롬프트] 2시간 컷 모바일 AI 혈당 & 식단 계산기

## 📱 프로젝트 목표
- 앱 이름: GlucoseSnap (실시간 혈당 스파이크 예측기)
- 플랫폼: 모바일 웹 PWA (Next.js 14 + Tailwind CSS) 또는 React Native (Expo)
- 개발 목표 시간: 2시간 (핵심 기능 1개만 완벽 구현)

## 💡 ASO 타겟 검색어
- "혈당 계산기", "식단 혈당 스파이크", "저속노화 식단", "당뇨 음식 체크"

## 🛠️ 핵심 단일 기능 (Single Core Feature)
1. [사진 업로드 / 선택] 사용자가 오늘 먹을 음식 사진을 올리거나 음식명을 텍스트로 검색.
2. [AI 분석 API] 무료 AI 모델(Groq / Gemini Flash API)을 호출하여:
   - 혈당 스파이크 위험도 (안전/주의/위험 게이지 1~100)
   - 함께 먹으면 혈당을 낮춰주는 추천 보조 반찬(식초 드레싱, 채소, 단백질) 2가지 제안
3. [결과 카드 공유] 인스타그램 스토리/카카오톡 공유 가능한 깔끔한 결과 카드 렌더링.

## 🚀 필수 UI 요구사항
- 모바일 전용 뷰포트 (최대 가로폭 480px, 바텀 시트 네비게이션)
- 원클릭 테스트용 샘플 버튼 3개 제공 ("짜장면+탕수육", "그릭요거트+베리", "닭가슴살 샐러드")
- 모바일 홈 화면 '앱 추가(PWA)' 설치 배너 포함`;

    return {
      appName: 'GlucoseSnap - 1초 혈당 스파이크 계산기',
      category: '건강 & 피트니스',
      opportunityScore: 92,
      competitorCount: 'LOW',
      targetAudience: '식후 혈당 상승 및 저속노화 식습관에 민감한 2040 직장인',
      coreFeature: '음식명만 넣으면 혈당 위험도와 식후 걷기 권장 시간을 3초 만에 알려주는 계산기',
      prompt,
    };
  }

  if (keyLower.includes('수면') || keyLower.includes('브레인포그') || keyLower.includes('명상') || keyLower.includes('마인드풀')) {
    const prompt = `# [Cursor / Claude Code 프롬프트] 2시간 컷 오프라인 수면 사운드 & 기상 타이머

## 📱 프로젝트 목표
- 앱 이름: SleepWave (뇌파 동기화 수면 사운드 머신)
- 플랫폼: React Native (Expo) 또는 Next.js 모바일 웹(PWA)
- 개발 목표 시간: 2시간 완성

## 💡 ASO 타겟 검색어
- "수면 소리", "백색소음 수면", "브레인포그 해소", "딥슬립 알람"

## 🛠️ 핵심 단일 기능 (Single Core Feature)
1. [사운드 믹서] 빗소리, 장작불, 기능성 432Hz 뇌파 주파수 3가지 음원을 슬라이더로 볼륨 믹싱.
2. [스마트 타이머] 15분, 30분, 45분 후 서서히 소리가 줄어들며 꺼지는 자동 페이드아웃 슬립 타이머.
3. [다크 모드 기본] 침대에서 눈이 부시지 않도록 OLED 올블랙 미니멀 UI.

## 🚀 필수 UI 요구사항
- 완전한 오프라인 작동 (오디오 파일 로컬 재생)
- 백그라운드 재생 지원`;

    return {
      appName: 'SleepWave - 뇌파 수면 사운드 머신',
      category: '건강 & 웰니스',
      opportunityScore: 86,
      competitorCount: 'MID',
      targetAudience: '불면증 및 직장 스트레스로 얕은 잠에 시달리는 수면 부족 현대인',
      coreFeature: '오프라인에서 즉시 실행되는 432Hz 뇌파 동기화 슬립 타이머 믹서',
      prompt,
    };
  }

  if (keyLower.includes('seo') || keyLower.includes('keyword') || keyLower.includes('search')) {
    const prompt = `# [Cursor / Claude Code 프롬프트] 2시간 컷 ASO 틈새 키워드 발굴기 모바일 앱

## 📱 프로젝트 목표
- 앱 이름: ASO Radar (앱스토어 빈집 키워드 즉시 스캐너)
- 플랫폼: Next.js 14 모바일 웹 (PWA 지원)
- 개발 목표 시간: 2시간

## 💡 ASO 타겟 검색어
- "ASO 키워드", "앱스토어 검색어 최적화", "앱 출시 키워드", "SEO 분석기"

## 🛠️ 핵심 단일 기능 (Single Core Feature)
1. [키워드 입력] 메인 검색어 1개 입력 (예: "계산기", "식단").
2. [자동 연관어 & 경쟁도 분석] 구글/앱스토어 자동완성 API를 프록시 호출하여 20개 롱테일 키워드 추출.
3. [빈집 지표 판정] 경쟁도(LOW/MID/HIGH)와 잠재 다운로드 기회 점수(1~100점) 뱃지 자동 계산.
4. [원클릭 메타데이터 복사] 앱 제목, 부제목, 키워드 필드(100자) 복사 기능 제공.`;

    return {
      appName: 'ASO Radar - 모바일 앱스토어 빈집 검색기',
      category: '비즈니스 / 생산성',
      opportunityScore: 94,
      competitorCount: 'LOW',
      targetAudience: '1인 앱 개발자, 부업 인디 해커, 디지털 마케터',
      coreFeature: '검색어 1개로 앱스토어 틈새 키워드와 추천 앱 타이틀 메타태그를 1초 만에 추출',
      prompt,
    };
  }

  if (keyLower.includes('video') || keyLower.includes('clip') || keyLower.includes('youtube') || keyLower.includes('숏폼')) {
    const prompt = `# [Cursor / Claude Code 프롬프트] 2시간 컷 유튜브 숏폼 후킹 문구 생성기

## 📱 프로젝트 목표
- 앱 이름: HookCrafter (유튜브 쇼츠 첫 3초 후킹 카피 생성기)
- 플랫폼: Next.js 14 + Tailwind CSS (모바일 최적화)
- 개발 목표 시간: 2시간

## 💡 ASO 타겟 검색어
- "쇼츠 썸네일", "유튜브 후킹 문구", "숏폼 대본 생성기", "틱톡 조회수"

## 🛠️ 핵심 단일 기능 (Single Core Feature)
1. [주제 선택] 영상 카테고리(재테크, 꿀팁, 자기계발, 브이로그) 선택 및 영상 핵심 내용 1줄 입력.
2. [후킹 템플릿 알고리즘] 시청 지속 시간을 극대화하는 바이럴 후킹 10종 즉시 생성:
   - "절대 하지 마세요" 부정형 후킹
   - "상위 1%만 아는" 비밀형 후킹
   - "30일 동안 해봤더니" 실전 검증형 후킹
3. [원클릭 숏폼 자막 복사] 스마트폰 클립보드에 자막/대본 즉시 복사.`;

    return {
      appName: 'HookCrafter - 쇼츠 첫 3초 후킹 생성기',
      category: '사진 및 비디오 / 크리에이터',
      opportunityScore: 95,
      competitorCount: 'LOW',
      targetAudience: '유튜브 쇼츠, 인스타 릴스, 틱톡 크리에이터 및 1인 마케터',
      coreFeature: '주제만 넣으면 뇌를 자극하는 바이럴 첫 3초 대본 10개를 1초 만에 자동 생성',
      prompt,
    };
  }

  if (keyLower.includes('무인') || keyLower.includes('공간') || keyLower.includes('도어락') || keyLower.includes('예약')) {
    const prompt = `# [Cursor / Claude Code 프롬프트] 2시간 컷 무인 공간 비밀번호 원클릭 전송기

## 📱 프로젝트 목표
- 앱 이름: PassPass (무인 공간 예약자 임시 도어락 번호 생성 & 알림톡 발송기)
- 플랫폼: 모바일 웹 PWA
- 개발 목표 시간: 2시간

## 💡 ASO 타겟 검색어
- "무인 매장 관리", "파티룸 도어락", "예약문자 자동 발송", "공간 대여"

## 🛠️ 핵심 단일 기능 (Single Core Feature)
1. [입력창] 예약자 이름, 연락처, 이용 시간(시작~종료) 입력.
2. [임시 핀코드 생성] 날짜+시간 기반 4~6자리 핀코드 자동 생성.
3. [안내 템플릿 원클릭 전송] 주소, 주차, 와이파이, 비밀번호가 포함된 카카오톡/문자 템플릿 원클릭 복사.`;

    return {
      appName: 'PassPass - 무인 공간 원클릭 알림 매니저',
      category: '비즈니스 / 부동산',
      opportunityScore: 90,
      competitorCount: 'LOW',
      targetAudience: '무인 스튜디오, 파티룸, 연습실, 스터디룸 호스트',
      coreFeature: '예약 시간대별 도어락 임시 핀코드와 이용 수칙 안내 문자를 10초 만에 생성 및 복사',
      prompt,
    };
  }

  // 2. 기본 범용 AI 마이크로 앱 스펙
  const prompt = `# [Cursor / Claude Code 프롬프트] 2시간 컷 모바일 AI 마이크로 앱 (${item.keyword})

## 📱 프로젝트 목표
- 앱 이름: ${item.keyword.replace(/\s+/g, '')} Pocket (초경량 AI 모바일 유틸리티)
- 플랫폼: Next.js 14 (Mobile PWA) 또는 React Native (Expo)
- 개발 목표 시간: 2시간 (오직 1개의 필수 가치에만 집중)

## 💡 ASO 타겟 검색어
- "${item.keyword}", "${item.keyword} 계산기", "${item.keyword} 가이드", "${item.keyword} 자동화"

## 🛠️ 핵심 단일 기능 (Single Core Feature)
1. [단순한 입력창] 사용자가 복잡한 설정 없이 바로 값을 입력하거나 버튼을 터치할 수 있는 1페이지 UI.
2. [즉각적인 결과 도출] 대기 시간 없이 1초 안에 계산, 요약, 또는 변환된 결과 카드 표시.
3. [원클릭 액션] 결과를 카카오톡/클립보드로 즉시 복사하거나 즐겨찾기에 로컬 저장(LocalStorage).

## 🚀 기술 스택 가이드
- Framework: React with Tailwind CSS (Lucide Icons 포함)
- 상태 관리: React useState (최대한 단순하게)
- 반응형: 모바일 세로 뷰포트 (w-full max-w-md mx-auto)`;

  return {
    appName: `${item.keyword} Pocket`,
    category: '생산성 / 유틸리티',
    opportunityScore: item.score || 85,
    competitorCount: (item.score > 90 ? 'LOW' : item.score > 80 ? 'MID' : 'HIGH') as 'LOW' | 'MID' | 'HIGH',
    targetAudience: '모바일 검색을 통해 문제를 즉시 해결하려는 사용자',
    coreFeature: item.service_idea || item.product_idea || '모바일 원클릭 자동 해결 솔루션',
    prompt,
  };
}
