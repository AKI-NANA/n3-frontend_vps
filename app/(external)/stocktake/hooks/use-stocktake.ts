// app/(external)/stocktake/hooks/use-stocktake.ts
/**
 * 外注用棚卸しフック（ページネーション対応版 + フラグ管理機能）
 * 
 * 機能:
 * 1. 全件取得（ページネーションのため）
 * 2. サーバーサイド検索
 * 3. 楽観的UI更新
 * 4. 要確認フラグ・確定フラグ・メモ管理
 * 5. 保管場所別統計
 */

'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export const STORAGE_LOCATIONS = [
  { value: 'plus1', label: 'Plus1' },
  { value: 'env', label: 'ENV' },
  { value: 'yao', label: '八尾' },
  { value: 'warehouse_a', label: '倉庫A' },
  { value: 'warehouse_b', label: '倉庫B' },
  { value: 'other', label: 'その他' },
];

// MUG除外パターン（USD以外の通貨のみ除外）
const MUG_NON_ENGLISH_PATTERNS = [
  /\bKarten\b/i, /\bSumpf\b/i, /\bKomplett\b/i, /\bActionfigur\b/i,
  /\bCarta\b/i, /\bCarte\b/i, /\bgiapponese\b/i, /\bFigurine\b/i,
  /\bcartas\b/i, /\bFigura de acción\b/i, /\bActiefiguur\b/i, /\bFigurka\b/i,
];

function isMugDerivedListing(item: any): boolean {
  const currency = item.ebay_data?.currency;
  if (currency && currency !== 'USD') return true;
  const title = item.product_name || '';
  if (MUG_NON_ENGLISH_PATTERNS.some(p => p.test(title))) return true;
  return false;
}

// 保管場所詳細（JSONB構造）
export interface LocationDetail {
  location: string;
  qty: number;
}

export interface StocktakeProduct {
  id: string;
  sku: string;
  product_name: string;
  physical_quantity: number;
  storage_location?: string;  // レガシー（互換性維持）
  location_details?: LocationDetail[];  // 新規：複数拠点対応
  images?: string[];
  thumbnail_url?: string;
  source_data?: any;
  ebay_data?: any;
  inventory_type?: string;
  created_at: string;
  updated_at: string;
  isStocktakeRegistered?: boolean;
  // L1-L4属性
  attr_l1?: string;
  attr_l2?: string;
  attr_l3?: string;
  attr_l4?: string[];
  // 新規追加: フラグ・メモ
  needs_count_check?: boolean;  // 要確認フラグ
  stock_confirmed?: boolean;    // 確定フラグ
  stock_memo?: string;          // メモ
}

// 保管場所別統計
export interface LocationStat {
  count: number;      // 商品数
  quantity: number;   // 総個数
}

export interface StocktakeStats {
  totalCount: number;
  totalQuantity: number;
  totalImages: number;
  todayCount: number;
  stocktakeCount: number;
  // 新規追加
  needsCheckCount: number;      // 要確認件数
  confirmedCount: number;       // 確定件数
  locationStats: Record<string, LocationStat>;  // 保管場所別統計
}

// 一度に取得する最大件数
const CHUNK_SIZE = 1000;
const MAX_ITEMS = 10000;

export function useStocktake() {
  const [products, setProducts] = useState<StocktakeProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const loadedRef = useRef(false);
  const loadingRef = useRef(false);

  const supabase = createClient();

  // 統計情報（メモ化）- 保管場所別統計を追加
  const stats = useMemo((): StocktakeStats => {
    const today = new Date().toDateString();
    const stocktakeProducts = products.filter(p => p.isStocktakeRegistered);
    
    // 保管場所別統計を計算
    const locationStats: Record<string, LocationStat> = {};
    
    // 全保管場所を初期化
    STORAGE_LOCATIONS.forEach(loc => {
      locationStats[loc.value] = { count: 0, quantity: 0 };
    });
    locationStats['未設定'] = { count: 0, quantity: 0 };
    
    // 集計
    products.forEach(p => {
      const loc = p.storage_location || '未設定';
      if (!locationStats[loc]) {
        locationStats[loc] = { count: 0, quantity: 0 };
      }
      locationStats[loc].count += 1;
      locationStats[loc].quantity += (p.physical_quantity || 0);
    });
    
    return {
      totalCount: totalCount || products.length,
      totalQuantity: products.reduce((sum, p) => sum + (p.physical_quantity || 0), 0),
      totalImages: stocktakeProducts.reduce((sum, p) => sum + (p.images?.length || 0), 0),
      todayCount: stocktakeProducts.filter(p => {
        const created = p.source_data?.stocktake_registered_at || p.created_at;
        return new Date(created).toDateString() === today;
      }).length,
      stocktakeCount: stocktakeProducts.length,
      // 新規追加
      needsCheckCount: products.filter(p => p.needs_count_check).length,
      confirmedCount: products.filter(p => p.stock_confirmed).length,
      locationStats,
    };
  }, [products, totalCount]);

  // サムネイルURL生成
  const getThumbnailUrl = useCallback((imageUrl: string): string => {
    if (!imageUrl) return '';
    if (imageUrl.includes('supabase.co/storage')) {
      const url = new URL(imageUrl);
      url.searchParams.set('width', '150');
      url.searchParams.set('height', '150');
      url.searchParams.set('resize', 'contain');
      return url.toString();
    }
    return imageUrl;
  }, []);

  // 商品データをマッピング
  const mapProduct = useCallback((item: any): StocktakeProduct => {
    const firstImage = item.images?.[0] || '';
    
    // location_details から storage_location を導出（複数ある場合は最初のもの）
    let storageLocation = item.storage_location || '未設定';
    let locationDetails: LocationDetail[] = item.location_details || [];
    
    // location_details が空なら storage_location から生成
    if (!locationDetails.length && storageLocation && storageLocation !== '未設定') {
      locationDetails = [{ location: storageLocation, qty: item.physical_quantity || 0 }];
    }
    
    // location_details があればそこから storage_location を設定
    if (locationDetails.length > 0) {
      storageLocation = locationDetails[0].location || '未設定';
    }
    
    return {
      id: item.id,
      sku: item.sku || '',
      product_name: item.product_name || '',
      physical_quantity: item.physical_quantity || 0,
      storage_location: storageLocation,
      location_details: locationDetails,
      images: item.images || [],
      thumbnail_url: getThumbnailUrl(firstImage),
      source_data: item.source_data,
      ebay_data: item.ebay_data,
      inventory_type: item.inventory_type,
      created_at: item.created_at,
      updated_at: item.updated_at,
      isStocktakeRegistered: item.source_data?.created_by === 'stocktake_tool',
      // L1-L4属性
      attr_l1: item.attr_l1,
      attr_l2: item.attr_l2,
      attr_l3: item.attr_l3,
      attr_l4: item.attr_l4,
      // 新規追加: フラグ・メモ
      needs_count_check: item.needs_count_check || false,
      stock_confirmed: item.stock_confirmed || false,
      stock_memo: item.stock_memo || '',
    };
  }, [getThumbnailUrl]);

  // 全件読み込み（チャンク分割）
  const loadProducts = useCallback(async (reset: boolean = true) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    
    setLoading(true);
    setError(null);

    try {
      console.log('[Stocktake] Loading all products...');

      // 総件数取得
      const { count } = await supabase
        .from('inventory_master')
        .select('*', { count: 'exact', head: true })
        .eq('inventory_type', 'stock');

      setTotalCount(count || 0);

      // 全件取得（チャンク分割）
      const allProducts: StocktakeProduct[] = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore && offset < MAX_ITEMS) {
        let query = supabase
          .from('inventory_master')
          .select('id, sku, product_name, physical_quantity, storage_location, location_details, images, source_data, ebay_data, inventory_type, attr_l1, attr_l2, attr_l3, attr_l4, needs_count_check, stock_confirmed, stock_memo, created_at, updated_at')
          .eq('inventory_type', 'stock')
          .order('updated_at', { ascending: false })
          .range(offset, offset + CHUNK_SIZE - 1);

        // 検索クエリがある場合
        if (searchQuery.trim()) {
          query = query.or(`product_name.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw new Error(fetchError.message);

        if (!data || data.length === 0) {
          hasMore = false;
        } else {
          // MUG除外フィルター
          const filtered = data.filter(item => !isMugDerivedListing(item));
          const mapped = filtered.map(mapProduct);
          allProducts.push(...mapped);
          offset += CHUNK_SIZE;
          hasMore = data.length === CHUNK_SIZE;
        }
      }

      setProducts(allProducts);
      setHasMore(false);

      console.log(`[Stocktake] Loaded ${allProducts.length} items total`);

    } catch (err: any) {
      console.error('[Stocktake] Load error:', err);
      setError(err?.message || 'データ取得エラー');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [supabase, searchQuery, mapProduct]);

  // 追加読み込み（互換性のため残す）
  const loadMore = useCallback(async () => {
    // ページネーション使用時は不要
  }, []);

  // 検索
  const search = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // 検索クエリ変更時に再読み込み
  useEffect(() => {
    if (loadedRef.current) {
      const timer = setTimeout(() => {
        loadProducts(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // 初回読み込み
  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true;
      loadProducts(true);
    }
  }, []);

  // =====================================================
  // 新規追加: フラグ・メモ更新メソッド
  // =====================================================

  // 要確認フラグ更新
  const updateNeedsCheck = useCallback(async (id: string, value: boolean): Promise<{ success: boolean; error?: string }> => {
    // 楽観的更新
    setProducts(prev => prev.map(p => p.id === id ? { ...p, needs_count_check: value } : p));

    try {
      const { error } = await supabase
        .from('inventory_master')
        .update({ 
          needs_count_check: value, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      // ロールバック
      loadProducts(false);
      return { success: false, error: err.message };
    }
  }, [supabase, loadProducts]);

  // 確定フラグ更新
  const updateConfirmed = useCallback(async (id: string, value: boolean): Promise<{ success: boolean; error?: string }> => {
    // 楽観的更新
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock_confirmed: value } : p));

    try {
      const { error } = await supabase
        .from('inventory_master')
        .update({ 
          stock_confirmed: value, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      loadProducts(false);
      return { success: false, error: err.message };
    }
  }, [supabase, loadProducts]);

  // メモ更新
  const updateMemo = useCallback(async (id: string, memo: string): Promise<{ success: boolean; error?: string }> => {
    // 楽観的更新
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock_memo: memo } : p));

    try {
      const { error } = await supabase
        .from('inventory_master')
        .update({ 
          stock_memo: memo, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      loadProducts(false);
      return { success: false, error: err.message };
    }
  }, [supabase, loadProducts]);

  // 一括フラグ更新
  const bulkUpdateFlags = useCallback(async (
    ids: string[], 
    updates: { needs_count_check?: boolean; stock_confirmed?: boolean }
  ): Promise<{ success: boolean; updated: number; error?: string }> => {
    if (ids.length === 0) {
      return { success: false, updated: 0, error: 'IDが指定されていません' };
    }

    // 楽観的更新
    setProducts(prev => prev.map(p => {
      if (ids.includes(p.id)) {
        return { 
          ...p, 
          ...(updates.needs_count_check !== undefined && { needs_count_check: updates.needs_count_check }),
          ...(updates.stock_confirmed !== undefined && { stock_confirmed: updates.stock_confirmed }),
        };
      }
      return p;
    }));

    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.needs_count_check !== undefined) {
        updateData.needs_count_check = updates.needs_count_check;
      }
      if (updates.stock_confirmed !== undefined) {
        updateData.stock_confirmed = updates.stock_confirmed;
      }

      const { error, count } = await supabase
        .from('inventory_master')
        .update(updateData)
        .in('id', ids);
      
      if (error) throw error;
      
      console.log(`[Stocktake] Bulk updated ${ids.length} items`);
      return { success: true, updated: ids.length };
    } catch (err: any) {
      loadProducts(false);
      return { success: false, updated: 0, error: err.message };
    }
  }, [supabase, loadProducts]);

  // =====================================================
  // 既存メソッド
  // =====================================================

  // 商品作成
  const createProduct = useCallback(async (input: {
    product_name: string;
    physical_quantity: number;
    storage_location?: string;
    images?: string[];
    color?: string;
    size?: string;
  }): Promise<{ success: boolean; error?: string; product?: StocktakeProduct }> => {
    setSaving(true);

    try {
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      
      const { count } = await supabase
        .from('inventory_master')
        .select('*', { count: 'exact', head: true })
        .like('sku', `PLUS1-${dateStr}-%`);

      const seq = ((count || 0) + 1).toString().padStart(4, '0');
      const sku = `PLUS1-${dateStr}-${seq}`;
      const now = new Date().toISOString();

      let title = input.product_name;
      if (input.color) title += ` ${input.color}`;
      if (input.size) title += ` ${input.size}`;

      const insertData = {
        sku,
        unique_id: sku,
        product_name: title,
        physical_quantity: input.physical_quantity,
        listing_quantity: input.physical_quantity,
        storage_location: input.storage_location || 'plus1',
        images: input.images || [],
        is_manual_entry: true,
        product_type: 'single',
        inventory_type: 'stock',
        needs_count_check: false,
        stock_confirmed: false,
        stock_memo: '',
        source_data: {
          created_by: 'stocktake_tool',
          stocktake_registered_at: now,
          color: input.color || null,
          size: input.size || null,
        },
        created_at: now,
        updated_at: now,
      };

      const { data, error: insertError } = await supabase
        .from('inventory_master')
        .insert(insertData)
        .select('id, sku, product_name, physical_quantity, storage_location, images, source_data, inventory_type, needs_count_check, stock_confirmed, stock_memo, created_at, updated_at')
        .single();

      if (insertError) throw insertError;

      const newProduct = mapProduct({ ...data, isStocktakeRegistered: true });

      // 楽観的更新：先頭に追加
      setProducts(prev => [newProduct, ...prev]);
      setTotalCount(prev => prev + 1);
      
      return { success: true, product: newProduct };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [supabase, mapProduct]);

  // 数量更新（楽観的更新）
  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, physical_quantity: quantity } : p));

    try {
      const { error } = await supabase
        .from('inventory_master')
        .update({ 
          physical_quantity: quantity, 
          listing_quantity: quantity, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      loadProducts(false);
      return { success: false, error: err.message };
    }
  }, [supabase, loadProducts]);

  // 保管場所更新
  const updateLocation = useCallback(async (id: string, location: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, storage_location: location } : p));

    try {
      const { error } = await supabase
        .from('inventory_master')
        .update({ storage_location: location, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      loadProducts(false);
      return { success: false, error: err.message };
    }
  }, [supabase, loadProducts]);

  // 画像追加
  const addImage = useCallback(async (id: string, imageUrl: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return { success: false, error: '商品が見つかりません' };

    const newImages = [...(product.images || []), imageUrl];
    setProducts(prev => prev.map(p => p.id === id ? { 
      ...p, 
      images: newImages,
      thumbnail_url: getThumbnailUrl(newImages[0] || '')
    } : p));

    try {
      const { error } = await supabase
        .from('inventory_master')
        .update({ images: newImages, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      loadProducts(false);
      return { success: false, error: err.message };
    }
  }, [supabase, products, loadProducts, getThumbnailUrl]);

  // 画像アップロード
  const uploadImage = useCallback(async (file: File) => {
    try {
      const fileName = `stocktake_${Date.now()}.${file.name.split('.').pop() || 'jpg'}`;
      const buffer = new Uint8Array(await file.arrayBuffer());

      const { error } = await supabase.storage
        .from('images')
        .upload(`stocktake/${fileName}`, buffer, { contentType: file.type });

      if (error) throw error;

      const { data } = supabase.storage.from('images').getPublicUrl(`stocktake/${fileName}`);
      return { success: true, url: data.publicUrl };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, [supabase]);

  // 商品更新
  const updateProduct = useCallback(async (id: string, updates: { 
    product_name?: string; 
    physical_quantity?: number; 
    storage_location?: string;
    needs_count_check?: boolean;
    stock_confirmed?: boolean;
    stock_memo?: string;
  }) => {
    setSaving(true);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));

    try {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (updates.product_name !== undefined) updateData.product_name = updates.product_name;
      if (updates.physical_quantity !== undefined) {
        updateData.physical_quantity = updates.physical_quantity;
        updateData.listing_quantity = updates.physical_quantity;
      }
      if (updates.storage_location !== undefined) updateData.storage_location = updates.storage_location;
      if (updates.needs_count_check !== undefined) updateData.needs_count_check = updates.needs_count_check;
      if (updates.stock_confirmed !== undefined) updateData.stock_confirmed = updates.stock_confirmed;
      if (updates.stock_memo !== undefined) updateData.stock_memo = updates.stock_memo;

      const { error } = await supabase.from('inventory_master').update(updateData).eq('id', id);
      if (error) throw error;

      return { success: true };
    } catch (err: any) {
      loadProducts(false);
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [supabase, loadProducts]);

  return {
    products,
    loading,
    loadingMore,
    error,
    saving,
    stats,
    hasMore,
    totalCount,
    searchQuery,
    
    // 読み込み
    loadProducts,
    loadMore,
    search,
    
    // CRUD
    createProduct,
    updateQuantity,
    updateLocation,
    addImage,
    uploadImage,
    updateProduct,
    
    // 新規追加: フラグ・メモ更新
    updateNeedsCheck,
    updateConfirmed,
    updateMemo,
    bulkUpdateFlags,
  };
}
