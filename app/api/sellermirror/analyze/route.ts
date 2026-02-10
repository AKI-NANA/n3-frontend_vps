// app/api/sellermirror/analyze/route.ts
/**
 * SellerMirror分析API
 * 
 * 商品の英語タイトルとカテゴリを使ってeBay Finding APIで
 * 競合商品を検索し、価格分析を行う
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// eBay Finding API エンドポイント
const EBAY_FINDING_API = 'https://svcs.ebay.com/services/search/FindingService/v1'

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

interface AnalyzeRequest {
  productId: number | string
  ebayTitle: string
  ebayCategoryId?: string
  condition?: string
}

interface CompetitorAnalysis {
  totalFound: number
  competitorCount: number
  lowestPrice: number | null
  averagePrice: number | null
  medianPrice: number | null
  highestPrice: number | null
  priceRange: { min: number; max: number } | null
  avgSoldCount: number
  topCompetitors: Array<{
    itemId: string
    title: string
    price: number
    soldCount: number
    seller: string
    condition: string
    viewUrl: string
  }>
  searchKeyword: string
  categoryId: string | null
  analyzedAt: string
}

/**
 * 検索キーワードを最適化
 * 長すぎるタイトルから重要なキーワードを抽出
 */
function optimizeSearchKeyword(title: string): string {
  // 不要な記号や文字を除去
  let cleaned = title
    .replace(/[【】\[\]「」『』（）\(\)]/g, ' ')
    .replace(/[!！?？@#$%^&*+=~`|\\<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  // 80文字を超える場合は重要な単語のみ抽出
  if (cleaned.length > 80) {
    const words = cleaned.split(' ')
    const importantWords: string[] = []
    let currentLength = 0
    
    for (const word of words) {
      if (word.length < 2) continue
      if (currentLength + word.length + 1 > 80) break
      importantWords.push(word)
      currentLength += word.length + 1
    }
    
    cleaned = importantWords.join(' ')
  }
  
  return cleaned
}

/**
 * eBay Finding API呼び出し（リトライ対応）
 */
async function searchEbayCompletedItems(
  keywords: string,
  categoryId?: string,
  entriesPerPage: number = 50
): Promise<any[]> {
  const appId = process.env.EBAY_APP_ID || process.env.EBAY_CLIENT_ID_MJT
  
  if (!appId) {
    throw new Error('EBAY_APP_ID が設定されていません')
  }
  
  const params = new URLSearchParams({
    'OPERATION-NAME': 'findCompletedItems',
    'SERVICE-VERSION': '1.0.0',
    'SECURITY-APPNAME': appId,
    'RESPONSE-DATA-FORMAT': 'JSON',
    'REST-PAYLOAD': '',
    'keywords': keywords,
    'paginationInput.entriesPerPage': entriesPerPage.toString(),
    'paginationInput.pageNumber': '1',
    'sortOrder': 'BestMatch',
  })
  
  // カテゴリフィルター（指定があれば）
  if (categoryId) {
    params.append('categoryId', categoryId)
  }
  
  // 販売済み商品のみ
  params.append('itemFilter(0).name', 'SoldItemsOnly')
  params.append('itemFilter(0).value', 'true')
  
  const apiUrl = `${EBAY_FINDING_API}?${params.toString()}`
  
  // リトライロジック（最大3回）
  let retries = 3
  let lastError: Error | null = null
  
  while (retries > 0) {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        
        // レート制限エラー
        if (errorText.includes('10001') || errorText.includes('RateLimiter')) {
          console.warn(`⚠️ SM分析: レート制限（残り${retries}回）- 5秒待機...`)
          await new Promise(resolve => setTimeout(resolve, 5000))
          retries--
          continue
        }
        
        throw new Error(`eBay API Error: ${response.status} - ${errorText.substring(0, 200)}`)
      }
      
      const data = await response.json()
      const findItemsResponse = data.findCompletedItemsResponse?.[0]
      
      if (!findItemsResponse) {
        throw new Error('eBay APIレスポンス形式エラー')
      }
      
      const ack = findItemsResponse.ack?.[0]
      
      if (ack !== 'Success') {
        const errorMessage = findItemsResponse.errorMessage?.[0]?.error?.[0]?.message?.[0] || 'Unknown error'
        const errorId = findItemsResponse.errorMessage?.[0]?.error?.[0]?.errorId?.[0] || ''
        
        if (errorId === '10001') {
          throw new Error('eBay APIレート制限に達しました（24時間後に再試行）')
        }
        
        throw new Error(`eBay API Error: ${errorMessage}`)
      }
      
      const searchResult = findItemsResponse.searchResult?.[0]
      return searchResult?.item || []
      
    } catch (error) {
      lastError = error as Error
      console.error(`SM分析APIエラー（残り${retries}回）:`, lastError.message)
      retries--
      
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    }
  }
  
  throw lastError || new Error('eBay API呼び出し失敗')
}

/**
 * 競合分析を実行
 */
function analyzeCompetitors(items: any[], searchKeyword: string, categoryId: string | null): CompetitorAnalysis {
  if (items.length === 0) {
    return {
      totalFound: 0,
      competitorCount: 0,
      lowestPrice: null,
      averagePrice: null,
      medianPrice: null,
      highestPrice: null,
      priceRange: null,
      avgSoldCount: 0,
      topCompetitors: [],
      searchKeyword,
      categoryId,
      analyzedAt: new Date().toISOString()
    }
  }
  
  // 価格と販売数を抽出
  const validItems = items
    .map((item: any) => {
      const sellingStatus = item.sellingStatus?.[0]
      const price = parseFloat(sellingStatus?.currentPrice?.[0]?.__value__ || '0')
      const soldCount = parseInt(sellingStatus?.quantitySold?.[0] || '0')
      const conditionObj = item.condition?.[0]
      
      return {
        itemId: item.itemId?.[0] || '',
        title: item.title?.[0] || '',
        price,
        soldCount,
        seller: item.sellerInfo?.[0]?.sellerUserName?.[0] || 'Unknown',
        condition: conditionObj?.conditionDisplayName?.[0] || 'Unknown',
        viewUrl: item.viewItemURL?.[0] || '',
        image: item.galleryURL?.[0] || ''
      }
    })
    .filter(item => item.price > 0)
  
  if (validItems.length === 0) {
    return {
      totalFound: items.length,
      competitorCount: 0,
      lowestPrice: null,
      averagePrice: null,
      medianPrice: null,
      highestPrice: null,
      priceRange: null,
      avgSoldCount: 0,
      topCompetitors: [],
      searchKeyword,
      categoryId,
      analyzedAt: new Date().toISOString()
    }
  }
  
  // 価格のソート
  const prices = validItems.map(i => i.price).sort((a, b) => a - b)
  
  // 統計計算
  const lowestPrice = prices[0]
  const highestPrice = prices[prices.length - 1]
  const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length
  const medianPrice = prices.length % 2 === 0
    ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
    : prices[Math.floor(prices.length / 2)]
  
  const avgSoldCount = validItems.reduce((sum, i) => sum + i.soldCount, 0) / validItems.length
  
  // 上位競合（価格の低い順で上位10件）
  const topCompetitors = validItems
    .sort((a, b) => a.price - b.price)
    .slice(0, 10)
  
  return {
    totalFound: items.length,
    competitorCount: validItems.length,
    lowestPrice: Math.round(lowestPrice * 100) / 100,
    averagePrice: Math.round(averagePrice * 100) / 100,
    medianPrice: Math.round(medianPrice * 100) / 100,
    highestPrice: Math.round(highestPrice * 100) / 100,
    priceRange: { min: lowestPrice, max: highestPrice },
    avgSoldCount: Math.round(avgSoldCount * 10) / 10,
    topCompetitors,
    searchKeyword,
    categoryId,
    analyzedAt: new Date().toISOString()
  }
}

/**
 * 分析結果をDBに保存
 */
async function saveAnalysisToProduct(productId: string | number, analysis: CompetitorAnalysis) {
  try {
    const { error } = await supabase
      .from('products_master')
      .update({
        sm_analysis: analysis,
        sm_lowest_price: analysis.lowestPrice,
        sm_average_price: analysis.averagePrice,
        sm_competitor_count: analysis.competitorCount,
        sm_analyzed_at: analysis.analyzedAt,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
    
    if (error) {
      console.error('SM分析結果保存エラー:', error)
      // 保存エラーは致命的ではないので続行
    }
    
    return !error
  } catch (err) {
    console.error('SM分析結果保存例外:', err)
    return false
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const body: AnalyzeRequest = await request.json()
    const { productId, ebayTitle, ebayCategoryId } = body
    
    console.log(`🔍 SM分析開始: productId=${productId}`)
    
    // 入力検証
    if (!productId) {
      return NextResponse.json(
        { success: false, error: '商品IDが必要です' },
        { status: 400 }
      )
    }
    
    if (!ebayTitle || ebayTitle.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: '有効な英語タイトルが必要です（3文字以上）' },
        { status: 400 }
      )
    }
    
    // 検索キーワードを最適化
    const searchKeyword = optimizeSearchKeyword(ebayTitle)
    console.log(`  📝 検索キーワード: "${searchKeyword.substring(0, 50)}..."`)
    
    // eBay Finding API呼び出し
    const items = await searchEbayCompletedItems(searchKeyword, ebayCategoryId)
    console.log(`  📊 検索結果: ${items.length}件`)
    
    // 競合分析
    const analysis = analyzeCompetitors(items, searchKeyword, ebayCategoryId || null)
    console.log(`  💰 分析結果: 競合${analysis.competitorCount}件, 最安値$${analysis.lowestPrice || 'N/A'}`)
    
    // DBに保存
    const saved = await saveAnalysisToProduct(productId, analysis)
    console.log(`  💾 DB保存: ${saved ? '成功' : '失敗'}`)
    
    const elapsed = Date.now() - startTime
    console.log(`✅ SM分析完了: ${productId} (${elapsed}ms)`)
    
    return NextResponse.json({
      success: true,
      productId,
      analysis,
      saved,
      elapsed
    })
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ SM分析エラー:', errorMessage)
    
    // エラーの種類に応じたステータスコードとメッセージ
    let statusCode = 500
    let userMessage = errorMessage
    
    if (errorMessage.includes('レート制限')) {
      statusCode = 429
      userMessage = 'eBay APIのレート制限に達しました。しばらく待ってから再試行してください。'
    } else if (errorMessage.includes('EBAY_APP_ID')) {
      statusCode = 500
      userMessage = 'eBay API設定エラー。管理者に連絡してください。'
    } else if (errorMessage.includes('タイムアウト') || errorMessage.includes('timeout')) {
      statusCode = 504
      userMessage = 'eBay API応答タイムアウト。再試行してください。'
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: userMessage,
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: statusCode }
    )
  }
}
