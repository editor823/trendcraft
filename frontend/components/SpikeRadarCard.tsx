'use client';

import React from 'react';
import { Flame, ArrowUpRight, Sparkles } from 'lucide-react';
import { TrendItem } from '@/types/trend';

interface SpikeRadarCardProps {
  items: (TrendItem & { clusterName?: string; region?: string })[];
  selectedItemId?: string;
  onSelectKeyword: (item: TrendItem) => void;
}

const SOURCE_LABELS: Record<string, { label: string; badgeClass: string }> = {
  naver: { label: 'Naver', badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  youtube: { label: 'YouTube', badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  google: { label: 'Google', badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  reddit: { label: 'Reddit', badgeClass: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  producthunt: { label: 'ProductHunt', badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
};

export function SpikeRadarCard({ items, selectedItemId, onSelectKeyword }: SpikeRadarCardProps) {
  const topSpikes = items
    .filter((i) => i.trend_type === 'SPIKE')
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              실시간 급상승 레이더 Top 10
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              단기 폭발력이 감지된 SPIKE 키워드 · 클릭 시 실행 아이디어가 열립니다
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          SPIKE RADAR
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {topSpikes.map((item, idx) => {
          const isSelected = item.id === selectedItemId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectKeyword(item)}
              className={`group text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                  : 'border-zinc-200/80 dark:border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    idx < 3
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {item.keyword}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-500 shrink-0">
                      {item.growth_rate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {item.sources.map((src) => {
                      const meta = SOURCE_LABELS[src] || { label: src, badgeClass: '' };
                      return (
                        <span
                          key={src}
                          className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${meta.badgeClass}`}
                        >
                          {meta.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {item.score}점
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
