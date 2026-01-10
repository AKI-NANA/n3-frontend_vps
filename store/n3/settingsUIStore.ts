// store/n3/settingsUIStore.ts
/**
 * Settings N3 UI Store - 設定用UI状態
 *
 * ゴールドスタンダード準拠:
 * - サーバーデータは React Query で管理
 * - 各セレクターは値ごとに分離
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================
// State 型定義
// ============================================================

export type SettingsTabId = 'hts' | 'ebay' | 'mercari' | 'automation' | 'credentials';
export type SettingsSectionId = 'general' | 'api' | 'sync' | 'notification' | 'advanced';

interface SettingsUIState {
  // タブ
  activeTab: SettingsTabId;
  activeSection: SettingsSectionId;

  // HTS分類
  htsSearch: string;
  htsSelectedCategory: string | null;
  htsExpandedNodes: string[];

  // eBay設定
  ebayActiveAccount: string | null;
  ebayShowAdvanced: boolean;

  // 自動化設定
  automationActiveRule: string | null;
  automationShowDisabled: boolean;

  // 認証情報
  credentialFilter: 'all' | 'valid' | 'expired' | 'expiring';
  credentialSearch: string;

  // UI状態
  hasUnsavedChanges: boolean;
  lastSavedAt: string | null;
  validationErrors: Record<string, string>;
}

interface SettingsUIActions {
  setActiveTab: (tab: SettingsTabId) => void;
  setActiveSection: (section: SettingsSectionId) => void;

  // HTS
  setHtsSearch: (search: string) => void;
  setHtsSelectedCategory: (category: string | null) => void;
  toggleHtsNode: (nodeId: string) => void;

  // eBay
  setEbayActiveAccount: (account: string | null) => void;
  toggleEbayAdvanced: () => void;

  // 自動化
  setAutomationActiveRule: (rule: string | null) => void;
  toggleAutomationShowDisabled: () => void;

  // 認証情報
  setCredentialFilter: (filter: 'all' | 'valid' | 'expired' | 'expiring') => void;
  setCredentialSearch: (search: string) => void;

  // UI状態
  setHasUnsavedChanges: (has: boolean) => void;
  setLastSavedAt: (time: string) => void;
  setValidationError: (field: string, error: string | null) => void;
  clearValidationErrors: () => void;

  reset: () => void;
}

type SettingsUIStore = SettingsUIState & SettingsUIActions;

// ============================================================
// 初期状態
// ============================================================

const initialState: SettingsUIState = {
  activeTab: 'hts',
  activeSection: 'general',
  htsSearch: '',
  htsSelectedCategory: null,
  htsExpandedNodes: [],
  ebayActiveAccount: null,
  ebayShowAdvanced: false,
  automationActiveRule: null,
  automationShowDisabled: false,
  credentialFilter: 'all',
  credentialSearch: '',
  hasUnsavedChanges: false,
  lastSavedAt: null,
  validationErrors: {},
};

// ============================================================
// Store
// ============================================================

export const useSettingsUIStore = create<SettingsUIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setActiveTab: (tab) => {
          set((state) => {
            state.activeTab = tab;
            state.activeSection = 'general';
          });
        },

        setActiveSection: (section) => {
          set((state) => {
            state.activeSection = section;
          });
        },

        // HTS
        setHtsSearch: (search) => {
          set((state) => {
            state.htsSearch = search;
          });
        },

        setHtsSelectedCategory: (category) => {
          set((state) => {
            state.htsSelectedCategory = category;
          });
        },

        toggleHtsNode: (nodeId) => {
          set((state) => {
            const index = state.htsExpandedNodes.indexOf(nodeId);
            if (index === -1) {
              state.htsExpandedNodes.push(nodeId);
            } else {
              state.htsExpandedNodes.splice(index, 1);
            }
          });
        },

        // eBay
        setEbayActiveAccount: (account) => {
          set((state) => {
            state.ebayActiveAccount = account;
          });
        },

        toggleEbayAdvanced: () => {
          set((state) => {
            state.ebayShowAdvanced = !state.ebayShowAdvanced;
          });
        },

        // 自動化
        setAutomationActiveRule: (rule) => {
          set((state) => {
            state.automationActiveRule = rule;
          });
        },

        toggleAutomationShowDisabled: () => {
          set((state) => {
            state.automationShowDisabled = !state.automationShowDisabled;
          });
        },

        // 認証情報
        setCredentialFilter: (filter) => {
          set((state) => {
            state.credentialFilter = filter;
          });
        },

        setCredentialSearch: (search) => {
          set((state) => {
            state.credentialSearch = search;
          });
        },

        // UI状態
        setHasUnsavedChanges: (has) => {
          set((state) => {
            state.hasUnsavedChanges = has;
          });
        },

        setLastSavedAt: (time) => {
          set((state) => {
            state.lastSavedAt = time;
            state.hasUnsavedChanges = false;
          });
        },

        setValidationError: (field, error) => {
          set((state) => {
            if (error === null) {
              delete state.validationErrors[field];
            } else {
              state.validationErrors[field] = error;
            }
          });
        },

        clearValidationErrors: () => {
          set((state) => {
            state.validationErrors = {};
          });
        },

        reset: () => {
          set(initialState);
        },
      })),
      {
        name: 'settings-n3-ui-store',
        partialize: (state) => ({
          htsExpandedNodes: state.htsExpandedNodes,
          ebayShowAdvanced: state.ebayShowAdvanced,
          automationShowDisabled: state.automationShowDisabled,
        }),
      }
    ),
    { name: 'SettingsUIStore' }
  )
);

// ============================================================
// セレクター
// ============================================================

export const useSettingsActiveTab = () => useSettingsUIStore(state => state.activeTab);
export const useSettingsActiveSection = () => useSettingsUIStore(state => state.activeSection);
export const useSettingsHtsSearch = () => useSettingsUIStore(state => state.htsSearch);
export const useSettingsHtsSelectedCategory = () => useSettingsUIStore(state => state.htsSelectedCategory);
export const useSettingsHasUnsavedChanges = () => useSettingsUIStore(state => state.hasUnsavedChanges);
export const useSettingsValidationErrors = () => useSettingsUIStore(state => state.validationErrors);
export const useSettingsCredentialFilter = () => useSettingsUIStore(state => state.credentialFilter);
