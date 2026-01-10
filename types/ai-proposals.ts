// ========================================
// 統一AIメッセージハブ - 型定義
// 作成日: 2025-11-26
// 目的: AI提案（出品、画像生成、税務コンプライアンス等）の統合管理
// ========================================

/**
 * AI提案のタイプ
 */
export type AIProposalType =
  | 'LISTING'              // 出品提案
  | 'IMAGE_GENERATION'     // 画像生成ログ
  | 'COMPLIANCE'           // 税務コンプライアンス提案
  | 'PRICING'              // 価格最適化提案
  | 'INVENTORY'            // 在庫最適化提案
  | 'MARKET_RESEARCH';     // マーケットリサーチ提案

/**
 * AI提案のステータス
 */
export type AIProposalStatus =
  | 'PENDING'              // 承認待ち
  | 'APPROVED'             // 承認済み
  | 'REJECTED'             // 却下
  | 'COMPLETED'            // 完了
  | 'EXPIRED';             // 期限切れ

/**
 * AI提案の優先度
 */
export type AIProposalPriority =
  | 'URGENT'               // 緊急（赤色）
  | 'HIGH'                 // 高（オレンジ色）
  | 'MEDIUM'               // 中（黄色）
  | 'LOW';                 // 低（緑色）

/**
 * 統一AI提案インターフェース
 */
export interface AIProposal {
  /** 提案ID */
  id: string;

  /** 提案タイプ */
  type: AIProposalType;

  /** 提案ステータス */
  status: AIProposalStatus;

  /** 優先度 */
  priority: AIProposalPriority;

  /** タイトル */
  title: string;

  /** 説明 */
  description: string;

  /** 詳細データ（JSON） */
  data: Record<string, any>;

  /** 提案元（AI_ENGINE, COMPLIANCE_MONITOR, etc.） */
  source: string;

  /** 関連受注ID・商品ID（オプション） */
  relatedOrderId?: string;
  relatedProductId?: string;
  relatedInvoiceGroupId?: string;

  /** 提案日時 */
  createdAt: Date;

  /** 更新日時 */
  updatedAt: Date;

  /** 承認・却下日時 */
  processedAt?: Date;

  /** 承認・却下者 */
  processedBy?: string;

  /** 承認・却下理由 */
  processedReason?: string;

  /** 期限（オプション） */
  expiresAt?: Date;

  /** AI信頼度スコア（0.0 ~ 1.0） */
  confidenceScore?: number;
}

/**
 * 出品提案の詳細データ
 */
export interface ListingProposalData {
  /** 商品SKU */
  sku: string;

  /** 推奨タイトル */
  suggestedTitle: string;

  /** 推奨価格（USD） */
  suggestedPrice: number;

  /** 推奨カテゴリー */
  suggestedCategory: string;

  /** 推奨画像URL */
  suggestedImages: string[];

  /** 推奨タグ */
  suggestedTags: string[];

  /** 競合分析データ */
  competitorAnalysis?: {
    averagePrice: number;
    topSellerPrice: number;
    marketDemand: string;
  };
}

/**
 * 画像生成ログの詳細データ
 */
export interface ImageGenerationLogData {
  /** 生成画像URL */
  generatedImageUrl: string;

  /** プロンプト */
  prompt: string;

  /** 使用モデル */
  model: string;

  /** 生成時間（秒） */
  generationTime: number;

  /** 商品SKU */
  sku?: string;
}

/**
 * 税務コンプライアンス提案の詳細データ
 */
export interface ComplianceProposalData {
  /** 請求書グループID */
  invoiceGroupId: string;

  /** 未紐付け受注IDリスト */
  unlinkedOrderIds: string[];

  /** 推奨送料按分 */
  suggestedCostAllocation: {
    [orderId: string]: number;
  };

  /** 請求書総額 */
  totalCost: number;

  /** アラートメッセージ */
  alertMessage: string;
}

/**
 * 価格最適化提案の詳細データ
 */
export interface PricingProposalData {
  /** 商品SKU */
  sku: string;

  /** 現在価格 */
  currentPrice: number;

  /** 推奨価格 */
  suggestedPrice: number;

  /** 価格変更理由 */
  reason: string;

  /** 予測利益率の変化 */
  expectedProfitChange: number;
}

/**
 * AI提案フィルタリング条件
 */
export interface AIProposalFilter {
  type?: AIProposalType[];
  status?: AIProposalStatus[];
  priority?: AIProposalPriority[];
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

/**
 * AI提案統計情報
 */
export interface AIProposalStats {
  totalProposals: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  completedCount: number;
  urgentCount: number;
  highPriorityCount: number;
  averageConfidenceScore: number;
  byType: {
    [key in AIProposalType]: number;
  };
}

/**
 * AI提案アクションリクエスト
 */
export interface AIProposalActionRequest {
  proposalId: string;
  action: 'APPROVE' | 'REJECT';
  reason?: string;
  processedBy: string;
}

/**
 * AI提案作成リクエスト
 */
export interface CreateAIProposalRequest {
  type: AIProposalType;
  priority: AIProposalPriority;
  title: string;
  description: string;
  data: Record<string, any>;
  source: string;
  relatedOrderId?: string;
  relatedProductId?: string;
  relatedInvoiceGroupId?: string;
  expiresAt?: Date;
  confidenceScore?: number;
}
