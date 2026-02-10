/**
 * Keepa API Client - P0 Security Enhanced
 *
 * P-4戦略とP-1戦略のためのKeepa統合
 * - P-4: 市場枯渇検知（在庫切れ→在庫復活のタイミング）
 * - P-1: 価格ミス検知（急激な価格下落）
 * - P0: pgsodium暗号化vaultからAPI key取得
 */

import type { KeepaProduct, KeepaAPIResponse, P4Score, P1Score } from '@/types/keepa'
import { credentialManager } from '@/lib/security/credential-manager'

interface KeepaAPIConfig {
  apiKey?: string
  baseUrl: string
}

export class KeepaAPIClient {
  private config: KeepaAPIConfig
  private apiKeyCache: string | null = null

  constructor() {
    this.config = {
      baseUrl: 'https://api.keepa.com'
    }
  }

  /**
   * P0: API keyを取得（vault優先、fallbackで環境変数）
   */
  private async getApiKey(): Promise<string> {
    // キャッシュがあれば使用
    if (this.apiKeyCache) {
      return this.apiKeyCache
    }

    try {
      // P0: 暗号化vaultから取得
      this.apiKeyCache = await credentialManager.getApiKey('keepa')
      console.log('🔐 Keepa API key loaded from encrypted vault')
      return this.apiKeyCache
    } catch (error) {
      // Fallback: 環境変数から取得（移行前の互換性）
      const envKey = process.env.KEEPA_API_KEY
      if (envKey) {
        console.warn('⚠️ Using Keepa API key from environment variable (not encrypted)')
        this.apiKeyCache = envKey
        return envKey
      }

      throw new Error('Keepa API key not found in vault or environment variables')
    }
  }

  /**
   * 商品情報取得（ASIN指定）- P0対応
   */
  async getProduct(asin: string, domain: number = 1): Promise<KeepaProduct | null> {
    try {
      const apiKey = await this.getApiKey()
      const url = `${this.config.baseUrl}/product?key=${apiKey}&domain=${domain}&asin=${asin}&stats=90&history=1`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Keepa API Error: ${response.status} - ${response.statusText}`)
      }

      const data: KeepaAPIResponse = await response.json()

      if (!data.products || data.products.length === 0) {
        return null
      }

      return data.products[0]
    } catch (error) {
      console.error('Keepa API getProduct error:', error)
      throw error
    }
  }

  /**
   * 複数商品一括取得（最大100件）- P0対応
   */
  async getProducts(asins: string[], domain: number = 1): Promise<KeepaProduct[]> {
    try {
      if (asins.length === 0) {
        return []
      }

      // Keepa APIは最大100件まで
      const chunkedAsins = asins.slice(0, 100)
      const asinString = chunkedAsins.join(',')

      const apiKey = await this.getApiKey()
      const url = `${this.config.baseUrl}/product?key=${apiKey}&domain=${domain}&asin=${asinString}&stats=90&history=1`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Keepa API Error: ${response.status} - ${response.statusText}`)
      }

      const data: KeepaAPIResponse = await response.json()

      return data.products || []
    } catch (error) {
      console.error('Keepa API getProducts error:', error)
      throw error
    }
  }

  /**
   * ベストセラーランキング（BSR）データを取得 - P0対応
   */
  async getBestSellers(categoryId: string, domain: number = 1): Promise<KeepaProduct[]> {
    try {
      const apiKey = await this.getApiKey()
      const url = `${this.config.baseUrl}/bestsellers?key=${apiKey}&domain=${domain}&category=${categoryId}&range=0`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Keepa API Error: ${response.status} - ${response.statusText}`)
      }

      const data: KeepaAPIResponse = await response.json()

      return data.products || []
    } catch (error) {
      console.error('Keepa API getBestSellers error:', error)
      throw error
    }
  }

  /**
   * ディールファインダー（価格下落検知）
   */
  async findDeals(options: {
    domain?: number
    minDiscount?: number
    maxCurrentPrice?: number
    categoryId?: string
  } = {}): Promise<KeepaProduct[]> {
    try {
      const {
        domain = 1,
        minDiscount = 30,
        maxCurrentPrice = 100,
        categoryId = '0'
      } = options

      const apiKey = await this.getApiKey()
      const url = `${this.config.baseUrl}/deals?key=${apiKey}&domain=${domain}&category=${categoryId}&range=0&minDiscount=${minDiscount}&maxPrice=${maxCurrentPrice * 100}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Keepa API Error: ${response.status} - ${response.statusText}`)
      }

      const data: KeepaAPIResponse = await response.json()

      return data.products || []
    } catch (error) {
      console.error('Keepa API findDeals error:', error)
      throw error
    }
  }

  /**
   * P-4スコア計算（市場枯渇戦略）
   *
   * アルゴリズム：
   * 1. 過去90日間の在庫切れ頻度を分析
   * 2. 在庫復活時の価格上昇率を計算
   * 3. BSRの変動パターンを分析
   * 4. 現在の在庫状態と価格を評価
   *
   * スコアリング：
   * - 100点: 完璧なP-4機会（高頻度在庫切れ、高価格上昇、低BSR）
   * - 70-99点: 優良P-4機会
   * - 40-69点: 通常P-4機会
   * - 0-39点: P-4機会なし
   */
  calculateP4Score(product: KeepaProduct): P4Score {
    const score: P4Score = {
      totalScore: 0,
      stockOutFrequency: 0,
      priceIncrease: 0,
      bsrVolatility: 0,
      currentOpportunity: 0,
      recommendation: 'none'
    }

    // 在庫切れ頻度の分析（csv[0] = Amazon price）
    if (product.csv && product.csv[0]) {
      const priceHistory = product.csv[0]
      let stockOutCount = 0
      let totalDataPoints = 0

      // -1は在庫切れを示す
      for (let i = 0; i < priceHistory.length; i += 2) {
        if (priceHistory[i + 1] === -1) {
          stockOutCount++
        }
        totalDataPoints++
      }

      if (totalDataPoints > 0) {
        const stockOutRate = stockOutCount / totalDataPoints
        score.stockOutFrequency = Math.min(stockOutRate * 100, 40)
      }
    }

    // 価格上昇率の分析
    if (product.stats && product.stats.current && product.stats.avg) {
      const currentPrice = product.stats.current[0] // Amazon price
      const avgPrice = product.stats.avg[0]

      if (currentPrice > 0 && avgPrice > 0) {
        const priceIncreaseRate = ((currentPrice - avgPrice) / avgPrice) * 100
        score.priceIncrease = Math.min(Math.max(priceIncreaseRate, 0), 30)
      }
    }

    // BSRボラティリティの分析
    if (product.csv && product.csv[3]) {
      const bsrHistory = product.csv[3]
      const bsrValues: number[] = []

      for (let i = 0; i < bsrHistory.length; i += 2) {
        const bsrValue = bsrHistory[i + 1]
        if (bsrValue > 0) {
          bsrValues.push(bsrValue)
        }
      }

      if (bsrValues.length > 1) {
        const avgBsr = bsrValues.reduce((a, b) => a + b, 0) / bsrValues.length
        const variance = bsrValues.reduce((sum, val) => sum + Math.pow(val - avgBsr, 2), 0) / bsrValues.length
        const stdDev = Math.sqrt(variance)
        const coefficientOfVariation = (stdDev / avgBsr) * 100

        // 高いボラティリティ = 高いP-4機会
        score.bsrVolatility = Math.min(coefficientOfVariation, 20)
      }
    }

    // 現在の機会評価
    const isCurrentlyOutOfStock = product.stats?.current?.[0] === -1
    const hasLowBSR = (product.stats?.current?.[3] || Infinity) < 10000

    if (isCurrentlyOutOfStock && hasLowBSR) {
      score.currentOpportunity = 10 // 現在在庫切れ + 低BSR = 即座に仕入れるべき
    }

    // 総合スコア計算
    score.totalScore =
      score.stockOutFrequency +
      score.priceIncrease +
      score.bsrVolatility +
      score.currentOpportunity

    // 推奨レベル
    if (score.totalScore >= 70) {
      score.recommendation = 'excellent'
    } else if (score.totalScore >= 40) {
      score.recommendation = 'good'
    } else if (score.totalScore >= 20) {
      score.recommendation = 'moderate'
    } else {
      score.recommendation = 'none'
    }

    return score
  }

  /**
   * P-1スコア計算（価格ミス戦略）
   *
   * アルゴリズム：
   * 1. 現在価格と過去平均価格の乖離率
   * 2. 価格下落の急激さ
   * 3. 価格下落の持続期間
   * 4. 販売実績（BSR）の安定性
   *
   * スコアリング：
   * - 100点: 完璧な価格ミス（50%以上下落、高速販売実績あり）
   * - 70-99点: 優良価格ミス
   * - 40-69点: 通常価格ミス
   * - 0-39点: 価格ミスなし
   */
  calculateP1Score(product: KeepaProduct): P1Score {
    const score: P1Score = {
      totalScore: 0,
      priceDropPercentage: 0,
      dropSpeed: 0,
      historicalStability: 0,
      salesRankQuality: 0,
      recommendation: 'none'
    }

    // 価格下落率の計算
    if (product.stats && product.stats.current && product.stats.avg) {
      const currentPrice = product.stats.current[0]
      const avgPrice = product.stats.avg[0]
      const minPrice = product.stats.min?.[0] || currentPrice

      if (currentPrice > 0 && avgPrice > 0) {
        const dropPercentage = ((avgPrice - currentPrice) / avgPrice) * 100
        score.priceDropPercentage = Math.min(dropPercentage, 50)
      }
    }

    // 価格下落速度の分析
    if (product.csv && product.csv[0]) {
      const priceHistory = product.csv[0]
      const recentDataPoints = 10 // 最新10データポイント

      if (priceHistory.length >= recentDataPoints * 2) {
        const recentPrices: number[] = []
        for (let i = priceHistory.length - recentDataPoints * 2; i < priceHistory.length; i += 2) {
          const price = priceHistory[i + 1]
          if (price > 0) {
            recentPrices.push(price)
          }
        }

        if (recentPrices.length >= 2) {
          const firstPrice = recentPrices[0]
          const lastPrice = recentPrices[recentPrices.length - 1]
          const dropSpeed = ((firstPrice - lastPrice) / firstPrice) * 100

          score.dropSpeed = Math.min(Math.max(dropSpeed, 0), 20)
        }
      }
    }

    // 歴史的価格の安定性
    if (product.stats && product.stats.avg && product.stats.current) {
      const avgPrice = product.stats.avg[0]
      const currentPrice = product.stats.current[0]
      const maxPrice = product.stats.max?.[0] || avgPrice

      if (avgPrice > 0 && maxPrice > 0) {
        const stability = (avgPrice / maxPrice) * 100
        score.historicalStability = Math.min(stability * 0.2, 15)
      }
    }

    // BSRの質（低い = 高速で売れる）
    const currentBSR = product.stats?.current?.[3]
    if (currentBSR && currentBSR > 0) {
      if (currentBSR < 1000) {
        score.salesRankQuality = 15
      } else if (currentBSR < 10000) {
        score.salesRankQuality = 10
      } else if (currentBSR < 50000) {
        score.salesRankQuality = 5
      } else {
        score.salesRankQuality = 0
      }
    }

    // 総合スコア計算
    score.totalScore =
      score.priceDropPercentage +
      score.dropSpeed +
      score.historicalStability +
      score.salesRankQuality

    // 推奨レベル
    if (score.totalScore >= 70) {
      score.recommendation = 'excellent'
    } else if (score.totalScore >= 40) {
      score.recommendation = 'good'
    } else if (score.totalScore >= 20) {
      score.recommendation = 'moderate'
    } else {
      score.recommendation = 'none'
    }

    return score
  }

  /**
   * 統合スコアリング（P-4 + P-1）
   */
  calculateCombinedScore(product: KeepaProduct) {
    const p4Score = this.calculateP4Score(product)
    const p1Score = this.calculateP1Score(product)

    // より高いスコアを優先
    const primaryStrategy = p4Score.totalScore >= p1Score.totalScore ? 'P-4' : 'P-1'
    const primaryScore = Math.max(p4Score.totalScore, p1Score.totalScore)

    return {
      p4Score,
      p1Score,
      primaryStrategy,
      primaryScore,
      shouldPurchase: primaryScore >= 40,
      urgency: primaryScore >= 70 ? 'high' : primaryScore >= 40 ? 'medium' : 'low'
    }
  }

  /**
   * ドメイン番号取得（国コードから）
   * 1 = US, 3 = DE, 4 = FR, 5 = JP, 6 = UK, etc.
   */
  getDomainFromCountry(country: string): number {
    const domainMap: Record<string, number> = {
      'US': 1,
      'GB': 6,
      'DE': 3,
      'FR': 4,
      'JP': 5,
      'CA': 7,
      'IT': 8,
      'ES': 9,
      'IN': 10,
      'MX': 11
    }

    return domainMap[country.toUpperCase()] || 1
  }

  /**
   * APIトークン残高確認 - P0対応
   */
  async getTokenStatus(): Promise<{
    tokensLeft: number
    refillIn: number
    refillRate: number
  }> {
    try {
      const apiKey = await this.getApiKey()
      const url = `${this.config.baseUrl}/token?key=${apiKey}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Keepa API Error: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()

      return {
        tokensLeft: data.tokensLeft || 0,
        refillIn: data.refillIn || 0,
        refillRate: data.refillRate || 0
      }
    } catch (error) {
      console.error('Keepa API getTokenStatus error:', error)
      throw error
    }
  }
}

// シングルトンインスタンス
export const keepaClient = new KeepaAPIClient()
