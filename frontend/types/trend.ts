export type PeriodType = 'daily' | 'weekly' | 'monthly';
export type RegionType = 'ALL' | 'KR' | 'GLOBAL';
export type TrendType = 'SPIKE' | 'LONG_TAIL';
export type SourceType = 'naver' | 'youtube' | 'google' | 'reddit' | 'producthunt';

export interface TrendItem {
  id: string;
  cluster_id: string;
  keyword: string;
  trend_type: TrendType;
  score: number;
  growth_rate: string;
  content_idea: string;
  product_idea: string;
  service_idea: string;
  sources: SourceType[];
}

export interface TrendCluster {
  id: string;
  period_type: PeriodType;
  region: RegionType;
  cluster_name: string;
  cluster_summary: string;
  target_date: string;
  created_at: string;
  trend_items: TrendItem[];
}
