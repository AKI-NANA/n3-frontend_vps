import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * 商品の出品可能性をチェック
 * 
 * POST /api/products/validate-listing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, account = 'green' } = body

    console.log(`[validate-listing] productId: ${productId}, account: ${account}`)

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'productIdが必要です'
      }, { status: 400 })
    }

    const supabase = await createClient()
    const errors: string[] = []
    const warnings: string[] = []

    // 1. 商品データ取得
    const { data: product, error: productError } = await supabase
      .from('products_master')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json({
        success: false,
        error: '商品が見つかりません'
      }, { status: 404 })
    }

    // 2. 必須データチェック
    if (!product.title && !product.english_title) {
      errors.push('タイトル（日本語または英語）が未設定です')
    }

    const productPrice = product.current_price || product.recommended_price_usd || product.ddp_price_usd || 0
    if (!productPrice || productPrice <= 0) {
      errors.push('価格が未設定または0円です')
    }

    if (!product.ebay_category_id) {
      errors.push('eBayカテゴリが未設定です')
    }

    if (!product.condition_name && !product.ebay_condition_id) {
      errors.push('商品状態が未設定です')
    }

    if (!product.description && !product.english_description) {
      warnings.push('商品説明が未設定です（推奨）')
    }

    // 画像チェック
    const images = product.gallery_images || product.images || []
    const imageArray = Array.isArray(images) ? images : (images?.urls || [])
    if (imageArray.length === 0 && !product.primary_image_url) {
      errors.push('商品画像が1枚も登録されていません')
    } else if (imageArray.length > 0 && imageArray.length < 3) {
      warnings.push('商品画像は3枚以上推奨です')
    }

    // 3. 配送ポリシー制限チェック（最大14.0kg = RT28）
    const maxWeightKg = 14.0
    let productWeightKg = 0

    // shipping_policyから重量を推定
    if (product.shipping_policy) {
      const match = product.shipping_policy.match(/RT_Express_(\d+)|RT(\d+)/)
      if (match) {
        const rtNumber = parseInt(match[1] || match[2])
        productWeightKg = rtNumber * 0.5
      }
    }

    if (productWeightKg > maxWeightKg) {
      errors.push(`重量が配送ポリシーの上限（${maxWeightKg}kg）を超えています（推定: ${productWeightKg.toFixed(2)}kg）`)
    }

    // 4. ポリシーID取得
    let policyIds = {
      fulfillmentPolicyId: null as string | null,
      paymentPolicyId: null as string | null,
      returnPolicyId: null as string | null
    }

    // Fulfillment Policy（配送ポリシー）
    if (product.shipping_policy_id) {
      policyIds.fulfillmentPolicyId = product.shipping_policy_id
    } else if (product.shipping_policy) {
      // shipping_policy（policy_name）から適切なポリシーを検索
      const { data: fulfillmentPolicy, error: fpError } = await supabase
        .from('shipping_policies')
        .select('policy_name, ebay_policy_id, rate_table_name')
        .eq('policy_name', product.shipping_policy)
        .eq('status', 'uploaded')
        .limit(1)
        .single()

      console.log(`[validate-listing] Fulfillment検索: policy_name=${product.shipping_policy}, 結果:`, fulfillmentPolicy, fpError)

      if (fulfillmentPolicy?.ebay_policy_id) {
        policyIds.fulfillmentPolicyId = fulfillmentPolicy.ebay_policy_id
      }
    }

    if (!policyIds.fulfillmentPolicyId) {
      errors.push('適切な配送ポリシーが見つかりません')
    }

    // Payment Policy
    const { data: paymentPolicy } = await supabase
      .from('payment_policies')
      .select('ebay_policy_id')
      .eq('account', account)
      .limit(1)
      .single()

    if (paymentPolicy?.ebay_policy_id) {
      policyIds.paymentPolicyId = paymentPolicy.ebay_policy_id
    } else {
      errors.push(`Payment Policyが見つかりません（アカウント: ${account}）`)
    }

    // Return Policy
    const { data: returnPolicy } = await supabase
      .from('return_policies')
      .select('ebay_policy_id')
      .eq('account', account)
      .limit(1)
      .single()

    if (returnPolicy?.ebay_policy_id) {
      policyIds.returnPolicyId = returnPolicy.ebay_policy_id
    } else {
      errors.push(`Return Policyが見つかりません（アカウント: ${account}）`)
    }

    // 5. 最終判定
    const canList = errors.length === 0 && 
                    policyIds.fulfillmentPolicyId !== null &&
                    policyIds.paymentPolicyId !== null &&
                    policyIds.returnPolicyId !== null

    console.log(`[validate-listing] canList: ${canList}, errors: ${errors.length}, warnings: ${warnings.length}`)

    return NextResponse.json({
      success: true,
      canList,
      errors,
      warnings,
      productData: {
        id: product.id,
        title: product.english_title || product.title,
        price: productPrice,
        weight_kg: productWeightKg,
        category: product.ebay_category_id,
        images: imageArray.length || (product.primary_image_url ? 1 : 0),
        condition: product.ebay_condition_id || product.condition_name
      },
      policyIds,
      shippingPolicy: product.shipping_policy
    })

  } catch (error: any) {
    console.error('[validate-listing] エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
