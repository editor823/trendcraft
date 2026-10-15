'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Search, Calendar, Compass, Database, RefreshCw, Sparkles } from 'lucide-react';
import { fetchTrendClusters, getMockTrendClusters } from '@/lib/supabase';
import { PeriodType, RegionType, TrendCluster, TrendItem } from '@/types/trend';
import { SpikeRadarCard } from '@/components/SpikeRadarCard';
import { ThemeClusterGrid } from '@/components/ThemeClusterGrid';
import { ActionInsightCard } from '@/components/ActionInsightCard';
import { LongtailExplorerTable } from '@/components/LongtailExplorerTable';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyStateView } from '@/components/EmptyStateView';

export default function TrendCraftDashboardPage() {
  const [period, setPeriod] = useState<PeriodType>('daily');
  const [region, setRegion] = useState<RegionType>('ALL');
  const [targetDate, setTargetDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [clusters, setClusters] = useState<TrendCluster[]>([]);
  const [selectedItem, setSelectedItem] = useState<TrendItem | null>(null);
  const [selectedClusterName, setSelectedClusterName] = useState<string>('');

  // 상태 관리: 로딩 상태, Supabase 연결 상태, 목(샘플) 모드 토글
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);

  // Supabase에서 직접 데이터 로드
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetchTrendClusters({
        period,
        region,
        targetDate: targetDate || undefined,
      });

      setClusters(res.data);
      setIsConnected(res.isConnected);
      setErrorMessage(res.error);

      if (res.data.length > 0) {
        const firstItem = res.data[0]?.trend_items?.[0] || null;
        setSelectedItem(firstItem);
        setSelectedClusterName(res.data[0]?.cluster_name || '');
      } else {
        setSelectedItem(null);
        setSelectedClusterName('');
      }
    } catch (err: any) {
      console.error('Failed to load trend clusters:', err);
      setErrorMessage(err?.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [period, region, targetDate]);

  // 필터 변경 시: 목 모드이면 해당 필터에 맞는 샘플 데이터를 불러오고, 아니면 Supabase 조회
  useEffect(() => {
    if (isMockMode) {
      const mock = getMockTrendClusters(period, region);
      setClusters(mock);
      const firstItem = mock[0]?.trend_items?.[0] || null;
      setSelectedItem(firstItem);
      setSelectedClusterName(mock[0]?.cluster_name || '');
      setIsLoading(false);
    } else {
      loadData();
    }
  }, [period, region, targetDate, isMockMode, loadData]);

  // '샘플 데이터로 미리보기' 클릭 핸들러
  const handleLoadMockData = () => {
    setIsMockMode(true);
    const mock = getMockTrendClusters(period, region);
    setClusters(mock);
    const firstItem = mock[0]?.trend_items?.[0] || null;
    setSelectedItem(firstItem);
    setSelectedClusterName(mock[0]?.cluster_name || '');
  };

  // 'Supabase 다시 조회하기' 클릭 핸들러
  const handleRefreshSupabase = () => {
    setIsMockMode(false);
    loadData();
  };

  const filteredClusters = useMemo(() => {
    if (!searchQuery.trim()) return clusters;
    const q = searchQuery.toLowerCase();
    return clusters
      .map((c) => ({
        ...c,
        trend_items: c.trend_items.filter(
          (i) =>
            i.keyword.toLowerCase().includes(q) ||
            i.content_idea.toLowerCase().includes(q) ||
            i.product_idea.toLowerCase().includes(q) ||
            i.service_idea.toLowerCase().includes(q)
        ),
      }))
      .filter((c) => c.trend_items.length > 0 || c.cluster_name.toLowerCase().includes(q));
  }, [clusters, searchQuery]);

  const allItems = useMemo(() => {
    return filteredClusters.flatMap((c) =>
      c.trend_items.map((item) => ({
        ...item,
        clusterName: c.cluster_name,
        region: c.region,
      }))
    );
  }, [filteredClusters]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight">TrendCraft</h1>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isMockMode
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : isConnected
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {isMockMode ? '샘플 미리보기 모드' : isConnected ? 'Supabase Live' : 'Supabase 연결 대기'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                AI 트렌드 클러스터링 & 메이커 실행 아이디어 보드
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 새로고침 / Supabase 재연결 버튼 */}
            <button
              type="button"
              onClick={handleRefreshSupabase}
              disabled={isLoading}
              title="Supabase 최신 데이터 동기화"
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* 주기 필터 토글 */}
            <div className="inline-flex rounded-xl bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800">
              {(['daily', 'weekly', 'monthly'] as PeriodType[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    period === p
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {p === 'daily' ? '일간' : p === 'weekly' ? '주간' : '월간'}
                </button>
              ))}
            </div>

            {/* 지역 필터 탭 */}
            <div className="inline-flex rounded-xl bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800">
              {(['ALL', 'KR', 'GLOBAL'] as RegionType[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    region === r
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {r === 'ALL' ? '전체' : r === 'KR' ? '국내' : '글로벌'}
                </button>
              ))}
            </div>

            {/* 날짜 선택기 */}
            <div className="relative flex items-center">
              <Calendar className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              />
            </div>

            {/* 키워드 검색창 */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="키워드, 아이디어 검색..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 w-36 sm:w-48"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* 1. 로딩 상태 스켈레톤 UI */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredClusters.length === 0 ? (
          /* 2. 데이터가 비어있을 때: 데이터 수집 대기 중 안내 뷰 */
          <EmptyStateView
            isConnected={isConnected}
            errorMessage={errorMessage}
            onRefresh={handleRefreshSupabase}
            onLoadMockData={handleLoadMockData}
          />
        ) : (
          /* 3. 정상 트렌드 클러스터 데이터 표시 */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <SpikeRadarCard
                items={allItems}
                selectedItemId={selectedItem?.id}
                onSelectKeyword={(item) => setSelectedItem(item)}
              />
              <ThemeClusterGrid
                clusters={filteredClusters}
                selectedItemId={selectedItem?.id}
                onSelectKeyword={(item, clusterName) => {
                  setSelectedItem(item);
                  setSelectedClusterName(clusterName);
                }}
              />
              <LongtailExplorerTable
                items={allItems}
                selectedItemId={selectedItem?.id}
                onSelectKeyword={(item) => setSelectedItem(item)}
              />
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-20">
                <ActionInsightCard item={selectedItem} clusterName={selectedClusterName} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
