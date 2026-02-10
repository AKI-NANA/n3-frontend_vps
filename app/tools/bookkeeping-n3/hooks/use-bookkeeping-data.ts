// app/tools/bookkeeping-n3/hooks/use-bookkeeping-data.ts
/**
 * N3 記帳オートメーション - データ取得フック
 */

import { useCallback, useEffect, useRef } from 'react';
import { useBookkeepingStore } from '../store/use-bookkeeping-store';
import type { RawTransaction, BookkeepingRule, TransactionStatus } from '../types';

// ============================================================
// API呼び出し関数
// ============================================================

async function fetchTransactions(params: {
  status?: TransactionStatus | 'all';
  sourceName?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  transactions: RawTransaction[];
  total: number;
  stats: { pending: number; simulated: number; submitted: number; ignored: number };
}> {
  const searchParams = new URLSearchParams();
  if (params.status && params.status !== 'all') searchParams.set('status', params.status);
  if (params.sourceName) searchParams.set('source_name', params.sourceName);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.pageSize) searchParams.set('page_size', params.pageSize.toString());

  const response = await fetch(`/api/bookkeeping-n3/transactions?${searchParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch transactions');
  const data = await response.json();
  
  if (!data.success) throw new Error(data.error || 'Unknown error');
  return data.data;
}

async function fetchRules(): Promise<BookkeepingRule[]> {
  const response = await fetch('/api/bookkeeping-n3/rules');
  if (!response.ok) throw new Error('Failed to fetch rules');
  const data = await response.json();
  
  if (!data.success) throw new Error(data.error || 'Unknown error');
  return data.data.rules;
}

async function createRule(rule: Partial<BookkeepingRule>): Promise<BookkeepingRule> {
  const response = await fetch('/api/bookkeeping-n3/rules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule),
  });
  if (!response.ok) throw new Error('Failed to create rule');
  const data = await response.json();
  
  if (!data.success) throw new Error(data.error || 'Unknown error');
  return data.data.rule;
}

async function applyRulesToTransactions(transactionIds?: string[]): Promise<{
  applied_count: number;
  transactions: RawTransaction[];
}> {
  const response = await fetch('/api/bookkeeping-n3/apply-rules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction_ids: transactionIds }),
  });
  if (!response.ok) throw new Error('Failed to apply rules');
  const data = await response.json();
  
  if (!data.success) throw new Error(data.error || 'Unknown error');
  return data.data;
}

async function getAISuggestions(rawMemo: string): Promise<{
  keywords: { keyword: string; confidence: number; source: string }[];
  accounts: { account: string; sub_account?: string; tax_code: string; confidence: number; reasoning: string }[];
}> {
  const response = await fetch('/api/bookkeeping-n3/ai-suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw_memo: rawMemo }),
  });
  if (!response.ok) throw new Error('Failed to get AI suggestions');
  const data = await response.json();
  
  if (!data.success) throw new Error(data.error || 'Unknown error');
  return data.data;
}

// ============================================================
// Custom Hook
// ============================================================

export function useBookkeepingData() {
  const store = useBookkeepingStore();
  const initialLoadRef = useRef(false);
  
  // ============================================================
  // 取引データ読み込み
  // ============================================================
  const loadTransactions = useCallback(async () => {
    store.setTransactionsLoading(true);
    store.setTransactionsError(null);
    
    try {
      const { transactions, total, stats } = await fetchTransactions({
        status: store.filter.status,
        sourceName: store.filter.sourceName || undefined,
      });
      
      store.setTransactions(transactions);
      store.updateTransactionStats({
        ...stats,
        total,
      });
    } catch (error) {
      store.setTransactionsError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      store.setTransactionsLoading(false);
    }
  }, [store.filter.status, store.filter.sourceName]);
  
  // ============================================================
  // ルールデータ読み込み
  // ============================================================
  const loadRules = useCallback(async () => {
    store.setRulesLoading(true);
    store.setRulesError(null);
    
    try {
      const rules = await fetchRules();
      store.setRules(rules);
    } catch (error) {
      store.setRulesError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      store.setRulesLoading(false);
    }
  }, []);
  
  // ============================================================
  // ルール作成
  // ============================================================
  const saveRule = useCallback(async (): Promise<boolean> => {
    const { draftRule } = store;
    
    if (!draftRule.keyword || !draftRule.target_category) {
      return false;
    }
    
    try {
      const newRule = await createRule({
        rule_name: draftRule.rule_name || `${draftRule.keyword}の自動仕訳`,
        rule_description: draftRule.rule_description,
        keyword: draftRule.keyword,
        match_type: draftRule.match_type,
        target_category: draftRule.target_category,
        target_sub_category: draftRule.target_sub_category,
        tax_code: draftRule.tax_code,
        priority: draftRule.priority,
        status: 'active',
      });
      
      store.addRule(newRule);
      store.cancelCreatingRule();
      
      // ルール作成後、取引に適用
      await applyRulesToPendingTransactions();
      
      return true;
    } catch (error) {
      console.error('Failed to save rule:', error);
      return false;
    }
  }, [store.draftRule]);
  
  // ============================================================
  // ルール適用
  // ============================================================
  const applyRulesToPendingTransactions = useCallback(async () => {
    store.setIsApplyingRules(true);
    
    try {
      const pendingIds = store.transactions
        .filter((t) => t.status === 'pending')
        .map((t) => t.id);
      
      if (pendingIds.length === 0) return;
      
      const { transactions } = await applyRulesToTransactions(pendingIds);
      
      // ローカル状態を更新
      transactions.forEach((t) => {
        store.updateTransaction(t.id, t);
      });
      
      // 統計を再計算
      await loadTransactions();
    } catch (error) {
      console.error('Failed to apply rules:', error);
    } finally {
      store.setIsApplyingRules(false);
    }
  }, [store.transactions, loadTransactions]);
  
  // ============================================================
  // AI サジェスション取得
  // ============================================================
  const fetchAISuggestions = useCallback(async (rawMemo: string) => {
    if (!rawMemo) return;
    
    store.setAILoading(true);
    
    try {
      const { keywords, accounts } = await getAISuggestions(rawMemo);
      
      store.setExtractedKeywords(keywords.map((k) => ({
        keyword: k.keyword,
        confidence: k.confidence,
        source: k.source as 'extracted' | 'pattern' | 'ai',
      })));
      
      store.setSuggestedAccounts(accounts.map((a) => ({
        account: a.account,
        sub_account: a.sub_account,
        tax_code: a.tax_code,
        confidence: a.confidence,
        reasoning: a.reasoning,
      })));
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
    } finally {
      store.setAILoading(false);
    }
  }, []);
  
  // ============================================================
  // 初回ロード
  // ============================================================
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;
    
    loadTransactions();
    loadRules();
  }, []);
  
  // ============================================================
  // フィルター変更時にリロード
  // ============================================================
  useEffect(() => {
    if (!initialLoadRef.current) return;
    loadTransactions();
  }, [store.filter.status, store.filter.sourceName]);
  
  // ============================================================
  // 取引選択時にAIサジェスション取得
  // ============================================================
  useEffect(() => {
    if (store.selectedTransaction?.raw_memo) {
      fetchAISuggestions(store.selectedTransaction.raw_memo);
    }
  }, [store.selectedTransactionId]);
  
  return {
    // State
    transactions: store.transactions,
    transactionsLoading: store.transactionsLoading,
    transactionsError: store.transactionsError,
    transactionStats: store.transactionStats,
    
    rules: store.rules,
    rulesLoading: store.rulesLoading,
    rulesError: store.rulesError,
    
    selectedTransaction: store.selectedTransaction,
    draftRule: store.draftRule,
    extractedKeywords: store.extractedKeywords,
    suggestedAccounts: store.suggestedAccounts,
    aiLoading: store.aiLoading,
    isCreatingRule: store.isCreatingRule,
    isApplyingRules: store.isApplyingRules,
    
    filter: store.filter,
    
    // Actions
    loadTransactions,
    loadRules,
    saveRule,
    applyRulesToPendingTransactions,
    fetchAISuggestions,
    
    selectTransaction: store.selectTransaction,
    setFilter: store.setFilter,
    resetFilter: store.resetFilter,
    
    updateDraftRule: store.updateDraftRule,
    selectKeyword: store.selectKeyword,
    selectAccount: store.selectAccount,
    cancelCreatingRule: store.cancelCreatingRule,
  };
}
