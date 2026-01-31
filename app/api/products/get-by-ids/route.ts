/**
 * 商品データ一括取得 API
 * n8nワークフローから呼び出される
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'ids array is required', data: [] },
        { status: 400 }
      )
    }

    // products_masterから商品データを取得
    const { data: products, error } = await supabase
      .from('products_master')
      .select(`
        id,
        sku,
        title,
        title_en,
        english_title,
        description,
        description_en,
        ddp_price_usd,
        ddu_price_usd,
        ebay_category_id,
        category_id,
        condition,
        condition_name,
        stock_quantity,
        listing_data,
        scraped_data,
        ebay_api_data,
        primary_image_url,
        gallery_images,
        image_urls,
        html_content,
        shipping_policy,
        workflow_status,
        listing_status
      `)
      .in('id', ids)

    if (error) {
      console.error('❌ 商品取得エラー:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message, data: [] },
        { status: 500 }
      )
    }

    // n8n用にデータを整形
    const formattedProducts = products?.map(product => ({
      id: product.id,
      sku: product.sku,
      title: product.english_title || product.title_en || product.title,
      description: product.description_en || product.description || '',
      html_description: product.html_content || product.listing_data?.html_description || '',
      price: product.ddp_price_usd || product.ddu_price_usd || 0,
      category_id: product.ebay_category_id || product.category_id || product.ebay_api_data?.category_id || '183050',
      condition: product.condition || product.condition_name || 'Used',
      quantity: product.stock_quantity || 1,
      images: getImageUrls(product),
      // 元データも保持（詳細が必要な場合用）
      raw: {
        listing_data: product.listing_data,
        ebay_api_data: product.ebay_api_data,
        scraped_data: product.scraped_data
      }
    })) || []

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      count: formattedProducts.length
    })

  } catch (error: any) {
    console.error('❌ API エラー:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message, data: [] },
      { status: 500 }
    )
  }
}

/**
 * 商品から画像URLを取得（複数ソースをフォールバック）
 */
function getImageUrls(product: any): string[] {
  const images: string[] = []

  // scraped_data.image_urls
  if (product.scraped_data?.image_urls?.length > 0) {
    images.push(...product.scraped_data.image_urls)
  }
  
  // image_urls
  if (images.length === 0 && product.image_urls?.length > 0) {
    images.push(...product.image_urls)
  }

  // gallery_images
  if (images.length === 0 && product.gallery_images?.length > 0) {
    images.push(...product.gallery_images)
  }

  // primary_image_url
  if (images.length === 0 && product.primary_image_url) {
    images.push(product.primary_image_url)
  }

  return images.filter(url => url && url.trim() !== '')
}
