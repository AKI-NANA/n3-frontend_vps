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

export async function GET(req: NextRequest) {
  try {
    const account = (req.nextUrl.searchParams.get('account') || 'green') as 'mjt' | 'green'
    
    console.log(`🔍 ${account}アカウントのRate Tableを取得中...`)

    // トークン取得
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

    console.log('✅ Rate Table取得成功:', data.rateTables?.length || 0, '個')

    // Rate Table名とIDのマッピングを作成
    const rateTableMapping: Record<string, string> = {}
    if (data.rateTables) {
      for (const table of data.rateTables) {
        // 例: "RT_Express_1" -> "5012345678"
        if (table.name && table.rateTableId) {
          rateTableMapping[table.name] = table.rateTableId
        }
      }
    }

    return NextResponse.json({
      success: true,
      account,
      rateTables: data.rateTables || [],
      rateTableMapping,
      total: data.total || data.rateTables?.length || 0
    })

  } catch (error: any) {
    console.error('❌ エラー:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Rate Table名→eBay IDのマッピングをDBに保存
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase()
    const account = (req.nextUrl.searchParams.get('account') || 'green') as 'mjt' | 'green'

    console.log(`🔄 ${account}のRate TableマッピングをDBに保存中...`)

    // eBayからRate Table取得
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

    // マッピングテーブルに保存
    let savedCount = 0
    for (const table of data.rateTables || []) {
      if (table.name && table.rateTableId) {
        const { error } = await supabase
          .from('ebay_rate_table_mapping')
          .upsert({
            account,
            rate_table_name: table.name,
            ebay_rate_table_id: table.rateTableId,
            locality: table.locality,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'account,rate_table_name'
          })
        
        if (!error) savedCount++
      }
    }

    console.log(`✅ ${savedCount}個のRate TableマッピングをDBに保存しました`)

    return NextResponse.json({
      success: true,
      account,
      savedCount,
      total: data.rateTables?.length || 0
    })

  } catch (error: any) {
    console.error('❌ エラー:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
