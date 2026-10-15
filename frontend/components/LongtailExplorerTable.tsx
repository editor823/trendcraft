'use client';

import React, { useState } from 'react';
import { TrendingUp, ArrowUpDown, ExternalLink } from 'lucide-react';
import { TrendItem } from '@/types/trend';

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
  const [sortBy, setSortBy] = useState<'score' | 'keyword'>('score');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');

  const longtailItems = items
    .filter((i) => i.trend_type === 'LONG_TAIL')
    .filter((i) => (sourceFilter === 'ALL' ? true : i.sources.includes(sourceFilter as any)))
    .sort((a, b) => (sortBy === 'score' ? b.score - a.score : a.keyword.localeCompare(b.keyword)));

  return (
    <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              스테디 롱테일 탐색기 (Long-tail Explorer)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              반짝 유행이 아닌 지속적 검색 수요와 구매 전환이 검증된 에버그린 키워드
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1.5 text-zinc-700 dark:text-zinc-200"
          >
            <option value="ALL">모든 출처</option>
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
              <th className="py-2.5 px-3 font-semibold">키워드</th>
              <th className="py-2.5 px-3 font-semibold">테마 클러스터</th>
              <th className="py-2.5 px-3 font-semibold">성장 추세</th>
              <th className="py-2.5 px-3 font-semibold text-right">기회 점수</th>
              <th className="py-2.5 px-3 font-semibold text-right">실행 아이디어</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
            {longtailItems.map((item) => {
              const active = item.id === selectedItemId;
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
                  <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.keyword}
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
