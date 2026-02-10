/**
 * バリエーション/セット商品用 DDP計算エンジン
 * 
 * 既存の usa-price-calculator-v2.ts を活用し、
 * バリエーションとセット商品に特化した計算ロジックを提供
 * 
 * @author Claude
 * @date 2025-11-28
 */

import { calculateUsaPriceV2, UsaPricingResultV2 } from './usa-price-calculator-v2'

// =====================================
// 型定義
// =====================================

export interface VariationProduct {
  id: string
  sku: string
  product_name: string
  cost_price: number       // USD
  selling_price?: number   // USD
  weight_g: number
  hts_code?: string
  origin_country?: string
  category?: string
}

export interface VariationCalculationResult {
  productId: string
  productName: string
  sku: string
  weightG: number
  costUSD: number
  
  // DDP計算結果
  ddpTotal: number          // DDP総コスト
  tariffRate: number        // 関税率（%）
  tariffAmount: number      // 関税額
  mpf: number               // MPF
  hmf: number               // HMF
  ddpServiceFee: number     // 通関手数料
  
  // 配送関連
  baseShipping: number      // 実送料
  totalShipping: number     // 表示送料（DDP込み）
  shippingSurcharge: number // 送料サーチャージ（基準との差）
  
  // 推奨価格
  recommendedProductPrice: number
  recommendedTotal: number
  profitMargin: number
  
  // 配送ポリシー
  policyName: string
  
  // 計算成功フラグ
  success: boolean
  error?: string
  calculationMethod: string
}

export interface VariationGroupResult {
  parentSkuName: string
  basePrice: number           // 基準価格（最小DDP商品の価格）
  baseProductId: string       // 基準商品のID
  children: VariationCalculationResult[]
  
  // 集計情報
  totalProducts: number
  successCount: number
  errorCount: number
  maxSurcharge: number
  hasHighRisk: boolean        // $50以上のサーチャージがある
  
  // 計算サマリー
  avgProfitMargin: number
  totalEstimatedRevenue: number
}

export interface SetProductCalculationResult {
  success: boolean
  error?: string
  
  // 構成情報
  componentCount: number
  totalCostUSD: number
  totalWeightG: number
  
  // DDP計算結果
  ddpTotal: number
  tariffRate: number
  tariffAmount: number
  mpf: number
  hmf: number
  ddpServiceFee: number
  
  // 推奨価格
  recommendedProductPrice: number
  recommendedShipping: number
  recommendedTotal: number
  profitMargin: number
  profitUSD: number
  
  // 配送ポリシー
  policyName: string
  
  // 計算ステップ（デバッグ用）
  calculationSteps: Array<{
    step: string
    value: string
    description: string
  }>
}

// =====================================
// 定数
// =====================================

const DEFAULT_EXCHANGE_RATE = 154.32
const DEFAULT_FVF_RATE = 0.1315
const DDP_SERVICE_FEE = 15

// =====================================
// ヘルパー関数
// =====================================

/**
 * 重量から推定送料を計算（フォールバック用）
 */
function estimateShippingByWeight(weightG: number): number {
  if (weightG < 500) return 12
  if (weightG < 1000) return 15
  if (weightG < 2000) return 22
  if (weightG < 3000) return 28
  if (weightG < 5000) return 38
  return 50
}

/**
 * カテゴリからデフォルトHTSコードを推定
 */
function getDefaultHtsCode(category?: string): string {
  const categoryMap: Record<string, string> = {
    'Toys & Hobbies': '9503.00.00',
    'Collectibles': '9705.00.00',
    'Sports Mem, Cards & Fan Shop': '4911.91.30',
    'Video Games & Consoles': '9504.50.00',
    'Electronics': '8471.30.00',
    'Clothing, Shoes & Accessories': '6109.10.00',
    'Jewelry & Watches': '7113.19.50',
  }
  return categoryMap[category || ''] || '9503.00.00'
}

// =====================================
// メイン計算関数
// =====================================

/**
 * 単一商品のDDP計算
 * 既存の calculateUsaPriceV2 をラップ
 */
export async function calculateSingleProductDDP(
  product: VariationProduct,
  exchangeRate: number = DEFAULT_EXCHANGE_RATE
): Promise<VariationCalculationResult> {
  const startTime = Date.now()
  
  console.log(`🧮 [Variation] 単一商品DDP計算開始: ${product.sku}`)
  
  try {
    // コストをJPYに変換（既存エンジンはJPY入力）
    const costJPY = product.cost_price * exchangeRate
    const weightKg = product.weight_g / 1000
    const hsCode = product.hts_code || getDefaultHtsCode(product.category)
    const originCountry = product.origin_country || 'JP'
    
    console.log(`  📦 入力: コスト$${product.cost_price} (¥${costJPY.toFixed(0)}), 重量${weightKg}kg, HTS:${hsCode}, 原産国:${originCountry}`)
    
    // 既存の計算エンジンを呼び出し
    const result = await calculateUsaPriceV2({
      costJPY,
      weight_kg: weightKg,
      targetMargin: 0.10,  // バリエーション用は低マージン
      hsCode,
      originCountry,
      storeType: 'none',
      fvfRate: DEFAULT_FVF_RATE,
      exchangeRate
    })
    
    if (!result.success) {
      console.error(`  ❌ 計算失敗: ${result.error}`)
      return {
        productId: product.id,
        productName: product.product_name,
        sku: product.sku,
        weightG: product.weight_g,
        costUSD: product.cost_price,
        ddpTotal: 0,
        tariffRate: 0,
        tariffAmount: 0,
        mpf: 0,
        hmf: 0,
        ddpServiceFee: DDP_SERVICE_FEE,
        baseShipping: estimateShippingByWeight(product.weight_g),
        totalShipping: 0,
        shippingSurcharge: 0,
        recommendedProductPrice: 0,
        recommendedTotal: 0,
        profitMargin: 0,
        policyName: 'N/A',
        success: false,
        error: result.error,
        calculationMethod: 'error'
      }
    }
    
    const elapsed = Date.now() - startTime
    console.log(`  ✅ 計算完了 (${elapsed}ms): DDP=$${result.ddpTotal.toFixed(2)}, 推奨価格=$${result.productPrice}`)
    
    return {
      productId: product.id,
      productName: product.product_name,
      sku: product.sku,
      weightG: product.weight_g,
      costUSD: product.cost_price,
      ddpTotal: result.ddpTotal,
      tariffRate: result.tariffRate * 100,
      tariffAmount: result.tariffAmount,
      mpf: result.mpf,
      hmf: result.hmf,
      ddpServiceFee: result.ddpServiceFee,
      baseShipping: result.shippingCost,
      totalShipping: result.shipping,
      shippingSurcharge: 0,  // 後でグループ計算時に設定
      recommendedProductPrice: result.productPrice,
      recommendedTotal: result.totalRevenue,
      profitMargin: result.profitMargin_NoRefund * 100,
      policyName: result.policy?.name || 'Unknown',
      success: true,
      calculationMethod: 'usa-price-calculator-v2'
    }
    
  } catch (error: any) {
    console.error(`  ❌ 例外エラー: ${error.message}`)
    
    // フォールバック: 簡易計算
    const fallbackShipping = estimateShippingByWeight(product.weight_g)
    const fallbackTariff = product.cost_price * 0.05  // 5%フォールバック
    const fallbackDDP = fallbackTariff + (product.cost_price * 0.003464) + DDP_SERVICE_FEE
    
    return {
      productId: product.id,
      productName: product.product_name,
      sku: product.sku,
      weightG: product.weight_g,
      costUSD: product.cost_price,
      ddpTotal: fallbackDDP,
      tariffRate: 5,
      tariffAmount: fallbackTariff,
      mpf: product.cost_price * 0.003464,
      hmf: 0,
      ddpServiceFee: DDP_SERVICE_FEE,
      baseShipping: fallbackShipping,
      totalShipping: fallbackShipping + fallbackDDP,
      shippingSurcharge: 0,
      recommendedProductPrice: product.cost_price * 1.5,
      recommendedTotal: product.cost_price * 1.5 + fallbackShipping + fallbackDDP,
      profitMargin: 10,
      policyName: 'Fallback',
      success: true,
      error: `フォールバック計算使用: ${error.message}`,
      calculationMethod: 'fallback'
    }
  }
}

/**
 * バリエーショングループの計算
 * 複数商品を計算し、最小DDPを基準価格として設定
 */
export async function calculateVariationGroup(
  products: VariationProduct[],
  parentSkuName: string,
  exchangeRate: number = DEFAULT_EXCHANGE_RATE
): Promise<VariationGroupResult> {
  console.log(`\n🎯 ============ バリエーショングループ計算開始 ============`)
  console.log(`📦 商品数: ${products.length}, 親SKU: ${parentSkuName}`)
  
  if (products.length < 2) {
    console.error('❌ バリエーションには2商品以上が必要です')
    return {
      parentSkuName,
      basePrice: 0,
      baseProductId: '',
      children: [],
      totalProducts: products.length,
      successCount: 0,
      errorCount: products.length,
      maxSurcharge: 0,
      hasHighRisk: false,
      avgProfitMargin: 0,
      totalEstimatedRevenue: 0
    }
  }
  
  // 各商品を並列計算
  const results = await Promise.all(
    products.map(product => calculateSingleProductDDP(product, exchangeRate))
  )
  
  // 成功した計算のみフィルタ
  const successResults = results.filter(r => r.success && r.ddpTotal > 0)
  const errorResults = results.filter(r => !r.success || r.ddpTotal === 0)
  
  if (successResults.length === 0) {
    console.error('❌ すべての計算が失敗しました')
    return {
      parentSkuName,
      basePrice: 0,
      baseProductId: '',
      children: results,
      totalProducts: products.length,
      successCount: 0,
      errorCount: products.length,
      maxSurcharge: 0,
      hasHighRisk: false,
      avgProfitMargin: 0,
      totalEstimatedRevenue: 0
    }
  }
  
  // 最小DDPコストを基準価格として特定
  const minDDP = Math.min(...successResults.map(r => r.ddpTotal))
  const baseProduct = successResults.find(r => r.ddpTotal === minDDP)!
  
  console.log(`\n📊 基準商品: ${baseProduct.sku} (DDP: $${minDDP.toFixed(2)})`)
  
  // 各商品のサーチャージを計算
  const updatedResults = results.map(result => ({
    ...result,
    shippingSurcharge: result.success ? Math.max(0, result.ddpTotal - minDDP) : 0
  }))
  
  // 集計
  const maxSurcharge = Math.max(...updatedResults.map(r => r.shippingSurcharge))
  const hasHighRisk = maxSurcharge > 50
  const avgProfitMargin = successResults.reduce((sum, r) => sum + r.profitMargin, 0) / successResults.length
  const totalEstimatedRevenue = successResults.reduce((sum, r) => sum + r.recommendedTotal, 0)
  
  console.log(`\n📈 集計結果:`)
  console.log(`  - 成功: ${successResults.length}件, 失敗: ${errorResults.length}件`)
  console.log(`  - 基準価格: $${baseProduct.recommendedProductPrice}`)
  console.log(`  - 最大サーチャージ: $${maxSurcharge.toFixed(2)}`)
  console.log(`  - 平均利益率: ${avgProfitMargin.toFixed(1)}%`)
  console.log(`  - 推定総売上: $${totalEstimatedRevenue.toFixed(2)}`)
  
  if (hasHighRisk) {
    console.warn(`⚠️ 高リスク警告: サーチャージが$50を超える商品があります`)
  }
  
  console.log(`🎯 ============ バリエーショングループ計算完了 ============\n`)
  
  return {
    parentSkuName,
    basePrice: baseProduct.recommendedProductPrice,
    baseProductId: baseProduct.productId,
    children: updatedResults,
    totalProducts: products.length,
    successCount: successResults.length,
    errorCount: errorResults.length,
    maxSurcharge,
    hasHighRisk,
    avgProfitMargin,
    totalEstimatedRevenue
  }
}

/**
 * セット商品の価格計算
 * 構成商品のコストを合算し、適正価格を算出
 */
export async function calculateSetProductPrice(
  components: Array<{
    product: VariationProduct
    quantity: number
  }>,
  targetMargin: number = 0.20,
  exchangeRate: number = DEFAULT_EXCHANGE_RATE
): Promise<SetProductCalculationResult> {
  console.log(`\n📦 ============ セット商品価格計算開始 ============`)
  console.log(`📦 構成商品数: ${components.length}, 目標マージン: ${(targetMargin * 100).toFixed(0)}%`)
  
  const calculationSteps: Array<{step: string, value: string, description: string}> = []
  
  try {
    // 構成商品の合計を計算
    let totalCostUSD = 0
    let totalWeightG = 0
    let primaryHtsCode = ''
    let primaryOriginCountry = 'JP'
    
    for (const { product, quantity } of components) {
      totalCostUSD += (product.cost_price || 0) * quantity
      totalWeightG += (product.weight_g || 500) * quantity
      
      // 最も高価な商品のHTSを使用（代表値）
      if (!primaryHtsCode || (product.cost_price || 0) > totalCostUSD / components.length) {
        primaryHtsCode = product.hts_code || getDefaultHtsCode(product.category)
        primaryOriginCountry = product.origin_country || 'JP'
      }
    }
    
    calculationSteps.push({
      step: 'STEP 1',
      value: `$${totalCostUSD.toFixed(2)}`,
      description: `構成商品合計コスト（${components.length}種類）`
    })
    
    calculationSteps.push({
      step: 'STEP 2',
      value: `${totalWeightG}g`,
      description: `構成商品合計重量`
    })
    
    console.log(`  💰 合計コスト: $${totalCostUSD.toFixed(2)}`)
    console.log(`  ⚖️ 合計重量: ${totalWeightG}g`)
    console.log(`  📋 代表HTS: ${primaryHtsCode}, 原産国: ${primaryOriginCountry}`)
    
    // JPYに変換
    const totalCostJPY = totalCostUSD * exchangeRate
    const weightKg = totalWeightG / 1000
    
    // 既存の計算エンジンを呼び出し
    const result = await calculateUsaPriceV2({
      costJPY: totalCostJPY,
      weight_kg: weightKg,
      targetMargin,
      hsCode: primaryHtsCode,
      originCountry: primaryOriginCountry,
      storeType: 'none',
      fvfRate: DEFAULT_FVF_RATE,
      exchangeRate
    })
    
    if (!result.success) {
      console.error(`  ❌ 計算失敗: ${result.error}`)
      
      // フォールバック計算
      const fallbackPrice = Math.ceil(totalCostUSD * 1.5)
      const fallbackShipping = estimateShippingByWeight(totalWeightG)
      
      return {
        success: false,
        error: result.error,
        componentCount: components.length,
        totalCostUSD,
        totalWeightG,
        ddpTotal: 0,
        tariffRate: 0,
        tariffAmount: 0,
        mpf: 0,
        hmf: 0,
        ddpServiceFee: DDP_SERVICE_FEE,
        recommendedProductPrice: fallbackPrice,
        recommendedShipping: fallbackShipping,
        recommendedTotal: fallbackPrice + fallbackShipping,
        profitMargin: 0,
        profitUSD: 0,
        policyName: 'Fallback',
        calculationSteps
      }
    }
    
    calculationSteps.push({
      step: 'STEP 3',
      value: `${(result.tariffRate * 100).toFixed(2)}%`,
      description: `関税率 (HTS: ${primaryHtsCode}, 原産国: ${primaryOriginCountry})`
    })
    
    calculationSteps.push({
      step: 'STEP 4',
      value: `$${result.ddpTotal.toFixed(2)}`,
      description: `DDP合計 = 関税$${result.tariffAmount.toFixed(2)} + MPF$${result.mpf.toFixed(2)} + 手数料$${result.ddpServiceFee.toFixed(2)}`
    })
    
    calculationSteps.push({
      step: 'STEP 5',
      value: `$${result.productPrice} + $${result.shipping.toFixed(2)} = $${result.totalRevenue.toFixed(2)}`,
      description: `推奨販売価格 (利益率: ${(result.profitMargin_NoRefund * 100).toFixed(1)}%)`
    })
    
    console.log(`\n  ✅ 計算完了:`)
    console.log(`    - 推奨商品価格: $${result.productPrice}`)
    console.log(`    - 推奨送料: $${result.shipping.toFixed(2)}`)
    console.log(`    - 推奨合計: $${result.totalRevenue.toFixed(2)}`)
    console.log(`    - 利益率: ${(result.profitMargin_NoRefund * 100).toFixed(1)}%`)
    console.log(`    - 利益額: $${result.profitUSD_NoRefund.toFixed(2)}`)
    
    console.log(`📦 ============ セット商品価格計算完了 ============\n`)
    
    return {
      success: true,
      componentCount: components.length,
      totalCostUSD,
      totalWeightG,
      ddpTotal: result.ddpTotal,
      tariffRate: result.tariffRate * 100,
      tariffAmount: result.tariffAmount,
      mpf: result.mpf,
      hmf: result.hmf,
      ddpServiceFee: result.ddpServiceFee,
      recommendedProductPrice: result.productPrice,
      recommendedShipping: result.shipping,
      recommendedTotal: result.totalRevenue,
      profitMargin: result.profitMargin_NoRefund * 100,
      profitUSD: result.profitUSD_NoRefund,
      policyName: result.policy?.name || 'Unknown',
      calculationSteps
    }
    
  } catch (error: any) {
    console.error(`  ❌ 例外エラー: ${error.message}`)
    
    // フォールバック
    const totalCostUSD = components.reduce((sum, c) => sum + (c.product.cost_price || 0) * c.quantity, 0)
    const totalWeightG = components.reduce((sum, c) => sum + (c.product.weight_g || 500) * c.quantity, 0)
    const fallbackPrice = Math.ceil(totalCostUSD * 1.5)
    const fallbackShipping = estimateShippingByWeight(totalWeightG)
    
    return {
      success: false,
      error: error.message,
      componentCount: components.length,
      totalCostUSD,
      totalWeightG,
      ddpTotal: 0,
      tariffRate: 0,
      tariffAmount: 0,
      mpf: 0,
      hmf: 0,
      ddpServiceFee: DDP_SERVICE_FEE,
      recommendedProductPrice: fallbackPrice,
      recommendedShipping: fallbackShipping,
      recommendedTotal: fallbackPrice + fallbackShipping,
      profitMargin: 0,
      profitUSD: 0,
      policyName: 'Error Fallback',
      calculationSteps
    }
  }
}

/**
 * テスト用: サンプルデータでバリエーション計算をテスト
 */
export async function testVariationCalculation(): Promise<{
  success: boolean
  message: string
  result?: VariationGroupResult
}> {
  console.log('\n🧪 ============ バリエーション計算テスト ============')
  
  const testProducts: VariationProduct[] = [
    {
      id: 'test-1',
      sku: 'TEST-CARD-001',
      product_name: 'Pokemon Card Booster Pack',
      cost_price: 30,
      weight_g: 100,
      hts_code: '4911.91.30',
      origin_country: 'JP',
      category: 'Collectibles'
    },
    {
      id: 'test-2',
      sku: 'TEST-CARD-002',
      product_name: 'Yu-Gi-Oh Card Booster Pack',
      cost_price: 25,
      weight_g: 100,
      hts_code: '4911.91.30',
      origin_country: 'JP',
      category: 'Collectibles'
    },
    {
      id: 'test-3',
      sku: 'TEST-CARD-003',
      product_name: 'MTG Card Booster Pack',
      cost_price: 35,
      weight_g: 120,
      hts_code: '4911.91.30',
      origin_country: 'JP',
      category: 'Collectibles'
    }
  ]
  
  try {
    const result = await calculateVariationGroup(testProducts, 'VAR-CARDS-TEST')
    
    console.log('\n🧪 ============ テスト結果 ============')
    console.log(`成功: ${result.successCount}/${result.totalProducts}`)
    console.log(`基準価格: $${result.basePrice}`)
    console.log(`最大サーチャージ: $${result.maxSurcharge.toFixed(2)}`)
    
    return {
      success: result.successCount > 0,
      message: `${result.successCount}/${result.totalProducts}商品の計算に成功`,
      result
    }
  } catch (error: any) {
    return {
      success: false,
      message: `テスト失敗: ${error.message}`
    }
  }
}

/**
 * テスト用: サンプルデータでセット計算をテスト
 */
export async function testSetCalculation(): Promise<{
  success: boolean
  message: string
  result?: SetProductCalculationResult
}> {
  console.log('\n🧪 ============ セット商品計算テスト ============')
  
  const testComponents = [
    {
      product: {
        id: 'test-game-1',
        sku: 'TEST-GAME-001',
        product_name: 'Nintendo Switch Game',
        cost_price: 40,
        weight_g: 100,
        hts_code: '9504.50.00',
        origin_country: 'JP',
        category: 'Video Games & Consoles'
      },
      quantity: 1
    },
    {
      product: {
        id: 'test-game-2',
        sku: 'TEST-GAME-002',
        product_name: 'PS5 Game',
        cost_price: 50,
        weight_g: 80,
        hts_code: '9504.50.00',
        origin_country: 'JP',
        category: 'Video Games & Consoles'
      },
      quantity: 1
    }
  ]
  
  try {
    const result = await calculateSetProductPrice(testComponents, 0.20)
    
    console.log('\n🧪 ============ テスト結果 ============')
    console.log(`推奨価格: $${result.recommendedTotal.toFixed(2)}`)
    console.log(`利益率: ${result.profitMargin.toFixed(1)}%`)
    
    return {
      success: result.success,
      message: result.success 
        ? `計算成功: 推奨価格$${result.recommendedTotal.toFixed(2)}` 
        : `計算失敗: ${result.error}`,
      result
    }
  } catch (error: any) {
    return {
      success: false,
      message: `テスト失敗: ${error.message}`
    }
  }
}
