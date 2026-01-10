'use client';

import React, { memo } from 'react';

// ============================================================
// N3PriorityBadge - Presentational Component
// ============================================================
// 優先度バッジ（高/中/低/緊急）
// 出荷管理、受注管理のキューアイテムで使用
// ============================================================

export type N3PriorityLevel = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export interface N3PriorityBadgeProps {
  /** 優先度レベル */
  priority: N3PriorityLevel;
  /** カスタムラベル（指定しない場合はデフォルト） */
  label?: string;
  /** サイズ */
  size?: 'xs' | 'sm' | 'md';
  /** アイコンを表示 */
  showIcon?: boolean;
  /** カスタムクラス名 */
  className?: string;
}

const defaultLabels: Record<N3PriorityLevel, string> = {
  urgent: '緊急',
  high: '高',
  medium: '中',
  low: '低',
  none: '-',
};

export const N3PriorityBadge = memo(function N3PriorityBadge({
  priority,
  label,
  size = 'sm',
  showIcon = false,
  className = '',
}: N3PriorityBadgeProps) {
  const displayLabel = label ?? defaultLabels[priority];

  return (
    <span
      className={`n3-priority-badge n3-priority-badge--${priority} n3-priority-badge--${size} ${className}`}
    >
      {showIcon && <span className="n3-priority-badge__icon">●</span>}
      {displayLabel}
    </span>
  );
});

N3PriorityBadge.displayName = 'N3PriorityBadge';

export default N3PriorityBadge;
