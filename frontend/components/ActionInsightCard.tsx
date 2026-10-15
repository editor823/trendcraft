'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Clapperboard,
  Package,
  Laptop,
  Copy,
  Check,
} from 'lucide-react';
import { TrendItem } from '@/types/trend';
import { getKeywordTranslation, translateIdeaText } from '@/lib/translate';

interface ActionInsightCardProps {
  item: TrendItem | null;
  clusterName?: string;
}

export function ActionInsightCard({ item, clusterName }: ActionInsightCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!item) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center text-zinc-500">
        좌측 레이더나 클러스터에서 키워드를 선택하면 구체적인 실행 아이디어가 표시됩니다.
      </div>
    );
  }

  const trans = getKeywordTranslation(item.keyword);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
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
- 💻 서비스/SaaS: ${item.service_idea}`;

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

      {/* 3대 실행 카드 */}
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
              <div className="space-y-2">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
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

      {/* 하단 점수 및 팁 */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
        <span>트렌드 파급력 스코어: <strong className="text-indigo-500 font-bold">{item.score}점</strong></span>
        <span>출처: {item.sources.join(', ').toUpperCase()}</span>
      </div>
    </div>
  );
}
