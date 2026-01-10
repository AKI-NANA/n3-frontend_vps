// store/persistentFilter.ts
/**
 * グローバル永続フィルターStore
 * 
 * 機能:
 * 1. タブを跨いだ属性フィルターの永続化
 * 2. 3階層の属性フィルター (attr_l1, attr_l2, attr_l3)
 * 3. is_verified フラグによる確定済み商品の絞り込み
 * 4. Supusi (スプレッドシート) との双方向同期対応
 * 
 * 設計原則:
 * - Zustand persist middleware でブラウザに永続化
 * - API リクエストに自動的にパラメータを付与
 * - タブ切り替えでもフィルター状態を維持
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================
// 型定義
// ============================================================

/** 属性フィルターの値 */
export interface AttributeFilterValue {
  l1: string | null;  // Lv1属性 (大分類)
  l2: string | null;  // Lv2属性 (中分類)
  l3: string | null;  // Lv3属性 (小分類)
}

/** 属性の選択肢 (DBから動的に取得) */
export interface AttributeOptions {
  l1Options: string[];
  l2Options: string[];  // l1に依存
  l3Options: string[];  // l2に依存
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

/** 確定フィルター */
export interface VerifiedFilter {
  /** 確定済みのみ表示 */
  showVerifiedOnly: boolean;
  /** 確定済みの条件 (原価・個数・タイトル入力済み) */
  verifiedConditions: {
    hasCost: boolean;
    hasQuantity: boolean;
    hasTitle: boolean;
  };
}

/** フィルターState */
export interface PersistentFilterState {
  // 属性フィルター
  attribute: AttributeFilterValue;
  // 属性の選択肢
  options: AttributeOptions;
  // 確定フィルター
  verified: VerifiedFilter;
  // フィルターが有効かどうか
  isActive: boolean;
  // 最終更新日時
  lastUpdated: number;
}

/** フィルターActions */
export interface PersistentFilterActions {
  // 属性フィルター
  setAttributeL1: (value: string | null) => void;
  setAttributeL2: (value: string | null) => void;
  setAttributeL3: (value: string | null) => void;
  clearAttribute: () => void;
  
  // 属性選択肢の取得
  fetchAttributeOptions: () => Promise<void>;
  setAttributeOptions: (options: Partial<AttributeOptions>) => void;
  
  // 確定フィルター
  setShowVerifiedOnly: (show: boolean) => void;
  toggleVerifiedOnly: () => void;
  
  // フィルター有効/無効
  setActive: (active: boolean) => void;
  toggleActive: () => void;
  
  // リセット
  reset: () => void;
  
  // APIクエリパラメータを生成
  getQueryParams: () => Record<string, string>;
}

type PersistentFilterStore = PersistentFilterState & PersistentFilterActions;

// ============================================================
// 初期状態
// ============================================================

const initialState: PersistentFilterState = {
  attribute: {
    l1: null,
    l2: null,
    l3: null,
  },
  options: {
    l1Options: [],
    l2Options: [],
    l3Options: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  verified: {
    showVerifiedOnly: false,
    verifiedConditions: {
      hasCost: true,
      hasQuantity: true,
      hasTitle: true,
    },
  },
  isActive: true,
  lastUpdated: Date.now(),
};

// ============================================================
// Store
// ============================================================

export const usePersistentFilterStore = create<PersistentFilterStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // ========================================
        // 属性フィルター
        // ========================================

        setAttributeL1: (value) => {
          set((state) => {
            state.attribute.l1 = value;
            // L1を変更したらL2, L3をリセット
            state.attribute.l2 = null;
            state.attribute.l3 = null;
            state.lastUpdated = Date.now();
          });
          // L2オプションを再取得
          if (value) {
            get().fetchAttributeOptions();
          }
        },

        setAttributeL2: (value) => {
          set((state) => {
            state.attribute.l2 = value;
            // L2を変更したらL3をリセット
            state.attribute.l3 = null;
            state.lastUpdated = Date.now();
          });
          // L3オプションを再取得
          if (value) {
            get().fetchAttributeOptions();
          }
        },

        setAttributeL3: (value) => {
          set((state) => {
            state.attribute.l3 = value;
            state.lastUpdated = Date.now();
          });
        },

        clearAttribute: () => {
          set((state) => {
            state.attribute = { l1: null, l2: null, l3: null };
            state.lastUpdated = Date.now();
          });
        },

        // ========================================
        // 属性選択肢の取得
        // ========================================

        fetchAttributeOptions: async () => {
          const { attribute } = get();
          
          set((state) => {
            state.options.loading = true;
            state.options.error = null;
          });

          try {
            const params = new URLSearchParams();
            if (attribute.l1) params.set('l1', attribute.l1);
            if (attribute.l2) params.set('l2', attribute.l2);

            const response = await fetch(`/api/inventory/attribute-options?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
              set((state) => {
                state.options.l1Options = data.l1Options || [];
                state.options.l2Options = data.l2Options || [];
                state.options.l3Options = data.l3Options || [];
                state.options.loading = false;
                state.options.lastFetched = Date.now();
              });
            } else {
              throw new Error(data.error || '属性取得エラー');
            }
          } catch (err: any) {
            set((state) => {
              state.options.loading = false;
              state.options.error = err.message;
            });
          }
        },

        setAttributeOptions: (options) => {
          set((state) => {
            Object.assign(state.options, options);
          });
        },

        // ========================================
        // 確定フィルター
        // ========================================

        setShowVerifiedOnly: (show) => {
          set((state) => {
            state.verified.showVerifiedOnly = show;
            state.lastUpdated = Date.now();
          });
        },

        toggleVerifiedOnly: () => {
          set((state) => {
            state.verified.showVerifiedOnly = !state.verified.showVerifiedOnly;
            state.lastUpdated = Date.now();
          });
        },

        // ========================================
        // フィルター有効/無効
        // ========================================

        setActive: (active) => {
          set((state) => {
            state.isActive = active;
          });
        },

        toggleActive: () => {
          set((state) => {
            state.isActive = !state.isActive;
          });
        },

        // ========================================
        // リセット
        // ========================================

        reset: () => {
          set(initialState);
        },

        // ========================================
        // APIクエリパラメータを生成
        // ========================================

        getQueryParams: () => {
          const state = get();
          const params: Record<string, string> = {};

          if (!state.isActive) return params;

          if (state.attribute.l1) params.attr_l1 = state.attribute.l1;
          if (state.attribute.l2) params.attr_l2 = state.attribute.l2;
          if (state.attribute.l3) params.attr_l3 = state.attribute.l3;
          if (state.verified.showVerifiedOnly) params.is_verified = 'true';

          return params;
        },
      })),
      {
        name: 'persistent-filter-store',
        // 永続化するフィールドを選択
        partialize: (state) => ({
          attribute: state.attribute,
          verified: state.verified,
          isActive: state.isActive,
          lastUpdated: state.lastUpdated,
        }),
      }
    ),
    { name: 'PersistentFilterStore' }
  )
);

// ============================================================
// セレクター
// ============================================================

/** 属性フィルターの値を取得 */
export const useAttributeFilter = () => {
  return usePersistentFilterStore((state) => state.attribute);
};

/** 属性オプションを取得 */
export const useAttributeOptions = () => {
  return usePersistentFilterStore((state) => state.options);
};

/** 確定フィルターを取得 */
export const useVerifiedFilter = () => {
  return usePersistentFilterStore((state) => state.verified);
};

/** フィルターが有効かどうか */
export const useFilterActive = () => {
  return usePersistentFilterStore((state) => state.isActive);
};

/** APIパラメータを取得 */
export const useFilterQueryParams = () => {
  return usePersistentFilterStore((state) => state.getQueryParams());
};

// ============================================================
// アクション取得（コンポーネント外から使用）
// ============================================================

export const persistentFilterActions = {
  setAttributeL1: (value: string | null) => usePersistentFilterStore.getState().setAttributeL1(value),
  setAttributeL2: (value: string | null) => usePersistentFilterStore.getState().setAttributeL2(value),
  setAttributeL3: (value: string | null) => usePersistentFilterStore.getState().setAttributeL3(value),
  clearAttribute: () => usePersistentFilterStore.getState().clearAttribute(),
  fetchAttributeOptions: () => usePersistentFilterStore.getState().fetchAttributeOptions(),
  setShowVerifiedOnly: (show: boolean) => usePersistentFilterStore.getState().setShowVerifiedOnly(show),
  toggleVerifiedOnly: () => usePersistentFilterStore.getState().toggleVerifiedOnly(),
  setActive: (active: boolean) => usePersistentFilterStore.getState().setActive(active),
  toggleActive: () => usePersistentFilterStore.getState().toggleActive(),
  reset: () => usePersistentFilterStore.getState().reset(),
  getQueryParams: () => usePersistentFilterStore.getState().getQueryParams(),
};
