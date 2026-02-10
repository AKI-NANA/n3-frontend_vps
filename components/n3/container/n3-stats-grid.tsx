/**
 * N3StatsGrid - 汎用統計グリッドコンポーネント
 * 
 * 統計カードをグリッドレイアウトで表示する純粋なレイアウトコンポーネント
 * N3サイズシステム対応（--n3-* 変数を参照）
 * 
 * @example
 * <N3StatsGrid columns={4}>
 *   <N3StatItem label="総数" value={1234} icon={Package} color="blue" />
 *   <N3StatItem label="売上" value="$45,678" color="green" />
 * </N3StatsGrid>
 */

'use client';

import React, { memo, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

export type StatColor = 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';

// N3StatsCardと同じカラースタイル
const colorStyles: Record<StatColor, { border: string; text: string }> = {
  default: { border: 'var(--panel-border)', text: 'var(--text)' },
  blue: { border: 'rgba(59, 130, 246, 0.5)', text: '#3b82f6' },
  green: { border: 'rgba(34, 197, 94, 0.5)', text: '#22c55e' },
  yellow: { border: 'rgba(234, 179, 8, 0.5)', text: '#ca8a04' },
  red: { border: 'rgba(239, 68, 68, 0.5)', text: '#ef4444' },
  purple: { border: 'rgba(168, 85, 247, 0.5)', text: '#a855f7' },
};

// ============================================================
// N3StatItem - 単一の統計アイテム（サイズシステム対応）
// ============================================================

export interface N3StatItemProps {
  /** ラベル */
  label: string;
  /** 値（文字列または数値） */
  value: string | number;
  /** アイコン（ReactNodeまたはLucideIcon） */
  icon?: ReactNode | LucideIcon;
  /** サブラベル */
  subLabel?: string;
  /** カラー（N3StatsCardと同じ） */
  color?: StatColor;
  /** 左ボーダーを表示 */
  borderLeft?: boolean;
  /** フッター要素 */
  footer?: ReactNode;
  /** クリックハンドラ */
  onClick?: () => void;
  /** 通貨フォーマット */
  currency?: 'JPY' | 'USD';
  /** 追加のクラス名 */
  className?: string;
}

export const N3StatItem = memo(function N3StatItem({
  label,
  value,
  icon,
  subLabel,
  color = 'default',
  borderLeft = false,
  footer,
  onClick,
  currency,
  className = '',
}: N3StatItemProps) {
  const colorStyle = colorStyles[color];

  // 値のフォーマット
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    if (currency === 'JPY') return `¥${val.toLocaleString()}`;
    if (currency === 'USD') return `${val.toLocaleString()}`;
    return val.toLocaleString();
  };

  // アイコンがコンポーネントかReactNodeかを判定
  const renderIcon = () => {
    if (!icon) return null;
    
    // LucideIconコンポーネントの場合
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon;
      return (
        <IconComponent
          style={{ 
            width: 'var(--n3-icon)', 
            height: 'var(--n3-icon)',
            color: colorStyle.text, 
            opacity: 0.7 
          }}
        />
      );
    }
    
    // ReactNodeの場合（既にJSX要素）
    return <div style={{ color: colorStyle.text, opacity: 0.7 }}>{icon}</div>;
  };

  return (
    <div
      className={`n3-stat-item ${onClick ? 'n3-stat-item--clickable' : ''} ${className}`}
      onClick={onClick}
      style={{
        background: 'var(--panel)',
        border: `1px solid ${colorStyle.border}`,
        borderLeft: borderLeft ? `3px solid ${colorStyle.text}` : `1px solid ${colorStyle.border}`,
        borderRadius: 'var(--style-radius-sm, 4px)',
        padding: 'var(--n3-px)',
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
      }}
    >
      {/* アイコン（上部中央） */}
      {icon && (
        <div style={{ marginBottom: 'calc(var(--n3-gap) * 0.5)' }}>
          {renderIcon()}
        </div>
      )}

      {/* 値（メイン） */}
      <div
        style={{
          fontSize: 'calc(var(--n3-font) * 1.6)',
          fontWeight: 700,
          color: colorStyle.text,
          fontFamily: 'var(--font-mono, monospace)',
          lineHeight: 1.2,
        }}
      >
        {formatValue(value)}
      </div>

      {/* ラベル */}
      <div
        style={{
          fontSize: 'calc(var(--n3-font) * 0.85)',
          color: 'var(--text-muted)',
          marginTop: 'calc(var(--n3-gap) * 0.25)',
        }}
      >
        {label}
      </div>

      {/* サブラベル */}
      {subLabel && (
        <div
          style={{
            fontSize: 'calc(var(--n3-font) * 0.75)',
            color: 'var(--text-muted)',
            marginTop: 'calc(var(--n3-gap) * 0.125)',
            opacity: 0.7,
          }}
        >
          {subLabel}
        </div>
      )}

      {/* フッター */}
      {footer && (
        <div style={{ marginTop: 'calc(var(--n3-gap) * 0.5)', fontSize: 'calc(var(--n3-font) * 0.8)' }}>
          {footer}
        </div>
      )}
    </div>
  );
});

N3StatItem.displayName = 'N3StatItem';

// ============================================================
// N3StatsGrid - 統計グリッドレイアウト
// ============================================================

export interface N3StatsGridProps {
  /** 子要素（N3StatItemなど） */
  children: ReactNode;
  /** 列数（2-6） */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** ギャップサイズ */
  gap?: 'xs' | 'sm' | 'md';
  /** 追加のクラス名 */
  className?: string;
}

export const N3StatsGrid = memo(function N3StatsGrid({
  children,
  columns = 4,
  gap = 'sm',
  className = '',
}: N3StatsGridProps) {
  // ギャップはN3サイズシステムに連動
  const gapStyles = { 
    xs: 'calc(var(--n3-gap) * 0.5)', 
    sm: 'var(--n3-gap)', 
    md: 'calc(var(--n3-gap) * 1.5)' 
  };

  return (
    <div
      className={`n3-stats-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gapStyles[gap],
      }}
    >
      {children}
    </div>
  );
});

N3StatsGrid.displayName = 'N3StatsGrid';

// ============================================================
// N3StatsSection - セクションタイトル付き統計グリッド
// ============================================================

export interface N3StatsSectionProps {
  /** セクションタイトル */
  title?: string;
  /** タイトルアイコン */
  titleIcon?: LucideIcon;
  /** 子要素（N3StatsGridなど） */
  children: ReactNode;
  /** 追加のクラス名 */
  className?: string;
}

export const N3StatsSection = memo(function N3StatsSection({
  title,
  titleIcon: TitleIcon,
  children,
  className = '',
}: N3StatsSectionProps) {
  return (
    <div className={`n3-stats-section ${className}`} style={{ marginBottom: 'var(--n3-px)' }}>
      {title && (
        <h3
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'calc(var(--n3-gap) * 0.5)',
            fontSize: 'var(--n3-font)',
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: 'var(--n3-gap)',
          }}
        >
          {TitleIcon && <TitleIcon style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)', color: 'var(--text-muted)' }} />}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
});

N3StatsSection.displayName = 'N3StatsSection';
