/**
 * N3SidebarMini - Presentational Component
 * 
 * アイコンのみのシンプルなミニサイドバー
 * - 固定幅48px（展開しない）
 * - ホバーでツールチップ表示
 * - 8個程度のアイコンナビゲーション
 */

'use client';

import React, { memo, ReactNode, useState } from 'react';

export interface SidebarMiniItem {
  id: string;
  icon: ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: number | string;
  active?: boolean;
}

export interface N3SidebarMiniProps {
  items: SidebarMiniItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

export const N3SidebarMini = memo(function N3SidebarMini({
  items,
  activeId,
  onItemClick,
  className = '',
}: N3SidebarMiniProps) {
  return (
    <aside className={`n3-sidebar-mini ${className}`}>
      <nav className="n3-sidebar-mini__nav">
        {items.map((item) => (
          <N3SidebarMiniItem
            key={item.id}
            item={item}
            active={item.active || activeId === item.id}
            onClick={() => {
              item.onClick?.();
              onItemClick?.(item.id);
            }}
          />
        ))}
      </nav>
    </aside>
  );
});

// 個別アイテム
interface N3SidebarMiniItemProps {
  item: SidebarMiniItem;
  active?: boolean;
  onClick?: () => void;
}

const N3SidebarMiniItem = memo(function N3SidebarMiniItem({
  item,
  active,
  onClick,
}: N3SidebarMiniItemProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (item.href) {
      window.location.href = item.href;
    }
    onClick?.();
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`n3-sidebar-mini__item ${active ? 'active' : ''}`}
      >
        <span className="n3-sidebar-mini__icon">{item.icon}</span>
        {item.badge !== undefined && (
          <span className="n3-sidebar-mini__badge">{item.badge}</span>
        )}
      </button>

      {/* ツールチップ */}
      {showTooltip && (
        <div className="n3-sidebar-mini__tooltip">
          {item.label}
        </div>
      )}
    </div>
  );
});

N3SidebarMini.displayName = 'N3SidebarMini';
