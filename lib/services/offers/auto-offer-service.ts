/**
 * 自動オファー計算サービス
 */

export interface AutoOfferCalculation {
  suggestedPrice: number
  minAcceptablePrice: number
  maxDiscountPercent: number
  profitMargin: number
}

export interface AutoOfferParams {
  listingPrice: number
  costPrice: number
  minProfitMargin?: number
  maxDiscountPercent?: number
}

class AutoOfferService {
  private defaultMinProfitMargin = 10 // 最低10%の利益
  private defaultMaxDiscount = 20 // 最大20%割引

  /**
   * 自動オファー価格を計算
   */
  calculate(params: AutoOfferParams): AutoOfferCalculation {
    const {
      listingPrice,
      costPrice,
      minProfitMargin = this.defaultMinProfitMargin,
      maxDiscountPercent = this.defaultMaxDiscount
    } = params

    // 最低受け入れ可能価格（原価 + 最低利益）
    const minAcceptablePrice = costPrice * (1 + minProfitMargin / 100)

    // 提案価格（リスト価格の10%引き程度）
    const suggestedPrice = Math.max(
      listingPrice * 0.9,
      minAcceptablePrice
    )

    // 利益率
    const profitMargin = suggestedPrice > 0
      ? ((suggestedPrice - costPrice) / suggestedPrice) * 100
      : 0

    return {
      suggestedPrice: Math.round(suggestedPrice * 100) / 100,
      minAcceptablePrice: Math.round(minAcceptablePrice * 100) / 100,
      maxDiscountPercent,
      profitMargin: Math.round(profitMargin * 10) / 10
    }
  }

  /**
   * オファーを受け入れるべきか判断
   */
  shouldAcceptOffer(
    offerPrice: number,
    costPrice: number,
    minProfitMargin: number = this.defaultMinProfitMargin
  ): boolean {
    const minAcceptable = costPrice * (1 + minProfitMargin / 100)
    return offerPrice >= minAcceptable
  }
}

export const autoOfferService = new AutoOfferService()
