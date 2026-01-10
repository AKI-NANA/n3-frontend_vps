/**
 * N3UserAvatar - Presentational Component
 * 
 * ユーザーアバター（イニシャルまたは画像）
 */

'use client';

import { memo } from 'react';

export interface N3UserAvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
}

export const N3UserAvatar = memo(function N3UserAvatar({
  name = 'User',
  src,
  size,
  onClick,
  className = '',
}: N3UserAvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const sizeClass = size ? `n3-size-${size}` : '';

  return (
    <button
      onClick={onClick}
      className={`n3-user-avatar ${sizeClass} ${className}`}
    >
      {src ? (
        <img src={src} alt={name} />
      ) : (
        initial
      )}
    </button>
  );
});

N3UserAvatar.displayName = 'N3UserAvatar';
