import { NextRequest, NextResponse } from 'next/server'
import { getEbayAccessToken } from '@/lib/ebay/token'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase環境変数が設定されていません')
  }
  return createClient(url, key)
}

/**
 * 段階 I: Rate Table ID取得・同期API
 * 
 * GET: Rate Table一覧取得（名前→ID マッピング）
 * POST: DBにRate Table IDマッピングを保存
 */

export async function GET(req: NextRequest) {
  try {
    const account = (req.nextUrl.searchParams.get('account') || 'green') as 'mjt' | 'green'
    
    console.log(`🔍 [段階I] ${account}アカウントのRate Table一覧を取得中...`)

    const token = await getEbayAccessToken(account)

    // eBay APIでRate Table一覧を取得
    const response = await fetch(
      'https://api.ebay.com/sell/account/v1/rate_table',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Language': 'en-US'
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ eBay APIエラー:', data)
      return NextResponse.json(
        { error: data.errors || data },
        { status: response.status }
      )
    }

    // Rate Table名 → rateTableId のマッピングを作成
    const rateTableMapping: Record<string, string> = {}
    const rateTableDetails: Array<{name: string, rateTableId: string, locality: string}> = []

    if (data.rateTables) {
      for (const table of data.rateTables) {
        if (table.name && table.rateTableId) {
          rateTableMapping[table.name] = table.rateTableId
          rateTableDetails.push({
            name: table.name,
            rateTableId: table.rateTableId,
            locality: table.locality || 'INTERNATIONAL'
          })
        }
      }
    }

    console.log(`✅ Rate Table取得成功: ${Object.keys(rateTableMapping).length}個`)

    // 期待される60種類との差分を確認
    const expectedTables = Array.from({ length: 60 }, (_, i) => `RT_Express_${i + 1}`)
    const missingTables = expectedTables.filter(name => !rateTableMapping[name])
    const extraTables = Object.keys(rateTableMapping).filter(name => !expectedTables.includes(name))

    return NextResponse.json({
      success: true,
      account,
      total: Object.keys(rateTableMapping).length,
      expected: 60,
      mapping: rateTableMapping,
      details: rateTableDetails,
      missingTables,
      extraTables,
      isComplete: missingTables.length === 0
    })

  } catch (error: any) {
    console.error('❌ エラー:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST: Rate TableマッピングをDBに保存
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase()
    const account = (req.nextUrl.searchParams.get('account') || 'green') as 'mjt' | 'green'

    console.log(`🔄 [段階I] ${account}のRate TableマッピングをDBに同期中...`)

    // 1. eBayからRate Table取得
    const token = await getEbayAccessToken(account)
    const response = await fetch(
      'https://api.ebay.com/sell/account/v1/rate_table',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()
    if (!response.ok) {
      throw new Error(JSON.stringify(data.errors || data))
    }

    // 2. ebay_rate_table_mappingテーブルに保存
    let savedCount = 0
    let errors: string[] = []

    for (const table of data.rateTables || []) {
      if (table.name && table.rateTableId) {
        const { error } = await supabase
          .from('ebay_rate_table_mapping')
          .upsert({
            account,
            rate_table_name: table.name,
            ebay_rate_table_id: table.rateTableId,
            locality: table.locality || 'INTERNATIONAL',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'account,rate_table_name'
          })
        
        if (error) {
          errors.push(`${table.name}: ${error.message}`)
        } else {
          savedCount++
        }
      }
    }

    console.log(`✅ ${savedCount}個のRate TableマッピングをDBに保存しました`)

    return NextResponse.json({
      success: true,
      account,
      savedCount,
      total: data.rateTables?.length || 0,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error: any) {
    console.error('❌ エラー:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
