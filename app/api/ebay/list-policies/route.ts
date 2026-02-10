import { NextRequest, NextResponse } from 'next/server'
import { getEbayAccessToken } from '@/lib/ebay/token'

const EBAY_API_BASE = 'https://api.ebay.com'

export async function GET(request: NextRequest) {
  try {
    // ヘッダーまたはクエリパラメータからアカウント指定を取得
    const accountHeader = request.headers.get('X-eBay-Account')
    const { searchParams } = new URL(request.url)
    const accountParam = searchParams.get('account')
    const account = (accountHeader || accountParam || 'mjt') as 'mjt' | 'green'

    console.log('📦 Fetching eBay Fulfillment Policies for account:', account)

    // 🔥 自動的に最新のトークンを取得
    const accessToken = await getEbayAccessToken(account)
    console.log('✅ Got fresh token (length:', accessToken.length, ')')

    // ページネーションで全ポリシーを取得
    let allPolicies: any[] = []
    let offset = 0
    const limit = 200 // eBay APIの最大値
    let hasMore = true
    let totalPolicies = 0

    while (hasMore) {
      console.log(`📄 Fetching policies: offset=${offset}, limit=${limit}`)

      const ebayResponse = await fetch(
        `${EBAY_API_BASE}/sell/account/v1/fulfillment_policy?marketplace_id=EBAY_US&offset=${offset}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Language': 'en-US'
          }
        }
      )

      const responseText = await ebayResponse.text()
      console.log(`🟢 eBay Response Status (offset ${offset}):`, ebayResponse.status)

      if (!ebayResponse.ok) {
        console.error('❌ eBay Error:', responseText)
        return NextResponse.json(
          { error: 'Failed to fetch policies from eBay', details: responseText, account },
          { status: ebayResponse.status }
        )
      }

      const data = JSON.parse(responseText)
      const policies = data.fulfillmentPolicies || []
      totalPolicies = data.total || 0

      console.log(`✅ Page ${Math.floor(offset / limit) + 1}: ${policies.length} policies (total in eBay: ${totalPolicies})`)

      allPolicies = [...allPolicies, ...policies]

      // 次のページがあるかチェック
      if (policies.length < limit || allPolicies.length >= totalPolicies) {
        hasMore = false
      } else {
        offset += limit
      }

      // 安全装置：10000件以上は取得しない
      if (allPolicies.length >= 10000) {
        console.warn('⚠️  Safety limit reached: 10000 policies')
        hasMore = false
      }
    }

    console.log(`🎉 Total policies fetched for ${account}: ${allPolicies.length}`)

    // ポリシー名でマップを作成（重複チェック用）
    const policyMap = new Map<string, any>()
    allPolicies.forEach(policy => {
      policyMap.set(policy.name, {
        fulfillmentPolicyId: policy.fulfillmentPolicyId,
        name: policy.name,
        description: policy.description,
        marketplaceId: policy.marketplaceId
      })
    })

    return NextResponse.json({
      success: true,
      account,
      policies: allPolicies,
      fulfillmentPolicies: allPolicies, // Backward compatibility
      policyMap: Object.fromEntries(policyMap), // 名前→ID マッピング
      total: totalPolicies,
      fetched: allPolicies.length
    })

  } catch (error: any) {
    console.error('❌ API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
