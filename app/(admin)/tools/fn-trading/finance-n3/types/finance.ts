// app/tools/finance-n3/types/finance.ts
/**
 * Finance N3 型定義
 * 会計・記帳・経費管理の型
 */

// 仕訳ステータス
export type JournalStatus = 'draft' | 'pending' | 'approved' | 'rejected';

// 勘定科目
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

// 仕訳エントリ
export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  debitAccount: string;
  debitAmount: number;
  creditAccount: string;
  creditAmount: number;
  status: JournalStatus;
  createdBy: string;
  approvedBy?: string;
  tags?: string[];
  attachments?: string[];
}

// 経費カテゴリ
export interface ExpenseCategory {
  id: string;
  name: string;
  parentId?: string;
  budget?: number;
  color: string;
}

// 経費エントリ
export interface ExpenseEntry {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  vendor?: string;
  receipt?: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: 'cash' | 'card' | 'transfer' | 'other';
}

// 利益計算
export interface ProfitCalculation {
  productId: string;
  sku: string;
  title: string;
  salePrice: number;
  costPrice: number;
  platformFee: number;
  shippingCost: number;
  otherCosts: number;
  grossProfit: number;
  margin: number;
}

// キャッシュフロー
export interface CashFlowItem {
  date: string;
  inflow: number;
  outflow: number;
  balance: number;
  category: string;
}

export interface CashFlowForecast {
  date: string;
  projectedInflow: number;
  projectedOutflow: number;
  projectedBalance: number;
  confidence: number;
}

// 古物台帳
export interface KobutsuEntry {
  id: string;
  date: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  supplierName: string;
  supplierAddress?: string;
  supplierType: 'individual' | 'business';
  idVerification: boolean;
  notes?: string;
}

// レポート
export interface FinanceReport {
  id: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'custom';
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  generatedAt: string;
}

// 統計
export interface FinanceStats {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingJournals: number;
  pendingExpenses: number;
  cashBalance: number;
}

// L3タブ
export type FinanceL3Tab =
  | 'journal'
  | 'expense'
  | 'profit'
  | 'cashflow'
  | 'kobutsu'
  | 'reports';

// ============================================================
// 統合フック用追加型定義
// ============================================================

// 仕訳エントリ（統合フック用）
export interface JournalEntryExtended {
  id: string;
  date: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  reference: string;
}

// 経費レコード（統合フック用）
export interface ExpenseRecord {
  id: string;
  date: string;
  category: 'shipping' | 'purchase' | 'platform' | 'other';
  amount: number;
  description: string;
  vendor: string;
  receipt?: string;
}

// 古物台帳レコード（統合フック用）
export interface KobutsuRecord {
  id: string;
  acquisitionDate: string;
  itemName: string;
  category: string;
  acquisitionPrice: number;
  sellerInfo: {
    name: string;
    address: string;
    idType: string;
  };
  itemDescription: string;
  status: 'in_stock' | 'sold';
}
