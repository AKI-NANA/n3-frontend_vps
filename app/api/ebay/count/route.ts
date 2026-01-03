/**
 * eBay出品数確認API
 * GET /api/ebay/count
 * 
 * 各アカウントの出品数を高速で確認
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    const results: Record<string, any> = {}

    for (const account of ['mjt', 'green']) {
      try {
        const count = await getListingCount(account)
        results[account] = count
      } catch (err: any) {
        results[account] = { error: err.message }
      }
    }

    // DBの現在のデータ数も確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

    const { count: inventoryCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })

    const { data: accountCounts } = await supabase
      .from('inventory_master')
      .select('account')
      .not('account', 'is', null)

    const dbCounts: Record<string, number> = {}
    if (accountCounts) {
      for (const row of accountCounts) {
        const acc = (row.account || 'unknown').toLowerCase()
        dbCounts[acc] = (dbCounts[acc] || 0) + 1
      }
    }

    return NextResponse.json({
      ebay: results,
      database: {
        total: inventoryCount || 0,
        by_account: dbCounts
      }
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function getListingCount(account: string): Promise<any> {
  const accountUpper = account.toUpperCase()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createSupabaseClient(supabaseUrl, supabaseKey)

  const { data: tokenData } = await supabase
    .from('ebay_tokens')
    .select('refresh_token')
    .eq('account', account)
    .maybeSingle()

  if (!tokenData?.refresh_token) {
    throw new Error(`${account}のトークンがありません`)
  }

  const clientId = process.env[`EBAY_CLIENT_ID_${accountUpper}`] || process.env.EBAY_CLIENT_ID!
  const clientSecret = process.env[`EBAY_CLIENT_SECRET_${accountUpper}`] || process.env.EBAY_CLIENT_SECRET!
  const devId = process.env.EBAY_DEV_ID!

  // アクセストークン取得
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const tokenRes = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokenData.refresh_token
    })
  })

  if (!tokenRes.ok) {
    throw new Error(`トークン取得失敗`)
  }

  const tokenJson = await tokenRes.json()
  const accessToken = tokenJson.access_token

  // GetMyeBaySelling で件数のみ取得
  const xmlRequest = `<?xml version="1.0" encoding="utf-8"?>
<GetMyeBaySellingRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${accessToken}</eBayAuthToken>
  </RequesterCredentials>
  <ActiveList>
    <Include>true</Include>
    <Pagination>
      <EntriesPerPage>1</EntriesPerPage>
      <PageNumber>1</PageNumber>
    </Pagination>
  </ActiveList>
</GetMyeBaySellingRequest>`

  const response = await fetch('https://api.ebay.com/ws/api.dll', {
    method: 'POST',
    headers: {
      'X-EBAY-API-SITEID': '0',
      'X-EBAY-API-COMPATIBILITY-LEVEL': '1193',
      'X-EBAY-API-CALL-NAME': 'GetMyeBaySelling',
      'X-EBAY-API-APP-NAME': clientId,
      'X-EBAY-API-DEV-NAME': devId,
      'X-EBAY-API-CERT-NAME': clientSecret,
      'Content-Type': 'text/xml; charset=utf-8'
    },
    body: xmlRequest
  })

  const xmlResponse = await response.text()

  // 件数を抽出
  const totalMatch = xmlResponse.match(/<TotalNumberOfEntries>(\d+)<\/TotalNumberOfEntries>/)
  const pagesMatch = xmlResponse.match(/<TotalNumberOfPages>(\d+)<\/TotalNumberOfPages>/)

  return {
    active_listings: totalMatch ? parseInt(totalMatch[1]) : 0,
    total_pages: pagesMatch ? parseInt(pagesMatch[1]) : 0
  }
}
