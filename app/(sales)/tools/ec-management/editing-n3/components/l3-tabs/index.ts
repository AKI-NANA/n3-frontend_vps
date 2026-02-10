// app/tools/editing-n3/components/l3-tabs/index.ts
/**
 * L3タブ用コンポーネントのエクスポート
 * 
 * L2タブごとにL3サブタブを管理
 */

// 基本編集タブ用（既存）
export { InventoryToolPanel } from './inventory-tool-panel';
export { VariationToolPanel } from './variation-tool-panel';
export { SetProductToolPanel } from './set-product-tool-panel';
export { HistoryTab } from './history-tab';

// ロジスティクスタブ用 - logistics-tab/index.tsから再エクスポート
export * from './logistics-tab';

// 関税・法令タブ用
export * from './compliance-tab';

// 国内販売タブ用
export * from './domestic-tab';

// メディアタブ用
export * from './media-tab';

// ============================================================
// フェーズ2: L4階層化とセット品在庫連動
// ============================================================

// L4サブフィルター（マスタータブ内）
export { MasterL4SubFilter } from './master-l4-sub-filter';
export type { MasterL4SubFilterProps } from './master-l4-sub-filter';

// 無在庫(MU)商品の仕入れ先管理パネル
export { MUSupplierPanel } from './mu-supplier-panel';
export type { MUSupplierPanelProps, MUProduct } from './mu-supplier-panel';

// セット商品在庫表示コンポーネント
export { SetInventoryDisplay, SetInventoryBadge } from './set-inventory-display';
export type { SetInventoryDisplayProps, SetInventoryBadgeProps, SetProductData, AllProductsData } from './set-inventory-display';
