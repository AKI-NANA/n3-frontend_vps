/**
 * 統合利益計算サービス V2 (Integrated Pricing Service)
 * 
 * 修正内容：
 * - global_settings テーブルから設定値を取得（marketplace_settingsは使用しない）
 * - 為替レート、手数料率をDBから動的取得
 * - 送料計算は既存のn8nロジックを移植
 * 
 * 作成日: 2026-01-22
 * 修正理由: marketplace_settingsテーブルが存在しないため、実際のデータが入っているglobal_settingsを参照
 */

import { createClient } from '@/lib/supabase/client'

/**
 * グローバル設定（global_settings テーブル）
 */
export interface GlobalSettings {
  [key: string]: string | number
  exchange_rate_usd_jpy: number
  exchange_rate_eur_jpy: number
  exchange_rate_gbp_jpy: number
  ebay_fee_percent: number
  paypal_fee_percent: number
  vat_rate_eu: number
  vat_rate_uk: number
  target_profit_rate_default: number
}

/**
 * 価格計算の入力パラメータ
 */
export interface PricingInput {
  marketplace_id: string // マーケットプレイスID (例: 'EBAY_US', 'AMAZON_US')
  cost_jpy: number // 原価（JPY）
  target_profit_jpy?: number // 目標利益（JPY）
  target_profit_rate?: number // 目標利益率（0.20 = 20%）
  weight_g?: number // 商品重量（グラム）
  shipping_cost_usd?: number // カスタム送料（USD）
  
  // オプション設定
  include_tax?: boolean // VAT/税金を含むか
  include_paypal_fee?: boolean // PayPal手数料を含むか
}

/**
 * 価格計算の結果
 */
export interface PricingResult {
  selling_price_usd: number // 販売価格（USD）
  cost_jpy: number // 原価（JPY）
  cost_usd: number // 原価（USD換算）
  shipping_cost_usd: number // 送料（USD）
  ebay_fee_usd: number // eBay手数料（USD）
  paypal_fee_usd: number // PayPal手数料（USD）
  tax_usd: number // VAT/税金（USD）
  total_costs_usd: number // 総コスト（USD）
  profit_usd: number // 利益（USD）
  profit_jpy: number // 利益（JPY）
  profit_margin: number // 利益率（0.20 = 20%）
  is_profitable: boolean // 利益が出るか
  warnings: string[] // 警告メッセージ
  
  // デバッグ情報
  debug?: {
    exchange_rate: number
    ebay_fee_rate: number
    paypal_fee_rate: number
    target_profit_rate: number
  }
}

/**
 * 統合利益計算サービスクラス V2
 */
export class IntegratedPricingServiceV2 {
  private supabase = createClient()
  private settingsCache: GlobalSettings | null = null
  private cacheTimestamp: number = 0
  private CACHE_TTL = 60000 // 1分間キャッシュ

  /**
   * global_settings から設定値を一括取得
   */
  async getGlobalSettings(): Promise<GlobalSettings> {
    // キャッシュチェック
    const now = Date.now()
    if (this.settingsCache && (now - this.cacheTimestamp) < this.CACHE_TTL) {
      return this.settingsCache
    }

    const { data, error } = await this.supabase
      .from('global_settings')
      .select('setting_key, setting_value')

    if (error) {
      console.error('Failed to fetch global settings:', error)
      // フォールバック値（DBから取得できない場合）
      return {
        exchange_rate_usd_jpy: 150,
        exchange_rate_eur_jpy: 165,
        exchange_rate_gbp_jpy: 190,
        ebay_fee_percent: 0.13,
        paypal_fee_percent: 0.04,
        vat_rate_eu: 0.21,
        vat_rate_uk: 0.20,
        target_profit_rate_default: 0.20,
      }
    }

    // データを連想配列に変換
    const settings: any = {}
    data?.forEach(row => {
      const value = parseFloat(row.setting_value)
      settings[row.setting_key] = isNaN(value) ? row.setting_value : value
    })

    this.settingsCache = settings as GlobalSettings
    this.cacheTimestamp = now

    console.log('✅ Global settings loaded from DB:', {
      exchange_rate_usd_jpy: settings.exchange_rate_usd_jpy,
      ebay_fee_percent: settings.ebay_fee_percent,
      paypal_fee_percent: settings.paypal_fee_percent,
    })

    return this.settingsCache
  }

  /**
   * 送料を計算（n8nのロジックを移植）
   * 
   * 既存のn8nワークフローから移植:
   * - 0.5kg以下: 1,200円
   * - 1.0kg以下: 1,800円
   * - 1.0kg超: 2,200円 + (kg-1) × 700円
   */
  calculateShipping(weight_g: number): number {
    const weight_kg = weight_g / 1000

    let shipping_jpy = 0
    if (weight_kg <= 0.5) {
      shipping_jpy = 1200
    } else if (weight_kg <= 1.0) {
      shipping_jpy = 1800
    } else {
      shipping_jpy = 2200 + (weight_kg - 1) * 700
    }

    // JPYをUSDに変換（仮に150円で計算、実際は設定値を使用）
    return shipping_jpy / 150
  }

  /**
   * メイン計算関数
   */
  async calculate(input: PricingInput): Promise<PricingResult> {
    const warnings: string[] = []
    const settings = await this.getGlobalSettings()

    // 1. 為替レート取得
    const exchangeRate = settings.exchange_rate_usd_jpy || 150

    // 2. 手数料率取得
    const ebayFeeRate = settings.ebay_fee_percent || 0.13
    const paypalFeeRate = settings.paypal_fee_percent || 0.04

    // 3. 目標利益率
    const targetProfitRate = input.target_profit_rate || settings.target_profit_rate_default || 0.20

    // 4. 原価をUSDに換算
    const cost_usd = input.cost_jpy / exchangeRate

    // 5. 送料計算
    let shipping_cost_usd = input.shipping_cost_usd || 0
    if (!shipping_cost_usd && input.weight_g) {
      const shipping_jpy = this.calculateShippingJPY(input.weight_g)
      shipping_cost_usd = shipping_jpy / exchangeRate
    }

    // 6. 販売価格を逆算
    // selling_price = (cost + shipping + target_profit) / (1 - ebay_fee - paypal_fee)
    let target_profit_usd = 0
    let selling_price_usd = 0

    const totalFeeRate = ebayFeeRate + (input.include_paypal_fee !== false ? paypalFeeRate : 0)
    
    if (input.target_profit_jpy) {
      // 目標利益額から逆算
      target_profit_usd = input.target_profit_jpy / exchangeRate
      const numerator = cost_usd + shipping_cost_usd + target_profit_usd
      const denominator = 1 - totalFeeRate
      selling_price_usd = numerator / denominator
    } else {
      // 目標利益率から逆算
      const numerator = cost_usd + shipping_cost_usd
      const denominator = 1 - totalFeeRate - targetProfitRate
      
      if (denominator <= 0) {
        warnings.push('❌ 手数料率+目標利益率が100%を超えています')
        selling_price_usd = cost_usd + shipping_cost_usd // 最低価格
      } else {
        selling_price_usd = numerator / denominator
      }
    }

    // 7. 手数料計算
    const ebay_fee_usd = selling_price_usd * ebayFeeRate
    const paypal_fee_usd = input.include_paypal_fee !== false ? selling_price_usd * paypalFeeRate : 0
    const tax_usd = input.include_tax ? selling_price_usd * (settings.vat_rate_uk || 0) : 0

    // 8. 総コスト
    const total_costs_usd = cost_usd + shipping_cost_usd + ebay_fee_usd + paypal_fee_usd + tax_usd

    // 9. 利益計算
    const profit_usd = selling_price_usd - total_costs_usd
    const profit_jpy = profit_usd * exchangeRate
    const profit_margin = selling_price_usd > 0 ? profit_usd / selling_price_usd : 0

    // 10. 判定
    const is_profitable = profit_usd > 0

    if (!is_profitable) {
      warnings.push('❌ 赤字のため出品不可')
    }

    if (profit_margin < targetProfitRate - 0.05) {
      warnings.push(
        `⚠️ 目標利益率${(targetProfitRate * 100).toFixed(1)}%に対し${(profit_margin * 100).toFixed(1)}%`
      )
    }

    // 11. ログ出力
    console.log(`\n💰 価格計算実行 [${input.marketplace_id}]`)
    console.log(`原価: ¥${input.cost_jpy} = $${cost_usd.toFixed(2)}`)
    console.log(`送料: $${shipping_cost_usd.toFixed(2)}`)
    console.log(`販売価格: $${selling_price_usd.toFixed(2)}`)
    console.log(`利益: $${profit_usd.toFixed(2)} (${(profit_margin * 100).toFixed(1)}%)`)

    // 12. 結果を返す
    return {
      selling_price_usd: Math.round(selling_price_usd * 100) / 100,
      cost_jpy: input.cost_jpy,
      cost_usd: Math.round(cost_usd * 100) / 100,
      shipping_cost_usd: Math.round(shipping_cost_usd * 100) / 100,
      ebay_fee_usd: Math.round(ebay_fee_usd * 100) / 100,
      paypal_fee_usd: Math.round(paypal_fee_usd * 100) / 100,
      tax_usd: Math.round(tax_usd * 100) / 100,
      total_costs_usd: Math.round(total_costs_usd * 100) / 100,
      profit_usd: Math.round(profit_usd * 100) / 100,
      profit_jpy: Math.round(profit_jpy),
      profit_margin: Math.round(profit_margin * 10000) / 10000,
      is_profitable,
      warnings,
      debug: {
        exchange_rate: exchangeRate,
        ebay_fee_rate: ebayFeeRate,
        paypal_fee_rate: paypalFeeRate,
        target_profit_rate: targetProfitRate,
      }
    }
  }

  /**
   * 送料計算（JPY）- n8nロジックの完全移植
   */
  private calculateShippingJPY(weight_g: number): number {
    const weight_kg = weight_g / 1000

    if (weight_kg <= 0.5) {
      return 1200
    } else if (weight_kg <= 1.0) {
      return 1800
    } else {
      return 2200 + (weight_kg - 1) * 700
    }
  }

  /**
   * 複数マーケットプレイスの価格を一括計算
   */
  async calculateBulk(inputs: PricingInput[]): Promise<PricingResult[]> {
    const results: PricingResult[] = []

    for (const input of inputs) {
      try {
        const result = await this.calculate(input)
        results.push(result)
      } catch (error) {
        console.error(`Failed to calculate pricing for ${input.marketplace_id}:`, error)
      }
    }

    return results
  }
}

// シングルトンインスタンスをエクスポート
export const integratedPricingServiceV2 = new IntegratedPricingServiceV2()
