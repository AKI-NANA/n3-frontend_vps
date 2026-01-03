// app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx
/**
 * Analytics N3 ページレイアウト
 * 分析ダッシュボードの統合レイアウト
 *
 * ゴールドスタンダード準拠: useAnalyticsIntegrated フックを使用
 */

'use client';

import React, { memo, useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Brain,
  DollarSign,
  Star,
  FileText,
  RefreshCw,
  Download,
  Activity,
} from 'lucide-react';
import { N3Button } from '@/components/n3/presentational/n3-button';
import { N3Chart } from '@/components/n3/container/n3-chart';
import { useAnalyticsIntegrated } from '../hooks';
import type { AnalyticsL3Tab, KPIData } from '../types/analytics';

// L3タブ設定
const L3_TABS: { id: AnalyticsL3Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'sales', label: '売上分析', icon: <TrendingUp size={14} /> },
  { id: 'profit', label: '利益分析', icon: <DollarSign size={14} /> },
  { id: 'ai', label: 'AI品質管理', icon: <Brain size={14} /> },
  { id: 'pricing', label: '価格分析', icon: <BarChart3 size={14} /> },
  { id: 'scoring', label: 'スコアリング', icon: <Star size={14} /> },
  { id: 'reports', label: 'レポート', icon: <FileText size={14} /> },
];

// KPIカード
const KPICard = memo(function KPICard({ data }: { data: KPIData }) {
  const formatValue = (value: number | string, format?: string) => {
    if (typeof value === 'string') return value;
    switch (format) {
      case 'currency':
        return `¥${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  return (
    <div
      style={{
        padding: '16px',
        background: 'var(--panel)',
        borderRadius: 'var(--style-radius-lg, 12px)',
        border: '1px solid var(--panel-border)',
      }}
    >
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
        {data.label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)' }}>
          {formatValue(data.value, data.format)}
        </span>
        {data.change !== undefined && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              fontSize: '12px',
              color: data.change >= 0 ? 'var(--color-success)' : 'var(--color-error)',
            }}
          >
            {data.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {data.change >= 0 ? '+' : ''}{data.change}%
          </div>
        )}
      </div>
      {data.changeLabel && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          {data.changeLabel}
        </div>
      )}
    </div>
  );
});

export const AnalyticsN3PageLayout = memo(function AnalyticsN3PageLayout() {
  // ゴールドスタンダード: 統合フックを使用
  const {
    sales,
    profit,
    aiMetrics,
    stats,
    dateRangePreset,
    setDateRangePreset,
    isLoading,
    refresh,
  } = useAnalyticsIntegrated();

  const [activeTab, setActiveTab] = useState<AnalyticsL3Tab>('sales');

  // 売上チャートデータ
  const salesChartData = useMemo(() =>
    (sales?.timeline || []).map(d => ({
      name: d.date.slice(5), // MM-DD
      revenue: d.sales,
      orders: d.orders * 1000, // スケール調整
    })),
    [sales]
  );

  // 利益チャートデータ
  const profitChartData = useMemo(() =>
    (profit?.timeline || []).map(d => ({
      name: d.date.slice(5),
      revenue: d.revenue,
      cost: d.cost,
      profit: d.profit,
    })),
    [profit]
  );

  // 費用内訳チャートデータ
  const costPieData = useMemo(() => {
    const byCategory = profit?.byCategory || {};
    return Object.entries(byCategory).map(([category, amount]) => ({
      name: category,
      value: amount as number,
    }));
  }, [profit]);

  // KPIデータを生成
  const kpiData: KPIData[] = useMemo(() => [
    { id: 'sales', label: '総売上', value: sales?.totalSales || 0, format: 'currency', change: stats?.salesGrowth },
    { id: 'orders', label: '受注数', value: sales?.totalOrders || 0, change: stats?.orderGrowth },
    { id: 'avg', label: '平均受注額', value: sales?.avgOrderValue || 0, format: 'currency' },
    { id: 'profit', label: '利益率', value: profit?.avgMargin || 0, format: 'percentage' },
  ], [sales, profit, stats]);

  // タブコンテンツ
  const renderTabContent = () => {
    switch (activeTab) {
      case 'sales':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* KPIカード */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {kpiData.map(kpi => (
                <KPICard key={kpi.id} data={kpi} />
              ))}
            </div>

            {/* 売上チャート */}
            <div
              style={{
                padding: '20px',
                background: 'var(--panel)',
                borderRadius: 'var(--style-radius-lg, 12px)',
                border: '1px solid var(--panel-border)',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
                売上推移
              </div>
              <N3Chart
                type="area"
                data={salesChartData}
                series={[
                  { dataKey: 'revenue', name: '売上', color: 'var(--color-primary)' },
                ]}
                height={300}
                showGrid
                showLegend
              />
            </div>
          </div>
        );

      case 'profit':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 利益KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <KPICard
                data={{
                  id: 'revenue',
                  label: '総売上',
                  value: profit?.totalRevenue || 0,
                  format: 'currency',
                }}
              />
              <KPICard
                data={{
                  id: 'cost',
                  label: '総コスト',
                  value: profit?.totalCost || 0,
                  format: 'currency',
                }}
              />
              <KPICard
                data={{
                  id: 'profit',
                  label: '純利益',
                  value: profit?.totalProfit || 0,
                  change: stats?.profitGrowth,
                  format: 'currency',
                }}
              />
            </div>

            {/* チャートグリッド */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div
                style={{
                  padding: '20px',
                  background: 'var(--panel)',
                  borderRadius: 'var(--style-radius-lg, 12px)',
                  border: '1px solid var(--panel-border)',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
                  利益推移
                </div>
                <N3Chart
                  type="stacked-bar"
                  data={profitChartData}
                  series={[
                    { dataKey: 'profit', name: '利益', color: 'var(--color-success)' },
                    { dataKey: 'cost', name: 'コスト', color: 'var(--color-error)' },
                  ]}
                  height={280}
                  showGrid
                  showLegend
                />
              </div>

              <div
                style={{
                  padding: '20px',
                  background: 'var(--panel)',
                  borderRadius: 'var(--style-radius-lg, 12px)',
                  border: '1px solid var(--panel-border)',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
                  費用内訳
                </div>
                <N3Chart
                  type="pie"
                  data={costPieData}
                  height={250}
                  showLegend
                />
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* AI統計 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <KPICard
                data={{
                  id: 'health',
                  label: 'システム健全性',
                  value: aiMetrics?.processingStats?.successRate || 0,
                  format: 'percentage',
                }}
              />
              <KPICard
                data={{
                  id: 'accuracy',
                  label: '平均精度',
                  value: aiMetrics?.generationQuality?.avgScore || 0,
                  format: 'percentage',
                }}
              />
              <KPICard
                data={{
                  id: 'processed',
                  label: '処理済み',
                  value: aiMetrics?.processingStats?.totalProcessed || 0,
                }}
              />
              <KPICard
                data={{
                  id: 'seo',
                  label: 'SEOスコア',
                  value: aiMetrics?.seoPerformance?.avgScore || 0,
                  format: 'percentage',
                }}
              />
            </div>

            {/* AI品質情報 */}
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
              AI品質サマリー
            </div>
            <div
              style={{
                padding: '16px',
                background: 'var(--panel)',
                borderRadius: 'var(--style-radius-lg, 12px)',
                border: '1px solid var(--panel-border)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>生成品質トレンド</div>
                  <div style={{ fontSize: '20px', fontWeight: 600, color: aiMetrics?.generationQuality?.trend === 'up' ? 'var(--color-success)' : 'var(--text)' }}>
                    {aiMetrics?.generationQuality?.trend === 'up' ? '上昇中' : aiMetrics?.generationQuality?.trend === 'down' ? '低下中' : '安定'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>価格最適化</div>
                  <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)' }}>
                    {aiMetrics?.pricingAccuracy?.profitOptimization || 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              background: 'var(--panel)',
              borderRadius: 'var(--style-radius-lg, 12px)',
              border: '1px solid var(--panel-border)',
            }}
          >
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Activity size={32} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '14px' }}>準備中...</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--panel-border)',
          background: 'var(--panel)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-info))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BarChart3 size={20} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                分析ダッシュボード (N3)
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                売上・利益・AI品質の統合分析
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* 期間選択 */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['7days', '30days', '90days'] as const).map(range => (
                <N3Button
                  key={range}
                  variant={dateRangePreset === range ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setDateRangePreset(range)}
                >
                  {range === '7days' ? '7日' : range === '30days' ? '30日' : '90日'}
                </N3Button>
              ))}
            </div>

            <N3Button variant="secondary" size="sm" onClick={refresh} disabled={isLoading}>
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </N3Button>

            <N3Button variant="secondary" size="sm">
              <Download size={14} />
              エクスポート
            </N3Button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左サイドバー */}
        <div
          style={{
            width: '200px',
            borderRight: '1px solid var(--panel-border)',
            background: 'var(--panel)',
            padding: '12px',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', padding: '0 8px' }}>
            分析メニュー
          </div>
          {L3_TABS.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--style-radius-md, 8px)',
                cursor: 'pointer',
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text)',
                marginBottom: '4px',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              <span style={{ fontSize: '13px', fontWeight: activeTab === tab.id ? 600 : 400 }}>
                {tab.label}
              </span>
            </div>
          ))}
        </div>

        {/* コンテンツエリア */}
        <div
          style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            background: 'var(--bg)',
          }}
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
});

export default AnalyticsN3PageLayout;
