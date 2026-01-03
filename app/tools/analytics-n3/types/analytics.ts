// app/tools/analytics-n3/types/analytics.ts
/**
 * Analytics N3 型定義
 * 分析・AI品質管理・レポートの型
 */

// マーケットプレイス
export type Marketplace = 'ebay' | 'amazon' | 'mercari' | 'yahoo' | 'rakuten' | 'all';

// 期間タイプ
export type DateRange = '7d' | '30d' | '90d' | '1y' | 'custom';

// 売上データ
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  marketplace: Marketplace;
}

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  aovChange: number;
}

// 利益データ
export interface ProfitData {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  marketplace: Marketplace;
}

export interface ProfitSummary {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  averageMargin: number;
  profitChange: number;
  marginChange: number;
}

// 費用内訳
export interface CostBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

// AI品質
export interface AIMetrics {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastUpdated: string;
  status: 'healthy' | 'warning' | 'error';
}

export interface AIImprovement {
  id: string;
  type: 'accuracy' | 'performance' | 'data' | 'feature';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  priority: number;
}

// 価格分析
export interface PriceAnalysis {
  productId: string;
  sku: string;
  title: string;
  currentPrice: number;
  optimalPrice: number;
  competitorAvg: number;
  competitorMin: number;
  competitorMax: number;
  priceElasticity: number;
  recommendation: 'increase' | 'decrease' | 'maintain';
}

// 商品スコア
export interface ProductScore {
  productId: string;
  sku: string;
  title: string;
  marketplace: Marketplace;
  overallScore: number;
  seoScore: number;
  priceScore: number;
  demandScore: number;
  competitionScore: number;
  profitScore: number;
  trend: 'up' | 'down' | 'stable';
}

// レポート
export interface ReportConfig {
  id: string;
  name: string;
  type: 'sales' | 'profit' | 'inventory' | 'performance' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly' | 'on_demand';
  format: 'csv' | 'pdf' | 'excel';
  lastGenerated?: string;
  recipients?: string[];
}

export interface GeneratedReport {
  id: string;
  configId: string;
  name: string;
  type: string;
  format: string;
  size: number;
  generatedAt: string;
  downloadUrl: string;
}

// KPIカード
export interface KPIData {
  id: string;
  label: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'stable';
  format?: 'number' | 'currency' | 'percentage';
  icon?: string;
  color?: string;
}

// L3タブ
export type AnalyticsL3Tab =
  | 'sales'
  | 'profit'
  | 'ai'
  | 'pricing'
  | 'scoring'
  | 'reports';

export interface AnalyticsL3TabConfig {
  id: AnalyticsL3Tab;
  label: string;
  icon: string;
}

// ============================================================
// 統合フック用追加型定義
// ============================================================

// 売上タイムラインデータ
export interface SalesTimelineEntry {
  date: string;
  sales: number;
  orders: number;
}

export interface SalesDataExtended {
  timeline: SalesTimelineEntry[];
  totalSales: number;
  totalOrders: number;
  avgOrderValue: number;
  byMarketplace: Record<string, number>;
}

// 利益タイムラインデータ
export interface ProfitTimelineEntry {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

export interface ProfitDataExtended {
  timeline: ProfitTimelineEntry[];
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  avgMargin: number;
  byCategory: Record<string, {
    revenue: number;
    cost: number;
    profit: number;
    margin: number;
  }>;
}

// AI品質メトリクス
export interface AIMetricsData {
  generationQuality: {
    avgScore: number;
    scoreDistribution: Record<string, number>;
    trend: 'up' | 'down' | 'stable';
  };
  seoPerformance: {
    avgScore: number;
    improvementRate: number;
    topKeywords: string[];
  };
  pricingAccuracy: {
    avgDeviation: number;
    competitiveRatio: number;
    profitOptimization: number;
  };
  processingStats: {
    totalProcessed: number;
    successRate: number;
    avgProcessingTime: number;
  };
}

// 分析統計
export interface AnalyticsStats {
  salesGrowth: number;
  profitGrowth: number;
  orderGrowth: number;
  newCustomers: number;
  repeatRate: number;
}
