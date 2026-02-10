'use client';

import React, { memo, ReactNode, useState, useCallback, useRef } from 'react';
import { N3HeaderTab, N3L2Tab, HeaderTabSize } from '../presentational/n3-header-tab';

// ============================================
// N3HeaderTabs - Container Component
// ホバー切り替え式タブグループ（状態管理）
// 
// size propなし → グローバル設定に従う
// ============================================

export type NavTabId = string;

export interface NavTab {
  id: NavTabId;
  label: string;
  icon?: ReactNode;
}

export interface N3HeaderTabsProps {
  tabs: NavTab[];
  panels?: Record<string, ReactNode>;
  size?: HeaderTabSize;
  hideDelay?: number;
  onActiveTabChange?: (tabId: NavTabId | null) => void;
  onTabClick?: (tabId: NavTabId) => void;
  className?: string;
}

export const N3HeaderTabs = memo(function N3HeaderTabs({
  tabs,
  panels = {},
  size, // 指定なしならグローバル設定に従う
  hideDelay = 150,
  onActiveTabChange,
  onTabClick,
  className = '',
}: N3HeaderTabsProps) {
  const [activeTab, setActiveTab] = useState<NavTabId | null>(null);
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTabMouseEnter = useCallback((tabId: NavTabId) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setActiveTab(tabId);
    onActiveTabChange?.(tabId);
  }, [onActiveTabChange]);

  const handleTabMouseLeave = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      if (!isPanelHovered) {
        setActiveTab(null);
        onActiveTabChange?.(null);
      }
    }, hideDelay);
  }, [isPanelHovered, hideDelay, onActiveTabChange]);

  const handlePanelMouseEnter = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsPanelHovered(true);
  }, []);

  const handlePanelMouseLeave = useCallback(() => {
    setIsPanelHovered(false);
    hideTimeoutRef.current = setTimeout(() => {
      setActiveTab(null);
      onActiveTabChange?.(null);
    }, hideDelay);
  }, [hideDelay, onActiveTabChange]);

  const activePanelContent = activeTab ? panels[activeTab] : null;

  return (
    <div className={`n3-header-tabs-container ${className}`}>
      <div className="n3-header-tabs">
        {tabs.map((tab) => (
          <N3HeaderTab
            key={tab.id}
            id={tab.id}
            label={tab.label}
            icon={tab.icon}
            active={activeTab === tab.id}
            size={size} // 指定されていれば渡す、なければundefined
            onMouseEnter={() => handleTabMouseEnter(tab.id)}
            onMouseLeave={handleTabMouseLeave}
            onClick={() => onTabClick?.(tab.id)}
          />
        ))}
      </div>

      {activePanelContent && (
        <div
          className="n3-header-tabs__panel"
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
// N3L2TabNavigation - Container Component
// ページ専用タブナビゲーション（状態管理）
// ============================================

export interface L2Tab {
  id: string;
  label: string;
  labelEn?: string;
  icon?: ReactNode;
  badge?: number | string;
}

export interface N3L2TabNavigationProps {
  tabs: L2Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  showEnglish?: boolean;
  size?: HeaderTabSize;
  className?: string;
}

export const N3L2TabNavigation = memo(function N3L2TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  showEnglish = false,
  size, // 指定なしならグローバル設定に従う
  className = '',
}: N3L2TabNavigationProps) {
  return (
    <div className={`n3-l2-tab-nav ${className}`}>
      {tabs.map((tab) => (
        <N3L2Tab
          key={tab.id}
          id={tab.id}
          label={tab.label}
          labelEn={tab.labelEn}
          icon={tab.icon}
          badge={tab.badge}
          active={activeTab === tab.id}
          showEnglish={showEnglish}
          size={size} // 指定されていれば渡す、なければundefined
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
});

export default N3HeaderTabs;
