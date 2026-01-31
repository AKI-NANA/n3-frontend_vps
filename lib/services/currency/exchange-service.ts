// lib/services/currency/exchange-service.ts
/**
 * 為替変換サービス - ハイブリッドAI監査パイプライン
 * 
 * 機能:
 * - USD基準価格から各国通貨への変換
 * - DBキャッシュ対応（既存exchange_ratesテーブル使用）
 * - 安全装置2対応
 * 
 * @created 2025-01-16
 * @updated 2025-01-16 既存exchange_ratesテーブル構造に対応
 * 
 * 既存テーブル構造:
 * - from_currency_code (varchar)
 * - to_currency_code (varchar)
 * - exchange_rate (numeric)
 * - rate_date (date)
 */
import { createClient } from '@supabase/supabase-js'
import type { ConvertedPrice, MarketplaceCurrency } from '@/types/hybrid-ai-pipeline'

// サーバーサイドでのみSupabaseクライアントを作成
let supabase: ReturnType<typeof createClient> | null = null

function getSupabase() {
  if (!supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!url || !key) {
      throw new Error('Supabase credentials not configured')
    }
    
    supabase = createClient(url, key)
  }
  return supabase
}

/**
 * マーケットプレイス通貨設定
 */
export const CURRENCY_MAP: Record<string, MarketplaceCurrency> = {
  'EBAY_US': { currency: 'USD', symbol: '$', rateKey: 'USD' },
  'EBAY_UK': { currency: 'GBP', symbol: '£', rateKey: 'GBP' },
  'EBAY_DE': { currency: 'EUR', symbol: '€', rateKey: 'EUR' },
  'EBAY_AU': { currency: 'AUD', symbol: 'A$', rateKey: 'AUD' },
  'EBAY_CA': { currency: 'CAD', symbol: 'C$', rateKey: 'CAD' },
  'EBAY_IT': { currency: 'EUR', symbol: '€', rateKey: 'EUR' },
  'EBAY_FR': { currency: 'EUR', symbol: '€', rateKey: 'EUR' },
  'EBAY_ES': { currency: 'EUR', symbol: '€', rateKey: 'EUR' },
}

/**
 * 為替レート取得（既存テーブル構造対応）
 * 
 * 既存テーブル: exchange_rates
 * - from_currency_code, to_currency_code, exchange_rate, rate_date
 */
export async function getExchangeRate(from: string, to: string): Promise<number> {
  // 同一通貨は1を返す
  if (from === to) return 1
  
  const db = getSupabase()
  
  // キャッシュチェック（最新のレートを取得）
  const { data: cached, error: cacheError } = await db
    .from('exchange_rates')
    .select('exchange_rate, rate_date')
    .eq('from_currency_code', from)
    .eq('to_currency_code', to)
    .order('rate_date', { ascending: false })
    .limit(1)
    .single()
  
  // 今日のレートがあればそれを使用
  const today = new Date().toISOString().split('T')[0]
  if (cached && !cacheError && cached.rate_date === today) {
    console.log(`💱 為替キャッシュヒット: ${from}→${to} = ${cached.exchange_rate}`)
    return Number(cached.exchange_rate)
  }
  
  // APIから取得
  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`,
      { next: { revalidate: 3600 } } // Next.js キャッシュ
    )
    
    if (!response.ok) {
      throw new Error(`Exchange API error: ${response.status}`)
    }
    
    const data = await response.json()
    const rate = data.rates?.[to]
    
    if (!rate) {
      console.warn(`⚠️ 為替レート未取得: ${from}→${to}、フォールバック使用`)
      // キャッシュがあれば古くても使用
      if (cached) return Number(cached.exchange_rate)
      return 1
    }
    
    // キャッシュ保存（INSERT - 日付ごとに新規レコード）
    const { error: insertError } = await db.from('exchange_rates').insert({
      from_currency_code: from,
      to_currency_code: to,
      exchange_rate: rate,
      rate_date: today,
    })
    
    if (insertError) {
      // 既に今日のレートがある場合はUPDATE
      if (insertError.code === '23505') { // unique violation
        await db.from('exchange_rates')
          .update({ exchange_rate: rate })
          .eq('from_currency_code', from)
          .eq('to_currency_code', to)
          .eq('rate_date', today)
      } else {
        console.warn('⚠️ 為替キャッシュ保存失敗:', insertError.message)
      }
    }
    
    console.log(`💱 為替API取得: ${from}→${to} = ${rate}`)
    return rate
  } catch (error) {
    console.error('❌ 為替レート取得エラー:', error)
    
    // キャッシュが古くてもあれば使用
    if (cached) {
      console.log(`💱 古いキャッシュを使用: ${from}→${to} = ${cached.exchange_rate}`)
      return Number(cached.exchange_rate)
    }
    
    // 最終フォールバック: DBから最新を再取得
    const { data: fallback } = await db
      .from('exchange_rates')
      .select('exchange_rate')
      .eq('from_currency_code', from)
      .eq('to_currency_code', to)
      .order('rate_date', { ascending: false })
      .limit(1)
      .single()
    
    if (fallback) {
      return Number(fallback.exchange_rate)
    }
    
    return 1 // 最終フォールバック
  }
}

/**
 * USD基準価格をマーケットプレイスの通貨に変換
 */
export async function convertPriceForMarketplace(
  basePriceUsd: number,
  targetMarketplace: string
): Promise<ConvertedPrice> {
  const marketplaceConfig = CURRENCY_MAP[targetMarketplace] || CURRENCY_MAP['EBAY_US']
  const { currency, symbol } = marketplaceConfig
  
  // USDの場合はそのまま返す
  if (currency === 'USD') {
    return {
      price: basePriceUsd,
      currency: 'USD',
      symbol: '$',
      originalPrice: basePriceUsd,
      originalCurrency: 'USD',
      rate: 1,
    }
  }
  
  const rate = await getExchangeRate('USD', currency)
  const convertedPrice = Math.round(basePriceUsd * rate * 100) / 100
  
  return {
    price: convertedPrice,
    currency,
    symbol,
    originalPrice: basePriceUsd,
    originalCurrency: 'USD',
    rate,
  }
}

/**
 * 任意の通貨をUSDに変換
 */
export async function convertToUsd(price: number, fromCurrency: string): Promise<number> {
  if (fromCurrency === 'USD') return price
  
  const rate = await getExchangeRate(fromCurrency, 'USD')
  return Math.round(price * rate * 100) / 100
}

/**
 * 価格を任意の通貨間で変換
 */
export async function convertCurrency(
  price: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) return price
  
  const rate = await getExchangeRate(fromCurrency, toCurrency)
  return Math.round(price * rate * 100) / 100
}

/**
 * 全ての主要通貨レートを一括取得（UI表示用）
 */
export async function getAllRatesFromUsd(): Promise<Record<string, number>> {
  const currencies = ['GBP', 'EUR', 'AUD', 'CAD', 'JPY']
  const rates: Record<string, number> = { USD: 1 }
  
  await Promise.all(
    currencies.map(async (currency) => {
      rates[currency] = await getExchangeRate('USD', currency)
    })
  )
  
  return rates
}

/**
 * 価格表示用フォーマッター
 */
export function formatPrice(price: number, currency: string): string {
  const config = Object.values(CURRENCY_MAP).find(c => c.currency === currency)
  const symbol = config?.symbol || currency
  
  // 小数点以下2桁で表示
  const formattedPrice = price.toFixed(2)
  
  // 通貨によってシンボルの位置を変える
  if (['EUR'].includes(currency)) {
    return `${formattedPrice}${symbol}`
  }
  
  return `${symbol}${formattedPrice}`
}

/**
 * マーケットプレイスIDから通貨情報を取得
 */
export function getCurrencyForMarketplace(marketplaceId: string): MarketplaceCurrency {
  return CURRENCY_MAP[marketplaceId] || CURRENCY_MAP['EBAY_US']
}

// デフォルトエクスポート
const exchangeService = {
  getExchangeRate,
  convertPriceForMarketplace,
  convertToUsd,
  convertCurrency,
  getAllRatesFromUsd,
  formatPrice,
  getCurrencyForMarketplace,
  CURRENCY_MAP,
}

export default exchangeService
