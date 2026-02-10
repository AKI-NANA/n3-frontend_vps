/**
 * Qoo10 出品API
 * /api/v2/listing/qoo10/route.ts
 * 
 * Qoo10 Goods API (SetNewGoods) を使用して商品を出品
 * https://developer.qoo10.jp/
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase クライアント
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
}

// Qoo10 API設定
const QOO10_API_URL = process.env.QOO10_API_URL || 'https://api.qoo10.jp/GMKT.INC.Front.OpenApi';
const QOO10_API_KEY = process.env.QOO10_API_KEY || '';

// 出品リクエストの型
interface Qoo10ListingRequest {
  productId: number;
  // 基本情報
  itemTitle: string;
  itemDetail: string;
  sellerCode: string;
  industrialCode?: string;  // JANコード
  brandName?: string;
  // カテゴリ
  secondCategoryCode: string;
  // 価格
  itemPrice: number;
  itemQty: number;
  // 配送
  shippingNo: string;
  availableDateValue?: number;
  desiredShippingDate?: number;
  // 画像
  imageUrl: string;
  optionImageUrls?: string[];
  // オプション
  itemStatus?: 'S1' | 'S2';  // S1: 販売中, S2: 販売停止
  adultYN?: 'Y' | 'N';
  // 追加
  modelNm?: string;
  manufacturerDate?: string;
  expireDate?: string;
  material?: string;
  origin?: string;
}

// Qoo10 APIレスポンスの型
interface Qoo10ApiResponse {
  ResultCode: number;
  ResultMsg: string;
  ResultObject?: {
    ItemCode?: string;
    [key: string]: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: Qoo10ListingRequest = await request.json();
    const supabase = getSupabaseClient();

    // バリデーション
    if (!body.productId || !body.itemTitle || !body.sellerCode) {
      return NextResponse.json(
        { success: false, error: 'productId, itemTitle, sellerCode are required' },
        { status: 400 }
      );
    }

    if (!QOO10_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'QOO10_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Qoo10 API: SetNewGoods
    const params = new URLSearchParams({
      method: 'ItemsGoods.SetNewGoods',
      key: QOO10_API_KEY,
      returnType: 'json',
      // 必須パラメータ
      SellerCode: body.sellerCode,
      SecondSubCat: body.secondCategoryCode,
      ItemTitle: body.itemTitle,
      ItemDetail: body.itemDetail,
      ItemPrice: body.itemPrice.toString(),
      ItemQty: body.itemQty.toString(),
      ShippingNo: body.shippingNo,
      AvailableDateValue: (body.availableDateValue || 3).toString(),
      DesiredShippingDate: (body.desiredShippingDate || 3).toString(),
      // 画像
      ImageUrl: body.imageUrl,
      // オプション
      ItemStatus: body.itemStatus || 'S1',
      AdultYN: body.adultYN || 'N',
    });

    // オプションパラメータ
    if (body.industrialCode) params.append('IndustrialCode', body.industrialCode);
    if (body.brandName) params.append('BrandName', body.brandName);
    if (body.modelNm) params.append('ModelNm', body.modelNm);
    if (body.manufacturerDate) params.append('ManufacturerDate', body.manufacturerDate);
    if (body.expireDate) params.append('ExpireDate', body.expireDate);
    if (body.material) params.append('Material', body.material);
    if (body.origin) params.append('Origin', body.origin);

    // 追加画像
    if (body.optionImageUrls?.length) {
      body.optionImageUrls.slice(0, 9).forEach((url, idx) => {
        params.append(`OptionImage${idx + 1}`, url);
      });
    }

    console.log('[Qoo10 Listing] Calling API:', {
      sellerCode: body.sellerCode,
      itemTitle: body.itemTitle,
      itemPrice: body.itemPrice,
    });

    // Qoo10 APIを呼び出し
    const apiResponse = await fetch(`${QOO10_API_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const apiResult: Qoo10ApiResponse = await apiResponse.json();

    console.log('[Qoo10 Listing] API Response:', apiResult);

    // 結果を確認
    if (apiResult.ResultCode === 0) {
      // 成功
      const itemCode = apiResult.ResultObject?.ItemCode;

      // DBを更新
      const { data: current } = await supabase
        .from('products_master')
        .select('marketplace_listings')
        .eq('id', body.productId)
        .single();

      const existingListings = current?.marketplace_listings || {};
      const updatedListings = {
        ...existingListings,
        qoo10_jp: {
          ...existingListings.qoo10_jp,
          status: 'listed',
          listed_at: new Date().toISOString(),
          listing_id: itemCode,
          item_code: itemCode,
          seller_code: body.sellerCode,
          price_jpy: body.itemPrice,
        },
      };

      await supabase
        .from('products_master')
        .update({ 
          marketplace_listings: updatedListings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.productId);

      return NextResponse.json({
        success: true,
        message: 'Qoo10出品が完了しました',
        itemCode,
        productId: body.productId,
      });

    } else {
      // エラー
      const errorMsg = apiResult.ResultMsg || 'Unknown error';

      // エラーステータスをDBに保存
      const { data: current } = await supabase
        .from('products_master')
        .select('marketplace_listings')
        .eq('id', body.productId)
        .single();

      const existingListings = current?.marketplace_listings || {};
      const updatedListings = {
        ...existingListings,
        qoo10_jp: {
          ...existingListings.qoo10_jp,
          status: 'error',
          error_message: errorMsg,
          last_error_at: new Date().toISOString(),
        },
      };

      await supabase
        .from('products_master')
        .update({ 
          marketplace_listings: updatedListings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.productId);

      return NextResponse.json({
        success: false,
        error: errorMsg,
        errorCode: apiResult.ResultCode,
        productId: body.productId,
      });
    }

  } catch (error: any) {
    console.error('[Qoo10 Listing] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 一括出品
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { listings } = body as { listings: Qoo10ListingRequest[] };

    if (!listings?.length) {
      return NextResponse.json(
        { success: false, error: 'listings array is required' },
        { status: 400 }
      );
    }

    const results: { productId: number; success: boolean; itemCode?: string; error?: string }[] = [];

    for (const listing of listings) {
      try {
        // 個別出品APIを呼び出し
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/v2/listing/qoo10`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(listing),
        });
        const result = await response.json();
        
        results.push({
          productId: listing.productId,
          success: result.success,
          itemCode: result.itemCode,
          error: result.error,
        });

        // レート制限対策
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e: any) {
        results.push({
          productId: listing.productId,
          success: false,
          error: e.message,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: errorCount === 0,
      summary: {
        total: listings.length,
        success: successCount,
        error: errorCount,
      },
      results,
    });

  } catch (error: any) {
    console.error('[Qoo10 Bulk Listing] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 出品ステータス確認
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerCode = searchParams.get('sellerCode');

    if (!sellerCode) {
      return NextResponse.json(
        { success: false, error: 'sellerCode is required' },
        { status: 400 }
      );
    }

    if (!QOO10_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'QOO10_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Qoo10 API: GetGoodsInfo
    const params = new URLSearchParams({
      method: 'ItemsGoods.GetGoodsInfo',
      key: QOO10_API_KEY,
      returnType: 'json',
      SellerCode: sellerCode,
    });

    const apiResponse = await fetch(`${QOO10_API_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const apiResult = await apiResponse.json();

    return NextResponse.json({
      success: apiResult.ResultCode === 0,
      data: apiResult.ResultObject,
      error: apiResult.ResultCode !== 0 ? apiResult.ResultMsg : null,
    });

  } catch (error: any) {
    console.error('[Qoo10 GetGoods] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
