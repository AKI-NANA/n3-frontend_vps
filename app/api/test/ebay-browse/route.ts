// app/api/test/ebay-browse/route.ts
/**
 * eBay Browse API テスト用エンドポイント
 * SM分析のデバッグ用
 */
import { NextRequest, NextResponse } from 'next/server'

const EBAY_BROWSE_API = 'https://api.ebay.com/buy/browse/v1/item_summary/search'
const EBAY_TOKEN_API = 'https://api.ebay.com/identity/v1/oauth2/token'

export async function GET(request: NextRequest) {
  const results: any = {
    step1_env: null,
    step2_token: null,
    step3_search: null,
    errors: []
  }
  
  try {
    // Step 1: 環境変数チェック
    const clientId = process.env.EBAY_CLIENT_ID
    const clientSecret = process.env.EBAY_CLIENT_SECRET
    
    results.step1_env = {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      clientIdLength: clientId?.length || 0,
      clientIdPrefix: clientId?.substring(0, 10) || 'none'
    }
    
    if (!clientId || !clientSecret) {
      results.errors.push('EBAY_CLIENT_ID または EBAY_CLIENT_SECRET が未設定')
      return NextResponse.json(results, { status: 500 })
    }
    
    // Step 2: トークン取得
    console.log('🔑 トークン取得中...')
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    
    const tokenResponse = await fetch(EBAY_TOKEN_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'https://api.ebay.com/oauth/api_scope'
      })
    })
    
    const tokenText = await tokenResponse.text()
    
    results.step2_token = {
      status: tokenResponse.status,
      ok: tokenResponse.ok
    }
    
    if (!tokenResponse.ok) {
      results.step2_token.error = tokenText
      results.errors.push(`トークン取得失敗: ${tokenResponse.status}`)
      return NextResponse.json(results, { status: 500 })
    }
    
    const tokenData = JSON.parse(tokenText)
    results.step2_token.hasToken = !!tokenData.access_token
    results.step2_token.expiresIn = tokenData.expires_in
    
    // Step 3: 検索テスト
    console.log('🔍 検索テスト中...')
    const testQuery = 'pokemon card'
    
    const params = new URLSearchParams({
      q: testQuery,
      limit: '5',
      filter: 'buyingOptions:{FIXED_PRICE}'
    })
    
    const searchUrl = `${EBAY_BROWSE_API}?${params.toString()}`
    
    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json'
      }
    })
    
    const searchText = await searchResponse.text()
    
    results.step3_search = {
      status: searchResponse.status,
      ok: searchResponse.ok,
      query: testQuery
    }
    
    if (!searchResponse.ok) {
      results.step3_search.error = searchText
      results.errors.push(`検索失敗: ${searchResponse.status}`)
      return NextResponse.json(results, { status: 500 })
    }
    
    const searchData = JSON.parse(searchText)
    results.step3_search.total = searchData.total
    results.step3_search.itemCount = searchData.itemSummaries?.length || 0
    results.step3_search.firstItemTitle = searchData.itemSummaries?.[0]?.title?.substring(0, 50)
    
    return NextResponse.json({
      success: true,
      message: 'eBay Browse API is working!',
      ...results
    })
    
  } catch (error: any) {
    console.error('❌ テストエラー:', error)
    results.errors.push(`Exception: ${error.message}`)
    return NextResponse.json({
      success: false,
      ...results,
      exception: error.message
    }, { status: 500 })
  }
}
