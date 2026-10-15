'use client';

import React, { useMemo, useState } from 'react';
import { Telescope, ExternalLink, ArrowUpDown } from 'lucide-react';
import { SourceType, TrendItem } from '@/types/trend';
import { getKeywordTranslation } from '@/lib/translate';

interface LongtailExplorerTableProps {
  items: (TrendItem & { clusterName?: string; region?: string })[];
  selectedItemId?: string;
  onSelectKeyword: (item: TrendItem) => void;
}

export function LongtailExplorerTable({
  items,
  selectedItemId,
  onSelectKeyword,
}: LongtailExplorerTableProps) {
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'keyword'>('score');

  const longtailItems = useMemo(() => {
    let filtered = items.filter((i) => i.trend_type === 'LONG_TAIL');

    if (selectedSource !== 'all') {
      filtered = filtered.filter((i) => i.sources.includes(selectedSource as SourceType));
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      return a.keyword.localeCompare(b.keyword);
    });
  }, [items, selectedSource, sortBy]);

  return (
    <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Telescope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              지속 수요 롱테일 탐색기 (Long-tail)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              폭발성은 낮아도 꾸준한 검색·재구매 니즈가 있는 스테디 키워드 모음입니다
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
          >
            <option value="all">모든 채널</option>
            <option value="naver">Naver</option>
            <option value="youtube">YouTube</option>
            <option value="google">Google</option>
            <option value="reddit">Reddit</option>
            <option value="producthunt">ProductHunt</option>
          </select>

          <button
            type="button"
            onClick={() => setSortBy(sortBy === 'score' ? 'keyword' : 'score')}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortBy === 'score' ? '기회점수순' : '가나다순'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
              <th className="py-2.5 px-3 font-semibold">키워드 (한글 번역)</th>
              <th className="py-2.5 px-3 font-semibold">테마 클러스터</th>
              <th className="py-2.5 px-3 font-semibold">성장 추세</th>
              <th className="py-2.5 px-3 font-semibold text-right">기회 점수</th>
              <th className="py-2.5 px-3 font-semibold text-right">실행 아이디어</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
            {longtailItems.map((item) => {
              const active = item.id === selectedItemId;
              const trans = getKeywordTranslation(item.keyword);
              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectKeyword(item)}
                  className={`cursor-pointer transition-colors ${
                    active
                      ? 'bg-emerald-500/10'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {trans.original}
                      </span>
                      {trans.translation && (
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">
                          ({trans.translation})
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {item.clusterName || '-'}
                  </td>
                  <td className="py-3 px-3 text-xs font-bold text-emerald-500">
                    {item.growth_rate}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-zinc-800 dark:text-zinc-200">
                    {item.score}점
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectKeyword(item);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-400"
                    >
                      <span>카드 열기</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
