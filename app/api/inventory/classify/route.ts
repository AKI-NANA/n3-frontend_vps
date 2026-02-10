/**
 * 有在庫判定実行API
 * POST /api/inventory/classify
 * 
 * キューアイテムの有在庫/無在庫を判定し、inventory_masterに登録
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateNextSKU } from '@/lib/utils/sku-generator'

interface ClassifyRequest {
  queue_id: string
  classification: 'stock' | 'dropship' | 'skip'
  notes?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: ClassifyRequest = await req.json()
    const { queue_id, classification, notes } = body
    
    if (!queue_id || !classification) {
      return NextResponse.json(
        { error: 'queue_id と classification は必須です' },
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    // キューアイテムを取得
    const { data: queueItem, error: fetchError } = await supabase
      .from('stock_classification_queue')
      .select('*')
      .eq('id', queue_id)
      .single()
    
    if (fetchError || !queueItem) {
      return NextResponse.json(
        { error: 'キューアイテムが見つかりません' },
        { status: 404 }
      )
    }
    
    // スキップの場合は何もしない
    if (classification === 'skip') {
      return NextResponse.json({
        success: true,
        message: 'スキップしました'
      })
    }
    
    // トランザクション開始
    const isStock = classification === 'stock'
    
    // キューアイテムの判定結果を更新
    const { error: updateQueueError } = await supabase
      .from('stock_classification_queue')
      .update({
        is_stock: isStock,
        classified_by: 'user', // TODO: 実際のユーザーIDに変更
        classified_at: new Date().toISOString()
      })
      .eq('id', queue_id)
    
    if (updateQueueError) {
      console.error('キュー更新エラー:', updateQueueError)
      return NextResponse.json(
        { error: `キュー更新失敗: ${updateQueueError.message}` },
        { status: 500 }
      )
    }
    
    // 無在庫の場合はここで終了
    if (!isStock) {
      return NextResponse.json({
        success: true,
        message: '無在庫として記録しました'
      })
    }
    
    // === 有在庫の場合: inventory_masterに登録 ===
    
    // 1. 重複検出（商品名で検索）
    const { data: existingProducts } = await supabase
      .from('inventory_master')
      .select('*')
      .ilike('product_name', `%${queueItem.product_name}%`)
      .limit(5)
    
    let inventoryId: string
    
    if (existingProducts && existingProducts.length > 0) {
      // 既存商品がある場合は最初のものに紐づけ（TODO: ユーザーに選択させる）
      inventoryId = existingProducts[0].id
      console.log(`既存商品に紐づけ: ${inventoryId}`)
      
      // キューに inventory_id を設定
      await supabase
        .from('stock_classification_queue')
        .update({ inventory_id: inventoryId })
        .eq('id', queue_id)
      
    } else {
      // 新規商品として登録
      const newSKU = await generateNextSKU()
      
      // 🆕 P2: eBay固有データの構築
      const ebayData = queueItem.marketplace === 'ebay' && queueItem.scraped_data ? {
        listing_id: queueItem.listing_id,
        condition: queueItem.scraped_data.condition,
        price: queueItem.scraped_data.price,
        quantity: queueItem.scraped_data.quantity,
        url: queueItem.scraped_data.url,
        scraped_at: new Date().toISOString()
      } : null

      const { data: newProduct, error: insertError } = await supabase
        .from('inventory_master')
        .insert({
          unique_id: newSKU,
          product_name: queueItem.product_name || '商品名未設定',
          sku: newSKU,
          product_type: 'stock',
          physical_quantity: 1, // デフォルト在庫数
          listing_quantity: 0,
          cost_price: 0,
          selling_price: 0,
          condition_name: 'used',
          category: queueItem.scraped_data?.category || 'Electronics',
          images: queueItem.images || [],
          marketplace: queueItem.marketplace,  // 🆕 P2: マーケットプレイス情報を保存
          account: queueItem.account,  // 🆕 P2: アカウント情報を保存（P1との整合性）
          ebay_data: ebayData,  // 🆕 P2: eBay固有データ
          is_manual_entry: false,
          priority_score: 0,
          notes: notes || `${queueItem.marketplace} ${queueItem.account}から取り込み`
        })
        .select()
        .single()
      
      if (insertError || !newProduct) {
        console.error('inventory_master登録エラー:', insertError)
        return NextResponse.json(
          { error: `在庫登録失敗: ${insertError?.message}` },
          { status: 500 }
        )
      }
      
      inventoryId = newProduct.id
      console.log(`新規商品登録: ${inventoryId}`)
      
      // キューに inventory_id を設定
      await supabase
        .from('stock_classification_queue')
        .update({ inventory_id: inventoryId })
        .eq('id', queue_id)
    }
    
    // 2. marketplace_listings に出品記録を作成
    const { error: listingError } = await supabase
      .from('marketplace_listings')
      .insert({
        inventory_id: inventoryId,
        marketplace: queueItem.marketplace,
        account: queueItem.account,
        listing_id: queueItem.listing_id,
        listing_quantity: 1,
        status: 'active',
        scraped_data: queueItem.scraped_data,
        api_data: null
      })
    
    if (listingError) {
      // 重複エラーは無視（既に登録済み）
      if (listingError.code !== '23505') {
        console.error('marketplace_listings登録エラー:', listingError)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: '有在庫として登録しました',
      inventory_id: inventoryId
    })
    
  } catch (error: any) {
    console.error('分類API エラー:', error)
    return NextResponse.json(
      { error: `内部エラー: ${error.message}` },
      { status: 500 }
    )
  }
}
