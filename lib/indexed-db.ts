// lib/indexed-db.ts
// IndexedDB ユーティリティ - Phase 9

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Product } from '@/app/tools/editing/types/product';

// データベーススキーマ
interface N3Database extends DBSchema {
  products: {
    key: number;
    value: Product & { cachedAt: number };
    indexes: { 'by-sku': string; 'by-updated': number };
  };
  metadata: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'n3-db';
const DB_VERSION = 1;
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24時間

let dbPromise: Promise<IDBPDatabase<N3Database>> | null = null;

/**
 * データベースを開く（シングルトン）
 */
export function getDB(): Promise<IDBPDatabase<N3Database>> {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = openDB<N3Database>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Products ストア
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', {
          keyPath: 'id',
        });
        productStore.createIndex('by-sku', 'sku');
        productStore.createIndex('by-updated', 'cachedAt');
      }

      // Metadata ストア
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata');
      }
    },
  });

  return dbPromise;
}

/**
 * 商品データを保存
 */
export async function saveProducts(products: Product[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('products', 'readwrite');
  const store = tx.objectStore('products');

  const cachedAt = Date.now();

  await Promise.all(
    products.map((product) =>
      store.put({
        ...product,
        cachedAt,
      })
    )
  );

  await tx.done;
  console.log('✅ IndexedDB: 商品保存完了', products.length, '件');
}

/**
 * 商品データを取得（全件）
 */
export async function getProducts(): Promise<Product[]> {
  const db = await getDB();
  const products = await db.getAll('products');
  
  // TTLチェック
  const now = Date.now();
  const validProducts = products.filter(
    (p) => now - p.cachedAt < CACHE_TTL
  );

  console.log('✅ IndexedDB: 商品取得', validProducts.length, '/', products.length, '件');
  
  return validProducts;
}

/**
 * 商品データを取得（ID指定）
 */
export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDB();
  const product = await db.get('products', id);
  
  if (!product) return undefined;

  // TTLチェック
  const now = Date.now();
  if (now - product.cachedAt > CACHE_TTL) {
    console.warn('⚠️ IndexedDB: キャッシュ期限切れ', id);
    return undefined;
  }

  return product;
}

/**
 * 商品データを取得（SKU指定）
 */
export async function getProductBySku(sku: string): Promise<Product | undefined> {
  const db = await getDB();
  const product = await db.getFromIndex('products', 'by-sku', sku);
  
  if (!product) return undefined;

  // TTLチェック
  const now = Date.now();
  if (now - product.cachedAt > CACHE_TTL) {
    console.warn('⚠️ IndexedDB: キャッシュ期限切れ', sku);
    return undefined;
  }

  return product;
}

/**
 * 商品データを更新
 */
export async function updateProduct(id: number, updates: Partial<Product>): Promise<void> {
  const db = await getDB();
  const product = await db.get('products', id);
  
  if (!product) {
    console.warn('⚠️ IndexedDB: 商品が見つかりません', id);
    return;
  }

  await db.put('products', {
    ...product,
    ...updates,
    cachedAt: Date.now(),
  });

  console.log('✅ IndexedDB: 商品更新完了', id);
}

/**
 * 商品データを削除
 */
export async function deleteProduct(id: number): Promise<void> {
  const db = await getDB();
  await db.delete('products', id);
  console.log('✅ IndexedDB: 商品削除完了', id);
}

/**
 * 古いキャッシュをクリア
 */
export async function clearExpiredCache(): Promise<number> {
  const db = await getDB();
  const products = await db.getAll('products');
  
  const now = Date.now();
  let deletedCount = 0;

  const tx = db.transaction('products', 'readwrite');
  const store = tx.objectStore('products');

  for (const product of products) {
    if (now - product.cachedAt > CACHE_TTL) {
      await store.delete(product.id);
      deletedCount++;
    }
  }

  await tx.done;
  console.log('✅ IndexedDB: 期限切れキャッシュ削除', deletedCount, '件');
  
  return deletedCount;
}

/**
 * すべてのキャッシュをクリア
 */
export async function clearAllCache(): Promise<void> {
  const db = await getDB();
  await db.clear('products');
  await db.clear('metadata');
  console.log('✅ IndexedDB: 全キャッシュ削除');
}

/**
 * メタデータを保存
 */
export async function saveMetadata(key: string, value: any): Promise<void> {
  const db = await getDB();
  await db.put('metadata', value, key);
}

/**
 * メタデータを取得
 */
export async function getMetadata(key: string): Promise<any> {
  const db = await getDB();
  return db.get('metadata', key);
}

/**
 * キャッシュ統計を取得
 */
export async function getCacheStats(): Promise<{
  total: number;
  valid: number;
  expired: number;
  size: number;
}> {
  const db = await getDB();
  const products = await db.getAll('products');
  
  const now = Date.now();
  const valid = products.filter((p) => now - p.cachedAt < CACHE_TTL);
  const expired = products.length - valid.length;

  // おおよそのサイズを計算（JSON文字列のバイト数）
  const size = new Blob([JSON.stringify(products)]).size;

  return {
    total: products.length,
    valid: valid.length,
    expired,
    size,
  };
}
