/**
 * 詳細調査API - physical_quantityの実態調査
 * GET /api/products/investigate-stock
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function fetchAllProducts(supabase: any) {
  const allProducts: any[] = [];
  const pageSize = 1000;
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    const { data, error } = await supabase
      .from('products_master')
      .select(`
        id, 
        inventory_master_id,
        currency,
        is_parent,
        listing_status,
        physical_quantity,
        is_archived,
        workflow_status,
        sku,
        title
      `)
      .range(offset, offset + pageSize - 1);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      allProducts.push(...data);
      offset += pageSize;
      hasMore = data.length === pageSize;
    } else {
      hasMore = false;
    }
  }
  
  return allProducts;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const allProducts = await fetchAllProducts(supabase);
    
    // is_parent=true のみ
    const parentRecords = allProducts.filter(p => p.is_parent === true);
    
    // ============================================================
    // physical_quantity の分布調査
    // ============================================================
    
    // 全レコード
    const stockDistAll: Record<string, number> = {};
    allProducts.forEach(p => {
      const qty = p.physical_quantity;
      const key = qty === null ? 'null' : qty === undefined ? 'undefined' : String(qty);
      stockDistAll[key] = (stockDistAll[key] || 0) + 1;
    });
    
    // is_parent=trueのみ
    const stockDistParent: Record<string, number> = {};
    parentRecords.forEach(p => {
      const qty = p.physical_quantity;
      const key = qty === null ? 'null' : qty === undefined ? 'undefined' : String(qty);
      stockDistParent[key] = (stockDistParent[key] || 0) + 1;
    });
    
    // ============================================================
    // listing_status の分布調査
    // ============================================================
    const listingStatusDistParent: Record<string, number> = {};
    parentRecords.forEach(p => {
      const status = p.listing_status || 'null';
      listingStatusDistParent[status] = (listingStatusDistParent[status] || 0) + 1;
    });
    
    // ============================================================
    // is_archived の分布調査
    // ============================================================
    const archivedDistParent: Record<string, number> = {};
    parentRecords.forEach(p => {
      const archived = String(p.is_archived);
      archivedDistParent[archived] = (archivedDistParent[archived] || 0) + 1;
    });
    
    // ============================================================
    // workflow_status の分布調査
    // ============================================================
    const workflowDistParent: Record<string, number> = {};
    parentRecords.forEach(p => {
      const status = p.workflow_status || 'null';
      workflowDistParent[status] = (workflowDistParent[status] || 0) + 1;
    });
    
    // ============================================================
    // 組み合わせ調査
    // ============================================================
    
    function isArchivedFn(p: any): boolean {
      return p.is_archived === true || p.listing_status === 'archived';
    }
    
    // アーカイブ
    const archivedCount = parentRecords.filter(p => isArchivedFn(p)).length;
    
    // 非アーカイブ
    const nonArchived = parentRecords.filter(p => !isArchivedFn(p));
    
    // 非アーカイブの在庫分布
    const nonArchivedStockDist: Record<string, number> = {};
    nonArchived.forEach(p => {
      const qty = p.physical_quantity;
      const key = qty === null ? 'null' : qty === undefined ? 'undefined' : String(qty);
      nonArchivedStockDist[key] = (nonArchivedStockDist[key] || 0) + 1;
    });
    
    // 在庫あり（physical_quantity > 0 または null/undefined）
    const stockPositive = nonArchived.filter(p => (p.physical_quantity || 0) > 0).length;
    const stockZero = nonArchived.filter(p => p.physical_quantity === 0).length;
    const stockNull = nonArchived.filter(p => p.physical_quantity === null || p.physical_quantity === undefined).length;
    
    // ============================================================
    // 新しいタブ定義案
    // ============================================================
    // データ編集: archived=false AND (stock > 0 OR stock IS NULL)
    // 在庫0: archived=false AND stock = 0
    // アーカイブ: archived=true
    
    const dataEditingNew = nonArchived.filter(p => 
      p.physical_quantity === null || 
      p.physical_quantity === undefined || 
      p.physical_quantity > 0
    ).length;
    
    const outOfStockNew = nonArchived.filter(p => p.physical_quantity === 0).length;
    
    // サンプルデータ
    const sampleDataEditing = nonArchived
      .filter(p => p.physical_quantity === null || p.physical_quantity === undefined || p.physical_quantity > 0)
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        sku: p.sku,
        physical_quantity: p.physical_quantity,
        listing_status: p.listing_status,
        workflow_status: p.workflow_status,
      }));
    
    const sampleOutOfStock = nonArchived
      .filter(p => p.physical_quantity === 0)
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        sku: p.sku,
        physical_quantity: p.physical_quantity,
        listing_status: p.listing_status,
      }));
    
    // ============================================================
    // レスポンス
    // ============================================================
    return NextResponse.json({
      success: true,
      investigation: {
        total_records: allProducts.length,
        parent_records: parentRecords.length,
        
        // physical_quantity分布
        physical_quantity_distribution: {
          all: stockDistAll,
          parent_only: stockDistParent,
          non_archived: nonArchivedStockDist,
        },
        
        // listing_status分布
        listing_status_distribution: listingStatusDistParent,
        
        // is_archived分布
        is_archived_distribution: archivedDistParent,
        
        // workflow_status分布
        workflow_status_distribution: workflowDistParent,
        
        // 現在の計算
        current_calculation: {
          archived: archivedCount,
          non_archived_total: nonArchived.length,
          non_archived_stock_positive: stockPositive,
          non_archived_stock_zero: stockZero,
          non_archived_stock_null: stockNull,
        },
        
        // 新しいタブ定義案
        new_tab_counts: {
          master: parentRecords.length,
          data_editing: dataEditingNew,
          out_of_stock: outOfStockNew,
          archived: archivedCount,
          _sum: dataEditingNew + outOfStockNew + archivedCount,
          _integrity: parentRecords.length === (dataEditingNew + outOfStockNew + archivedCount),
        },
        
        // サンプル
        samples: {
          data_editing: sampleDataEditing,
          out_of_stock: sampleOutOfStock,
        },
      },
    });
  } catch (error: any) {
    console.error('[investigate-stock] エラー:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
