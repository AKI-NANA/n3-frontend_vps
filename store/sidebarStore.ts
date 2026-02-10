// store/sidebarStore.ts
/**
 * サイドバー選択状態を管理するストア
 * 
 * サイドバーで選択されたページに応じて、
 * 共通TOPのタブセットが切り替わる
 */

import { create } from 'zustand';

// ページID
export type PageId = 
  | 'editing'      // 出品編集
  | 'research'     // リサーチ
  | 'inventory'    // 在庫管理
  | 'analytics'    // 分析
  | 'n8n-workflows' // n8nワークフロー管理
  | 'settings';    // 設定

// 各ページのタブ定義
export interface PageTab {
  id: string;
  label: string;
  icon?: string;
}

// ページごとのタブセット（英語）
export const PAGE_TABS: Record<PageId, PageTab[]> = {
  editing: [
    { id: 'basic-edit', label: 'Basic' },
    { id: 'logistics', label: 'Logistics' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'media', label: 'Media' },
    { id: 'history', label: 'History' },
  ],
  research: [
    { id: 'search', label: 'Search' },
    { id: 'trends', label: 'Trends' },
    { id: 'competitors', label: 'Competitors' },
  ],
  inventory: [
    { id: 'stock', label: 'Stock' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'history', label: 'History' },
  ],
  analytics: [
    { id: 'sales', label: 'Sales' },
    { id: 'profit', label: 'Profit' },
    { id: 'performance', label: 'Performance' },
  ],
  'n8n-workflows': [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'status', label: 'Status' },
  ],
  settings: [
    { id: 'general', label: 'General' },
    { id: 'api', label: 'API' },
    { id: 'account', label: 'Account' },
  ],
};

interface SidebarState {
  // 現在選択されているページ
  currentPage: PageId;
  // 現在のページ内で選択されているタブ
  currentTab: string;
  // ページを切り替え
  setCurrentPage: (page: PageId) => void;
  // タブを切り替え
  setCurrentTab: (tab: string) => void;
  // 現在のページのタブ一覧を取得
  getCurrentTabs: () => PageTab[];
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  currentPage: 'editing',
  currentTab: 'basic-edit',
  
  setCurrentPage: (page) => {
    const tabs = PAGE_TABS[page];
    set({
      currentPage: page,
      currentTab: tabs[0]?.id || '',
    });
  },
  
  setCurrentTab: (tab) => {
    set({ currentTab: tab });
  },
  
  getCurrentTabs: () => {
    const { currentPage } = get();
    return PAGE_TABS[currentPage] || [];
  },
}));
