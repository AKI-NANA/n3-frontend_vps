// lib/store/use-tab-store.ts
/**
 * N3統合ページ用タブ管理ストア
 * 
 * Phase I Task Group D & F: データ編集タブ修正 + UI高速化
 * 
 * 機能:
 * - 一度開いたツールをメモリに保持
 * - 最大5つまで保持（8GB RAM対策）
 * - LRU（Least Recently Used）で古いものから破棄
 * - Tab Prefetch対応
 */
import { create } from 'zustand';
import { getQueryClient, prefetchForTab } from '@/lib/query-client';

// N3メインタブ（5タブ構成）
export type N3MainToolId = 
  | 'editing-n3'      // Catalog: 商品・在庫・出品
  | 'research-n3'     // Sourcing: リサーチ
  | 'operations-n3'   // Execution: 受注・配送・CS
  | 'finance-n3'      // Finance: 分析+会計
  | 'control-n3';     // Control: n8n監視・Bot管理

// 追加ツール（タブに追加可能）
export type N3ExtraToolId =
  | 'amazon-research-n3'
  | 'listing-n3'
  | 'analytics-n3'
  | 'bookkeeping-n3'
  | 'settings-n3'
  | 'docs-n3'
  | 'global-data-pulse';

// 全ツールID
export type N3ToolId = N3MainToolId | N3ExtraToolId;

// メインツール情報（5タブ）
export const N3_MAIN_TOOLS: Record<N3MainToolId, { 
  label: string; 
  labelEn: string;
  color: string;
  description: string;
}> = {
  'editing-n3': { 
    label: 'データ編集', 
    labelEn: 'Catalog',
    color: '#8b5cf6',
    description: '商品マスター・在庫・出品'
  },
  'research-n3': { 
    label: 'リサーチ', 
    labelEn: 'Sourcing',
    color: '#06b6d4',
    description: '市場調査・仕入れ判断'
  },
  'operations-n3': { 
    label: 'オペレーション', 
    labelEn: 'Execution',
    color: '#f59e0b',
    description: '受注・配送・CS'
  },
  'finance-n3': { 
    label: 'ファイナンス', 
    labelEn: 'Finance',
    color: '#22c55e',
    description: '売上分析・会計'
  },
  'control-n3': { 
    label: 'コントロール', 
    labelEn: 'Control',
    color: '#ef4444',
    description: 'n8n監視・Bot管理'
  },
};

// 追加ツール情報
export const N3_EXTRA_TOOLS: Record<N3ExtraToolId, { 
  label: string; 
  color: string;
}> = {
  'amazon-research-n3': { label: 'Amazonリサーチ', color: '#FF9900' },
  'listing-n3': { label: '出品管理', color: '#10b981' },
  'analytics-n3': { label: '分析', color: '#3b82f6' },
  'bookkeeping-n3': { label: '記帳', color: '#ec4899' },
  'settings-n3': { label: '設定', color: '#6b7280' },
  'docs-n3': { label: 'ドキュメント', color: '#f97316' },
  'global-data-pulse': { label: 'GDP AI Media', color: '#8B5CF6' },
};

// 全ツール情報（後方互換性のため維持）
export const N3_TOOL_INFO: Record<N3ToolId, { label: string; color: string }> = {
  ...Object.fromEntries(
    Object.entries(N3_MAIN_TOOLS).map(([id, info]) => [id, { label: info.label, color: info.color }])
  ),
  ...N3_EXTRA_TOOLS,
} as Record<N3ToolId, { label: string; color: string }>;

// 最大タブ数（8GB RAM対策）
const MAX_TABS = 5;

// メインツールIDリスト（順番保証）
export const MAIN_TOOL_IDS: N3MainToolId[] = [
  'editing-n3',
  'research-n3',
  'operations-n3',
  'finance-n3',
  'control-n3',
];

// タブ状態の型
type TabStatus = 'idle' | 'loading' | 'ready' | 'error';

interface TabState {
  activeTab: N3ToolId;
  openTabs: N3ToolId[];
  tabStatus: Record<N3ToolId, TabStatus>;
  
  // アクティブタブを設定（新しいタブなら追加）
  setActiveTab: (id: N3ToolId) => void;
  // タブを閉じる
  closeTab: (id: N3ToolId) => void;
  // 特定のタブが開いているか確認
  isTabOpen: (id: N3ToolId) => boolean;
  // メインタブのみ表示モードを切り替え
  showMainTabsOnly: boolean;
  setShowMainTabsOnly: (value: boolean) => void;
  
  // Phase I 追加機能
  // タブステータス更新
  setTabStatus: (id: N3ToolId, status: TabStatus) => void;
  // Prefetch実行
  prefetchTab: (id: N3ToolId) => void;
  // タブロック状態
  lockedTabs: N3ToolId[];
  lockTab: (id: N3ToolId) => void;
  unlockTab: (id: N3ToolId) => void;
  isTabLocked: (id: N3ToolId) => boolean;
}

export const useTabStore = create<TabState>((set, get) => ({
  activeTab: 'editing-n3',
  openTabs: ['editing-n3'], // 初期表示
  tabStatus: {} as Record<N3ToolId, TabStatus>,
  showMainTabsOnly: true, // デフォルトでメインタブのみ
  lockedTabs: [],

  setActiveTab: (id) => set((state) => {
    // ロックされている場合は切り替え不可
    if (state.lockedTabs.includes(id)) {
      console.warn(`Tab ${id} is locked and cannot be activated`);
      return state;
    }
    
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
    // ロックされている場合は閉じれない
    if (state.lockedTabs.includes(id)) {
      console.warn(`Tab ${id} is locked and cannot be closed`);
      return state;
    }
    
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

  setShowMainTabsOnly: (value) => set({ showMainTabsOnly: value }),
  
  // Phase I 追加機能
  setTabStatus: (id, status) => set((state) => ({
    tabStatus: { ...state.tabStatus, [id]: status }
  })),
  
  prefetchTab: (id) => {
    // onMouseEnter時に呼び出すPrefetch
    try {
      const queryClient = getQueryClient();
      prefetchForTab(id, queryClient);
    } catch (error) {
      console.warn('Prefetch failed for tab:', id, error);
    }
  },
  
  lockTab: (id) => set((state) => ({
    lockedTabs: state.lockedTabs.includes(id) ? state.lockedTabs : [...state.lockedTabs, id]
  })),
  
  unlockTab: (id) => set((state) => ({
    lockedTabs: state.lockedTabs.filter(t => t !== id)
  })),
  
  isTabLocked: (id) => get().lockedTabs.includes(id),
}));

// N3ツールかどうかを判定するヘルパー
export function isN3Tool(id: string): id is N3ToolId {
  return id in N3_TOOL_INFO;
}

// メインツールかどうかを判定
export function isMainTool(id: string): id is N3MainToolId {
  return MAIN_TOOL_IDS.includes(id as N3MainToolId);
}
