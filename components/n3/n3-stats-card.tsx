// components/n3/n3-stats-card.tsx
'use client';

import React, { memo } from 'react';
import { LucideIcon } from 'lucide-react';

export interface N3StatsCardProps {
  /** ラベル */
  label: string;
  /** 値 */
  value: number | string;
  /** アイコン */
  icon?: LucideIcon;
  /** 色テーマ（ボーダーとテキストに適用） */
  color?: 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' | 'gray';
  /** サイズ */
  size?: 'compact' | 'sm' | 'md' | 'lg';
  /** 変化量（前回比） */
  change?: number;
  /** 変化の単位 */
  changeUnit?: string;
  /** クリックハンドラ */
  onClick?: () => void;
  /** 通貨フォーマット */
  currency?: 'JPY' | 'USD';
  /** ローディング状態 */
  loading?: boolean;
}

// ボーダーに薄い色、テキストに濃い色（approvalページ風）
const colorStyles: Record<string, { border: string; text: string }> = {
  default: {
    border: 'var(--panel-border)',
    text: 'var(--text)',
  },
  blue: {
    border: 'rgba(59, 130, 246, 0.5)',
    text: '#3b82f6',
  },
  green: {
    border: 'rgba(34, 197, 94, 0.5)',
    text: '#22c55e',
  },
  yellow: {
    border: 'rgba(234, 179, 8, 0.5)',
    text: '#ca8a04',
  },
  red: {
    border: 'rgba(239, 68, 68, 0.5)',
    text: '#ef4444',
  },
  purple: {
    border: 'rgba(168, 85, 247, 0.5)',
    text: '#a855f7',
  },
  orange: {
    border: 'rgba(249, 115, 22, 0.5)',
    text: '#f97316',
  },
  gray: {
    border: 'rgba(107, 114, 128, 0.5)',
    text: '#6b7280',
  },
};

export const N3StatsCard = memo(function N3StatsCard({
  label,
  value,
  icon: Icon,
  color = 'default',
  size = 'md',
  change,
  changeUnit = '%',
  onClick,
  currency,
  loading = false,
}: N3StatsCardProps) {
  // colorが未定義の場合はdefaultにフォールバック
  const colorStyle = colorStyles[color] || colorStyles.default;

  // 値のフォーマット
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    if (currency === 'JPY') return `¥${val.toLocaleString()}`;
    if (currency === 'USD') return `$${val.toLocaleString()}`;
    return val.toLocaleString();
  };

  // コンパクトモード（ヘッダーパネル用）- インライン表示
  if (size === 'compact') {
    return (
      <div
        onClick={onClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          background: 'var(--panel)',
          border: `1px solid ${colorStyle.border}`,
          borderRadius: '4px',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.15s ease',
          whiteSpace: 'nowrap',
        }}
        className={onClick ? 'hover:brightness-95' : ''}
      >
        {Icon && <Icon size={13} style={{ color: colorStyle.text, opacity: 0.7 }} />}
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ 
          fontSize: '13px', 
          fontWeight: 700, 
          color: colorStyle.text,
          fontFamily: 'var(--font-mono, monospace)',
        }}>
          {loading ? '...' : formatValue(value)}
        </span>
        {change !== undefined && (
          <span style={{ 
            fontSize: '10px', 
            color: change >= 0 ? '#22c55e' : '#ef4444',
          }}>
            {change >= 0 ? '↑' : '↓'}{Math.abs(change)}{changeUnit}
          </span>
        )}
      </div>
    );
  }

  // sm/md/lg モード - approvalページ風のカード
  const sizeConfig = {
    sm: { padding: '12px', valueSize: '20px', labelSize: '11px', iconSize: 14 },
    md: { padding: '16px', valueSize: '24px', labelSize: '12px', iconSize: 16 },
    lg: { padding: '20px', valueSize: '28px', labelSize: '13px', iconSize: 18 },
  };

  const cfg = sizeConfig[size as 'sm' | 'md' | 'lg'] || sizeConfig.md;

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--panel)',
        border: `1px solid ${colorStyle.border}`,
        borderRadius: '8px',
        padding: cfg.padding,
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
      }}
      className={onClick ? 'hover:shadow-sm' : ''}
    >
      {/* 値（メイン） */}
      {loading ? (
        <div
          style={{
            height: cfg.valueSize,
            width: '60px',
            margin: '0 auto',
            background: 'var(--highlight)',
            borderRadius: '4px',
            animation: 'pulse 1.5s infinite',
          }}
        />
      ) : (
        <div
          style={{
            fontSize: cfg.valueSize,
            fontWeight: 700,
            color: colorStyle.text,
            fontFamily: 'var(--font-mono, monospace)',
            lineHeight: 1.2,
          }}
        >
          {formatValue(value)}
        </div>
      )}

      {/* ラベル */}
      <div
        style={{
          fontSize: cfg.labelSize,
          color: 'var(--text-muted)',
          marginTop: '4px',
        }}
      >
        {label}
      </div>

      {/* 変化量 */}
      {change !== undefined && (
        <div
          style={{
            fontSize: '11px',
            marginTop: '4px',
            color: change >= 0 ? '#22c55e' : '#ef4444',
          }}
        >
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}{changeUnit}
        </div>
      )}
    </div>
  );
});

export default N3StatsCard;
