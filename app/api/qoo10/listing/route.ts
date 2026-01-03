/**
 * Qoo10 出品API
 * /app/api/qoo10/listing/route.ts
 * 
 * SetNewGoods APIを使用した商品登録
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateQoo10Html } from '@/lib/qoo10/template-engine';

export const dynamic = 'force-dynamic';

// =====================================================
// 型定義
// =====================================================

interface Qoo10ListingRequest {
  productId: string;
  
  // 基本情報
  title: string;
  description?: string;
  categoryCode: string;
  
  // 価格
  sellingPrice: number;
  marketPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  
  // 配送
  shippingCarrier: 'yamato' | 'jp_post' | 'sagawa';
  shippingSize: string;
  shippingFee: number;
  isFreeShipping: boolean;
  
  // 画像
  imageUrls: string[];
  
  // HTML
  htmlDescription?: string;
  templateType?: 'standard' | 'premium' | 'simple' | 'minimal';
  
  // オプション
  isDraft?: boolean;
  scheduledAt?: string;
}

interface Qoo10ApiResponse {
  ResultCode: string;
  ResultMsg: string;
  ItemCode?: string;
  ResultObject?: any;
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
// POST: 商品登録
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body: Qoo10ListingRequest = await request.json();
    
    // バリデーション
    const validation = validateListingRequest(body);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: validation.error,
      }, { status: 400 });
    }
    
    // 商品データ取得
    const supabase = getSupabase();
    const { data: product, error: productError } = await supabase
      .from('products_master')
      .select('*')
      .eq('id', body.productId)
      .single();
    
    if (productError || !product) {
      return NextResponse.json({
        success: false,
        error: '商品が見つかりません',
      }, { status: 404 });
    }
    
    // HTML説明文生成
    let htmlDescription = body.htmlDescription;
    if (!htmlDescription) {
      htmlDescription = generateQoo10Html(product, {
        type: body.templateType || 'standard',
        showShippingInfo: true,
        showReturnPolicy: true,
      });
    }
    
    // Qoo10 API パラメータ構築
    const apiParams = buildQoo10Params({
      ...body,
      htmlDescription,
      product,
    });
    
    // 下書き保存の場合
    if (body.isDraft) {
      return await saveDraft(supabase, body.productId, apiParams);
    }
    
    // スケジュール出品の場合
    if (body.scheduledAt) {
      return await scheduleListint(supabase, body.productId, apiParams, body.scheduledAt);
    }
    
    // 即時出品
    const result = await callQoo10Api('SetNewGoods', apiParams);
    
    if (result.ResultCode === '0') {
      // 成功：DBを更新
      await updateProductAfterListing(supabase, body.productId, result);
      
      return NextResponse.json({
        success: true,
        itemCode: result.ItemCode,
        message: '出品が完了しました',
        result,
      });
    } else {
      // 失敗
      return NextResponse.json({
        success: false,
        error: result.ResultMsg || 'Qoo10 APIエラー',
        code: result.ResultCode,
        result,
      }, { status: 400 });
    }
    
  } catch (error: any) {
    console.error('[Qoo10 Listing API] エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// =====================================================
// GET: 出品状態確認
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemCode = searchParams.get('itemCode');
    const productId = searchParams.get('productId');
    
    if (itemCode) {
      // 特定商品の状態確認
      const result = await callQoo10Api('GetGoodsInfo', {
        ItemCode: itemCode,
      });
      
      return NextResponse.json({
        success: true,
        data: result,
      });
    }
    
    if (productId) {
      // 商品IDから状態確認
      const supabase = getSupabase();
      const { data: product } = await supabase
        .from('products_master')
        .select('qoo10_data, marketplace_listings')
        .eq('id', productId)
        .single();
      
      return NextResponse.json({
        success: true,
        data: {
          qoo10_data: product?.qoo10_data,
          listing_status: product?.marketplace_listings?.qoo10_jp,
        },
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'itemCode または productId が必要です',
    }, { status: 400 });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// =====================================================
// PUT: 商品更新
// =====================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemCode, updates } = body;
    
    if (!itemCode) {
      return NextResponse.json({
        success: false,
        error: 'itemCode が必要です',
      }, { status: 400 });
    }
    
    // UpdateGoods API呼び出し
    const result = await callQoo10Api('UpdateGoods', {
      ItemCode: itemCode,
      ...updates,
    });
    
    return NextResponse.json({
      success: result.ResultCode === '0',
      result,
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// =====================================================
// DELETE: 出品終了
// =====================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemCode = searchParams.get('itemCode');
    
    if (!itemCode) {
      return NextResponse.json({
        success: false,
        error: 'itemCode が必要です',
      }, { status: 400 });
    }
    
    // DeleteGoods API呼び出し
    const result = await callQoo10Api('DeleteGoods', {
      ItemCode: itemCode,
    });
    
    return NextResponse.json({
      success: result.ResultCode === '0',
      result,
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// =====================================================
// ヘルパー関数
// =====================================================

function validateListingRequest(body: Qoo10ListingRequest): { valid: boolean; error?: string } {
  if (!body.productId) return { valid: false, error: 'productId が必要です' };
  if (!body.title) return { valid: false, error: 'title が必要です' };
  if (!body.categoryCode) return { valid: false, error: 'categoryCode が必要です' };
  if (!body.sellingPrice || body.sellingPrice <= 0) return { valid: false, error: '有効な sellingPrice が必要です' };
  if (!body.imageUrls?.length) return { valid: false, error: '少なくとも1枚の画像が必要です' };
  
  return { valid: true };
}

function buildQoo10Params(data: any): Record<string, string> {
  const { product, ...listing } = data;
  
  // Qoo10 APIパラメータ
  // 参考: https://qoo10.jp/gmkt.inc/seller/api.aspx
  return {
    // 基本情報
    ItemTitle: listing.title.substring(0, 100),
    PromotionName: listing.title.substring(0, 30),
    SellerCode: product.sku || `N3-${Date.now()}`,
    
    // カテゴリ
    SecondSubCat: listing.categoryCode,
    
    // 価格
    ItemPrice: String(listing.sellingPrice),
    RetailPrice: String(listing.marketPrice || listing.sellingPrice),
    ItemQty: String(listing.stockQuantity || 1),
    
    // 配送
    ShippingNo: getShippingCode(listing.shippingCarrier, listing.shippingFee, listing.isFreeShipping),
    DesiredShippingDate: '3',  // 3日以内発送
    AvailableDateValue: '0',
    
    // 画像
    ImageUrl: listing.imageUrls[0] || '',
    ...(listing.imageUrls.slice(1, 10).reduce((acc: any, url: string, idx: number) => {
      acc[`ImageUrl${idx + 2}`] = url;
      return acc;
    }, {})),
    
    // 説明文
    ItemDetail: listing.htmlDescription || '',
    
    // オプション
    OptionType: '0',  // オプションなし
    AdultYN: 'N',
    ProductionPlaceType: '2',  // 日本
    ProductionPlace: 'JP',
    IndustrialCodeType: '',
    IndustrialCode: product.jan_code || '',
    
    // 状態
    ItemStatus: 'S1',  // 販売中
    ExpireDate: '',
  };
}

function getShippingCode(carrier: string, fee: number, isFree: boolean): string {
  // Qoo10の配送グループID（実際のIDに置き換え必要）
  if (isFree) return 'FREE001';
  
  switch (carrier) {
    case 'yamato': return 'YAMATO001';
    case 'jp_post': return 'JPPOST001';
    case 'sagawa': return 'SAGAWA001';
    default: return 'DEFAULT001';
  }
}

async function callQoo10Api(
  method: string,
  params: Record<string, string>
): Promise<Qoo10ApiResponse> {
  const apiKey = process.env.QOO10_API_KEY;
  const apiUrl = process.env.QOO10_API_URL || 'https://api.qoo10.jp/GMKT.INC.Front.QAPIService/ebayjapan.qapi';
  
  if (!apiKey) {
    throw new Error('QOO10_API_KEY が設定されていません');
  }
  
  const formData = new URLSearchParams({
    v: '1.0',
    returnType: 'json',
    method,
    key: apiKey,
    ...params,
  });
  
  console.log(`[Qoo10 API] ${method} 呼び出し`);
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
  
  if (!response.ok) {
    throw new Error(`Qoo10 API HTTP エラー: ${response.status}`);
  }
  
  const result = await response.json();
  console.log(`[Qoo10 API] ${method} 結果:`, result.ResultCode);
  
  return result;
}

async function saveDraft(
  supabase: any,
  productId: string,
  params: Record<string, string>
) {
  // 下書き保存
  await supabase
    .from('products_master')
    .update({
      qoo10_data: {
        ...params,
        listing_status: 'draft',
        saved_at: new Date().toISOString(),
      },
      marketplace_listings: {
        qoo10_jp: {
          status: 'draft',
          updated_at: new Date().toISOString(),
        },
      },
    })
    .eq('id', productId);
  
  return NextResponse.json({
    success: true,
    message: '下書きを保存しました',
    isDraft: true,
  });
}

async function scheduleListint(
  supabase: any,
  productId: string,
  params: Record<string, string>,
  scheduledAt: string
) {
  // スケジュール出品をキューに追加
  await supabase
    .from('listing_queue')
    .insert({
      product_id: productId,
      marketplace: 'qoo10_jp',
      scheduled_at: scheduledAt,
      status: 'pending',
      listing_data: params,
      created_at: new Date().toISOString(),
    });
  
  await supabase
    .from('products_master')
    .update({
      marketplace_listings: {
        qoo10_jp: {
          status: 'pending',
          scheduled_at: scheduledAt,
          updated_at: new Date().toISOString(),
        },
      },
    })
    .eq('id', productId);
  
  return NextResponse.json({
    success: true,
    message: `${new Date(scheduledAt).toLocaleString('ja-JP')} に出品予定`,
    scheduledAt,
  });
}

async function updateProductAfterListing(
  supabase: any,
  productId: string,
  result: Qoo10ApiResponse
) {
  await supabase
    .from('products_master')
    .update({
      qoo10_data: {
        item_code: result.ItemCode,
        listing_status: 'listed',
        listed_at: new Date().toISOString(),
      },
      marketplace_listings: {
        qoo10_jp: {
          status: 'listed',
          listing_id: result.ItemCode,
          external_listing_id: result.ItemCode,
          listed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          currency: 'JPY',
        },
      },
    })
    .eq('id', productId);
}
