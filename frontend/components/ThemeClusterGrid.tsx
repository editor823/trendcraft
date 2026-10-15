'use client';

import React from 'react';
import { Layers, Sparkles, MapPin, Globe } from 'lucide-react';
import { TrendCluster, TrendItem } from '@/types/trend';
import { getKeywordTranslation } from '@/lib/translate';

interface ThemeClusterGridProps {
  clusters: TrendCluster[];
  selectedItemId?: string;
  onSelectKeyword: (item: TrendItem, clusterName: string) => void;
}

export function ThemeClusterGrid({
  clusters,
  selectedItemId,
  onSelectKeyword,
}: ThemeClusterGridProps) {
  if (!clusters.length) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            테마별 AI 트렌드 클러스터
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            연관도 높은 키워드를 하나로 묶은 상위 비즈니스 테마 보드입니다
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clusters.map((cluster) => (
          <div
            key={cluster.id}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 flex flex-col justify-between shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {cluster.region === 'KR' ? (
                    <MapPin className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Globe className="w-3 h-3 text-indigo-500" />
                  )}
                  {cluster.region}
                </span>
                <span className="text-[11px] text-zinc-400">{cluster.target_date}</span>
              </div>

              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">
                {cluster.cluster_name}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                {cluster.cluster_summary}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="text-[11px] font-medium text-zinc-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                소속 키워드 클릭 시 실행 카드 보기
              </div>
              <div className="flex flex-col gap-1.5">
                {cluster.trend_items.map((item) => {
                  const active = item.id === selectedItemId;
                  const trans = getKeywordTranslation(item.keyword);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectKeyword(item, cluster.cluster_name)}
                      className={`text-xs px-3 py-2 rounded-xl font-medium transition-all flex items-center justify-between gap-2 border text-left ${
                        active
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-zinc-50 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{trans.original}</span>
                        {trans.translation && (
                          <span
                            className={`text-[11px] font-normal mt-0.5 ${
                              active ? 'text-indigo-100' : 'text-zinc-500 dark:text-zinc-400'
                            }`}
                          >
                            ({trans.translation})
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 font-medium ${
                          item.trend_type === 'SPIKE'
                            ? active
                              ? 'bg-white/20 text-white'
                              : 'bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20'
                            : active
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {item.trend_type === 'SPIKE' ? '급상승' : '스테디'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
