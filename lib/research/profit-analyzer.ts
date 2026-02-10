/**
 * 利益分析・最安値分析
 */

export interface CompetitorData {
  price: number
  soldCount: number
  seller: string
  condition: string
}

export interface LowestPriceAnalysis {
  lowestPrice: number
  averagePrice: number
  medianPrice: number
  competitorCount: number
  priceRange: {
    min: number
    max: number
  }
}

/**
 * 最安値を分析
 */
export function analyzeLowestPrice(competitors: CompetitorData[]): LowestPriceAnalysis {
  if (!competitors || competitors.length === 0) {
    return {
      lowestPrice: 0,
      averagePrice: 0,
      medianPrice: 0,
      competitorCount: 0,
      priceRange: { min: 0, max: 0 }
    }
  }

  const prices = competitors
    .map(c => c.price)
    .filter(p => p > 0)
    .sort((a, b) => a - b)

  if (prices.length === 0) {
    return {
      lowestPrice: 0,
      averagePrice: 0,
      medianPrice: 0,
      competitorCount: 0,
      priceRange: { min: 0, max: 0 }
    }
  }

  const sum = prices.reduce((a, b) => a + b, 0)
  const average = sum / prices.length
  const median = prices.length % 2 === 0
    ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2
    : prices[Math.floor(prices.length / 2)]

  return {
    lowestPrice: prices[0],
    averagePrice: Math.round(average * 100) / 100,
    medianPrice: median,
    competitorCount: prices.length,
    priceRange: {
      min: prices[0],
      max: prices[prices.length - 1]
    }
  }
}

/**
 * 最安値での利益を計算
 */
export function calculateProfitAtLowestPrice(
  lowestPrice: number,
  costJpy: number,
  weightG: number,
  exchangeRate: number = 150
): {
  profitUsd: number
  profitJpy: number
  profitMargin: number
  breakEvenPrice: number
} {
  // 配送料を概算（重量ベース）
  const shippingCostUsd = estimateShippingCost(weightG)
  
  // eBay手数料（約13%）
  const ebayFee = lowestPrice * 0.13
  
  // PayPal手数料（約3%）
  const paypalFee = lowestPrice * 0.03
  
  // 仕入れ原価（USD換算）
  const costUsd = costJpy / exchangeRate
  
  // 利益計算
  const totalCost = costUsd + shippingCostUsd + ebayFee + paypalFee
  const profitUsd = lowestPrice - totalCost
  const profitJpy = profitUsd * exchangeRate
  const profitMargin = lowestPrice > 0 ? (profitUsd / lowestPrice) * 100 : 0
  
  // 損益分岐点価格
  const breakEvenPrice = totalCost / (1 - 0.16) // 手数料16%を考慮

  return {
    profitUsd: Math.round(profitUsd * 100) / 100,
    profitJpy: Math.round(profitJpy),
    profitMargin: Math.round(profitMargin * 10) / 10,
    breakEvenPrice: Math.round(breakEvenPrice * 100) / 100
  }
}

/**
 * 配送料を概算
 */
function estimateShippingCost(weightG: number): number {
  // 簡易的な配送料計算（日本→US）
  if (weightG <= 100) return 3
  if (weightG <= 500) return 8
  if (weightG <= 1000) return 15
  if (weightG <= 2000) return 25
  return 35
}
