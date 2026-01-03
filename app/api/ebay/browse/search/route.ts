// app/api/ebay/browse/search/route.ts
// 🔥 Phase 1修正版：日本人セラー数と中央値を追加
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  incrementApiCallCount,
  getApiCallStatus,
  canMakeApiCallSafely,
  waitBeforeApiCall
} from '@/lib/research/api-call-tracker'

// eBay Browse API エンドポイント
const EBAY_BROWSE_API = 'https://api.ebay.com/buy/browse/v1/item_summary/search'
const EBAY_TOKEN_API = 'https://api.ebay.com/identity/v1/oauth2/token'
const API_NAME = 'ebay_browse'

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
)

// アクセストークンのキャッシュ（メモリ内）
let cachedToken: {
  accessToken: string
  expiresAt: number
} | null = null

/**
 * 🔥 汎用的なキーワード抽出（ハイブリッド型）
 */
function extractKeywords(title: string): {
  numbers: string[];      // 型番・番号
  brands: string[];       // ブランド
  mainWords: string[];    // 主要キーワード
  specialWords: string[]; // 特別なキーワード
  languages: string[];    // 言語
} {
  const titleLower = title.toLowerCase();
  const words = title.split(/\s+/).filter(w => w.length > 0);
  
  const numbers: string[] = [];
  const brands: string[] = [];
  const mainWords: string[] = [];
  const specialWords: string[] = [];
  const languages: string[] = [];
  
  // 🔥 型番・番号パターンを検出（最優先）
  const numberPatterns = [
    /\d{1,4}[\/\-]\d{1,4}/g,  // 157/264, 157-264
    /#\d{1,4}/g,               // #157
    /[A-Z]{2,}-\d+/g,         // ABC-123, PSR-001
    /\b\d{5,}\b/g,            // 5桁以上の数字（LEGOセット番号など）
    /[A-Z]\d{3,}/g            // A123, B456
  ];
  
  numberPatterns.forEach(pattern => {
    const matches = title.match(pattern);
    if (matches) {
      matches.forEach(match => {
        if (!numbers.includes(match)) {
          numbers.push(match);
        }
      });
    }
  });
  
  // 🔥 ブランド名を検出
  const brandList = [
    'Pokemon', 'Nintendo', 'Sony', 'Microsoft', 'Apple',
    'Samsung', 'LEGO', 'Bandai', 'Funko', 'Marvel',
    'Disney', 'Star Wars', 'Harry Potter', 'Yugioh',
    'Magic', 'MTG', 'Transformers', 'Gundam', 'Hasbro',
    'Mattel', 'Takara Tomy'
  ];
  
  brandList.forEach(brand => {
    if (titleLower.includes(brand.toLowerCase())) {
      brands.push(brand);
    }
  });
  
  // 🔥 特別なキーワード（VMAX, Sealed, Newなど）
  const specialKeywordList = [
    'VMAX', 'VSTAR', 'V', 'GX', 'EX', 'ex',
    'Sealed', 'New', 'Rare', 'Limited',
    'First Edition', '1st Edition',
    'Holo', 'Reverse Holo', 'Full Art',
    'Ultra Rare', 'Secret Rare', 'Promo'
  ];
  
  specialKeywordList.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(title)) {
      specialWords.push(keyword);
    }
  });
  
  // 🔥 言語検出
  const languageList = ['Japanese', 'English', 'Korean', 'Chinese', 'German', 'French', 'Italian', 'Spanish'];
  languageList.forEach(lang => {
    if (titleLower.includes(lang.toLowerCase())) {
      languages.push(lang);
    }
  });
  
  // 🔥 主要な単語（3文字以上の大文字始まりの単語）
  words.forEach(word => {
    if (word.length >= 3 && /^[A-Z]/.test(word)) {
      // ブランドや特別キーワードでなければmainWordsに
      if (!brands.includes(word) && !specialWords.includes(word) && !languages.includes(word)) {
        if (!mainWords.includes(word)) {
          mainWords.push(word);
        }
      }
    }
  });

  console.log('🔍 キーワード抽出:', { 
    numbers, 
    brands, 
    mainWords: mainWords.slice(0, 3), 
    specialWords: specialWords.slice(0, 3),
    languages 
  });

  return { numbers, brands, mainWords, specialWords, languages };
}

/**
 * 🔥 カテゴリ推定
 */
function inferCategory(title: string, itemSpecifics: any): string {
  const titleLower = title.toLowerCase();
  
  // カード系
  if (titleLower.includes('pokemon') || titleLower.includes('yugioh') || 
      titleLower.includes('magic') || titleLower.includes('mtg')) {
    return 'card';
  }
  
  // おもちゃ系
  if (titleLower.includes('lego')) return 'lego';
  if (titleLower.includes('funko')) return 'funko pop';
  if (titleLower.includes('figure') || titleLower.includes('figurine')) return 'figure';
  
  // 電子機器
  if (titleLower.includes('iphone') || titleLower.includes('ipad')) return 'phone';
  if (titleLower.includes('console') || titleLower.includes('switch')) return 'console';
  
  // Item Specificsから推定
  if (itemSpecifics?.['Type']) return itemSpecifics['Type'].toLowerCase();
  if (itemSpecifics?.['Category']) return itemSpecifics['Category'].toLowerCase();
  
  return 'collectible';
}

/**
 * 🔥 段階的検索クエリを生成（ハイブリッド型）
 */
function buildSearchQueries(title: string, itemSpecifics?: any): string[] {
  const queries: string[] = [];
  const exclusionStr = '-code -digital -online -redemption';
  
  // 🔥 タイトルからキーワード抽出
  const extracted = extractKeywords(title);
  
  // 🔥 Item Specificsから重要情報を抽出
  const modelNumber = itemSpecifics?.['Card Number'] || 
                      itemSpecifics?.['Set Number'] || 
                      itemSpecifics?.['Model'] ||
                      itemSpecifics?.['Model Number'] ||
                      extracted.numbers[0]; // タイトルから型番
  
  const brand = itemSpecifics?.['Brand'] || 
                extracted.brands[0];
  
  const mainKeyword = itemSpecifics?.['Card Name'] || 
                      itemSpecifics?.['Character'] ||
                      itemSpecifics?.['Name'] ||
                      extracted.mainWords[0];
  
  const language = itemSpecifics?.['Language'] ||
                   extracted.languages[0];

  // 🔥 レベル1: タイトル完全（最も厳密）
  queries.push(`${title} ${exclusionStr}`.trim());

  // 🔥 レベル2: 型番 + 主要キーワード + ブランド + 言語
  if (modelNumber && mainKeyword && brand) {
    const level2Parts = [modelNumber, mainKeyword, brand];
    if (language) level2Parts.push(language);
    queries.push(`${level2Parts.join(' ')} ${exclusionStr}`.trim());
  }

  // 🔥 レベル3: 型番 + ブランド + カテゴリ
  if (modelNumber && brand) {
    const category = inferCategory(title, itemSpecifics);
    queries.push(`${modelNumber} ${brand} ${category} ${exclusionStr}`.trim());
  }

  // 🔥 レベル4: 主要キーワード + ブランド + 特別キーワード（型番なし）
  if (mainKeyword && brand) {
    const level4Parts = [mainKeyword, brand];
    if (extracted.specialWords.length > 0) {
      level4Parts.push(extracted.specialWords[0]);
    }
    if (language) level4Parts.push(language);
    queries.push(`${level4Parts.join(' ')} ${exclusionStr}`.trim());
  }

  // 🔥 レベル5: 型番 + カテゴリ（最後の手段）
  if (modelNumber) {
    const category = inferCategory(title, itemSpecifics);
    queries.push(`${modelNumber} ${category} ${exclusionStr}`.trim());
  }

  // 短すぎるクエリを除外（10文字未満）
  const validQueries = queries.filter(q => q.replace(exclusionStr, '').trim().length >= 10);
  
  console.log('🔍 検索クエリ一覧:', validQueries);

  return validQueries.length > 0 ? validQueries : queries; // 全て短い場合はそのまま
}

/**
 * OAuth 2.0 トークン取得（Client Credentials Flow - Browse API用）
 */
async function getAccessToken(): Promise<string> {
  // キャッシュが有効な場合は再利用（5分前に期限切れを想定）
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    console.log('✅ キャッシュされたトークンを使用')
    return cachedToken.accessToken
  }

  const clientId = process.env.EBAY_CLIENT_ID
  const clientSecret = process.env.EBAY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('EBAY_CLIENT_ID または EBAY_CLIENT_SECRET が設定されていません')
  }

  console.log('🔑 Application Tokenを取得中（Browse API用）...')

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  // Browse API用Application Token取得（スコープ: https://api.ebay.com/oauth/api_scope）
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
    const errorText = await response.text()
    console.error('❌ トークン取得エラー:', errorText)
    throw new Error(`トークン取得失敗: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  // トークンをキャッシュ（expires_in秒後に期限切れ）
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000
  }

  console.log('✅ Application Token取得成功')
  return data.access_token
}

/**
 * Browse APIで商品検索
 */
async function searchItems(accessToken: string, searchParams: {
  query: string
  categoryId?: string
  limit?: number
}) {
  const { query, categoryId, limit = 100 } = searchParams

  // URLパラメータ構築
  const params = new URLSearchParams({
    q: query,
    limit: Math.min(limit, 200).toString(), // Browse APIは最大200件
    sort: 'price', // 価格順（昇順）
    filter: 'buyingOptions:{FIXED_PRICE},price:[1..]' // 🔥 Buy It Nowのみ、$1以上
  })

  if (categoryId) {
    params.append('category_ids', categoryId)
  }

  const apiUrl = `${EBAY_BROWSE_API}?${params.toString()}`
  console.log('📡 Browse API呼び出し:', apiUrl)

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ Browse API Error:', errorText)
    
    // レート制限エラー
    if (response.status === 429) {
      throw new Error('eBay Browse APIのレート制限に達しました。しばらくしてから再度お試しください。')
    }

    throw new Error(`Browse API Error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data
}

/**
 * 🔥 Item Specificsでフィルタリング + 精度スコア付与（完全動的）
 */
function filterByItemSpecifics(items: any[], itemSpecifics: any): any[] {
  if (!itemSpecifics || Object.keys(itemSpecifics).length === 0) {
    // Item Specificsがない場合、全商品を精度レベル3として返す
    return items.map(item => ({
      ...item,
      matchLevel: 3,
      matchReason: 'キーワード検索のみ'
    }));
  }

  // 🔥 全てのItem Specificsを動的に使用
  const activeFields: { key: string; value: string }[] = [];
  
  Object.entries(itemSpecifics).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      activeFields.push({ key, value: String(value) });
    }
  });

  console.log(`  🔍 Item Specificsフィルター: ${activeFields.map(f => `${f.key}="${f.value}"`).join(', ')}`);

  return items.map((item: any) => {
    const title = (item.title || '').toLowerCase();
    let matchCount = 0;
    const matchReasons: string[] = [];

    // 各フィールドをチェック
    activeFields.forEach(({ key, value }) => {
      const valueLower = value.toLowerCase();
      if (title.includes(valueLower)) {
        matchCount++;
        matchReasons.push(`${key}一致`);
      }
    });

    // 精度レベルを決定（一致率ベース）
    const totalFields = activeFields.length;
    let finalLevel = 4;
    
    if (totalFields > 0 && matchCount === totalFields) {
      finalLevel = 1;  // 全て一致
    } else if (matchCount >= Math.ceil(totalFields * 0.6)) {
      finalLevel = 2;  // 60%以上一致
    } else if (matchCount >= 1) {
      finalLevel = 3;  // 1つ以上一致
    }

    return {
      ...item,
      matchLevel: finalLevel,
      matchReason: matchReasons.join(', ') || '不一致',
      isRecommended: finalLevel <= 2
    };
  }).filter(item => item.matchLevel <= 3); // レベル4（不一致）を除外
}

/**
 * 🔥 タイトルフィルタリング：デジタル商品を除外
 */
function filterDigitalProducts(items: any[]): any[] {
  const digitalKeywords = ['code', 'digital', 'online', 'redemption', 'download', 'email', 'message', 'sent', 'delivery'];
  
  return items.filter((item: any) => {
    const title = (item.title || '').toLowerCase();
    const hasDigitalKeyword = digitalKeywords.some(keyword => title.includes(keyword));
    
    if (hasDigitalKeyword) {
      console.log(`  ⚠️ デジタル商品除外: "${item.title}"`);
      return false;
    }
    
    return true;
  });
}

/**
 * 🔥 日本人セラー判定
 */
function isJapaneseSeller(item: any): boolean {
  // itemLocation.country が JP
  if (item.itemLocation?.country === 'JP') {
    return true
  }
  
  // seller.location が Japan を含む
  if (item.seller?.feedbackScore !== undefined && item.itemLocation?.country) {
    return item.itemLocation.country === 'JP'
  }
  
  // itemLocation.addressLine1 に日本語が含まれる
  const address = item.itemLocation?.addressLine1 || ''
  const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(address)
  if (hasJapanese) {
    return true
  }
  
  return false
}

/**
 * 🔥 中央値を計算
 */
function calculateMedian(prices: number[]): number {
  if (prices.length === 0) return 0
  
  const sorted = [...prices].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  
  if (sorted.length % 2 === 0) {
    // 偶数の場合：中央2つの平均
    return (sorted[middle - 1] + sorted[middle]) / 2
  } else {
    // 奇数の場合：中央の値
    return sorted[middle]
  }
}

/**
 * 🔥 最安値・平均価格・中央値・日本人セラー数を計算
 */
function analyzePrices(items: any[]) {
  const prices = items
    .map((item: any) => parseFloat(item.price?.value || '0'))
    .filter((price: number) => price > 0)

  if (prices.length === 0) {
    return {
      lowestPrice: 0,
      averagePrice: 0,
      medianPrice: 0,
      competitorCount: 0,
      jpSellerCount: 0
    }
  }

  const lowestPrice = Math.min(...prices)
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
  const medianPrice = calculateMedian(prices)
  
  // 🔥 日本人セラー数をカウント
  const jpSellerCount = items.filter(item => isJapaneseSeller(item)).length

  console.log(`  📊 価格分析: 商品数=${items.length}件, 最安値=${lowestPrice.toFixed(2)}, 平均=${averagePrice.toFixed(2)}, 中央値=${medianPrice.toFixed(2)}, 日本人セラー=${jpSellerCount}件`)

  return {
    lowestPrice: parseFloat(lowestPrice.toFixed(2)),
    averagePrice: parseFloat(averagePrice.toFixed(2)),
    medianPrice: parseFloat(medianPrice.toFixed(2)),
    competitorCount: items.length,
    jpSellerCount
  }
}

/**
 * 利益計算（簡易版）
 */
function calculateProfit(lowestPriceUSD: number, costJPY: number, weightG: number) {
  const JPY_TO_USD = 0.0067 // 1円 = 0.0067ドル（概算）
  const costUSD = costJPY * JPY_TO_USD

  // 送料計算（簡易版）
  let shippingCostUSD = 12.99
  if (weightG > 1000) shippingCostUSD = 18.99
  if (weightG > 2000) shippingCostUSD = 24.99

  // eBay手数料（12.9%）
  const ebayFeeRate = 0.129
  const ebayFee = lowestPriceUSD * ebayFeeRate

  // PayPal手数料（3.49% + $0.49）
  const paypalFeeRate = 0.0349
  const paypalFixedFee = 0.49
  const paypalFee = lowestPriceUSD * paypalFeeRate + paypalFixedFee

  // 総費用
  const totalCost = costUSD + shippingCostUSD + ebayFee + paypalFee

  // 利益額
  const profitAmount = lowestPriceUSD - totalCost

  // 利益率
  const profitMargin = lowestPriceUSD > 0 ? (profitAmount / lowestPriceUSD) * 100 : 0

  return {
    profitAmount: parseFloat(profitAmount.toFixed(2)),
    profitMargin: parseFloat(profitMargin.toFixed(2)),
    breakdown: {
      sellingPriceUSD: lowestPriceUSD,
      costUSD: parseFloat(costUSD.toFixed(2)),
      shippingCostUSD,
      ebayFee: parseFloat(ebayFee.toFixed(2)),
      paypalFee: parseFloat(paypalFee.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2))
    }
  }
}

/**
 * Supabaseに保存
 */
async function saveToDatabase(productId: string, data: any) {
  try {
    // 数値のクリッピング（DBのカラムサイズに合わせる）
    const updateData: any = {
      // sm_*カラムに保存
      sm_lowest_price: Math.max(0, Math.min(9999.99, data.lowestPrice || 0)),
      sm_average_price: Math.max(0, Math.min(9999.99, data.averagePrice || 0)),
      sm_median_price_usd: Math.max(0, Math.min(9999.99, data.medianPrice || 0)), // 🔥 追加
      sm_competitor_count: Math.max(0, Math.min(9999, data.competitorCount || 0)),
      sm_jp_seller_count: Math.max(0, Math.min(9999, data.jpSellerCount || 0)), // 🔥 追加
      sm_jp_sellers: Math.max(0, Math.min(9999, data.jpSellerCount || 0)), // 🔥 旧カラムにも保存（ビュー互換性）
      sm_competitors: Math.max(0, Math.min(9999, data.competitorCount || 0)), // 🔥 旧カラムにも保存（ビュー互換性）
      sm_profit_amount_usd: Math.max(-999.99, Math.min(999.99, data.profitAmount || 0)),
      sm_profit_margin: Math.max(-999.99, Math.min(999.99, data.profitMargin || 0)),
      sm_analyzed_at: new Date().toISOString(), // 🔥 追加
      updated_at: new Date().toISOString()
    }

    // ✅ ebay_api_dataにも保存（モーダル表示用）
    const { data: product } = await supabase
      .from('products_master')
      .select('ebay_api_data')
      .eq('id', productId)
      .single()

    const existingApiData = product?.ebay_api_data || {}
    
    // Browse APIの結果をebay_api_data.browse_resultに保存
    updateData.ebay_api_data = {
      ...existingApiData,
      browse_result: {
        lowestPrice: data.lowestPrice,
        averagePrice: data.averagePrice,
        medianPrice: data.medianPrice, // 🔥 追加
        jpSellerCount: data.jpSellerCount, // 🔥 追加
        competitorCount: data.competitorCount,
        profitAmount: data.profitAmount,
        profitMargin: data.profitMargin,
        breakdown: data.breakdown,
        items: data.items || [],
        referenceItems: data.referenceItems || [],
        searchedAt: new Date().toISOString(),
        searchTitle: data.searchTitle,
        searchLevel: data.searchLevel
      }
    }

    const { error } = await supabase
      .from('products_master')
      .update(updateData)
      .eq('id', productId)

    if (error) {
      console.error('❌ DB保存エラー:', error)
      throw error
    }

    console.log('✅ Supabaseに保存完了（sm_*カラム + ebay_api_data.browse_result）')
  } catch (error) {
    console.error('❌ DB保存失敗:', error)
    throw error
  }
}

/**
 * POSTエンドポイント
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      productId,
      ebayTitle,
      itemSpecifics,
      ebayCategoryId,
      weightG = 500,
      actualCostJPY = 0
    } = body

    console.log('🔍 Browse API検索リクエスト:', {
      productId,
      ebayTitle,
      itemSpecifics,
      ebayCategoryId,
      weightG
    })

    // ✅ ebayTitleをそのまま使用（シンプル化）
    if (!ebayTitle) {
      return NextResponse.json(
        { success: false, error: 'ebayTitle（英語タイトル）は必須です' },
        { status: 400 }
      )
    }
    
    console.log('✅ ebayTitleを使用:', ebayTitle)
    
    // 🔥 カテゴリーIDを取得（優先順位：パラメータ > DBから取得）
    let categoryIdToUse = ebayCategoryId
    
    if (!categoryIdToUse && productId) {
      const { data: product } = await supabase
        .from('products_master')
        .select('ebay_category_id')
        .eq('id', productId)
        .single()
      
      if (product?.ebay_category_id) {
        categoryIdToUse = product.ebay_category_id
        console.log('🎯 DBからカテゴリーIDを取得:', categoryIdToUse)
      } else {
        console.warn('⚠️ DBにカテゴリーIDがありません')
      }
    }
    
    if (categoryIdToUse) {
      console.log('📋 使用するカテゴリーID:', categoryIdToUse)
    } else {
      console.warn('⚠️ カテゴリーIDが設定されていません。検索結果が0件になる可能性があります。')
    }

    // API呼び出し可能かチェック
    const safetyCheck = await canMakeApiCallSafely(API_NAME)
    const apiStatus = await getApiCallStatus(API_NAME)

    if (!safetyCheck.canCall) {
      console.error(`❌ API呼び出し制限: ${safetyCheck.reason}`)

      let errorMessage = safetyCheck.reason || 'API呼び出し制限に達しました'

      if (safetyCheck.waitTime) {
        const waitMinutes = Math.ceil(safetyCheck.waitTime / 60000)
        errorMessage += `\n\n${waitMinutes}分後に再度お試しください。`
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          errorCode: 'RATE_LIMIT_EXCEEDED',
          apiStatus
        },
        { status: 429 }
      )
    }

    console.log(`📊 API呼び出し状況: ${apiStatus.callCount}/${apiStatus.dailyLimit} (残り${apiStatus.remaining}回)`)

    // API呼び出し前の待機処理
    await waitBeforeApiCall()
    console.log('✅ API呼び出し間隔OK')

    // 1. アクセストークン取得
    const accessToken = await getAccessToken()

    // 2. API呼び出しカウントを増加
    await incrementApiCallCount(API_NAME)

    // 3. ✅ ebayTitleをそのまま使用
    const searchQuery = ebayTitle.trim()
    
    console.log(`🔍 検索クエリ: ${searchQuery}`)
    console.log(`📋 カテゴリーID: ${categoryIdToUse || 'なし'}`)  // 🔥 必ず表示

    // 4. 検索実行
    console.log(`🔍 検索開始: "${searchQuery}"`);
    
    const searchResult = await searchItems(accessToken, {
      query: searchQuery,
      categoryId: categoryIdToUse,  // 🔥 SMカテゴリーを使用
      limit: 100
    });

    let items = searchResult.itemSummaries || [];
    const totalCount = searchResult.total || 0;

    console.log(`✅ 検索結果: ${items.length}件 / 総数: ${totalCount}件`);
    
    // 🔥 デジタル商品をフィルタリング
    items = filterDigitalProducts(items);
    console.log(`✅ デジタル除外後: ${items.length}件`);
    
    // 🔥 Item Specificsでフィルタリング
    if (itemSpecifics) {
      items = filterByItemSpecifics(items, itemSpecifics);
      console.log(`✅ Item Specificsフィルター後: ${items.length}件`);
      
      // 🔥 精度順にソート（レベル1が最優先）
      items.sort((a, b) => {
        // 1. matchLevelで比較（小さいほど優先）
        if (a.matchLevel !== b.matchLevel) {
          return a.matchLevel - b.matchLevel;
        }
        // 2. 価格で比較（安い方が優先）
        const priceA = parseFloat(a.price?.value || '999999');
        const priceB = parseFloat(b.price?.value || '999999');
        return priceA - priceB;
      });
      
      console.log(`  🎯 精度分布: レベル1=${items.filter(i => i.matchLevel === 1).length}件, レベル2=${items.filter(i => i.matchLevel === 2).length}件, レベル3=${items.filter(i => i.matchLevel === 3).length}件`);
    }

    console.log(`✅ 商品取得完了: ${items.length}件 / 総数: ${totalCount}件`)

    if (items.length === 0) {
      console.warn('⚠️ 該当商品が見つかりませんでした')
      
      // 🔥 0件の場合もDBに保存（画面表示用）
      if (productId) {
        await saveToDatabase(productId, {
          lowestPrice: 0,
          averagePrice: 0,
          medianPrice: 0,
          competitorCount: 0,
          jpSellerCount: 0,
          profitAmount: 0,
          profitMargin: 0,
          breakdown: {},
          items: [],
          referenceItems: [],
          searchTitle: searchQuery,
          searchLevel: 1
        })
      }
      
      return NextResponse.json({
        success: true,
        lowestPrice: 0,
        averagePrice: 0,
        medianPrice: 0,
        jpSellerCount: 0,
        competitorCount: 0,
        profitAmount: 0,
        profitMargin: 0,
        message: '該当商品が見つかりませんでした。検索ワードを変更して再度お試しください。',
        apiStatus: await getApiCallStatus(API_NAME)
      })
    }

    // 4. 最安値・平均価格・中央値・日本人セラー数を計算
    const priceAnalysis = analyzePrices(items)
    console.log('💰 最安値分析:', priceAnalysis)

    // 5. 利益計算
    const profitAnalysis = calculateProfit(
      priceAnalysis.lowestPrice,
      actualCostJPY,
      weightG
    )
    console.log('💵 利益分析:', profitAnalysis)

    // 6. Supabaseに保存
    if (productId) {
      await saveToDatabase(productId, {
        ...priceAnalysis,
        ...profitAnalysis,
        items: items.slice(0, 10),
        referenceItems: items.slice(0, 10),
        searchTitle: searchQuery,
        searchLevel: 1
      })
    }

    // 更新されたAPI状況を取得
    const updatedApiStatus = await getApiCallStatus(API_NAME)

    return NextResponse.json({
      success: true,
      lowestPrice: priceAnalysis.lowestPrice,
      averagePrice: priceAnalysis.averagePrice,
      medianPrice: priceAnalysis.medianPrice, // 🔥 追加
      jpSellerCount: priceAnalysis.jpSellerCount, // 🔥 追加
      competitorCount: priceAnalysis.competitorCount,
      profitAmount: profitAnalysis.profitAmount,
      profitMargin: profitAnalysis.profitMargin,
      breakdown: profitAnalysis.breakdown,
      items: items.slice(0, 10),
      apiStatus: updatedApiStatus
    })

  } catch (error: any) {
    console.error('❌ Browse API Error:', error)

    // エラー時もAPI状況を返す
    const apiStatus = await getApiCallStatus(API_NAME)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        apiStatus
      },
      { status: 500 }
    )
  }
}
