/**
 * 連携データ確認API
 * GET /api/database/check-linked
 */
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // 連携済みデータのサンプルを取得
    const { data: pmLinked } = await supabase
      .from('products_master')
      .select('id, sku, title, source_system, source_id, inventory_master_id')
      .not('inventory_master_id', 'is', null)
      .limit(5)
    
    // 連携先のinventory_masterデータも取得
    const linkedData = []
    if (pmLinked) {
      for (const pm of pmLinked) {
        const { data: im } = await supabase
          .from('inventory_master')
          .select('id, unique_id, sku, product_name, physical_quantity, selling_price, marketplace, account')
          .eq('id', pm.inventory_master_id)
          .single()
        
        linkedData.push({
          products_master: {
            id: pm.id,
            sku: pm.sku,
            title: pm.title?.substring(0, 50),
            source_system: pm.source_system,
            source_id: pm.source_id
          },
          inventory_master: im ? {
            id: im.id,
            unique_id: im.unique_id,
            sku: im.sku,
            product_name: im.product_name?.substring(0, 50),
            physical_quantity: im.physical_quantity,
            selling_price: im.selling_price,
            marketplace: im.marketplace,
            account: im.account
          } : null,
          link_status: im ? '✅ 連携OK' : '❌ 連携エラー'
        })
      }
    }

    // 統計
    const { count: pmTotal } = await supabase
      .from('products_master')
      .select('*', { count: 'exact', head: true })
    
    const { count: pmLinkedCount } = await supabase
      .from('products_master')
      .select('*', { count: 'exact', head: true })
      .not('inventory_master_id', 'is', null)
    
    const { count: imTotal } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
    
    const { count: imLinkedCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .not('products_master_id', 'is', null)

    return NextResponse.json({
      success: true,
      summary: {
        products_master: {
          total: pmTotal,
          linked: pmLinkedCount,
          unlinked: (pmTotal || 0) - (pmLinkedCount || 0)
        },
        inventory_master: {
          total: imTotal,
          linked: imLinkedCount,
          unlinked: (imTotal || 0) - (imLinkedCount || 0)
        }
      },
      sample_linked_data: linkedData,
      message: '連携データの確認が完了しました'
    })

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
