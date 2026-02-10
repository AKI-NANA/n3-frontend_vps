// app/tools/operations-n3/components/cards/operations-badges.tsx
/**
 * Operations N3 - ステータスバッジ (Presentational)
 * React.memo + 外部マージン禁止
 */

'use client';

import React, { memo } from 'react';
import type { OrderStatus, ShippingStatus, InquiryStatus, Priority, Marketplace } from '../../types/operations';

// ============================================================
// OrderStatusBadge - 注文ステータス
// ============================================================

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  new: { label: '新規', color: 'var(--text)', bg: 'var(--highlight)' },
  paid: { label: '支払済', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  processing: { label: '処理中', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  shipped: { label: '出荷済', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  delivered: { label: '配送完了', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  cancelled: { label: 'キャンセル', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const OrderStatusBadge = memo(function OrderStatusBadge({
  status,
  size = 'sm',
}: OrderStatusBadgeProps) {
  const config = ORDER_STATUS_CONFIG[status];
  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        fontSize,
        fontWeight: 500,
        color: config.color,
        background: config.bg,
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
});

// ============================================================
// ShippingStatusBadge - 出荷ステータス
// ============================================================

const SHIPPING_STATUS_CONFIG: Record<ShippingStatus, { label: string; color: string; bg: string }> = {
  pending: { label: '出荷待ち', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  picking: { label: 'ピッキング', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  packed: { label: '梱包完了', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  shipped: { label: '出荷済', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  delivered: { label: '配送完了', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
};

export interface ShippingStatusBadgeProps {
  status: ShippingStatus;
  size?: 'sm' | 'md';
}

export const ShippingStatusBadge = memo(function ShippingStatusBadge({
  status,
  size = 'sm',
}: ShippingStatusBadgeProps) {
  const config = SHIPPING_STATUS_CONFIG[status];
  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        fontSize,
        fontWeight: 500,
        color: config.color,
        background: config.bg,
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
});

// ============================================================
// InquiryStatusBadge - 問い合わせステータス
// ============================================================

const INQUIRY_STATUS_CONFIG: Record<InquiryStatus, { label: string; color: string; bg: string }> = {
  unread: { label: '未読', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  ai_responded: { label: 'AI対応済', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  pending_manual: { label: '手動対応待ち', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  completed: { label: '完了', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
};

export interface InquiryStatusBadgeProps {
  status: InquiryStatus;
  size?: 'sm' | 'md';
}

export const InquiryStatusBadge = memo(function InquiryStatusBadge({
  status,
  size = 'sm',
}: InquiryStatusBadgeProps) {
  const config = INQUIRY_STATUS_CONFIG[status];
  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        fontSize,
        fontWeight: 500,
        color: config.color,
        background: config.bg,
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
});

// ============================================================
// PriorityBadge - 優先度
// ============================================================

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; icon: string }> = {
  critical: { label: '緊急', color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)', icon: '🔴' },
  high: { label: '高', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: '🟠' },
  medium: { label: '中', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', icon: '🔵' },
  low: { label: '低', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: '🟢' },
};

export interface PriorityBadgeProps {
  priority: Priority;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const PriorityBadge = memo(function PriorityBadge({
  priority,
  showIcon = true,
  size = 'sm',
}: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding,
        fontSize,
        fontWeight: 500,
        color: config.color,
        background: config.bg,
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      {showIcon && <span style={{ fontSize: '8px' }}>{config.icon}</span>}
      {config.label}
    </span>
  );
});

// ============================================================
// MarketplaceBadge - モール
// ============================================================

const MARKETPLACE_CONFIG: Record<Marketplace, { label: string; color: string; bg: string }> = {
  ebay: { label: 'eBay', color: '#0064d2', bg: 'rgba(0, 100, 210, 0.1)' },
  amazon: { label: 'Amazon', color: '#ff9900', bg: 'rgba(255, 153, 0, 0.1)' },
  mercari: { label: 'メルカリ', color: '#ff0211', bg: 'rgba(255, 2, 17, 0.1)' },
  yahoo: { label: 'Yahoo', color: '#ff0033', bg: 'rgba(255, 0, 51, 0.1)' },
  rakuten: { label: '楽天', color: '#bf0000', bg: 'rgba(191, 0, 0, 0.1)' },
  shopee: { label: 'Shopee', color: '#ee4d2d', bg: 'rgba(238, 77, 45, 0.1)' },
  qoo10: { label: 'Qoo10', color: '#e4002b', bg: 'rgba(228, 0, 43, 0.1)' },
};

export interface MarketplaceBadgeProps {
  marketplace: Marketplace;
  size?: 'sm' | 'md';
}

export const MarketplaceBadge = memo(function MarketplaceBadge({
  marketplace,
  size = 'sm',
}: MarketplaceBadgeProps) {
  const config = MARKETPLACE_CONFIG[marketplace];
  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        fontSize,
        fontWeight: 600,
        color: config.color,
        background: config.bg,
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
});

// ============================================================
// DeadlineDisplay - 期限表示
// ============================================================

export interface DeadlineDisplayProps {
  deadline: string;
  size?: 'sm' | 'md';
}

export const DeadlineDisplay = memo(function DeadlineDisplay({
  deadline,
  size = 'sm',
}: DeadlineDisplayProps) {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  let label: string;
  let color: string;
  let bg: string;

  if (diffMs < 0) {
    label = '期限超過';
    color = '#dc2626';
    bg = 'rgba(220, 38, 38, 0.1)';
  } else if (diffHours < 24) {
    label = `${diffHours}時間`;
    color = '#dc2626';
    bg = 'rgba(220, 38, 38, 0.1)';
  } else if (diffDays <= 3) {
    label = `${diffDays}日`;
    color = '#f59e0b';
    bg = 'rgba(245, 158, 11, 0.1)';
  } else {
    label = `${diffDays}日`;
    color = '#10b981';
    bg = 'rgba(16, 185, 129, 0.1)';
  }

  const fontSize = size === 'sm' ? '10px' : '11px';
  const padding = size === 'sm' ? '2px 6px' : '3px 8px';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding,
        fontSize,
        fontWeight: 500,
        color,
        background: bg,
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      ⏰ {label}
    </span>
  );
});

// ============================================================
// ProfitDisplay - 利益表示
// ============================================================

export interface ProfitDisplayProps {
  amount: number;
  currency?: string;
  isConfirmed?: boolean;
  size?: 'sm' | 'md';
}

export const ProfitDisplay = memo(function ProfitDisplay({
  amount,
  currency = '¥',
  isConfirmed = false,
  size = 'sm',
}: ProfitDisplayProps) {
  const color = amount >= 0 ? 'var(--color-success)' : 'var(--color-error)';
  const fontSize = size === 'sm' ? '12px' : '14px';

  return (
    <span
      style={{
        fontFamily: 'monospace',
        fontSize,
        fontWeight: 600,
        color,
      }}
    >
      {currency}{amount.toLocaleString()}
      {isConfirmed && (
        <span style={{ marginLeft: '4px', fontSize: '10px', color: 'var(--color-success)' }}>
          ✓
        </span>
      )}
    </span>
  );
});
