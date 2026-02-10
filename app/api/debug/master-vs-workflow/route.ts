// app/api/debug/master-vs-workflow/route.ts
/**
 * マスター vs ワークフロー 比較デバッグAPI
 * 
 * マスタータブに表示される商品と、ワークフロータブに分類される商品を比較
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 商品のワークフロータブを判定（排他的）
function getWorkflowTab(p: any): string {
  // 1. アーカイブ
  if (p.listing_status === 'archived') {
    return 'archived';
  }
  
  // 2. 出品中
  if (p.listing_status === 'active') {
    return 'active_listings';
  }
  
  // 3. 下書き
  if (p.listing_status === 'draft') {
    return 'draft';
  }
  
  // 4. 出品予約
  if (p.schedule_status === 'scheduled' || p.schedule_status === 'pending' || p.scheduled_at) {
    return 'scheduled';
  }
  
  // 5. 承認済み
  if (p.workflow_status === 'approved' || p.approval_status === 'approved') {
    return 'approved';
  }
  
  // データ完成チェック
  const hasEnglishTitle = p.english_title && p.english_title.trim() !== '';
  const hasCategory = p.ebay_category_id;
  const dataComplete = hasEnglishTitle && hasCategory;
  
  // 6. 承認待ち（データ完成）
  if (dataComplete) {
    return 'approval_pending';
  }
  
  // 7. データ編集（データ未完成）
  return 'data_editing';
}

// 全件取得（ページネーション対応）
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
        title, 
        english_title, 
        ebay_category_id, 
        listing_status, 
        workflow_status, 
        approval_status, 
        schedule_status, 
        scheduled_at,
        is_parent,
        currency,
        source_system
      `)
      .range(offset, offset + pageSize - 1);
    
    if (error) {
      throw error;
    }
    
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
    
    // 全件取得
    const allProducts = await fetchAllProducts(supabase);
    
    // マスタータブ: is_parent = true の全商品
    const masterProducts = allProducts.filter(p => p.is_parent === true);
    const masterIds = new Set(masterProducts.map(p => p.id));
    
    // ワークフロー分類
    const workflowAssignments: Record<number, string> = {};
    const workflowProducts: Record<string, number[]> = {
      archived: [],
      active_listings: [],
      draft: [],
      scheduled: [],
      approved: [],
      approval_pending: [],
      data_editing: [],
    };
    
    for (const p of masterProducts) {
      const tab = getWorkflowTab(p);
      workflowAssignments[p.id] = tab;
      workflowProducts[tab].push(p.id);
    }
    
    // ワークフロータブに分類された全ID
    const allWorkflowIds = new Set(Object.values(workflowProducts).flat());
    
    // マスターにあるがワークフローにない
    const inMasterNotInWorkflow = masterProducts.filter(p => !allWorkflowIds.has(p.id));
    
    // ワークフローにあるがマスターにない
    const inWorkflowNotInMaster = [...allWorkflowIds].filter(id => !masterIds.has(id));
    
    // 各タブの件数
    const workflowCounts: Record<string, number> = {};
    for (const [tab, ids] of Object.entries(workflowProducts)) {
      workflowCounts[tab] = ids.length;
    }
    
    // listing_status の分布
    const listingStatusDist: Record<string, number> = {};
    for (const p of masterProducts) {
      const status = p.listing_status || 'NULL';
      listingStatusDist[status] = (listingStatusDist[status] || 0) + 1;
    }
    
    // 問題のある商品の詳細
    const problematicDetails = inMasterNotInWorkflow.map(p => ({
      id: p.id,
      listing_status: p.listing_status,
      workflow_status: p.workflow_status,
      approval_status: p.approval_status,
      english_title: p.english_title ? p.english_title.substring(0, 30) : null,
      ebay_category_id: p.ebay_category_id,
      assignedTab: workflowAssignments[p.id] || 'NONE',
    }));
    
    return NextResponse.json({
      success: true,
      summary: {
        masterCount: masterProducts.length,
        workflowTotalCount: allWorkflowIds.size,
        inMasterNotInWorkflow: inMasterNotInWorkflow.length,
        inWorkflowNotInMaster: inWorkflowNotInMaster.length,
      },
      workflowCounts,
      listingStatusDist,
      problematicDetails,
      // 各タブの最初の5件のID
      sampleIds: {
        archived: workflowProducts.archived.slice(0, 5),
        active_listings: workflowProducts.active_listings.slice(0, 5),
        draft: workflowProducts.draft.slice(0, 5),
        data_editing: workflowProducts.data_editing.slice(0, 5),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
