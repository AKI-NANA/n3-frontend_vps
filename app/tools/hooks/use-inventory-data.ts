// app/tools/editing-n3/hooks/use-inventory-data.ts
/**
 * 棚卸しデータフック - inventory_masterテーブルからデータ取得
 * 
 * 機能:
 * - ページネーション対応（Supabase 1000件制限回避）
 * - フィルタリング
 * - 統計計算
 * 
 * 重要: types/inventory.ts の InventoryProduct を使用
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { InventoryProduct as BaseInventoryProduct } from '@/types/inventory';

// 拡張した型定義（N3表示用にフィールドを追加）
export interface InventoryProduct extends BaseInventoryProduct {
  // N3表示用エイリアス
  title?: string; // product_name のエイリアス
  image_url?: string; // images[0] のエイリアス
  cost_jpy?: number; // cost_price のエイリアス（円換算）
  current_stock?: number; // physical_quantity のエイリアス
  stock_status?: 'in_stock' | 'out_of_stock' | 'low_stock';
  ebay_account?: string; // source_data.ebay_account のエイリアス
}

// フィルター型
export interface InventoryFilter {
  marketplace?: string;
  productType?: string;
  stockStatus?: string;
  condition?: string;
  category?: string;
  search?: string;
  inventoryType?: string;
  pricePhase?: string;
  daysHeldMin?: number;
  daysHeldMax?: number;
  site?: string;
  ebayAccount?: string;
  variationStatus?: string;
}

// ソートオプション型
export type SortField = 'created_at' | 'updated_at' | 'product_name' | 'sku' | 'cost_price' | 'selling_price' | 'physical_quantity';
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  order: SortOrder;
}

// 統計型
export interface InventoryStats {
  totalCount: number;
  inStockCount: number;
  mjtCount: number;
  greenCount: number;
  totalCostJpy: number;
  variationCandidateCount: number;
  variationParentCount: number;
  variationMemberCount: number;
  standaloneCount: number;
  setCount: number;
}

const DEFAULT_ITEMS_PER_PAGE = 50;
const EXCHANGE_RATE_USD_JPY = 150; // 仮の為替レート

// MUG（Multi-country Listing）非英語パターン
const MUG_NON_ENGLISH_PATTERNS = [
  /\bKarten\b/i, /\bSumpf\b/i, /\bKomplett\b/i, /\bActionfigur\b/i,
  /\bCarta\b/i, /\bCarte\b/i, /\bgiapponese\b/i, /\bFigurine\b/i,
  /\bcartas\b/i, /\bFigura de acción\b/i, /\bActiefiguur\b/i, /\bFigurka\b/i,
];

/**
 * MUG派生リスティングかどうか判定
 * USD以外の通貨は除外（MUGで生成された派生リスティング）
 */
function isMugDerivedListing(item: any): boolean {
  const currency = item.ebay_data?.currency;
  if (currency && currency !== 'USD') {
    return true;
  }
  // タイトルベースの非英語検出（バックアップ）
  const title = item.product_name || '';
  if (MUG_NON_ENGLISH_PATTERNS.some(pattern => pattern.test(title))) {
    return true;
  }
  return false;
}

/**
 * セット商品の販売可能数を計算
 * 構成品の在庫数から自動計算（ボトルネック = 最小在庫）
 */
function calculateSetAvailableQuantity(
  setProduct: any,
  allProducts: Map<string, any>
): number {
  const members = setProduct.set_members;
  if (!members || !Array.isArray(members) || members.length === 0) {
    return 0;
  }
  
  let minAvailable = Infinity;
  
  for (const member of members) {
    const memberId = member.product_id;
    const requiredQty = member.quantity || 1;
    
    if (!memberId) continue;
    
    const memberProduct = allProducts.get(memberId);
    if (!memberProduct) {
      // 構成品が見つからない場合は0
      return 0;
    }
    
    const memberStock = memberProduct.physical_quantity || 0;
    const availableSets = Math.floor(memberStock / requiredQty);
    
    minAvailable = Math.min(minAvailable, availableSets);
  }
  
  return minAvailable === Infinity ? 0 : minAvailable;
}

export function useInventoryData() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [filter, setFilter] = useState<InventoryFilter>({});
  const [pendingCount, setPendingCount] = useState(0);
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'created_at', order: 'desc' });

  const supabase = createClient();

  // データ読み込み（ページネーション対応）
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 全件取得（1000件ずつ）
      const allProducts: any[] = [];
      let from = 0;
      const chunkSize = 1000;
      let hasMore = true;
      
      while (hasMore) {
        const { data, error: fetchError } = await supabase
          .from('inventory_master')
          .select('*')
          .range(from, from + chunkSize - 1)
          .order('updated_at', { ascending: false });
        
        if (fetchError) throw fetchError;
        
        if (data && data.length > 0) {
          // MUG派生リスティングを除外（USD以外の通貨）
          const filteredData = data.filter(item => !isMugDerivedListing(item));
          allProducts.push(...filteredData);
          from += chunkSize;
          hasMore = data.length === chunkSize;
        } else {
          hasMore = false;
        }
        
        // 安全上限10ページ
        if (from >= 10000) {
          console.warn('[useInventoryData] 安全上限10000件に達しました');
          hasMore = false;
        }
      }
      
      // データ変換（N3表示用フィールドを追加）
      // まずIDをキーにしたMapを作成（セット販売可能数計算用）
      const productMap = new Map<string, any>();
      allProducts.forEach(item => {
        productMap.set(item.id, item);
      });
      
      const inventoryProducts: InventoryProduct[] = allProducts.map(item => {
        const sourceData = item.source_data || {};
        const marketplace = sourceData.marketplace || 'manual';
        const account = sourceData.ebay_account || sourceData.mercari_account || null;
        const images = item.images || [];
        
        // ============================================================
        // 棚卸し表示用データ変換
        // ============================================================
        
        // 原価 (cost_jpy): 手動登録専用フィールド
        // - DBのcost_priceフィールドを使用
        // - 現時点では未登録なので0として扱う
        // - 将来的に手動で原価を入力する機能を使う
        // 注意: cost_priceには何も自動で入れない。UIから手動登録のみ。
        const rawCostPrice = item.cost_price;
        let costJpy = 0;
        // cost_priceが明示的に設定されている場合のみ使用
        // ただし、selling_priceと完全一致する場合は誤データの可能性があるので除外
        if (rawCostPrice && rawCostPrice > 0 && rawCostPrice !== item.selling_price) {
          costJpy = rawCostPrice < 1000 ? rawCostPrice * EXCHANGE_RATE_USD_JPY : rawCostPrice;
        }
        
        // 在庫数 (physical_quantity): DBの値をそのまま使用
        // - 在庫数は手動で登録・修正する
        // - 将来的に連動機能を実装予定
        const physicalQuantity = item.physical_quantity || 0;
        const listingQuantity = item.listing_quantity || 0;
        let stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock' = 'out_of_stock';
        if (physicalQuantity > 5) {
          stockStatus = 'in_stock';
        } else if (physicalQuantity > 0) {
          stockStatus = 'low_stock';
        }
        
        return {
          // 元のフィールド
          id: item.id,
          unique_id: item.unique_id,
          product_name: item.product_name,
          sku: item.sku,
          product_type: item.product_type,
          physical_quantity: physicalQuantity,
          listing_quantity: item.listing_quantity || 0,
          cost_price: rawCostPrice,
          selling_price: item.selling_price || 0,
          condition_name: item.condition_name || '',
          category: item.category || '',
          subcategory: item.subcategory,
          images: images,
          source_data: sourceData,
          supplier_info: item.supplier_info,
          is_manual_entry: item.is_manual_entry ?? (marketplace === 'manual'),
          priority_score: item.priority_score || 0,
          notes: item.notes,
          created_at: item.created_at,
          updated_at: item.updated_at,
          marketplace: marketplace,
          account: account,
          date_acquired: item.date_acquired,
          target_sale_deadline: item.target_sale_deadline,
          inventory_type: item.inventory_type,
          current_price_phase: item.current_price_phase,
          parent_sku: item.parent_sku,
          variation_attributes: item.variation_attributes,
          is_variation_parent: item.is_variation_parent || false,
          is_variation_child: item.is_variation_child || false,
          is_variation_member: item.is_variation_member || false,
          variation_parent_id: item.variation_parent_id || null,
          
          // セット商品関連
          set_members: item.set_members || null,
          set_available_quantity: item.product_type === 'set' 
            ? calculateSetAvailableQuantity(item, productMap)
            : null,
          
          // N3表示用エイリアス
          title: item.product_name,
          image_url: images[0] || null,
          cost_jpy: Math.round(costJpy),
          current_stock: physicalQuantity,
          stock_status: stockStatus,
          ebay_account: account,
        };
      });
      
      setProducts(inventoryProducts);
      
      // 分類待ち件数取得
      const { count } = await supabase
        .from('stock_classification_queue')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      setPendingCount(count || 0);
      
    } catch (err: any) {
      setError(err.message || 'データ取得に失敗しました');
      console.error('Inventory load error:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // フィルタリング
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (filter.marketplace) {
      if (filter.marketplace === 'unknown') {
        result = result.filter(p => !p.marketplace || p.marketplace === 'manual');
      } else {
        result = result.filter(p => p.marketplace === filter.marketplace);
      }
    }
    if (filter.productType) {
      result = result.filter(p => p.product_type === filter.productType);
    }
    if (filter.stockStatus) {
      result = result.filter(p => p.stock_status === filter.stockStatus);
    }
    if (filter.condition) {
      result = result.filter(p => p.condition_name?.toLowerCase() === filter.condition?.toLowerCase());
    }
    if (filter.category) {
      if (filter.category === 'unknown') {
        result = result.filter(p => !p.category);
      } else {
        result = result.filter(p => p.category === filter.category);
      }
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(p => 
        p.product_name?.toLowerCase().includes(searchLower) ||
        p.sku?.toLowerCase().includes(searchLower) ||
        p.unique_id?.toLowerCase().includes(searchLower)
      );
    }
    if (filter.ebayAccount) {
      if (filter.ebayAccount === 'manual') {
        result = result.filter(p => p.marketplace === 'manual' || p.is_manual_entry || !p.ebay_account);
      } else {
        result = result.filter(p => p.ebay_account?.toLowerCase() === filter.ebayAccount?.toLowerCase());
      }
    }
    if (filter.site) {
      result = result.filter(p => p.source_data?.site === filter.site);
    }
    if (filter.pricePhase) {
      result = result.filter(p => p.current_price_phase === filter.pricePhase);
    }
    if (filter.variationStatus) {
      switch (filter.variationStatus) {
        case 'parent':
          result = result.filter(p => p.is_variation_parent);
          break;
        case 'member':
          result = result.filter(p => p.is_variation_member || p.is_variation_child);
          break;
        case 'standalone':
          result = result.filter(p => !p.is_variation_parent && !p.is_variation_member && !p.is_variation_child);
          break;
      }
    }
    if (filter.daysHeldMin !== undefined || filter.daysHeldMax !== undefined) {
      const now = Date.now();
      result = result.filter(p => {
        if (!p.date_acquired) return false;
        const days = Math.floor((now - new Date(p.date_acquired).getTime()) / (1000 * 60 * 60 * 24));
        if (filter.daysHeldMin !== undefined && days < filter.daysHeldMin) return false;
        if (filter.daysHeldMax !== undefined && days > filter.daysHeldMax) return false;
        return true;
      });
    }
    
    // 在庫タイプフィルター
    if (filter.inventoryType) {
      result = result.filter(p => p.inventory_type === filter.inventoryType);
    }
    
    // ソート適用
    result.sort((a, b) => {
      let aVal: any;
      let bVal: any;
      
      switch (sortOption.field) {
        case 'created_at':
          aVal = a.created_at ? new Date(a.created_at).getTime() : 0;
          bVal = b.created_at ? new Date(b.created_at).getTime() : 0;
          break;
        case 'updated_at':
          aVal = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          bVal = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          break;
        case 'product_name':
          aVal = a.product_name?.toLowerCase() || '';
          bVal = b.product_name?.toLowerCase() || '';
          break;
        case 'sku':
          aVal = a.sku?.toLowerCase() || '';
          bVal = b.sku?.toLowerCase() || '';
          break;
        case 'cost_price':
          aVal = a.cost_price || 0;
          bVal = b.cost_price || 0;
          break;
        case 'selling_price':
          aVal = a.selling_price || 0;
          bVal = b.selling_price || 0;
          break;
        case 'physical_quantity':
          aVal = a.physical_quantity || 0;
          bVal = b.physical_quantity || 0;
          break;
        default:
          aVal = a.created_at ? new Date(a.created_at).getTime() : 0;
          bVal = b.created_at ? new Date(b.created_at).getTime() : 0;
      }
      
      if (typeof aVal === 'string') {
        return sortOption.order === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return sortOption.order === 'asc' ? aVal - bVal : bVal - aVal;
    });
    
    return result;
  }, [products, filter, sortOption]);

  // 統計計算
  const stats = useMemo((): InventoryStats => {
    const all = filteredProducts;
    
    return {
      totalCount: all.length,
      inStockCount: all.filter(p => p.physical_quantity > 0).length,
      mjtCount: all.filter(p => p.ebay_account?.toLowerCase() === 'mjt').length,
      greenCount: all.filter(p => p.ebay_account?.toLowerCase() === 'green').length,
      totalCostJpy: all.reduce((sum, p) => sum + ((p.cost_jpy || 0) * (p.physical_quantity || 0)), 0),
      variationCandidateCount: all.filter(p => 
        p.category && 
        p.physical_quantity > 0 && 
        !p.is_variation_parent &&
        !p.is_variation_member &&
        !p.is_variation_child &&
        p.product_type !== 'set'
      ).length,
      variationParentCount: all.filter(p => p.is_variation_parent).length,
      variationMemberCount: all.filter(p => p.is_variation_member || p.is_variation_child).length,
      standaloneCount: all.filter(p => 
        !p.is_variation_parent && 
        !p.is_variation_member && 
        !p.is_variation_child &&
        p.product_type !== 'set'
      ).length,
      setCount: all.filter(p => p.product_type === 'set').length,
    };
  }, [filteredProducts]);

  // カテゴリ一覧
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  // ページネーション
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // フィルター変更時にページをリセット
  const handleSetFilter = useCallback((newFilter: InventoryFilter | ((prev: InventoryFilter) => InventoryFilter)) => {
    setFilter(newFilter);
    setCurrentPage(1);
  }, []);

  // 表示件数変更時にページをリセット
  const handleSetItemsPerPage = useCallback((newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  }, []);

  // リフレッシュ
  const refreshData = useCallback(async () => {
    await loadProducts();
  }, [loadProducts]);

  // ローカル商品データ更新（DB更新後の即時反映用）
  const updateLocalProduct = useCallback((id: string, updates: Partial<InventoryProduct>) => {
    setProducts(prev => prev.map(p => {
      if (String(p.id) === id) {
        // 在庫数更新の場合、関連フィールドも更新
        if (updates.physical_quantity !== undefined) {
          const newQty = updates.physical_quantity;
          let stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock' = 'out_of_stock';
          if (newQty > 5) stockStatus = 'in_stock';
          else if (newQty > 0) stockStatus = 'low_stock';
          
          return {
            ...p,
            ...updates,
            current_stock: newQty,
            stock_status: stockStatus,
          };
        }
        return { ...p, ...updates };
      }
      return p;
    }));
  }, []);

  return {
    // データ
    products,
    filteredProducts,
    paginatedProducts,
    
    // 統計
    stats,
    categories,
    
    // 状態
    loading,
    error,
    pendingCount,
    
    // ページネーション
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
    setItemsPerPage: handleSetItemsPerPage,
    
    // フィルター
    filter,
    setFilter: handleSetFilter,
    
    // アクション
    loadProducts,
    refreshData,
    updateLocalProduct,
    
    // ソート
    sortOption,
    setSortOption,
  };
}
