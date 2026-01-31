/**
 * N3FilterTab - Presentational Component
 *
 * フィルタータブの単一アイテム
 *
 * 設計ルール:
 * - Hooks呼び出し禁止
 * - 外部マージン禁止
 * - React.memoでラップ
 *
 * @example
 * <N3FilterTab
 *   label="All Products"
 *   count={100}
 *   active={true}
 *   onClick={() => setFilter('all')}
 * />
 */

'use client';

import { memo, type ReactNode, type CSSProperties } from 'react';

// ============================================================
// Types
// ============================================================

export type FilterTabVariant = 'default' | 'inventory' | 'status' | 'primary' | 'verified' | 'archive';

export interface N3FilterTabProps {
  /** ID */
  id?: string;
  /** ラベル */
  label: string;
  /** カウント表示 */
  count?: number;
  /** アクティブ状態 */
  active?: boolean;
  /** 無効状態 */
  disabled?: boolean;
  /** アイコン */
  icon?: ReactNode;
  /** クリックハンドラ */
  onClick?: () => void;
  /** 追加のクラス名 */
  className?: string;
  /** バリアント（スタイルの種類） */
  variant?: FilterTabVariant;
  /** カスタムスタイル */
  style?: CSSProperties;
}

// ============================================================
// Styles
// ============================================================

const baseStyles: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 10px',
  fontSize: '11px',
  fontWeight: 500,
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'all 0.15s ease',
};

const getVariantStyles = (variant: FilterTabVariant, active: boolean): CSSProperties => {
  const variants: Record<FilterTabVariant, { active: CSSProperties; inactive: CSSProperties }> = {
    default: {
      active: {
        background: 'var(--accent, #3b82f6)',
        color: 'white',
      },
      inactive: {
        background: 'transparent',
        color: 'var(--text-muted, #888)',
      },
    },
    inventory: {
      active: {
        background: 'var(--inventory-accent, #10b981)',
        color: 'white',
      },
      inactive: {
        background: 'transparent',
        color: 'var(--text-muted, #888)',
      },
    },
    status: {
      active: {
        background: 'var(--warning, #f59e0b)',
        color: 'white',
      },
      inactive: {
        background: 'transparent',
        color: 'var(--text-muted, #888)',
      },
    },
    primary: {
      active: {
        background: 'var(--primary, #6366f1)',
        color: 'white',
      },
      inactive: {
        background: 'transparent',
        color: 'var(--text-muted, #888)',
      },
    },
    verified: {
      active: {
        background: 'var(--verified, #10b981)',
        color: 'white',
        boxShadow: '0 0 0 2px var(--verified, #10b981)',
      },
      inactive: {
        background: 'transparent',
        color: 'var(--verified, #10b981)',
        border: '1px solid var(--verified, #10b981)',
      },
    },
    archive: {
      active: {
        background: 'var(--archive, #6b7280)',
        color: 'white',
      },
      inactive: {
        background: 'transparent',
        color: 'var(--text-muted, #888)',
      },
    },
  };

  return active ? variants[variant].active : variants[variant].inactive;
};

const countStyles: CSSProperties = {
  fontSize: '10px',
  padding: '1px 5px',
  borderRadius: '10px',
  background: 'rgba(255, 255, 255, 0.2)',
  marginLeft: '2px',
};

const countInactiveStyles: CSSProperties = {
  ...countStyles,
  background: 'var(--panel-border, #333)',
  color: 'var(--text-muted, #888)',
};

// ============================================================
// Component
// ============================================================

export const N3FilterTab = memo(function N3FilterTab({
  id,
  label,
  count,
  active = false,
  disabled = false,
  icon,
  onClick,
  className = '',
  variant = 'default',
  style,
}: N3FilterTabProps) {
  const combinedStyles: CSSProperties = {
    ...baseStyles,
    ...getVariantStyles(variant, active),
    ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
    ...style,
  };

  return (
    <button
      type="button"
      className={`n3-filter-tab ${active ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      style={combinedStyles}
      onClick={onClick}
      disabled={disabled}
      data-id={id}
      data-variant={variant}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span style={active ? countStyles : countInactiveStyles}>
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
});

N3FilterTab.displayName = 'N3FilterTab';
