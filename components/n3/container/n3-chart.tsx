// components/n3/container/n3-chart.tsx
/**
 * N3Chart - チャートコンポーネント (Container)
 * Rechartsのラッパー、N3デザインシステム準拠
 */

'use client';

import React, { memo, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps,
} from 'recharts';

// チャートタイプ
export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'stacked-bar';

// データポイント
export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

// シリーズ定義
export interface ChartSeries {
  key: string;
  name: string;
  color?: string;
  stackId?: string;
}

export interface N3ChartProps {
  type: ChartType;
  data: ChartDataPoint[];
  series?: ChartSeries[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  xAxisKey?: string;
  yAxisLabel?: string;
  colors?: string[];
  className?: string;
  style?: React.CSSProperties;
}

// N3カラーパレット
const N3_CHART_COLORS = [
  'var(--color-primary)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-error)',
  'var(--color-info)',
  'var(--color-purple)',
  'var(--color-secondary)',
];

// Hex変換（CSS変数から実際の色を取得）
const getComputedColor = (cssVar: string): string => {
  if (typeof window === 'undefined') return '#6366f1';
  if (!cssVar.startsWith('var(')) return cssVar;

  const varName = cssVar.replace('var(', '').replace(')', '');
  const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return computed || '#6366f1';
};

// カスタムツールチップ
const CustomTooltip = memo(function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        borderRadius: 'var(--style-radius-md, 8px)',
        padding: '8px 12px',
        boxShadow: 'var(--style-shadow-lg)',
        fontSize: 'var(--n3-font, 12px)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text)' }}>
        {label}
      </div>
      {payload.map((entry, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: entry.color,
            }}
          />
          <span>{entry.name}:</span>
          <span style={{ fontWeight: 500, color: 'var(--text)' }}>
            {typeof entry.value === 'number'
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
});

// カスタム凡例
const CustomLegend = memo(function CustomLegend({
  payload,
}: {
  payload?: Array<{ value: string; color: string }>;
}) {
  if (!payload?.length) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginTop: '8px',
        fontSize: 'var(--n3-font, 12px)',
      }}
    >
      {payload.map((entry, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-muted)',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              background: entry.color,
            }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
});

export const N3Chart = memo(function N3Chart({
  type,
  data,
  series,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  xAxisKey = 'name',
  yAxisLabel,
  colors = N3_CHART_COLORS,
  className = '',
  style,
}: N3ChartProps) {
  // 色の解決
  const resolvedColors = useMemo(() => {
    return colors.map(c => getComputedColor(c));
  }, [colors]);

  // 共通軸設定
  const axisStyle = {
    fontSize: 11,
    fill: 'var(--text-muted)',
  };

  const gridStyle = {
    stroke: 'var(--panel-border)',
    strokeDasharray: '3 3',
  };

  // シリーズがない場合のデフォルト
  const effectiveSeries = series || [{ key: 'value', name: 'Value' }];

  // バーチャート
  const renderBarChart = () => (
    <BarChart data={data}>
      {showGrid && <CartesianGrid {...gridStyle} />}
      <XAxis dataKey={xAxisKey} tick={axisStyle} axisLine={{ stroke: 'var(--panel-border)' }} />
      <YAxis tick={axisStyle} axisLine={{ stroke: 'var(--panel-border)' }} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: axisStyle } : undefined} />
      {showTooltip && <Tooltip content={<CustomTooltip />} />}
      {showLegend && <Legend content={<CustomLegend />} />}
      {effectiveSeries.map((s, i) => (
        <Bar
          key={s.key}
          dataKey={s.key}
          name={s.name}
          fill={s.color || resolvedColors[i % resolvedColors.length]}
          radius={[4, 4, 0, 0]}
          stackId={s.stackId}
        />
      ))}
    </BarChart>
  );

  // ラインチャート
  const renderLineChart = () => (
    <LineChart data={data}>
      {showGrid && <CartesianGrid {...gridStyle} />}
      <XAxis dataKey={xAxisKey} tick={axisStyle} axisLine={{ stroke: 'var(--panel-border)' }} />
      <YAxis tick={axisStyle} axisLine={{ stroke: 'var(--panel-border)' }} />
      {showTooltip && <Tooltip content={<CustomTooltip />} />}
      {showLegend && <Legend content={<CustomLegend />} />}
      {effectiveSeries.map((s, i) => (
        <Line
          key={s.key}
          type="monotone"
          dataKey={s.key}
          name={s.name}
          stroke={s.color || resolvedColors[i % resolvedColors.length]}
          strokeWidth={2}
          dot={{ fill: s.color || resolvedColors[i % resolvedColors.length], strokeWidth: 0, r: 3 }}
          activeDot={{ r: 5 }}
        />
      ))}
    </LineChart>
  );

  // エリアチャート
  const renderAreaChart = () => (
    <AreaChart data={data}>
      {showGrid && <CartesianGrid {...gridStyle} />}
      <XAxis dataKey={xAxisKey} tick={axisStyle} axisLine={{ stroke: 'var(--panel-border)' }} />
      <YAxis tick={axisStyle} axisLine={{ stroke: 'var(--panel-border)' }} />
      {showTooltip && <Tooltip content={<CustomTooltip />} />}
      {showLegend && <Legend content={<CustomLegend />} />}
      {effectiveSeries.map((s, i) => (
        <Area
          key={s.key}
          type="monotone"
          dataKey={s.key}
          name={s.name}
          stroke={s.color || resolvedColors[i % resolvedColors.length]}
          fill={s.color || resolvedColors[i % resolvedColors.length]}
          fillOpacity={0.2}
          strokeWidth={2}
        />
      ))}
    </AreaChart>
  );

  // パイチャート
  const renderPieChart = () => (
    <PieChart>
      {showTooltip && <Tooltip content={<CustomTooltip />} />}
      {showLegend && <Legend content={<CustomLegend />} />}
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={height / 3}
        innerRadius={height / 6}
        paddingAngle={2}
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        labelLine={{ stroke: 'var(--text-muted)', strokeWidth: 1 }}
      >
        {data.map((_, index) => (
          <Cell key={index} fill={resolvedColors[index % resolvedColors.length]} />
        ))}
      </Pie>
    </PieChart>
  );

  // チャート選択
  const renderChart = () => {
    switch (type) {
      case 'bar':
      case 'stacked-bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'area':
        return renderAreaChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div
      className={`n3-chart ${className}`}
      style={{
        width: '100%',
        height,
        ...style,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
});

export default N3Chart;
