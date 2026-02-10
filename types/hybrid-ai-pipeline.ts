/**
 * N3 ハイブリッドAI監査パイプライン - 追加型定義
 * 
 * 作成日: 2025-01-16
 * 目的: SM選択機能、AI監査ステータス、通貨変換対応の型定義
 */

// =====================================================
// AI監査ステータス
// =====================================================

/**
 * AI監査ステータス
 * - pending: 初期状態（監査待ち）
 * - processing_batch: バッチ処理中（編集・出品ロック）
 * - warning: 要確認（出品前に警告表示）
 * - manual_check: 手動確認必須（出品ブロック）
 * - clear: 監査完了（出品可能）
 */
export type AiAuditStatus = 
  | 'pending'
  | 'processing_batch'
  | 'warning'
  | 'manual_check'
  | 'clear';

/**
 * AI監査レポート
 */
export interface AiAuditReport {
  vero?: VeroCheckResult;
  ruleEngine?: RuleEngineResult;
  aiAnalysis?: AiAnalysisResult;
  timestamp: string;
  batchId?: string;
}

export interface VeroCheckResult {
  riskLevel: 'block' | 'high' | 'medium' | 'low' | 'safe';
  detectedBrand?: string;
  reasons?: string[];
  patentRisk?: boolean;
}

export interface RuleEngineResult {
  score: number;
  overallSeverity: 'error' | 'warning' | 'ok';
  issues: AuditIssue[];
  autoFixSuggestions: AutoFixSuggestion[];
}

export interface AuditIssue {
  field: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  code: string;
}

export interface AutoFixSuggestion {
  field: string;
  currentValue: any;
  suggestedValue: any;
  confidence: number;
  reason: string;
}

export interface AiAnalysisResult {
  modelTier: 'flash_batch' | 'pro_batch' | 'pro_standard';
  confidence: number;
  suggestions: AiSuggestion[];
  rawResponse?: any;
}

export interface AiSuggestion {
  type: 'item_specific' | 'category' | 'price' | 'compliance';
  field?: string;
  value?: any;
  reason: string;
  confidence: number;
}

// =====================================================
// SM選択関連
// =====================================================

/**
 * SM選択された競合商品データ
 */
export interface SmSelectedItem {
  itemId: string;
  title: string;
  price: number;
  currency: string;
  categoryId?: string;
  categoryPath?: string;
  condition?: string;
  conditionDescription?: string;
  conditionDescriptors?: ConditionDescriptor[];
  itemSpecifics?: Record<string, string>;
  imageUrl?: string;
  seller?: {
    username: string;
    feedbackScore: number;
    feedbackPercentage?: number;
  };
  location?: {
    country: string;
    city?: string;
    postalCode?: string;
  };
  shippingCost?: number;
  itemWebUrl?: string;
  soldCount?: number;
  selectedAt: string;
  selectionType: 'exact' | 'reference';
}

export interface ConditionDescriptor {
  name: string;
  values: string[];
}

/**
 * SM選択API リクエスト
 */
export interface SmSelectionRequest {
  competitor: SmSelectedItem;
  selectionType: 'exact' | 'reference';
}

/**
 * SM選択API レスポンス
 */
export interface SmSelectionResponse {
  success: boolean;
  productId: number;
  selectionType: 'exact' | 'reference';
  itemSpecificsCopied: number;
  auditStatus: AiAuditStatus;
  auditScore: number;
  veroRisk: string;
  autoFixApplied: number;
  basePriceUsd?: number;
  safetyStatus: SafetyStatus;
  error?: string;
}

/**
 * 安全装置ステータス
 */
export interface SafetyStatus {
  /** バッチ処理中で編集がロックされているか */
  editLocked: boolean;
  /** 出品可能か */
  canPublish: boolean;
  /** 出品時に警告を表示する必要があるか */
  needsWarning: boolean;
  /** 出品がブロックされているか */
  isBlocked: boolean;
}

// =====================================================
// 通貨変換関連
// =====================================================

/**
 * マーケットプレイス通貨設定
 */
export interface MarketplaceCurrency {
  currency: string;
  symbol: string;
  rateKey: string;
}

/**
 * 通貨マップ
 */
export const CURRENCY_MAP: Record<string, MarketplaceCurrency> = {
  'EBAY_US': { currency: 'USD', symbol: '$', rateKey: 'USD' },
  'EBAY_UK': { currency: 'GBP', symbol: '£', rateKey: 'GBP' },
  'EBAY_DE': { currency: 'EUR', symbol: '€', rateKey: 'EUR' },
  'EBAY_AU': { currency: 'AUD', symbol: 'A$', rateKey: 'AUD' },
  'EBAY_CA': { currency: 'CAD', symbol: 'C$', rateKey: 'CAD' },
  'EBAY_IT': { currency: 'EUR', symbol: '€', rateKey: 'EUR' },
  'EBAY_FR': { currency: 'EUR', symbol: '€', rateKey: 'EUR' },
  'EBAY_ES': { currency: 'EUR', symbol: '€', rateKey: 'EUR' },
};

/**
 * 為替レートキャッシュ
 */
export interface ExchangeRateCache {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  updatedAt: string;
}

/**
 * 価格変換結果
 */
export interface ConvertedPrice {
  price: number;
  currency: string;
  symbol: string;
  originalPrice: number;
  originalCurrency: string;
  rate: number;
}

// =====================================================
// AI監査バッチ関連
// =====================================================

/**
 * バッチジョブステータス
 */
export type BatchStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * モデルティア
 */
export type ModelTier = 'flash_batch' | 'pro_batch' | 'pro_standard';

/**
 * AI監査バッチ
 */
export interface AiAuditBatch {
  id: number;
  batchId: string;
  status: BatchStatus;
  totalItems: number;
  processedItems: number;
  failedItems: number;
  modelTier: ModelTier;
  jsonlFileUrl?: string;
  resultFileUrl?: string;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * バッチアイテム
 */
export interface AiAuditBatchItem {
  id: number;
  batchId: string;
  productId: number;
  requestIndex?: number;
  status: 'pending' | 'processed' | 'failed';
  result?: any;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// =====================================================
// カテゴリ必須項目キャッシュ
// =====================================================

/**
 * カテゴリ必須項目
 */
export interface EbayCategorySpecifics {
  id: number;
  categoryId: string;
  categoryName?: string;
  marketplaceId: string;
  requiredFields?: CategoryField[];
  recommendedFields?: CategoryField[];
  conditionSupported?: ConditionOption[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryField {
  name: string;
  type: 'text' | 'selection' | 'number';
  values?: string[];
  required: boolean;
  maxLength?: number;
}

export interface ConditionOption {
  conditionId: string;
  conditionDisplayName: string;
  conditionDescriptorConstraint?: any;
}

// =====================================================
// products_master 拡張インターフェース
// =====================================================

/**
 * products_master の追加カラム（既存の ProductsMaster を拡張）
 */
export interface ProductsMasterAiAuditExtension {
  // SM選択関連
  sm_selected_item?: SmSelectedItem | null;
  sm_selected_item_id?: string | null;
  sm_item_specifics_copied?: Record<string, string> | null;
  sm_avg_sold_price?: number | null;
  sm_demand_score?: number | null;
  
  // AI監査関連
  ai_audit_status?: AiAuditStatus;
  ai_audit_report?: AiAuditReport | null;
  ai_confidence_score?: number | null;
  ai_audit_needs_review?: boolean;
  
  // 通貨変換関連
  base_price_usd?: number | null;
  copied_price_currency?: string | null;
  copied_price_marketplace?: string | null;
}

// =====================================================
// Get Item API 関連
// =====================================================

/**
 * Get Item API レスポンス
 */
export interface GetItemDetailsResponse {
  success: boolean;
  itemId: string;
  title: string;
  categoryId?: string;
  categoryPath?: string;
  condition?: string;
  conditionDescription?: string;
  conditionDescriptors?: ConditionDescriptor[];
  itemSpecifics: Record<string, string>;
  originCountry?: string | null;
  price: {
    value: number;
    currency: string;
  };
  seller?: {
    username: string;
    feedbackScore: number;
    feedbackPercentage?: number;
  };
  image?: {
    imageUrl: string;
  };
  itemLocation?: {
    country: string;
    city?: string;
    postalCode?: string;
  };
  error?: string;
}

// =====================================================
// eBay配送ポリシー拡張
// =====================================================

/**
 * ebay_shipping_policies の追加カラム
 */
export interface EbayShippingPolicyExtension {
  marketplace_id?: string;
}

// =====================================================
// ユーティリティ型
// =====================================================

/**
 * 出品ボタンの表示状態を判定
 */
export function getPublishButtonState(status: AiAuditStatus): {
  canPublish: boolean;
  buttonType: 'success' | 'warning' | 'disabled' | 'loading';
  message: string;
} {
  switch (status) {
    case 'clear':
      return {
        canPublish: true,
        buttonType: 'success',
        message: '出品可能',
      };
    case 'warning':
      return {
        canPublish: true,
        buttonType: 'warning',
        message: '警告あり - 確認して出品',
      };
    case 'processing_batch':
      return {
        canPublish: false,
        buttonType: 'loading',
        message: 'AI監査処理中...',
      };
    case 'manual_check':
      return {
        canPublish: false,
        buttonType: 'disabled',
        message: '手動確認必須',
      };
    case 'pending':
    default:
      return {
        canPublish: false,
        buttonType: 'disabled',
        message: '監査待ち',
      };
  }
}

/**
 * 安全装置ステータスを取得
 */
export function getSafetyStatus(status: AiAuditStatus): SafetyStatus {
  return {
    editLocked: status === 'processing_batch',
    canPublish: status === 'clear',
    needsWarning: status === 'warning',
    isBlocked: status === 'manual_check' || status === 'processing_batch',
  };
}
