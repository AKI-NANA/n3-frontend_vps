'use client';

import React, { memo, ReactNode, useState, useCallback, useRef } from 'react';
import { N3HeaderTab, HeaderTabSize } from '../presentational/n3-header-tab';
import { N3HeaderSearchInput } from '../presentational/n3-header-search';

// ============================================
// N3GlobalHeader - Layout Component
// ホバー切り替え式グローバルヘッダー
// CSS変数を参照してテーマに自動対応
// ============================================

export type NavTabId = string;

export interface NavTab {
  id: NavTabId;
  label: string;
  icon?: ReactNode;
}

export interface N3GlobalHeaderProps {
  /** ナビゲーションタブ */
  navTabs?: NavTab[];
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
  /** 検索欄の幅 */
  searchWidth?: number | string;
  /** 右側のアクション */
  rightActions?: ReactNode;
  /** サイズ（個別に上書きする場合のみ指定、通常はThemeProviderから継承） */
  size?: HeaderTabSize;
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
  searchWidth = 200,
  rightActions,
  size,
  hideDelay = 150,
  className = '',
}: N3GlobalHeaderProps) {
  const [activeTab, setActiveTab] = useState<NavTabId | null>(null);
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        setActiveTab(null);
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
      setActiveTab(null);
    }, hideDelay);
  }, [hideDelay]);

  const activePanelContent = activeTab ? panels[activeTab] : null;

  // サイズクラス（個別指定がある場合のみ）
  const sizeClass = size ? `n3-global-header--${size}` : '';

  // CSS変数を参照するスタイル（テーマから自動継承）
  const navStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 'var(--header-height)',
    minHeight: 'var(--header-height)',
    padding: '0 var(--n3-px)',
    // スタイル変数を参照
    background: 'var(--glass, rgba(255,255,255,0.65))',
    backdropFilter: 'var(--style-backdrop, blur(12px))',
    WebkitBackdropFilter: 'var(--style-backdrop, blur(12px))',
    borderBottom: '1px solid var(--glass-border, rgba(255,255,255,0.5))',
    borderRadius: 'var(--style-panel-radius, 0)',
    boxShadow: 'var(--style-panel-shadow, none)',
    fontSize: 'var(--n3-font)',
    transition: 'var(--style-transition-normal, all 0.15s ease)',
  };

  return (
    <div 
      className={`n3-global-header ${sizeClass} ${className}`}
      style={{ position: 'relative', zIndex: 50 }}
      data-size={size} // 個別指定がある場合はdata-sizeを設定
    >
      {/* ナビゲーションバー */}
      <div className="n3-global-header__nav" style={navStyle}>
        {/* 左側: ページナビゲーション + パネルタブ */}
        <div 
          className="n3-global-header__left"
          style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, height: '100%' }}
        >
          {/* ページ専用ナビ（L2TabNavigation等） */}
          {pageNavigation && (
            <div 
              className="n3-global-header__page-nav"
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                borderRight: '1px solid var(--panel-border, #e5e7eb)',
                marginRight: 'var(--n3-gap)',
                paddingRight: 'var(--n3-gap)',
              }}
            >
              {pageNavigation}
            </div>
          )}
          
          {/* パネル切り替えタブ */}
          <div 
            className="n3-global-header__tabs"
            style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 0 }}
          >
            {navTabs.map((tab) => (
              <N3HeaderTab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                active={activeTab === tab.id}
                size={size}
                onMouseEnter={() => handleTabMouseEnter(tab.id)}
                onMouseLeave={handleTabMouseLeave}
              />
            ))}
          </div>
        </div>

        {/* 右側: 検索バー + アクション */}
        <div 
          className="n3-global-header__right"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--n3-gap)' }}
        >
          <N3HeaderSearchInput
            value={searchValue}
            placeholder={searchPlaceholder}
            shortcut={searchShortcut}
            width={searchWidth}
            size={size}
            onValueChange={onSearchChange}
            onSearch={onSearch}
          />
          {rightActions}
        </div>
      </div>

      {/* オーバーレイパネル */}
      {activePanelContent && (
        <div
          className="n3-global-header__panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: 'var(--n3-px)',
            background: 'var(--panel, #ffffff)',
            borderBottom: '1px solid var(--panel-border, #e5e7eb)',
            boxShadow: 'var(--style-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.1))',
            zIndex: 100,
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
          onMouseEnter={handlePanelMouseEnter}
          onMouseLeave={handlePanelMouseLeave}
        >
          {activePanelContent}
        </div>
      )}
    </div>
  );
});

// Re-export for convenience
export { N3HeaderTab, N3L2Tab } from '../presentational/n3-header-tab';
export type { HeaderTabSize } from '../presentational/n3-header-tab';
export { N3HeaderSearchInput, N3HeaderSearchInput as N3HeaderSearch } from '../presentational/n3-header-search';
export { N3HeaderTabs, N3L2TabNavigation } from '../container/n3-header-tabs';

export default N3GlobalHeader;
