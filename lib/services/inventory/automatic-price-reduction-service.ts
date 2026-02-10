/**
 * 在庫最適化：自動値下げサービス
 *
 * 仕入れ日ベースで段階的に価格を引き下げ、
 * 3ヶ月以内の在庫回転率を実現するロジック
 */

import { InventoryProduct, PricePhase, PriceReductionRecord } from '@/types/inventory'

// ===========================
// 📅 日付計算ユーティリティ
// ===========================

/**
 * 仕入れ日からの経過日数を計算
 */
export function daysSinceAcquisition(dateAcquired: string | null): number {
  if (!dateAcquired) return 0

  const acquired = new Date(dateAcquired)
  const now = new Date()
  const diffTime = now.getTime() - acquired.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * 販売期限までの残り日数を計算
 */
export function daysUntilDeadline(targetDeadline: string | null): number {
  if (!targetDeadline) return 0

  const deadline = new Date(targetDeadline)
  const now = new Date()
  const diffTime = deadline.getTime() - now.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * 仕入れ日から3ヶ月後の期限を計算
 */
export function calculateDefaultDeadline(dateAcquired: string): string {
  const acquired = new Date(dateAcquired)
  const deadline = new Date(acquired)
  deadline.setMonth(deadline.getMonth() + 3)

  return deadline.toISOString().split('T')[0]
}

// ===========================
// 🎯 価格フェーズ判定
// ===========================

/**
 * 経過日数と期限から現在の価格フェーズを判定
 *
 * - NORMAL (0-90日): 通常販売 - 目標利益率を維持
 * - WARNING (91-180日): 警戒販売 - 利益率5%まで引き下げ
 * - LIQUIDATION (181日〜): 損切り実行 - 原価割れでも現金化
 */
export function determinePricePhase(
  dateAcquired: string | null,
  targetDeadline?: string | null
): PricePhase {
  if (!dateAcquired) return 'NORMAL'

  const daysHeld = daysSinceAcquisition(dateAcquired)

  // 経過日数ベースでフェーズを判定
  if (daysHeld <= 90) {
    return 'NORMAL'
  } else if (daysHeld <= 180) {
    return 'WARNING'
  } else {
    return 'LIQUIDATION'
  }
}

/**
 * フェーズの日本語名を取得
 */
export function getPhaseName(phase: PricePhase): string {
  switch (phase) {
    case 'NORMAL':
      return '通常販売'
    case 'WARNING':
      return '警戒販売'
    case 'LIQUIDATION':
      return '損切り実行'
    default:
      return '不明'
  }
}

/**
 * フェーズに応じたバッジの色を取得
 */
export function getPhaseColor(phase: PricePhase): {
  bg: string
  text: string
  border: string
} {
  switch (phase) {
    case 'NORMAL':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200'
      }
    case 'WARNING':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200'
      }
    case 'LIQUIDATION':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200'
      }
  }
}

// ===========================
// 💰 価格計算ロジック
// ===========================

/**
 * フェーズに応じた推奨販売価格を計算
 */
export function calculateRecommendedPrice(
  product: InventoryProduct,
  phase: PricePhase,
  competitivePrice?: number
): number {
  const cogs = product.cogs || product.cost_price || 0
  const currentPrice = product.selling_price || 0

  switch (phase) {
    case 'NORMAL':
      // 通常販売: 目標利益率を維持、競争価格があればそれに追従
      if (competitivePrice && competitivePrice > cogs * 1.10) {
        return competitivePrice
      }
      // 目標利益率15%で計算
      return cogs * 1.15

    case 'WARNING':
      // 警戒販売: 利益率5%まで引き下げ
      return cogs * 1.05

    case 'LIQUIDATION':
      // 損切り実行: 原価の90%まで引き下げて現金化最優先
      return cogs * 0.90

    default:
      return currentPrice
  }
}

/**
 * 利益率を計算
 */
export function calculateProfitMargin(
  sellingPrice: number,
  cogs: number,
  fees: number = 0,
  shipping: number = 0
): number {
  const totalCost = cogs + fees + shipping
  const profit = sellingPrice - totalCost

  if (sellingPrice === 0) return 0

  return (profit / sellingPrice) * 100
}

/**
 * 最終見込み純利益率を計算（手数料・送料・関税込み）
 */
export function calculateFinalProfitMargin(product: InventoryProduct): number {
  const sellingPrice = product.selling_price || 0
  const cogs = product.cogs || product.cost_price || 0

  // eBayの場合は手数料を考慮
  const feeRate = product.marketplace === 'ebay' ? 0.1315 : 0.10
  const fees = sellingPrice * feeRate

  // 送料（仮: 商品価格の10%と仮定）
  const shipping = sellingPrice * 0.10

  return calculateProfitMargin(sellingPrice, cogs, fees, shipping)
}

// ===========================
// ⚠️ アラート判定
// ===========================

/**
 * アラートが必要かどうかを判定
 */
export function shouldAlert(product: InventoryProduct): {
  shouldAlert: boolean
  level: 'warning' | 'danger' | null
  reason: string
} {
  const daysHeld = daysSinceAcquisition(product.date_acquired || null)
  const phase = product.current_price_phase || determinePricePhase(product.date_acquired || null)

  // 4ヶ月（120日）を超えた在庫
  if (daysHeld >= 120 && daysHeld < 180) {
    return {
      shouldAlert: true,
      level: 'warning',
      reason: `警戒フェーズ: 在庫保有${daysHeld}日経過`
    }
  }

  // 損切りフェーズに到達した在庫
  if (phase === 'LIQUIDATION' || daysHeld >= 180) {
    return {
      shouldAlert: true,
      level: 'danger',
      reason: `損切り実行: 在庫保有${daysHeld}日経過（原価割れで現金化中）`
    }
  }

  return {
    shouldAlert: false,
    level: null,
    reason: ''
  }
}

/**
 * 全商品から警告対象を抽出
 */
export function getAlertProducts(products: InventoryProduct[]): {
  warning: InventoryProduct[]
  danger: InventoryProduct[]
} {
  const warning: InventoryProduct[] = []
  const danger: InventoryProduct[] = []

  for (const product of products) {
    const alert = shouldAlert(product)

    if (alert.shouldAlert) {
      if (alert.level === 'warning') {
        warning.push(product)
      } else if (alert.level === 'danger') {
        danger.push(product)
      }
    }
  }

  return { warning, danger }
}

// ===========================
// 🔄 自動値下げ実行
// ===========================

/**
 * 単一商品の値下げを実行（ドライラン可能）
 */
export function executePriceReduction(
  product: InventoryProduct,
  dryRun: boolean = false
): {
  shouldUpdate: boolean
  newPhase: PricePhase
  newPrice: number
  reduction: PriceReductionRecord | null
} {
  const currentPhase = product.current_price_phase || 'NORMAL'
  const newPhase = determinePricePhase(product.date_acquired || null, product.target_sale_deadline || null)

  // フェーズに変更がない場合はスキップ
  if (currentPhase === newPhase) {
    return {
      shouldUpdate: false,
      newPhase: currentPhase,
      newPrice: product.selling_price || 0,
      reduction: null
    }
  }

  // 新しい価格を計算
  const newPrice = calculateRecommendedPrice(product, newPhase)
  const oldPrice = product.selling_price || 0

  // 値下げ履歴レコードを作成
  const reduction: PriceReductionRecord = {
    date: new Date().toISOString(),
    old_price: oldPrice,
    new_price: newPrice,
    phase: newPhase,
    reason: `フェーズ変更: ${getPhaseName(currentPhase)} → ${getPhaseName(newPhase)}`,
    auto_executed: !dryRun
  }

  return {
    shouldUpdate: true,
    newPhase,
    newPrice,
    reduction
  }
}

/**
 * 複数商品の一括値下げ実行
 */
export async function batchPriceReduction(
  products: InventoryProduct[],
  dryRun: boolean = false
): Promise<{
  processed: number
  updated: number
  skipped: number
  reductions: Array<{
    productId: string
    productName: string
    result: ReturnType<typeof executePriceReduction>
  }>
}> {
  let processed = 0
  let updated = 0
  let skipped = 0
  const reductions: Array<{
    productId: string
    productName: string
    result: ReturnType<typeof executePriceReduction>
  }> = []

  for (const product of products) {
    processed++

    const result = executePriceReduction(product, dryRun)

    if (result.shouldUpdate) {
      updated++
      reductions.push({
        productId: product.id,
        productName: product.product_name,
        result
      })
    } else {
      skipped++
    }
  }

  return {
    processed,
    updated,
    skipped,
    reductions
  }
}

// ===========================
// 📊 統計計算
// ===========================

/**
 * 在庫最適化の統計情報を計算
 */
export function calculateInventoryOptimizationStats(products: InventoryProduct[]) {
  let warningCount = 0
  let liquidationCount = 0
  let totalDaysHeld = 0
  let productsWithDates = 0
  let rotation90Count = 0
  let investment10Count = 0

  for (const product of products) {
    // フェーズ別カウント
    const phase = product.current_price_phase || determinePricePhase(product.date_acquired || null)
    if (phase === 'WARNING') warningCount++
    if (phase === 'LIQUIDATION') liquidationCount++

    // 平均在庫日数計算
    if (product.date_acquired) {
      totalDaysHeld += daysSinceAcquisition(product.date_acquired)
      productsWithDates++
    }

    // 在庫タイプ別カウント
    if (product.inventory_type === 'ROTATION_90_DAYS') rotation90Count++
    if (product.inventory_type === 'INVESTMENT_10_PERCENT') investment10Count++
  }

  const avgDaysHeld = productsWithDates > 0 ? Math.round(totalDaysHeld / productsWithDates) : 0

  return {
    warning_inventory: warningCount,
    liquidation_inventory: liquidationCount,
    avg_days_held: avgDaysHeld,
    rotation_90_count: rotation90Count,
    investment_10_count: investment10Count
  }
}
