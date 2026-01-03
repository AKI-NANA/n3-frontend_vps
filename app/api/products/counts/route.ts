import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * タブカウントAPI v3
 * 
 * タブ定義:
 * - 全商品: inventory_master全件（MUG除外）
 * - データ編集: 全商品からデータ未完成のもの
 * - 承認待ち/承認済み/出品予約: ワークフローステータス
 * - 出品中: products_master.listing_status = 'active'（MUG除外）
 * - 有在庫: 出品中 + inventory_type = 'stock'
 * - 無在庫: 出品中 + inventory_type = 'mu'
 * - マスター: inventory_master有在庫全て（出品有無問わず）
 */

const MUG_CURRENCIES = ['GBP', 'EUR', 'CAD', 'AUD'];

function isMugCurrency(currency: string | null | undefined): boolean {
  if (!currency) return false;
  return MUG_CURRENCIES.includes(currency.toUpperCase());
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // ============================================================
    // 1. inventory_master からのデータ取得（全商品ベース）
    // ============================================================
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory_master')
      .select(`
        id, 
        inventory_type, 
        is_manual_entry, 
        images, 
        ebay_data, 
        product_name,
        title_en,
        category,
        is_variation_parent, 
        is_variation_member, 
        is_variation_child, 
        product_type, 
        physical_quantity,
        workflow_status,
        is_verified
      `);
    
    if (inventoryError) {
      console.error('[products/counts] inventory_master error:', inventoryError);
      return NextResponse.json({ success: false, error: inventoryError.message }, { status: 500 });
    }
    
    // MUGフィルタ適用（inventory_master）
    const inventory = (inventoryData || []).filter(item => {
      const currency = item.ebay_data?.currency;
      return !isMugCurrency(currency);
    });
    
    // ============================================================
    // 2. products_master からのデータ取得（出品関連）
    // ============================================================
    const { data: productsData, error: productsError } = await supabase
      .from('products_master')
      .select(`
        id, 
        title, 
        english_title, 
        ebay_category_id, 
        listing_status, 
        physical_quantity, 
        product_type, 
        inventory_master_id, 
        currency, 
        inventory_type, 
        workflow_status, 
        approval_status, 
        schedule_status, 
        scheduled_at
      `);
    
    if (productsError) {
      console.error('[products/counts] products_master error:', productsError);
    }
    
    // MUGフィルタ適用（products_master）
    const products = (productsData || []).filter(p => !isMugCurrency(p.currency));
    
    // ============================================================
    // 3. カウント計算
    // ============================================================
    
    // --- inventory_master ベースのカウント ---
    
    // 全商品: inventory_master全件（MUG除外後）
    const allCount = inventory.length;
    
    // データ編集: データ未完成（title_enまたはcategoryが未設定）
    const dataEditingCount = inventory.filter(item => {
      const hasEnglishTitle = item.title_en && item.title_en.trim() !== '';
      const hasCategory = item.category && item.category.trim() !== '';
      // 未完成 = どちらかが欠けている
      return !hasEnglishTitle || !hasCategory;
    }).length;
    
    // マスター: inventory_masterの有在庫全て（出品有無問わず）
    const masterCount = inventory.filter(item => item.inventory_type === 'stock').length;
    
    // バリエーション
    const variationCount = inventory.filter(item => 
      item.is_variation_parent === true || 
      item.is_variation_member === true || 
      item.is_variation_child === true ||
      item.product_type === 'variation_parent' ||
      item.product_type === 'variation_child'
    ).length;
    
    // セット品
    const setProductsCount = inventory.filter(item => item.product_type === 'set').length;
    
    // 在0（在庫数0）
    const outOfStockCount = inventory.filter(item => 
      item.physical_quantity === 0 || item.physical_quantity === null
    ).length;
    
    // --- products_master ベースのカウント（出品関連）---
    
    // 出品中: listing_status = 'active'
    const activeListings = products.filter(p => p.listing_status === 'active');
    const activeListingsCount = activeListings.length;
    
    // 有在庫（出品中）: 出品中 + inventory_type = 'stock'
    const inStockActiveCount = activeListings.filter(p => p.inventory_type === 'stock').length;
    
    // 無在庫（出品中）: 出品中 + inventory_type = 'mu' または未設定
    const backOrderActiveCount = activeListings.filter(p => 
      p.inventory_type === 'mu' || !p.inventory_type
    ).length;
    
    // 承認待ち: データ完成 + 未承認 + 未出品
    const approvalPendingCount = products.filter(p => 
      p.english_title && 
      p.ebay_category_id && 
      p.listing_status !== 'active' &&
      p.workflow_status !== 'approved' &&
      p.approval_status !== 'approved'
    ).length;
    
    // 承認済み: 承認済み + 未出品 + 未スケジュール
    const approvedCount = products.filter(p => 
      (p.workflow_status === 'approved' || p.approval_status === 'approved') &&
      p.listing_status !== 'active' &&
      p.schedule_status !== 'pending' &&
      !p.scheduled_at
    ).length;
    
    // 出品予約: スケジュール中
    const scheduledCount = products.filter(p => 
      (p.schedule_status === 'pending' || p.scheduled_at) &&
      p.listing_status !== 'active'
    ).length;
    
    // 下書き
    const draftCount = products.filter(p => 
      p.listing_status === 'draft' || p.product_type === 'draft'
    ).length;
    
    // 出品停止
    const delistedCount = products.filter(p => 
      p.listing_status === 'ended' || p.listing_status === 'delisted'
    ).length;
    
    // ============================================================
    // 4. レスポンス
    // ============================================================
    const counts = {
      // 全体（inventory_masterベース）
      all: allCount,
      
      // ワークフロー系
      data_editing: dataEditingCount,
      approval_pending: approvalPendingCount,
      approved: approvedCount,
      scheduled: scheduledCount,
      active_listings: activeListingsCount,
      draft: draftCount,
      delisted_only: delistedCount,
      
      // 在庫タイプ系（出品中データのみ）
      in_stock: inStockActiveCount,
      back_order_only: backOrderActiveCount,
      
      // マスター（inventory_master有在庫全て）
      in_stock_master: masterCount,
      
      // その他
      variation: variationCount,
      set_products: setProductsCount,
      out_of_stock: outOfStockCount,
    };
    
    console.log('[products/counts] カウント:', counts);
    
    return NextResponse.json({ 
      success: true, 
      counts,
      meta: {
        inventory_master_total: inventoryData?.length || 0,
        inventory_master_filtered: inventory.length,
        products_master_total: productsData?.length || 0,
        products_master_filtered: products.length,
      }
    });
  } catch (error: any) {
    console.error('[products/counts] エラー:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
