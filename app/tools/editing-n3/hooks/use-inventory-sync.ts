// app/tools/editing-n3/hooks/use-inventory-sync.ts
/**
 * 棚卸し同期フック - 完全版
 * 
 * 機能:
 * - SKU自動生成 (generateSku): PREFIX-DATE-SEQ 形式 (例: PLUS1-20241220-0001)
 * - 商品作成 (createProduct): inventory_type対応
 * - 画像更新 (updateProductImages): images(jsonb) と inventory_images(text[]) 両方を確実に更新
 */

'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useInventorySync() {
  const [ebaySyncingMjt, setEbaySyncingMjt] = useState(false);
  const [ebaySyncingGreen, setEbaySyncingGreen] = useState(false);
  const [incrementalSyncing, setIncrementalSyncing] = useState(false);
  const [mercariSyncing, setMercariSyncing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ----------------------------------------------------------------
  // 1. SKU自動生成ロジック (正規ルール)
  // ----------------------------------------------------------------
  const generateSku = useCallback(async (prefix: string = 'PLUS1') => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const baseSku = `${prefix}-${dateStr}`;

    // 同じ日のSKUの最大値を探す
    const { count } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .ilike('sku', `${baseSku}-%`);

    // 既存数+1 を連番とする (0001, 0002...)
    const seq = ((count || 0) + 1).toString().padStart(4, '0');
    return `${baseSku}-${seq}`;
  }, []);

  // ----------------------------------------------------------------
  // 2. 新規商品作成（L4属性・その他経費対応）
  // ----------------------------------------------------------------
  const createProduct = useCallback(async (productData: {
    product_name: string;
    sku?: string;
    physical_quantity: number;
    cost_price?: number;
    selling_price?: number;
    condition_name?: string;
    storage_location?: string;
    inventory_type?: 'stock' | 'mu' | 'dropship';
    product_type?: string;
    source_type?: string;
    images?: string[];
    category?: string;
    notes?: string;
    counted_by?: string;
    // L4属性: 販売予定販路
    attr_l4?: string[];
    // その他経費（JSONB）
    additional_costs?: Record<string, number>;
  }) => {
    try {
      // SKUがない場合は正規ルールで生成
      const sku = productData.sku || await generateSku('MANUAL');
      
      // その他経費の合計を計算
      const additionalCostsSum = productData.additional_costs 
        ? Object.values(productData.additional_costs).reduce((sum, val) => sum + (val || 0), 0)
        : 0;
      const totalCostJpy = (productData.cost_price || 0) + additionalCostsSum;

      const { data, error } = await supabase
        .from('inventory_master')
        .insert({
          product_name: productData.product_name,
          sku: sku,
          unique_id: sku,
          physical_quantity: productData.physical_quantity,
          listing_quantity: productData.physical_quantity,
          cost_price: productData.cost_price || 0,
          selling_price: productData.selling_price || 0,
          condition_name: productData.condition_name || 'New',
          storage_location: productData.storage_location || 'plus1',
          
          // 型定義に合わせて値を設定
          inventory_type: productData.inventory_type || 'stock',
          product_type: productData.product_type || 'single',
          
          // 画像: 初期登録時は空でも良いが、あれば入れる
          images: productData.images || [], 
          inventory_images: productData.images || [], 

          category: productData.category || null,
          notes: productData.notes || null,
          counted_by: productData.counted_by || null,
          
          // L4属性: 販売予定販路（配列）
          attr_l4: productData.attr_l4 || [],
          
          // その他経費（JSONB）
          additional_costs: productData.additional_costs || {},
          
          // 総原価（原価 + 経費合計）- トリガーでも計算されるがフロントでも設定
          total_cost_jpy: totalCostJpy,

          is_manual_entry: true,
          marketplace: 'manual',
          source_data: {
            marketplace: 'manual',
            created_by: 'n3_frontend',
            source_type: productData.source_type || 'manual',
            created_at: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, product: data };
    } catch (error: any) {
      console.error('Create product error:', error);
      return { success: false, error: error.message };
    }
  }, [generateSku]);

  // ----------------------------------------------------------------
  // 3. 画像URL更新 (アップロード後に必ず呼び出す)
  // ----------------------------------------------------------------
  const updateProductImages = useCallback(async (id: string, imageUrls: string[]) => {
    try {
      // images (jsonb) と inventory_images (text[]) の両方を更新
      const { error } = await supabase
        .from('inventory_master')
        .update({
          images: imageUrls,           
          inventory_images: imageUrls, 
          image_url: imageUrls[0] || null, // メイン画像も更新
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Update images error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // ----------------------------------------------------------------
  // 4. 画像アップロード（ファイルを受け取り、StorageにアップロードしてURLを返す）
  // ----------------------------------------------------------------
  const uploadImage = useCallback(async (id: string, file: File): Promise<string | null> => {
    try {
      // 1. Supabase Storageにアップロード
      const timestamp = Date.now();
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `inventory/${id}/${timestamp}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      // 2. 公開URLを取得
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // 3. 現在の画像リストを取得して追加
      const { data: product } = await supabase
        .from('inventory_master')
        .select('images')
        .eq('id', id)
        .single();

      const currentImages = product?.images || [];
      const newImages = [...currentImages, imageUrl];

      // 4. DBを更新
      await updateProductImages(id, newImages);

      return imageUrl;
    } catch (error) {
      console.error('Upload image error:', error);
      return null;
    }
  }, [updateProductImages]);

  // --- 既存の同期機能 (変更なし) ---
  const syncEbay = useCallback(async (account: 'mjt' | 'green' | 'all') => {
    if (account === 'mjt' || account === 'all') setEbaySyncingMjt(true);
    if (account === 'green' || account === 'all') setEbaySyncingGreen(true);
    try {
      const accounts = account === 'all' ? ['mjt', 'green'] : [account];
      for (const acc of accounts) {
        await fetch('/api/sync/ebay-trading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: acc }),
        });
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setEbaySyncingMjt(false);
      setEbaySyncingGreen(false);
    }
  }, []);

  const syncEbayIncremental = useCallback(async (account: 'mjt' | 'green' | 'all') => {
    setIncrementalSyncing(true);
    try {
      const accounts = account === 'all' ? ['mjt', 'green'] : [account];
      for (const acc of accounts) {
        await fetch('/api/sync/ebay-incremental', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: acc }),
        });
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIncrementalSyncing(false);
    }
  }, []);

  const syncMercari = useCallback(async () => {
    setMercariSyncing(true);
    try {
      await fetch('/api/sync/mercari-to-inventory', { method: 'POST' });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setMercariSyncing(false);
    }
  }, []);

  const bulkDelete = useCallback(async (target: 'out_of_stock' | 'sold' | 'selected', ids?: string[]) => {
    setDeleting(true);
    try {
      const response = await fetch('/api/inventory/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, ids }),
      });
      const result = await response.json();
      return { success: true, deleted: result.deleted || 0 };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setDeleting(false);
    }
  }, []);

  const updateStock = useCallback(async (id: string, q: number) => { 
    const { error } = await supabase.from('inventory_master').update({ physical_quantity: q, updated_at: new Date().toISOString() }).eq('id', id);
    return error ? { success: false, error: error.message } : { success: true };
  }, []);

  const updateCost = useCallback(async (id: string, c: number) => {
    const { error } = await supabase.from('inventory_master').update({ cost_price: c, updated_at: new Date().toISOString() }).eq('id', id);
    return error ? { success: false, error: error.message } : { success: true };
  }, []);

  const updateStorageLocation = useCallback(async (id: string, l: string) => {
    const { error } = await supabase.from('inventory_master').update({ storage_location: l, updated_at: new Date().toISOString() }).eq('id', id);
    return error ? { success: false, error: error.message } : { success: true };
  }, []);

  const toggleInventoryType = useCallback(async (id: string, t: string) => {
    const { error } = await supabase.from('inventory_master').update({ inventory_type: t, updated_at: new Date().toISOString() }).eq('id', id);
    return error ? { success: false, error: error.message } : { success: true };
  }, []);

  const deactivateItem = useCallback(async (id: string) => {
    await fetch('/api/inventory/deactivate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return { success: true };
  }, []);

  return {
    ebaySyncingMjt, ebaySyncingGreen, incrementalSyncing, mercariSyncing, deleting,
    syncEbay, syncEbayIncremental, syncMercari, bulkDelete,
    updateStock, updateCost, updateStorageLocation, deactivateItem, toggleInventoryType,
    // 追加機能
    createProduct,
    generateSku,
    updateProductImages,
    uploadImage,
  };
}