'use client';

import React from 'react';
import { Database, RefreshCw, Sparkles, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EmptyStateViewProps {
  isConnected: boolean;
  errorMessage: string | null;
  onRefresh: () => void;
  onLoadMockData: () => void;
}

export function EmptyStateView({
  isConnected,
  errorMessage,
  onRefresh,
  onLoadMockData,
}: EmptyStateViewProps) {
  return (
    <div className="w-full col-span-1 lg:col-span-12 my-6">
      <div className="max-w-2xl mx-auto rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-8 sm:p-10 text-center shadow-sm">
        {/* 상태 아이콘 */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Clock className="w-8 h-8 animate-spin-slow" />
        </div>

        {/* 배지: Supabase 상태 */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
          {isConnected ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Supabase 연결 정상 (데이터 적재 대기 중)</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Supabase 연결 대기 (.env.local 설정 필요)</span>
            </>
          )}
        </div>

        {/* 메인 타이틀 */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 mb-2.5 tracking-tight">
          트렌드 데이터 수집 대기 중입니다
        </h2>

        {/* 상세 설명 */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
          현재 선택하신 조건에 해당하는 트렌드 클러스터 데이터가 아직 데이터베이스에 적재되지 않았습니다.
          <br className="hidden sm:inline" />
          GitHub Actions 자동화 파이프라인(<code>pipeline/collector.py</code> 및 <code>analyzer.py</code>)이
          실행되면 자동으로 트렌드 분석 결과가 채워집니다.
        </p>

        {/* 에러 메시지(있는 경우) 안내 박스 */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 text-left">
            <span className="font-semibold block mb-0.5">안내 사항:</span>
            {errorMessage}
          </div>
        )}

        {/* 동작 버튼 그룹 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-sm font-semibold transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Supabase 다시 조회하기</span>
          </button>

          <button
            type="button"
            onClick={onLoadMockData}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>샘플 데이터로 대시보드 미리보기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
