/**
 * 自動承認エンジン
 * 商品データを評価し、設定に基づいて自動承認/却下を判定
 */

import {
  AutoApprovalSettings,
  AutoApprovalLevel,
  EvaluationResult,
  EvaluationChecks,
  AutoApprovalAction,
  ProductForApproval,
  PriceRange,
} from '@/types/automation'

// デフォルト設定
export const DEFAULT_AUTO_APPROVAL_SETTINGS: Omit<AutoApprovalSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  enabled: false,
  auto_approval_level: 'conservative',
  min_seo_score: 70,
  min_ai_confidence: 0.80,
  min_profit_margin: 10.00,
  required_fields: ['title_en', 'ddp_price_usd', 'category_name', 'primary_image_url'],
  excluded_categories: [],
  excluded_price_ranges: [],
  notification_on_approval: true,
  notification_on_rejection: true,
  daily_summary_email: false,
}

/**
 * 商品の自動承認評価を行う
 */
export function evaluateForAutoApproval(
  product: ProductForApproval,
  settings: AutoApprovalSettings
): EvaluationResult {
  // 自動承認が無効の場合
  if (!settings.enabled) {
    return {
      decision: 'manual_required',
      score: 0,
      checks: createEmptyChecks(),
      reason: '自動承認が無効です',
    }
  }

  // 各条件のチェック
  const checks = performChecks(product, settings)

  // 判定ロジック（レベル別）
  const { decision, reason } = determineDecision(checks, settings.auto_approval_level)

  // スコア計算
  const score = calculateApprovalScore(checks)

  return { decision, score, checks, reason }
}

/**
 * 各条件のチェックを実行
 */
function performChecks(
  product: ProductForApproval,
  settings: AutoApprovalSettings
): EvaluationChecks {
  // SEOスコアチェック
  const seoScore = product.seo_health_score ?? product.listing_score ?? 0
  const seo_score = {
    value: seoScore,
    required: settings.min_seo_score,
    passed: seoScore >= settings.min_seo_score,
  }

  // AI信頼度チェック
  const aiConfidence = product.ai_confidence_score ?? 0
  const ai_confidence = {
    value: aiConfidence,
    required: settings.min_ai_confidence,
    passed: aiConfidence >= settings.min_ai_confidence,
  }

  // 利益率チェック
  const profitMargin = product.profit_margin_percent ?? 0
  const profit_margin = {
    value: profitMargin,
    required: settings.min_profit_margin,
    passed: profitMargin >= settings.min_profit_margin,
  }

  // 必須フィールドチェック
  const missingFields = settings.required_fields.filter(field => {
    const value = getFieldValue(product, field)
    return value === null || value === undefined || value === ''
  })
  const required_fields = {
    missing: missingFields,
    passed: missingFields.length === 0,
  }

  // 除外条件チェック
  const exclusions = checkExclusions(product, settings)

  return {
    seo_score,
    ai_confidence,
    profit_margin,
    required_fields,
    exclusions,
  }
}

/**
 * 商品フィールドの値を取得
 */
function getFieldValue(product: ProductForApproval, field: string): unknown {
  const fieldMap: Record<string, unknown> = {
    title: product.title,
    title_en: product.title_en,
    ddp_price_usd: product.ddp_price_usd,
    category_name: product.category_name,
    primary_image_url: product.primary_image_url,
    images: product.images?.length ? product.images : null,
    sku: product.sku,
    seo_health_score: product.seo_health_score,
    ai_confidence_score: product.ai_confidence_score,
    profit_margin_percent: product.profit_margin_percent,
    recommended_platform: product.recommended_platform,
  }

  return fieldMap[field]
}

/**
 * 除外条件のチェック
 */
function checkExclusions(
  product: ProductForApproval,
  settings: AutoApprovalSettings
): { matched: string[]; passed: boolean } {
  const matched: string[] = []

  // カテゴリ除外チェック
  if (product.category_name && settings.excluded_categories.includes(product.category_name)) {
    matched.push(`カテゴリ: ${product.category_name}`)
  }

  // 価格帯除外チェック
  const price = product.ddp_price_usd ?? 0
  for (const range of settings.excluded_price_ranges) {
    if (isInPriceRange(price, range)) {
      matched.push(`価格帯: $${range.min}-${range.max ?? '∞'}`)
    }
  }

  return {
    matched,
    passed: matched.length === 0,
  }
}

/**
 * 価格が範囲内かチェック
 */
function isInPriceRange(price: number, range: PriceRange): boolean {
  if (price < range.min) return false
  if (range.max !== null && price > range.max) return false
  return true
}

/**
 * 判定ロジック（レベル別）
 */
function determineDecision(
  checks: EvaluationChecks,
  level: AutoApprovalLevel
): { decision: AutoApprovalAction; reason: string } {
  // 除外条件に該当する場合は即却下
  if (!checks.exclusions.passed) {
    return {
      decision: 'auto_rejected',
      reason: `除外条件に該当: ${checks.exclusions.matched.join(', ')}`,
    }
  }

  // 必須フィールドが欠けている場合
  if (!checks.required_fields.passed) {
    if (level === 'aggressive') {
      return {
        decision: 'auto_rejected',
        reason: `必須フィールド不足: ${checks.required_fields.missing.join(', ')}`,
      }
    }
    return {
      decision: 'manual_required',
      reason: `必須フィールド不足: ${checks.required_fields.missing.join(', ')}`,
    }
  }

  switch (level) {
    case 'conservative': {
      // 全条件必須
      const allPassed =
        checks.seo_score.passed &&
        checks.ai_confidence.passed &&
        checks.profit_margin.passed &&
        checks.required_fields.passed &&
        checks.exclusions.passed

      if (allPassed) {
        return {
          decision: 'auto_approved',
          reason: '全条件クリア（厳格モード）',
        }
      }
      return {
        decision: 'manual_required',
        reason: buildFailureReason(checks),
      }
    }

    case 'moderate': {
      // 必須フィールド + 除外チェックは必須、スコアは2/3でOK
      const scoreChecks = [
        checks.seo_score.passed,
        checks.ai_confidence.passed,
        checks.profit_margin.passed,
      ]
      const passedScores = scoreChecks.filter(Boolean).length

      if (passedScores >= 2) {
        return {
          decision: 'auto_approved',
          reason: `主要条件クリア（中程度モード: ${passedScores}/3スコア通過）`,
        }
      }
      return {
        decision: 'manual_required',
        reason: `スコア条件不足（${passedScores}/3）: ${buildFailureReason(checks)}`,
      }
    }

    case 'aggressive': {
      // 必須フィールドのみ必須（既に上でチェック済み）
      return {
        decision: 'auto_approved',
        reason: '最低条件クリア（積極モード）',
      }
    }

    default:
      return {
        decision: 'manual_required',
        reason: '不明なレベル設定',
      }
  }
}

/**
 * 失敗理由の構築
 */
function buildFailureReason(checks: EvaluationChecks): string {
  const failures: string[] = []

  if (!checks.seo_score.passed) {
    failures.push(`SEO: ${checks.seo_score.value}/${checks.seo_score.required}`)
  }
  if (!checks.ai_confidence.passed) {
    failures.push(`AI信頼度: ${(checks.ai_confidence.value * 100).toFixed(0)}%/${(checks.ai_confidence.required * 100).toFixed(0)}%`)
  }
  if (!checks.profit_margin.passed) {
    failures.push(`利益率: ${checks.profit_margin.value.toFixed(1)}%/${checks.profit_margin.required}%`)
  }
  if (!checks.required_fields.passed) {
    failures.push(`必須フィールド不足: ${checks.required_fields.missing.join(', ')}`)
  }
  if (!checks.exclusions.passed) {
    failures.push(`除外該当: ${checks.exclusions.matched.join(', ')}`)
  }

  return failures.join(' / ')
}

/**
 * 承認スコアの計算（0-100）
 */
function calculateApprovalScore(checks: EvaluationChecks): number {
  let score = 0

  // 各チェックの重み付け
  if (checks.seo_score.passed) score += 25
  if (checks.ai_confidence.passed) score += 25
  if (checks.profit_margin.passed) score += 20
  if (checks.required_fields.passed) score += 20
  if (checks.exclusions.passed) score += 10

  return score
}

/**
 * 空のチェック結果を作成
 */
function createEmptyChecks(): EvaluationChecks {
  return {
    seo_score: { value: 0, required: 0, passed: false },
    ai_confidence: { value: 0, required: 0, passed: false },
    profit_margin: { value: 0, required: 0, passed: false },
    required_fields: { missing: [], passed: false },
    exclusions: { matched: [], passed: false },
  }
}

/**
 * 複数商品のバッチ評価
 */
export function batchEvaluate(
  products: ProductForApproval[],
  settings: AutoApprovalSettings
): Map<string, EvaluationResult> {
  const results = new Map<string, EvaluationResult>()

  for (const product of products) {
    const result = evaluateForAutoApproval(product, settings)
    results.set(product.id, result)
  }

  return results
}

/**
 * 評価結果のサマリーを取得
 */
export function getEvaluationSummary(results: Map<string, EvaluationResult>): {
  total: number
  approved: number
  rejected: number
  manual_required: number
  average_score: number
} {
  let approved = 0
  let rejected = 0
  let manual_required = 0
  let totalScore = 0

  results.forEach((result) => {
    totalScore += result.score

    switch (result.decision) {
      case 'auto_approved':
        approved++
        break
      case 'auto_rejected':
        rejected++
        break
      case 'manual_required':
        manual_required++
        break
    }
  })

  return {
    total: results.size,
    approved,
    rejected,
    manual_required,
    average_score: results.size > 0 ? totalScore / results.size : 0,
  }
}

/**
 * 設定のバリデーション
 */
export function validateSettings(
  settings: Partial<AutoApprovalSettings>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (settings.min_seo_score !== undefined) {
    if (settings.min_seo_score < 0 || settings.min_seo_score > 100) {
      errors.push('SEOスコアは0-100の範囲で指定してください')
    }
  }

  if (settings.min_ai_confidence !== undefined) {
    if (settings.min_ai_confidence < 0 || settings.min_ai_confidence > 1) {
      errors.push('AI信頼度は0-1の範囲で指定してください')
    }
  }

  if (settings.min_profit_margin !== undefined) {
    if (settings.min_profit_margin < -100 || settings.min_profit_margin > 1000) {
      errors.push('利益率は-100%から1000%の範囲で指定してください')
    }
  }

  if (settings.excluded_price_ranges !== undefined) {
    for (const range of settings.excluded_price_ranges) {
      if (range.min < 0) {
        errors.push('価格帯の最小値は0以上で指定してください')
      }
      if (range.max !== null && range.max < range.min) {
        errors.push('価格帯の最大値は最小値以上で指定してください')
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
