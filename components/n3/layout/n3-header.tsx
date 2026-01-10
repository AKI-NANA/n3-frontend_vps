'use client';

import React, { memo, ReactNode, useState, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';

// ============================================
// N3GlobalHeader - ホバー切り替え式グローバルナビ
// editing ページの HeaderLayout と同じ設計
// ============================================

export type NavTabId = 'tools' | 'flow' | 'filter' | 'none' | string;

export interface N3NavTab {
  id: NavTabId;
  label: string;
  icon?: ReactNode;
}

export interface N3GlobalHeaderProps {
  /** ナビゲーションタブ */
  navTabs?: N3NavTab[];
  /** 各パネルのコンテンツ（keyはtab.id） */
  panels?: Record<string, ReactNode>;
  /** ページナビゲーション（L2タブ等） */
  pageNavigation?: ReactNode;
  /** 検索プレースホルダー */
  searchPlaceholder?: string;
  /** 検索のショートカットキー表示 */
  searchShortcut?: string;
  /** 検索値 */
  searchValue?: string;
  /** 検索値変更 */
  onSearchChange?: (value: string) => void;
  /** 検索実行 */
  onSearch?: (value: string) => void;
  /** 右側のアクション */
  rightActions?: ReactNode;
  /** 高さ（px） */
  height?: number;
  /** パネルを閉じる遅延（ms） */
  hideDelay?: number;
  className?: string;
}

export const N3GlobalHeader = memo(function N3GlobalHeader({
  navTabs = [
    { id: 'tools', label: 'ツール' },
    { id: 'flow', label: 'FLOW' },
    { id: 'filter', label: 'フィルター' },
  ],
  panels = {},
  pageNavigation,
  searchPlaceholder = '検索...',
  searchShortcut = '⌘K',
  searchValue = '',
  onSearchChange,
  onSearch,
  rightActions,
  height = 40,
  hideDelay = 150,
  className = '',
}: N3GlobalHeaderProps) {
  const [activeTab, setActiveTab] = useState<NavTabId>('none');
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const [internalSearchValue, setInternalSearchValue] = useState(searchValue);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentSearchValue = onSearchChange ? searchValue : internalSearchValue;

  // タブにホバーしたら表示
  const handleTabMouseEnter = useCallback((tabId: NavTabId) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setActiveTab(tabId);
  }, []);

  // タブから離れたら少し遅延して非表示
  const handleTabMouseLeave = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      if (!isPanelHovered) {
        setActiveTab('none');
      }
    }, hideDelay);
  }, [isPanelHovered, hideDelay]);

  // パネルにホバー中
  const handlePanelMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsPanelHovered(true);
  }, []);

  // パネルから離れたら非表示
  const handlePanelMouseLeave = useCallback(() => {
    setIsPanelHovered(false);
    hideTimeoutRef.current = setTimeout(() => {
      setActiveTab('none');
    }, hideDelay);
  }, [hideDelay]);

  const activePanelContent = activeTab !== 'none' ? panels[activeTab] : null;

  // スタイル
  const headerStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 50,
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: `${height}px`,
    padding: '0 16px',
    background: 'var(--glass, rgba(255, 255, 255, 0.8))',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--glass-border, rgba(0, 0, 0, 0.1))',
  };

  const leftStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    flex: 1,
    height: '100%',
  };

  const pageNavStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    borderRight: '1px solid var(--panel-border, #e5e7eb)',
    marginRight: '8px',
  };

  const tabsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    gap: '0',
  };

  const rightStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const searchContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: 'var(--highlight, #f3f4f6)',
    border: '1px solid var(--panel-border, #e5e7eb)',
    borderRadius: '6px',
    minWidth: '200px',
    cursor: 'text',
  };

  const searchInputStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '12px',
    color: 'var(--text, #1f2937)',
  };

  const kbdStyle: React.CSSProperties = {
    marginLeft: 'auto',
    padding: '2px 6px',
    fontSize: '10px',
    fontFamily: 'monospace',
    color: 'var(--text-subtle, #9ca3af)',
    background: 'var(--panel, #ffffff)',
    borderRadius: '3px',
  };

  const panelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    padding: '8px',
    background: 'var(--panel, #ffffff)',
    borderBottom: '1px solid var(--panel-border, #e5e7eb)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
    maxHeight: '60vh',
    overflowY: 'auto',
  };

  return (
    <div style={headerStyle} className={className}>
      {/* ナビゲーションバー */}
      <div style={navStyle}>
        {/* 左側: ページナビゲーション + パネルタブ */}
        <div style={leftStyle}>
          {/* ページ専用ナビ（L2TabNavigation等） */}
          {pageNavigation && (
            <div style={pageNavStyle}>
              {pageNavigation}
            </div>
          )}
          
          {/* パネル切り替えタブ */}
          <div style={tabsStyle}>
            {navTabs.map((tab) => (
              <N3HeaderTab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                active={activeTab === tab.id}
                onMouseEnter={() => handleTabMouseEnter(tab.id)}
                onMouseLeave={handleTabMouseLeave}
              />
            ))}
          </div>
        </div>

        {/* 右側: 検索バー + アクション */}
        <div style={rightStyle}>
          <div style={searchContainerStyle}>
            <Search size={14} style={{ color: 'var(--text-muted, #6b7280)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={currentSearchValue}
              onChange={(e) => {
                const value = e.target.value;
                if (onSearchChange) {
                  onSearchChange(value);
                } else {
                  setInternalSearchValue(value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onSearch) {
                  onSearch(currentSearchValue);
                }
              }}
              style={searchInputStyle}
            />
            {searchShortcut && <kbd style={kbdStyle}>{searchShortcut}</kbd>}
          </div>
          {rightActions}
        </div>
      </div>

      {/* オーバーレイパネル */}
      {activePanelContent && (
        <div
          style={panelStyle}
          onMouseEnter={handlePanelMouseEnter}
          onMouseLeave={handlePanelMouseLeave}
        >
          {activePanelContent}
        </div>
      )}
    </div>
  );
});

// ============================================
// N3HeaderTab - ヘッダータブ
// ============================================

interface N3HeaderTabProps {
  id: NavTabId;
  label: string;
  icon?: ReactNode;
  active: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const N3HeaderTab = memo(function N3HeaderTab({
  id,
  label,
  icon,
  active,
  onMouseEnter,
  onMouseLeave,
}: N3HeaderTabProps) {
  const [hovered, setHovered] = useState(false);

  const tabStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '0 12px',
    height: '100%',
    fontSize: '11px',
    fontWeight: 500,
    color: active ? '#ffffff' : hovered ? 'var(--text, #1f2937)' : 'var(--text-muted, #6b7280)',
    background: active ? 'var(--accent, #6366f1)' : hovered ? 'var(--highlight, #f3f4f6)' : 'transparent',
    border: 'none',
    borderLeft: hovered && !active ? '1px solid var(--panel-border, #e5e7eb)' : '1px solid transparent',
    borderRight: hovered && !active ? '1px solid var(--panel-border, #e5e7eb)' : '1px solid transparent',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.12s',
  };

  return (
    <button
      style={tabStyle}
      onMouseEnter={() => {
        setHovered(true);
        onMouseEnter();
      }}
      onMouseLeave={() => {
        setHovered(false);
        onMouseLeave();
      }}
    >
      {icon}
      {label}
    </button>
  );
});

// ============================================
// N3L2TabNavigation - L2タブナビゲーション
// ページ専用のタブ（基本編集、ロジスティクス等）
// ============================================

export interface N3L2Tab {
  id: string;
  label: string;
  labelEn?: string;
  icon?: ReactNode;
  badge?: number | string;
}

export interface N3L2TabNavigationProps {
  tabs: N3L2Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  showEnglish?: boolean;
  className?: string;
}

export const N3L2TabNavigation = memo(function N3L2TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  showEnglish = false,
  className = '',
}: N3L2TabNavigationProps) {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    gap: '2px',
  };

  return (
    <div style={containerStyle} className={className}>
      {tabs.map((tab) => (
        <N3L2TabItem
          key={tab.id}
          tab={tab}
          active={activeTab === tab.id}
          showEnglish={showEnglish}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
});

interface N3L2TabItemProps {
  tab: N3L2Tab;
  active: boolean;
  showEnglish: boolean;
  onClick: () => void;
}

const N3L2TabItem = memo(function N3L2TabItem({
  tab,
  active,
  showEnglish,
  onClick,
}: N3L2TabItemProps) {
  const [hovered, setHovered] = useState(false);

  const tabStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 500,
    color: active ? 'var(--accent, #6366f1)' : hovered ? 'var(--text, #1f2937)' : 'var(--text-muted, #6b7280)',
    background: 'transparent',
    border: 'none',
    borderBottom: `2px solid ${active ? 'var(--accent, #6366f1)' : 'transparent'}`,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    marginBottom: '-2px',
    transition: 'all 0.12s',
  };

  const badgeStyle: React.CSSProperties = {
    padding: '0 6px',
    height: '16px',
    fontSize: '10px',
    fontWeight: 600,
    lineHeight: '16px',
    borderRadius: '8px',
    background: active ? 'var(--accent, #6366f1)' : 'var(--highlight, #f3f4f6)',
    color: active ? '#ffffff' : 'var(--text-muted, #6b7280)',
  };

  return (
    <button
      style={tabStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tab.icon}
      <span>{showEnglish && tab.labelEn ? tab.labelEn : tab.label}</span>
      {tab.badge !== undefined && <span style={badgeStyle}>{tab.badge}</span>}
    </button>
  );
});

// ============================================
// Re-export from old header for backward compatibility
// ============================================

export { N3HeaderSearch, N3HeaderUserMenu } from './n3-header_old';

export default N3GlobalHeader;
