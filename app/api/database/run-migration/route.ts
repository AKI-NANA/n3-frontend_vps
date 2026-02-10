/**
 * マイグレーション実行API
 * POST /api/database/run-migration
 * 
 * Supabaseダッシュボードにアクセスできない場合の代替手段
 */
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  return NextResponse.json({
    message: 'マイグレーション実行API',
    usage: 'POST /api/database/run-migration',
    available_migrations: [
      'add_columns',
      'create_functions', 
      'create_triggers',
      'create_views',
      'link_existing_data',
      'full' // 全て実行
    ]
  })
}

export async function POST(request: NextRequest) {
  try {
    const { step = 'full' } = await request.json()
    
    const results: any = {
      step,
      executed: [],
      errors: []
    }

    // STEP 1: カラム追加
    if (step === 'add_columns' || step === 'full') {
      console.log('📦 STEP 1: カラム追加...')
      
      // inventory_master に products_master_id を追加
      try {
        const { error: e1 } = await supabase.rpc('exec_sql', {
          sql: `ALTER TABLE inventory_master ADD COLUMN IF NOT EXISTS products_master_id UUID REFERENCES products_master(id) ON DELETE SET NULL`
        })
        if (e1) {
          // rpcがない場合、直接クエリで試す
          // Supabaseは直接DDLを実行できないため、別の方法を試す
          results.errors.push({ step: 'add_products_master_id', error: e1.message })
        } else {
          results.executed.push('inventory_master.products_master_id added')
        }
      } catch (err: any) {
        results.errors.push({ step: 'add_products_master_id', error: err.message })
      }

      // products_master に inventory_master_id を追加
      try {
        const { error: e2 } = await supabase.rpc('exec_sql', {
          sql: `ALTER TABLE products_master ADD COLUMN IF NOT EXISTS inventory_master_id UUID REFERENCES inventory_master(id) ON DELETE SET NULL`
        })
        if (e2) {
          results.errors.push({ step: 'add_inventory_master_id', error: e2.message })
        } else {
          results.executed.push('products_master.inventory_master_id added')
        }
      } catch (err: any) {
        results.errors.push({ step: 'add_inventory_master_id', error: err.message })
      }
    }

    // STEP 2: 既存データの連携（SKUベース）
    if (step === 'link_existing_data' || step === 'full') {
      console.log('🔗 STEP 2: 既存データ連携...')
      
      try {
        // inventory_master のSKUを取得
        const { data: imData } = await supabase
          .from('inventory_master')
          .select('id, sku')
          .not('sku', 'is', null)
        
        // products_master のSKUを取得
        const { data: pmData } = await supabase
          .from('products_master')
          .select('id, sku')
          .not('sku', 'is', null)
        
        if (imData && pmData) {
          const pmBySku = new Map(pmData.map(r => [r.sku, r.id]))
          const imBySku = new Map(imData.map(r => [r.sku, r.id]))
          
          let linkedCount = 0
          
          // 共通SKUで連携
          for (const [sku, pmId] of pmBySku) {
            const imId = imBySku.get(sku)
            if (imId) {
              // inventory_master.products_master_id を更新
              const { error: imErr } = await supabase
                .from('inventory_master')
                .update({ products_master_id: pmId })
                .eq('id', imId)
              
              // products_master.inventory_master_id を更新
              const { error: pmErr } = await supabase
                .from('products_master')
                .update({ inventory_master_id: imId })
                .eq('id', pmId)
              
              if (!imErr && !pmErr) linkedCount++
            }
          }
          
          results.executed.push(`${linkedCount} records linked by SKU`)
        }
      } catch (err: any) {
        results.errors.push({ step: 'link_existing_data', error: err.message })
      }
    }

    // 統計を取得
    const stats = await getStats()
    
    return NextResponse.json({
      success: results.errors.length === 0,
      results,
      stats,
      message: results.errors.length === 0 
        ? 'マイグレーション完了' 
        : '一部エラーがあります。Supabaseダッシュボードでの実行をお勧めします。'
    })

  } catch (error: any) {
    console.error('Migration error:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

async function getStats() {
  const stats: any = {}
  
  // products_master のカウント
  const { count: pmCount } = await supabase
    .from('products_master')
    .select('*', { count: 'exact', head: true })
  stats.products_master_count = pmCount || 0
  
  // inventory_master のカウント
  const { count: imCount } = await supabase
    .from('inventory_master')
    .select('*', { count: 'exact', head: true })
  stats.inventory_master_count = imCount || 0
  
  // 共通SKU確認
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
  
  stats.products_with_sku = pmSkuSet.size
  stats.inventory_with_sku = imSkuSet.size
  stats.common_sku_count = commonSkus.length
  
  // 連携済み確認（カラムが存在する場合のみ）
  try {
    const { count: pmLinked } = await supabase
      .from('products_master')
      .select('*', { count: 'exact', head: true })
      .not('inventory_master_id', 'is', null)
    stats.products_linked = pmLinked || 0
  } catch {
    stats.products_linked = 'column not exists'
  }
  
  try {
    const { count: imLinked } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .not('products_master_id', 'is', null)
    stats.inventory_linked = imLinked || 0
  } catch {
    stats.inventory_linked = 'column not exists'
  }
  
  return stats
}
