// store/n3/financeUIStore.ts
/**
 * Finance N3 UI Store - 会計用UI状態
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

export type FinanceTabId = 'journal' | 'expense' | 'kobutsu' | 'reports' | 'settings';
export type JournalStatus = 'all' | 'pending' | 'approved' | 'rejected';
export type ExpenseCategory = 'all' | 'shipping' | 'purchase' | 'platform' | 'other';

interface FinanceUIState {
  // タブ
  activeTab: FinanceTabId;

  // 仕訳関連
  journalStatus: JournalStatus;
  journalDateRange: { start: string; end: string } | null;
  journalCurrentPage: number;
  journalPageSize: number;

  // 経費関連
  expenseCategory: ExpenseCategory;
  expenseDateRange: { start: string; end: string } | null;
  expenseCurrentPage: number;

  // 古物台帳関連
  kobutsuDateRange: { start: string; end: string } | null;
  kobutsuSearch: string;
  kobutsuCurrentPage: number;

  // 選択状態
  selectedJournalIds: string[];
  selectedExpenseIds: string[];
  selectedKobutsuIds: string[];

  // 表示設定
  showApprovedOnly: boolean;
  autoRefresh: boolean;
  currency: 'JPY' | 'USD';
}

interface FinanceUIActions {
  setActiveTab: (tab: FinanceTabId) => void;

  // 仕訳
  setJournalStatus: (status: JournalStatus) => void;
  setJournalDateRange: (range: { start: string; end: string } | null) => void;
  setJournalPage: (page: number) => void;
  selectJournal: (id: string) => void;
  clearJournalSelection: () => void;

  // 経費
  setExpenseCategory: (category: ExpenseCategory) => void;
  setExpenseDateRange: (range: { start: string; end: string } | null) => void;
  setExpensePage: (page: number) => void;
  selectExpense: (id: string) => void;
  clearExpenseSelection: () => void;

  // 古物台帳
  setKobutsuDateRange: (range: { start: string; end: string } | null) => void;
  setKobutsuSearch: (search: string) => void;
  setKobutsuPage: (page: number) => void;
  selectKobutsu: (id: string) => void;
  clearKobutsuSelection: () => void;

  // 設定
  toggleShowApprovedOnly: () => void;
  toggleAutoRefresh: () => void;
  setCurrency: (currency: 'JPY' | 'USD') => void;

  reset: () => void;
}

type FinanceUIStore = FinanceUIState & FinanceUIActions;

// ============================================================
// 初期状態
// ============================================================

const initialState: FinanceUIState = {
  activeTab: 'journal',
  journalStatus: 'all',
  journalDateRange: null,
  journalCurrentPage: 1,
  journalPageSize: 50,
  expenseCategory: 'all',
  expenseDateRange: null,
  expenseCurrentPage: 1,
  kobutsuDateRange: null,
  kobutsuSearch: '',
  kobutsuCurrentPage: 1,
  selectedJournalIds: [],
  selectedExpenseIds: [],
  selectedKobutsuIds: [],
  showApprovedOnly: false,
  autoRefresh: true,
  currency: 'JPY',
};

// ============================================================
// Store
// ============================================================

export const useFinanceUIStore = create<FinanceUIStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        setActiveTab: (tab) => {
          set((state) => {
            state.activeTab = tab;
          });
        },

        // 仕訳
        setJournalStatus: (status) => {
          set((state) => {
            state.journalStatus = status;
            state.journalCurrentPage = 1;
          });
        },

        setJournalDateRange: (range) => {
          set((state) => {
            state.journalDateRange = range;
            state.journalCurrentPage = 1;
          });
        },

        setJournalPage: (page) => {
          set((state) => {
            state.journalCurrentPage = page;
          });
        },

        selectJournal: (id) => {
          set((state) => {
            const index = state.selectedJournalIds.indexOf(id);
            if (index === -1) {
              state.selectedJournalIds.push(id);
            } else {
              state.selectedJournalIds.splice(index, 1);
            }
          });
        },

        clearJournalSelection: () => {
          set((state) => {
            state.selectedJournalIds = [];
          });
        },

        // 経費
        setExpenseCategory: (category) => {
          set((state) => {
            state.expenseCategory = category;
            state.expenseCurrentPage = 1;
          });
        },

        setExpenseDateRange: (range) => {
          set((state) => {
            state.expenseDateRange = range;
            state.expenseCurrentPage = 1;
          });
        },

        setExpensePage: (page) => {
          set((state) => {
            state.expenseCurrentPage = page;
          });
        },

        selectExpense: (id) => {
          set((state) => {
            const index = state.selectedExpenseIds.indexOf(id);
            if (index === -1) {
              state.selectedExpenseIds.push(id);
            } else {
              state.selectedExpenseIds.splice(index, 1);
            }
          });
        },

        clearExpenseSelection: () => {
          set((state) => {
            state.selectedExpenseIds = [];
          });
        },

        // 古物台帳
        setKobutsuDateRange: (range) => {
          set((state) => {
            state.kobutsuDateRange = range;
            state.kobutsuCurrentPage = 1;
          });
        },

        setKobutsuSearch: (search) => {
          set((state) => {
            state.kobutsuSearch = search;
            state.kobutsuCurrentPage = 1;
          });
        },

        setKobutsuPage: (page) => {
          set((state) => {
            state.kobutsuCurrentPage = page;
          });
        },

        selectKobutsu: (id) => {
          set((state) => {
            const index = state.selectedKobutsuIds.indexOf(id);
            if (index === -1) {
              state.selectedKobutsuIds.push(id);
            } else {
              state.selectedKobutsuIds.splice(index, 1);
            }
          });
        },

        clearKobutsuSelection: () => {
          set((state) => {
            state.selectedKobutsuIds = [];
          });
        },

        // 設定
        toggleShowApprovedOnly: () => {
          set((state) => {
            state.showApprovedOnly = !state.showApprovedOnly;
          });
        },

        toggleAutoRefresh: () => {
          set((state) => {
            state.autoRefresh = !state.autoRefresh;
          });
        },

        setCurrency: (currency) => {
          set((state) => {
            state.currency = currency;
          });
        },

        reset: () => {
          set(initialState);
        },
      })),
      {
        name: 'finance-n3-ui-store',
        partialize: (state) => ({
          journalPageSize: state.journalPageSize,
          showApprovedOnly: state.showApprovedOnly,
          autoRefresh: state.autoRefresh,
          currency: state.currency,
        }),
      }
    ),
    { name: 'FinanceUIStore' }
  )
);

// ============================================================
// セレクター
// ============================================================

export const useFinanceActiveTab = () => useFinanceUIStore(state => state.activeTab);
export const useFinanceJournalStatus = () => useFinanceUIStore(state => state.journalStatus);
export const useFinanceJournalPage = () => useFinanceUIStore(state => state.journalCurrentPage);
export const useFinanceSelectedJournalIds = () => useFinanceUIStore(state => state.selectedJournalIds);
export const useFinanceExpenseCategory = () => useFinanceUIStore(state => state.expenseCategory);
export const useFinanceKobutsuSearch = () => useFinanceUIStore(state => state.kobutsuSearch);
export const useFinanceCurrency = () => useFinanceUIStore(state => state.currency);
