// app/tools/bookkeeping-n3/store/use-bookkeeping-store.ts
/**
 * N3 記帳オートメーション - Zustand Store
 * 
 * 左パネル（取引リスト）と右パネル（ルール作成）の連動状態を管理
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  RawTransaction, 
  BookkeepingRule, 
  TransactionStatus,
  AIKeywordSuggestion,
  AIAccountSuggestion 
} from '../types';

// ============================================================
// State Types
// ============================================================

interface TransactionFilter {
  status: TransactionStatus | 'all';
  sourceName: string;
  dateFrom: string;
  dateTo: string;
  searchKeyword: string;
}

interface DraftRule {
  keyword: string;
  match_type: 'partial' | 'exact' | 'regex';
  target_category: string;
  target_sub_category: string;
  tax_code: string;
  priority: number;
  rule_name: string;
  rule_description: string;
}

interface BookkeepingState {
  // ============================================================
  // 取引データ
  // ============================================================
  transactions: RawTransaction[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  transactionStats: {
    pending: number;
    simulated: number;
    submitted: number;
    ignored: number;
    total: number;
  };
  
  // ============================================================
  // ルールデータ
  // ============================================================
  rules: BookkeepingRule[];
  rulesLoading: boolean;
  rulesError: string | null;
  
  // ============================================================
  // 左パネル状態（取引リスト）
  // ============================================================
  selectedTransactionId: string | null;
  selectedTransaction: RawTransaction | null;
  filter: TransactionFilter;
  
  // ============================================================
  // 右パネル状態（ルール作成）
  // ============================================================
  isCreatingRule: boolean;
  draftRule: DraftRule;
  extractedKeywords: AIKeywordSuggestion[];
  suggestedAccounts: AIAccountSuggestion[];
  aiLoading: boolean;
  
  // ============================================================
  // モーダル状態
  // ============================================================
  showAIAssistModal: boolean;
  showBulkApplyModal: boolean;
  showMFSyncModal: boolean;
  showRuleDetailModal: boolean;
  editingRuleId: string | null;
  
  // ============================================================
  // 処理状態
  // ============================================================
  isSyncing: boolean;
  isApplyingRules: boolean;
  isSubmitting: boolean;
}

interface BookkeepingActions {
  // ============================================================
  // 取引データ操作
  // ============================================================
  setTransactions: (transactions: RawTransaction[]) => void;
  setTransactionsLoading: (loading: boolean) => void;
  setTransactionsError: (error: string | null) => void;
  updateTransactionStats: (stats: BookkeepingState['transactionStats']) => void;
  updateTransaction: (id: string, updates: Partial<RawTransaction>) => void;
  
  // ============================================================
  // ルールデータ操作
  // ============================================================
  setRules: (rules: BookkeepingRule[]) => void;
  setRulesLoading: (loading: boolean) => void;
  setRulesError: (error: string | null) => void;
  addRule: (rule: BookkeepingRule) => void;
  updateRule: (id: string, updates: Partial<BookkeepingRule>) => void;
  deleteRule: (id: string) => void;
  
  // ============================================================
  // 取引選択・フィルター
  // ============================================================
  selectTransaction: (id: string | null) => void;
  setFilter: (filter: Partial<TransactionFilter>) => void;
  resetFilter: () => void;
  
  // ============================================================
  // ルール作成
  // ============================================================
  startCreatingRule: (fromTransaction?: RawTransaction) => void;
  cancelCreatingRule: () => void;
  updateDraftRule: (updates: Partial<DraftRule>) => void;
  selectKeyword: (keyword: string) => void;
  selectAccount: (account: AIAccountSuggestion) => void;
  
  // ============================================================
  // AI サジェスション
  // ============================================================
  setExtractedKeywords: (keywords: AIKeywordSuggestion[]) => void;
  setSuggestedAccounts: (accounts: AIAccountSuggestion[]) => void;
  setAILoading: (loading: boolean) => void;
  
  // ============================================================
  // モーダル操作
  // ============================================================
  openAIAssistModal: () => void;
  closeAIAssistModal: () => void;
  openBulkApplyModal: () => void;
  closeBulkApplyModal: () => void;
  openMFSyncModal: () => void;
  closeMFSyncModal: () => void;
  openRuleDetailModal: (ruleId: string) => void;
  closeRuleDetailModal: () => void;
  
  // ============================================================
  // 処理状態
  // ============================================================
  setIsSyncing: (syncing: boolean) => void;
  setIsApplyingRules: (applying: boolean) => void;
  setIsSubmitting: (submitting: boolean) => void;
  
  // ============================================================
  // リセット
  // ============================================================
  reset: () => void;
}

// ============================================================
// Initial State
// ============================================================

const initialFilter: TransactionFilter = {
  status: 'pending',
  sourceName: '',
  dateFrom: '',
  dateTo: '',
  searchKeyword: '',
};

const initialDraftRule: DraftRule = {
  keyword: '',
  match_type: 'partial',
  target_category: '',
  target_sub_category: '',
  tax_code: '課税仕入 10%',
  priority: 100,
  rule_name: '',
  rule_description: '',
};

const initialState: BookkeepingState = {
  transactions: [],
  transactionsLoading: false,
  transactionsError: null,
  transactionStats: { pending: 0, simulated: 0, submitted: 0, ignored: 0, total: 0 },
  
  rules: [],
  rulesLoading: false,
  rulesError: null,
  
  selectedTransactionId: null,
  selectedTransaction: null,
  filter: initialFilter,
  
  isCreatingRule: false,
  draftRule: initialDraftRule,
  extractedKeywords: [],
  suggestedAccounts: [],
  aiLoading: false,
  
  showAIAssistModal: false,
  showBulkApplyModal: false,
  showMFSyncModal: false,
  showRuleDetailModal: false,
  editingRuleId: null,
  
  isSyncing: false,
  isApplyingRules: false,
  isSubmitting: false,
};

// ============================================================
// Store
// ============================================================

export const useBookkeepingStore = create<BookkeepingState & BookkeepingActions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // ============================================================
      // 取引データ操作
      // ============================================================
      setTransactions: (transactions) => set({ transactions }),
      setTransactionsLoading: (loading) => set({ transactionsLoading: loading }),
      setTransactionsError: (error) => set({ transactionsError: error }),
      updateTransactionStats: (stats) => set({ transactionStats: stats }),
      
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
        selectedTransaction: state.selectedTransaction?.id === id 
          ? { ...state.selectedTransaction, ...updates }
          : state.selectedTransaction,
      })),
      
      // ============================================================
      // ルールデータ操作
      // ============================================================
      setRules: (rules) => set({ rules }),
      setRulesLoading: (loading) => set({ rulesLoading: loading }),
      setRulesError: (error) => set({ rulesError: error }),
      
      addRule: (rule) => set((state) => ({
        rules: [...state.rules, rule],
      })),
      
      updateRule: (id, updates) => set((state) => ({
        rules: state.rules.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      })),
      
      deleteRule: (id) => set((state) => ({
        rules: state.rules.filter((r) => r.id !== id),
      })),
      
      // ============================================================
      // 取引選択・フィルター
      // ============================================================
      selectTransaction: (id) => set((state) => {
        const transaction = id 
          ? state.transactions.find((t) => t.id === id) || null
          : null;
        return {
          selectedTransactionId: id,
          selectedTransaction: transaction,
          // 取引選択時にルール作成モードを開始
          isCreatingRule: !!transaction,
          draftRule: transaction 
            ? { ...initialDraftRule, keyword: '' }
            : initialDraftRule,
          extractedKeywords: [],
          suggestedAccounts: [],
        };
      }),
      
      setFilter: (filter) => set((state) => ({
        filter: { ...state.filter, ...filter },
      })),
      
      resetFilter: () => set({ filter: initialFilter }),
      
      // ============================================================
      // ルール作成
      // ============================================================
      startCreatingRule: (fromTransaction) => set({
        isCreatingRule: true,
        selectedTransaction: fromTransaction || null,
        selectedTransactionId: fromTransaction?.id || null,
        draftRule: initialDraftRule,
        extractedKeywords: [],
        suggestedAccounts: [],
      }),
      
      cancelCreatingRule: () => set({
        isCreatingRule: false,
        draftRule: initialDraftRule,
        extractedKeywords: [],
        suggestedAccounts: [],
      }),
      
      updateDraftRule: (updates) => set((state) => ({
        draftRule: { ...state.draftRule, ...updates },
      })),
      
      selectKeyword: (keyword) => set((state) => ({
        draftRule: { 
          ...state.draftRule, 
          keyword,
          rule_name: state.draftRule.rule_name || `${keyword}の自動仕訳`,
        },
      })),
      
      selectAccount: (account) => set((state) => ({
        draftRule: {
          ...state.draftRule,
          target_category: account.account,
          target_sub_category: account.sub_account || '',
          tax_code: account.tax_code,
        },
        suggestedAccounts: state.suggestedAccounts.map((a) => ({
          ...a,
          selected: a.account === account.account,
        })) as AIAccountSuggestion[],
      })),
      
      // ============================================================
      // AI サジェスション
      // ============================================================
      setExtractedKeywords: (keywords) => set({ extractedKeywords: keywords }),
      setSuggestedAccounts: (accounts) => set({ suggestedAccounts: accounts }),
      setAILoading: (loading) => set({ aiLoading: loading }),
      
      // ============================================================
      // モーダル操作
      // ============================================================
      openAIAssistModal: () => set({ showAIAssistModal: true }),
      closeAIAssistModal: () => set({ showAIAssistModal: false }),
      openBulkApplyModal: () => set({ showBulkApplyModal: true }),
      closeBulkApplyModal: () => set({ showBulkApplyModal: false }),
      openMFSyncModal: () => set({ showMFSyncModal: true }),
      closeMFSyncModal: () => set({ showMFSyncModal: false }),
      openRuleDetailModal: (ruleId) => set({ showRuleDetailModal: true, editingRuleId: ruleId }),
      closeRuleDetailModal: () => set({ showRuleDetailModal: false, editingRuleId: null }),
      
      // ============================================================
      // 処理状態
      // ============================================================
      setIsSyncing: (syncing) => set({ isSyncing: syncing }),
      setIsApplyingRules: (applying) => set({ isApplyingRules: applying }),
      setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),
      
      // ============================================================
      // リセット
      // ============================================================
      reset: () => set(initialState),
    }),
    { name: 'bookkeeping-store' }
  )
);

// ============================================================
// Selector Hooks
// ============================================================

export const useTransactions = () => useBookkeepingStore((state) => state.transactions);
export const useSelectedTransaction = () => useBookkeepingStore((state) => state.selectedTransaction);
export const useRules = () => useBookkeepingStore((state) => state.rules);
export const useDraftRule = () => useBookkeepingStore((state) => state.draftRule);
export const useTransactionStats = () => useBookkeepingStore((state) => state.transactionStats);

// フィルター済み取引の取得
export const useFilteredTransactions = () => {
  const transactions = useBookkeepingStore((state) => state.transactions);
  const filter = useBookkeepingStore((state) => state.filter);
  
  return transactions.filter((t) => {
    if (filter.status !== 'all' && t.status !== filter.status) return false;
    if (filter.sourceName && t.source_name !== filter.sourceName) return false;
    if (filter.dateFrom && t.transaction_date < filter.dateFrom) return false;
    if (filter.dateTo && t.transaction_date > filter.dateTo) return false;
    if (filter.searchKeyword && !t.raw_memo.toLowerCase().includes(filter.searchKeyword.toLowerCase())) return false;
    return true;
  });
};

// アクティブなルールのみ取得
export const useActiveRules = () => {
  const rules = useBookkeepingStore((state) => state.rules);
  return rules.filter((r) => r.status === 'active').sort((a, b) => a.priority - b.priority);
};
