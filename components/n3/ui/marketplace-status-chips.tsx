/**
 * MarketplaceStatusChips - 販路別ステータス表示コンポーネント
 * 
 * データグリッドの1セル内に、各モールのステータスをアイコンで表示
 * - グレー: 未計算 (none)
 * - 青: 計算済み (calculated)
 * - 緑: 出品中 (listed)
 * - オレンジ: 準備完了 (ready)
 * - 赤: エラー/赤字 (error)
 */

'use client';

import React, { memo } from 'react';
import { Globe, ShoppingBag, Zap, PackageCheck, Store, BarChart3 } from 'lucide-react';

// 販路設定
interface MarketplaceInfo {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  color: string;
}

const MARKETPLACES: MarketplaceInfo[] = [
  { id: 'ebay', label: 'eBay', shortLabel: 'eB', icon: Globe, color: '#0064d2' },
  { id: 'qoo10_jp', label: 'Qoo10', shortLabel: 'Q10', icon: ShoppingBag, color: '#ff0066' },
  { id: 'amazon_jp', label: 'Amazon JP', shortLabel: 'Amz', icon: Zap, color: '#ff9900' },
  { id: 'mercari_jp', label: 'メルカリ', shortLabel: 'Mer', icon: PackageCheck, color: '#ff2d55' },
  { id: 'yahoo_auction_jp', label: 'ヤフオク', shortLabel: 'YA', icon: Store, color: '#ff0033' },
];

// ステータス別の色
const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  none: { bg: '#f1f5f9', border: '#e2e8f0', text: '#94a3b8' },
  calculated: { bg: '#dbeafe', border: '#3b82f6', text: '#1d4ed8' },
  ready: { bg: '#fef3c7', border: '#f59e0b', text: '#b45309' },
  listed: { bg: '#dcfce7', border: '#22c55e', text: '#15803d' },
  error: { bg: '#fee2e2', border: '#ef4444', text: '#dc2626' },
};

// 販路データの型
interface MarketplaceData {
  price_jpy?: number;
  profit_jpy?: number;
  profit_margin?: number;
  status: 'none' | 'calculated' | 'ready' | 'listed' | 'error';
  last_calculated_at?: string;
  error_message?: string;
}

interface MarketplaceListings {
  [key: string]: MarketplaceData;
}

interface MarketplaceStatusChipsProps {
  /** marketplace_listings JSONBデータ */
  marketplaceListings?: MarketplaceListings;
  /** 表示する販路のID配列（指定しない場合は全て） */
  visibleMarketplaces?: string[];
  /** コンパクト表示（アイコンのみ） */
  compact?: boolean;
  /** クリック時のハンドラ */
  onMarketplaceClick?: (marketplaceId: string) => void;
}

export const MarketplaceStatusChips = memo(function MarketplaceStatusChips({
  marketplaceListings = {},
  visibleMarketplaces,
  compact = true,
  onMarketplaceClick,
}: MarketplaceStatusChipsProps) {
  const displayMarketplaces = visibleMarketplaces
    ? MARKETPLACES.filter(m => visibleMarketplaces.includes(m.id))
    : MARKETPLACES;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        flexWrap: 'nowrap',
      }}
    >
      {displayMarketplaces.map(mp => {
        const data = marketplaceListings[mp.id];
        const status = data?.status || 'none';
        const colors = STATUS_COLORS[status];
        const Icon = mp.icon;

        // ツールチップ内容
        const tooltipLines = [mp.label];
        if (data?.profit_jpy !== undefined) {
          tooltipLines.push(`利益: ¥${data.profit_jpy.toLocaleString()}`);
        }
        if (data?.profit_margin !== undefined) {
          tooltipLines.push(`利益率: ${data.profit_margin.toFixed(1)}%`);
        }
        if (data?.last_calculated_at) {
          const date = new Date(data.last_calculated_at);
          tooltipLines.push(`計算: ${date.toLocaleDateString('ja-JP')} ${date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`);
        }
        if (data?.error_message) {
          tooltipLines.push(`エラー: ${data.error_message}`);
        }
        const tooltip = tooltipLines.join('\n');

        return (
          <div
            key={mp.id}
            title={tooltip}
            onClick={() => onMarketplaceClick?.(mp.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: compact ? '22px' : '50px',
              height: '20px',
              padding: compact ? '0 3px' : '0 6px',
              fontSize: '9px',
              fontWeight: 600,
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: '4px',
              color: colors.text,
              cursor: onMarketplaceClick ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon size={compact ? 12 : 10} style={{ marginRight: compact ? 0 : 3 }} />
            {!compact && <span>{mp.shortLabel}</span>}
          </div>
        );
      })}
    </div>
  );
});

// ============================================================
// 利益表示付きの拡張版
// ============================================================

interface MarketplaceStatusCardProps {
  marketplaceListings?: MarketplaceListings;
  onMarketplaceClick?: (marketplaceId: string) => void;
}

export const MarketplaceStatusCard = memo(function MarketplaceStatusCard({
  marketplaceListings = {},
  onMarketplaceClick,
}: MarketplaceStatusCardProps) {
  // 計算済みの販路数
  const calculatedCount = Object.values(marketplaceListings).filter(
    d => d.status === 'calculated' || d.status === 'ready' || d.status === 'listed'
  ).length;

  // 最高利益の販路
  const bestMarketplace = Object.entries(marketplaceListings)
    .filter(([_, d]) => d.profit_jpy !== undefined && d.profit_jpy > 0)
    .sort((a, b) => (b[1].profit_jpy || 0) - (a[1].profit_jpy || 0))[0];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '8px',
        background: '#f8fafc',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
      }}
    >
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', fontWeight: 600, color: '#64748b' }}>
          販路ステータス
        </span>
        <span style={{ fontSize: '10px', color: '#94a3b8' }}>
          {calculatedCount}/{MARKETPLACES.length} 計算済
        </span>
      </div>

      {/* チップ */}
      <MarketplaceStatusChips
        marketplaceListings={marketplaceListings}
        compact={false}
        onMarketplaceClick={onMarketplaceClick}
      />

      {/* 最高利益 */}
      {bestMarketplace && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            background: '#dcfce7',
            borderRadius: '4px',
            fontSize: '10px',
          }}
        >
          <BarChart3 size={12} style={{ color: '#15803d' }} />
          <span style={{ color: '#15803d', fontWeight: 600 }}>
            最高利益: {MARKETPLACES.find(m => m.id === bestMarketplace[0])?.label} 
            ¥{bestMarketplace[1].profit_jpy?.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
});

export default MarketplaceStatusChips;
