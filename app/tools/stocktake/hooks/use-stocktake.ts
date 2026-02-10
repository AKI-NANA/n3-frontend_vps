// app/tools/stocktake/hooks/use-stocktake.ts
/**
 * 外注用棚卸しフック
 * 
 * 機能:
 * - inventory_masterからplus1の商品を取得
 * - 新規商品登録（画像、数、タイトル、色、サイズ）
 * - 商品情報の編集
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface StocktakeProduct {
  id: string;
  sku: string;
  product_name: string;
  title?: string;
  physical_quantity: number;
  cost_jpy?: number;
  cost_price?: number;
  storage_location: string;
  images?: string[];
  image_url?: string;
  source_data?: {
    color?: string;
    size?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

// ヘルパー: source_dataからcolor/sizeを取得
export function getProductColor(product: StocktakeProduct): string | undefined {
  return product.source_data?.color;
}

export function getProductSize(product: StocktakeProduct): string | undefined {
  return product.source_data?.size;
}

export interface NewProductInput {
  product_name: string;
  physical_quantity: number;
  color?: string;
  size?: string;
  image_url?: string;
}

export function useStocktake() {
  const [products, setProducts] = useState<StocktakeProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // 統計
  const stats = {
    totalCount: products.length,
    totalQuantity: products.reduce((sum, p) => sum + (p.physical_quantity || 0), 0),
    todayCount: products.filter(p => {
      const created = new Date(p.created_at);
      const today = new Date();
      return created.toDateString() === today.toDateString();
    }).length,
  };

  // plus1の商品を取得（または全件取得してフィルタ）
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      console.log('[Stocktake] Loading products...');

      // plus1の商品を取得
      const { data, error: fetchError } = await supabase
        .from('inventory_master')
        .select('*')
        .eq('storage_location', 'plus1')
        .order('created_at', { ascending: false })
        .limit(100);

      if (fetchError) {
        console.error('[Stocktake] Fetch error:', fetchError);
        throw fetchError;
      }

      console.log('[Stocktake] Loaded products:', data?.length || 0);
      
      setProducts(data || []);
    } catch (err: any) {
      console.error('[Stocktake] Load products error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初回読み込み
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // 新規商品登録
  const createProduct = useCallback(async (input: NewProductInput): Promise<{ success: boolean; error?: string; product?: StocktakeProduct }> => {
    setSaving(true);

    try {
      const supabase = createClient();

      // SKU自動生成（PLUS1-YYYYMMDD-XXXX形式）
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      
      // 今日のSKU数を取得
      const { count } = await supabase
        .from('inventory_master')
        .select('*', { count: 'exact', head: true })
        .like('sku', `PLUS1-${dateStr}-%`);

      const seq = ((count || 0) + 1).toString().padStart(4, '0');
      const sku = `PLUS1-${dateStr}-${seq}`;

      // タイトル生成（色・サイズがあれば追加）
      let fullTitle = input.product_name;
      if (input.color) fullTitle += ` ${input.color}`;
      if (input.size) fullTitle += ` ${input.size}`;

      const { data, error: insertError } = await supabase
        .from('inventory_master')
        .insert({
          sku,
          unique_id: sku,
          product_name: fullTitle,
          title: fullTitle,
          physical_quantity: input.physical_quantity,
          listing_quantity: input.physical_quantity,
          storage_location: 'plus1',
          images: input.image_url ? [input.image_url] : [],
          image_url: input.image_url || null,
          is_manual_entry: true,
          product_type: 'single',
          inventory_type: 'stock',
          marketplace: 'manual',
          source_data: {
            marketplace: 'plus1_stocktake',
            created_by: 'stocktake_tool',
            created_at: new Date().toISOString(),
            color: input.color || null,
            size: input.size || null,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // ローカル状態を更新
      setProducts(prev => [data, ...prev]);

      return { success: true, product: data };
    } catch (err: any) {
      console.error('Create product error:', err);
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, []);

  // 商品情報更新
  const updateProduct = useCallback(async (
    id: string, 
    updates: Partial<Pick<StocktakeProduct, 'product_name' | 'physical_quantity' | 'image_url'>> & {
      color?: string;
      size?: string;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    setSaving(true);

    try {
      const supabase = createClient();

      // タイトル再生成（色・サイズがあれば）
      const currentProduct = products.find(p => p.id === id);
      if (!currentProduct) throw new Error('商品が見つかりません');

      const newName = updates.product_name ?? currentProduct.product_name;
      const newColor = updates.color ?? getProductColor(currentProduct);
      const newSize = updates.size ?? getProductSize(currentProduct);

      let fullTitle = newName;
      if (newColor) fullTitle += ` ${newColor}`;
      if (newSize) fullTitle += ` ${newSize}`;

      // source_dataをマージ
      const currentSourceData = currentProduct.source_data || {};
      const newSourceData = {
        ...currentSourceData,
        color: newColor || null,
        size: newSize || null,
        updated_at: new Date().toISOString(),
      };

      const updateData: any = {
        title: fullTitle,
        product_name: fullTitle,
        source_data: newSourceData,
        updated_at: new Date().toISOString(),
      };

      if (updates.physical_quantity !== undefined) {
        updateData.physical_quantity = updates.physical_quantity;
        updateData.listing_quantity = updates.physical_quantity;
      }

      // 画像更新時はimages配列も更新
      if (updates.image_url) {
        updateData.images = [updates.image_url];
        updateData.image_url = updates.image_url;
      }

      const { error: updateError } = await supabase
        .from('inventory_master')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      // ローカル状態を更新
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, ...updateData } : p
      ));

      return { success: true };
    } catch (err: any) {
      console.error('Update product error:', err);
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [products]);

  // 在庫数のみ更新（クイック更新）
  const updateQuantity = useCallback(async (id: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('inventory_master')
        .update({
          physical_quantity: quantity,
          listing_quantity: quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // ローカル状態を更新
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, physical_quantity: quantity } : p
      ));

      return { success: true };
    } catch (err: any) {
      console.error('Update quantity error:', err);
      return { success: false, error: err.message };
    }
  }, []);

  // 画像アップロード
  const uploadImage = useCallback(async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      const supabase = createClient();

      const timestamp = Date.now();
      const extension = file.name.split('.').pop() || 'jpg';
      const fileName = `stocktake_${timestamp}.${extension}`;

      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(`stocktake/${fileName}`, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(`stocktake/${fileName}`);

      return { success: true, url: urlData.publicUrl };
    } catch (err: any) {
      console.error('Upload image error:', err);
      return { success: false, error: err.message };
    }
  }, []);

  return {
    products,
    loading,
    error,
    saving,
    stats,
    loadProducts,
    createProduct,
    updateProduct,
    updateQuantity,
    uploadImage,
  };
}
