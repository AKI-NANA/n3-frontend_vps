// app/tools/editing-n3/hooks/index.ts
/**
 * editing-n3 フックのエクスポート
 */

export { useInventoryData } from './use-inventory-data';
export type { InventoryProduct, InventoryFilter, InventoryStats, SortOption, SortField, SortOrder } from './use-inventory-data';

// Phase 4: サーバーサイドフィルタリング版
export { useInventoryServerData } from './use-inventory-server-data';

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

// N3 v3.1 セット品構成管理
export { useBundleItems } from './use-bundle-items';
export type { BundleComponent, SetStockInfo, InventorySearchResult } from './use-bundle-items';

// N3 v4.0 スマート一括処理
export { useSmartProcess } from './use-smart-process';
export type { ProcessProgress, SmartProcessResult } from './use-smart-process';

// N3 v4.1 FLOWボタン連動フェーズ管理
export { sortProductsByPhase, getPhaseOrder } from '../components/flow-phase-badge';
