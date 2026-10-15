'use client';

import React, { useState } from 'react';
import { Clapperboard, Package, Laptop, Copy, Check, Sparkles } from 'lucide-react';
import { TrendItem } from '@/types/trend';

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
      accent: 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400',
      content: item.content_idea,
    },
    {
      key: 'product',
      icon: Package,
      badge: '📦 상품 기획 아이디어 (E-Commerce / Digital)',
      accent: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
      content: item.product_idea,
    },
    {
      key: 'service',
      icon: Laptop,
      badge: '💻 서비스 / SaaS MVP 아이디어 (Indie Hacker)',
      accent: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
      content: item.service_idea,
    },
  ];

  const fullSummaryText = `[TrendCraft 실행 리포트] 키워드: ${item.keyword} (${item.growth_rate}, ${item.score}점)
- 🎬 콘텐츠: ${item.content_idea}
- 📦 상품 기획: ${item.product_idea}
- 💻 서비스/SaaS: ${item.service_idea}`;

  return (
    <aside className="rounded-2xl border-2 border-indigo-500/40 bg-white dark:bg-zinc-900 p-5 shadow-lg space-y-4">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400">
              <Sparkles className="w-3 h-3" />
              무엇을 만들까? Action Insight
            </span>
            {clusterName && (
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                · {clusterName}
              </span>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>{item.keyword}</span>
            <span className="text-sm font-bold text-emerald-500">{item.growth_rate}</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={() => handleCopy('all', fullSummaryText)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0"
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

      <div className="space-y-3">
        {cards.map(({ key, badge, accent, content }) => (
          <div
            key={key}
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 p-4 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${accent}`}>
                {badge}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(key, content)}
                className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 px-2 py-1 rounded-md hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors"
              >
                {copiedKey === key ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">복사 완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>복사</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
              {content}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}
