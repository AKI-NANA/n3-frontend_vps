// app/components/layouts/top-tab-bar.tsx
/**
 * TopTabBar - 共通TOPのページ専用タブ（L1）
 * 
 * サイドバーで選択されたページに応じて、
 * タブセットが動的に切り替わる
 */

'use client';

import { useSidebarStore } from '@/store/sidebarStore';
import { Search } from 'lucide-react';

interface TopTabBarProps {
  className?: string;
}

export function TopTabBar({ className = '' }: TopTabBarProps) {
  const { currentTab, setCurrentTab, getCurrentTabs } = useSidebarStore();
  const tabs = getCurrentTabs();

  return (
    <div className={`n3-top-tab-bar ${className}`.trim()}>
      {/* 左側: ページ専用タブ */}
      <div className="n3-top-tab-bar__tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`n3-top-tab-bar__tab ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => setCurrentTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 右側: 検索バー */}
      <div className="n3-top-tab-bar__search">
        <Search size={14} />
        <input
          type="text"
          placeholder="検索..."
          className="n3-top-tab-bar__search-input"
        />
        <kbd className="n3-top-tab-bar__kbd">⌘K</kbd>
      </div>
    </div>
  );
}
