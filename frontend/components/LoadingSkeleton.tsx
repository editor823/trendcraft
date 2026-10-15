import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full animate-pulse">
      {/* 좌측 영역 (레이더, 클러스터, 롱테일) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Spike Radar Skeleton */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="space-y-1.5">
                <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-56 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 p-3" />
            ))}
          </div>
        </div>

        {/* Theme Cluster Skeleton */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-1.5">
              <div className="h-4 w-44 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 p-4" />
            ))}
          </div>
        </div>
      </div>

      {/* 우측 영역 (Action Insight Card Skeleton) */}
      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-1.5">
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
          <div className="h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800/60" />
        </div>
      </div>
    </div>
  );
}
