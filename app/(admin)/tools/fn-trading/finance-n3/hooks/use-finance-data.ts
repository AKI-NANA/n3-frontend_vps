// app/tools/finance-n3/hooks/use-finance-data.ts
/**
 * Finance N3 データフック
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  JournalEntry,
  ExpenseEntry,
  CashFlowItem,
  KobutsuEntry,
  FinanceStats,
} from '../types/finance';

// モック仕訳データ
const mockJournals: JournalEntry[] = Array.from({ length: 20 }, (_, i) => ({
  id: `journal-${i + 1}`,
  date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  description: `取引 ${i + 1} - ${['売上', '仕入', '経費', '振替'][i % 4]}`,
  debitAccount: ['売掛金', '仕入', '広告宣伝費', '現金'][i % 4],
  debitAmount: Math.floor(Math.random() * 100000) + 10000,
  creditAccount: ['売上', '買掛金', '現金', '売掛金'][i % 4],
  creditAmount: Math.floor(Math.random() * 100000) + 10000,
  status: (['draft', 'pending', 'approved', 'rejected'] as const)[i % 4],
  createdBy: 'user@example.com',
  tags: ['月次', i % 2 === 0 ? 'eBay' : 'Amazon'],
}));

// モック経費データ
const mockExpenses: ExpenseEntry[] = Array.from({ length: 15 }, (_, i) => ({
  id: `expense-${i + 1}`,
  date: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  category: ['広告費', '送料', '梱包材', '通信費', '消耗品'][i % 5],
  amount: Math.floor(Math.random() * 50000) + 1000,
  description: `経費 ${i + 1}`,
  vendor: ['Google', 'ヤマト運輸', 'Amazon', 'NTT', 'ダイソー'][i % 5],
  status: (['pending', 'approved', 'rejected'] as const)[i % 3],
  paymentMethod: (['cash', 'card', 'transfer'] as const)[i % 3],
}));

// モック古物台帳
const mockKobutsu: KobutsuEntry[] = Array.from({ length: 10 }, (_, i) => ({
  id: `kobutsu-${i + 1}`,
  date: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  itemName: `商品 ${i + 1}`,
  category: ['バッグ', '時計', 'ジュエリー', '衣類', '家電'][i % 5],
  quantity: Math.floor(Math.random() * 5) + 1,
  unitPrice: Math.floor(Math.random() * 30000) + 5000,
  totalAmount: 0,
  supplierName: `供給者 ${i + 1}`,
  supplierType: i % 2 === 0 ? 'individual' : 'business',
  idVerification: true,
}));

export function useFinanceData() {
  const [journals, setJournals] = useState<JournalEntry[]>(mockJournals);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(mockExpenses);
  const [kobutsu, setKobutsu] = useState<KobutsuEntry[]>(mockKobutsu);
  const [loading, setLoading] = useState(false);

  // 統計
  const stats: FinanceStats = useMemo(() => ({
    totalRevenue: journals
      .filter(j => j.status === 'approved' && j.creditAccount === '売上')
      .reduce((sum, j) => sum + j.creditAmount, 0),
    totalExpenses: expenses
      .filter(e => e.status === 'approved')
      .reduce((sum, e) => sum + e.amount, 0),
    netProfit: 0,
    pendingJournals: journals.filter(j => j.status === 'pending').length,
    pendingExpenses: expenses.filter(e => e.status === 'pending').length,
    cashBalance: 1250000,
  }), [journals, expenses]);

  // 仕訳操作
  const approveJournal = useCallback((id: string) => {
    setJournals(prev =>
      prev.map(j => (j.id === id ? { ...j, status: 'approved' as const } : j))
    );
  }, []);

  const rejectJournal = useCallback((id: string) => {
    setJournals(prev =>
      prev.map(j => (j.id === id ? { ...j, status: 'rejected' as const } : j))
    );
  }, []);

  // 経費操作
  const approveExpense = useCallback((id: string) => {
    setExpenses(prev =>
      prev.map(e => (e.id === id ? { ...e, status: 'approved' as const } : e))
    );
  }, []);

  const rejectExpense = useCallback((id: string) => {
    setExpenses(prev =>
      prev.map(e => (e.id === id ? { ...e, status: 'rejected' as const } : e))
    );
  }, []);

  // リフレッシュ
  const refresh = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
  }, []);

  return {
    journals,
    expenses,
    kobutsu,
    stats,
    approveJournal,
    rejectJournal,
    approveExpense,
    rejectExpense,
    loading,
    refresh,
  };
}

export default useFinanceData;
