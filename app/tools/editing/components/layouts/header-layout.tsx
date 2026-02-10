// app/tools/editing/components/layouts/header-layout.tsx
/**
 * HeaderLayout - ホバー切り替え式グローバルナビ
 * 
 * 構造:
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │ [ナビタブ: ツール | FLOW | フィルター]              [🔍 検索...]    │
 * ├──────────────────────────────────────────────────────────────────────┤
 * │ ▼ パネル（オーバーレイ、ホバーで表示）                              │
 * └──────────────────────────────────────────────────────────────────────┘
 * 
 * 特徴:
 * - 左右分離なし、単一パネル
 * - ホバーで切り替え
 * - パネルはmain上にオーバーレイ
 */

'use client';

import { ReactNode, useState, useCallback, useRef } from 'react';
import { Search } from 'lucide-react';

export type NavTabId = 'tools' | 'flow' | 'filter' | 'none';

interface NavTab {
  id: NavTabId;
  label: string;
}

const NAV_TABS: NavTab[] = [
  { id: 'tools', label: 'ツール' },
  { id: 'flow', label: 'FLOW' },
  { id: 'filter', label: 'フィルター' },
];

interface HeaderLayoutProps {
  /** 各パネルのコンテンツ */
  toolsPanel?: ReactNode;
  flowPanel?: ReactNode;
  filterPanel?: ReactNode;
  /** 追加のクラス名 */
  className?: string;
  /** L2タブナビゲーション（ページ専用タブ） */
  pageNavigation?: ReactNode;
}

export function HeaderLayout({
  toolsPanel,
  flowPanel,
  filterPanel,
  className = '',
  pageNavigation
}: HeaderLayoutProps) {
  const [activeTab, setActiveTab] = useState<NavTabId>('none');
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
        setActiveTab('none');
      }
    }, 150);
  }, [isPanelHovered]);

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
    }, 150);
  }, []);

  // アクティブなパネルコンテンツを取得
  const getActivePanel = () => {
    switch (activeTab) {
      case 'tools':
        return toolsPanel;
      case 'flow':
        return flowPanel;
      case 'filter':
        return filterPanel;
      default:
        return null;
    }
  };

  const activePanelContent = getActivePanel();

  return (
    <div className={`n3-global-header ${className}`.trim()}>
      {/* ナビゲーションバー */}
      <div className="n3-global-header__nav">
        {/* 左側: ページナビゲーション + パネルタブ */}
        <div className="n3-global-header__left">
          {/* ページ専用ナビ（L2TabNavigation等） */}
          {pageNavigation && (
            <div className="n3-global-header__page-nav">
              {pageNavigation}
            </div>
          )}
          
          {/* パネル切り替えタブ */}
          <div className="n3-global-header__tabs">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`n3-global-header__tab ${activeTab === tab.id ? 'active' : ''}`}
                onMouseEnter={() => handleTabMouseEnter(tab.id)}
                onMouseLeave={handleTabMouseLeave}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 右側: 検索バー */}
        <div className="n3-global-header__right">
          <div className="n3-global-header__search">
            <Search size={14} />
            <input
              type="text"
              placeholder="検索..."
              className="n3-global-header__search-input"
            />
            <kbd className="n3-global-header__search-kbd">⌘K</kbd>
          </div>
        </div>
      </div>

      {/* オーバーレイパネル */}
      {activePanelContent && (
        <div
          className="n3-global-header__panel"
          onMouseEnter={handlePanelMouseEnter}
          onMouseLeave={handlePanelMouseLeave}
        >
          {activePanelContent}
        </div>
      )}
    </div>
  );
}
