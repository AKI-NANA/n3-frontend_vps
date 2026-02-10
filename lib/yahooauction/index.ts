/**
 * Yahoo Auction (ヤフオク) 一括出品ツール V2
 * 
 * オークタウンVer.1.19準拠のCSV生成ツール
 * Shift_JIS完全対応 / 利益率ベース計算
 * 
 * @version 2.0.0
 * @updated 2026-01-30
 * 
 * 機能:
 * - 利益計算（利益率ベース / 損切り・回収率逆算）
 * - SEOタイトル最適化
 * - オークタウンCSV生成（Shift_JIS / BOM無し / CRLF）
 * - ガード条件（利益率チェック）
 * - 送料推定
 * 
 * @example
 * import { 
 *   generateAuctownCSVv2, 
 *   calculatePriceByProfitRate,
 *   DEFAULT_CSV_EXPORT_SETTINGS 
 * } from '@/lib/yahooauction';
 * 
 * // 利益率ベースでCSV生成
 * const result = generateAuctownCSVv2(
 *   products,
 *   config,
 *   { ...DEFAULT_CSV_EXPORT_SETTINGS, minProfitRate: 15 }
 * );
 * 
 * // Shift_JIS変換済みバッファを取得
 * const buffer = result.csvBuffer;
 */

// ============================================================
// 型定義
// ============================================================
export * from './types';

// ============================================================
// 利益計算
// ============================================================
export {
  calculateYahooAuctionProfit,
  simulatePrice,
  simulatePriceRange,
  calculateRecommendedPrice,
  calculateBatchProfit,
  calculateProfitSummary,
  getFeeRate,
  calculateFee,
  calculateNetProceeds,
  calculateRequiredSellingPrice,
  calculateBreakEvenPrice,
  // V2追加
  calculatePriceByProfitRate,
  validateProfitRate,
} from './profit-calculator';

// デフォルトエクスポート
export { default as profitCalculator } from './profit-calculator';

// ============================================================
// タイトル最適化
// ============================================================
export {
  generateOptimizedTitle,
  generateJapaneseTitleFromEnglish,
  previewTitle,
  generateTitleVariants,
  addPowerWordIfFits,
  countFullWidthChars,
  truncateToFullWidthLength,
  formatRetailPrice,
  sanitizeText,
  convertToJapaneseStyle,
} from './title-optimizer';

// デフォルトエクスポート
export { default as titleOptimizer } from './title-optimizer';

// ============================================================
// CSV生成（オークタウンVer.1.19準拠 + Shift_JIS対応）
// ============================================================
export {
  generateAuctownCSV,      // 後方互換（V1）
  generateAuctownCSVv2,    // V2: Shift_JIS + 利益率ベース
  generateCSVRow,
  CSV_HEADERS,
  estimateShippingCost,
  convertToShiftJIS,
  convertFromShiftJIS,
} from './csv-generator';

export { default as csvGenerator } from './csv-generator';
export type { GenerateCSVResult } from './csv-generator';
