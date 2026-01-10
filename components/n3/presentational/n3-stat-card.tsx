'use client';

import React, { memo } from 'react';
import type { LucideIcon } from 'lucide-react';

// ============================================================
// N3StatCard - Presentational Component
// ============================================================
// 統計カード（値 + ラベル + オプションアイコン）
// 出荷管理、受注管理、ダッシュボードで使用
// ============================================================

export type N3StatCardVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'purple';

export interface N3StatCardProps {
  /** 表示する値 */
  value: string | number;
  /** ラベル */
  label: string;
  /** バリアント（ボーダーカラー） */
  variant?: N3StatCardVariant;
  /** アイコン */
  icon?: LucideIcon;
  /** サブテキスト（変化率など） */
  subtext?: string;
  /** サブテキストがポジティブか */
  subtextPositive?: boolean;
  /** クリック時のコールバック */
  onClick?: () => void;
  /** カスタムクラス名 */
  className?: string;
  /** コンパクトモード */
  compact?: boolean;
}

export const N3StatCard = memo(function N3StatCard({
  value,
  label,
  variant = 'default',
  icon: Icon,
  subtext,
  subtextPositive,
  onClick,
  className = '',
  compact = false,
}: N3StatCardProps) {
  const isClickable = !!onClick;

  return (
    <div
      className={`n3-stat-card n3-stat-card--${variant} ${compact ? 'n3-stat-card--compact' : ''} ${isClickable ? 'n3-stat-card--clickable' : ''} ${className}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {Icon && (
        <div className="n3-stat-card__icon">
          <Icon size={compact ? 16 : 20} />
        </div>
      )}
      <div className="n3-stat-card__content">
        <div className="n3-stat-card__value">{value}</div>
        <div className="n3-stat-card__label">{label}</div>
        {subtext && (
          <div
            className={`n3-stat-card__subtext ${
              subtextPositive === true
                ? 'n3-stat-card__subtext--positive'
                : subtextPositive === false
                ? 'n3-stat-card__subtext--negative'
                : ''
            }`}
          >
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
});

N3StatCard.displayName = 'N3StatCard';

export default N3StatCard;
