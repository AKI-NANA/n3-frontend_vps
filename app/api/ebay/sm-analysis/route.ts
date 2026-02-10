// app/api/ebay/sm-analysis/route.ts
/**
 * 🔥 統合SM分析API
 * 
 * Finding API（過去90日販売）+ Browse API（現在出品）を並列実行
 * 
 * Gemini指針:
 * - Promise.allで並列実行
 * - 片方が失敗しても片方のデータで判定を維持
 * - 推奨価格と売れ筋スコアを自動計算
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  mergeAnalysisResults,
  calculateMedian,
  calculateSoldCounts,
  type FindingApiResult,
  type BrowseApiResult,
  type FindingItem,
  type BrowseItem,
  type SmAnalysisResult
} from '@/lib/services/ebay/analysis-logic'
import {
  incrementApiCallCount,
  getApiCallStatus,
  canMakeApiCallSafely,
  waitBeforeApiCall
} from '@/lib/research/api-call-tracker'

// API エンドポイント
const EBAY_FINDING_API = 'https://svcs.ebay.com/services/search/FindingService/v1'
const EBAY_BROWSE_API = 'https://api.ebay.com/buy/browse/v1/item_summary/search'
const EBAY_TOKEN_API = 'https://api.ebay.com/identity/v1/oauth2/token'

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// アクセストークンのキャッシュ
let cachedToken: { accessToken: string; expiresAt: number } | null = null

// =============================================================================
// キーワード抽出（簡略版）
// =============================================================================

function extractSearchKeywords(title: string): string[] {
  const exclusions = ['code', 'digital', 'online', 'redemption', 'download'];
  const exclusionStr = exclusions.map(e => `-${e}`).join(' ');
  
  // 型番を抽出
  const numberMatches = title.match(/\d{1,4}[\/\-]\d{1,4}|#\d{1,4}|[A-Z]{2,}-\d+|\b\d{5,}\b/g) || [];
  
  // ブランドを抽出
  const brands = ['Pokemon', 'Nintendo', 'Sony', 'LEGO', 'Bandai', 'Funko', 'Disney', 'Yugioh', 'Magic'];
  const foundBrands = brands.filter(b => title.toLowerCase().includes(b.toLowerCase()));
  
  // メインワードを抽出
  const words = title.split(/\s+/).filter(w => w.length >= 3 && /^[A-Z]/.test(w));
  
  const queries: string[] = [];
  
  // レベル1: フルタイトル
  queries.push(`${title} ${exclusionStr}`);
  
  // レベル2: 型番 + ブランド
  if (numberMatches.length > 0 && foundBrands.length > 0) {
    queries.push(`${numberMatches[0]} ${foundBrands[0]} ${exclusionStr}`);
  }
  
  // レベル3: 主要ワード + ブランド
  if (words.length > 0 && foundBrands.length > 0) {
    queries.push(`${words.slice(0, 2).join(' ')} ${foundBrands[0]} ${exclusionStr}`);
  }
  
  // レベル4: 型番のみ
  if (numberMatches.length > 0) {
    queries.push(`${numberMatches[0]} ${exclusionStr}`);
  }
  
  return [...new Set(queries)].filter(q => q.trim().length > 10);
}

// =============================================================================
// OAuth トークン取得
// =============================================================================

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedToken.accessToken
  }

  const clientId = process.env.EBAY_CLIENT_ID
  const clientSecret = process.env.EBAY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('eBay認証情報が設定されていません')
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch(EBAY_TOKEN_API, {
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

  if (!response.ok) {
    throw new Error(`トークン取得失敗: ${response.status}`)
  }

  const data = await response.json()
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000
  }

  return data.access_token
}

// =============================================================================
// Finding API（販売実績）
// =============================================================================

async function callFindingApi(
  keywords: string,
  categoryId?: string,
  condition?: string
): Promise<FindingApiResult> {
  const appId = process.env.EBAY_APP_ID || process.env.EBAY_CLIENT_ID

  if (!appId) {
    return { success: false, items: [], totalSold: 0, soldLast30Days: 0, soldLast90Days: 0, averageSoldPrice: 0, medianSoldPrice: 0, error: 'APP_ID未設定' }
  }

  const params = new URLSearchParams({
    'OPERATION-NAME': 'findCompletedItems',
    'SERVICE-VERSION': '1.0.0',
    'SECURITY-APPNAME': appId,
    'RESPONSE-DATA-FORMAT': 'JSON',
    'REST-PAYLOAD': '',
    'keywords': keywords,
    'paginationInput.entriesPerPage': '100',
    'paginationInput.pageNumber': '1',
    'sortOrder': 'EndTimeSoonest',
  })

  if (categoryId && categoryId !== '99999') {
    params.append('categoryId', categoryId)
  }

  // 販売済み商品のみ
  let filterIndex = 0
  params.append(`itemFilter(${filterIndex}).name`, 'SoldItemsOnly')
  params.append(`itemFilter(${filterIndex}).value`, 'true')
  filterIndex++

  // コンディション
  if (condition === 'New') {
    params.append(`itemFilter(${filterIndex}).name`, 'Condition')
    params.append(`itemFilter(${filterIndex}).value`, '1000')
    filterIndex++
  }

  // Buy It Nowのみ
  params.append(`itemFilter(${filterIndex}).name`, 'ListingType')
  params.append(`itemFilter(${filterIndex}).value`, 'FixedPrice')

  try {
    const response = await fetch(`${EBAY_FINDING_API}?${params.toString()}`)
    
    if (!response.ok) {
      return { success: false, items: [], totalSold: 0, soldLast30Days: 0, soldLast90Days: 0, averageSoldPrice: 0, medianSoldPrice: 0, error: `HTTP ${response.status}` }
    }

    const data = await response.json()
    const findItemsResponse = data.findCompletedItemsResponse?.[0]
    
    if (!findItemsResponse || findItemsResponse.ack?.[0] !== 'Success') {
      const errorMsg = findItemsResponse?.errorMessage?.[0]?.error?.[0]?.message?.[0] || 'Unknown error'
      return { success: false, items: [], totalSold: 0, soldLast30Days: 0, soldLast90Days: 0, averageSoldPrice: 0, medianSoldPrice: 0, error: errorMsg }
    }

    const rawItems = findItemsResponse.searchResult?.[0]?.item || []
    
    // 販売済み商品のみ抽出（実際に売れたもの）
    const items: FindingItem[] = rawItems
      .filter((item: any) => item.sellingStatus?.[0]?.sellingState?.[0] === 'EndedWithSales')
      .map((item: any) => ({
        itemId: item.itemId?.[0] || '',
        title: item.title?.[0] || '',
        soldPrice: parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || '0'),
        soldDate: item.listingInfo?.[0]?.endTime?.[0] || '',
        quantitySold: parseInt(item.sellingStatus?.[0]?.quantitySold?.[0] || '1'),
        condition: item.condition?.[0]?.conditionDisplayName?.[0] || 'Unknown',
        seller: {
          username: item.sellerInfo?.[0]?.sellerUserName?.[0] || '',
          feedbackScore: parseInt(item.sellerInfo?.[0]?.feedbackScore?.[0] || '0')
        },
        imageUrl: item.galleryURL?.[0] || '',
        viewItemUrl: item.viewItemURL?.[0] || ''
      }))

    // 価格を抽出
    const prices = items.map(i => i.soldPrice).filter(p => p > 0)
    const averageSoldPrice = prices.length > 0 
      ? parseFloat((prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2))
      : 0
    const medianSoldPrice = parseFloat(calculateMedian(prices).toFixed(2))

    // 販売数を計算
    const { soldLast30Days, soldLast90Days } = calculateSoldCounts(items)
    const totalSold = items.reduce((sum, item) => sum + item.quantitySold, 0)

    return {
      success: true,
      items,
      totalSold,
      soldLast30Days,
      soldLast90Days,
      averageSoldPrice,
      medianSoldPrice
    }

  } catch (error: any) {
    return { success: false, items: [], totalSold: 0, soldLast30Days: 0, soldLast90Days: 0, averageSoldPrice: 0, medianSoldPrice: 0, error: error.message }
  }
}

// =============================================================================
// Browse API（現在出品）
// =============================================================================

async function callBrowseApi(
  accessToken: string,
  keywords: string,
  categoryId?: string
): Promise<BrowseApiResult> {
  const params = new URLSearchParams({
    q: keywords,
    limit: '100',
    sort: 'price',
    filter: 'buyingOptions:{FIXED_PRICE},price:[1..]'
  })

  if (categoryId && categoryId !== '99999') {
    params.append('category_ids', categoryId)
  }

  try {
    const response = await fetch(`${EBAY_BROWSE_API}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return { success: false, items: [], lowestPrice: 0, averagePrice: 0, medianPrice: 0, competitorCount: 0, jpSellerCount: 0, searchLevel: 0, error: `HTTP ${response.status}` }
    }

    const data = await response.json()
    const rawItems = data.itemSummaries || []

    // デジタル商品を除外
    const digitalKeywords = ['code', 'digital', 'online', 'redemption', 'download']
    const filteredItems = rawItems.filter((item: any) => {
      const title = (item.title || '').toLowerCase()
      return !digitalKeywords.some(kw => title.includes(kw))
    })

    const items: BrowseItem[] = filteredItems.map((item: any) => ({
      itemId: item.itemId || '',
      title: item.title || '',
      price: parseFloat(item.price?.value || '0'),
      currency: item.price?.currency || 'USD',
      condition: item.condition || 'Unknown',
      seller: item.seller ? {
        username: item.seller.username || '',
        feedbackScore: item.seller.feedbackScore || 0
      } : undefined,
      location: item.itemLocation ? {
        country: item.itemLocation.country || ''
      } : undefined,
      imageUrl: item.image?.imageUrl || '',
      viewItemUrl: item.itemWebUrl || ''
    }))

    // 価格分析
    const prices = items.map(i => i.price).filter(p => p > 0)
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0
    const averagePrice = prices.length > 0 
      ? parseFloat((prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2))
      : 0
    const medianPrice = parseFloat(calculateMedian(prices).toFixed(2))

    // 日本人セラー数
    const jpSellerCount = items.filter(i => i.location?.country === 'JP').length

    return {
      success: true,
      items,
      lowestPrice: parseFloat(lowestPrice.toFixed(2)),
      averagePrice,
      medianPrice,
      competitorCount: items.length,
      jpSellerCount,
      searchLevel: 1
    }

  } catch (error: any) {
    return { success: false, items: [], lowestPrice: 0, averagePrice: 0, medianPrice: 0, competitorCount: 0, jpSellerCount: 0, searchLevel: 0, error: error.message }
  }
}

// =============================================================================
// Waterfall検索（段階的）
// =============================================================================

async function waterfallSearch(
  accessToken: string,
  ebayTitle: string,
  categoryId?: string,
  condition?: string
): Promise<{
  findingResult: FindingApiResult;
  browseResult: BrowseApiResult;
  usedQuery: string;
  searchLevel: number;
}> {
  const queries = extractSearchKeywords(ebayTitle)
  
  let bestFindingResult: FindingApiResult = { success: false, items: [], totalSold: 0, soldLast30Days: 0, soldLast90Days: 0, averageSoldPrice: 0, medianSoldPrice: 0 }
  let bestBrowseResult: BrowseApiResult = { success: false, items: [], lowestPrice: 0, averagePrice: 0, medianPrice: 0, competitorCount: 0, jpSellerCount: 0, searchLevel: 0 }
  let usedQuery = queries[0] || ebayTitle
  let searchLevel = 0

  for (let level = 0; level < queries.length; level++) {
    const query = queries[level]
    console.log(`  📡 レベル${level + 1}検索: "${query.substring(0, 50)}..."`)
    
    // 🔥 Finding APIとBrowse APIを並列実行
    const [findingResult, browseResult] = await Promise.all([
      callFindingApi(query, categoryId, condition),
      callBrowseApi(accessToken, query, categoryId)
    ])

    // 結果を更新
    if (findingResult.success && findingResult.items.length > bestFindingResult.items.length) {
      bestFindingResult = findingResult
    }
    if (browseResult.success && browseResult.items.length > bestBrowseResult.items.length) {
      bestBrowseResult = browseResult
      bestBrowseResult.searchLevel = level + 1
    }

    // 十分なデータが取れたら終了
    const totalItems = bestFindingResult.items.length + bestBrowseResult.items.length
    if (totalItems >= 10) {
      usedQuery = query
      searchLevel = level + 1
      console.log(`  ✅ 十分なデータ取得 (Finding: ${bestFindingResult.items.length}件, Browse: ${bestBrowseResult.items.length}件)`)
      break
    }

    // 次のレベルへ
    if (level < queries.length - 1) {
      console.log(`  ⚠️ データ不足 (${totalItems}件), 次のレベルへ...`)
    }
  }

  // 最終結果
  if (searchLevel === 0 && (bestFindingResult.items.length > 0 || bestBrowseResult.items.length > 0)) {
    searchLevel = queries.length
  }

  return {
    findingResult: bestFindingResult,
    browseResult: bestBrowseResult,
    usedQuery,
    searchLevel
  }
}

// =============================================================================
// DB保存
// =============================================================================

async function saveToDatabase(productId: string, result: SmAnalysisResult, usedQuery: string) {
  try {
    const { data: product } = await supabase
      .from('products_master')
      .select('ebay_api_data')
      .eq('id', productId)
      .single()

    const existingApiData = product?.ebay_api_data || {}

    const updateData: any = {
      // SM分析結果
      sm_lowest_price: Math.max(0, Math.min(9999.99, result.current_lowest_price || 0)),
      sm_average_price: Math.max(0, Math.min(9999.99, result.current_average_price || 0)),
      sm_median_price_usd: Math.max(0, Math.min(9999.99, result.avg_sold_price || 0)),
      sm_competitor_count: Math.max(0, Math.min(9999, result.competitor_count || 0)),
      sm_jp_seller_count: Math.max(0, Math.min(9999, result.jp_seller_count || 0)),
      sm_jp_sellers: Math.max(0, Math.min(9999, result.jp_seller_count || 0)),
      sm_competitors: Math.max(0, Math.min(9999, result.competitor_count || 0)),
      
      // 🔥 新規追加: 販売実績
      sm_sold_last_30d: result.sold_last_30d,
      sm_sold_last_90d: result.sold_last_90d,
      sm_avg_sold_price: result.avg_sold_price,
      sm_recommended_price: result.recommended_price,
      sm_demand_score: result.demand_score,
      sm_confidence_level: result.confidence_level,
      
      sm_analyzed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
      // ebay_api_dataに詳細を保存
      ebay_api_data: {
        ...existingApiData,
        sm_analysis: {
          ...result,
          searchQuery: usedQuery,
          analyzedAt: new Date().toISOString()
        },
        browse_result: {
          items: result.browse_items,
          lowestPrice: result.current_lowest_price,
          averagePrice: result.current_average_price,
          competitorCount: result.competitor_count,
          jpSellerCount: result.jp_seller_count,
          searchLevel: result.search_level
        },
        finding_result: {
          items: result.finding_items,
          soldLast30Days: result.sold_last_30d,
          soldLast90Days: result.sold_last_90d,
          averageSoldPrice: result.avg_sold_price
        }
      }
    }

    const { error } = await supabase
      .from('products_master')
      .update(updateData)
      .eq('id', productId)

    if (error) throw error
    console.log('  ✅ DB保存完了')
  } catch (error) {
    console.error('  ❌ DB保存失敗:', error)
    throw error
  }
}

// =============================================================================
// POSTエンドポイント
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      productId,
      ebayTitle,
      ebayCategoryId,
      condition = 'New'
    } = body

    console.log('🔍 SM分析開始 (Finding + Browse 統合):')
    console.log(`  商品ID: ${productId}`)
    console.log(`  タイトル: ${ebayTitle?.substring(0, 50)}...`)

    if (!ebayTitle) {
      return NextResponse.json(
        { success: false, error: 'ebayTitle（英語タイトル）は必須です' },
        { status: 400 }
      )
    }

    // API呼び出しチェック
    const browseCheck = await canMakeApiCallSafely('ebay_browse')
    const findingCheck = await canMakeApiCallSafely('ebay_finding_completed')

    if (!browseCheck.canCall && !findingCheck.canCall) {
      return NextResponse.json(
        { success: false, error: '両方のAPIがレート制限に達しています', errorCode: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 }
      )
    }

    // カテゴリIDを取得
    let categoryIdToUse = ebayCategoryId
    if (!categoryIdToUse && productId) {
      const { data: product } = await supabase
        .from('products_master')
        .select('ebay_category_id')
        .eq('id', productId)
        .single()
      
      if (product?.ebay_category_id) {
        categoryIdToUse = product.ebay_category_id
      }
    }

    await waitBeforeApiCall()

    // アクセストークン取得
    const accessToken = await getAccessToken()

    // 🔥 Waterfall検索（Finding + Browse 並列）
    const { findingResult, browseResult, usedQuery, searchLevel } = await waterfallSearch(
      accessToken,
      ebayTitle,
      categoryIdToUse,
      condition
    )

    // API呼び出しカウント
    if (browseResult.success) {
      await incrementApiCallCount('ebay_browse')
    }
    if (findingResult.success) {
      await incrementApiCallCount('ebay_finding_completed')
    }

    // 結果をマージ
    const analysisResult = mergeAnalysisResults(findingResult, browseResult)

    console.log('📊 SM分析結果:')
    console.log(`  過去90日販売: ${analysisResult.sold_last_90d}件`)
    console.log(`  平均販売価格: $${analysisResult.avg_sold_price}`)
    console.log(`  現在競合: ${analysisResult.competitor_count}件`)
    console.log(`  現在最安値: $${analysisResult.current_lowest_price}`)
    console.log(`  推奨価格: $${analysisResult.recommended_price}`)
    console.log(`  売れ筋スコア: ${analysisResult.demand_score}/100`)
    console.log(`  信頼度: ${analysisResult.confidence_level}`)

    // DB保存
    if (productId) {
      await saveToDatabase(productId, analysisResult, usedQuery)
    }

    return NextResponse.json({
      success: true,
      ...analysisResult,
      usedQuery,
      apiStatus: {
        browse: await getApiCallStatus('ebay_browse'),
        finding: await getApiCallStatus('ebay_finding_completed')
      }
    })

  } catch (error: any) {
    console.error('❌ SM分析エラー:', error)

    return NextResponse.json(
      { success: false, error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
