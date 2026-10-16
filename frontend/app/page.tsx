'use client';

// ============================================================================
// TrendCraft 메인 대시보드 엔트리 페이지 (대메뉴 2대 탭 전환 통합본)
// File: frontend/app/page.tsx
// Description:
//   상단 글로벌 헤더에 [⚡ 트렌드 인텔리전스]와 [🔬 마케팅 연구소 (Marketing Lab)]
//   2대 대메뉴 탭 전환 네비게이션을 배치하여 기존 실시간 트렌드 레이더와
//   신규 바이럴 마케팅 연구소를 매끄럽게 전환할 수 있습니다.
// ============================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Zap,
  FlaskConical,
  Compass,
  RefreshCw,
  Calendar,
  Search,
} from 'lucide-react';

import MarketingLab from '../components/MarketingLab';
import { MainNavTab } from '../types/marketing';

import { fetchTrendClusters, getMockTrendClusters } from '@/lib/supabase';
import { PeriodType, RegionType, TrendCluster, TrendItem } from '@/types/trend';
import { SpikeRadarCard } from '@/components/SpikeRadarCard';
import { ThemeClusterGrid } from '@/components/ThemeClusterGrid';
import { ActionInsightCard } from '@/components/ActionInsightCard';
import { LongtailExplorerTable } from '@/components/LongtailExplorerTable';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyStateView } from '@/components/EmptyStateView';

export default function TrendCraftHomePage() {
  // 상단 대메뉴 탭 상태 ('trend_intelligence' | 'marketing_lab')
  // 초기 진입 시 신규 마케팅 연구소가 기본으로 활성화되어 멋진 화면을 즉시 확인 가능
  const [activeMainTab, setActiveMainTab] = useState<MainNavTab>('marketing_lab');

  // =========================================================================
  // 트렌드 인텔리전스 모듈 전용 상태 관리
  // =========================================================================
  const [period, setPeriod] = useState<PeriodType>('daily');
  const [region, setRegion] = useState<RegionType>('ALL');
  const [targetDate, setTargetDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [clusters, setClusters] = useState<TrendCluster[]>([]);
  const [selectedItem, setSelectedItem] = useState<TrendItem | null>(null);
  const [selectedClusterName, setSelectedClusterName] = useState<string>('');

  // 상태 관리: 로딩 상태, Supabase 연결 상태, 샘플 모드 여부
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);

  // Supabase에서 실시간 데이터 로드
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

  // 필터 변경 시 데이터 로드
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* =====================================================================
          상단 글로벌 네비게이션 헤더 (2대 대메뉴 탭 스위처)
         ===================================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          {/* 브랜드 로고 */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-indigo-500/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white">
                  TrendCraft
                </h1>
                <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                  v2.4 PRO
                </span>
                {activeMainTab === 'trend_intelligence' && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isMockMode
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : isConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isMockMode ? '샘플 미리보기' : isConnected ? 'Supabase Live' : 'Supabase 연결 대기'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                AI 트렌드 레이더 &amp; 7대 SNS 바이럴 마케팅 연구소
              </p>
            </div>
          </div>

          {/* 2대 대메뉴 탭 스위처 버튼 그룹 */}
          <nav
            aria-label="대메뉴 탭 네비게이션"
            className="flex items-center gap-1.5 rounded-2xl border border-slate-800 bg-slate-900/90 p-1.5 shadow-inner"
          >
            <button
              type="button"
              onClick={() => setActiveMainTab('trend_intelligence')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                activeMainTab === 'trend_intelligence'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>⚡ 트렌드 인텔리전스</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('marketing_lab')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                activeMainTab === 'marketing_lab'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 font-extrabold'
                  : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
              }`}
            >
              <FlaskConical className="h-4 w-4" />
              <span>🔬 마케팅 연구소 (Marketing Lab)</span>
            </button>
          </nav>
        </div>

        {/* [⚡ 트렌드 인텔리전스] 활성화 시 상단 보조 필터 서브바 노출 */}
        {activeMainTab === 'trend_intelligence' && (
          <div className="border-t border-slate-800/60 bg-slate-950/70 px-4 py-2.5 sm:px-6">
            <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* 새로고침 / Supabase 재연결 버튼 */}
                <button
                  type="button"
                  onClick={handleRefreshSupabase}
                  disabled={isLoading}
                  title="Supabase 최신 데이터 동기화"
                  className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                </button>

                {/* 주기 필터 토글 (일간 / 주간 / 월간) */}
                <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                  {(['daily', 'weekly', 'monthly'] as PeriodType[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPeriod(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        period === p
                          ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p === 'daily' ? '일간' : p === 'weekly' ? '주간' : '월간'}
                    </button>
                  ))}
                </div>

                {/* 지역 필터 탭 (전체 / 국내 / 글로벌) */}
                <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                  {(['ALL', 'KR', 'GLOBAL'] as RegionType[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegion(r)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        region === r
                          ? 'bg-emerald-600 text-white shadow-sm font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r === 'ALL' ? '전체' : r === 'KR' ? '국내' : '글로벌'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* 날짜 선택기 */}
                <div className="relative flex items-center">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 focus:outline-none focus:border-amber-500/60"
                  />
                </div>

                {/* 키워드 검색창 */}
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="키워드, 아이디어 검색..."
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-800 bg-slate-900 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 w-36 sm:w-56"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          메인 콘텐츠 영역
         ===================================================================== */}
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        {activeMainTab === 'marketing_lab' ? (
          /* [🔬 마케팅 연구소 (Marketing Lab)] 뷰 */
          <MarketingLab />
        ) : (
          /* [⚡ 트렌드 인텔리전스] 뷰 */
          <div>
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredClusters.length === 0 ? (
              <EmptyStateView
                isConnected={isConnected}
                errorMessage={errorMessage}
                onRefresh={handleRefreshSupabase}
                onLoadMockData={handleLoadMockData}
              />
            ) : (
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
                  <div className="lg:sticky lg:top-24">
                    <ActionInsightCard item={selectedItem} clusterName={selectedClusterName} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
