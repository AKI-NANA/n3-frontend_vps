// app/tools/editing-n3/hooks/index.ts
/**
 * editing-n3 フックのエクスポート
 */

export { useInventoryData } from './use-inventory-data';
export type { InventoryProduct, InventoryFilter, InventoryStats } from './use-inventory-data';

export { useInventorySync } from './use-inventory-sync';

export { useVariationCreation } from './use-variation-creation';

export { useSetCreation } from './use-set-creation';

export { useTabCounts } from './use-tab-counts';
export type { TabCounts, InventoryCounts } from './use-tab-counts';

export { useStocktakeMode } from './use-stocktake-mode';
export type { StocktakeModeConfig } from './use-stocktake-mode';

// N3 v2.0 追加フック
export { useProductValidation } from './use-product-validation';
export type { ProductValidationState, UseProductValidationReturn } from './use-product-validation';

export { useSMCandidateSelection } from './use-sm-candidate-selection';
export type { SMSelectionState, UseSMCandidateSelectionReturn } from './use-sm-candidate-selection';

export { useSpreadsheetSync } from './use-spreadsheet-sync';
export type { SpreadsheetSyncConfig, SpreadsheetSyncState, UseSpreadsheetSyncReturn } from './use-spreadsheet-sync';

// N3 v3.0 グローバル永続フィルター
export { usePersistentFilter, isProductVerified, getVerifiedStyle, getVerifiedClassName } from './use-persistent-filter';
