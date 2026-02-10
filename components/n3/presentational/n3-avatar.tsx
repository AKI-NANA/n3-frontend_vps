/**
 * N3Avatar - Presentational Component
 *
 * アバター表示コンポーネント
 *
 * 設計ルール:
 * - Hooks呼び出し禁止
 * - 外部マージン禁止
 * - React.memoでラップ
 *
 * @example
 * <N3Avatar
 *   src="/user.jpg"
 *   alt="User Name"
 *   size="md"
 *   status="online"
 * />
 * <N3Avatar initials="JD" size="lg" />
 */

'use client';

import { memo } from 'react';

// ============================================================
// Types
// ============================================================

export type N3AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type N3AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface N3AvatarProps {
  /** 画像URL */
  src?: string;
  /** alt属性 */
  alt?: string;
  /** イニシャル（画像がない場合に表示） */
  initials?: string;
  /** サイズ */
  size?: N3AvatarSize;
  /** ステータスインジケーター */
  status?: N3AvatarStatus;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Component
// ============================================================

export const N3Avatar = memo(function N3Avatar({
  src,
  alt = '',
  initials,
  size = 'md',
  status,
  className = '',
}: N3AvatarProps) {
  const classes = [
    'n3-avatar',
    size && `n3-avatar-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <span>{initials || alt.charAt(0).toUpperCase()}</span>
      )}
      {status && <span className={`n3-avatar-status ${status}`} />}
    </div>
  );
});

N3Avatar.displayName = 'N3Avatar';
