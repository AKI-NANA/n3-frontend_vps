// app/tools/finance-n3/hooks/use-finance-integrated.ts
/**
 * Finance N3 統合フック
 *
 * ゴールドスタンダード準拠:
 * - Domain State: React Query (サーバーデータ)
 * - UI State: Zustand (フィルター、選択、ページネーション)
 * - 統合フックでマージして単一インターフェースを提供
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import {
  useFinanceUIStore,
  useFinanceActiveTab,
  useFinanceJournalStatus,
  useFinanceJournalPage,
  useFinanceSelectedJournalIds,
  useFinanceExpenseCategory,
  useFinanceKobutsuSearch,
  useFinanceCurrency,
  type FinanceTabId,
  type JournalStatus,
  type ExpenseCategory,
} from '@/store/n3';
import type {
  JournalEntry,
  ExpenseRecord,
  KobutsuRecord,
  FinanceStats,
} from '../types/finance';

// ============================================================
// API関数
// ============================================================

interface FetchJournalParams {
  status: JournalStatus;
  page: number;
  pageSize: number;
  dateRange?: { start: string; end: string } | null;
}

interface FetchJournalResponse {
  entries: JournalEntry[];
  total: number;
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    totalDebit: number;
    totalCredit: number;
  };
}

async function fetchJournalEntries(params: FetchJournalParams): Promise<FetchJournalResponse> {
  // 実API呼び出し: /api/accounting/journal-entries
  const queryParams = new URLSearchParams({
    limit: String(params.pageSize),
  });

  if (params.status && params.status !== 'all') {
    queryParams.set('status', params.status);
  }
  if (params.dateRange?.start) {
    queryParams.set('dateFrom', params.dateRange.start);
  }
  if (params.dateRange?.end) {
    queryParams.set('dateTo', params.dateRange.end);
  }

  const response = await fetch(`/api/accounting/journal-entries?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch journal entries');
  }

  const json = await response.json();
  if (!json.success) {
    throw new Error(json.message || 'API returned error');
  }

  // APIレスポンスをJournalEntry形式に変換
  const allEntries: JournalEntry[] = (json.data || []).map((entry: any) => ({
    id: String(entry.id),
    date: entry.date || new Date().toISOString().split('T')[0],
    debitAccount: entry.debit_account || entry.account_title || '不明',
    creditAccount: entry.credit_account || entry.account_title || '不明',
    amount: entry.amount || entry.debit_amount || entry.credit_amount || 0,
    description: entry.description || entry.remarks || '',
    status: mapJournalStatus(entry),
    createdBy: entry.created_by || 'system',
    createdAt: entry.created_at || new Date().toISOString(),
    reference: entry.reference_id || entry.source_id || '',
  }));

  const filtered = params.status === 'all'
    ? allEntries
    : allEntries.filter(e => e.status === params.status);

  const start = (params.page - 1) * params.pageSize;
  const entries = filtered.slice(start, start + params.pageSize);

  return {
    entries,
    total: filtered.length,
    stats: {
      pending: allEntries.filter(e => e.status === 'pending').length,
      approved: allEntries.filter(e => e.status === 'approved').length,
      rejected: allEntries.filter(e => e.status === 'rejected').length,
      totalDebit: allEntries.reduce((sum, e) => sum + e.amount, 0),
      totalCredit: allEntries.reduce((sum, e) => sum + e.amount, 0),
    },
  };
}

// 仕訳ステータスマッピング
function mapJournalStatus(entry: any): 'pending' | 'approved' | 'rejected' {
  if (entry.mf_journal_id) return 'approved';
  if (entry.is_verified) return 'approved';
  return 'pending';
}

interface FetchExpensesParams {
  category: ExpenseCategory;
  page: number;
  dateRange?: { start: string; end: string } | null;
}

interface FetchExpensesResponse {
  records: ExpenseRecord[];
  total: number;
  byCategory: Record<string, number>;
}

async function fetchExpenses(params: FetchExpensesParams): Promise<FetchExpensesResponse> {
  // 実API呼び出し: /api/accounting/expense-breakdown
  const response = await fetch('/api/accounting/expense-breakdown');
  let expenseData: any = null;

  if (response.ok) {
    const json = await response.json();
    if (json.success) {
      expenseData = json.data;
    }
  }

  const allRecords: ExpenseRecord[] = [];
  const byCategory: Record<string, number> = {
    shipping: 0,
    purchase: 0,
    platform: 0,
    other: 0,
  };

  if (expenseData?.breakdown) {
    Object.entries(expenseData.breakdown).forEach(([category, data]: [string, any]) => {
      const mappedCategory = mapExpenseCategory(category);
      byCategory[mappedCategory] = (byCategory[mappedCategory] || 0) + (data.total || 0);

      if (data.items) {
        data.items.forEach((item: any, i: number) => {
          allRecords.push({
            id: `expense-${category}-${i}`,
            date: item.date || new Date().toISOString().split('T')[0],
            category: mappedCategory as 'shipping' | 'purchase' | 'platform' | 'other',
            amount: item.amount || 0,
            description: item.description || category,
            vendor: item.vendor || '不明',
            receipt: item.receipt_url,
          });
        });
      }
    });
  }

  const filtered = params.category === 'all'
    ? allRecords
    : allRecords.filter(r => r.category === params.category);

  return {
    records: filtered.slice(0, 20),
    total: filtered.length,
    byCategory,
  };
}

function mapExpenseCategory(category: string): 'shipping' | 'purchase' | 'platform' | 'other' {
  const categoryMap: Record<string, 'shipping' | 'purchase' | 'platform' | 'other'> = {
    '送料': 'shipping',
    'shipping': 'shipping',
    '運送費': 'shipping',
    '仕入': 'purchase',
    'purchase': 'purchase',
    '仕入高': 'purchase',
    '手数料': 'platform',
    'platform': 'platform',
    'プラットフォーム': 'platform',
  };
  return categoryMap[category] || 'other';
}

interface FetchKobutsuParams {
  search: string;
  page: number;
  dateRange?: { start: string; end: string } | null;
}

interface FetchKobutsuResponse {
  records: KobutsuRecord[];
  total: number;
}

async function fetchKobutsu(params: FetchKobutsuParams): Promise<FetchKobutsuResponse> {
  // 実API呼び出し: /api/kobutsu/ledger
  const queryParams = new URLSearchParams();
  if (params.search) {
    queryParams.set('supplierName', params.search);
  }
  if (params.dateRange?.start) {
    queryParams.set('dateFrom', params.dateRange.start);
  }
  if (params.dateRange?.end) {
    queryParams.set('dateTo', params.dateRange.end);
  }

  const response = await fetch(`/api/kobutsu/ledger?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch kobutsu ledger');
  }

  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error || 'API returned error');
  }

  const allRecords: KobutsuRecord[] = (json.data || []).map((entry: any) => ({
    id: String(entry.id),
    acquisitionDate: entry.acquisition_date || new Date().toISOString().split('T')[0],
    itemName: entry.item_name || entry.product_name || '不明',
    category: entry.category || entry.item_category || '不明',
    acquisitionPrice: entry.acquisition_price || entry.purchase_price || 0,
    sellerInfo: {
      name: entry.supplier_name || '不明',
      address: entry.supplier_address || '',
      idType: entry.id_verification_type || '不明',
    },
    itemDescription: entry.item_description || entry.remarks || '',
    status: entry.status === 'sold' ? 'sold' : 'in_stock',
  }));

  const filtered = params.search
    ? allRecords.filter(r =>
        r.itemName.includes(params.search) ||
        r.category.includes(params.search) ||
        r.sellerInfo.name.includes(params.search)
      )
    : allRecords;

  const pageSize = 20;
  const start = (params.page - 1) * pageSize;

  return {
    records: filtered.slice(start, start + pageSize),
    total: filtered.length,
  };
}

async function approveJournalEntries(ids: string[]): Promise<void> {
  // 実API呼び出し: /api/accounting/journal-entries (PUT)
  const response = await fetch('/api/accounting/journal-entries', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids,
      action: 'approve',
    }),
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(json.message || 'Failed to approve entries');
  }
}

async function rejectJournalEntries(ids: string[], reason: string): Promise<void> {
  // 実API呼び出し: /api/accounting/journal-entries (PUT)
  const response = await fetch('/api/accounting/journal-entries', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ids,
      action: 'unapprove',
      reason,
    }),
  });

  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error(json.message || 'Failed to reject entries');
  }
}

// ============================================================
// 統合フック
// ============================================================

export function useFinanceIntegrated() {
  const queryClient = useQueryClient();

  // ===== UI State (Zustand) =====
  const activeTab = useFinanceActiveTab();
  const journalStatus = useFinanceJournalStatus();
  const journalPage = useFinanceJournalPage();
  const selectedJournalIds = useFinanceSelectedJournalIds();
  const expenseCategory = useFinanceExpenseCategory();
  const kobutsuSearch = useFinanceKobutsuSearch();
  const currency = useFinanceCurrency();

  // ===== UI Actions =====
  const store = useFinanceUIStore();
  const {
    setActiveTab,
    setJournalStatus,
    setJournalDateRange,
    setJournalPage,
    selectJournal,
    clearJournalSelection,
    setExpenseCategory,
    setExpenseDateRange,
    setExpensePage,
    selectExpense,
    clearExpenseSelection,
    setKobutsuDateRange,
    setKobutsuSearch,
    setKobutsuPage,
    selectKobutsu,
    clearKobutsuSelection,
    toggleShowApprovedOnly,
    toggleAutoRefresh,
    setCurrency,
    reset,
  } = store;

  // ===== Domain State (React Query) =====

  // 仕訳データ
  const journalQuery = useQuery({
    queryKey: ['finance', 'journal', journalStatus, journalPage],
    queryFn: () => fetchJournalEntries({
      status: journalStatus,
      page: journalPage,
      pageSize: 50,
    }),
    enabled: activeTab === 'journal',
    staleTime: 30 * 1000,
  });

  // 経費データ
  const expenseQuery = useQuery({
    queryKey: ['finance', 'expense', expenseCategory],
    queryFn: () => fetchExpenses({
      category: expenseCategory,
      page: 1,
    }),
    enabled: activeTab === 'expense',
    staleTime: 30 * 1000,
  });

  // 古物台帳データ
  const kobutsuQuery = useQuery({
    queryKey: ['finance', 'kobutsu', kobutsuSearch],
    queryFn: () => fetchKobutsu({
      search: kobutsuSearch,
      page: 1,
    }),
    enabled: activeTab === 'kobutsu',
    staleTime: 30 * 1000,
  });

  // ===== Mutations =====
  const approveMutation = useMutation({
    mutationFn: approveJournalEntries,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'journal'] });
      clearJournalSelection();
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ ids, reason }: { ids: string[]; reason: string }) =>
      rejectJournalEntries(ids, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', 'journal'] });
      clearJournalSelection();
    },
  });

  // ===== マージされたデータ =====
  const journalEntries = useMemo(() => journalQuery.data?.entries ?? [], [journalQuery.data]);
  const journalStats = useMemo(() => journalQuery.data?.stats ?? null, [journalQuery.data]);
  const journalTotal = journalQuery.data?.total ?? 0;

  const expenseRecords = useMemo(() => expenseQuery.data?.records ?? [], [expenseQuery.data]);
  const expenseByCategory = useMemo(() => expenseQuery.data?.byCategory ?? {}, [expenseQuery.data]);
  const expenseTotal = expenseQuery.data?.total ?? 0;

  const kobutsuRecords = useMemo(() => kobutsuQuery.data?.records ?? [], [kobutsuQuery.data]);
  const kobutsuTotal = kobutsuQuery.data?.total ?? 0;

  // ===== コールバック =====
  const handleApprove = useCallback(() => {
    if (selectedJournalIds.length === 0) return;
    approveMutation.mutate(selectedJournalIds);
  }, [selectedJournalIds, approveMutation]);

  const handleReject = useCallback((reason: string) => {
    if (selectedJournalIds.length === 0) return;
    rejectMutation.mutate({ ids: selectedJournalIds, reason });
  }, [selectedJournalIds, rejectMutation]);

  const formatCurrency = useCallback((value: number) => {
    if (currency === 'USD') {
      return `$${(value / 150).toFixed(2)}`;
    }
    return `¥${value.toLocaleString()}`;
  }, [currency]);

  const handleRefresh = useCallback(() => {
    if (activeTab === 'journal') journalQuery.refetch();
    if (activeTab === 'expense') expenseQuery.refetch();
    if (activeTab === 'kobutsu') kobutsuQuery.refetch();
  }, [activeTab, journalQuery, expenseQuery, kobutsuQuery]);

  // ===== 返却値 =====
  return {
    // 仕訳データ
    journalEntries,
    journalStats,
    journalTotal,
    journalStatus,
    journalPage,
    selectedJournalIds,

    // 経費データ
    expenseRecords,
    expenseByCategory,
    expenseTotal,
    expenseCategory,

    // 古物台帳データ
    kobutsuRecords,
    kobutsuTotal,
    kobutsuSearch,

    // UI状態
    activeTab,
    currency,

    // ローディング・エラー
    isLoading: journalQuery.isLoading || expenseQuery.isLoading || kobutsuQuery.isLoading,
    isFetching: journalQuery.isFetching || expenseQuery.isFetching || kobutsuQuery.isFetching,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    error: (
      journalQuery.error instanceof Error ? journalQuery.error.message :
      expenseQuery.error instanceof Error ? expenseQuery.error.message :
      kobutsuQuery.error instanceof Error ? kobutsuQuery.error.message : null
    ),

    // アクション
    setActiveTab,
    setJournalStatus,
    setJournalDateRange,
    setJournalPage,
    selectJournal,
    clearJournalSelection,
    setExpenseCategory,
    setExpenseDateRange,
    setExpensePage,
    selectExpense,
    clearExpenseSelection,
    setKobutsuDateRange,
    setKobutsuSearch,
    setKobutsuPage,
    selectKobutsu,
    clearKobutsuSelection,
    toggleShowApprovedOnly,
    toggleAutoRefresh,
    setCurrency,
    reset,

    // 仕訳操作
    approveEntries: handleApprove,
    rejectEntries: handleReject,

    // ユーティリティ
    formatCurrency,
    refresh: handleRefresh,
  };
}

export default useFinanceIntegrated;
