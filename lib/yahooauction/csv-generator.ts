/**
 * Yahoo Auction (ヤフオク) CSV Generator V2
 * オークタウンVer.1.19準拠 + Shift_JIS完全対応
 * 
 * @version 2.0.0
 * @updated 2026-01-30
 * 
 * 変更履歴:
 * - V2: Shift_JIS変換対応（iconv-lite使用）
 * - V2: 利益率ベース計算統合
 * - V2: ガード条件（利益率チェック）追加
 */

import iconv from 'iconv-lite';
import {
  AuctownCSVRow,
  YahooAuctionProduct,
  YahooAuctionListingConfig,
  BulkListingResult,
  ItemCondition,
  DEFAULT_LISTING_CONFIG,
  DEFAULT_PACKAGING_COST,
  YahooCsvExportSettings,
  DEFAULT_CSV_EXPORT_SETTINGS,
  ProfitRateCalcResult,
} from './types';
import { 
  calculateYahooAuctionProfit, 
  calculatePriceByProfitRate, 
  validateProfitRate,
  getFeeRate 
} from './profit-calculator';
import { generateOptimizedTitle } from './title-optimizer';

// ============================================================
// CSV Header（オークタウンVer.1.19準拠 - 全45列）
// ============================================================

export const CSV_HEADERS = [
  'カテゴリ',
  'タイトル',
  '説明',
  '開始価格',
  '即決価格',
  '個数',
  '開催期間',
  '終了時間',
  '商品発送元の都道府県',
  '送料負担',
  '商品の状態',
  '返品の可否',
  '自動延長',
  '早期終了',
  '送料固定',
  '荷物の大きさ',
  '荷物の重量',
  '発送までの日数',
  'ネコポス',
  '宅急便コンパクト',
  '宅急便',
  'ゆうパケット',
  'ゆうパケットポストmini',
  'ゆうパケットプラス',
  'ゆうパック',
  'JANコード',
  '画像1',
  '画像2',
  '画像3',
  '画像4',
  '画像5',
  '画像6',
  '画像7',
  '画像8',
  '画像9',
  '画像10',
  '値下げ交渉',
  '自動再出品',
  '自動値下げ',
  '自動値下げ価格率',
  '最低落札価格',
  '海外発送',
  '商品の状態備考',
  '返品の可否備考',
] as const;

// ============================================================
// Helper Functions
// ============================================================

function escapeCSVField(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '';
  const str = String(value);
  // カンマ、ダブルクォート、改行を含む場合はダブルクォートで囲む
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function normalizeCondition(condition: string | undefined): ItemCondition {
  if (!condition) return '目立った傷や汚れなし';
  const map: Record<string, ItemCondition> = {
    'new': '新品',
    '新品': '新品',
    'like_new': '未使用に近い',
    '未使用に近い': '未使用に近い',
    'good': '目立った傷や汚れなし',
    '目立った傷や汚れなし': '目立った傷や汚れなし',
    'fair': 'やや傷や汚れあり',
    'やや傷や汚れあり': 'やや傷や汚れあり',
    'poor': '傷や汚れあり',
    '傷や汚れあり': '傷や汚れあり',
    'junk': 'ジャンク',
    'ジャンク': 'ジャンク',
  };
  return map[condition.toLowerCase()] || '目立った傷や汚れなし';
}

function calculateShippingSize(dimensions?: { length?: number; width?: number; height?: number }): string {
  if (!dimensions) return '〜80cm';
  const total = (dimensions.length || 0) + (dimensions.width || 0) + (dimensions.height || 0);
  if (total <= 60) return '〜60cm';
  if (total <= 80) return '〜80cm';
  if (total <= 100) return '〜100cm';
  if (total <= 120) return '〜120cm';
  if (total <= 140) return '〜140cm';
  if (total <= 160) return '〜160cm';
  return '〜180cm';
}

function calculateShippingWeight(weightG?: number): string {
  if (!weightG) return '〜2kg';
  const kg = weightG / 1000;
  if (kg <= 2) return '〜2kg';
  if (kg <= 5) return '〜5kg';
  if (kg <= 10) return '〜10kg';
  if (kg <= 20) return '〜20kg';
  if (kg <= 30) return '〜30kg';
  return '30kg〜';
}

/**
 * 送料を推定（重量・サイズベース）
 */
export function estimateShippingCost(weightG?: number, dimensions?: { length?: number; width?: number; height?: number }): number {
  const weight = weightG || 1000;
  const size = calculateShippingSize(dimensions);
  
  // ゆうパック概算料金（東京発・全国平均）
  const sizeToPrice: Record<string, number> = {
    '〜60cm': 870,
    '〜80cm': 1100,
    '〜100cm': 1330,
    '〜120cm': 1590,
    '〜140cm': 1830,
    '〜160cm': 2060,
    '〜180cm': 2410,
  };
  
  return sizeToPrice[size] || 1100;
}

function generateDescription(product: YahooAuctionProduct): string {
  const title = product.titleJa || product.titleEn || '商品';
  const brand = product.brand ? `ブランド: ${product.brand}\n` : '';
  const model = product.modelNumber ? `型番: ${product.modelNumber}\n` : '';
  
  return `【商品説明】
${title}

${brand}${model}
【商品の状態】
${normalizeCondition(product.condition)}

【発送について】
・通常2〜3営業日以内に発送いたします
・丁寧に梱包してお届けします

【注意事項】
・ノークレーム・ノーリターンでお願いします
・ご不明点はご質問ください`.trim();
}

// ============================================================
// CSV Row Generation
// ============================================================

export function generateCSVRow(
  product: YahooAuctionProduct,
  config: YahooAuctionListingConfig,
  sellingPrice: number
): AuctownCSVRow {
  const titleResult = generateOptimizedTitle({
    productName: product.titleJa || product.titleEn || '商品',
    condition: product.condition,
    retailPrice: product.retailPrice,
    brand: product.brand,
    modelNumber: product.modelNumber,
    isFreeShipping: config.shippingPayer === '出品者',
    isAuthentic: product.isAuthentic,
    isLimitedEdition: product.isLimitedEdition,
    isSealed: product.isSealed,
  });
  
  const images = product.images || [];
  
  return {
    カテゴリ: product.yahooAuctionCategoryId || '0',
    タイトル: titleResult.title,
    説明: generateDescription(product),
    開始価格: config.listingType === 'fixed' ? sellingPrice : 1,
    即決価格: sellingPrice,
    個数: 1,
    開催期間: config.duration,
    終了時間: config.endHour,
    商品発送元の都道府県: config.shippingFromPrefecture,
    送料負担: config.shippingPayer,
    商品の状態: normalizeCondition(product.condition),
    返品の可否: config.acceptsReturns ? '返品可' : '返品不可',
    自動延長: config.autoExtend ? 'はい' : 'いいえ',
    早期終了: config.earlyEnd ? 'はい' : 'いいえ',
    送料固定: config.shippingPayer === '出品者' ? 'はい' : 'いいえ',
    荷物の大きさ: calculateShippingSize(product.dimensions),
    荷物の重量: calculateShippingWeight(product.weightG),
    発送までの日数: config.shippingDays,
    ネコポス: config.shippingMethods.nekopos ? 'はい' : 'いいえ',
    宅急便コンパクト: config.shippingMethods.takkyubinCompact ? 'はい' : 'いいえ',
    宅急便: config.shippingMethods.takkyubin ? 'はい' : 'いいえ',
    ゆうパケット: config.shippingMethods.yuPacket ? 'はい' : 'いいえ',
    ゆうパケットポストmini: config.shippingMethods.yuPacketPostMini ? 'はい' : 'いいえ',
    ゆうパケットプラス: config.shippingMethods.yuPacketPlus ? 'はい' : 'いいえ',
    ゆうパック: config.shippingMethods.yuPack ? 'はい' : 'いいえ',
    JANコード: product.janCode,
    画像1: images[0],
    画像2: images[1],
    画像3: images[2],
    画像4: images[3],
    画像5: images[4],
    画像6: images[5],
    画像7: images[6],
    画像8: images[7],
    画像9: images[8],
    画像10: images[9],
    値下げ交渉: config.acceptsNegotiation ? 'はい' : 'いいえ',
    自動再出品: config.autoRelist,
    自動値下げ: config.autoDiscount ? 'はい' : 'いいえ',
    自動値下げ価格率: config.autoDiscountRate,
  };
}

// ============================================================
// V2: 利益率ベースCSV生成（メイン関数）
// ============================================================

export interface GenerateCSVResult extends BulkListingResult {
  /** Shift_JIS エンコード済みバッファ */
  csvBuffer: Buffer;
  /** UTF-8 CSV文字列（プレビュー用） */
  csvDataUtf8: string;
  /** ファイル名 */
  fileName: string;
  /** 総利益額 */
  totalProfit: number;
  /** 利益率ガード違反件数 */
  guardViolationCount: number;
}

/**
 * 利益率ベースでCSV生成（V2メイン関数）
 * 
 * @param products 商品データ
 * @param config 出品設定
 * @param exportSettings CSV生成設定（利益率等）
 * @returns Shift_JIS変換済みCSVバッファ付き結果
 */
export function generateAuctownCSVv2(
  products: YahooAuctionProduct[],
  config: YahooAuctionListingConfig = DEFAULT_LISTING_CONFIG,
  exportSettings: YahooCsvExportSettings = DEFAULT_CSV_EXPORT_SETTINGS
): GenerateCSVResult {
  const items: BulkListingResult['items'] = [];
  let successCount = 0;
  let errorCount = 0;
  let totalProfit = 0;
  let guardViolationCount = 0;
  
  for (const product of products) {
    try {
      // 送料計算
      const shippingCost = config.shippingPayer === '出品者'
        ? (exportSettings.shippingCalcMethod === 'fixed' && exportSettings.fixedShippingCost
            ? exportSettings.fixedShippingCost
            : estimateShippingCost(product.weightG, product.dimensions))
        : 0;
      
      // 利益率ベースで価格計算
      const profitCalc = calculatePriceByProfitRate({
        costPrice: product.costPrice,
        shippingCost,
        packagingCost: exportSettings.packagingCost,
        minProfitRate: exportSettings.minProfitRate,
        memberType: exportSettings.memberType,
      });
      
      let sellingPrice = profitCalc.sellingPrice;
      
      // 最低販売価格チェック
      if (exportSettings.minSellingPrice && sellingPrice < exportSettings.minSellingPrice) {
        sellingPrice = exportSettings.minSellingPrice;
      }
      
      // ガード条件チェック
      const validation = validateProfitRate(
        sellingPrice,
        product.costPrice,
        shippingCost,
        exportSettings.packagingCost,
        exportSettings.memberType,
        exportSettings.minProfitRate
      );
      
      const warnings: string[] = [];
      
      if (!validation.isValid) {
        guardViolationCount++;
        if (!exportSettings.allowLossCut && validation.profitAmount < 0) {
          // 損切り許容OFF かつ 赤字 → エラー
          throw new Error(`赤字出品は許可されていません（損失: ¥${Math.abs(validation.profitAmount).toLocaleString()}）`);
        }
        warnings.push(validation.message);
      }
      
      const csvRow = generateCSVRow(product, config, sellingPrice);
      
      items.push({
        productId: product.id,
        sku: product.sku,
        title: csvRow.タイトル,
        sellingPrice,
        netProceeds: validation.profitAmount + product.costPrice, // 手残り
        recoveryRate: ((validation.profitAmount + product.costPrice) / product.costPrice) * 100,
        isProfitable: validation.profitAmount >= 0,
        warnings,
        csvRow,
      });
      
      totalProfit += validation.profitAmount;
      successCount++;
      
    } catch (error: any) {
      errorCount++;
      items.push({
        productId: product.id,
        sku: product.sku,
        title: product.titleJa || product.titleEn || '不明',
        sellingPrice: 0,
        netProceeds: 0,
        recoveryRate: 0,
        isProfitable: false,
        warnings: [`❌ ${error.message}`],
      });
    }
  }
  
  // CSV文字列生成（UTF-8）
  const csvLines = [CSV_HEADERS.join(',')];
  for (const item of items) {
    if (item.csvRow) {
      const values = CSV_HEADERS.map(header => {
        const value = (item.csvRow as any)[header];
        return escapeCSVField(value);
      });
      csvLines.push(values.join(','));
    }
  }
  
  const csvDataUtf8 = csvLines.join('\r\n');
  
  // Shift_JIS変換（BOM無し）
  const csvBuffer = iconv.encode(csvDataUtf8, 'Shift_JIS');
  
  // ファイル名生成
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
  const fileName = `yahoo_export_${dateStr}_${timeStr}.csv`;
  
  return {
    successCount,
    errorCount,
    items,
    csvData: csvDataUtf8, // 後方互換性のため残す
    csvBuffer,
    csvDataUtf8,
    fileName,
    totalProfit,
    guardViolationCount,
  };
}

// ============================================================
// 後方互換: 旧API（V1）
// ============================================================

/**
 * @deprecated V2の generateAuctownCSVv2 を使用してください
 */
export function generateAuctownCSV(
  products: YahooAuctionProduct[],
  config: YahooAuctionListingConfig = DEFAULT_LISTING_CONFIG,
  targetRecoveryRate: number = 100
): BulkListingResult {
  const items: BulkListingResult['items'] = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (const product of products) {
    try {
      // 利益計算（旧方式: 回収率ベース）
      const shippingCost = config.shippingPayer === '出品者' ? 1000 : 0;
      const profitResult = calculateYahooAuctionProfit({
        costPrice: product.costPrice,
        targetRecoveryRate,
        memberType: config.memberType,
        shippingCost,
        packagingCost: DEFAULT_PACKAGING_COST,
        marketPrice: product.marketPrice,
      });
      
      const sellingPrice = profitResult.minimumSellingPrice;
      const csvRow = generateCSVRow(product, config, sellingPrice);
      
      items.push({
        productId: product.id,
        sku: product.sku,
        title: csvRow.タイトル,
        sellingPrice,
        netProceeds: profitResult.netProceeds,
        recoveryRate: profitResult.actualRecoveryRate,
        isProfitable: profitResult.isProfitable,
        warnings: profitResult.warnings,
        csvRow,
      });
      
      successCount++;
    } catch (error: any) {
      errorCount++;
      items.push({
        productId: product.id,
        sku: product.sku,
        title: product.titleJa || product.titleEn || '不明',
        sellingPrice: 0,
        netProceeds: 0,
        recoveryRate: 0,
        isProfitable: false,
        warnings: [error.message],
      });
    }
  }
  
  // CSV文字列生成
  const csvLines = [CSV_HEADERS.join(',')];
  for (const item of items) {
    if (item.csvRow) {
      const values = CSV_HEADERS.map(header => {
        const value = (item.csvRow as any)[header];
        return escapeCSVField(value);
      });
      csvLines.push(values.join(','));
    }
  }
  
  return {
    successCount,
    errorCount,
    items,
    csvData: csvLines.join('\r\n'),
  };
}

// ============================================================
// ユーティリティ
// ============================================================

/**
 * CSV文字列をShift_JISバッファに変換
 */
export function convertToShiftJIS(csvString: string): Buffer {
  return iconv.encode(csvString, 'Shift_JIS');
}

/**
 * Shift_JISバッファをUTF-8文字列に変換（インポート用）
 */
export function convertFromShiftJIS(buffer: Buffer): string {
  return iconv.decode(buffer, 'Shift_JIS');
}

// ============================================================
// エクスポート
// ============================================================

export default {
  generateAuctownCSV,
  generateAuctownCSVv2,
  generateCSVRow,
  CSV_HEADERS,
  estimateShippingCost,
  convertToShiftJIS,
  convertFromShiftJIS,
};
