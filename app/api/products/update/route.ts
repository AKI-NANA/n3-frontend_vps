// app/api/products/update/route.ts
// V9.3 - marketplace_listingsマージ対応版

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { id, updates } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    console.log('📝 商品更新API呼び出し:', { id, updateFields: Object.keys(updates) })
    
    const supabase = await createClient()
    
    // ✅ 現在の商品データを取得（マージ用）
    const { data: currentProduct } = await supabase
      .from('products_master')
      .select('listing_data, marketplace_listings, scraped_data, qoo10_data')
      .eq('id', id)
      .single()
    
    let finalUpdates = { ...updates }
    
    // ✅ listing_dataマージ
    if (updates.listing_data) {
      const existingListingData = currentProduct?.listing_data || {}
      finalUpdates.listing_data = {
        ...existingListingData,
        ...updates.listing_data,
      }
      console.log('🔄 listing_dataマージ完了')
    }
    
    // ✅ marketplace_listingsマージ（新規追加）
    if (updates.marketplace_listings) {
      const existingListings = currentProduct?.marketplace_listings || {}
      finalUpdates.marketplace_listings = {
        ...existingListings,
        ...updates.marketplace_listings,
      }
      
      // 各マーケットプレイスのデータもマージ
      for (const key of Object.keys(updates.marketplace_listings)) {
        if (existingListings[key]) {
          finalUpdates.marketplace_listings[key] = {
            ...existingListings[key],
            ...updates.marketplace_listings[key],
          }
        }
      }
      
      console.log('🔄 marketplace_listingsマージ完了:', Object.keys(finalUpdates.marketplace_listings))
    }
    
    // ✅ scraped_dataマージ（新規追加）
    if (updates.scraped_data) {
      const existingScrapedData = currentProduct?.scraped_data || {}
      finalUpdates.scraped_data = {
        ...existingScrapedData,
        ...updates.scraped_data,
      }
      console.log('🔄 scraped_dataマージ完了')
    }
    
    // ✅ qoo10_dataマージ（新規追加）
    if (updates.qoo10_data) {
      const existingQoo10Data = currentProduct?.qoo10_data || {}
      finalUpdates.qoo10_data = {
        ...existingQoo10Data,
        ...updates.qoo10_data,
      }
      console.log('🔄 qoo10_dataマージ完了')
    }
    
    // 🔥 products_masterテーブルを更新
    const { data, error } = await supabase
      .from('products_master')
      .update(finalUpdates)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('❌ Supabase更新エラー:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
    
    if (!data || data.length === 0) {
      console.error('❌ 商品が見つかりません:', id)
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    const product = data[0]
    console.log('✅ 商品更新成功:', product.id)
    
    return NextResponse.json({
      success: true,
      product: product
    })
    
  } catch (error: any) {
    console.error('❌ 商品更新処理エラー:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}

// PUT メソッドも追加（RESTful対応）
export async function PUT(request: Request) {
  return POST(request)
}
