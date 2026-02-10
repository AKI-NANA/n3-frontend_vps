'use client';

import React, { memo, ReactNode, useState } from 'react';
import Link from 'next/link';

// ============================================
// N3Sidebar - サイドバー
// ============================================
export interface N3SidebarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: number | string;
  children?: N3SidebarItem[];
  disabled?: boolean;
}

export interface N3SidebarSection {
  id: string;
  title?: string;
  items: N3SidebarItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface N3SidebarProps {
  sections: N3SidebarSection[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  header?: ReactNode;
  footer?: ReactNode;
  width?: number;
  collapsedWidth?: number;
  className?: string;
}

export const N3Sidebar = memo(function N3Sidebar({
  sections,
  activeItem,
  onItemClick,
  collapsed = false,
  onCollapseChange,
  header,
  footer,
  width = 240,
  collapsedWidth = 60,
  className = '',
}: N3SidebarProps) {
  return (
    <aside
      className={`n3-sidebar ${collapsed ? 'collapsed' : ''} ${className}`}
      style={{ width: collapsed ? collapsedWidth : width }}
    >
      {header && <div className="n3-sidebar-header">{header}</div>}

      <div className="n3-sidebar-content">
        {sections.map((section) => (
          <N3SidebarSectionComponent
            key={section.id}
            section={section}
            activeItem={activeItem}
            onItemClick={onItemClick}
            collapsed={collapsed}
          />
        ))}
      </div>

      {footer && <div className="n3-sidebar-footer">{footer}</div>}

      {onCollapseChange && (
        <button
          className="n3-sidebar-toggle"
          onClick={() => onCollapseChange(!collapsed)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
    </aside>
  );
});

interface N3SidebarSectionComponentProps {
  section: N3SidebarSection;
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  collapsed?: boolean;
}

const N3SidebarSectionComponent = memo(function N3SidebarSectionComponent({
  section,
  activeItem,
  onItemClick,
  collapsed = false,
}: N3SidebarSectionComponentProps) {
  const [isCollapsed, setIsCollapsed] = useState(section.defaultCollapsed ?? false);

  return (
    <div className="n3-sidebar-section">
      {section.title && !collapsed && (
        <div
          className={`n3-sidebar-section-title ${section.collapsible ? 'collapsible' : ''}`}
          onClick={() => section.collapsible && setIsCollapsed(!isCollapsed)}
        >
          <span>{section.title}</span>
          {section.collapsible && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </div>
      )}

      {(!section.collapsible || !isCollapsed) && (
        <ul className="n3-sidebar-items">
          {section.items.map((item) => (
            <N3SidebarItemComponent
              key={item.id}
              item={item}
              active={activeItem === item.id}
              onItemClick={onItemClick}
              collapsed={collapsed}
            />
          ))}
        </ul>
      )}
    </div>
  );
});

interface N3SidebarItemComponentProps {
  item: N3SidebarItem;
  active: boolean;
  onItemClick?: (itemId: string) => void;
  collapsed?: boolean;
}

const N3SidebarItemComponent = memo(function N3SidebarItemComponent({
  item,
  active,
  onItemClick,
  collapsed = false,
}: N3SidebarItemComponentProps) {
  const handleClick = () => {
    if (item.disabled) return;
    item.onClick?.();
    onItemClick?.(item.id);
  };

  const itemClass = [
    'n3-sidebar-item',
    active && 'active',
    item.disabled && 'disabled',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {item.icon && <span className="n3-sidebar-item-icon">{item.icon}</span>}
      {!collapsed && (
        <>
          <span className="n3-sidebar-item-label">{item.label}</span>
          {item.badge !== undefined && (
            <span className="n3-sidebar-item-badge">{item.badge}</span>
          )}
        </>
      )}
    </>
  );

  return (
    <li>
      {item.href ? (
        <Link href={item.href} className={itemClass} onClick={handleClick}>
          {content}
        </Link>
      ) : (
        <button className={itemClass} onClick={handleClick} disabled={item.disabled}>
          {content}
        </button>
      )}
    </li>
  );
});

export default N3Sidebar;
