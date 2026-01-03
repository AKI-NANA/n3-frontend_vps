import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getEbayAccessToken } from '@/lib/ebay/token';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const EBAY_API_BASE = 'https://api.ebay.com';

export async function POST(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await request.json();
    const { 
      productId, // products_masterのID
      account = 'green'
    } = body;

    console.log('🧪 出品テスト開始:', { productId, account });

    // 1. 商品データ取得
    const { data: product, error: productError } = await supabase
      .from('products_master')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      throw new Error('商品データが見つかりません');
    }

    console.log('📦 商品データ:', product);

    // 2. ポリシーID取得
    // Shipping Policy (重量ベースで選択)
    const weight = product.weight || 500; // グラム
    let shippingPolicyName = 'RT17_P0050'; // デフォルト

    // 重量に応じてポリシーを選択（簡易版）
    if (weight <= 100) shippingPolicyName = 'RT17_P0050';
    else if (weight <= 250) shippingPolicyName = 'RT17_P0100';
    else if (weight <= 500) shippingPolicyName = 'RT17_P0250';
    else if (weight <= 1000) shippingPolicyName = 'RT17_P0500';

    const { data: shippingPolicy } = await supabase
      .from('shipping_policies')
      .select('ebay_policy_id')
      .eq('policy_name', shippingPolicyName)
      .single();

    const { data: paymentPolicy } = await supabase
      .from('payment_policies')
      .select('ebay_policy_id')
      .limit(1)
      .single();

    const { data: returnPolicy } = await supabase
      .from('return_policies')
      .select('ebay_policy_id')
      .limit(1)
      .single();

    if (!shippingPolicy?.ebay_policy_id || !paymentPolicy?.ebay_policy_id || !returnPolicy?.ebay_policy_id) {
      throw new Error('ポリシーIDが不足しています。先に「全ポリシーID同期」を実行してください');
    }

    console.log('📋 ポリシーID:', {
      shipping: shippingPolicy.ebay_policy_id,
      payment: paymentPolicy.ebay_policy_id,
      return: returnPolicy.ebay_policy_id
    });

    // 3. 出品ペイロード構築
    const accessToken = await getEbayAccessToken(account as 'green' | 'mjt');

    const listingPayload = {
      sku: product.sku || `SKU-${product.id}`,
      availability: {
        shipToLocationAvailability: {
          quantity: product.stock || 1
        }
      },
      condition: 'USED_EXCELLENT', // 商品状態（要カスタマイズ）
      product: {
        title: product.title?.substring(0, 80) || 'Test Product',
        description: product.description || 'Test listing from N3 system',
        aspects: {
          Brand: [product.brand || 'Unbranded'],
          Type: [product.category || 'Other']
        },
        imageUrls: product.images ? [product.images[0]] : []
      },
      pricingSummary: {
        price: {
          value: product.price?.toString() || '10.00',
          currency: 'USD'
        }
      },
      listingPolicies: {
        fulfillmentPolicyId: shippingPolicy.ebay_policy_id,
        paymentPolicyId: paymentPolicy.ebay_policy_id,
        returnPolicyId: returnPolicy.ebay_policy_id
      },
      merchantLocationKey: 'DEFAULT', // 要設定
      categoryId: '1', // カテゴリID（要カスタマイズ）
      listingDuration: 'GTC', // Good 'Til Cancelled
      marketplaceId: 'EBAY_US'
    };

    console.log('📤 出品ペイロード:', JSON.stringify(listingPayload, null, 2));

    // 4. eBay Inventory API呼び出し
    const inventoryResponse = await fetch(
      `${EBAY_API_BASE}/sell/inventory/v1/inventory_item/${listingPayload.sku}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Content-Language': 'en-US'
        },
        body: JSON.stringify(listingPayload)
      }
    );

    if (!inventoryResponse.ok) {
      const errorText = await inventoryResponse.text();
      console.error('❌ Inventory Item作成エラー:', errorText);
      throw new Error(`Inventory Item作成失敗: ${errorText}`);
    }

    console.log('✅ Inventory Item作成成功');

    // 5. Offer作成
    const offerPayload = {
      sku: listingPayload.sku,
      marketplaceId: 'EBAY_US',
      format: 'FIXED_PRICE',
      availableQuantity: product.stock || 1,
      categoryId: '1',
      listingDescription: product.description || 'Test listing',
      listingPolicies: listingPayload.listingPolicies,
      pricingSummary: listingPayload.pricingSummary,
      merchantLocationKey: 'DEFAULT'
    };

    const offerResponse = await fetch(
      `${EBAY_API_BASE}/sell/inventory/v1/offer`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Content-Language': 'en-US'
        },
        body: JSON.stringify(offerPayload)
      }
    );

    if (!offerResponse.ok) {
      const errorText = await offerResponse.text();
      console.error('❌ Offer作成エラー:', errorText);
      throw new Error(`Offer作成失敗: ${errorText}`);
    }

    const offerData = await offerResponse.json();
    console.log('✅ Offer作成成功:', offerData);

    // 6. Publish（出品実行）
    const publishResponse = await fetch(
      `${EBAY_API_BASE}/sell/inventory/v1/offer/${offerData.offerId}/publish`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!publishResponse.ok) {
      const errorText = await publishResponse.text();
      console.error('❌ 出品エラー:', errorText);
      throw new Error(`出品失敗: ${errorText}`);
    }

    const publishData = await publishResponse.json();
    console.log('✅ 出品成功:', publishData);

    // 7. DBに出品情報を保存
    await supabase
      .from('products_master')
      .update({
        ebay_listing_id: publishData.listingId,
        ebay_offer_id: offerData.offerId,
        listing_status: 'active',
        listed_at: new Date().toISOString()
      })
      .eq('id', productId);

    return NextResponse.json({
      success: true,
      message: '出品成功！',
      listingId: publishData.listingId,
      offerId: offerData.offerId,
      sku: listingPayload.sku,
      policies: {
        shipping: shippingPolicy.ebay_policy_id,
        payment: paymentPolicy.ebay_policy_id,
        return: returnPolicy.ebay_policy_id
      }
    });

  } catch (error: any) {
    console.error('❌ 出品テストエラー:', error);
    return NextResponse.json(
      {
        error: '出品に失敗しました',
        details: error.message
      },
      { status: 500 }
    );
  }
}
