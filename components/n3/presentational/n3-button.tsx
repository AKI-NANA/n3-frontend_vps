/**
 * N3Button - Presentational Component
 *
 * 設計ルール:
 * - size propなし → data-sizeに従う（グローバル設定）
 * - size propあり → 個別に上書き
 *
 * @example
 * <N3Button variant="primary">グローバルサイズ</N3Button>
 * <N3Button variant="primary" size="lg">大きいボタン</N3Button>
 */

'use client';

import { memo, forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

// ============================================================
// Types
// ============================================================

export type N3ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-warning'
  | 'outline-danger'
  | 'outline-info'
  | 'soft-primary'
  | 'soft-success'
  | 'soft-warning'
  | 'soft-danger'
  | 'soft-info'
  | 'link';

export type N3ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface N3ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** ボタンのバリアント */
  variant?: N3ButtonVariant;
  /** サイズ（指定なしでグローバル設定に従う） */
  size?: N3ButtonSize;
  /** ローディング状態 */
  loading?: boolean;
  /** アイコンのみのボタン */
  iconOnly?: boolean;
  /** フル幅 */
  fullWidth?: boolean;
  /** 左アイコン */
  leftIcon?: ReactNode;
  /** 右アイコン */
  rightIcon?: ReactNode;
  /** 子要素 */
  children?: ReactNode;
}

// ============================================================
// Component
// ============================================================

export const N3Button = memo(forwardRef<HTMLButtonElement, N3ButtonProps>(
  function N3Button(
    {
      variant = 'primary',
      size,
      loading = false,
      iconOnly = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = '',
      ...props
    },
    ref
  ) {
    // CSSクラスを構築
    // size が指定されていれば .n3-size-* を追加、なければグローバルに従う
    const classes = [
      'n3-btn',
      variant && `n3-btn-${variant}`,
      size && `n3-size-${size}`,
      iconOnly && 'n3-btn-icon',
      fullWidth && 'n3-btn-full',
      loading && 'n3-btn-loading',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
));

N3Button.displayName = 'N3Button';
