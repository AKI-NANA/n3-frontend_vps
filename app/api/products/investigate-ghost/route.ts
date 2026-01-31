/**
 * 幽霊データ調査API
 * GET /api/products/investigate-ghost
 * 
 * マスター(194)、データ編集(101)、アーカイブ(93)の差分を特定
 * A - (B + C) = 幽霊データ
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function isArchived(p: any): boolean {
  return p.is_archived === true || p.listing_status === 'archived';
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 全件取得（1000件制限回避）
    const allProducts: any[] = [];
    const pageSize = 1000;
    let offset = 0;
    let hasMore = true;
    
    while (hasMore) {
      const { data, error } = await supabase
        .from('products_master')
        .select('id, sku, title, english_title, listing_status, physical_quantity, workflow_status, source_system, is_parent, is_archived, inventory_master_id, currency')
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
    
    console.log(`[investigate-ghost] DB全件取得: ${allProducts.length}件`);
    
    // is_parent=true の件数を確認
    const parentCount = allProducts.filter(p => p.is_parent === true).length;
    console.log(`[investigate-ghost] is_parent=true: ${parentCount}件`);
    
    // ============================================================
    // 集合の定義
    // ============================================================
    
    // 集合A: マスター（is_parent=true）
    const setA_Master = (allProducts || []).filter(p => p.is_parent === true);
    
    // 🔥 デバッグ: is_archived と listing_status='archived' の組み合わせを調査
    const archivedAnalysis = {
      is_archived_true: setA_Master.filter(p => p.is_archived === true).length,
      listing_status_archived: setA_Master.filter(p => p.listing_status === 'archived').length,
      both: setA_Master.filter(p => p.is_archived === true && p.listing_status === 'archived').length,
      only_is_archived: setA_Master.filter(p => p.is_archived === true && p.listing_status !== 'archived').length,
      only_listing_status: setA_Master.filter(p => p.is_archived !== true && p.listing_status === 'archived').length,
    };
    console.log('[investigate-ghost] アーカイブ分析:', archivedAnalysis);
    
    // 集合B: データ編集（is_parent=true AND archived=false）
    const setB_Editing = setA_Master.filter(p => !isArchived(p));
    
    // 集合C: アーカイブ（is_parent=true AND archived=true）
    const setC_Archive = setA_Master.filter(p => isArchived(p));
    
    // ============================================================
    // 差分計算: A - (B + C)
    // ============================================================
    
    const setB_ids = new Set(setB_Editing.map(p => p.id));
    const setC_ids = new Set(setC_Archive.map(p => p.id));
    
    // BにもCにも含まれない「幽霊」
    const ghosts = setA_Master.filter(p => !setB_ids.has(p.id) && !setC_ids.has(p.id));
    
    // ============================================================
    // 幽霊データの詳細分析
    // ============================================================
    
    const ghostDetails = ghosts.slice(0, 20).map(p => ({
      id: p.id,
      sku: p.sku,
      title: p.title || p.english_title,
      physical_quantity: p.physical_quantity,
      workflow_status: p.workflow_status,
      listing_status: p.listing_status,
      source_system: p.source_system,
      is_archived: p.is_archived,
      inventory_master_id: p.inventory_master_id,
      currency: p.currency,
    }));
    
    // ============================================================
    // 原因分析
    // ============================================================
    
    // データ編集から漏れている商品の特徴を分析
    const missingFromEditing = setA_Master.filter(p => !setB_ids.has(p.id));
    
    const analysis = {
      // 在庫0で漏れている数
      stock_zero_excluded: missingFromEditing.filter(p => (p.physical_quantity || 0) === 0).length,
      // workflow_statusがnullで漏れている数
      workflow_null_excluded: missingFromEditing.filter(p => !p.workflow_status).length,
      // listing_statusで分類
      listing_status_distribution: {} as Record<string, number>,
      // source_systemで分類
      source_system_distribution: {} as Record<string, number>,
    };
    
    missingFromEditing.forEach(p => {
      const ls = p.listing_status || 'null';
      const ss = p.source_system || 'null';
      analysis.listing_status_distribution[ls] = (analysis.listing_status_distribution[ls] || 0) + 1;
      analysis.source_system_distribution[ss] = (analysis.source_system_distribution[ss] || 0) + 1;
    });
    
    // ============================================================
    // 整合性チェック
    // ============================================================
    
    const integrityChecks = [
      {
        check: 'マスター = データ編集 + アーカイブ + 幽霊',
        expected: setA_Master.length,
        actual: setB_Editing.length + setC_Archive.length + ghosts.length,
        pass: setA_Master.length === setB_Editing.length + setC_Archive.length + ghosts.length,
      },
      {
        check: 'データ編集 + アーカイブ = マスター（幽霊なし想定）',
        expected: setA_Master.length,
        actual: setB_Editing.length + setC_Archive.length,
        pass: setA_Master.length === setB_Editing.length + setC_Archive.length,
      },
    ];
    
    return NextResponse.json({
      success: true,
      investigation: {
        // 集合サイズ
        counts: {
          master_A: setA_Master.length,
          editing_B: setB_Editing.length,
          archive_C: setC_Archive.length,
          ghosts: ghosts.length,
        },
        
        // 算数
        formula: {
          'A': setA_Master.length,
          'B + C': setB_Editing.length + setC_Archive.length,
          'A - (B + C)': ghosts.length,
        },
        
        // 幽霊データ詳細（最大20件）
        ghost_samples: ghostDetails,
        
        // 原因分析
        cause_analysis: analysis,
        
        // 整合性
        integrity_checks: integrityChecks,
        
        // 結論
        conclusion: ghosts.length === 0 
          ? '✅ 幽霊データなし。マスター = データ編集 + アーカイブ'
          : `❌ ${ghosts.length}件の幽霊データが存在。原因を確認してください。`,
        
        // 🔥 アーカイブ分析（is_archived vs listing_status）
        archived_analysis: archivedAnalysis,
        
        // 🔥 DB取得診断
        db_diagnostic: {
          fetched_count: allProducts.length,
          is_parent_true_count: parentCount,
        },
      },
    });
  } catch (error: any) {
    console.error('[investigate-ghost] エラー:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
