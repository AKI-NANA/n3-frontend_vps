/**
 * Yahoo Auction (ヤフオク) 出品API V2
 * /app/api/yahoo/listing/route.ts
 * 
 * オークタウンCSV生成・商品登録管理
 * Shift_JIS完全対応 / 利益率ベース計算
 * 
 * @version 2.0.0
 * @updated 2026-01-30
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  generateAuctownCSVv2,
  generateCSVRow,
  CSV_HEADERS,
  estimateShippingCost,
} from '@/lib/yahooauction/csv-generator';
import { 
  calculatePriceByProfitRate,
  validateProfitRate,
} from '@/lib/yahooauction/profit-calculator';
import { generateOptimizedTitle } from '@/lib/yahooauction/title-optimizer';
import { 
  YahooAuctionProduct, 
  YahooAuctionListingConfig,
  YahooCsvExportSettings,
  YahooExportLog,
  DEFAULT_LISTING_CONFIG,
  DEFAULT_CSV_EXPORT_SETTINGS,
  DEFAULT_PACKAGING_COST,
} from '@/lib/yahooauction/types';

export const dynamic = 'force-dynamic';

// =====================================================
// 型定義
// =====================================================

interface YahooListingRequestV2 {
  productIds: number[];
  config?: Partial<YahooAuctionListingConfig>;
  exportSettings?: Partial<YahooCsvExportSettings>;
  outputFormat?: 'csv' | 'json' | 'preview';
  isDraft?: boolean;
  saveLog?: boolean;
}

// 後方互換用（V1）
interface YahooListingRequestV1 {
  productIds: number[];
  config?: Partial<YahooAuctionListingConfig>;
  targetRecoveryRate?: number;
  outputFormat?: 'csv' | 'json';
  isDraft?: boolean;
}

// =====================================================
// Supabase
// =====================================================

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// =====================================================
// POST: CSV生成（V2対応）
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    if (!body.productIds || body.productIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: '商品IDが指定されていません',
      }, { status: 400 });
    }
    
    const supabase = getSupabase();
    
    // 商品データ取得
    const { data: products, error: fetchError } = await supabase
      .from('products_master')
      .select(`
        id,
        sku,
        title_en,
        title_ja,
        description_ja,
        price_jpy,
        weight_g,
        images,
        jan_code,
        brand,
        condition,
        yahoo_auction_data
      `)
      .in('id', body.productIds);
    
    if (fetchError || !products) {
      return NextResponse.json({
        success: false,
        error: '商品データの取得に失敗しました',
        details: fetchError?.message,
      }, { status: 500 });
    }
    
    // 設定をマージ
    const config: YahooAuctionListingConfig = {
      ...DEFAULT_LISTING_CONFIG,
      ...body.config,
    };
    
    // V2: exportSettings があれば利益率ベース
    const isV2 = !!body.exportSettings;
    const exportSettings: YahooCsvExportSettings = {
      ...DEFAULT_CSV_EXPORT_SETTINGS,
      ...body.exportSettings,
    };
    
    // 商品データを変換
    const yahooProducts: YahooAuctionProduct[] = products.map(p => ({
      id: p.id,
      sku: p.sku,
      titleEn: p.title_en,
      titleJa: p.title_ja,
      descriptionJa: p.description_ja,
      costPrice: p.price_jpy || 0,
      marketPrice: p.yahoo_auction_data?.market_price,
      retailPrice: p.yahoo_auction_data?.retail_price,
      condition: p.condition || p.yahoo_auction_data?.condition,
      brand: p.brand,
      modelNumber: p.yahoo_auction_data?.model_number,
      weightG: p.weight_g,
      dimensions: p.yahoo_auction_data?.dimensions,
      images: p.images,
      yahooAuctionCategoryId: p.yahoo_auction_data?.category_id || '0',
      isAuthentic: p.yahoo_auction_data?.is_authentic,
      isLimitedEdition: p.yahoo_auction_data?.is_limited,
      isSealed: p.yahoo_auction_data?.is_sealed,
      janCode: p.jan_code,
    }));
    
    // CSV生成（V2: 利益率ベース + Shift_JIS）
    const result = generateAuctownCSVv2(yahooProducts, config, exportSettings);
    
    // 下書き保存の場合
    if (body.isDraft) {
      for (const item of result.items) {
        if (item.csvRow) {
          await supabase
            .from('products_master')
            .update({
              yahoo_auction_data: {
                ...products.find(p => p.id === item.productId)?.yahoo_auction_data,
                listing_status: 'draft',
                draft_csv_row: item.csvRow,
                selling_price: item.sellingPrice,
                profit_rate: item.isProfitable ? ((item.netProceeds - (products.find(p => p.id === item.productId)?.price_jpy || 0)) / item.sellingPrice * 100) : 0,
                saved_at: new Date().toISOString(),
              },
              marketplace_listings: {
                yahoo_auction: {
                  status: 'draft',
                  updated_at: new Date().toISOString(),
                },
              },
              updated_at: new Date().toISOString(),
            })
            .eq('id', item.productId);
        }
      }
    }
    
    // ログ保存
    if (body.saveLog !== false) {
      const log: YahooExportLog = {
        generated_at: new Date().toISOString(),
        product_count: result.successCount,
        total_estimated_profit: result.totalProfit,
        user_setting_snapshot: exportSettings,
        file_name: result.fileName,
        status: result.errorCount === 0 ? 'success' : (result.successCount > 0 ? 'partial' : 'failed'),
        product_ids: body.productIds,
        error_message: result.errorCount > 0 ? `${result.errorCount}件の商品でエラーが発生しました` : undefined,
      };
      
      await supabase.from('yahoo_export_logs').insert(log);
    }
    
    // 出力形式
    if (body.outputFormat === 'csv') {
      // CSVファイルとして返す（Shift_JIS変換済み）
      return new NextResponse(result.csvBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=Shift_JIS',
          'Content-Disposition': `attachment; filename="${result.fileName}"`,
        },
      });
    }
    
    if (body.outputFormat === 'preview') {
      // プレビュー用（JSON + 警告情報）
      return NextResponse.json({
        success: true,
        preview: true,
        summary: {
          total: result.items.length,
          success: result.successCount,
          errors: result.errorCount,
          totalProfit: result.totalProfit,
          guardViolations: result.guardViolationCount,
        },
        items: result.items.map(item => ({
          productId: item.productId,
          sku: item.sku,
          title: item.title,
          sellingPrice: item.sellingPrice,
          netProceeds: item.netProceeds,
          profitRate: item.sellingPrice > 0 
            ? ((item.netProceeds - (yahooProducts.find(p => p.id === item.productId)?.costPrice || 0)) / item.sellingPrice * 100).toFixed(1)
            : '0',
          isProfitable: item.isProfitable,
          warnings: item.warnings,
        })),
        settings: exportSettings,
      });
    }
    
    // JSONで返す（デフォルト）
    return NextResponse.json({
      success: true,
      summary: {
        total: result.items.length,
        success: result.successCount,
        errors: result.errorCount,
        totalProfit: result.totalProfit,
        guardViolations: result.guardViolationCount,
      },
      items: result.items.map(item => ({
        productId: item.productId,
        sku: item.sku,
        title: item.title,
        sellingPrice: item.sellingPrice,
        netProceeds: item.netProceeds,
        isProfitable: item.isProfitable,
        warnings: item.warnings,
      })),
      csvData: result.csvDataUtf8,
      fileName: result.fileName,
      headers: CSV_HEADERS,
    });
    
  } catch (error: any) {
    console.error('[Yahoo Listing API] エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// =====================================================
// GET: 出品状態確認・CSV取得・ログ取得
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const action = searchParams.get('action');
    
    const supabase = getSupabase();
    
    // 単一商品の状態確認
    if (productId) {
      const { data: product } = await supabase
        .from('products_master')
        .select('id, sku, title_ja, price_jpy, yahoo_auction_data, marketplace_listings')
        .eq('id', productId)
        .single();
      
      return NextResponse.json({
        success: true,
        data: {
          id: product?.id,
          sku: product?.sku,
          title: product?.title_ja,
          costPrice: product?.price_jpy,
          yahoo_data: product?.yahoo_auction_data,
          listing_status: product?.marketplace_listings?.yahoo_auction,
        },
      });
    }
    
    // ヘルプ・CSVヘッダー取得
    if (action === 'headers') {
      return NextResponse.json({
        success: true,
        headers: CSV_HEADERS,
        description: 'オークタウンVer.1.19準拠CSVヘッダー（全45列）',
        encoding: 'Shift_JIS',
        lineEnding: 'CRLF',
      });
    }
    
    // 出力ログ履歴取得
    if (action === 'logs') {
      const limit = parseInt(searchParams.get('limit') || '20');
      const { data: logs } = await supabase
        .from('yahoo_export_logs')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(limit);
      
      return NextResponse.json({
        success: true,
        logs: logs || [],
      });
    }
    
    // 利益率計算プレビュー
    if (action === 'calculate') {
      const costPrice = parseFloat(searchParams.get('costPrice') || '0');
      const shippingCost = parseFloat(searchParams.get('shippingCost') || '1000');
      const packagingCost = parseFloat(searchParams.get('packagingCost') || '150');
      const minProfitRate = parseFloat(searchParams.get('minProfitRate') || '15');
      const memberType = (searchParams.get('memberType') || 'lyp_premium') as 'lyp_premium' | 'standard';
      
      const result = calculatePriceByProfitRate({
        costPrice,
        shippingCost,
        packagingCost,
        minProfitRate,
        memberType,
      });
      
      return NextResponse.json({
        success: true,
        calculation: result,
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'productId または action パラメータが必要です',
      availableActions: ['headers', 'logs', 'calculate'],
    }, { status: 400 });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// =====================================================
// PUT: 出品データ更新
// =====================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, updates } = body;
    
    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'productId が必要です',
      }, { status: 400 });
    }
    
    const supabase = getSupabase();
    
    // 現在のデータを取得
    const { data: current } = await supabase
      .from('products_master')
      .select('yahoo_auction_data')
      .eq('id', productId)
      .single();
    
    // 更新
    const { error } = await supabase
      .from('products_master')
      .update({
        yahoo_auction_data: {
          ...current?.yahoo_auction_data,
          ...updates,
          updated_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      message: '更新しました',
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
