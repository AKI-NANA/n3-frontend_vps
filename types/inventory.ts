/**
 * 棚卸し・在庫管理システムの型定義
 */

// 商品タイプ
export type ProductType = 'stock' | 'dropship' | 'set' | 'hybrid' | 'unclassified' | 'variation'

// 商品状態
export type ConditionType = 'new' | 'used' | 'refurbished'

// 在庫変更タイプ
export type ChangeType = 'sale' | 'import' | 'manual' | 'adjustment' | 'set_sale'

// マーケットプレイス
export type Marketplace = 'ebay' | 'amazon' | 'shopee' | 'mercari' | 'manual' | 'all'

// eBayアカウント
export type EbayAccount = 'MJT' | 'GREEN' | 'manual' | 'all'

// 在庫タイプ（在庫最適化用）
export type InventoryType = 'ROTATION_90_DAYS' | 'INVESTMENT_10_PERCENT'

// 価格フェーズ（段階的値下げ）
export type PricePhase = 'NORMAL' | 'WARNING' | 'LIQUIDATION'

// 販売予定販路（L4属性）
export type SalesChannel = 
  | 'ebay_us' 
  | 'ebay_uk' 
  | 'ebay_au'
  | 'amazon_us' 
  | 'amazon_jp' 
  | 'qoo10_jp' 
  | 'shopee' 
  | 'mercari' 
  | 'undecided'

// 販路ラベルマッピング
export const SALES_CHANNEL_LABELS: Record<SalesChannel, string> = {
  ebay_us: 'eBay US',
  ebay_uk: 'eBay UK',
  ebay_au: 'eBay AU',
  amazon_us: 'Amazon US',
  amazon_jp: 'Amazon JP',
  qoo10_jp: 'Qoo10 JP',
  shopee: 'Shopee',
  mercari: 'メルカリ',
  undecided: '未定',
}

// その他経費の型
export interface AdditionalCosts {
  [key: string]: number  // { "domestic_shipping": 500, "inspection": 200 }
}

// 経費項目のプリセット
export const COST_ITEM_PRESETS = [
  { key: 'domestic_shipping', label: '国内送料' },
  { key: 'inspection', label: '検品費' },
  { key: 'packaging', label: '梱包資材費' },
  { key: 'agent_fee', label: '代行手数料' },
  { key: 'customs_tax', label: '関税・消費税' },
  { key: 'storage', label: '保管費用' },
  { key: 'other', label: 'その他' },
]

// 棚卸し商品データ
export interface InventoryProduct {
  id: string
  unique_id: string
  product_name: string
  sku: string | null
  product_type: ProductType
  physical_quantity: number
  listing_quantity: number
  cost_price: number
  selling_price: number
  condition_name: string
  category: string
  subcategory?: string | null
  images: string[]
  source_data?: any
  supplier_info?: {
    url?: string
    tracking_id?: string
  }
  is_manual_entry: boolean
  priority_score: number
  notes?: string | null
  created_at: string
  updated_at: string

  // モール情報（拡張）
  marketplace?: Marketplace
  account?: string

  // eBay固有データ
  ebay_data?: {
    listing_id?: string
    offer_id?: string
    item_id?: string
    site?: string
    [key: string]: any
  }

  // セット商品関連フィールド
  set_members?: SetMemberInfo[] | null       // セット構成品情報
  set_available_quantity?: number | null     // セット販売可能数（計算値）

  // 在庫最適化フィールド
  date_acquired?: string | null              // 仕入れ日
  target_sale_deadline?: string | null       // 販売目標期限（デフォルト: 仕入れ日+3ヶ月）
  inventory_type?: InventoryType | null      // 在庫タイプ（回転商品 or 投資商品）
  cogs?: number | null                       // 仕入れ原価（Cost of Goods Sold）
  estimated_final_profit_margin?: number | null // 最終見込み純利益率（%）
  current_price_phase?: PricePhase | null    // 現在の価格フェーズ
  last_price_reduction_date?: string | null  // 最終値下げ日
  price_reduction_history?: PriceReductionRecord[] | null // 値下げ履歴

  // DDP計算フィールド
  weight_g?: number | null                   // 商品重量（グラム）
  hts_code?: string | null                   // 関税分類コード（10桁）
  origin_country?: string | null             // 原産国（ISO 3166-1 alpha-2）
  destination_country?: string | null        // 仕向国（ISO 3166-1 alpha-2）
  shipping_cost_usd?: number | null          // 配送料（USD）

  // バリエーション関連フィールド（P0-3追加）
  variation_parent_id?: string | null        // バリエーション親商品のID（UUID）
  variation_price_override?: number | null   // バリエーション個別価格上書き
  is_variation_member?: boolean              // バリエーションメンバーフラグ
  
  // 旧バリエーションフィールド（互換性維持）
  parent_sku?: string | null                 // 親SKU（バリエーション子SKUの場合）
  variation_attributes?: Record<string, any> | null // バリエーション属性
  is_variation_parent?: boolean              // バリエーション親SKUフラグ
  is_variation_child?: boolean               // バリエーション子SKUフラグ

  // 重複出品防止フィールド
  is_individual_listing_blocked?: boolean    // 個別出品ブロックフラグ

  // Supusi同期用フィールド
  storage_location?: string | null           // 保管場所（棚番号など）
  title_en?: string | null                   // 英語タイトル
  workflow_status?: 'draft' | 'ready' | 'listed' | 'sold' | null  // ワークフロー状態
  attr_l1?: string | null                    // 属性レベル1
  attr_l2?: string | null                    // 属性レベル2
  attr_l3?: string | null                    // 属性レベル3
  is_verified?: boolean                      // 属性確定フラグ
  
  // L4属性: 販売予定販路（複数選択）
  attr_l4?: SalesChannel[] | null
  
  // その他経費（JSONB）
  additional_costs?: AdditionalCosts | null
  
  // 総原価（原価 + 経費合計）
  total_cost_jpy?: number | null
}

// セット商品構成
export interface SetComponent {
  id: string
  set_product_id: string
  component_product_id: string
  quantity_required: number
  created_at: string
}

// セット構成品情報（JSONB保存用）
export interface SetMemberInfo {
  product_id: string              // 構成品のID
  sku?: string                    // 構成品のSKU
  product_name?: string           // 構成品名
  quantity: number                // 必要数量
  image_url?: string              // 画像（表示用）
}

// 在庫変更履歴
export interface InventoryChange {
  id: string
  product_id: string
  change_type: ChangeType
  quantity_before: number
  quantity_after: number
  source: string
  notes?: string | null
  metadata?: any
  created_at: string
}

// 値下げ履歴レコード
export interface PriceReductionRecord {
  date: string
  old_price: number
  new_price: number
  phase: PricePhase
  reason: string
  auto_executed: boolean
}

// フィルター条件（P0-4, P0-5 拡張）
export interface InventoryFilter {
  search?: string
  product_type?: ProductType | 'all' | 'unknown'
  stock_status?: 'in_stock' | 'out_of_stock' | 'all'
  condition?: ConditionType | 'all'
  category?: string
  marketplace?: Marketplace
  
  // 在庫最適化フィルター
  inventory_type?: InventoryType | 'all'
  price_phase?: PricePhase | 'all'
  days_held?: '0-90' | '91-180' | '180+' | 'all'
  
  // サイトフィルター（USA限定などに使用）
  site?: 'US' | 'UK' | 'AU' | 'all'
  
  // P0-4: バリエーション候補フィルター
  grouping_candidate?: boolean               // バリエーション候補のみ表示
  variation_status?: 'parent' | 'member' | 'standalone' | 'all'  // バリエーション状態
  
  // P0-5: アカウントフィルター
  ebay_account?: EbayAccount                 // eBayアカウント（MJT/GREEN/manual）
}

// 統計情報（P0-5, P0-7 拡張）
export interface InventoryStats {
  total: number
  in_stock: number
  out_of_stock: number
  stock_count: number
  dropship_count: number
  set_count: number
  total_value: number              // 原価ベースの在庫総額
  total_selling_value?: number     // 販売価格ベースの出品総額
  
  // 在庫最適化統計
  warning_inventory?: number       // 警戒フェーズの在庫数
  liquidation_inventory?: number   // 損切りフェーズの在庫数
  avg_days_held?: number           // 平均在庫日数
  rotation_90_count?: number       // 回転商品数
  investment_10_count?: number     // 投資商品数
  
  // P0-5, P0-7: アカウント別統計
  account_stats?: {
    MJT: AccountStats
    GREEN: AccountStats
    manual: AccountStats
  }
  
  // P0-4: バリエーション統計
  variation_stats?: {
    parent_count: number           // バリエーション親SKU数
    member_count: number           // バリエーションメンバー数
    standalone_count: number       // 単独SKU数
    grouping_candidates: number    // グルーピング候補数
  }
}

// アカウント別統計（P0-7）
export interface AccountStats {
  total: number                    // 商品数
  in_stock: number                 // 在庫あり
  out_of_stock: number             // 在庫なし
  total_value: number              // 在庫総額（原価）
  total_selling_value: number      // 出品総額（販売価格）
  listing_count: number            // 出品中の数
}

// バリエーショングループ（親子関係）
export interface VariationGroup {
  parentId: string                 // 親商品ID
  parentSku: string                // 親SKU名
  basePrice: number                // 基準価格
  members: VariationMember[]       // 子商品リスト
  createdAt: string
  updatedAt: string
}

// バリエーションメンバー（子商品）
export interface VariationMember {
  productId: string
  sku: string
  productName: string
  priceOverride?: number           // 価格上書き（null=基準価格使用）
  shippingSurcharge: number        // 送料サーチャージ
  attributes?: Record<string, any> // バリエーション属性（色、サイズなど）
}

// グルーピング候補判定結果
export interface GroupingCandidate {
  productId: string
  category: string
  priceRange: string               // 価格帯（例: "$20-$30"）
  weightRange: string              // 重量帯（例: "500g-1kg"）
  similarProducts: string[]        // 類似商品ID
  recommendedGroupSize: number     // 推奨グループサイズ
}
