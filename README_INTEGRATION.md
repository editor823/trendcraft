# TrendCraft `[🔬 마케팅 연구소 (Marketing Lab)]` 모듈 통합 가이드

## 1. 패키지 파일 구성
- `supabase/marketing_lab_schema.sql`: 마케팅 연구용 SNS 성공 사례 테이블(`marketing_lab_posts`) 및 나만의 크로스오버 아이디어 보관함 테이블(`marketing_lab_ideas`), 인덱스, RLS 정책, 7대 채널 초기 시드 데이터
- `frontend/types/marketing.ts`: 7대 SNS 채널, 3대 바이럴 필터(`spike`, `steady`, `long_tail`), AI 3줄 성공 요인 분해, 크로스오버 연구 및 보관함 타입 정의
- `frontend/components/MarketingLab.tsx`: 좌측 공부(Deconstruct) + 우측 연구(Synthesize) 2단 레이아웃 전체 UI 컴포넌트
- `frontend/app/page.tsx`: 상단 헤더 `[⚡ 트렌드 인텔리전스]` 및 `[🔬 마케팅 연구소 (Marketing Lab)]` 2대 대메뉴 탭 전환 연결 코드

## 2. Supabase 스키마 적용 방법
1. Supabase Studio 대시보드 접속 ➔ **SQL Editor** 메뉴로 이동합니다.
2. `supabase/marketing_lab_schema.sql` 파일 내용을 전체 복사하여 붙여넣고 **Run**을 클릭합니다.
3. `public.marketing_lab_posts` 와 `public.marketing_lab_ideas` 테이블 및 초기 7대 채널 시드 데이터가 즉시 생성됩니다.

## 3. 프론트엔드(`frontend/app/page.tsx`) 연결 가이드
기존 `frontend/app/page.tsx`에 대메뉴 탭 상태(`activeMainTab`)를 선언하고 상단 헤더에 2대 탭 버튼을 배치한 뒤 조건부 렌더링으로 `<MarketingLab />`을 연결합니다.

```tsx
'use client';

import { useState } from 'react';
import { Zap, FlaskConical } from 'lucide-react';
import MarketingLab from '@/components/MarketingLab';
import { MainNavTab } from '@/types/marketing';

export default function Page() {
  const [activeMainTab, setActiveMainTab] = useState<MainNavTab>('marketing_lab');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* 상단 헤더 2대 탭 스위처 */}
      <header className="border-b border-slate-800 bg-slate-950/90 px-6 py-4">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <h1 className="text-lg font-bold text-white">TrendCraft</h1>
          <div className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={() => setActiveMainTab('trend_intelligence')}
              className={activeMainTab === 'trend_intelligence' ? 'bg-amber-500 text-slate-950 px-4 py-2 rounded-lg font-bold' : 'text-slate-400 px-4 py-2'}
            >
              ⚡ 트렌드 인텔리전스
            </button>
            <button
              onClick={() => setActiveMainTab('marketing_lab')}
              className={activeMainTab === 'marketing_lab' ? 'bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold' : 'text-slate-400 px-4 py-2'}
            >
              🔬 마케팅 연구소 (Marketing Lab)
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] p-6">
        {activeMainTab === 'marketing_lab' ? (
          <MarketingLab />
        ) : (
          /* 기존 트렌드 인텔리전스 컴포넌트 위치 */
          <div>기존 트렌드 인텔리전스 대시보드 영역</div>
        )}
      </main>
    </div>
  );
}
```
