// store/productStore.ts
/**
 * Product Store - 後方互換性のためのエクスポート
 * 
 * 新しい構造:
 * - store/product/domainStore.ts - クライアントドメイン状態
 * - store/product/uiStore.ts - UI状態
 * - サーバーデータは React Query で管理
 * 
 * このファイルは後方互換性のためのエイリアス
 */

// 新しい Store からの re-export
export {
  // Types
  type Product,
  type ProductId,
  type ProductMap,
  type ProductIdString,
  
  // Domain Store
  useProductDomainStore,
  useModifiedIdsSelector,
  useModifiedCountSelector,
  useIsModifiedSelector,
  useSelectedIdsSelector,
  useSelectedCountSelector,
  useIsSelectedSelector,
  productDomainActions,
  getModifiedProductsData,
  getSelectedIdsArray,
  
  // UI Store
  useProductUIStore,
  usePaginationSelector,
  useFiltersSelector,
  useSortSelector,
  useViewSettingsSelector,
  productUIActions,
  type ListFilterType,
} from './product';

// ============================================================
// 後方互換性のためのエイリアス
// ============================================================

import { 
  useProductDomainStore,
  productDomainActions,
  useProductUIStore,
  productUIActions,
} from './product';
import type { Product } from './product';

/**
 * @deprecated 新しい useProductDomainStore または useProductUIStore を使用してください
 */
export const useProductStore = useProductDomainStore;

/**
 * @deprecated 新しい productDomainActions または productUIActions を使用してください
 */
export const productStoreActions = {
  // Domain actions
  ...productDomainActions,
  
  // UI actions (よく使われるもの)
  setPagination: (page: number, pageSize: number) => {
    productUIActions.setPage(page);
    productUIActions.setPageSize(pageSize);
  },
  
  // Legacy methods (後方互換性)
  setProducts: (_products: Product[], _total?: number) => {
    console.warn('[DEPRECATED] setProducts is no longer needed. React Query manages server data.');
  },
  
  updateProduct: (productId: string, updates: Partial<Product>) => {
    // 簡易的な互換性レイヤー
    productDomainActions.trackChange(productId, {}, updates);
  },
  
  removeProducts: (productIds: string[]) => {
    console.warn('[DEPRECATED] Use React Query mutation for deletion');
    productIds.forEach(id => productDomainActions.discardChange(id));
  },
  
  clearModified: () => {
    productDomainActions.discardAllChanges();
  },
  
  markAsSaved: (productIds: string[]) => {
    productDomainActions.markAsSaved(productIds);
  },
  
  setLoading: (_loading: boolean) => {
    console.warn('[DEPRECATED] Loading state is managed by React Query');
  },
  
  setError: (_error: string | null) => {
    console.warn('[DEPRECATED] Error state is managed by React Query');
  },
  
  reset: () => {
    productDomainActions.reset();
    productUIActions.reset();
  },
};

// ============================================================
// Legacy selectors（後方互換性）
// ============================================================

/**
 * @deprecated 新しいセレクターを使用してください
 */
export const useProductSelector = (productId: string) => {
  console.warn('[DEPRECATED] useProductSelector - Server data is managed by React Query');
  return undefined;
};

/**
 * @deprecated useModifiedIdsSelector を使用してください
 */
export const useProductIdsSelector = () => {
  console.warn('[DEPRECATED] useProductIdsSelector - Use useFetchProducts().productIds');
  return [];
};

/**
 * @deprecated useFetchProducts を使用してください
 */
export const useLoadingSelector = () => {
  console.warn('[DEPRECATED] useLoadingSelector - Use useFetchProducts().isLoading');
  return false;
};

/**
 * @deprecated useFetchProducts を使用してください
 */
export const useErrorSelector = () => {
  console.warn('[DEPRECATED] useErrorSelector - Use useFetchProducts().error');
  return null;
};

// ============================================================
// Legacy utility functions（後方互換性）
// ============================================================

/**
 * @deprecated useFetchProducts().products を使用してください
 */
export const getProductArray = (): Product[] => {
  console.warn('[DEPRECATED] getProductArray - Use useFetchProducts().products');
  return [];
};

/**
 * @deprecated getModifiedProductsData を使用してください
 */
export const getModifiedProducts = (): Product[] => {
  console.warn('[DEPRECATED] getModifiedProducts - Use getModifiedProductsData()');
  return getModifiedProductsData().map(({ id, updates }) => ({ id, ...updates } as Product));
};

/**
 * @deprecated useFetchProducts().productMap[id] を使用してください
 */
export const getProduct = (productId: string): Product | undefined => {
  console.warn('[DEPRECATED] getProduct - Use useFetchProducts().productMap');
  return undefined;
};
