// app/api/ebay/browse/search/route.ts
// 🔥 v2: Gemini指針に基づく段階的検索（Waterfall）+ 加重Item Specificsマッチング
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

// =============================================================================
// キーワード抽出
// =============================================================================

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
    'Mattel', 'Takara Tomy', 'Sanrio', 'Hello Kitty',
    'One Piece', 'Dragon Ball', 'Naruto', 'Demon Slayer'
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
    'Ultra Rare', 'Secret Rare', 'Promo',
    'Booster', 'Box', 'Pack', 'Deck'
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

  return { numbers, brands, mainWords, specialWords, languages };
}

/**
 * 🔥 カテゴリ推定
 */
function inferCategory(title: string, itemSpecifics: any): string {
  const titleLower = title.toLowerCase();
  
  // カード系
  if (titleLower.includes('pokemon') || titleLower.includes('yugioh') || 
      titleLower.includes('magic') || titleLower.includes('mtg') ||
      titleLower.includes('card')) {
    return 'card';
  }
  
  // おもちゃ系
  if (titleLower.includes('lego')) return 'lego';
  if (titleLower.includes('funko')) return 'funko pop';
  if (titleLower.includes('figure') || titleLower.includes('figurine')) return 'figure';
  
  // 電子機器
  if (titleLower.includes('iphone') || titleLower.includes('ipad')) return 'phone';
  if (titleLower.includes('console') || titleLower.includes('switch')) return 'console';
  
  // アニメ・キャラクター
  if (titleLower.includes('anime') || titleLower.includes('manga')) return 'anime';
  
  // Item Specificsから推定
  if (itemSpecifics?.['Type']) return itemSpecifics['Type'].toLowerCase();
  if (itemSpecifics?.['Category']) return itemSpecifics['Category'].toLowerCase();
  
  return 'collectible';
}

// =============================================================================
// 段階的検索クエリ生成（Gemini指針）
// =============================================================================

/**
 * 🔥 段階的検索クエリを生成（Waterfall方式）
 * 
 * Gemini指針:
 * - レベル1・2: 同時に投げる
 * - 3件未満ならレベル3・4へ
 * - 0件ならレベル5へ
 */
function buildSearchQueries(title: string, itemSpecifics?: any): {
  level12: string[];  // レベル1・2（同時実行）
  level34: string[];  // レベル3・4（フォールバック1）
  level5: string[];   // レベル5（フォールバック2）
} {
  const exclusionStr = '-code -digital -online -redemption -download';
  const extracted = extractKeywords(title);
  
  // Item Specificsから重要情報を抽出
  const modelNumber = itemSpecifics?.['Card Number'] || 
                      itemSpecifics?.['Set Number'] || 
                      itemSpecifics?.['Model'] ||
                      itemSpecifics?.['Model Number'] ||
                      itemSpecifics?.['MPN'] ||
                      extracted.numbers[0];
  
  const brand = itemSpecifics?.['Brand'] || 
                extracted.brands[0];
  
  const mainKeyword = itemSpecifics?.['Card Name'] || 
                      itemSpecifics?.['Character'] ||
                      itemSpecifics?.['Name'] ||
                      extracted.mainWords[0];
  
  const language = itemSpecifics?.['Language'] ||
                   extracted.languages[0];
  
  const category = inferCategory(title, itemSpecifics);

  const level12: string[] = [];
  const level34: string[] = [];
  const level5: string[] = [];

  // 🔥 レベル1: タイトル完全（最も厳密）
  level12.push(`${title} ${exclusionStr}`.trim());

  // 🔥 レベル2: 型番 + 主要キーワード + ブランド + 言語（やや緩め）
  if (modelNumber && brand) {
    const level2Parts = [modelNumber, brand];
    if (mainKeyword) level2Parts.push(mainKeyword);
    if (language) level2Parts.push(language);
    level12.push(`${level2Parts.join(' ')} ${exclusionStr}`.trim());
  } else if (mainKeyword && brand) {
    // 型番がない場合
    const level2Parts = [mainKeyword, brand];
    if (language) level2Parts.push(language);
    level12.push(`${level2Parts.join(' ')} ${exclusionStr}`.trim());
  }

  // 🔥 レベル3: 型番 + ブランド + カテゴリ
  if (modelNumber && brand) {
    level34.push(`${modelNumber} ${brand} ${category} ${exclusionStr}`.trim());
  }

  // 🔥 レベル4: 主要キーワード + ブランド + 特別キーワード（型番なし）
  if (mainKeyword && brand) {
    const level4Parts = [mainKeyword, brand];
    if (extracted.specialWords.length > 0) {
      level4Parts.push(extracted.specialWords[0]);
    }
    level34.push(`${level4Parts.join(' ')} ${exclusionStr}`.trim());
  }

  // 🔥 レベル5: 型番/主要キーワード + カテゴリ（最後の手段）
  if (modelNumber) {
    level5.push(`${modelNumber} ${category} ${exclusionStr}`.trim());
  } else if (mainKeyword) {
    level5.push(`${mainKeyword} ${category} ${exclusionStr}`.trim());
  } else {
    // 何もない場合はタイトルの最初の3単語
    const firstWords = title.split(/\s+/).slice(0, 3).join(' ');
    level5.push(`${firstWords} ${exclusionStr}`.trim());
  }

  // 重複を除去
  const uniqueLevel12 = [...new Set(level12)].filter(q => q.replace(exclusionStr, '').trim().length >= 5);
  const uniqueLevel34 = [...new Set(level34)].filter(q => q.replace(exclusionStr, '').trim().length >= 5);
  const uniqueLevel5 = [...new Set(level5)].filter(q => q.replace(exclusionStr, '').trim().length >= 5);

  console.log('🔍 段階的検索クエリ:');
  console.log(`  レベル1-2: ${uniqueLevel12.join(' | ')}`);
  console.log(`  レベル3-4: ${uniqueLevel34.join(' | ')}`);
  console.log(`  レベル5: ${uniqueLevel5.join(' | ')}`);

  return {
    level12: uniqueLevel12,
    level34: uniqueLevel34,
    level5: uniqueLevel5
  };
}

// =============================================================================
// OAuth トークン取得
// =============================================================================

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

  console.log('🔑 Application Tokenを取得中...')

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
    const errorText = await response.text()
    console.error('❌ トークン取得エラー:', errorText)
    throw new Error(`トークン取得失敗: ${response.status} - ${errorText}`)
  }

  const data = await response.json()

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000
  }

  console.log('✅ Application Token取得成功')
  return data.access_token
}

// =============================================================================
// Browse API検索
// =============================================================================

/**
 * Browse APIで商品検索
 */
async function searchItems(accessToken: string, searchParams: {
  query: string
  categoryId?: string
  limit?: number
}): Promise<{ items: any[], total: number }> {
  const { query, categoryId, limit = 100 } = searchParams

  const params = new URLSearchParams({
    q: query,
    limit: Math.min(limit, 200).toString(),
    sort: 'price',
    filter: 'buyingOptions:{FIXED_PRICE},price:[1..]'
  })

  if (categoryId && categoryId !== '99999') {
    params.append('category_ids', categoryId)
  }

  const apiUrl = `${EBAY_BROWSE_API}?${params.toString()}`

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
    
    if (response.status === 429) {
      throw new Error('RATE_LIMIT')
    }

    throw new Error(`Browse API Error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return {
    items: data.itemSummaries || [],
    total: data.total || 0
  }
}

/**
 * 🔥 Waterfall検索（Gemini指針）
 * 
 * 1. レベル1・2を同時に投げる
 * 2. 結果が3件未満ならレベル3・4へ
 * 3. それでも0件ならレベル5へ
 */
async function waterfallSearch(
  accessToken: string,
  ebayTitle: string,
  itemSpecifics: any,
  categoryId?: string
): Promise<{
  items: any[]
  searchLevel: number
  usedQuery: string
  totalApiCalls: number
}> {
  const queries = buildSearchQueries(ebayTitle, itemSpecifics);
  let allItems: any[] = [];
  let searchLevel = 0;
  let usedQuery = '';
  let totalApiCalls = 0;

  // 🔥 ステップ1: レベル1・2を同時実行
  console.log('📡 ステップ1: レベル1-2 検索...');
  const level12Results = await Promise.all(
    queries.level12.map(async (query) => {
      try {
        totalApiCalls++;
        const result = await searchItems(accessToken, { query, categoryId, limit: 50 });
        return { query, items: result.items, total: result.total };
      } catch (e) {
        console.warn(`  ⚠️ クエリ失敗: ${query}`);
        return { query, items: [], total: 0 };
      }
    })
  );

  // 結果をマージ（重複除去）
  const seenIds = new Set<string>();
  for (const result of level12Results) {
    for (const item of result.items) {
      if (!seenIds.has(item.itemId)) {
        seenIds.add(item.itemId);
        allItems.push(item);
      }
    }
    if (result.items.length > 0 && !usedQuery) {
      usedQuery = result.query;
      searchLevel = 2;
    }
  }

  console.log(`  ✅ レベル1-2結果: ${allItems.length}件`);

  // 🔥 ステップ2: 3件未満ならレベル3・4へ
  if (allItems.length < 3 && queries.level34.length > 0) {
    console.log('📡 ステップ2: レベル3-4 検索...');
    
    const level34Results = await Promise.all(
      queries.level34.map(async (query) => {
        try {
          totalApiCalls++;
          const result = await searchItems(accessToken, { query, categoryId, limit: 50 });
          return { query, items: result.items, total: result.total };
        } catch (e) {
          return { query, items: [], total: 0 };
        }
      })
    );

    for (const result of level34Results) {
      for (const item of result.items) {
        if (!seenIds.has(item.itemId)) {
          seenIds.add(item.itemId);
          allItems.push(item);
        }
      }
      if (result.items.length > 0 && searchLevel < 4) {
        usedQuery = result.query;
        searchLevel = 4;
      }
    }

    console.log(`  ✅ レベル3-4追加後: ${allItems.length}件`);
  }

  // 🔥 ステップ3: 0件ならレベル5へ
  if (allItems.length === 0 && queries.level5.length > 0) {
    console.log('📡 ステップ3: レベル5 検索（最後の手段）...');
    
    for (const query of queries.level5) {
      try {
        totalApiCalls++;
        // カテゴリなしで検索
        const result = await searchItems(accessToken, { query, limit: 50 });
        
        for (const item of result.items) {
          if (!seenIds.has(item.itemId)) {
            seenIds.add(item.itemId);
            allItems.push(item);
          }
        }
        
        if (result.items.length > 0) {
          usedQuery = query;
          searchLevel = 5;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    console.log(`  ✅ レベル5結果: ${allItems.length}件`);
  }

  if (allItems.length === 0) {
    searchLevel = 0;
    usedQuery = queries.level12[0] || ebayTitle;
  }

  return { items: allItems, searchLevel, usedQuery, totalApiCalls };
}

// =============================================================================
// Item Specifics フィルタリング（加重マッチング）
// =============================================================================

/**
 * 🔥 加重Item Specificsマッチング（Gemini指針）
 * 
 * 重み付け:
 * - 型番(MPN): 0.7
 * - ブランド: 0.2
 * - タイトル/その他: 0.1
 */
function filterByItemSpecificsWeighted(items: any[], itemSpecifics: any, originalTitle: string): any[] {
  if (!itemSpecifics || Object.keys(itemSpecifics).length === 0) {
    return items.map(item => ({
      ...item,
      matchLevel: 3,
      matchScore: 0.5,
      matchReason: 'Item Specificsなし'
    }));
  }

  // 重要フィールドの重み
  const weights: Record<string, number> = {
    'MPN': 0.7,
    'Model': 0.7,
    'Model Number': 0.7,
    'Card Number': 0.7,
    'Set Number': 0.7,
    'Brand': 0.2,
    'Manufacturer': 0.2,
  };
  const defaultWeight = 0.1;

  // 型番フィールド
  const mpnValue = itemSpecifics['MPN'] || 
                   itemSpecifics['Model'] || 
                   itemSpecifics['Model Number'] ||
                   itemSpecifics['Card Number'] ||
                   itemSpecifics['Set Number'];
  
  const brandValue = itemSpecifics['Brand'] || itemSpecifics['Manufacturer'];

  return items.map((item: any) => {
    const title = (item.title || '').toLowerCase();
    let totalWeight = 0;
    let matchedWeight = 0;
    const matchReasons: string[] = [];

    // 型番チェック（重み0.7）
    if (mpnValue) {
      totalWeight += 0.7;
      const mpnLower = String(mpnValue).toLowerCase();
      if (title.includes(mpnLower)) {
        matchedWeight += 0.7;
        matchReasons.push(`型番一致(${mpnValue})`);
      }
    }

    // ブランドチェック（重み0.2）
    if (brandValue) {
      totalWeight += 0.2;
      const brandLower = String(brandValue).toLowerCase();
      if (title.includes(brandLower)) {
        matchedWeight += 0.2;
        matchReasons.push(`ブランド一致(${brandValue})`);
      }
    }

    // その他のフィールド（重み0.1を分配）
    const otherFields = Object.entries(itemSpecifics).filter(([key]) => 
      !['MPN', 'Model', 'Model Number', 'Card Number', 'Set Number', 'Brand', 'Manufacturer'].includes(key)
    );
    
    if (otherFields.length > 0) {
      const perFieldWeight = 0.1 / otherFields.length;
      for (const [key, value] of otherFields) {
        if (value && typeof value === 'string' && value.trim() !== '') {
          totalWeight += perFieldWeight;
          const valueLower = value.toLowerCase();
          if (title.includes(valueLower)) {
            matchedWeight += perFieldWeight;
            matchReasons.push(`${key}一致`);
          }
        }
      }
    }

    // スコア計算
    const matchScore = totalWeight > 0 ? matchedWeight / totalWeight : 0;

    // 🔥 Gemini指針: 型番が完全一致なら、スコア50%でもOK
    let finalLevel = 4;
    const hasMpnMatch = mpnValue && title.includes(String(mpnValue).toLowerCase());
    
    if (hasMpnMatch && matchScore >= 0.5) {
      finalLevel = 1;  // 型番一致 + 50%以上 → 最高レベル
    } else if (matchScore >= 0.7) {
      finalLevel = 1;  // 70%以上
    } else if (matchScore >= 0.6) {
      finalLevel = 2;  // 60%以上
    } else if (matchScore >= 0.3) {
      finalLevel = 3;  // 30%以上
    }

    return {
      ...item,
      matchLevel: finalLevel,
      matchScore: parseFloat(matchScore.toFixed(2)),
      matchReason: matchReasons.join(', ') || '不一致',
      isRecommended: finalLevel <= 2
    };
  })
  .filter(item => item.matchLevel <= 3)
  .sort((a, b) => {
    // 1. matchLevelで比較
    if (a.matchLevel !== b.matchLevel) {
      return a.matchLevel - b.matchLevel;
    }
    // 2. matchScoreで比較
    if (a.matchScore !== b.matchScore) {
      return b.matchScore - a.matchScore;
    }
    // 3. 価格で比較
    const priceA = parseFloat(a.price?.value || '999999');
    const priceB = parseFloat(b.price?.value || '999999');
    return priceA - priceB;
  });
}

/**
 * デジタル商品を除外
 */
function filterDigitalProducts(items: any[]): any[] {
  const digitalKeywords = ['code', 'digital', 'online', 'redemption', 'download', 'email', 'message', 'sent', 'delivery'];
  
  return items.filter((item: any) => {
    const title = (item.title || '').toLowerCase();
    return !digitalKeywords.some(keyword => title.includes(keyword));
  });
}

// =============================================================================
// 分析・計算
// =============================================================================

/**
 * 日本人セラー判定
 */
function isJapaneseSeller(item: any): boolean {
  if (item.itemLocation?.country === 'JP') return true;
  const address = item.itemLocation?.addressLine1 || '';
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/.test(address);
}

/**
 * 中央値を計算
 */
function calculateMedian(prices: number[]): number {
  if (prices.length === 0) return 0;
  const sorted = [...prices].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

/**
 * 価格分析
 */
function analyzePrices(items: any[]) {
  const prices = items
    .map((item: any) => parseFloat(item.price?.value || '0'))
    .filter((price: number) => price > 0);

  if (prices.length === 0) {
    return { lowestPrice: 0, averagePrice: 0, medianPrice: 0, competitorCount: 0, jpSellerCount: 0 };
  }

  const jpSellerCount = items.filter(item => isJapaneseSeller(item)).length;

  return {
    lowestPrice: parseFloat(Math.min(...prices).toFixed(2)),
    averagePrice: parseFloat((prices.reduce((sum, p) => sum + p, 0) / prices.length).toFixed(2)),
    medianPrice: parseFloat(calculateMedian(prices).toFixed(2)),
    competitorCount: items.length,
    jpSellerCount
  };
}

/**
 * 利益計算（簡易版）
 */
function calculateProfit(lowestPriceUSD: number, costJPY: number, weightG: number) {
  const JPY_TO_USD = 0.0067;
  const costUSD = costJPY * JPY_TO_USD;

  let shippingCostUSD = 12.99;
  if (weightG > 1000) shippingCostUSD = 18.99;
  if (weightG > 2000) shippingCostUSD = 24.99;

  const ebayFee = lowestPriceUSD * 0.129;
  const paypalFee = lowestPriceUSD * 0.0349 + 0.49;
  const totalCost = costUSD + shippingCostUSD + ebayFee + paypalFee;
  const profitAmount = lowestPriceUSD - totalCost;
  const profitMargin = lowestPriceUSD > 0 ? (profitAmount / lowestPriceUSD) * 100 : 0;

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
  };
}

// =============================================================================
// DB保存
// =============================================================================

async function saveToDatabase(productId: string, data: any) {
  try {
    const { data: product } = await supabase
      .from('products_master')
      .select('ebay_api_data')
      .eq('id', productId)
      .single();

    const existingApiData = product?.ebay_api_data || {};

    const updateData: any = {
      sm_lowest_price: Math.max(0, Math.min(9999.99, data.lowestPrice || 0)),
      sm_average_price: Math.max(0, Math.min(9999.99, data.averagePrice || 0)),
      sm_median_price_usd: Math.max(0, Math.min(9999.99, data.medianPrice || 0)),
      sm_competitor_count: Math.max(0, Math.min(9999, data.competitorCount || 0)),
      sm_jp_seller_count: Math.max(0, Math.min(9999, data.jpSellerCount || 0)),
      sm_jp_sellers: Math.max(0, Math.min(9999, data.jpSellerCount || 0)),
      sm_competitors: Math.max(0, Math.min(9999, data.competitorCount || 0)),
      sm_profit_amount_usd: Math.max(-999.99, Math.min(999.99, data.profitAmount || 0)),
      sm_profit_margin: Math.max(-999.99, Math.min(999.99, data.profitMargin || 0)),
      sm_analyzed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ebay_api_data: {
        ...existingApiData,
        browse_result: {
          lowestPrice: data.lowestPrice,
          averagePrice: data.averagePrice,
          medianPrice: data.medianPrice,
          jpSellerCount: data.jpSellerCount,
          competitorCount: data.competitorCount,
          profitAmount: data.profitAmount,
          profitMargin: data.profitMargin,
          breakdown: data.breakdown,
          items: data.items || [],
          referenceItems: data.referenceItems || [],
          searchedAt: new Date().toISOString(),
          searchTitle: data.searchTitle,
          searchLevel: data.searchLevel,
          totalApiCalls: data.totalApiCalls
        }
      }
    };

    const { error } = await supabase
      .from('products_master')
      .update(updateData)
      .eq('id', productId);

    if (error) throw error;
    console.log('✅ DB保存完了');
  } catch (error) {
    console.error('❌ DB保存失敗:', error);
    throw error;
  }
}

// =============================================================================
// POSTエンドポイント
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productId,
      ebayTitle,
      itemSpecifics,
      ebayCategoryId,
      weightG = 500,
      actualCostJPY = 0
    } = body;

    console.log('🔍 Browse API検索リクエスト (v2 Waterfall):');
    console.log(`  商品ID: ${productId}`);
    console.log(`  タイトル: ${ebayTitle?.substring(0, 50)}...`);
    console.log(`  カテゴリID: ${ebayCategoryId || 'なし'}`);

    if (!ebayTitle) {
      return NextResponse.json(
        { success: false, error: 'ebayTitle（英語タイトル）は必須です' },
        { status: 400 }
      );
    }

    // API呼び出し可能かチェック
    const safetyCheck = await canMakeApiCallSafely(API_NAME);
    const apiStatus = await getApiCallStatus(API_NAME);

    if (!safetyCheck.canCall) {
      return NextResponse.json(
        {
          success: false,
          error: safetyCheck.reason || 'API呼び出し制限に達しました',
          errorCode: 'RATE_LIMIT_EXCEEDED',
          apiStatus
        },
        { status: 429 }
      );
    }

    // カテゴリIDを取得
    let categoryIdToUse = ebayCategoryId;
    if (!categoryIdToUse && productId) {
      const { data: product } = await supabase
        .from('products_master')
        .select('ebay_category_id')
        .eq('id', productId)
        .single();
      
      if (product?.ebay_category_id) {
        categoryIdToUse = product.ebay_category_id;
      }
    }

    await waitBeforeApiCall();

    // 1. アクセストークン取得
    const accessToken = await getAccessToken();

    // 2. 🔥 Waterfall検索を実行
    const { items, searchLevel, usedQuery, totalApiCalls } = await waterfallSearch(
      accessToken,
      ebayTitle,
      itemSpecifics,
      categoryIdToUse
    );

    // API呼び出しカウントを増加（実際の呼び出し回数分）
    for (let i = 0; i < totalApiCalls; i++) {
      await incrementApiCallCount(API_NAME);
    }

    console.log(`✅ Waterfall検索完了: ${items.length}件 (レベル${searchLevel}, API ${totalApiCalls}回)`);

    if (items.length === 0) {
      console.warn('⚠️ 該当商品が見つかりませんでした');
      
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
          searchTitle: usedQuery,
          searchLevel: 0,
          totalApiCalls
        });
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
        message: '該当商品が見つかりませんでした。',
        searchLevel: 0,
        totalApiCalls,
        apiStatus: await getApiCallStatus(API_NAME)
      });
    }

    // 3. デジタル商品をフィルタリング
    let filteredItems = filterDigitalProducts(items);

    // 4. 🔥 加重Item Specificsマッチング
    if (itemSpecifics) {
      filteredItems = filterByItemSpecificsWeighted(filteredItems, itemSpecifics, ebayTitle);
      console.log(`✅ Item Specificsフィルター後: ${filteredItems.length}件`);
      
      const level1Count = filteredItems.filter(i => i.matchLevel === 1).length;
      const level2Count = filteredItems.filter(i => i.matchLevel === 2).length;
      const level3Count = filteredItems.filter(i => i.matchLevel === 3).length;
      console.log(`  🎯 精度分布: L1=${level1Count}, L2=${level2Count}, L3=${level3Count}`);
    }

    // 5. 価格分析
    const priceAnalysis = analyzePrices(filteredItems);
    console.log('💰 価格分析:', priceAnalysis);

    // 6. 利益計算
    const profitAnalysis = calculateProfit(priceAnalysis.lowestPrice, actualCostJPY, weightG);
    console.log('💵 利益分析:', profitAnalysis);

    // 7. DB保存
    if (productId) {
      await saveToDatabase(productId, {
        ...priceAnalysis,
        ...profitAnalysis,
        items: filteredItems.slice(0, 20),
        referenceItems: filteredItems.slice(0, 20),
        searchTitle: usedQuery,
        searchLevel,
        totalApiCalls
      });
    }

    return NextResponse.json({
      success: true,
      ...priceAnalysis,
      ...profitAnalysis,
      items: filteredItems.slice(0, 20),
      searchLevel,
      usedQuery,
      totalApiCalls,
      apiStatus: await getApiCallStatus(API_NAME)
    });

  } catch (error: any) {
    console.error('❌ Browse API Error:', error);
    const apiStatus = await getApiCallStatus(API_NAME);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        apiStatus
      },
      { status: 500 }
    );
  }
}
