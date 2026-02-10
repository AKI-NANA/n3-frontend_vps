import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * テスト用: 指定した商品名で検索し、出品スケジュールを作成
 * GET /api/test/create-test-schedule?title=MTG%20Final%20Fantasy%20Aerith
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const searchTitle = searchParams.get('title') || 'MTG Final Fantasy Aerith'
    
    console.log('[TEST API] Searching for product:', searchTitle)
    
    // 1. 商品を検索
    const { data: products, error: searchError } = await supabase
      .from('products_master')
      .select('id, sku, title, title_en, english_title, ai_confidence_score, listing_score, primary_image_url')
      .or(`title.ilike.%${searchTitle}%,title_en.ilike.%${searchTitle}%,english_title.ilike.%${searchTitle}%`)
      .limit(5)
    
    if (searchError) {
      console.error('[TEST API] Search error:', searchError)
      return NextResponse.json(
        { error: 'Product search failed', details: searchError },
        { status: 500 }
      )
    }
    
    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'No products found matching the search criteria', searchTitle },
        { status: 404 }
      )
    }
    
    console.log('[TEST API] Found products:', products.length, products.map(p => p.sku))
    
    // 2. 最初にヒットした商品でスケジュールを作成
    const product = products[0]
    const now = new Date()
    
    // 今日、明日、明後日にスケジュール
    const scheduleRecords = [
      {
        product_id: product.id,
        marketplace: 'ebay',
        account_id: 'MJT',
        scheduled_at: new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(), // 1時間後
        status: 'SCHEDULED',
        listing_strategy: 'test',
        priority: 100,
      },
      {
        product_id: product.id,
        marketplace: 'ebay',
        account_id: 'GREEN',
        scheduled_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 明日
        status: 'PENDING',
        listing_strategy: 'test',
        priority: 90,
      },
    ]
    
    // 他の商品もあればスケジュールに追加
    if (products.length > 1) {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      products.slice(1).forEach((p, i) => {
        scheduleRecords.push({
          product_id: p.id,
          marketplace: 'ebay',
          account_id: i % 2 === 0 ? 'MJT' : 'GREEN',
          scheduled_at: new Date(tomorrow.getTime() + (i + 1) * 60 * 60 * 1000).toISOString(),
          status: 'PENDING',
          listing_strategy: 'test',
          priority: 80 - i * 10,
        })
      })
    }
    
    console.log('[TEST API] Creating schedule records:', scheduleRecords.length)
    
    const { data: insertedSchedules, error: insertError } = await supabase
      .from('listing_schedule')
      .insert(scheduleRecords)
      .select()
    
    if (insertError) {
      console.error('[TEST API] Insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create schedule', details: insertError },
        { status: 500 }
      )
    }
    
    // 3. 商品のapproval_statusも更新
    const productIds = products.map(p => p.id)
    const { error: updateError } = await supabase
      .from('products_master')
      .update({ 
        approval_status: 'approved',
        approved_at: new Date().toISOString()
      })
      .in('id', productIds)
    
    if (updateError) {
      console.warn('[TEST API] Update error (non-fatal):', updateError)
    }
    
    return NextResponse.json({
      success: true,
      message: `Test schedules created successfully for ${products.length} products`,
      data: {
        products: products.map(p => ({
          id: p.id,
          sku: p.sku,
          title: p.english_title || p.title_en || p.title,
          score: p.ai_confidence_score || p.listing_score
        })),
        schedulesCreated: insertedSchedules?.length || 0,
        schedules: insertedSchedules
      }
    })
    
  } catch (error) {
    console.error('[TEST API] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Unexpected error occurred', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * テストスケジュールを削除
 * DELETE /api/test/create-test-schedule
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('listing_schedule')
      .delete()
      .eq('listing_strategy', 'test')
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete test schedules', details: error },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'All test schedules deleted'
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Unexpected error occurred', details: String(error) },
      { status: 500 }
    )
  }
}
