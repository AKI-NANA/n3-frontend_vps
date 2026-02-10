// app/tools/editing-n3/hooks/use-inventory-sync.ts
/**
 * 棚卸し同期フック - 既存APIを使用した同期操作
 * 
 * 既存API（変更禁止）:
 * - /api/sync/ebay-trading
 * - /api/sync/ebay-incremental
 * - /api/sync/mercari-to-inventory
 * - /api/inventory/bulk-delete
 */

'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useInventorySync() {
  // 同期状態
  const [ebaySyncingMjt, setEbaySyncingMjt] = useState(false);
  const [ebaySyncingGreen, setEbaySyncingGreen] = useState(false);
  const [incrementalSyncing, setIncrementalSyncing] = useState(false);
  const [mercariSyncing, setMercariSyncing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // eBay完全同期
  const syncEbay = useCallback(async (account: 'mjt' | 'green' | 'all') => {
    if (account === 'mjt' || account === 'all') setEbaySyncingMjt(true);
    if (account === 'green' || account === 'all') setEbaySyncingGreen(true);
    
    try {
      const accounts = account === 'all' ? ['mjt', 'green'] : [account];
      
      for (const acc of accounts) {
        const response = await fetch('/api/sync/ebay-trading', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: acc }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `${acc.toUpperCase()} 同期に失敗しました`);
        }
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('eBay sync error:', error);
      return { success: false, error: error.message };
    } finally {
      setEbaySyncingMjt(false);
      setEbaySyncingGreen(false);
    }
  }, []);

  // eBay増分同期
  const syncEbayIncremental = useCallback(async (account: 'mjt' | 'green' | 'all') => {
    setIncrementalSyncing(true);
    
    try {
      const accounts = account === 'all' ? ['mjt', 'green'] : [account];
      
      for (const acc of accounts) {
        const response = await fetch('/api/sync/ebay-incremental', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: acc }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `${acc.toUpperCase()} 増分同期に失敗しました`);
        }
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('eBay incremental sync error:', error);
      return { success: false, error: error.message };
    } finally {
      setIncrementalSyncing(false);
    }
  }, []);

  // メルカリ同期
  const syncMercari = useCallback(async () => {
    setMercariSyncing(true);
    
    try {
      const response = await fetch('/api/sync/mercari-to-inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'メルカリ同期に失敗しました');
      }
      
      const result = await response.json();
      return { success: true, ...result };
    } catch (error: any) {
      console.error('Mercari sync error:', error);
      return { success: false, error: error.message };
    } finally {
      setMercariSyncing(false);
    }
  }, []);

  // 一括削除
  const bulkDelete = useCallback(async (target: 'out_of_stock' | 'sold' | 'selected', ids?: string[]) => {
    setDeleting(true);
    
    try {
      const response = await fetch('/api/inventory/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, ids }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '削除に失敗しました');
      }
      
      const result = await response.json();
      // APIは deleted オブジェクト（inventory_master, products_master, total）を返す
      const deletedCount = typeof result.deleted === 'object' 
        ? result.deleted.total || result.deleted.inventory_master || 0
        : result.deleted || 0;
      return { success: true, deleted: deletedCount };
    } catch (error: any) {
      console.error('Bulk delete error:', error);
      return { success: false, error: error.message };
    } finally {
      setDeleting(false);
    }
  }, []);

  // 在庫数更新
  const updateStock = useCallback(async (id: string, newQuantity: number) => {
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('inventory_master')
        .update({ 
          physical_quantity: newQuantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Stock update error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // 原価更新
  const updateCost = useCallback(async (id: string, newCost: number) => {
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('inventory_master')
        .update({ 
          cost_price: newCost,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error: any) {
      console.error('Cost update error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // 管理対象外にする（is_inactiveフラグ設定）
  const deactivateItem = useCallback(async (id: string) => {
    try {
      const response = await fetch('/api/inventory/deactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '管理対象外設定に失敗しました');
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Deactivate error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // 在庫タイプ切替（有在庫 ⇔ 無在庫）
  const toggleInventoryType = useCallback(async (id: string, newType: 'stock' | 'mu') => {
    try {
      const response = await fetch('/api/inventory/toggle-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, new_type: newType }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '在庫タイプ切替に失敗しました');
      }
      
      const result = await response.json();
      return { success: true, updated: result.updated };
    } catch (error: any) {
      console.error('Toggle inventory type error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  // 新規商品作成（手動登録）
  const createProduct = useCallback(async (productData: {
    product_name: string;
    sku?: string;
    physical_quantity: number;
    cost_price: number;
    selling_price?: number;
    condition_name?: string;
    category?: string;
    notes?: string;
  }) => {
    try {
      // SKUがない場合は自動生成
      const sku = productData.sku || `MANUAL-${Date.now()}`;
      
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('inventory_master')
        .insert({
          product_name: productData.product_name,
          sku: sku,
          unique_id: sku,
          physical_quantity: productData.physical_quantity,
          listing_quantity: productData.physical_quantity,
          cost_price: productData.cost_price,
          selling_price: productData.selling_price || 0,
          condition_name: productData.condition_name || 'New',
          category: productData.category || null,
          notes: productData.notes || null,
          is_manual_entry: true,
          product_type: 'single',
          marketplace: 'manual',
          source_data: {
            marketplace: 'manual',
            created_by: 'n3_frontend',
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
  }, []);

  return {
    // 状態
    ebaySyncingMjt,
    ebaySyncingGreen,
    incrementalSyncing,
    mercariSyncing,
    deleting,
    
    // アクション
    syncEbay,
    syncEbayIncremental,
    syncMercari,
    bulkDelete,
    updateStock,
    updateCost,
    deactivateItem,
    createProduct,
    toggleInventoryType,
  };
}
