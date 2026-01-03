// app/(external)/stocktake/hooks/use-stocktake.ts
/**
 * 外注用棚卸しフック（ページネーション対応版）
 * 
 * 改善点:
 * 1. 全件取得（ページネーションのため）
 * 2. サーバーサイド検索
 * 3. 楽観的UI更新
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

// MUG除外パターン
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

export interface StocktakeProduct {
  id: string;
  sku: string;
  product_name: string;
  physical_quantity: number;
  storage_location?: string;
  images?: string[];
  thumbnail_url?: string;
  source_data?: any;
  ebay_data?: any;
  inventory_type?: string;
  created_at: string;
  updated_at: string;
  isStocktakeRegistered?: boolean;
}

export interface StocktakeStats {
  totalCount: number;
  totalQuantity: number;
  totalImages: number;
  todayCount: number;
  stocktakeCount: number;
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

  // 統計情報（メモ化）
  const stats = useMemo((): StocktakeStats => {
    const today = new Date().toDateString();
    const stocktakeProducts = products.filter(p => p.isStocktakeRegistered);
    
    return {
      totalCount: totalCount || products.length,
      totalQuantity: products.reduce((sum, p) => sum + (p.physical_quantity || 0), 0),
      totalImages: stocktakeProducts.reduce((sum, p) => sum + (p.images?.length || 0), 0),
      todayCount: stocktakeProducts.filter(p => {
        const created = p.source_data?.stocktake_registered_at || p.created_at;
        return new Date(created).toDateString() === today;
      }).length,
      stocktakeCount: stocktakeProducts.length,
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
    return {
      id: item.id,
      sku: item.sku || '',
      product_name: item.product_name || '',
      physical_quantity: item.physical_quantity || 0,
      storage_location: item.storage_location || 'env',
      images: item.images || [],
      thumbnail_url: getThumbnailUrl(firstImage),
      source_data: item.source_data,
      ebay_data: item.ebay_data,
      inventory_type: item.inventory_type,
      created_at: item.created_at,
      updated_at: item.updated_at,
      isStocktakeRegistered: item.source_data?.created_by === 'stocktake_tool',
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
          .select('id, sku, product_name, physical_quantity, storage_location, images, source_data, ebay_data, inventory_type, created_at, updated_at')
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
        .select('id, sku, product_name, physical_quantity, storage_location, images, source_data, inventory_type, created_at, updated_at')
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
    storage_location?: string 
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
    
    loadProducts,
    loadMore,
    search,
    createProduct,
    updateQuantity,
    updateLocation,
    addImage,
    uploadImage,
    updateProduct,
  };
}
