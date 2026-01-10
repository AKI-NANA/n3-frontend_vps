// lib/store/use-tab-store.ts
/**
 * N3統合ページ用タブ管理ストア
 * - 一度開いたツールをメモリに保持
 * - 最大5つまで保持（8GB RAM対策）
 * - LRU（Least Recently Used）で古いものから破棄
 */
import { create } from 'zustand';

// N3統合ページのID一覧
export type N3ToolId = 
  | 'editing-n3' 
  | 'research-n3' 
  | 'amazon-research-n3'
  | 'operations-n3' 
  | 'listing-n3' 
  | 'analytics-n3' 
  | 'finance-n3' 
  | 'bookkeeping-n3' 
  | 'settings-n3' 
  | 'docs-n3'
  | 'global-data-pulse';

// ツール情報
export const N3_TOOL_INFO: Record<N3ToolId, { label: string; color: string }> = {
  'editing-n3': { label: 'データ編集', color: '#8b5cf6' },
  'research-n3': { label: 'リサーチ', color: '#06b6d4' },
  'amazon-research-n3': { label: 'Amazonリサーチ', color: '#FF9900' },
  'operations-n3': { label: 'オペレーション', color: '#f59e0b' },
  'listing-n3': { label: '出品管理', color: '#10b981' },
  'analytics-n3': { label: '分析', color: '#3b82f6' },
  'finance-n3': { label: '会計', color: '#22c55e' },
  'bookkeeping-n3': { label: '記帳', color: '#ec4899' },
  'settings-n3': { label: '設定', color: '#6b7280' },
  'docs-n3': { label: 'ドキュメント', color: '#f97316' },
  'global-data-pulse': { label: 'GDP AI Media', color: '#8B5CF6' },
};

// 最大タブ数（8GB RAM対策）
const MAX_TABS = 5;

interface TabState {
  activeTab: N3ToolId;
  openTabs: N3ToolId[];
  // アクティブタブを設定（新しいタブなら追加）
  setActiveTab: (id: N3ToolId) => void;
  // タブを閉じる
  closeTab: (id: N3ToolId) => void;
  // 特定のタブが開いているか確認
  isTabOpen: (id: N3ToolId) => boolean;
}

export const useTabStore = create<TabState>((set, get) => ({
  activeTab: 'editing-n3',
  openTabs: ['editing-n3'], // 初期表示

  setActiveTab: (id) => set((state) => {
    // すでに開いている場合はアクティブにするだけ
    if (state.openTabs.includes(id)) {
      // LRU: アクティブになったタブを最後に移動
      const newTabs = state.openTabs.filter(t => t !== id);
      newTabs.push(id);
      return { activeTab: id, openTabs: newTabs };
    }

    // 新しく開く場合
    const newTabs = [...state.openTabs, id];
    
    // 最大数を超えたら最も古いタブを閉じる（LRU）
    if (newTabs.length > MAX_TABS) {
      newTabs.shift(); // 最初の（最も古い）タブを削除
    }

    return { openTabs: newTabs, activeTab: id };
  }),

  closeTab: (id) => set((state) => {
    const newTabs = state.openTabs.filter(t => t !== id);
    
    // 閉じたタブがアクティブだった場合、最後のタブをアクティブに
    if (state.activeTab === id && newTabs.length > 0) {
      return { 
        openTabs: newTabs, 
        activeTab: newTabs[newTabs.length - 1] 
      };
    }

    return { openTabs: newTabs };
  }),

  isTabOpen: (id) => get().openTabs.includes(id),
}));

// N3ツールかどうかを判定するヘルパー
export function isN3Tool(id: string): id is N3ToolId {
  return id in N3_TOOL_INFO;
}
