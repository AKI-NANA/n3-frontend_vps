/**
 * デバッグ用カウントAPI - データ構造分析
 * GET /api/products/debug-counts
 * 
 * 指示書に基づく分析:
 * 1. is_parent分布
 * 2. currency分布
 * 3. inventory_master_idのユニーク数
 * 4. 代表レコード選出ロジックの検証
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase環境変数が未設定');
  }
  
  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

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
        source_system
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
    const supabase = getSupabase();
    
    // DB総件数
    const { count: dbTotalCount } = await supabase
      .from('products_master')
      .select('*', { count: 'exact', head: true });
    
    // 全件取得
    const allProducts = await fetchAllProducts(supabase);
    
    // ============================================================
    // 分析1: is_parent分布
    // ============================================================
    const isParentDist = {
      true: allProducts.filter(p => p.is_parent === true).length,
      false: allProducts.filter(p => p.is_parent === false).length,
      null: allProducts.filter(p => p.is_parent === null).length,
    };
    
    // ============================================================
    // 分析2: currency分布
    // ============================================================
    const currencyDist: Record<string, number> = {};
    allProducts.forEach(p => {
      const c = p.currency || 'null';
      currencyDist[c] = (currencyDist[c] || 0) + 1;
    });
    
    // is_parent=trueのみのcurrency分布
    const currencyDistParent: Record<string, number> = {};
    allProducts.filter(p => p.is_parent === true).forEach(p => {
      const c = p.currency || 'null';
      currencyDistParent[c] = (currencyDistParent[c] || 0) + 1;
    });
    
    // ============================================================
    // 分析3: inventory_master_id分析
    // ============================================================
    const withInvId = allProducts.filter(p => p.inventory_master_id);
    const withoutInvId = allProducts.filter(p => !p.inventory_master_id);
    
    const uniqueInvIds = new Set(withInvId.map(p => p.inventory_master_id));
    
    // inventory_master_idごとのレコード数
    const invIdGroups: Record<string, any[]> = {};
    withInvId.forEach(p => {
      const id = p.inventory_master_id;
      if (!invIdGroups[id]) invIdGroups[id] = [];
      invIdGroups[id].push(p);
    });
    
    // 1レコードのみ vs 複数レコード
    const singleRecordInvIds = Object.entries(invIdGroups).filter(([_, arr]) => arr.length === 1).length;
    const multiRecordInvIds = Object.entries(invIdGroups).filter(([_, arr]) => arr.length > 1).length;
    
    // ============================================================
    // 分析4: 代表レコード選出シミュレーション（指示書ロジック）
    // ============================================================
    // inventory_master_idごとにUSD優先で代表を選出
    const representativeRecords: any[] = [];
    
    // inventory_master_id有りの商品
    Object.entries(invIdGroups).forEach(([invId, records]) => {
      // USD優先
      const usdRecord = records.find(r => r.currency === 'USD');
      if (usdRecord) {
        representativeRecords.push({ ...usdRecord, _representative_reason: 'USD' });
      } else {
        // USDなければ最初のレコードを代表
        representativeRecords.push({ ...records[0], _representative_reason: 'first_non_usd' });
      }
    });
    
    // inventory_master_id無しの商品（手動登録など）は全て表示
    withoutInvId.forEach(p => {
      representativeRecords.push({ ...p, _representative_reason: 'no_inv_id' });
    });
    
    // 代表レコードのcurrency分布
    const repCurrencyDist: Record<string, number> = {};
    representativeRecords.forEach(p => {
      const c = p.currency || 'null';
      repCurrencyDist[c] = (repCurrencyDist[c] || 0) + 1;
    });
    
    // 代表レコードの選出理由分布
    const repReasonDist: Record<string, number> = {};
    representativeRecords.forEach(p => {
      const r = p._representative_reason;
      repReasonDist[r] = (repReasonDist[r] || 0) + 1;
    });
    
    // ============================================================
    // 分析5: 指示書のタブ条件でカウント（代表レコードベース）
    // ============================================================
    function isArchivedRec(p: any): boolean {
      return p.is_archived === true || p.listing_status === 'archived';
    }
    
    const repMaster = representativeRecords.length;
    const repArchived = representativeRecords.filter(p => isArchivedRec(p)).length;
    const repActive = representativeRecords.filter(p => !isArchivedRec(p) && p.listing_status === 'active').length;
    const repOutOfStock = representativeRecords.filter(p => 
      !isArchivedRec(p) && 
      p.listing_status !== 'active' && 
      (p.physical_quantity || 0) === 0
    ).length;
    const repDataEditing = representativeRecords.filter(p => 
      !isArchivedRec(p) && 
      p.listing_status !== 'active' && 
      (p.physical_quantity || 0) > 0
    ).length;
    
    const tabSum = repArchived + repActive + repOutOfStock + repDataEditing;
    
    // ============================================================
    // 分析6: 現在のis_parent=trueとの比較
    // ============================================================
    const currentParentRecords = allProducts.filter(p => p.is_parent === true);
    
    const currentMaster = currentParentRecords.length;
    const currentArchived = currentParentRecords.filter(p => isArchivedRec(p)).length;
    const currentActive = currentParentRecords.filter(p => !isArchivedRec(p) && p.listing_status === 'active').length;
    const currentOutOfStock = currentParentRecords.filter(p => 
      !isArchivedRec(p) && 
      p.listing_status !== 'active' && 
      (p.physical_quantity || 0) === 0
    ).length;
    const currentDataEditing = currentParentRecords.filter(p => 
      !isArchivedRec(p) && 
      p.listing_status !== 'active' && 
      (p.physical_quantity || 0) > 0
    ).length;
    
    // ============================================================
    // レスポンス
    // ============================================================
    return NextResponse.json({
      success: true,
      analysis: {
        // 基本情報
        db_total_count: dbTotalCount,
        fetched_count: allProducts.length,
        
        // is_parent分布
        is_parent_distribution: isParentDist,
        
        // currency分布
        currency_distribution_all: currencyDist,
        currency_distribution_parent_only: currencyDistParent,
        
        // inventory_master_id分析
        inventory_master_id: {
          with_inv_id: withInvId.length,
          without_inv_id: withoutInvId.length,
          unique_inv_ids: uniqueInvIds.size,
          single_record_groups: singleRecordInvIds,
          multi_record_groups: multiRecordInvIds,
        },
        
        // 代表レコード選出（指示書ロジック）
        representative_records: {
          total: representativeRecords.length,
          currency_distribution: repCurrencyDist,
          selection_reason: repReasonDist,
        },
        
        // 指示書タブ条件（代表レコードベース）
        new_tab_counts: {
          master: repMaster,
          data_editing: repDataEditing,
          active_listings: repActive,
          out_of_stock: repOutOfStock,
          archived: repArchived,
          _sum_check: tabSum,
          _integrity: repMaster === tabSum,
        },
        
        // 現在のis_parent=trueベース
        current_tab_counts: {
          master: currentMaster,
          data_editing: currentDataEditing,
          active_listings: currentActive,
          out_of_stock: currentOutOfStock,
          archived: currentArchived,
        },
        
        // 差分
        difference: {
          master: repMaster - currentMaster,
          data_editing: repDataEditing - currentDataEditing,
          active_listings: repActive - currentActive,
          out_of_stock: repOutOfStock - currentOutOfStock,
          archived: repArchived - currentArchived,
        },
      },
    });
  } catch (error: any) {
    console.error('[debug-counts] エラー:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
