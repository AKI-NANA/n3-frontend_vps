/**
 * N3NotificationBell - Presentational Component
 * 
 * 通知ベルアイコン（バッジ付き）
 */

'use client';

import { memo } from 'react';
import { Bell } from 'lucide-react';

export interface N3NotificationBellProps {
  count?: number;
  maxCount?: number;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

export const N3NotificationBell = memo(function N3NotificationBell({
  count = 0,
  maxCount = 99,
  onClick,
  active = false,
  className = '',
}: N3NotificationBellProps) {
  const displayCount = count > maxCount ? `${maxCount}+` : count;
  const hasNotifications = count > 0;

  return (
    <button
      onClick={onClick}
      className={`n3-notification-bell ${active ? 'active' : ''} ${className}`}
    >
      <Bell />
      {hasNotifications && (
        <span className="n3-notification-bell__badge">
          {count > 9 ? displayCount : ''}
        </span>
      )}
    </button>
  );
});

N3NotificationBell.displayName = 'N3NotificationBell';
