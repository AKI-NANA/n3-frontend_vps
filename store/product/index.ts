// store/product/index.ts
/**
 * Product Store - エクスポート集約
 * 
 * 3つのStoreに分離:
 * 1. domainStore - クライアントドメイン状態（変更追跡、選択）
 * 2. uiStore - UI状態（ページネーション、フィルター、表示設定）
 * 3. サーバーデータ - React Query（このファイルでは管理しない）
 */

// Types
export * from './types';

// Domain Store
export {
  useProductDomainStore,
  useModifiedIdsSelector,
  useModifiedCountSelector,
  useIsModifiedSelector,
  useProductChangeSelector,
  useSelectedIdsSelector,
  useSelectedCountSelector,
  useIsSelectedSelector,
  productDomainActions,
  getModifiedProductsData,
  getSelectedIdsArray,
} from './domainStore';

// UI Store
export {
  useProductUIStore,
  usePaginationSelector,
  useFiltersSelector,
  useListFilterSelector,
  useWorkflowPhaseSelector,      // ⭐ v2 追加
  useFilterStateSelector,        // ⭐ v2 追加
  useSortSelector,
  useViewSettingsSelector,
  productUIActions,
  type ListFilterType,
  type ProductPhase,             // ⭐ v2 追加
} from './uiStore';
