/**
 * unique_idベースで連携するAPI
 * POST /api/database/link-by-unique-id
 */
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  // 現状確認
  const stats = await analyzeData()
  
  return NextResponse.json({
    success: true,
    message: 'unique_id / source_id ベースの連携API',
    stats,
    usage: 'POST /api/database/link-by-unique-id で連携実行'
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔗 unique_id ベースの連携開始...')
    
    // inventory_master の unique_id を取得
    const { data: imData } = await supabase
      .from('inventory_master')
      .select('id, unique_id, sku')
      .not('unique_id', 'is', null)
    
    // products_master の source_id を取得（inventory_master由来のもの）
    const { data: pmData } = await supabase
      .from('products_master')
      .select('id, source_id, sku')
      .eq('source_system', 'inventory_master')
    
    if (!imData || !pmData) {
      return NextResponse.json({
        success: false,
        error: 'データ取得失敗'
      }, { status: 500 })
    }
    
    console.log(`inventory_master: ${imData.length}件`)
    console.log(`products_master (inventory由来): ${pmData.length}件`)
    
    // unique_id → inventory_master.id のマップ
    const imByUniqueId = new Map(imData.map(r => [r.unique_id, r.id]))
    
    // source_id → products_master.id のマップ
    const pmBySourceId = new Map(pmData.map(r => [r.source_id, r.id]))
    
    let linkedCount = 0
    let skippedCount = 0
    let errorCount = 0
    const linkedPairs: Array<{pm_id: string, im_id: string, source_id: string}> = []
    
    // products_master の source_id と inventory_master の unique_id を照合
    for (const pm of pmData) {
      const imId = imByUniqueId.get(pm.source_id)
      
      if (imId) {
        // 連携実行
        // 1. inventory_master.products_master_id を更新
        const { error: imError } = await supabase
          .from('inventory_master')
          .update({ products_master_id: pm.id })
          .eq('id', imId)
        
        // 2. products_master.inventory_master_id を更新
        const { error: pmError } = await supabase
          .from('products_master')
          .update({ inventory_master_id: imId })
          .eq('id', pm.id)
        
        if (imError || pmError) {
          console.error(`連携エラー: ${pm.source_id}`, imError?.message || pmError?.message)
          errorCount++
        } else {
          linkedCount++
          if (linkedPairs.length < 10) {
            linkedPairs.push({ pm_id: pm.id, im_id: imId, source_id: pm.source_id })
          }
        }
      } else {
        skippedCount++
      }
    }
    
    // 統計を再取得
    const stats = await analyzeData()
    
    return NextResponse.json({
      success: true,
      result: {
        linked: linkedCount,
        skipped: skippedCount,
        errors: errorCount,
        sample_pairs: linkedPairs
      },
      stats,
      message: `${linkedCount}件の商品を連携しました`
    })
    
  } catch (error: any) {
    console.error('Link error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

async function analyzeData() {
  // inventory_master の統計
  const { count: imTotal } = await supabase
    .from('inventory_master')
    .select('*', { count: 'exact', head: true })
  
  const { count: imWithUniqueId } = await supabase
    .from('inventory_master')
    .select('*', { count: 'exact', head: true })
    .not('unique_id', 'is', null)
  
  // products_master の統計
  const { count: pmTotal } = await supabase
    .from('products_master')
    .select('*', { count: 'exact', head: true })
  
  const { count: pmFromInventory } = await supabase
    .from('products_master')
    .select('*', { count: 'exact', head: true })
    .eq('source_system', 'inventory_master')
  
  // マッチング可能数を計算
  const { data: imUniqueIds } = await supabase
    .from('inventory_master')
    .select('unique_id')
    .not('unique_id', 'is', null)
  
  const { data: pmSourceIds } = await supabase
    .from('products_master')
    .select('source_id')
    .eq('source_system', 'inventory_master')
  
  const imSet = new Set((imUniqueIds || []).map(r => r.unique_id))
  const pmSet = new Set((pmSourceIds || []).map(r => r.source_id))
  const matchable = [...imSet].filter(id => pmSet.has(id))
  
  // 現在の連携数
  let pmLinked = 0
  let imLinked = 0
  try {
    const { count: c1 } = await supabase
      .from('products_master')
      .select('*', { count: 'exact', head: true })
      .not('inventory_master_id', 'is', null)
    pmLinked = c1 || 0
  } catch {}
  
  try {
    const { count: c2 } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .not('products_master_id', 'is', null)
    imLinked = c2 || 0
  } catch {}
  
  return {
    inventory_master: {
      total: imTotal,
      with_unique_id: imWithUniqueId,
      linked: imLinked
    },
    products_master: {
      total: pmTotal,
      from_inventory: pmFromInventory,
      linked: pmLinked
    },
    matchable_count: matchable.length
  }
}
