// lib/constants/product-tabs.ts
/**
 * タブ定義オブジェクト
 * 
 * カウントAPIとリストAPIで共有し、フィルタ条件の不整合を防ぐ
 * 
 * Gemini推奨設計:
 * - USDを「親（is_primary）」として扱う
 * - MUG商品（5通貨）のうち、USDのみをカウント・表示
 * - 手動登録（manual）は全て表示
 */

export type TabId = 
  | 'all'
  | 'scraped'
  | 'draft'
  | 'data_editing'
  | 'approval_pending'
  | 'approved'
  | 'scheduled'
  | 'active_listings'
  | 'in_stock'
  | 'back_order_only'
  | 'variation'
  | 'set_products'
  | 'in_stock_master'
  | 'out_of_stock'
  | 'delisted_only'
  | 'archived';

export interface TabDefinition {
  id: TabId;
  label: string;
  labelEn: string;
  // MUGフィルタを適用するか（false = 全通貨表示）
  applyMugFilter: boolean;
  // アーカイブを含むか
  includeArchived: boolean;
  // Viewを使用するか（マスタータブ用）
  useView?: string;
  // 追加のフィルタ条件（Supabaseクエリ用）
  filters?: {
    listingStatus?: string | string[];
    workflowStatus?: string | string[];
    approvalStatus?: string | string[];
    hasInventoryMasterId?: boolean;
    dataComplete?: boolean; // english_title AND ebay_category_id が存在
  };
}

/**
 * 親レコード判定（MUGフィルタ）
 * - source_system = 'inventory_master' の場合 → currency = 'USD' のみ
 * - source_system = 'manual' の場合 → 全て通す
 * - その他 → 全て通す
 */
export function isParentRecord(product: {
  source_system?: string;
  currency?: string;
}): boolean {
  if (product.source_system === 'inventory_master') {
    return product.currency === 'USD';
  }
  return true; // manual や その他は全て親扱い
}

/**
 * タブ定義
 */
export const TAB_DEFINITIONS: Record<TabId, TabDefinition> = {
  // === 全通貨表示（MUGフィルタなし） ===
  all: {
    id: 'all',
    label: '全商品',
    labelEn: 'All',
    applyMugFilter: false,
    includeArchived: false,
  },

  // === USDのみ（MUGフィルタあり） ===
  scraped: {
    id: 'scraped',
    label: 'スクレイピング済',
    labelEn: 'Scraped',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      workflowStatus: 'scraped',
    },
  },

  draft: {
    id: 'draft',
    label: '下書き',
    labelEn: 'Draft',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      listingStatus: 'draft',
    },
  },

  data_editing: {
    id: 'data_editing',
    label: 'データ編集',
    labelEn: 'Editing',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      dataComplete: false, // english_title OR ebay_category_id が NULL
    },
  },

  approval_pending: {
    id: 'approval_pending',
    label: '承認待ち',
    labelEn: 'Pending',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      dataComplete: true,
      workflowStatus: ['pending', null],
      approvalStatus: ['pending', null],
      listingStatus: ['draft', null], // active以外
    },
  },

  approved: {
    id: 'approved',
    label: '承認済み',
    labelEn: 'Approved',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      workflowStatus: 'approved',
      listingStatus: ['draft', null], // active以外
    },
  },

  scheduled: {
    id: 'scheduled',
    label: '出品予約',
    labelEn: 'Scheduled',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      // schedule_status = 'scheduled' OR scheduled_at IS NOT NULL
    },
  },

  active_listings: {
    id: 'active_listings',
    label: '出品中',
    labelEn: 'Active',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      listingStatus: 'active',
    },
  },

  // === 在庫タイプ（出品中の内訳） ===
  in_stock: {
    id: 'in_stock',
    label: '有在庫',
    labelEn: 'In Stock',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      listingStatus: 'active',
      // inventory_type = 'stock' OR SKU contains 'stock'
    },
  },

  back_order_only: {
    id: 'back_order_only',
    label: '無在庫',
    labelEn: 'Back Order',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      listingStatus: 'active',
      // inventory_type = 'mu' OR SKU not contains 'stock'
    },
  },

  // === その他 ===
  variation: {
    id: 'variation',
    label: 'バリエーション',
    labelEn: 'Variation',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      // product_type IN ('variation_parent', 'variation_child')
    },
  },

  set_products: {
    id: 'set_products',
    label: 'セット品',
    labelEn: 'Set',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      // product_type = 'set'
    },
  },

  // === マスター（棚卸し用、Viewを使用） ===
  in_stock_master: {
    id: 'in_stock_master',
    label: 'マスター',
    labelEn: 'Master',
    applyMugFilter: true, // USDのみ
    includeArchived: true, // アーカイブ含む（在庫管理継続）
    useView: 'product_inventory_master_view', // Viewを使用
    filters: {
      hasInventoryMasterId: true,
    },
  },

  out_of_stock: {
    id: 'out_of_stock',
    label: '在庫0',
    labelEn: 'Out of Stock',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      // physical_quantity = 0
    },
  },

  delisted_only: {
    id: 'delisted_only',
    label: '出品停止中',
    labelEn: 'Delisted',
    applyMugFilter: true,
    includeArchived: false,
    filters: {
      listingStatus: ['ended', 'inactive', 'delisted'],
    },
  },

  // === アーカイブ（一時避難場所） ===
  archived: {
    id: 'archived',
    label: 'アーカイブ',
    labelEn: 'Archived',
    applyMugFilter: true, // USDのみ
    includeArchived: true, // これ自体がアーカイブタブ
    filters: {
      listingStatus: 'archived',
    },
  },
};

/**
 * タブIDからタブ定義を取得
 */
export function getTabDefinition(tabId: string): TabDefinition | undefined {
  return TAB_DEFINITIONS[tabId as TabId];
}

/**
 * 全タブ定義を配列で取得
 */
export function getAllTabDefinitions(): TabDefinition[] {
  return Object.values(TAB_DEFINITIONS);
}
