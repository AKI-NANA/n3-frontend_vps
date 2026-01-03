/**
 * 有在庫判定（優先順位）
 * 1. inventory_type が明示的に設定されている場合 → それを使用
 * 2. 未設定 → SKUから自動判定（「stock」を含む → 有在庫）
 */
function isStockItem(product: any): boolean {
  // 1. inventory_type が明示的に設定されている場合
  if (product.inventory_type === 'stock') return true;
  if (product.inventory_type === 'mu') return false;
  
  // 2. SKUベースの自動判定
  const sku = (product.sku || '').toLowerCase();
  return sku.includes('stock');
}

/**
 * 無在庫判定
 */
function isMuItem(product: any): boolean {
  return !isStockItem(product);
}

/**
 * 商品データ取得API
 * GET /api/products
 * 
 * パラメータ:
 * - limit: 取得件数（デフォルト: 50, 最大: 2000）
 * - offset: オフセット
 * - sku: SKUで検索
 * - list_filter: L3タブフィルター
 * - marketplace: マーケットプレイス
 * - search: 検索ワード
 * - count: 'true' でカウントのみ取得
 * 
 * MUG重複除外:
 * - eBay MUGで生成された各国語版タイトルを検出して除外
 * - 明確な非英語キーワードで判定
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// MUG（Multi-country Listing）で生成された非英語タイトルを検出するキーワード
// 大文字小文字を区別しない
const MUG_NON_ENGLISH_PATTERNS = [
  // ドイツ語
  /\bKarten\b/i,
  /\bSumpf\b/i,
  /\bKomplett\b/i,
  /\bActionfigur\b/i,
  /\bNeu\b/i,
  /\bNr\.\s*\d/i,
  
  // イタリア語
  /\bCarta\b/i,
  /\bCarte\b/i,
  /\bgiapponese\b/i,
  /\bgiapponesi\b/i,
  /\blocandina\b/i,
  /\bfumetto\b/i,
  /\bbizzarre\b/i,
  /\bnuova\b/i,
  /\bnuovo\b/i,
  /\bfigura\b/i,
  /\bScheda di memoria\b/i,
  
  // スペイン語
  /\bJuego de cartas\b/i,
  /\bcartas\b/i,
  /\bnueva\b/i,
  /\bnuevo\b/i,
  /\bFigura de acción\b/i,
  /\bconjunto\b/i,
  
  // フランス語
  /\bLot complet\b/i,
  /\bvitraux\b/i,
  /\bFigurine\b/i,
  /\bneuve\b/i,
  /\bneuf\b/i,
  /\bn°\s*\d/i,
  
  // オランダ語
  /\bActiefiguur\b/i,
  /\bnieuw\b/i,
  
  // ポーランド語
  /\bFigurka\b/i,
  /\bnowy\b/i,
  /\bnowa\b/i,
];

/**
 * MUGで生成された派生リスティングかどうかを判定
 * @param product 商品データ
 * @returns MUG派生リスティングの場合true（除外対象）
 * 
 * MUGの特徴:
 * - 同じタイトルで複数のリスティングが存在
 * - 通貨が異なる（USD, GBP, EUR, CAD, AUD）
 * - USDが元リスティング、他の通貨は派生
 */
function isMugDerivedListing(product: any): boolean {
  // eBay同期データ以外は判定しない
  if (product.source_system !== 'inventory_master') {
    return false;
  }
  
  // 通貨がUSD以外の場合はMUG派生とみなして除外
  const currency = product.currency;
  if (currency && currency !== 'USD') {
    return true;
  }
  
  // タイトルベースの非英語検出（バックアップ）
  const title = product.title;
  if (title) {
    if (MUG_NON_ENGLISH_PATTERNS.some(pattern => pattern.test(title))) {
      return true;
    }
  }
  
  return false;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // ページネーションパラメータ（上限2000件に制限）
    const requestedLimit = parseInt(searchParams.get('limit') || '50');
    const limit = Math.min(requestedLimit, 2000);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // フィルターパラメータ
    const countOnly = searchParams.get('count') === 'true';
    const sku = searchParams.get('sku');
    const listFilter = searchParams.get('list_filter') || 'all';
    const marketplace = searchParams.get('marketplace');
    const search = searchParams.get('search');

    const supabase = await createClient();

    // MUGフィルタリングは常に適用（全タブ対象）
    const needsMugFilter = true;

    // クエリの構築
    // MUGフィルタリングが必要な場合は多めに取得してフィルタリング後にページネーション
    const fetchLimit = needsMugFilter ? Math.min(limit * 3, 6000) : limit;

    // 一時的に全カラム取得（スキーマ確認後に最適化予定）
    const LIGHT_COLUMNS = '*';

    let query = supabase
      .from('products_master')
      .select(LIGHT_COLUMNS, { count: 'exact' });

    // L3タブフィルター（list_filter）の処理
    switch (listFilter) {
      case 'all':
        // 全商品：フィルターなし
        break;
      
      case 'draft':
        // 下書き：listing_status='draft' または product_type='draft'(未出品商品)
        query = query.or('listing_status.eq.draft,product_type.eq.draft');
        break;
      
      case 'data_editing':
        // データ編集：データ未完成（english_title/ebay_category_id IS NULL）
        query = query.or('english_title.is.null,ebay_category_id.is.null');
        break;
      
      case 'approval_pending':
        // 承認待ち：データ完成 + 未承認
        query = query.not('english_title', 'is', null);
        query = query.not('ebay_category_id', 'is', null);
        query = query.or('workflow_status.is.null,workflow_status.neq.approved');
        query = query.or('approval_status.is.null,approval_status.neq.approved');
        query = query.neq('listing_status', 'active');
        break;
      
      case 'approved':
        // 承認済み：workflow_status='approved' または approval_status='approved'
        // かつ、まだ出品していない、スケジュールされていない
        query = query.or('workflow_status.eq.approved,approval_status.eq.approved');
        query = query.neq('listing_status', 'active');
        query = query.or('schedule_status.is.null,schedule_status.eq.none');
        break;
      
      case 'scheduled':
        // 出品予約：schedule_status='scheduled' or 'pending' または scheduled_at が設定されている
        query = query.or('schedule_status.eq.scheduled,schedule_status.eq.pending,scheduled_at.not.is.null');
        query = query.neq('listing_status', 'active');
        break;
      
      case 'active_listings':
        // 出品中：listing_status='active'
        query = query.eq('listing_status', 'active');
        break;
      
      case 'in_stock':
        // 有在庫：inventory_type='stock' または SKUに'stock'を含む
        // DBクエリでは大まかに取得し、後でフィルタ
        query = query.not('inventory_master_id', 'is', null);
        break;
      
      case 'back_order_only':
        // 無在庫：inventory_type='dropship' または SKUに'stock'を含まない
        // DBクエリでは大まかに取得し、後でフィルタ
        query = query.not('inventory_master_id', 'is', null);
        break;
      
      case 'out_of_stock':
        // 在庫0：physical_quantity = 0（出品有無問わず、対策確認用）
        query = query.eq('physical_quantity', 0);
        break;
      
      case 'variation':
        // バリエーション：product_typeで判定（将来実装）
        // 現在はバリエーションデータがないため0件を返す
        query = query.eq('product_type', 'variation_parent');
        break;
      
      case 'set_products':
        // セット品：データ完成 + product_type='set'
        query = query.not('english_title', 'is', null);
        query = query.not('ebay_category_id', 'is', null);
        query = query.eq('product_type', 'set');
        break;
      
      case 'in_stock_master':
        // マスター：inventory_master_id有（出品有無問わず）
        query = query.not('inventory_master_id', 'is', null);
        break;
      
      case 'delisted_only':
        // 出品停止：listing_status='ended' or 'inactive'
        query = query.or('listing_status.eq.ended,listing_status.eq.inactive');
        break;
    }
    
    // SKUフィルター
    if (sku) {
      query = query.eq('sku', sku);
    }
    
    // マーケットプレイスフィルター
    if (marketplace) {
      query = query.eq('marketplace', marketplace);
    }
    
    // 検索フィルター
    if (search) {
      const escapedSearch = search.replace(/[%_]/g, '\\$&');
      query = query.or(
        `title.ilike.%${escapedSearch}%,english_title.ilike.%${escapedSearch}%,sku.ilike.%${escapedSearch}%`
      );
    }

    // ソート
    query = query.order('listing_score', { ascending: false, nullsFirst: false });

    // MUGフィルタリングが不要な場合は通常のページネーション
    if (!needsMugFilter) {
      if (!countOnly) {
        query = query.range(offset, offset + limit - 1);
      }
    } else {
      // MUGフィルタリングが必要な場合は多めに取得
      if (!countOnly) {
        query = query.range(0, fetchLimit - 1);
      }
    }

    // 商品データを取得
    const { data: rawProducts, error, count: rawCount } = await query;

    if (error) {
      console.error('=== Supabase Error Details ===');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Query params:', { listFilter, marketplace, search });
      return NextResponse.json(
        {
          success: false,
          error: `商品取得エラー: ${error.message}`,
          products: [],
          debug: {
            listFilter,
            errorCode: error.code,
            errorDetails: error.details,
            errorHint: error.hint,
          },
        },
        { status: 500 }
      );
    }

    // MUGフィルタリング（非英語タイトルを除外）
    let products = rawProducts || [];
    let totalCount = rawCount || 0;

    if (needsMugFilter && products.length > 0) {
      // MUG派生リスティングを除外（US以外のサイト + 非英語タイトル）
      let filteredProducts = products.filter(
        (p) => !isMugDerivedListing(p)
      );
      
      // 有在庫/無在庫フィルタ（inventory_type + SKUベース）
      if (listFilter === 'in_stock') {
        filteredProducts = filteredProducts.filter(p => isStockItem(p));
      } else if (listFilter === 'back_order_only') {
        filteredProducts = filteredProducts.filter(p => isMuItem(p));
      }
      
      // フィルタリング後の総数を計算
      totalCount = filteredProducts.length;
      
      // ページネーション適用
      products = filteredProducts.slice(offset, offset + limit);
      
      console.log(`[products/route] MUGフィルタ適用: ${rawProducts?.length}件 → ${filteredProducts.length}件`);
    }

    // カウントのみのレスポンス
    if (countOnly) {
      return NextResponse.json({
        success: true,
        count: totalCount,
        filter: listFilter,
      });
    }
    
    console.log(`[products/route] list_filter=${listFilter}, 取得: ${products?.length || 0}件 / 総数: ${totalCount}件`);

    return NextResponse.json({
      success: true,
      products: products || [],
      pagination: {
        total: totalCount,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : '商品データ取得中にエラーが発生しました',
        products: [],
      },
      { status: 500 }
    );
  }
}
