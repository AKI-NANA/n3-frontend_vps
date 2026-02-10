// app/tools/editing-n3/components/data-origin-dot.tsx
/**
 * N3 データ由来ドット
 * 
 * 各フィールドのデータ由来を4色で表示:
 * - 🟠 橙 (Manual): 手動入力
 * - 🔵 青 (SM): SellerMirrorから取得
 * - 🟢 緑 (Calculated): 内部計算（配送料、利益率など）
 * - 🟣 紫 (AI): AI推論（Gemini等）
 * 
 * 使用例:
 * <DataOriginDot origin="ai" size="sm" />
 * <DataOriginDot origin="sm" size="md" showLabel />
 */

'use client';

import React, { memo, useState } from 'react';

// ============================================================
// 型定義
// ============================================================

export type DataOrigin = 
  | 'manual'     // 手動入力
  | 'sm'         // SellerMirrorから取得
  | 'calculated' // 内部計算
  | 'ai'         // AI推論
  | 'unknown';   // 不明

export interface DataOriginInfo {
  origin: DataOrigin;
  color: string;
  bgColor: string;
  label: string;
  labelEn: string;
  icon: string;
  description: string;
  reliability: 'high' | 'medium' | 'low';
  warningMessage?: string;
}

export const DATA_ORIGIN_INFO: Record<DataOrigin, DataOriginInfo> = {
  manual: {
    origin: 'manual',
    color: '#f97316',
    bgColor: '#fff7ed',
    label: '手動',
    labelEn: 'Manual',
    icon: '✏️',
    description: 'ユーザーが手動で入力した値',
    reliability: 'high',
  },
  sm: {
    origin: 'sm',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    label: 'SM取得',
    labelEn: 'SM Data',
    icon: '🔍',
    description: 'SellerMirrorから取得したデータ',
    reliability: 'high',
  },
  calculated: {
    origin: 'calculated',
    color: '#22c55e',
    bgColor: '#f0fdf4',
    label: '計算値',
    labelEn: 'Calculated',
    icon: '📊',
    description: '内部ロジックで計算された値',
    reliability: 'high',
  },
  ai: {
    origin: 'ai',
    color: '#a855f7',
    bgColor: '#faf5ff',
    label: 'AI推論',
    labelEn: 'AI Inference',
    icon: '🤖',
    description: 'AIによる推論値（目視確認推奨）',
    reliability: 'medium',
    warningMessage: '⚠️ AIによる推論値です。目視確認を推奨します。',
  },
  unknown: {
    origin: 'unknown',
    color: '#9ca3af',
    bgColor: '#f3f4f6',
    label: '不明',
    labelEn: 'Unknown',
    icon: '❓',
    description: 'データ由来が不明',
    reliability: 'low',
  },
};

// ============================================================
// コンポーネント
// ============================================================

export interface DataOriginDotProps {
  origin: DataOrigin;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
  tipsEnabled?: boolean;
  onClick?: () => void;
}

const SIZE_MAP = {
  xs: { dot: 6, font: 8, padding: '1px 4px' },
  sm: { dot: 8, font: 9, padding: '2px 5px' },
  md: { dot: 10, font: 10, padding: '2px 6px' },
  lg: { dot: 12, font: 11, padding: '3px 8px' },
};

export const DataOriginDot = memo(function DataOriginDot({
  origin,
  size = 'sm',
  showLabel = false,
  showTooltip = true,
  tipsEnabled = true,
  onClick,
}: DataOriginDotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const info = DATA_ORIGIN_INFO[origin];
  const sizeConfig = SIZE_MAP[size];

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* ドット */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: sizeConfig.dot,
          height: sizeConfig.dot,
          borderRadius: '50%',
          background: info.color,
          flexShrink: 0,
        }}
        title={!showTooltip || !tipsEnabled ? `${info.label}: ${info.description}` : undefined}
      />

      {/* ラベル */}
      {showLabel && (
        <span
          style={{
            marginLeft: 4,
            fontSize: sizeConfig.font,
            fontWeight: 500,
            color: info.color,
            padding: sizeConfig.padding,
            background: info.bgColor,
            borderRadius: 3,
          }}
        >
          {info.label}
        </span>
      )}

      {/* ツールチップ */}
      {isHovered && showTooltip && tipsEnabled && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 6,
            padding: '8px 12px',
            background: '#1f2937',
            color: 'white',
            borderRadius: 6,
            fontSize: 10,
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            zIndex: 100,
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 12 }}>{info.icon}</span>
            <span style={{ fontWeight: 600, color: info.color }}>{info.label}</span>
          </div>
          <div style={{ color: '#d1d5db' }}>{info.description}</div>
          {info.warningMessage && (
            <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #374151', color: '#fbbf24' }}>
              {info.warningMessage}
            </div>
          )}
          {/* 三角形の矢印 */}
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1f2937',
            }}
          />
        </div>
      )}
    </div>
  );
});

// ============================================================
// フィールド値と由来をまとめて表示するコンポーネント
// ============================================================

export interface DataFieldWithOriginProps {
  label: string;
  value: string | number | null | undefined;
  origin: DataOrigin;
  unit?: string;
  tipsEnabled?: boolean;
  emptyText?: string;
}

export const DataFieldWithOrigin = memo(function DataFieldWithOrigin({
  label,
  value,
  origin,
  unit = '',
  tipsEnabled = true,
  emptyText = '-',
}: DataFieldWithOriginProps) {
  const info = DATA_ORIGIN_INFO[origin];
  const displayValue = value !== null && value !== undefined ? `${value}${unit}` : emptyText;
  const isEmpty = value === null || value === undefined;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <DataOriginDot origin={origin} size="xs" tipsEnabled={tipsEnabled} />
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: isEmpty ? 'var(--text-muted)' : 'var(--text)',
        }}
      >
        {displayValue}
      </span>
      {origin === 'ai' && !isEmpty && (
        <span style={{ fontSize: 9, color: '#a855f7', fontWeight: 600 }}>AI</span>
      )}
    </div>
  );
});

// ============================================================
// データ由来を判定するユーティリティ
// ============================================================

/**
 * 商品フィールドの由来を判定
 * 
 * @param product 商品データ
 * @param field フィールド名
 * @returns データ由来
 */
export function getFieldOrigin(product: any, field: string): DataOrigin {
  // listing_data内のdata_sourcesを確認
  const dataSources = product?.listing_data?.data_sources || {};
  const ebayApiData = product?.ebay_api_data || {};
  
  // 明示的な由来情報がある場合
  if (dataSources[field]) {
    const source = dataSources[field];
    if (source === 'manual' || source === 'user') return 'manual';
    if (source === 'sm' || source === 'sellermirror' || source === 'reference') return 'sm';
    if (source === 'calculated' || source === 'computed') return 'calculated';
    if (source === 'ai' || source === 'gemini' || source === 'inference') return 'ai';
  }

  // フィールド別のデフォルト由来を推定
  switch (field) {
    // 通常SM由来
    case 'sm_lowest_price':
    case 'sm_average_price':
    case 'sm_competitor_count':
    case 'sm_sales_count':
    case 'sm_reference_count':
      return 'sm';

    // 通常計算値
    case 'ddp_price_usd':
    case 'ddu_price_usd':
    case 'profit_margin':
    case 'profit_amount_usd':
    case 'shipping_cost':
    case 'shipping_cost_usd':
    case 'total_cost':
      return 'calculated';

    // AI推論の可能性が高いフィールド
    case 'weight_g':
    case 'width_cm':
    case 'length_cm':
    case 'height_cm':
    case 'hts_code':
    case 'origin_country':
    case 'material':
      // AI由来かどうかを確認
      if (product?.listing_data?.ai_enriched?.[field]) return 'ai';
      if (ebayApiData?.ai_inference?.[field]) return 'ai';
      // SM参照がある場合
      if (product?.sm_selected_id) return 'sm';
      return 'manual';

    // 手動入力が多いフィールド
    case 'title':
    case 'title_en':
    case 'english_title':
    case 'cost_price':
    case 'cost_jpy':
    case 'sku':
      return 'manual';

    default:
      return 'unknown';
  }
}

/**
 * 商品の重要フィールドの由来サマリーを取得
 */
export function getProductOriginSummary(product: any): Record<string, DataOrigin> {
  const fields = [
    'weight_g',
    'hts_code',
    'origin_country',
    'material',
    'ddp_price_usd',
    'profit_margin',
    'sm_lowest_price',
  ];

  const summary: Record<string, DataOrigin> = {};
  for (const field of fields) {
    summary[field] = getFieldOrigin(product, field);
  }
  return summary;
}

/**
 * AI由来のデータが含まれているかチェック
 */
export function hasAIInferredData(product: any): boolean {
  const summary = getProductOriginSummary(product);
  return Object.values(summary).includes('ai');
}

export default DataOriginDot;
