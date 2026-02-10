/**
 * SKU形式調査API
 * GET /api/database/check-skus
 */
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // products_master のSKUサンプル
    const { data: pmSample } = await supabase
      .from('products_master')
      .select('sku, source_system, source_id, title')
      .not('sku', 'is', null)
      .limit(20)
    
    // inventory_master のSKUサンプル
    const { data: imSample } = await supabase
      .from('inventory_master')
      .select('sku, unique_id, product_name, marketplace, account')
      .not('sku', 'is', null)
      .limit(20)
    
    // inventory_master でSKUがnullのもの
    const { data: imNoSku, count: imNoSkuCount } = await supabase
      .from('inventory_master')
      .select('unique_id, product_name, marketplace', { count: 'exact' })
      .is('sku', null)
      .limit(10)
    
    // SKUパターン分析
    const pmSkuPatterns: Record<string, number> = {}
    const imSkuPatterns: Record<string, number> = {}
    
    if (pmSample) {
      for (const r of pmSample) {
        const prefix = r.sku?.split('-')[0] || 'unknown'
        pmSkuPatterns[prefix] = (pmSkuPatterns[prefix] || 0) + 1
      }
    }
    
    if (imSample) {
      for (const r of imSample) {
        const prefix = r.sku?.split('-')[0] || 'unknown'
        imSkuPatterns[prefix] = (imSkuPatterns[prefix] || 0) + 1
      }
    }

    return NextResponse.json({
      success: true,
      products_master: {
        sample: pmSample?.map(r => ({
          sku: r.sku,
          source_system: r.source_system,
          source_id: r.source_id,
          title: r.title?.substring(0, 40)
        })),
        sku_patterns: pmSkuPatterns
      },
      inventory_master: {
        sample: imSample?.map(r => ({
          sku: r.sku,
          unique_id: r.unique_id,
          product_name: r.product_name?.substring(0, 40),
          marketplace: r.marketplace,
          account: r.account
        })),
        sku_patterns: imSkuPatterns,
        no_sku_count: imNoSkuCount,
        no_sku_sample: imNoSku?.map(r => ({
          unique_id: r.unique_id,
          product_name: r.product_name?.substring(0, 40),
          marketplace: r.marketplace
        }))
      },
      analysis: {
        message: 'SKU形式を比較してください。連携にはSKUの統一が必要です。'
      }
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
