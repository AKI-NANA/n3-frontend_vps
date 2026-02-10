// app/api/sellermirror/item-details/route.ts
/**
 * eBay Browse API - 単一商品詳細取得
 * 
 * URL登録機能（tab-mirror.tsx）で使用
 * 
 * @created 2025-01-16
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const EBAY_BROWSE_API_URL = 'https://api.ebay.com/buy/browse/v1/item';

/**
 * POST: Item IDから商品詳細を取得
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId } = body;

    if (!itemId) {
      return NextResponse.json({
        success: false,
        error: 'itemId は必須です'
      }, { status: 400 });
    }

    console.log(`🔍 [item-details] 取得開始: ${itemId}`);

    // eBayトークン取得
    const supabase = await createClient();
    const { data: tokenData, error: tokenError } = await supabase
      .from('ebay_tokens')
      .select('access_token, expires_at')
      .eq('account', 'green')
      .single();

    if (tokenError || !tokenData) {
      console.error('❌ [item-details] トークン取得失敗:', tokenError);
      return NextResponse.json({
        success: false,
        error: 'eBayトークンが見つかりません'
      }, { status: 500 });
    }

    // トークン有効期限チェック
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json({
        success: false,
        error: 'eBayトークンが期限切れです。トークンを更新してください。'
      }, { status: 401 });
    }

    // Browse API呼び出し
    const apiUrl = `${EBAY_BROWSE_API_URL}/${encodeURIComponent(itemId)}`;
    console.log(`📡 [item-details] API URL: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'X-EBAY-C-ENDUSERCTX': 'affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [item-details] API エラー:', response.status, errorText);
      
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: '商品が見つかりません。Item IDを確認してください。'
        }, { status: 404 });
      }
      
      return NextResponse.json({
        success: false,
        error: `eBay API エラー: ${response.status}`
      }, { status: response.status });
    }

    const itemData = await response.json();

    // Item Specificsを抽出
    const itemSpecifics: Record<string, string> = {};
    if (itemData.localizedAspects) {
      for (const aspect of itemData.localizedAspects) {
        if (aspect.name && aspect.value) {
          itemSpecifics[aspect.name] = aspect.value;
        }
      }
    }

    // 原産国を検出
    let originCountry = null;
    const originKeys = ['Country/Region of Manufacture', 'Country of Origin', 'Made In'];
    for (const key of originKeys) {
      if (itemSpecifics[key]) {
        originCountry = itemSpecifics[key];
        break;
      }
    }

    // レスポンス整形
    const detailedItem = {
      itemId: itemData.itemId,
      title: itemData.title,
      price: itemData.price?.value,
      currency: itemData.price?.currency || 'USD',
      condition: itemData.condition,
      conditionDescription: itemData.conditionDescription,
      categoryId: itemData.categoryId,
      categoryPath: itemData.categoryPath,
      image: itemData.image?.imageUrl,
      additionalImages: itemData.additionalImages?.map((img: any) => img.imageUrl) || [],
      seller: {
        username: itemData.seller?.username,
        feedbackScore: itemData.seller?.feedbackScore,
        feedbackPercentage: itemData.seller?.feedbackPercentage,
      },
      itemLocation: {
        country: itemData.itemLocation?.country,
        city: itemData.itemLocation?.city,
        postalCode: itemData.itemLocation?.postalCode,
      },
      shippingOptions: itemData.shippingOptions?.map((opt: any) => ({
        shippingServiceCode: opt.shippingServiceCode,
        shippingCost: opt.shippingCost?.value,
        currency: opt.shippingCost?.currency,
      })) || [],
      quantityAvailable: itemData.estimatedAvailabilities?.[0]?.estimatedAvailableQuantity,
      quantitySold: itemData.estimatedAvailabilities?.[0]?.estimatedSoldQuantity,
      itemWebUrl: itemData.itemWebUrl,
      itemSpecifics,
      originCountry,
      hasDetails: true,
    };

    console.log(`✅ [item-details] 取得成功: ${itemData.title?.substring(0, 50)}...`);
    console.log(`   - Item Specifics: ${Object.keys(itemSpecifics).length}件`);
    console.log(`   - 原産国: ${originCountry || '不明'}`);

    return NextResponse.json({
      success: true,
      detailedItem,
    });

  } catch (error: any) {
    console.error('❌ [item-details] エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'サーバーエラー'
    }, { status: 500 });
  }
}
