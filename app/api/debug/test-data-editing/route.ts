// app/api/debug/test-data-editing/route.ts
/**
 * データ編集タブAPIテスト
 * 
 * GET /api/debug/test-data-editing
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

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

// Supabaseクライアント
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

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    
    // 1. 親レコードのみ取得（is_parent = true）
    const { data: products, error, count } = await supabase
      .from('products_master')
      .select('*', { count: 'exact' })
      .eq('is_parent', true);
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    // 2. ワークフロー分類
    const dataEditingProducts = products?.filter(p => getWorkflowTab(p) === 'data_editing') || [];
    
    // 3. API route.ts と同じフィルタリング（比較用）
    const apiFilteredProducts = products?.filter(p => {
      // listing_status が archived/active/draft 以外
      const notArchived = p.listing_status !== 'archived';
      const notActive = p.listing_status !== 'active';
      const notDraft = p.listing_status !== 'draft';
      return notArchived && notActive && notDraft;
    }) || [];
    
    // 4. APIフィルタ後にワークフロー判定
    const apiThenWorkflow = apiFilteredProducts.filter(p => getWorkflowTab(p) === 'data_editing');
    
    return NextResponse.json({
      success: true,
      totalParentRecords: count,
      dataEditingByWorkflow: {
        count: dataEditingProducts.length,
        sample: dataEditingProducts.slice(0, 5).map(p => ({
          id: p.id,
          listing_status: p.listing_status,
          english_title: p.english_title?.substring(0, 30),
          ebay_category_id: p.ebay_category_id,
        })),
      },
      apiFiltered: {
        count: apiFilteredProducts.length,
        sample: apiFilteredProducts.slice(0, 5).map(p => ({
          id: p.id,
          listing_status: p.listing_status,
        })),
      },
      apiThenWorkflow: {
        count: apiThenWorkflow.length,
      },
      // listing_status分布
      listingStatusDistribution: products?.reduce((acc, p) => {
        const status = p.listing_status || 'NULL';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
