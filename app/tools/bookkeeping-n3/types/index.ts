// app/tools/bookkeeping-n3/types/index.ts
/**
 * N3 記帳オートメーション - 型定義
 */

// ============================================================
// Raw Transaction (生データ)
// ============================================================

export type TransactionStatus = 'pending' | 'simulated' | 'submitted' | 'ignored';
export type SourceType = 'BANK' | 'CREDIT_CARD';

export interface RawTransaction {
  id: string;
  mf_transaction_id?: string;
  account_id?: string;
  source_name: string;
  source_type: SourceType;
  transaction_date: string;
  raw_memo: string;
  amount: number;
  status: TransactionStatus;
  
  // ルール適用結果
  matched_rule_id?: string;
  simulated_debit_account?: string;
  simulated_credit_account?: string;
  simulated_tax_code?: string;
  confidence_score?: number;
  
  // MF送信結果
  mf_journal_id?: string;
  submitted_at?: string;
  
  // メタデータ
  created_at: string;
  updated_at: string;
}

// ============================================================
// Bookkeeping Rule (記帳ルール)
// ============================================================

export type RuleMatchType = 'partial' | 'exact' | 'regex';
export type RuleStatus = 'active' | 'draft' | 'archived';

export interface BookkeepingRule {
  id: string;
  rule_name: string;
  rule_description?: string;
  
  // マッチング条件
  keyword: string;
  match_type: RuleMatchType;
  source_name_filter?: string;
  amount_min?: number;
  amount_max?: number;
  
  // 記帳設定
  target_category: string;
  target_sub_category?: string;
  tax_code: string;
  
  // 優先度・状態
  priority: number;
  status: RuleStatus;
  
  // AI生成情報
  ai_confidence_score?: number;
  ai_generation_prompt?: string;
  
  // 使用統計
  applied_count: number;
  last_applied_at?: string;
  
  // メタデータ
  created_at: string;
  updated_at: string;
}

// ============================================================
// 勘定科目・税区分
// ============================================================

export interface Account {
  id: string;
  mf_account_id?: string;
  account_name: string;
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parent_id?: string;
  display_order: number;
  is_active: boolean;
}

export interface TaxCode {
  id: string;
  code: string;
  name: string;
  rate: number;
  is_active: boolean;
  display_order: number;
}

// ============================================================
// UI State (Zustand Store)
// ============================================================

export interface BookkeepingUIState {
  // 左パネル: 取引リスト
  selectedTransactionId: string | null;
  transactionFilter: {
    status: TransactionStatus | 'all';
    sourceName: string | 'all';
    dateFrom?: string;
    dateTo?: string;
    searchKeyword: string;
  };
  
  // 右パネル: ルール作成
  isCreatingRule: boolean;
  draftRule: Partial<BookkeepingRule> | null;
  extractedKeywords: string[];
  suggestedAccounts: { account: string; confidence: number }[];
  
  // モーダル状態
  showAIAssistModal: boolean;
  showBulkApplyModal: boolean;
  showMFSyncModal: boolean;
}

// ============================================================
// API Response Types
// ============================================================

export interface TransactionListResponse {
  success: boolean;
  data: {
    transactions: RawTransaction[];
    total: number;
    page: number;
    pageSize: number;
  };
  stats: {
    pending: number;
    simulated: number;
    submitted: number;
    ignored: number;
  };
}

export interface RuleListResponse {
  success: boolean;
  data: {
    rules: BookkeepingRule[];
    total: number;
  };
}

export interface RuleApplyResult {
  success: boolean;
  data: {
    applied_count: number;
    transactions: RawTransaction[];
  };
  error?: string;
}

export interface MFSyncResult {
  success: boolean;
  data: {
    synced_count: number;
    submitted_count: number;
    failed_count: number;
    errors: { transaction_id: string; error: string }[];
  };
}

// ============================================================
// AI Suggestion Types
// ============================================================

export interface AIKeywordSuggestion {
  keyword: string;
  confidence: number;
  source: 'extracted' | 'pattern' | 'ai';
}

export interface AIAccountSuggestion {
  account: string;
  sub_account?: string;
  tax_code: string;
  confidence: number;
  reasoning: string;
}

export interface AISuggestionResponse {
  success: boolean;
  data: {
    keywords: AIKeywordSuggestion[];
    accounts: AIAccountSuggestion[];
    raw_memo: string;
  };
}
