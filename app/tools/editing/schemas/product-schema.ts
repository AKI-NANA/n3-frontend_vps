// app/tools/editing/schemas/product-schema.ts
/**
 * Product Zod スキーマ定義
 * 
 * 機能:
 * - 入力バリデーション
 * - 型の自動推論
 * - フォームバリデーション（React Hook Form連携）
 * 
 * 設計原則:
 * - types/product.ts の型定義と同期
 * - スキーマから型を推論（z.infer）
 * - 再利用可能なサブスキーマ
 */

import { z } from 'zod';

// ============================================================
// 基本型スキーマ
// ============================================================

/** ISO 8601 日時文字列 */
export const ISODateStringSchema = z.string().datetime().optional();

/** 商品ID */
export const ProductIdSchema = z.union([z.string(), z.number()]);

/** 通貨コード */
export const CurrencyCodeSchema = z.enum(['JPY', 'USD', 'EUR', 'GBP']);

/** 商品タイプ */
export const ProductTypeSchema = z.enum(['stock', 'dropship', 'set', 'unclassified']);

/** ワークフローステータス */
export const WorkflowStatusSchema = z.enum([
  'draft',
  'pending_review',
  'approved',
  'rejected',
  'listed',
  'ended',
  'archived',
]);

/** 出品ステータス */
export const ListingStatusSchema = z.enum([
  'draft',
  'pending_approval',
  'active',
  'ended',
  'delisted',
  'error',
]);

/** フィルターステータス */
export const FilterStatusSchema = z.enum(['passed', 'failed', 'pending', 'skipped']);

/** HTS精度レベル */
export const HTSConfidenceSchema = z.enum(['uncertain', 'low', 'medium', 'high']);

/** VEROリスクレベル */
export const VeroRiskLevelSchema = z.enum(['none', 'low', 'medium', 'high', 'blocked']);

/** マーケットプレイス */
export const MarketplaceSchema = z.enum(['ebay', 'shopee', 'shopify', 'amazon', 'mercari']);

/** 商品コンディション */
export const ProductConditionSchema = z.enum([
  'new',
  'like_new',
  'very_good',
  'good',
  'acceptable',
  'for_parts',
]);

// ============================================================
// サブスキーマ（ネストされたオブジェクト）
// ============================================================

/** 画像データ */
export const ProductImageSchema = z.object({
  url: z.string().url(),
  original: z.string().url().optional(),
  thumbnail: z.string().url().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  order: z.number().int().min(0).optional(),
  alt: z.string().optional(),
});

/** SellerMirror分析データ */
export const SellerMirrorDataSchema = z.object({
  sales_count: z.number().int().min(0).optional(),
  lowest_price: z.number().min(0).optional(),
  average_price: z.number().min(0).optional(),
  highest_price: z.number().min(0).optional(),
  competitor_count: z.number().int().min(0).optional(),
  profit_margin: z.number().optional(),
  profit_amount_usd: z.number().optional(),
  market_trend: z.enum(['rising', 'stable', 'declining']).optional(),
  fetched_at: ISODateStringSchema,
  raw_data: z.record(z.unknown()).optional(),
});

/** 競合分析データ */
export const CompetitorDataSchema = z.object({
  lowest_price: z.number().min(0).optional(),
  average_price: z.number().min(0).optional(),
  highest_price: z.number().min(0).optional(),
  count: z.number().int().min(0).optional(),
  listings: z.array(z.object({
    seller_id: z.string().optional(),
    price: z.number().min(0).optional(),
    condition: z.string().optional(),
    url: z.string().url().optional(),
  })).optional(),
});

/** リサーチデータ */
export const ResearchDataSchema = z.object({
  sold_count: z.number().int().min(0).optional(),
  competitor_count: z.number().int().min(0).optional(),
  lowest_price: z.number().min(0).optional(),
  average_price: z.number().min(0).optional(),
  profit_margin: z.number().optional(),
  profit_amount: z.number().optional(),
  completed: z.boolean().optional(),
  updated_at: ISODateStringSchema,
  raw_data: z.record(z.unknown()).optional(),
});

/** カテゴリ候補 */
export const CategoryCandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

/** 出品データ */
export const ListingDataSchema = z.object({
  price_usd: z.number().min(0).optional(),
  recommended_price_usd: z.number().min(0).optional(),
  break_even_price_usd: z.number().min(0).optional(),
  profit_amount_usd: z.number().optional(),
  profit_margin: z.number().optional(),
  ddu_profit_usd: z.number().optional(),
  ddu_profit_margin: z.number().optional(),
  ddp_profit_usd: z.number().optional(),
  ddp_profit_margin: z.number().optional(),
  shipping_cost_usd: z.number().min(0).optional(),
  shipping_method: z.string().optional(),
  shipping_policy_id: z.string().optional(),
  width_cm: z.number().positive().optional(),
  length_cm: z.number().positive().optional(),
  height_cm: z.number().positive().optional(),
  weight_g: z.number().positive().optional(),
  image_urls: z.array(z.string().url()).optional(),
  quantity: z.number().int().min(1).optional(),
  handling_time: z.number().int().min(0).optional(),
  return_policy_id: z.string().optional(),
}).passthrough(); // 追加フィールドを許可

/** 出品履歴エントリ */
export const ListingHistoryEntrySchema = z.object({
  marketplace: MarketplaceSchema,
  account: z.string(),
  listing_id: z.string().nullable(),
  status: z.enum(['success', 'failed', 'pending']),
  error_message: z.string().nullable().optional(),
  listed_at: z.string().datetime(),
  ended_at: ISODateStringSchema,
  price: z.number().min(0).optional(),
  currency: CurrencyCodeSchema.optional(),
});

// ============================================================
// メイン Product スキーマ
// ============================================================

export const ProductSchema = z.object({
  // 基本識別情報
  id: ProductIdSchema,
  sku: z.string().nullable(),
  master_key: z.string().nullable().optional(),
  source_system: z.string().nullable().optional(),
  source_id: z.string().nullable().optional(),
  source_item_id: z.string().nullable().optional(),

  // タイトル・説明（必須はtitleのみ）
  title: z.string().min(1, 'タイトルは必須です').max(500, 'タイトルは500文字以内で入力してください'),
  title_en: z.string().nullable().optional(),
  english_title: z.string().nullable().optional(),
  rewritten_english_title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  description_en: z.string().nullable().optional(),

  // 価格
  price_jpy: z.number().min(0).nullable().optional(),
  price_usd: z.number().min(0).nullable().optional(),
  current_price: z.number().min(0).nullable().optional(),
  suggested_price: z.number().min(0).nullable().optional(),
  cost_price: z.number().min(0).nullable().optional(),
  listing_price: z.number().min(0).nullable().optional(),
  purchase_price_jpy: z.number().min(0).nullable().optional(),
  recommended_price_usd: z.number().min(0).nullable().optional(),
  break_even_price_usd: z.number().min(0).nullable().optional(),
  currency: CurrencyCodeSchema.nullable().optional(),

  // 在庫
  current_stock: z.number().int().min(0).nullable().optional(),
  inventory_quantity: z.number().int().min(0).nullable().optional(),
  inventory_location: z.string().nullable().optional(),
  last_stock_check: ISODateStringSchema.nullable(),
  stock_status: z.string().nullable().optional(),
  physical_quantity: z.number().int().min(0).nullable().optional(),

  // 商品分類
  product_type: ProductTypeSchema.nullable().optional(),
  is_stock_master: z.boolean().nullable().optional(),

  // ステータス
  status: z.string().nullable().optional(),
  workflow_status: WorkflowStatusSchema.nullable().optional(),
  approval_status: z.string().nullable().optional(),
  listing_status: ListingStatusSchema.nullable().optional(),

  // 利益計算
  profit_margin: z.number().nullable().optional(),
  profit_amount: z.number().nullable().optional(),
  profit_amount_usd: z.number().nullable().optional(),
  profit_margin_percent: z.number().nullable().optional(),

  // SellerMirror分析
  sm_sales_count: z.number().int().min(0).nullable().optional(),
  sm_lowest_price: z.number().min(0).nullable().optional(),
  sm_average_price: z.number().min(0).nullable().optional(),
  sm_competitor_count: z.number().int().min(0).nullable().optional(),
  sm_profit_margin: z.number().nullable().optional(),
  sm_profit_amount_usd: z.number().nullable().optional(),
  sm_data: SellerMirrorDataSchema.nullable().optional(),
  sm_fetched_at: ISODateStringSchema.nullable(),

  // 競合分析
  competitors_lowest_price: z.number().min(0).nullable().optional(),
  competitors_average_price: z.number().min(0).nullable().optional(),
  competitors_count: z.number().int().min(0).nullable().optional(),
  competitors_data: CompetitorDataSchema.nullable().optional(),

  // リサーチ
  research_sold_count: z.number().int().min(0).nullable().optional(),
  research_competitor_count: z.number().int().min(0).nullable().optional(),
  research_lowest_price: z.number().min(0).nullable().optional(),
  research_profit_margin: z.number().nullable().optional(),
  research_profit_amount: z.number().nullable().optional(),
  research_data: ResearchDataSchema.nullable().optional(),
  research_completed: z.boolean().nullable().optional(),
  research_updated_at: ISODateStringSchema.nullable(),
  market_research_summary: z.string().nullable().optional(),

  // カテゴリ
  category: z.string().nullable().optional(),
  category_id: z.string().nullable().optional(),
  category_name: z.string().nullable().optional(),
  category_number: z.string().nullable().optional(),
  category_confidence: z.number().min(0).max(1).nullable().optional(),
  category_candidates: z.array(CategoryCandidateSchema).nullable().optional(),
  ebay_category_id: z.string().nullable().optional(),
  ebay_category_path: z.string().nullable().optional(),

  // コンディション
  condition: z.union([ProductConditionSchema, z.string()]).nullable().optional(),
  condition_name: z.string().nullable().optional(),
  recommended_condition: ProductConditionSchema.nullable().optional(),

  // HTS・関税
  hts_code: z.string().regex(/^\d{4}(\.\d{2}(\.\d{2}(\.\d{2})?)?)?$/, 'HTS形式が不正です').nullable().optional(),
  hts_description: z.string().nullable().optional(),
  hts_duty_rate: z.number().min(0).nullable().optional(),
  hts_confidence: HTSConfidenceSchema.nullable().optional(),
  origin_country: z.string().length(2, '2文字の国コードで入力してください').nullable().optional(),
  origin_country_duty_rate: z.number().min(0).nullable().optional(),
  material: z.string().nullable().optional(),
  material_duty_rate: z.number().min(0).nullable().optional(),
  duty_rate: z.number().min(0).nullable().optional(),
  base_duty_rate: z.number().min(0).nullable().optional(),
  additional_duty_rate: z.number().min(0).nullable().optional(),

  // 送料
  shipping_cost: z.number().min(0).nullable().optional(),
  shipping_cost_usd: z.number().min(0).nullable().optional(),
  shipping_method: z.string().nullable().optional(),
  shipping_policy: z.string().nullable().optional(),
  shipping_service: z.string().nullable().optional(),
  usa_shipping_policy_name: z.string().nullable().optional(),

  // フィルター
  filter_passed: z.boolean().nullable().optional(),
  filter_checked_at: ISODateStringSchema.nullable(),
  export_filter_status: FilterStatusSchema.nullable().optional(),
  patent_filter_status: FilterStatusSchema.nullable().optional(),
  mall_filter_status: FilterStatusSchema.nullable().optional(),
  final_judgment: z.string().nullable().optional(),

  // VERO
  is_vero_brand: z.boolean().nullable().optional(),
  vero_brand_name: z.string().nullable().optional(),
  vero_risk_level: VeroRiskLevelSchema.nullable().optional(),
  vero_notes: z.string().nullable().optional(),
  vero_checked_at: ISODateStringSchema.nullable(),

  // AI
  ai_confidence_score: z.number().min(0).max(1).nullable().optional(),
  ai_recommendation: z.string().nullable().optional(),

  // 承認
  approved_at: ISODateStringSchema.nullable(),
  approved_by: z.string().nullable().optional(),
  rejected_at: ISODateStringSchema.nullable(),
  rejected_by: z.string().nullable().optional(),
  rejection_reason: z.string().nullable().optional(),

  // 出品
  listing_priority: z.string().nullable().optional(),
  selected_mall: MarketplaceSchema.nullable().optional(),
  target_marketplaces: z.array(MarketplaceSchema).nullable().optional(),
  scheduled_listing_date: ISODateStringSchema.nullable(),
  listing_session_id: z.string().nullable().optional(),
  ebay_item_id: z.string().nullable().optional(),
  ebay_listing_url: z.string().url().nullable().optional(),
  listed_at: ISODateStringSchema.nullable(),
  ready_to_list: z.boolean().nullable().optional(),

  // ソース情報
  source: z.string().nullable().optional(),
  source_table: z.string().nullable().optional(),
  source_url: z.string().url().nullable().optional(),
  seller: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  bid_count: z.union([z.string(), z.number()]).nullable().optional(),

  // 画像
  primary_image_url: z.string().url().nullable().optional(),
  images: z.array(z.union([z.string().url(), ProductImageSchema])).nullable().optional(),
  image_urls: z.array(z.string().url()).nullable().optional(),
  gallery_images: z.array(z.string().url()).nullable().optional(),
  image_count: z.number().int().min(0).nullable().optional(),

  // JSONBデータ
  listing_data: ListingDataSchema.nullable().optional(),
  scraped_data: z.record(z.unknown()).nullable().optional(),
  ebay_api_data: z.record(z.unknown()).nullable().optional(),
  html_templates: z.array(z.record(z.unknown())).nullable().optional(),

  // HTML
  html_content: z.string().nullable().optional(),
  html_template_id: z.number().int().nullable().optional(),

  // タイムスタンプ
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),

  // 出品履歴
  listing_history: z.array(ListingHistoryEntrySchema).nullable().optional(),

  // スコアリング
  total_score: z.number().nullable().optional(),
  listing_score: z.number().nullable().optional(),

  // 楽観的ロック用バージョン
  version: z.number().int().min(0).optional(),

  // クライアントサイド専用
  isModified: z.boolean().optional(),
});

// ============================================================
// 派生スキーマ
// ============================================================

/** 新規作成用（id不要） */
export const ProductCreateSchema = ProductSchema.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true,
  version: true,
  isModified: true,
});

/** 更新用（部分更新） */
export const ProductUpdateSchema = ProductSchema.partial().omit({
  id: true,
  created_at: true,
});

/** 一括更新用 */
export const ProductBulkUpdateSchema = z.object({
  id: ProductIdSchema,
  updates: ProductUpdateSchema,
  expectedVersion: z.number().int().min(0).optional(),
});

// ============================================================
// 型の自動推論
// ============================================================

export type ProductSchemaType = z.infer<typeof ProductSchema>;
export type ProductCreateType = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateType = z.infer<typeof ProductUpdateSchema>;
export type ProductBulkUpdateType = z.infer<typeof ProductBulkUpdateSchema>;

// ============================================================
// バリデーションヘルパー
// ============================================================

/**
 * 商品データをバリデート
 */
export function validateProduct(data: unknown): { 
  success: boolean; 
  data?: ProductSchemaType; 
  errors?: z.ZodError 
} {
  const result = ProductSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * 商品更新データをバリデート
 */
export function validateProductUpdate(data: unknown): {
  success: boolean;
  data?: ProductUpdateType;
  errors?: z.ZodError;
} {
  const result = ProductUpdateSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

/**
 * Zodエラーをフィールドエラーマップに変換
 */
export function zodErrorToFieldErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
  }
  
  return fieldErrors;
}
