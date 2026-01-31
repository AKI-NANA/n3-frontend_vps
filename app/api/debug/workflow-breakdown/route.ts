// app/api/debug/workflow-breakdown/route.ts
/**
 * ワークフロー分類詳細デバッグAPI
 * 
 * GET /api/debug/workflow-breakdown
 * 
 * 各ワークフロータブに分類される商品の詳細を確認
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
        is_parent
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
    
    // 親レコードのみ
    const parentRecords = allProducts.filter(p => p.is_parent === true);
    
    // ワークフロー分類
    const workflowBreakdown: Record<string, any[]> = {
      archived: [],
      active_listings: [],
      draft: [],
      scheduled: [],
      approved: [],
      approval_pending: [],
      data_editing: [],
    };
    
    // 分類理由も記録
    const classificationReasons: any[] = [];
    
    for (const p of parentRecords) {
      const tab = getWorkflowTab(p);
      workflowBreakdown[tab].push({
        id: p.id,
        listing_status: p.listing_status,
        workflow_status: p.workflow_status,
        approval_status: p.approval_status,
        has_english_title: !!(p.english_title && p.english_title.trim() !== ''),
        has_category: !!p.ebay_category_id,
      });
      
      // 最初の50件は詳細も記録
      if (classificationReasons.length < 50) {
        classificationReasons.push({
          id: p.id,
          tab,
          listing_status: p.listing_status,
          workflow_status: p.workflow_status,
          approval_status: p.approval_status,
          schedule_status: p.schedule_status,
          scheduled_at: p.scheduled_at,
          english_title: p.english_title ? p.english_title.substring(0, 50) : null,
          ebay_category_id: p.ebay_category_id,
        });
      }
    }
    
    // サマリー
    const summary: Record<string, number> = {};
    for (const [tab, products] of Object.entries(workflowBreakdown)) {
      summary[tab] = products.length;
    }
    
    // listing_status の分布（親レコードのみ）
    const listingStatusDist: Record<string, number> = {};
    for (const p of parentRecords) {
      const status = p.listing_status || 'null';
      listingStatusDist[status] = (listingStatusDist[status] || 0) + 1;
    }
    
    // 非アーカイブ・非アクティブ・非ドラフトの商品
    const otherProducts = parentRecords.filter(p => 
      p.listing_status !== 'archived' &&
      p.listing_status !== 'active' &&
      p.listing_status !== 'draft'
    );
    
    // その中でのデータ完成状況
    const otherBreakdown = {
      total: otherProducts.length,
      with_english_title: otherProducts.filter(p => p.english_title && p.english_title.trim() !== '').length,
      with_category: otherProducts.filter(p => p.ebay_category_id).length,
      data_complete: otherProducts.filter(p => 
        (p.english_title && p.english_title.trim() !== '') && p.ebay_category_id
      ).length,
      data_incomplete: otherProducts.filter(p => 
        !(p.english_title && p.english_title.trim() !== '') || !p.ebay_category_id
      ).length,
    };
    
    return NextResponse.json({
      success: true,
      totalParentRecords: parentRecords.length,
      summary,
      listingStatusDist,
      otherBreakdown,
      classificationReasons,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
