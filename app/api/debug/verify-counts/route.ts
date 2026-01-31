// app/api/debug/verify-counts/route.ts
/**
 * タブカウント整合性検証API v2（引き継ぎ書準拠）
 * 
 * GET /api/debug/verify-counts
 * 
 * 整合性公式:
 * - マスター = データ編集 + 出品中 + 在庫0 + アーカイブ
 * - データ編集 = 翻訳 + 検索 + 選択 + 詳細 + 補完 + 承認 + 出品済 + その他
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================
// 判定関数
// ============================================================

function isArchived(p: any): boolean {
  return p.is_archived === true || p.listing_status === 'archived';
}

function getProductTab(p: any): 'archived' | 'active_listings' | 'out_of_stock' | 'data_editing' {
  if (isArchived(p)) return 'archived';
  if (p.listing_status === 'active') return 'active_listings';
  if ((p.physical_quantity || 0) === 0) return 'out_of_stock';
  return 'data_editing';
}

function getWorkflowCategory(p: any): string {
  const status = p.workflow_status;
  
  if (!status || status === 'scraped' || status === 'new') return 'translation';
  if (status === 'translated') return 'search';
  if (status === 'sm_searching') return 'selection';
  if (status === 'sm_selected') return 'details';
  if (status === 'details_fetched') return 'enrichment';
  if (status === 'audited') return 'approval';
  if (status === 'approved' || status === 'ready') return 'listed';
  return 'others';
}

// ============================================================
// 全件取得
// ============================================================

async function fetchAllProducts(supabase: any) {
  const allProducts: any[] = [];
  const pageSize = 1000;
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    const { data, error } = await supabase
      .from('products_master')
      .select('id, is_parent, is_archived, listing_status, physical_quantity, workflow_status, currency, source_system, english_title, ebay_category_id')
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

// ============================================================
// メインハンドラー
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // DB総件数
    const { count: totalCount, error: countError } = await supabase
      .from('products_master')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      return NextResponse.json({ success: false, error: countError.message }, { status: 500 });
    }
    
    // 全データ取得
    const products = await fetchAllProducts(supabase);
    
    // 親レコードのみ
    const parentProducts = products.filter(p => p.is_parent === true);
    
    // ============================================================
    // 新タブカウント（排他的）
    // ============================================================
    
    const tabCounts = {
      master: parentProducts.length,
      data_editing: 0,
      active_listings: 0,
      out_of_stock: 0,
      archived: 0,
    };
    
    for (const p of parentProducts) {
      const tab = getProductTab(p);
      tabCounts[tab]++;
    }
    
    // ============================================================
    // 工程フィルターカウント（データ編集タブ内）
    // ============================================================
    
    const dataEditingProducts = parentProducts.filter(p => getProductTab(p) === 'data_editing');
    
    const workflowCounts = {
      translation: 0,
      search: 0,
      selection: 0,
      details: 0,
      enrichment: 0,
      approval: 0,
      listed: 0,
      others: 0,
    };
    
    for (const p of dataEditingProducts) {
      const category = getWorkflowCategory(p);
      workflowCounts[category as keyof typeof workflowCounts]++;
    }
    
    // ============================================================
    // 整合性チェック
    // ============================================================
    
    const integrityChecks = [];
    
    // 1. DB総数 vs フェッチ数
    integrityChecks.push({
      check: 'DB総数 vs フェッチ数',
      expected: totalCount,
      actual: products.length,
      pass: totalCount === products.length,
    });
    
    // 2. マスター = データ編集 + 出品中 + 在庫0 + アーカイブ
    const tabSum = tabCounts.data_editing + tabCounts.active_listings + tabCounts.out_of_stock + tabCounts.archived;
    integrityChecks.push({
      check: 'マスター = データ編集 + 出品中 + 在庫0 + アーカイブ',
      expected: tabCounts.master,
      actual: tabSum,
      pass: tabCounts.master === tabSum,
    });
    
    // 3. データ編集 = 工程合計
    const workflowSum = Object.values(workflowCounts).reduce((a, b) => a + b, 0);
    integrityChecks.push({
      check: 'データ編集 = 工程合計',
      expected: tabCounts.data_editing,
      actual: workflowSum,
      pass: tabCounts.data_editing === workflowSum,
    });
    
    // 4. 各商品が1つのタブのみに属する
    const tabAssignments: Record<string, number> = {};
    for (const p of parentProducts) {
      const tab = getProductTab(p);
      const key = `${p.id}`;
      if (!tabAssignments[key]) {
        tabAssignments[key] = 0;
      }
      tabAssignments[key]++;
    }
    const multipleAssignments = Object.values(tabAssignments).filter(count => count > 1).length;
    integrityChecks.push({
      check: '各商品は1つのタブのみに属する',
      expected: 0,
      actual: multipleAssignments,
      pass: multipleAssignments === 0,
    });
    
    // ============================================================
    // is_parent 分布
    // ============================================================
    
    const isParentDistribution = {
      true: products.filter(p => p.is_parent === true).length,
      false: products.filter(p => p.is_parent === false).length,
      null: products.filter(p => p.is_parent === null).length,
    };
    
    // ============================================================
    // listing_status 分布（親レコードのみ）
    // ============================================================
    
    const listingStatusDistribution: Record<string, number> = {};
    for (const p of parentProducts) {
      const key = p.listing_status || 'null';
      listingStatusDistribution[key] = (listingStatusDistribution[key] || 0) + 1;
    }
    
    // ============================================================
    // workflow_status 分布（データ編集タブ内）
    // ============================================================
    
    const workflowStatusDistribution: Record<string, number> = {};
    for (const p of dataEditingProducts) {
      const key = p.workflow_status || 'null';
      workflowStatusDistribution[key] = (workflowStatusDistribution[key] || 0) + 1;
    }
    
    // ============================================================
    // is_archived 分布（親レコードのみ）
    // ============================================================
    
    const isArchivedDistribution = {
      true: parentProducts.filter(p => p.is_archived === true).length,
      false: parentProducts.filter(p => p.is_archived === false).length,
      null: parentProducts.filter(p => p.is_archived === null).length,
    };
    
    // ============================================================
    // 結果
    // ============================================================
    
    const hasErrors = integrityChecks.some(c => !c.pass);
    
    return NextResponse.json({
      success: true,
      hasErrors,
      
      // 新タブ構造
      tabCounts,
      
      // 工程フィルター
      workflowCounts,
      
      // 整合性チェック
      integrityChecks,
      
      // 詳細分布
      distributions: {
        isParent: isParentDistribution,
        isArchived: isArchivedDistribution,
        listingStatus: listingStatusDistribution,
        workflowStatus: workflowStatusDistribution,
      },
      
      // 統計
      stats: {
        totalInDb: totalCount,
        totalFetched: products.length,
        parentRecords: parentProducts.length,
        dataEditingProducts: dataEditingProducts.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
