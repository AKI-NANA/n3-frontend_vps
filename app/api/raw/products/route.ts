/**
 * 全件出力API - n8n連携用 Raw Data Export
 * 
 * GET /api/raw/products
 * 
 * 🚨 重要設計原則（絶対に守る）:
 * 1. データを捨てない - フィルタリングは一切しない
 * 2. 変換しない - 値の加工はしない（型統一のみ）
 * 3. 判定しない - ビジネスロジック判定はn8n側で行う
 * 
 * このAPIは「バカ正直なデータの塊」を出力する窓口
 * n8nが全データを受け取り、n8n側でロジックを実行する
 * 
 * @version 1.0.0
 * @author N3 System
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// ============================================================
// 定数定義
// ============================================================

const API_VERSION = 'v1.0.0';
const SOURCE_TABLE = 'products_master';
const PAGE_SIZE = 1000; // Supabase制限対策
const MAX_PAGES = 10;   // 安全上限（10,000件）

// ============================================================
// Supabaseクライアント
// ============================================================

let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

function getSupabase() {
  if (supabaseInstance) return supabaseInstance;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase環境変数が未設定');
  }
  
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  
  return supabaseInstance;
}

// ============================================================
// 型定義
// ============================================================

interface NormalizedProduct {
  // 識別子
  id: string;
  sku: string;
  unique_id: string;
  
  // タイトル
  title_ja: string;
  title_en: string;
  
  // 価格
  cost_jpy: number;
  selling_price_usd: number;
  ddp_price_usd: number;
  profit_margin_pct: number;
  
  // 在庫
  stock_physical: number;
  stock_listing: number;
  stock_set_calculated: number | null;
  
  // 在庫タイプ
  inventory_type: string;
  product_type: string;
  
  // セット品情報
  set_members: any[] | null;
  is_set_component: boolean;
  
  // MU情報
  mu_supplier_info: {
    url?: string;
    supplier_price_jpy?: number;
    supplier_stock?: number;
    last_checked_at?: string;
  } | null;
  
  // ワークフロー
  workflow_status: string;
  listing_status: string;
  approval_status: string;
  is_archived: boolean;
  is_parent: boolean;
  
  // eBay
  ebay_item_id: string;
  ebay_category_id: string;
  ebay_account: string;
  
  // 画像
  images: string[];
  primary_image_url: string;
  
  // タイムスタンプ
  created_at: string;
  updated_at: string;
  listed_at: string | null;
  date_acquired: string | null;
  
  // 分類属性
  attr_l1: string | null;
  attr_l2: string | null;
  attr_l3: string | null;
  attr_l4: string[];
  
  // 保管場所
  storage_location: string | null;
  
  // 重量・配送
  weight_g: number | null;
  shipping_policy: string | null;
  
  // カテゴリ
  category: string;
  ebay_category_name: string | null;
  
  // 生データ参照用キー（デバッグ用、オプショナル）
  _source_id?: string;
}

interface ApiResponse {
  success: boolean;
  meta: {
    total_count: number;
    fetched_at: string;
    processing_time_ms: number;
    api_version: string;
    source_table: string;
    filter_applied: string;
  };
  products: NormalizedProduct[];
  error?: string;
}

// ============================================================
// データ正規化関数
// ============================================================

/**
 * 生データを正規化
 * 
 * 🚨 重要: ここではフィルタリングをしない
 * - null → 空文字やデフォルト値への変換のみ
 * - 型の統一のみ
 * - ビジネスロジック判定は一切しない
 */
function normalizeProduct(raw: any): NormalizedProduct {
  return {
    // 識別子
    id: raw.id ?? '',
    sku: raw.sku ?? '',
    unique_id: raw.unique_id ?? '',
    
    // タイトル
    title_ja: raw.title ?? '',
    title_en: raw.english_title ?? raw.title_en ?? '',
    
    // 価格（数値化、小数点2桁に丸め）
    cost_jpy: Number(raw.cost_price ?? raw.actual_cost_jpy ?? 0),
    selling_price_usd: Number(raw.selling_price ?? raw.price_usd ?? 0),
    ddp_price_usd: Number(raw.ddp_price_usd ?? 0),
    profit_margin_pct: Number(raw.profit_margin ?? raw.sm_profit_margin ?? 0),
    
    // 在庫（整数化）
    stock_physical: Math.floor(Number(raw.physical_quantity ?? 0)),
    stock_listing: Math.floor(Number(raw.listing_quantity ?? 0)),
    stock_set_calculated: raw.set_available_quantity != null 
      ? Math.floor(Number(raw.set_available_quantity)) 
      : null,
    
    // 在庫タイプ
    inventory_type: raw.inventory_type ?? raw.master_inventory_type ?? 'stock',
    product_type: raw.product_type ?? 'single',
    
    // セット品情報
    set_members: Array.isArray(raw.set_members) ? raw.set_members : null,
    is_set_component: raw.is_set_component === true,
    
    // MU情報
    mu_supplier_info: raw.mu_supplier_info ?? null,
    
    // ワークフロー
    workflow_status: raw.workflow_status ?? 'new',
    listing_status: raw.listing_status ?? 'draft',
    approval_status: raw.approval_status ?? 'pending',
    is_archived: raw.is_archived === true,
    is_parent: raw.is_parent !== false, // デフォルトtrue
    
    // eBay
    ebay_item_id: raw.ebay_item_id ?? raw.ebay_data?.item_id ?? '',
    ebay_category_id: String(raw.ebay_category_id ?? raw.category_number ?? ''),
    ebay_account: raw.ebay_account ?? raw.source_data?.ebay_account ?? '',
    
    // 画像
    images: Array.isArray(raw.images) ? raw.images : [],
    primary_image_url: raw.primary_image_url ?? raw.images?.[0] ?? '',
    
    // タイムスタンプ
    created_at: raw.created_at ?? new Date().toISOString(),
    updated_at: raw.updated_at ?? new Date().toISOString(),
    listed_at: raw.listed_at ?? null,
    date_acquired: raw.date_acquired ?? null,
    
    // 分類属性
    attr_l1: raw.attr_l1 ?? null,
    attr_l2: raw.attr_l2 ?? null,
    attr_l3: raw.attr_l3 ?? null,
    attr_l4: Array.isArray(raw.attr_l4) ? raw.attr_l4 : [],
    
    // 保管場所
    storage_location: raw.storage_location ?? null,
    
    // 重量・配送
    weight_g: raw.weight_g != null ? Number(raw.weight_g) : null,
    shipping_policy: raw.shipping_policy ?? null,
    
    // カテゴリ
    category: raw.category ?? '',
    ebay_category_name: raw.category_name ?? raw.ebay_category_name ?? null,
    
    // デバッグ用
    _source_id: raw.source_id ?? raw.id,
  };
}

// ============================================================
// メインハンドラー
// ============================================================

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  const startTime = Date.now();
  
  console.log('[raw/products] API called at', new Date().toISOString());
  
  try {
    const { searchParams } = request.nextUrl;
    
    // クエリパラメータ
    const typeFilter = searchParams.get('type') || 'all';
    const includeRaw = searchParams.get('include_raw') === 'true';
    
    const supabase = getSupabase();
    
    // ============================================================
    // 全件取得（ページネーションで1000件制限を回避）
    // ============================================================
    
    const allProducts: any[] = [];
    let offset = 0;
    let hasMore = true;
    let pageCount = 0;
    
    while (hasMore && pageCount < MAX_PAGES) {
      let query = supabase
        .from(SOURCE_TABLE)
        .select('*')
        .range(offset, offset + PAGE_SIZE - 1);
      
      // 🚨 typeフィルターのみ許可（これは「取得対象の絞り込み」であり「データ削除」ではない）
      // n8n側で特定タイプのみ必要な場合に使用
      switch (typeFilter) {
        case 'set':
          query = query.eq('product_type', 'set');
          break;
        case 'mu':
          query = query.eq('inventory_type', 'mu');
          break;
        case 'parts':
          query = query.eq('is_set_component', true);
          break;
        case 'stock':
          query = query.eq('inventory_type', 'stock');
          break;
        case 'parent':
          query = query.eq('is_parent', true);
          break;
        // 'all' の場合はフィルターなし
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }
      
      if (data && data.length > 0) {
        allProducts.push(...data);
        offset += PAGE_SIZE;
        hasMore = data.length === PAGE_SIZE;
        pageCount++;
        
        console.log(`[raw/products] Fetched page ${pageCount}: ${data.length} items`);
      } else {
        hasMore = false;
      }
    }
    
    if (pageCount >= MAX_PAGES) {
      console.warn(`[raw/products] ⚠️ 安全上限${MAX_PAGES * PAGE_SIZE}件に達しました`);
    }
    
    // ============================================================
    // データ正規化
    // ============================================================
    
    const normalizedProducts = allProducts.map(p => {
      const normalized = normalizeProduct(p);
      
      // デバッグ用に生データを含める（オプション）
      if (includeRaw) {
        (normalized as any)._raw = p;
      }
      
      return normalized;
    });
    
    // ============================================================
    // レスポンス生成
    // ============================================================
    
    const processingTime = Date.now() - startTime;
    
    console.log(`[raw/products] ✅ Completed: ${normalizedProducts.length} products in ${processingTime}ms`);
    
    return NextResponse.json({
      success: true,
      meta: {
        total_count: normalizedProducts.length,
        fetched_at: new Date().toISOString(),
        processing_time_ms: processingTime,
        api_version: API_VERSION,
        source_table: SOURCE_TABLE,
        filter_applied: typeFilter !== 'all' ? typeFilter : 'none',
      },
      products: normalizedProducts,
    });
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('[raw/products] ❌ Error:', errorMessage);
    
    return NextResponse.json({
      success: false,
      meta: {
        total_count: 0,
        fetched_at: new Date().toISOString(),
        processing_time_ms: processingTime,
        api_version: API_VERSION,
        source_table: SOURCE_TABLE,
        filter_applied: 'error',
      },
      products: [],
      error: errorMessage,
    }, { status: 500 });
  }
}

// ============================================================
// POST: n8nからの在庫更新受信用
// ============================================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log('[raw/products] POST received at', new Date().toISOString());
  
  try {
    const body = await request.json();
    const { action, products } = body;
    
    if (action !== 'update_stock') {
      return NextResponse.json({
        success: false,
        error: `Unknown action: ${action}`,
      }, { status: 400 });
    }
    
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'products array is required',
      }, { status: 400 });
    }
    
    const supabase = getSupabase();
    const results: any[] = [];
    
    for (const product of products) {
      if (!product.id) continue;
      
      const updateData: Record<string, any> = {};
      
      // 更新可能フィールド（在庫関連のみ）
      if (product.stock_physical !== undefined) {
        updateData.physical_quantity = product.stock_physical;
      }
      if (product.stock_set_calculated !== undefined) {
        updateData.set_available_quantity = product.stock_set_calculated;
      }
      
      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date().toISOString();
        
        const { error } = await supabase
          .from(SOURCE_TABLE)
          .update(updateData)
          .eq('id', product.id);
        
        results.push({
          id: product.id,
          success: !error,
          error: error?.message,
        });
      }
    }
    
    console.log(`[raw/products] POST completed: ${results.filter(r => r.success).length}/${results.length} updated`);
    
    return NextResponse.json({
      success: true,
      updated_count: results.filter(r => r.success).length,
      results,
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[raw/products] POST error:', errorMessage);
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}
