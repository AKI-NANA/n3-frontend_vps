/**
 * N3Tag - Presentational Component
 *
 * 設計ルール:
 * - size propなし → data-sizeに従う（グローバル設定）
 * - size propあり → 個別に上書き
 *
 * @example
 * <N3Tag variant="primary" closable onClose={() => {}}>Tag</N3Tag>
 */

'use client';

import { memo, type ReactNode } from 'react';
import { X } from 'lucide-react';

// ============================================================
// Types
// ============================================================

export type N3TagVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type N3TagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface N3TagProps {
  /** バリアント */
  variant?: N3TagVariant;
  /** サイズ（指定なしでグローバル設定に従う） */
  size?: N3TagSize;
  /** 閉じるボタン表示 */
  closable?: boolean;
  /** 閉じるボタンクリック時のハンドラ */
  onClose?: () => void;
  /** 子要素 */
  children: ReactNode;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Component
// ============================================================

export const N3Tag = memo(function N3Tag({
  variant = 'default',
  size,
  closable = false,
  onClose,
  children,
  className = '',
}: N3TagProps) {
  const classes = [
    'n3-tag',
    variant !== 'default' && `n3-tag-${variant}`,
    size && `n3-size-${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {children}
      {closable && (
        <button
          type="button"
          className="n3-tag-close"
          onClick={onClose}
          aria-label="Remove tag"
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
});

N3Tag.displayName = 'N3Tag';
