// app/tools/analytics-n3/hooks/use-analytics-data.ts
/**
 * Analytics N3 データフック
 * 売上・利益・KPIデータの取得・管理
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  SalesData,
  SalesSummary,
  ProfitData,
  ProfitSummary,
  CostBreakdown,
  KPIData,
  DateRange,
  Marketplace,
} from '../types/analytics';

// モック売上データ生成
const generateSalesData = (days: number, marketplace: Marketplace): SalesData[] => {
  const data: SalesData[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const baseRevenue = 50000 + Math.random() * 100000;
    const orders = Math.floor(10 + Math.random() * 30);

    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(baseRevenue),
      orders,
      averageOrderValue: Math.round(baseRevenue / orders),
      marketplace: marketplace === 'all' ? (['ebay', 'amazon', 'mercari'] as Marketplace[])[i % 3] : marketplace,
    });
  }

  return data;
};

// モック利益データ生成
const generateProfitData = (days: number): ProfitData[] => {
  const data: ProfitData[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const revenue = 50000 + Math.random() * 100000;
    const margin = 0.2 + Math.random() * 0.15;
    const profit = revenue * margin;
    const cost = revenue - profit;

    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(revenue),
      cost: Math.round(cost),
      profit: Math.round(profit),
      margin: Math.round(margin * 100) / 100,
      marketplace: (['ebay', 'amazon', 'mercari'] as Marketplace[])[i % 3],
    });
  }

  return data;
};

// 費用内訳
const defaultCostBreakdown: CostBreakdown[] = [
  { category: '仕入れ原価', amount: 450000, percentage: 45, color: 'var(--color-primary)' },
  { category: 'プラットフォーム手数料', amount: 150000, percentage: 15, color: 'var(--color-success)' },
  { category: '送料', amount: 120000, percentage: 12, color: 'var(--color-warning)' },
  { category: '梱包材', amount: 30000, percentage: 3, color: 'var(--color-error)' },
  { category: '広告費', amount: 80000, percentage: 8, color: 'var(--color-info)' },
  { category: 'その他', amount: 70000, percentage: 7, color: 'var(--text-muted)' },
];

export function useAnalyticsData() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [marketplace, setMarketplace] = useState<Marketplace>('all');
  const [loading, setLoading] = useState(false);

  // 日数変換
  const getDays = useCallback((range: DateRange): number => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  }, []);

  // 売上データ
  const salesData = useMemo(
    () => generateSalesData(getDays(dateRange), marketplace),
    [dateRange, marketplace, getDays]
  );

  // 売上サマリー
  const salesSummary = useMemo((): SalesSummary => {
    const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: Math.round(averageOrderValue),
      revenueChange: 12.5,
      ordersChange: 8.3,
      aovChange: 4.2,
    };
  }, [salesData]);

  // 利益データ
  const profitData = useMemo(
    () => generateProfitData(getDays(dateRange)),
    [dateRange, getDays]
  );

  // 利益サマリー
  const profitSummary = useMemo((): ProfitSummary => {
    const totalRevenue = profitData.reduce((sum, d) => sum + d.revenue, 0);
    const totalCost = profitData.reduce((sum, d) => sum + d.cost, 0);
    const totalProfit = profitData.reduce((sum, d) => sum + d.profit, 0);
    const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      averageMargin: Math.round(averageMargin * 10) / 10,
      profitChange: 15.2,
      marginChange: 2.1,
    };
  }, [profitData]);

  // 費用内訳
  const costBreakdown = defaultCostBreakdown;

  // KPIデータ
  const kpiData: KPIData[] = useMemo(() => [
    {
      id: 'revenue',
      label: '売上高',
      value: salesSummary.totalRevenue,
      change: salesSummary.revenueChange,
      changeLabel: '前期比',
      trend: 'up',
      format: 'currency',
      color: 'var(--color-primary)',
    },
    {
      id: 'orders',
      label: '注文数',
      value: salesSummary.totalOrders,
      change: salesSummary.ordersChange,
      changeLabel: '前期比',
      trend: 'up',
      format: 'number',
      color: 'var(--color-success)',
    },
    {
      id: 'profit',
      label: '利益',
      value: profitSummary.totalProfit,
      change: profitSummary.profitChange,
      changeLabel: '前期比',
      trend: 'up',
      format: 'currency',
      color: 'var(--color-warning)',
    },
    {
      id: 'margin',
      label: '利益率',
      value: profitSummary.averageMargin,
      change: profitSummary.marginChange,
      changeLabel: '前期比',
      trend: 'up',
      format: 'percentage',
      color: 'var(--color-info)',
    },
  ], [salesSummary, profitSummary]);

  // リフレッシュ
  const refresh = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  }, []);

  return {
    dateRange,
    setDateRange,
    marketplace,
    setMarketplace,
    salesData,
    salesSummary,
    profitData,
    profitSummary,
    costBreakdown,
    kpiData,
    loading,
    refresh,
  };
}

export default useAnalyticsData;
