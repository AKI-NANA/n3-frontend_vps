'use client';

import React, { memo, ReactNode, useState } from 'react';
import Link from 'next/link';

// ============================================
// N3Header - グローバルヘッダー
// editing ページのヘッダーを参考に設計
// ============================================

export interface N3HeaderTab {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: number | string;
  pinned?: boolean;
}

export interface N3HeaderProps {
  logo?: ReactNode;
  logoText?: string;
  logoHref?: string;
  tabs?: N3HeaderTab[];
  activeTab?: string;
  onTabClick?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  search?: ReactNode;
  actions?: ReactNode;
  userMenu?: ReactNode;
  fixed?: boolean;
  height?: number;
  variant?: 'default' | 'glass' | 'solid';
  className?: string;
}

export const N3Header = memo(function N3Header({
  logo,
  logoText = 'N3',
  logoHref = '/',
  tabs = [],
  activeTab,
  onTabClick,
  onTabClose,
  search,
  actions,
  userMenu,
  fixed = true,
  height = 48,
  variant = 'glass',
  className = '',
}: N3HeaderProps) {
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: `${height}px`,
    padding: '0 16px',
    background: variant === 'glass' 
      ? 'var(--glass, rgba(255, 255, 255, 0.8))'
      : variant === 'solid'
        ? 'var(--panel, #ffffff)'
        : 'transparent',
    backdropFilter: variant === 'glass' ? 'blur(12px)' : 'none',
    borderBottom: '1px solid var(--glass-border, rgba(0, 0, 0, 0.1))',
    zIndex: 100,
    ...(fixed && {
      position: 'sticky',
      top: 0,
    }),
  };

  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginRight: '16px',
    flexShrink: 0,
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--accent, #6366f1)',
    textDecoration: 'none',
  };

  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    overflow: 'hidden',
  };

  const spacerStyle: React.CSSProperties = {
    flex: 1,
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <header style={headerStyle} className={className}>
      {/* Logo */}
      <div style={logoContainerStyle}>
        {logoHref ? (
          <Link href={logoHref} style={logoStyle}>
            {logo || logoText}
          </Link>
        ) : (
          <span style={logoStyle}>{logo || logoText}</span>
        )}
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <nav style={tabsContainerStyle}>
          {tabs.map((tab) => (
            <N3HeaderTabItem
              key={tab.id}
              tab={tab}
              active={activeTab === tab.id}
              onClick={() => onTabClick?.(tab.id)}
              onClose={tab.pinned ? undefined : () => onTabClose?.(tab.id)}
            />
          ))}
        </nav>
      )}

      {/* Spacer */}
      <div style={spacerStyle} />

      {/* Search */}
      {search && <div style={sectionStyle}>{search}</div>}

      {/* Actions */}
      {actions && <div style={{ ...sectionStyle, marginLeft: '16px' }}>{actions}</div>}

      {/* User Menu */}
      {userMenu && <div style={{ ...sectionStyle, marginLeft: '16px' }}>{userMenu}</div>}
    </header>
  );
});

// ============================================
// N3HeaderTabItem - タブアイテム
// ============================================

interface N3HeaderTabItemProps {
  tab: N3HeaderTab;
  active: boolean;
  onClick: () => void;
  onClose?: () => void;
}

const N3HeaderTabItem = memo(function N3HeaderTabItem({
  tab,
  active,
  onClick,
  onClose,
}: N3HeaderTabItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const tabStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: '32px',
    padding: '0 12px',
    paddingRight: onClose ? '28px' : '12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: active ? 500 : 400,
    color: active ? 'var(--accent, #6366f1)' : 'var(--text-muted, #6b7280)',
    background: active 
      ? 'var(--highlight, #f3f4f6)' 
      : isHovered 
        ? 'rgba(0, 0, 0, 0.04)' 
        : 'transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '6px',
    opacity: 0.7,
  };

  const badgeStyle: React.CSSProperties = {
    marginLeft: '6px',
    padding: '0 6px',
    height: '16px',
    fontSize: '10px',
    fontWeight: 600,
    lineHeight: '16px',
    borderRadius: '8px',
    background: 'var(--accent, #6366f1)',
    color: '#ffffff',
  };

  const closeStyle: React.CSSProperties = {
    position: 'absolute',
    right: '4px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    fontSize: '14px',
    color: 'var(--text-muted, #6b7280)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    opacity: isHovered || active ? 1 : 0,
    transition: 'opacity 0.15s ease',
  };

  const content = (
    <>
      {tab.icon && <span style={iconStyle}>{tab.icon}</span>}
      <span>{tab.label}</span>
      {tab.badge !== undefined && <span style={badgeStyle}>{tab.badge}</span>}
    </>
  );

  const handleClick = (e: React.MouseEvent) => {
    if (!tab.href) {
      e.preventDefault();
    }
    onClick();
  };

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {tab.href ? (
        <Link href={tab.href} style={tabStyle} onClick={handleClick}>
          {content}
        </Link>
      ) : (
        <div style={tabStyle} onClick={handleClick}>
          {content}
        </div>
      )}
      
      {onClose && (
        <button
          style={closeStyle}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = 'rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = 'transparent';
          }}
        >
          ×
        </button>
      )}
    </div>
  );
});

// ============================================
// N3HeaderSearch - 検索入力
// ============================================

export interface N3HeaderSearchProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  width?: number | string;
}

export const N3HeaderSearch = memo(function N3HeaderSearch({
  value = '',
  placeholder = '検索...',
  onChange,
  onSearch,
  width = 200,
}: N3HeaderSearchProps) {
  const [internalValue, setInternalValue] = useState(value);
  const currentValue = onChange ? value : internalValue;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: typeof width === 'number' ? `${width}px` : width,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '32px',
    padding: '0 12px 0 32px',
    fontSize: '13px',
    color: 'var(--text, #1f2937)',
    background: 'var(--highlight, #f3f4f6)',
    border: '1px solid transparent',
    borderRadius: '6px',
    outline: 'none',
    transition: 'all 0.15s ease',
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted, #6b7280)',
    pointerEvents: 'none',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(currentValue);
    }
  };

  return (
    <div style={containerStyle}>
      <svg
        style={iconStyle}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={currentValue}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={inputStyle}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--accent, #6366f1)';
          e.target.style.background = 'var(--panel, #ffffff)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'transparent';
          e.target.style.background = 'var(--highlight, #f3f4f6)';
        }}
      />
    </div>
  );
});

// ============================================
// N3HeaderUserMenu - ユーザーメニュー
// ============================================

export interface N3HeaderUserMenuProps {
  name?: string;
  email?: string;
  avatar?: ReactNode;
  initials?: string;
  menuItems?: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    divider?: boolean;
    danger?: boolean;
  }>;
}

export const N3HeaderUserMenu = memo(function N3HeaderUserMenu({
  name,
  email,
  avatar,
  initials = 'U',
  menuItems = [],
}: N3HeaderUserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const avatarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--accent, #6366f1)',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  };

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    minWidth: '200px',
    padding: '8px 0',
    background: 'var(--panel, #ffffff)',
    border: '1px solid var(--panel-border, #e5e7eb)',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
  };

  const menuHeaderStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderBottom: '1px solid var(--panel-border, #e5e7eb)',
    marginBottom: '4px',
  };

  const menuItemStyle = (danger?: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '8px 12px',
    fontSize: '13px',
    color: danger ? 'var(--error, #ef4444)' : 'var(--text, #1f2937)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.15s ease',
  });

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={avatarStyle}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        {avatar || initials}
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div style={menuStyle}>
            {(name || email) && (
              <div style={menuHeaderStyle}>
                {name && (
                  <div style={{ fontWeight: 500, color: 'var(--text, #1f2937)' }}>
                    {name}
                  </div>
                )}
                {email && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted, #6b7280)' }}>
                    {email}
                  </div>
                )}
              </div>
            )}

            {menuItems.map((item) =>
              item.divider ? (
                <div
                  key={item.id}
                  style={{
                    height: '1px',
                    background: 'var(--panel-border, #e5e7eb)',
                    margin: '4px 0',
                  }}
                />
              ) : (
                <button
                  key={item.id}
                  style={menuItemStyle(item.danger)}
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = 'var(--highlight, #f3f4f6)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
});

export default N3Header;
