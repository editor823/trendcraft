'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Clapperboard,
  Package,
  Laptop,
  Copy,
  Check,
  Smartphone,
  Zap,
  Terminal,
  ShieldCheck,
  TrendingUp,
  Wrench,
  Boxes,
  Layers,
} from 'lucide-react';
import { TrendItem } from '@/types/trend';
import { getKeywordTranslation, translateIdeaText } from '@/lib/translate';
import { getASOMicroAppSpec } from '@/lib/asoHelper';
import { getReverseEngSpec } from '@/lib/reverseEngHelper';

interface ActionInsightCardProps {
  item: TrendItem | null;
  clusterName?: string;
}

export function ActionInsightCard({ item, clusterName }: ActionInsightCardProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'micro_app' | 'reverse_eng'>('insights');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!item) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center text-zinc-500">
        좌측 레이더나 클러스터에서 키워드를 선택하면 구체적인 실행 아이디어가 표시됩니다.
      </div>
    );
  }

  const trans = getKeywordTranslation(item.keyword);
  const appSpec = getASOMicroAppSpec(item);
  const revSpec = getReverseEngSpec(item);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  const cards = [
    {
      key: 'content',
      icon: Clapperboard,
      badge: '🎬 콘텐츠 아이디어 (YouTube / Blog)',
      content: item.content_idea,
    },
    {
      key: 'product',
      icon: Package,
      badge: '📦 상품 기획 아이디어 (E-Commerce / Digital)',
      content: item.product_idea,
    },
    {
      key: 'service',
      icon: Laptop,
      badge: '💻 서비스 / SaaS MVP 아이디어 (Indie Hacker)',
      content: item.service_idea,
    },
  ];

  const fullSummaryText = `[TrendCraft 실행 리포트] 키워드: ${item.keyword} ${trans.translation ? `(${trans.translation})` : ''} (${item.growth_rate}, ${item.score}점)
- 🎬 콘텐츠: ${item.content_idea}
- 📦 상품 기획: ${item.product_idea}
- 💻 서비스/SaaS: ${item.service_idea}
- 📱 ASO 마이크로 앱: ${appSpec.appName} (기회점수: ${appSpec.opportunityScore}점, 경쟁: ${appSpec.competitorCount})`;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/95 p-6 shadow-md space-y-5">
      {/* 상단 헤더 */}
      <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400">
              <Sparkles className="w-3 h-3" />
              무엇을 만들까? Action Insight
            </span>
            {clusterName && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                · {clusterName}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
              <span>{trans.original}</span>
              <span className="text-sm font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500">
                {item.growth_rate}
              </span>
            </h2>
            {trans.translation && (
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                ({trans.translation})
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleCopy('all', fullSummaryText)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0 shadow-sm"
        >
          {copiedKey === 'all' ? (
            <>
              <Check className="w-3.5 h-3.5" /> 전체 복사됨
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> 전체 카드 복사
            </>
          )}
        </button>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('insights')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeTab === 'insights'
              ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          💡 3대 실행
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('micro_app')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeTab === 'micro_app'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          📱 ASO 모바일 앱
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reverse_eng')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeTab === 'reverse_eng'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          🛠️ 역공학 SaaS
        </button>
      </div>

      {/* 탭 1: 3대 실행 카드 */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          {cards.map(({ key, icon: Icon, badge, content }) => {
            const ideaTrans = translateIdeaText(content);
            return (
              <div
                key={key}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-800/40 p-4 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    <Icon className="w-4 h-4 text-indigo-500" />
                    {badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(key, ideaTrans.translation ? `${ideaTrans.original}\n(${ideaTrans.translation})` : ideaTrans.original)}
                    className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-1"
                  >
                    {copiedKey === key ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500 font-semibold">복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>복사</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 본문 및 괄호 한국어 번역 */}
                <div className="space-y-1.5">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal whitespace-pre-line">
                    {ideaTrans.original}
                  </p>
                  {ideaTrans.translation && (
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium leading-relaxed bg-indigo-50/80 dark:bg-indigo-950/40 px-3 py-2 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                      ({ideaTrans.translation})
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 탭 2: 📱 2시간 컷 모바일 AI 앱 스펙 (ASO 공장 전략) */}
      {activeTab === 'micro_app' && (
        <div className="space-y-4">
          {/* ASO 핵심 지표 바 */}
          <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border border-indigo-500/20">
            <div className="text-center">
              <span className="block text-[11px] text-zinc-400 font-medium">ASO 기회 점수</span>
              <span className="text-base font-extrabold text-indigo-400 flex items-center justify-center gap-1 mt-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                {appSpec.opportunityScore}점
              </span>
            </div>
            <div className="text-center border-x border-zinc-200/20 dark:border-zinc-800">
              <span className="block text-[11px] text-zinc-400 font-medium">경쟁 강도</span>
              <span className={`text-xs font-bold inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full ${
                appSpec.competitorCount === 'LOW'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : appSpec.competitorCount === 'MID'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}>
                <ShieldCheck className="w-3 h-3" />
                {appSpec.competitorCount === 'LOW' ? 'LOW (빈집 틈새)' : appSpec.competitorCount === 'MID' ? 'MID (진입 적합)' : 'HIGH (대형 경쟁)'}
              </span>
            </div>
            <div className="text-center">
              <span className="block text-[11px] text-zinc-400 font-medium">개발 목표 시간</span>
              <span className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1 mt-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                ⚡ 2시간 컷 MVP
              </span>
            </div>
          </div>

          {/* 앱 개요 카드 */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                기획된 마이크로 앱
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                {appSpec.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-500" />
              {appSpec.appName}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <strong>핵심 가치:</strong> {appSpec.coreFeature}
            </p>
            <p className="text-xs text-zinc-400">
              <strong>타겟 사용자:</strong> {appSpec.targetAudience}
            </p>
          </div>

          {/* Claude Code / Cursor 원클릭 프롬프트 박스 */}
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-zinc-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Claude Code / Cursor 전용 빌드 프롬프트
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('prompt', appSpec.prompt)}
                className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all active:scale-95"
              >
                {copiedKey === 'prompt' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>복사 완료! AI 툴에 붙여넣기</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>프롬프트 원클릭 복사</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              💡 <strong>사용법:</strong> 위 [원클릭 복사] 버튼을 누른 뒤, Cursor 채팅창이나 Claude Code 터미널에 <kbd className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px]">Ctrl+V</kbd>로 붙여넣으면 2시간 만에 실행 가능한 모바일 AI 앱 코드가 자동 작성됩니다.
            </p>

            <pre className="text-xs text-zinc-700 dark:text-zinc-300 font-mono bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-x-auto max-h-56 overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
              {appSpec.prompt}
            </pre>
          </div>
        </div>
      )}

      {/* 탭 3: 🛠️ 역공학 마이크로 SaaS 스펙 (공룡 서비스 언번들링) */}
      {activeTab === 'reverse_eng' && (
        <div className="space-y-4">
          {/* 상단 타겟 공룡 서비스 배지 바 */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/30 to-teal-950/30 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Boxes className="w-4 h-4" />
                언번들링(Unbundling) 타겟 거대 공룡
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                기능 분리 복제
              </span>
            </div>
            <p className="text-sm font-extrabold text-zinc-100">
              {revSpec.unbundledTarget}
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              💡 {revSpec.unbundlingRationale}
            </p>
          </div>

          {/* 복제할 단일 핵심 기능 및 스택 카드 */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 p-4 space-y-3">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                떼어내어 1인 개발할 단일 핵심 기능
              </span>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
                {revSpec.clonedFeature}
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>추천 기술 스택</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {revSpec.recommendedStack}
              </span>
            </div>
          </div>

          {/* Claude Code / Cursor / AI 에이전트 완성형 프롬프트 카드 */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-zinc-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  AI 에이전트 전용 역공학 빌드 프롬프트
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('rev_prompt', revSpec.prompt)}
                className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-95"
              >
                {copiedKey === 'rev_prompt' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>복사 완료! 터미널에 붙여넣기</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>완성형 프롬프트 복사</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              💡 <strong>에이전트 지시 방법:</strong> 위 버튼을 눌러 복사한 프롬프트를 <strong>Claude Code</strong> 터미널이나 <strong>Cursor AI Composer</strong>에 붙여넣으면 거대 서비스의 복잡한 로직을 걷어내고, 1인 개발용 단일 핵심 프로토타입 코드를 자동으로 빌드합니다.
            </p>

            <pre className="text-xs text-zinc-700 dark:text-zinc-300 font-mono bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-x-auto max-h-56 overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
              {revSpec.prompt}
            </pre>
          </div>
        </div>
      )}

      {/* 하단 점수 및 팁 */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <span>트렌드 파급력 스코어: <strong className="text-indigo-500 font-bold">{item.score}점</strong></span>
        <span>출처: {item.sources.join(', ').toUpperCase()}</span>
      </div>
    </div>
  );
}

