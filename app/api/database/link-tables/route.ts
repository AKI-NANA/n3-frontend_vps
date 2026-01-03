/**
 * テーブル連携API
 * POST /api/database/link-tables
 * 
 * products_master と inventory_master をSKUベースで連携
 */
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
)

export async function GET() {
  try {
    // 連携統計を取得
    const stats = await getLinkageStats()
    
    return NextResponse.json({
      success: true,
      stats,
      message: '連携統計を取得しました'
    })
  } catch (error: any) {
    console.error('Stats error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'link') {
      // SKUベースで連携実行
      const result = await linkBySkuManual()
      const stats = await getLinkageStats()
      
      return NextResponse.json({
        success: true,
        result,
        stats,
        message: `${result.linked_count}件の商品を連携しました`
      })
    }
    
    if (action === 'check_migration') {
      // マイグレーション状態確認
      const migrationStatus = await checkMigrationStatus()
      
      return NextResponse.json({
        success: true,
        migrationStatus
      })
    }
    
    return NextResponse.json({
      success: false,
      error: '不明なアクション'
    }, { status: 400 })
    
  } catch (error: any) {
    console.error('Link tables error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

// 連携統計取得
async function getLinkageStats() {
  // products_master のSKU数
  const { count: productsWithSku } = await supabase
    .from('products_master')
    .select('*', { count: 'exact', head: true })
    .not('sku', 'is', null)
  
  // inventory_master のSKU数
  const { count: inventoryWithSku } = await supabase
    .from('inventory_master')
    .select('*', { count: 'exact', head: true })
    .not('sku', 'is', null)
  
  // inventory_master_id を持つ products_master の数
  let productsLinked = 0
  try {
    const { count } = await supabase
      .from('products_master')
      .select('*', { count: 'exact', head: true })
      .not('inventory_master_id', 'is', null)
    productsLinked = count || 0
  } catch {
    // カラムが存在しない場合
    productsLinked = -1
  }
  
  // products_master_id を持つ inventory_master の数
  let inventoryLinked = 0
  try {
    const { count } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .not('products_master_id', 'is', null)
    inventoryLinked = count || 0
  } catch {
    // カラムが存在しない場合
    inventoryLinked = -1
  }
  
  // 共通SKUの数を計算
  const { data: pmSkus } = await supabase
    .from('products_master')
    .select('sku')
    .not('sku', 'is', null)
  
  const { data: imSkus } = await supabase
    .from('inventory_master')
    .select('sku')
    .not('sku', 'is', null)
  
  const pmSkuSet = new Set((pmSkus || []).map(r => r.sku))
  const imSkuSet = new Set((imSkus || []).map(r => r.sku))
  const commonSkus = [...pmSkuSet].filter(sku => imSkuSet.has(sku))
  
  return {
    products_with_sku: productsWithSku || 0,
    inventory_with_sku: inventoryWithSku || 0,
    products_linked: productsLinked,
    inventory_linked: inventoryLinked,
    common_sku_count: commonSkus.length,
    products_only_count: pmSkuSet.size - commonSkus.length,
    inventory_only_count: imSkuSet.size - commonSkus.length,
    migration_applied: productsLinked >= 0 && inventoryLinked >= 0
  }
}

// マイグレーション状態確認
async function checkMigrationStatus() {
  const results = {
    products_master_has_inventory_master_id: false,
    inventory_master_has_products_master_id: false,
    link_function_exists: false,
    triggers_exist: false
  }
  
  // products_master のカラム確認
  try {
    const { data } = await supabase
      .from('products_master')
      .select('inventory_master_id')
      .limit(1)
    results.products_master_has_inventory_master_id = true
  } catch {
    results.products_master_has_inventory_master_id = false
  }
  
  // inventory_master のカラム確認
  try {
    const { data } = await supabase
      .from('inventory_master')
      .select('products_master_id')
      .limit(1)
    results.inventory_master_has_products_master_id = true
  } catch {
    results.inventory_master_has_products_master_id = false
  }
  
  // 関数の存在確認
  try {
    const { data, error } = await supabase.rpc('link_products_by_sku')
    results.link_function_exists = !error
  } catch {
    results.link_function_exists = false
  }
  
  return results
}

// 手動連携実行（RPC関数がない場合のフォールバック）
async function linkBySkuManual() {
  // まずRPC関数を試す
  try {
    const { data, error } = await supabase.rpc('link_products_by_sku')
    if (!error && data) {
      return data[0] || { linked_count: 0, products_updated: 0, inventory_updated: 0 }
    }
  } catch {
    // RPC関数がない場合は手動で実行
  }
  
  // 手動連携処理
  let inventoryUpdated = 0
  let productsUpdated = 0
  
  // 共通SKUを取得
  const { data: pmData } = await supabase
    .from('products_master')
    .select('id, sku')
    .not('sku', 'is', null)
  
  const { data: imData } = await supabase
    .from('inventory_master')
    .select('id, sku')
    .not('sku', 'is', null)
  
  if (!pmData || !imData) {
    return { linked_count: 0, products_updated: 0, inventory_updated: 0 }
  }
  
  // SKUでマッピング
  const pmBySku = new Map(pmData.map(r => [r.sku, r.id]))
  const imBySku = new Map(imData.map(r => [r.sku, r.id]))
  
  // 共通SKUで連携
  for (const [sku, pmId] of pmBySku) {
    const imId = imBySku.get(sku)
    if (imId) {
      // inventory_master.products_master_id を更新
      try {
        const { error: imError } = await supabase
          .from('inventory_master')
          .update({ products_master_id: pmId })
          .eq('id', imId)
          .is('products_master_id', null)
        
        if (!imError) inventoryUpdated++
      } catch {}
      
      // products_master.inventory_master_id を更新
      try {
        const { error: pmError } = await supabase
          .from('products_master')
          .update({ inventory_master_id: imId })
          .eq('id', pmId)
          .is('inventory_master_id', null)
        
        if (!pmError) productsUpdated++
      } catch {}
    }
  }
  
  return {
    linked_count: Math.max(inventoryUpdated, productsUpdated),
    products_updated: productsUpdated,
    inventory_updated: inventoryUpdated
  }
}
