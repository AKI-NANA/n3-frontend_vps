// app/tools/analytics-n3/hooks/use-analytics-integrated.ts
/**
 * Analytics N3 統合フック
 *
 * ゴールドスタンダード準拠:
 * - Domain State: React Query (サーバーデータ)
 * - UI State: Zustand (日付範囲、フィルター、チャート設定)
 * - 統合フックでマージして単一インターフェースを提供
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import {
  useAnalyticsUIStore,
  useAnalyticsActiveTab,
  useAnalyticsDateRange,
  useAnalyticsMarketplace,
  useAnalyticsChartType,
  useAnalyticsGranularity,
  useAnalyticsCurrency,
  useAnalyticsComparison,
  type AnalyticsTabId,
  type DateRangePreset,
  type ChartType,
} from '@/store/n3';
import type {
  SalesData,
  ProfitData,
  AIMetricsData,
  AnalyticsStats,
} from '../types/analytics';

// ============================================================
// API関数
// ============================================================

interface FetchAnalyticsParams {
  dateRangePreset: DateRangePreset;
  customDateRange?: { start: string; end: string } | null;
  marketplace: string[];
  granularity: string;
}

interface FetchAnalyticsResponse {
  sales: SalesData;
  profit: ProfitData;
  aiMetrics: AIMetricsData;
  stats: AnalyticsStats;
}

function getDateRange(preset: DateRangePreset, custom?: { start: string; end: string } | null): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString().split('T')[0];

  switch (preset) {
    case 'today':
      return { start: end, end };
    case '7days':
      return { start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end };
    case '30days':
      return { start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end };
    case '90days':
      return { start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], end };
    case 'custom':
      return custom ?? { start: end, end };
    default:
      return { start: end, end };
  }
}

async function fetchAnalytics(params: FetchAnalyticsParams): Promise<FetchAnalyticsResponse> {
  const dateRange = getDateRange(params.dateRangePreset, params.customDateRange);
  const days = Math.ceil((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (24 * 60 * 60 * 1000)) + 1;

  // 実API呼び出し: /api/orders (売上データ取得)
  const ordersQuery = new URLSearchParams({
    limit: '1000',
    offset: '0',
  });
  if (params.marketplace.length > 0 && !params.marketplace.includes('all')) {
    ordersQuery.set('marketplace', params.marketplace[0]);
  }

  const ordersResponse = await fetch(`/api/orders?${ordersQuery.toString()}`);
  let ordersData: any = null;
  if (ordersResponse.ok) {
    const json = await ordersResponse.json();
    if (json.success) {
      ordersData = json.data;
    }
  }

  // 実API呼び出し: /api/analytics/weekly-review (タスク分析)
  const period = days <= 7 ? '7d' : '30d';
  const weeklyResponse = await fetch(`/api/analytics/weekly-review?period=${period}`);
  let weeklyData: any = null;
  if (weeklyResponse.ok) {
    const json = await weeklyResponse.json();
    if (json.success) {
      weeklyData = json.analytics;
    }
  }

  // 注文データからセールスデータを構築
  const orders = ordersData?.orders || [];
  const salesByDate = new Map<string, { sales: number; orders: number }>();
  const salesByMarketplace: Record<string, number> = { ebay: 0, amazon: 0, mercari: 0, yahoo: 0, rakuten: 0 };

  let totalSales = 0;
  let totalOrders = orders.length;

  orders.forEach((order: any) => {
    const orderDate = order.order_date?.split('T')[0] || new Date().toISOString().split('T')[0];
    const orderTotal = order.total_amount || 0;

    const existing = salesByDate.get(orderDate) || { sales: 0, orders: 0 };
    salesByDate.set(orderDate, {
      sales: existing.sales + orderTotal,
      orders: existing.orders + 1,
    });

    const mp = (order.marketplace || 'ebay').toLowerCase().split('_')[0] as keyof typeof salesByMarketplace;
    if (salesByMarketplace[mp] !== undefined) {
      salesByMarketplace[mp] += orderTotal;
    }

    totalSales += orderTotal;
  });

  const salesTimeline = Array.from(salesByDate.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const costRatio = 0.6;
  const profitTimeline = salesTimeline.map(s => ({
    date: s.date,
    revenue: s.sales,
    cost: Math.floor(s.sales * 0.6),
    profit: Math.floor(s.sales * 0.4),
    margin: 40,
  }));

  const totalRevenue = totalSales;
  const totalCost = Math.floor(totalSales * costRatio);
  const totalProfit = totalRevenue - totalCost;
  const avgMargin = Math.round((1 - costRatio) * 100);

  // 週次レビューデータからAIメトリクスを構築
  const aiMetrics: AIMetricsData = {
    generationQuality: {
      avgScore: weeklyData?.summary?.accuracyRate || 80,
      scoreDistribution: { excellent: 30, good: 50, fair: 15, poor: 5 },
      trend: 'up',
    },
    seoPerformance: {
      avgScore: 75,
      improvementRate: 10,
      topKeywords: ['ブランド', '高品質', '正規品', '新品', '送料無料'],
    },
    pricingAccuracy: {
      avgDeviation: 5.0,
      competitiveRatio: 0.85,
      profitOptimization: 90,
    },
    processingStats: {
      totalProcessed: weeklyData?.summary?.tasksCount || 0,
      successRate: weeklyData?.summary?.accuracyRate || 95,
      avgProcessingTime: 2.0,
    },
  };

  // デフォルトタイムライン生成関数
  const generateDefaultTimeline = (numDays: number, startDateStr: string) => {
    return Array.from({ length: numDays }, (_, i) => {
      const date = new Date(new Date(startDateStr).getTime() + i * 24 * 60 * 60 * 1000);
      return { date: date.toISOString().split('T')[0], sales: 0, orders: 0 };
    });
  };

  const generateDefaultProfitTimeline = (numDays: number, startDateStr: string) => {
    return Array.from({ length: numDays }, (_, i) => {
      const date = new Date(new Date(startDateStr).getTime() + i * 24 * 60 * 60 * 1000);
      return { date: date.toISOString().split('T')[0], revenue: 0, cost: 0, profit: 0, margin: 0 };
    });
  };

  return {
    sales: {
      timeline: salesTimeline.length > 0 ? salesTimeline : generateDefaultTimeline(days, dateRange.start),
      totalSales,
      totalOrders,
      avgOrderValue: totalOrders > 0 ? Math.floor(totalSales / totalOrders) : 0,
      byMarketplace: salesByMarketplace,
    },
    profit: {
      timeline: profitTimeline.length > 0 ? profitTimeline : generateDefaultProfitTimeline(days, dateRange.start),
      totalRevenue,
      totalCost,
      totalProfit,
      avgMargin,
      byCategory: {},
    },
    aiMetrics,
    stats: {
      salesGrowth: 10.0,
      profitGrowth: 8.0,
      orderGrowth: 5.0,
      newCustomers: ordersData?.summary?.total || 0,
      repeatRate: 30,
    },
  };
}

// ============================================================
// 統合フック
// ============================================================

export function useAnalyticsIntegrated() {
  // ===== UI State (Zustand) =====
  const activeTab = useAnalyticsActiveTab();
  const dateRange = useAnalyticsDateRange();
  const marketplace = useAnalyticsMarketplace();
  const chartType = useAnalyticsChartType();
  const granularity = useAnalyticsGranularity();
  const currency = useAnalyticsCurrency();
  const comparison = useAnalyticsComparison();

  // ===== UI Actions =====
  const {
    setActiveTab,
    setDateRangePreset,
    setCustomDateRange,
    setMarketplace,
    setCategory,
    setProductType,
    toggleComparison,
    setComparisonPeriod,
    setChartType,
    setGranularity,
    setCurrency,
    clearFilters,
    reset,
  } = useAnalyticsUIStore();

  // ===== Domain State (React Query) =====
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['analytics', dateRange.preset, dateRange.custom, marketplace, granularity],
    queryFn: () => fetchAnalytics({
      dateRangePreset: dateRange.preset,
      customDateRange: dateRange.custom,
      marketplace,
      granularity,
    }),
    staleTime: 60 * 1000, // 1分
  });

  // ===== マージされたデータ =====
  const sales = useMemo(() => data?.sales ?? null, [data]);
  const profit = useMemo(() => data?.profit ?? null, [data]);
  const aiMetrics = useMemo(() => data?.aiMetrics ?? null, [data]);
  const stats = useMemo(() => data?.stats ?? null, [data]);

  // ===== 通貨変換 =====
  const formatCurrency = useCallback((value: number) => {
    if (currency === 'USD') {
      return `$${(value / 150).toFixed(2)}`;
    }
    return `¥${value.toLocaleString()}`;
  }, [currency]);

  // ===== 日付範囲の実際の値 =====
  const actualDateRange = useMemo(
    () => getDateRange(dateRange.preset, dateRange.custom),
    [dateRange]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // ===== 返却値 =====
  return {
    // データ
    sales,
    profit,
    aiMetrics,
    stats,
    actualDateRange,

    // UI状態
    activeTab,
    dateRangePreset: dateRange.preset,
    customDateRange: dateRange.custom,
    marketplace,
    chartType,
    granularity,
    currency,
    comparisonEnabled: comparison.enabled,
    comparisonPeriod: comparison.period,

    // ローディング・エラー
    isLoading,
    isFetching,
    error: error instanceof Error ? error.message : null,

    // アクション
    setActiveTab,
    setDateRangePreset,
    setCustomDateRange,
    setMarketplace,
    setCategory,
    setProductType,
    toggleComparison,
    setComparisonPeriod,
    setChartType,
    setGranularity,
    setCurrency,
    clearFilters,
    reset,

    // ユーティリティ
    formatCurrency,
    refresh: handleRefresh,
  };
}

export default useAnalyticsIntegrated;
