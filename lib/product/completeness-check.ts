// lib/product/completeness-check.ts
/**
 * 商品データ完全性チェック
 * 出品に必要な項目が全て揃っているかを判定
 */

import type { Product } from '@/app/tools/editing/types/product';

export interface CompletenessCheckResult {
  /** 全項目が揃っている */
  isComplete: boolean;
  /** 不足項目数 */
  missingCount: number;
  /** 各項目のチェック結果 */
  checks: {
    englishTitle: boolean;
    categoryId: boolean;
    htsCode: boolean;
    originCountry: boolean;
    filterPassed: boolean;
    profitPositive: boolean;
    hasImage: boolean;
    hasPrice: boolean;
    hasHtmlDescription: boolean;
    hasShipping: boolean;
  };
  /** 不足項目のリスト */
  missingItems: string[];
  /** 警告項目（データはあるが確認推奨） */
  warningItems: string[];
  /** 完全性スコア (0-100) */
  completionScore: number;
}

/**
 * 商品の完全性をチェック
 */
export function checkProductCompleteness(product: Product): CompletenessCheckResult {
  // listing_dataからも確認
  const listingData = (product as any)?.listing_data || {};
  
  const checks = {
    englishTitle: !!(
      product.english_title || 
      product.title_en || 
      listingData.english_title
    ),
    categoryId: !!(
      product.category_id || 
      product.ebay_category_id || 
      listingData.category_id || 
      listingData.ebay_category_id
    ),
    htsCode: !!product.hts_code,
    originCountry: !!product.origin_country,
    // フィルター: nullまたはundefinedの場合は警告、falseの場合はエラー
    filterPassed: product.filter_passed !== false,
    profitPositive: (product.profit_margin ?? 0) > 0 || (listingData.profit_margin ?? 0) > 0,
    hasImage: !!(
      product.primary_image_url || 
      product.image_url || 
      (product.images && product.images.length > 0) ||
      listingData.image_urls?.length > 0
    ),
    hasPrice: !!(
      product.ddp_price_usd || 
      product.price_usd || 
      listingData.ddp_price_usd || 
      listingData.price_usd
    ),
    // 🔥 HTMLチェック - 複数フィールドに対応
    hasHtmlDescription: !!(
      product.html_content || 
      product.html_description ||
      listingData.html_description ||
      listingData.html_description_en ||
      listingData.description_html
    ),
    // 🔥 配送ポリシーチェック
    hasShipping: !!(
      product.shipping_policy ||
      listingData.shipping_service ||
      listingData.usa_shipping_policy_name ||
      listingData.carrier_service
    ),
  };

  const missingItems: string[] = [];
  const warningItems: string[] = [];

  // 必須項目のチェック
  if (!checks.englishTitle) missingItems.push('英語タイトル');
  if (!checks.categoryId) missingItems.push('カテゴリーID');
  if (!checks.htsCode) missingItems.push('HTSコード');
  if (!checks.originCountry) missingItems.push('原産国');
  if (!checks.profitPositive) missingItems.push('利益率');
  if (!checks.hasImage) missingItems.push('画像');
  if (!checks.hasPrice) missingItems.push('価格');
  if (!checks.hasHtmlDescription) missingItems.push('HTML Description');
  if (!checks.hasShipping) missingItems.push('配送設定');

  // フィルターは警告扱い（手動確認可能）
  if (!checks.filterPassed) {
    // filter_passed === false の場合のみ警告
    if (product.filter_passed === false) {
      warningItems.push('フィルター未通過（要確認）');
    }
  } else if (product.filter_passed === null || product.filter_passed === undefined) {
    // まだチェックされていない場合
    warningItems.push('フィルター未実行');
  }

  const missingCount = missingItems.length;
  const totalChecks = Object.keys(checks).length;
  const passedChecks = Object.values(checks).filter(v => v).length;
  const completionScore = Math.round((passedChecks / totalChecks) * 100);

  return {
    isComplete: missingCount === 0,
    missingCount,
    checks,
    missingItems,
    warningItems,
    completionScore,
  };
}

/**
 * 商品が承認待ちリストに表示可能か判定
 * 全ての必要データが揃っている場合のみtrue
 */
export function isReadyForApproval(product: Product): boolean {
  return checkProductCompleteness(product).isComplete;
}

/**
 * 商品リストから承認待ち対象のみをフィルタリング
 */
export function filterApprovalReady(products: Product[]): Product[] {
  return products.filter(isReadyForApproval);
}

/**
 * 完全性スコアに基づいて色を取得
 */
export function getCompletenessColor(score: number): string {
  if (score >= 100) return '#dcfce7'; // 緑 - 完璧
  if (score >= 80) return '#fef9c3';  // 黄 - もう少し
  if (score >= 60) return '#fed7aa';  // オレンジ - 半分以上
  return '#fecaca'; // 赤 - 多くの項目が不足
}

/**
 * 完全性スコアに基づいてボーダー色を取得
 */
export function getCompletenessBorderColor(score: number): string {
  if (score >= 100) return '#86efac'; // 緑
  if (score >= 80) return '#fde047';  // 黄
  if (score >= 60) return '#fdba74';  // オレンジ
  return '#fca5a5'; // 赤
}
