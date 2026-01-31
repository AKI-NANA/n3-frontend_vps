/**
 * 🔥 緊急調査API - マスター vs データ編集の完全突合
 * GET /api/debug/master-vs-editing
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // 全 is_parent=true の商品を取得
    const { data: allProducts, error } = await supabase
      .from('products_master')
      .select('id, sku, title, english_title, is_parent, is_archived, listing_status, workflow_status, physical_quantity')
      .eq('is_parent', true);
    
    if (error) throw error;
    
    const products = allProducts || [];
    
    // 🔍 各種カウント
    const masterCount = products.length;
    
    // 新定義: データ編集 = is_archived !== true （listing_statusは関係なし）
    const dataEditingNew = products.filter(p => p.is_archived !== true);
    const archivedNew = products.filter(p => p.is_archived === true);
    
    // 旧定義（問題のあったコード）: データ編集 = is_archived !== true AND listing_status !== 'archived'
    const dataEditingOld = products.filter(p => p.is_archived !== true && p.listing_status !== 'archived');
    const archivedOld = products.filter(p => p.is_archived === true || p.listing_status === 'archived');
    
    // listing_status = 'archived' だが is_archived = false の商品（隠れフィルタの犠牲者）
    const hiddenByListingStatus = products.filter(p => 
      p.is_archived !== true && p.listing_status === 'archived'
    );
    
    // Little Godzilla 調査
    const godzillaProducts = products.filter(p =>
      (p.title && p.title.toLowerCase().includes('godzilla')) ||
      (p.english_title && p.english_title.toLowerCase().includes('godzilla'))
    );
    
    // ステータス分布
    const listingStatusCounts: Record<string, number> = {};
    const workflowStatusCounts: Record<string, number> = {};
    const isArchivedCounts = { true: 0, false: 0, null: 0 };
    
    products.forEach(p => {
      const ls = p.listing_status || 'null';
      const ws = p.workflow_status || 'null';
      listingStatusCounts[ls] = (listingStatusCounts[ls] || 0) + 1;
      workflowStatusCounts[ws] = (workflowStatusCounts[ws] || 0) + 1;
      
      if (p.is_archived === true) isArchivedCounts.true++;
      else if (p.is_archived === false) isArchivedCounts.false++;
      else isArchivedCounts.null++;
    });
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      
      // ✅ 期待される正しいカウント（修正後）
      correctCounts: {
        master: masterCount,
        dataEditing: dataEditingNew.length,
        archived: archivedNew.length,
        sum: dataEditingNew.length + archivedNew.length,
        match: masterCount === dataEditingNew.length + archivedNew.length,
      },
      
      // ❌ 旧定義（バグあり）のカウント
      oldBuggyCounts: {
        master: masterCount,
        dataEditing: dataEditingOld.length,
        archived: archivedOld.length,
        sum: dataEditingOld.length + archivedOld.length,
        // 旧定義だとsumがmasterより多くなる可能性
      },
      
      // 🚨 listing_status='archived' によって隠されていた商品
      hiddenProducts: {
        count: hiddenByListingStatus.length,
        products: hiddenByListingStatus.map(p => ({
          id: p.id,
          sku: p.sku,
          title: (p.title || p.english_title || '').substring(0, 60),
          is_archived: p.is_archived,
          listing_status: p.listing_status,
          workflow_status: p.workflow_status,
        })),
      },
      
      // 🦎 Little Godzilla 調査
      godzillaProducts: godzillaProducts.map(p => ({
        id: p.id,
        sku: p.sku,
        title: (p.title || p.english_title || '').substring(0, 80),
        is_parent: p.is_parent,
        is_archived: p.is_archived,
        listing_status: p.listing_status,
        workflow_status: p.workflow_status,
        physical_quantity: p.physical_quantity,
        // どのタブに表示されるべきか
        shouldAppearIn: {
          master: true,
          dataEditing: p.is_archived !== true,
          archived: p.is_archived === true,
        },
      })),
      
      // ステータス分布
      distribution: {
        listing_status: listingStatusCounts,
        workflow_status: workflowStatusCounts,
        is_archived: isArchivedCounts,
      },
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
