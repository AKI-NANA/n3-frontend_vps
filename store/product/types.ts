// store/product/types.ts
/**
 * Product Store 共通型定義
 */

import type { 
  Product, 
  ProductId, 
  ProductMap,
} from '@/app/tools/editing/types/product';

// Re-export for convenience
export type { Product, ProductId, ProductMap };

/** 商品ID（常にstring） */
export type ProductIdString = string;

/** 正規化されたデータ構造 */
export interface NormalizedProducts {
  productMap: ProductMap;
  productIds: ProductIdString[];
  total: number;
}

/** ローカル変更データ */
export interface LocalChange {
  original: Partial<Product>;
  current: Partial<Product>;
  changedAt: string;
}

/** 変更追跡マップ */
export type ModifiedMap = Record<ProductIdString, LocalChange>;
