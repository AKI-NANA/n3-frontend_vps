/**
 * タブカウントAPI v19 - Gemini指示書準拠版
 * 
 * 🚨 根本ルール:
 * 1. 「全商品」: DB全件（MUG全通貨含む）
 * 2. その他: is_parent=true のみ（母集団）
 * 
 * 📊 タブ定義:
 * - 全商品 (all): DB全件
 * - データ編集 (data_editing): is_parent=true AND is_archived=false（作業机）
 * - 在庫マスター (master): is_parent=true（全原本）
 * - アーカイブ (archived): is_parent=true AND is_archived=true
 * 
 * 🔥 v19修正: Gemini指示書準拠
 * - in_stock キーを dataEditingProducts ベースに変更
 * - 以前: activeListingsProducts から計算（listing_status='active' のみ）
 * - 現在: stockCounts.in_stock を使用（全ワーキングデータ）
 * 
 * 🔥 v18修正: isArchived判定から listing_status='archived' を除外
 * - 以前: is_archived=true OR listing_status='archived' でアーカイブ判定
 * - 現在: is_archived=true のみでアーカイブ判定
 * - 理由: listing_statusはeBayの出品状態、is_archivedはN3の管理状態
 * 
 * 🛠 工程軸（排他的）- listing_status / workflow_status ベース:
 * - 翻訳 (translation): 初期状態
 * - 検索 (search): 翻訳完了
 * - 選択 (selection): SM検索中
 * - 詳細 (details): SM選択完了
 * - 補完 (enrichment): 詳細取得完了
 * - 承認 (approval): 監査完了
 * - 下書き (draft): listing_status='draft'
 * - 出品済み (listed): listing_status='active' かつ workflow_status='listed' or 'approved'
 * - その他 (others): 上記以外
 * 
 * 📦 在庫状態軸（独立）- physical_quantity ベース:
 * - 在庫あり (in_stock): physical_quantity > 0
 * - 在庫0 (out_of_stock): physical_quantity = 0
 * 
 * 🔢 整合性公式:
 * - 在庫マスター = データ編集 + アーカイブ
 * - データ編集 = 工程軸合計
 * - データ編集 = 在庫あり + 在庫0
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================
// 型定義
// ============================================================

interface TabCounts {
  // 🔵 メインタブ
  all: number;
  master: number;
  data_editing: number;
  archived: number;
  research_pending: number;  // 🔬 Research待ち
  
  // 🔵 工程軸（排他的）
  workflow_translation: number;
  workflow_search: number;
  workflow_selection: number;
  workflow_details: number;
  workflow_enrichment: number;
  workflow_approval: number;
  workflow_draft: number;
  workflow_listed: number;
  workflow_others: number;
  
  // 🔵 在庫状態軸（独立）
  stock_in_stock: number;
  stock_out_of_stock: number;
  
  // 🔵 旧互換用
  active_listings: number;
  out_of_stock: number;
  in_stock: number;
  back_order_only: number;
  variation: number;
  set_products: number;
  in_stock_master: number;
  delisted_only: number;
  draft: number;
  scraped: number;
  approval_pending: number;
  approved: number;
  scheduled: number;
}

interface WorkflowCounts {
  translation: number;
  search: number;
  selection: number;
  details: number;
  enrichment: number;
  approval: number;
  draft: number;
  listed: number;
  others: number;
}

interface StockCounts {
  in_stock: number;
  out_of_stock: number;
}

interface IntegrityCheck {
  check: string;
  expected: number;
  actual: number;
  pass: boolean;
}

// ============================================================
// 判定関数
// ============================================================

/**
 * アーカイブ判定
 * 
 * 🔥 v18 修正: listing_status='archived' は eBayでの出品終了状態を示すものであり、
 * N3での管理状態（is_archived）とは別物。
 * 
 * 以前: is_archived === true || listing_status === 'archived' でアーカイブ判定
 * 現在: is_archived === true のみでアーカイブ判定
 */
function isArchived(p: any): boolean {
  return p.is_archived === true;
}

function isStockItem(p: any): boolean {
  if (p.inventory_type === 'stock') return true;
  if (p.inventory_type === 'mu') return false;
  const sku = (p.sku || '').toLowerCase();
  return sku.includes('stock');
}

/**
 * 工程軸の判定（排他的）
 * ※在庫状態（physical_quantity）は判定に使わない
 * 
 * 🔥 v17: 「出品済み（Listed）」の定義を厳格化
 * - 旧: listing_status === 'active' なら出品済み
 * - 新: listing_status === 'active' かつ workflow_status === 'listed' または 'approved'
 * - 目的: eBay同期済みでも未編集なら作業工程に復帰させる
 */
function getWorkflowPhase(p: any): keyof WorkflowCounts {
  const status = p.workflow_status;
  
  // 1. 下書きはそのまま
  if (p.listing_status === 'draft') return 'draft';
  
  // 2. 🔥 v17: 「出品済み」の定義を厳格化
  // listing_status === 'active' の場合:
  // - workflow_status === 'listed' または 'approved' なら「出品済み」
  // - それ以外は作業工程に復帰（eBay同期済みだが未編集）
  if (p.listing_status === 'active') {
    if (status === 'listed' || status === 'approved') {
      return 'listed';
    }
    // ↓ eBayでactiveだが、N3で編集が終わっていない場合は作業工程に復帰
  }
  
  // 3. workflow_statusベースの判定（eBay activeでもここを通る）
  if (!status || status === 'scraped' || status === 'new') return 'translation';
  if (status === 'translated') return 'search';
  if (status === 'sm_searching' || status === 'sm_selection_required') return 'selection';
  if (status === 'sm_selected') return 'details';
  if (status === 'details_fetched') return 'enrichment';
  if (status === 'audited') return 'approval';
  
  return 'others';
}

/**
 * 在庫状態の判定（独立）
 */
function getStockStatus(p: any): keyof StockCounts {
  return (p.physical_quantity || 0) > 0 ? 'in_stock' : 'out_of_stock';
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
        scheduled_at,
        source_system,
        sku,
        is_parent,
        is_archived
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

// ============================================================
// メインハンドラー
// ============================================================

export async function GET(request: NextRequest) {
  try {
    // 🔥 v20: Supabaseクライアント作成エラーを明示的にキャッチ
    let supabase;
    try {
      supabase = await createClient();
    } catch (clientError: any) {
      console.error('[products/counts] ❌ Supabaseクライアント作成失敗:', clientError.message);
      return NextResponse.json({ 
        success: false, 
        error: `Supabase接続エラー: ${clientError.message}`,
        hint: '環境変数(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)を確認してください'
      }, { status: 500 });
    }
    
    // 全件取得
    const allProducts = await fetchAllProducts(supabase);
    
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // ★★★ v19: シンプル設計 - マスターとデータ編集の統一 ★★★
    // マスター = データ編集 + アーカイブ
    // データ編集 = 工程軸合計 = 在庫軸合計
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    
    const allCount = allProducts.length;
    const masterProducts = allProducts.filter(p => p.is_parent === true);
    const masterCount = masterProducts.length;
    
    // 🔥 v19: is_archived === true のみをアーカイブとする
    const dataEditingProducts = masterProducts.filter(p => p.is_archived !== true);
    const archivedProducts = masterProducts.filter(p => p.is_archived === true);
    
    const dataEditingCount = dataEditingProducts.length;
    const archivedCount = archivedProducts.length;
    
    // 🚨 整合性チェック: マスター = データ編集 + アーカイブ
    if (masterCount !== dataEditingCount + archivedCount) {
      console.error(`🚨 [counts] 整合性エラー: master(${masterCount}) ≠ data_editing(${dataEditingCount}) + archived(${archivedCount})`);
    }
    
    // ============================================================
    // 工程軸カウント（排他的）
    // ============================================================
    
    const workflowCounts: WorkflowCounts = {
      translation: 0,
      search: 0,
      selection: 0,
      details: 0,
      enrichment: 0,
      approval: 0,
      draft: 0,
      listed: 0,
      others: 0,
    };
    
    for (const p of dataEditingProducts) {
      const phase = getWorkflowPhase(p);
      workflowCounts[phase]++;
    }
    
    // ============================================================
    // 在庫状態軸カウント（独立）
    // ============================================================
    
    const stockCounts: StockCounts = {
      in_stock: 0,
      out_of_stock: 0,
    };
    
    for (const p of dataEditingProducts) {
      const status = getStockStatus(p);
      stockCounts[status]++;
    }
    
    // ============================================================
    // 整合性チェック
    // ============================================================
    
    const integrityChecks: IntegrityCheck[] = [];
    
    // チェック1: 在庫マスター = データ編集 + アーカイブ
    integrityChecks.push({
      check: '在庫マスター = データ編集 + アーカイブ',
      expected: masterCount,
      actual: dataEditingCount + archivedCount,
      pass: masterCount === dataEditingCount + archivedCount
    });
    
    // チェック2: データ編集 = 工程軸合計
    const workflowSum = Object.values(workflowCounts).reduce((a, b) => a + b, 0);
    integrityChecks.push({
      check: 'データ編集 = 工程軸合計',
      expected: dataEditingCount,
      actual: workflowSum,
      pass: dataEditingCount === workflowSum
    });
    
    // チェック3: データ編集 = 在庫状態軸合計
    const stockSum = stockCounts.in_stock + stockCounts.out_of_stock;
    integrityChecks.push({
      check: 'データ編集 = 在庫状態軸合計',
      expected: dataEditingCount,
      actual: stockSum,
      pass: dataEditingCount === stockSum
    });
    
    // ============================================================
    // 旧互換用カウント
    // ============================================================
    
    const activeListingsProducts = dataEditingProducts.filter(p => p.listing_status === 'active');
    const inStockLegacy = activeListingsProducts.filter(p => isStockItem(p)).length;
    const backOrderLegacy = activeListingsProducts.filter(p => !isStockItem(p)).length;
    
    const variationCount = dataEditingProducts.filter(p => 
      p.product_type === 'variation_parent' || p.product_type === 'variation_child'
    ).length;
    
    const setProductsCount = dataEditingProducts.filter(p => 
      p.product_type === 'set'
    ).length;
    
    const delistedCount = dataEditingProducts.filter(p => 
      p.listing_status === 'ended' || p.listing_status === 'inactive' || p.listing_status === 'delisted'
    ).length;
    
    const scrapedCount = dataEditingProducts.filter(p => 
      p.workflow_status === 'scraped'
    ).length;
    
    const approvalPendingCount = dataEditingProducts.filter(p => 
      p.workflow_status === 'audited'
    ).length;
    
    const approvedCount = dataEditingProducts.filter(p => 
      p.workflow_status === 'approved' || p.approval_status === 'approved'
    ).length;
    
    const scheduledCount = dataEditingProducts.filter(p => 
      p.schedule_status === 'scheduled' || p.schedule_status === 'pending' || p.scheduled_at
    ).length;
    
    // ============================================================
    // 🔬 Research待ちカウント（research_repositoryから取得）
    // ============================================================
    
    let researchPendingCount = 0;
    try {
      const { count } = await supabase
        .from('research_repository')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'research_pending');
      researchPendingCount = count || 0;
    } catch (e) {
      console.warn('[counts] research_pending カウント取得失敗:', e);
    }
    
    // ============================================================
    // レスポンス
    // ============================================================
    
    const counts: TabCounts = {
      // 🔵 メインタブ
      all: allCount,
      master: masterCount,
      data_editing: dataEditingCount,
      archived: archivedCount,
      research_pending: researchPendingCount,  // 🔬 Research待ち
      
      // 🔵 工程軸（排他的）
      workflow_translation: workflowCounts.translation,
      workflow_search: workflowCounts.search,
      workflow_selection: workflowCounts.selection,
      workflow_details: workflowCounts.details,
      workflow_enrichment: workflowCounts.enrichment,
      workflow_approval: workflowCounts.approval,
      workflow_draft: workflowCounts.draft,
      workflow_listed: workflowCounts.listed,
      workflow_others: workflowCounts.others,
      
      // 🔵 在庫状態軸（独立）
      stock_in_stock: stockCounts.in_stock,
      stock_out_of_stock: stockCounts.out_of_stock,
      
      // 🔵 旧互換用
      // 🔥 v19: in_stock を dataEditingProducts ベースに修正（Gemini指示書準拠）
      // 以前: activeListingsProducts から計算（listing_status='active' のみ）
      // 現在: dataEditingProducts から計算（全ワーキングデータ）
      active_listings: workflowCounts.listed,
      out_of_stock: stockCounts.out_of_stock,
      in_stock: stockCounts.in_stock,  // 🔥 inStockLegacy から変更
      back_order_only: backOrderLegacy,
      variation: variationCount,
      set_products: setProductsCount,
      in_stock_master: masterCount,
      delisted_only: delistedCount,
      draft: workflowCounts.draft,
      scraped: scrapedCount,
      approval_pending: approvalPendingCount,
      approved: approvedCount,
      scheduled: scheduledCount,
    };
    
    // 整合性エラーログ
    const failedChecks = integrityChecks.filter(c => !c.pass);
    if (failedChecks.length > 0) {
      console.error('[products/counts] ❌ 整合性エラー検出:');
      failedChecks.forEach(c => {
        console.error(`  - ${c.check}: 期待=${c.expected}, 実際=${c.actual}`);
      });
    }
    
    console.log('[products/counts] v19 カウント:', {
      all: counts.all,
      master: counts.master,
      data_editing: counts.data_editing,
      archived: counts.archived,
      workflow: workflowCounts,
      stock: stockCounts,
    });
    
    return NextResponse.json({ 
      success: true, 
      counts,
      meta: {
        version: 'v19',
        description: 'Gemini指示書準拠版 - in_stock計算修正',
        tab_breakdown: {
          all: allCount,
          data_editing: dataEditingCount,
          master: masterCount,
          archived: archivedCount,
        },
        workflow_breakdown: workflowCounts,
        stock_breakdown: stockCounts,
        integrity_checks: integrityChecks,
        has_integrity_errors: failedChecks.length > 0,
      }
    });
  } catch (error: any) {
    console.error('[products/counts] エラー:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
