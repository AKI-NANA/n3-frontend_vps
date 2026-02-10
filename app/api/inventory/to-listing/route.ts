import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

/**
 * 在庫から出品データを作成
 * inventory_master → products_master
 */
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const body = await request.json()
    const { inventoryId, marketplace, account, listingData } = body

    // 在庫データ取得
    const { data: inventory, error: inventoryError } = await supabase
      .from('inventory_master')
      .select('*')
      .eq('id', inventoryId)
      .single()

    if (inventoryError || !inventory) {
      return NextResponse.json({
        success: false,
        error: '在庫データが見つかりません'
      }, { status: 404 })
    }

    // 在庫チェック
    if ((inventory.physical_quantity || 0) <= 0) {
      return NextResponse.json({
        success: false,
        error: '在庫がありません'
      }, { status: 400 })
    }

    // 出品データ作成
    const productData = {
      // 基本情報
      product_name: listingData.title || inventory.product_name,
      title: listingData.title || inventory.product_name,
      sku: inventory.sku,

      // 価格
      cost_price: inventory.cost_price,
      selling_price: listingData.price,
      current_price: listingData.price,
      listing_price: listingData.price,

      // 在庫連携
      inventory_id: inventory.id,

      // マーケットプレイス情報
      marketplace,
      account,

      // 画像
      images: listingData.images || inventory.images,
      primary_image_url: (listingData.images || inventory.images)?.[0] || null,

      // コンディション
      condition_name: listingData.condition || inventory.condition_name || 'Used',

      // 数量
      listing_quantity: listingData.quantity || 1,
      physical_quantity: inventory.physical_quantity,

      // ステータス
      status: 'draft',
      approval_status: 'pending',
      listing_status: 'draft',

      // 説明
      description: listingData.description || inventory.description || '',

      // メタデータ
      source_data: {
        from_inventory: true,
        inventory_id: inventory.id,
        inventory_sku: inventory.sku,
        created_from: 'inventory_to_listing',
        original_cost: inventory.cost_price,
        ebay_account: marketplace === 'ebay' ? account : undefined,
        mercari_account: marketplace === 'mercari' ? account : undefined
      },

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // products_master に挿入
    const { data: newProduct, error: insertError } = await supabase
      .from('products_master')
      .insert(productData)
      .select()
      .single()

    if (insertError) {
      console.error('出品データ作成エラー:', insertError)
      return NextResponse.json({
        success: false,
        error: insertError.message
      }, { status: 500 })
    }

    // 在庫の出品済みフラグ更新
    await supabase
      .from('inventory_master')
      .update({
        is_listed: true,
        listed_marketplace: marketplace,
        listed_product_id: newProduct.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', inventoryId)

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: `${marketplace}への出品準備が完了しました`
    })

  } catch (error: any) {
    console.error('API エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message || '不明なエラー'
    }, { status: 500 })
  }
}

/**
 * 在庫IDから出品可能な商品情報を取得
 */
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { searchParams } = new URL(request.url)
    const inventoryId = searchParams.get('inventoryId')

    if (!inventoryId) {
      return NextResponse.json({
        success: false,
        error: '在庫IDが指定されていません'
      }, { status: 400 })
    }

    const { data: inventory, error } = await supabase
      .from('inventory_master')
      .select('*')
      .eq('id', inventoryId)
      .single()

    if (error || !inventory) {
      return NextResponse.json({
        success: false,
        error: '在庫データが見つかりません'
      }, { status: 404 })
    }

    // 既存の出品を確認
    const { data: existingListings } = await supabase
      .from('products_master')
      .select('id, marketplace, account, status')
      .eq('inventory_id', inventoryId)

    return NextResponse.json({
      success: true,
      inventory,
      existingListings: existingListings || [],
      canList: (inventory.physical_quantity || 0) > 0
    })

  } catch (error: any) {
    console.error('API エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message || '不明なエラー'
    }, { status: 500 })
  }
}
