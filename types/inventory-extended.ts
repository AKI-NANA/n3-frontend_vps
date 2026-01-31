/**
 * 棚卸し・在庫管理システムの拡張型定義
 * フェーズ2: L4階層化とセット品在庫連動対応
 */

// ============================================================
// 在庫タイプ（L4階層化対応）
// ============================================================

/**
 * 在庫タイプ（棚卸し/マスター管理用）
 * 
 * - regular: 通常品（単品在庫）
 * - set: セット品（構成パーツ連動在庫）
 * - mu: 無在庫（モール在庫管理 / Multi-channel Unlimited）
 * - parts: 構成パーツ（出品はしないが、セット構成に必要な実在庫）
 */
export type MasterInventoryType = 'regular' | 'set' | 'mu' | 'parts';

/**
 * 在庫タイプラベルマッピング
 */
export const MASTER_INVENTORY_TYPE_LABELS: Record<MasterInventoryType, string> = {
  regular: '通常品',
  set: 'セット品',
  mu: '無在庫(MU)',
  parts: '構成パーツ',
};

/**
 * 在庫タイプアイコンマッピング
 */
export const MASTER_INVENTORY_TYPE_ICONS: Record<MasterInventoryType, string> = {
  regular: '📦',
  set: '🔗',
  mu: '🌐',
  parts: '🧩',
};

/**
 * 在庫タイプ色マッピング（UI表示用）
 */
export const MASTER_INVENTORY_TYPE_COLORS: Record<MasterInventoryType, { bg: string; text: string; border: string }> = {
  regular: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' },
  set: { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.3)' },
  mu: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.3)' },
  parts: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
};

// ============================================================
// セット商品関連
// ============================================================

/**
 * セット構成品情報（拡張版）
 */
export interface SetMemberInfoExtended {
  product_id: string;              // 構成品のID
  sku?: string;                    // 構成品のSKU
  product_name?: string;           // 構成品名
  quantity: number;                // 必要数量
  image_url?: string;              // 画像（表示用）
  physical_quantity?: number;      // 構成品の現在在庫数
  available_sets?: number;         // この構成品から作れるセット数
}

/**
 * セット商品の在庫情報
 */
export interface SetInventoryInfo {
  set_product_id: string;
  set_product_name?: string;
  members: SetMemberInfoExtended[];
  calculated_available: number;    // 計算された販売可能数（MIN値）
  bottleneck_member_id?: string;   // ボトルネックとなっている構成品ID
  bottleneck_member_name?: string; // ボトルネック構成品名
  last_calculated_at: string;      // 最終計算日時
}

// ============================================================
// 無在庫(MU)商品関連
// ============================================================

/**
 * 仕入れ元モール種別
 */
export type SupplierMall = 'amazon_jp' | 'rakuten' | 'yahoo_shopping' | 'mercari' | 'yahoo_auction' | 'other';

/**
 * 仕入れ元モールラベル
 */
export const SUPPLIER_MALL_LABELS: Record<SupplierMall, string> = {
  amazon_jp: 'Amazon JP',
  rakuten: '楽天市場',
  yahoo_shopping: 'Yahoo!ショッピング',
  mercari: 'メルカリ',
  yahoo_auction: 'ヤフオク',
  other: 'その他',
};

/**
 * 無在庫商品の仕入れ先情報
 */
export interface MUSupplierInfo {
  mall: SupplierMall;              // 仕入れ元モール
  url: string;                     // 仕入れ元URL
  last_checked_at?: string;        // 最終在庫確認日時
  is_available?: boolean;          // 在庫あり/なし
  supplier_price?: number;         // 仕入れ価格
  supplier_stock?: number;         // 仕入れ元在庫数
  notes?: string;                  // メモ
}

// ============================================================
// 構成パーツ関連
// ============================================================

/**
 * 構成パーツの使用情報
 */
export interface PartsUsageInfo {
  parts_product_id: string;
  parts_product_name?: string;
  used_in_sets: {
    set_product_id: string;
    set_product_name?: string;
    required_quantity: number;
  }[];
  total_reserved: number;          // 全セットで予約されている総数
  available_for_new_sets: number;  // 新規セット作成に使える数
}

// ============================================================
// L4サブフィルター用型
// ============================================================

/**
 * マスタータブのL4サブフィルター
 */
export type MasterL4SubFilter = 'all' | MasterInventoryType;

/**
 * L4サブフィルター設定
 */
export interface MasterL4SubFilterConfig {
  id: MasterL4SubFilter;
  label: string;
  icon: string;
  color: { bg: string; text: string; border: string };
  filterFn: (product: any) => boolean;
}

/**
 * L4サブフィルター設定一覧
 */
export const MASTER_L4_SUB_FILTERS: MasterL4SubFilterConfig[] = [
  {
    id: 'all',
    label: 'すべて',
    icon: '📋',
    color: { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: 'rgba(107, 114, 128, 0.3)' },
    filterFn: () => true,
  },
  {
    id: 'regular',
    label: '通常品',
    icon: '📦',
    color: MASTER_INVENTORY_TYPE_COLORS.regular,
    filterFn: (p) => p.master_inventory_type === 'regular' || (!p.master_inventory_type && p.product_type !== 'set' && p.inventory_type !== 'mu'),
  },
  {
    id: 'set',
    label: 'セット品',
    icon: '🔗',
    color: MASTER_INVENTORY_TYPE_COLORS.set,
    filterFn: (p) => p.master_inventory_type === 'set' || p.product_type === 'set',
  },
  {
    id: 'mu',
    label: '無在庫(MU)',
    icon: '🌐',
    color: MASTER_INVENTORY_TYPE_COLORS.mu,
    filterFn: (p) => p.master_inventory_type === 'mu' || p.inventory_type === 'mu',
  },
  {
    id: 'parts',
    label: '構成パーツ',
    icon: '🧩',
    color: MASTER_INVENTORY_TYPE_COLORS.parts,
    filterFn: (p) => p.master_inventory_type === 'parts' || p.is_set_component === true,
  },
];

// ============================================================
// 計算ユーティリティ型
// ============================================================

/**
 * セット販売可能数の計算結果
 */
export interface SetAvailabilityCalculation {
  available_quantity: number;
  members: {
    product_id: string;
    product_name?: string;
    required_quantity: number;
    current_stock: number;
    available_sets: number;
    is_bottleneck: boolean;
  }[];
  bottleneck?: {
    product_id: string;
    product_name?: string;
    limiting_factor: number;
  };
}

/**
 * セット販売可能数を計算する関数の型
 */
export type CalculateSetAvailability = (
  setProduct: {
    id: string;
    set_members?: SetMemberInfoExtended[] | null;
  },
  allProducts: Map<string, { physical_quantity?: number; product_name?: string }>
) => SetAvailabilityCalculation;

// ============================================================
// 拡張されたInventoryProduct型（L4対応）
// ============================================================

/**
 * L4階層化対応のInventoryProduct拡張フィールド
 */
export interface InventoryProductL4Extension {
  // L4サブカテゴリ（マスター管理用）
  master_inventory_type?: MasterInventoryType;
  
  // セット商品拡張
  set_members_extended?: SetMemberInfoExtended[];
  set_availability?: SetAvailabilityCalculation;
  is_set_component?: boolean;      // 他のセット商品の構成品かどうか
  used_in_sets?: string[];         // どのセット商品で使われているか（set_product_id配列）
  
  // 無在庫拡張
  mu_supplier_info?: MUSupplierInfo;
  
  // 構成パーツ拡張
  parts_usage?: PartsUsageInfo;
}
