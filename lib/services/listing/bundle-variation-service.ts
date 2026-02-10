// lib/services/listing/bundle-variation-service.ts
/**
 * セット品・バリエーション・オークション管理サービス
 * 
 * 【セット品（Bundle）】
 * - 複数SKUを1つの商品として束ねる
 * - 原価・送料・利益の合算計算
 * - 在庫は最小構成品に連動
 * 
 * 【バリエーション】
 * - eBay Variations構造の生成
 * - 属性（サイズ/色）マッピング
 * - SKU別送料サーチャージ
 * 
 * 【オークション形式】
 * - FixedPrice / Auction 切り替え
 * - 開始価格・即決価格設定
 * - オークション期間設定
 */

import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

/** セット品の構成品 */
export interface BundleItem {
  productId: string;
  sku: string;
  quantity: number;           // このセットに含まれる数量
  costPriceJpy: number;       // 仕入れ原価（JPY）
  weightG: number;            // 重量（g）
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
}

/** セット品全体 */
export interface BundleProduct {
  bundleId: string;
  bundleSku: string;
  bundleTitle: string;
  items: BundleItem[];
  // 計算結果
  totalCostPriceJpy: number;
  totalWeightG: number;
  combinedDimensionsCm?: { length: number; width: number; height: number };
  minStock: number;           // 最小在庫（構成品の最小値）
}

/** バリエーション属性 */
export interface VariationAttribute {
  name: string;               // Color, Size, Model など
  value: string;              // Red, Large, iPhone 15 など
}

/** 単一バリエーション */
export interface Variation {
  variationSku: string;
  attributes: VariationAttribute[];
  price: number;              // USD
  quantity: number;
  costPriceJpy: number;
  weightG: number;
  // DDP計算結果
  ddpCostUsd?: number;
  shippingSurchargeUsd?: number;
}

/** バリエーション商品全体 */
export interface VariationProduct {
  parentSku: string;
  parentTitle: string;
  categoryId: string;
  variationAttributes: string[];  // ['Color', 'Size']
  variations: Variation[];
  // 計算結果
  baseItemPriceUsd: number;       // 最低DDPコストをベースとしたItem Price
}

/** 出品形式 */
export type ListingFormat = 'FixedPrice' | 'Auction';

/** オークション設定 */
export interface AuctionSettings {
  format: ListingFormat;
  // Auction用
  startPriceUsd?: number;         // 開始価格
  reservePriceUsd?: number;       // 最低落札価格（オプション）
  buyItNowPriceUsd?: number;      // 即決価格（オプション）
  durationDays: 1 | 3 | 5 | 7 | 10 | 30;  // オークション期間
  // FixedPrice用
  fixedPriceUsd?: number;
  quantity?: number;
}

/** eBay Trading API用のVariationSpecifics */
export interface EbayVariationSpecific {
  Name: string;
  Value: string[];
}

/** eBay Trading API用のVariation構造 */
export interface EbayVariation {
  SKU: string;
  VariationSpecifics: {
    NameValueList: Array<{ Name: string; Value: string }>;
  };
  StartPrice: number;
  Quantity: number;
}

/** eBay出品データ */
export interface EbayListingData {
  format: ListingFormat;
  item: {
    Title: string;
    PrimaryCategory: { CategoryID: string };
    ConditionID: string;
    StartPrice?: number;            // Auction時の開始価格
    BuyItNowPrice?: number;         // Auction時の即決価格
    ReservePrice?: number;          // 最低落札価格
    ListingDuration?: string;       // Days_1, Days_3, Days_5, Days_7, Days_10, Days_30
    Quantity?: number;              // FixedPrice時
    // バリエーション
    Variations?: {
      VariationSpecificsSet: {
        NameValueList: EbayVariationSpecific[];
      };
      Variation: EbayVariation[];
    };
    // 配送・返品・支払いポリシー
    ShippingPolicyName?: string;
    ReturnPolicyName?: string;
    PaymentPolicyName?: string;
  };
}

// ============================================================
// セット品計算
// ============================================================

/**
 * セット品の合計原価を計算
 */
export function calculateBundleCost(items: BundleItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.costPriceJpy * item.quantity);
  }, 0);
}

/**
 * セット品の合計重量を計算
 */
export function calculateBundleWeight(items: BundleItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.weightG * item.quantity);
  }, 0);
}

/**
 * セット品の最小在庫を計算（各構成品の在庫÷必要数量の最小値）
 */
export function calculateBundleMinStock(
  items: BundleItem[], 
  stockMap: Map<string, number>
): number {
  const availableSets = items.map(item => {
    const stock = stockMap.get(item.productId) || 0;
    return Math.floor(stock / item.quantity);
  });
  return Math.min(...availableSets);
}

/**
 * セット品の寸法を計算（最大値ベース）
 */
export function calculateBundleDimensions(items: BundleItem[]): { length: number; width: number; height: number } | undefined {
  const withDimensions = items.filter(item => item.lengthCm && item.widthCm && item.heightCm);
  if (withDimensions.length === 0) return undefined;
  
  // 各寸法の最大値を取得（梱包サイズの概算）
  return {
    length: Math.max(...withDimensions.map(i => i.lengthCm!)),
    width: Math.max(...withDimensions.map(i => i.widthCm!)),
    height: withDimensions.reduce((sum, i) => sum + (i.heightCm! * i.quantity), 0), // 高さは積み重ね
  };
}

/**
 * セット品の完全なデータを構築
 */
export function buildBundleProduct(
  bundleId: string,
  bundleSku: string,
  bundleTitle: string,
  items: BundleItem[],
  stockMap: Map<string, number>
): BundleProduct {
  return {
    bundleId,
    bundleSku,
    bundleTitle,
    items,
    totalCostPriceJpy: calculateBundleCost(items),
    totalWeightG: calculateBundleWeight(items),
    combinedDimensionsCm: calculateBundleDimensions(items),
    minStock: calculateBundleMinStock(items, stockMap),
  };
}

// ============================================================
// バリエーション計算
// ============================================================

/**
 * DDPコストを計算（簡易版）
 */
export function calculateDdpCost(
  costPriceJpy: number,
  weightG: number,
  exchangeRate: number = 0.0067,  // JPY→USD
  shippingCostPerGram: number = 0.015  // $0.015/g
): number {
  const costUsd = costPriceJpy * exchangeRate;
  const shippingUsd = weightG * shippingCostPerGram;
  const importDutyUsd = costUsd * 0.05;  // 5%関税想定
  return costUsd + shippingUsd + importDutyUsd;
}

/**
 * バリエーション商品のItem Priceと送料サーチャージを計算
 */
export function calculateVariationPricing(
  variations: Variation[],
  targetProfitMargin: number = 0.20,  // 20%利益率
  exchangeRate: number = 0.0067
): { baseItemPriceUsd: number; variationsWithPricing: Variation[] } {
  
  // 各バリエーションのDDPコストを計算
  const variationsWithDdp = variations.map(v => ({
    ...v,
    ddpCostUsd: calculateDdpCost(v.costPriceJpy, v.weightG, exchangeRate),
  }));
  
  // 最低DDPコストを特定
  const minDdpCost = Math.min(...variationsWithDdp.map(v => v.ddpCostUsd!));
  
  // ベースItem Priceを決定（最低DDPコスト + 利益マージン）
  const baseItemPriceUsd = minDdpCost / (1 - targetProfitMargin);
  
  // 各バリエーションの送料サーチャージを計算
  const variationsWithPricing = variationsWithDdp.map(v => ({
    ...v,
    shippingSurchargeUsd: Math.max(0, v.ddpCostUsd! - minDdpCost),
    price: baseItemPriceUsd + Math.max(0, v.ddpCostUsd! - minDdpCost),
  }));
  
  return { baseItemPriceUsd, variationsWithPricing };
}

/**
 * eBay Variations構造を生成
 */
export function buildEbayVariations(product: VariationProduct): EbayListingData['item']['Variations'] {
  // 1. VariationSpecificsSet（利用可能な属性値の一覧）
  const attributeValuesMap: Record<string, Set<string>> = {};
  
  for (const variation of product.variations) {
    for (const attr of variation.attributes) {
      if (!attributeValuesMap[attr.name]) {
        attributeValuesMap[attr.name] = new Set();
      }
      attributeValuesMap[attr.name].add(attr.value);
    }
  }
  
  const variationSpecificsSet: EbayVariationSpecific[] = Object.entries(attributeValuesMap).map(
    ([name, values]) => ({
      Name: name,
      Value: Array.from(values),
    })
  );
  
  // 2. 個別のVariation
  const ebayVariations: EbayVariation[] = product.variations.map(v => ({
    SKU: v.variationSku,
    VariationSpecifics: {
      NameValueList: v.attributes.map(attr => ({
        Name: attr.name,
        Value: attr.value,
      })),
    },
    StartPrice: v.price,
    Quantity: v.quantity,
  }));
  
  return {
    VariationSpecificsSet: {
      NameValueList: variationSpecificsSet,
    },
    Variation: ebayVariations,
  };
}

// ============================================================
// オークション形式
// ============================================================

/**
 * オークション期間をeBay形式に変換
 */
export function convertDurationToEbay(days: AuctionSettings['durationDays']): string {
  return `Days_${days}`;
}

/**
 * オークション設定をeBay出品データに適用
 */
export function applyAuctionSettings(
  baseItem: EbayListingData['item'],
  settings: AuctionSettings
): EbayListingData['item'] {
  if (settings.format === 'Auction') {
    return {
      ...baseItem,
      StartPrice: settings.startPriceUsd,
      BuyItNowPrice: settings.buyItNowPriceUsd,
      ReservePrice: settings.reservePriceUsd,
      ListingDuration: convertDurationToEbay(settings.durationDays),
      Quantity: 1, // オークションは1個
    };
  } else {
    // FixedPrice
    return {
      ...baseItem,
      StartPrice: settings.fixedPriceUsd,
      ListingDuration: 'GTC', // Good 'Til Cancelled
      Quantity: settings.quantity || 1,
    };
  }
}

/**
 * 完全なeBay出品データを構築
 */
export function buildEbayListingData(
  product: Product | VariationProduct,
  settings: AuctionSettings,
  options: {
    categoryId: string;
    conditionId: string;
    shippingPolicy?: string;
    returnPolicy?: string;
    paymentPolicy?: string;
  }
): EbayListingData {
  const isVariation = 'variations' in product && product.variations.length > 0;
  
  let baseItem: EbayListingData['item'] = {
    Title: isVariation ? (product as VariationProduct).parentTitle : (product as Product).english_title || (product as Product).title || '',
    PrimaryCategory: { CategoryID: options.categoryId },
    ConditionID: options.conditionId,
    ShippingPolicyName: options.shippingPolicy,
    ReturnPolicyName: options.returnPolicy,
    PaymentPolicyName: options.paymentPolicy,
  };
  
  // オークション設定を適用
  baseItem = applyAuctionSettings(baseItem, settings);
  
  // バリエーションがある場合
  if (isVariation) {
    baseItem.Variations = buildEbayVariations(product as VariationProduct);
    // バリエーション商品ではオークション形式は使用不可
    if (settings.format === 'Auction') {
      console.warn('[Bundle/Variation] Auction format is not supported for variation listings. Falling back to FixedPrice.');
      baseItem.ListingDuration = 'GTC';
    }
  }
  
  return {
    format: settings.format,
    item: baseItem,
  };
}

// ============================================================
// バリデーション
// ============================================================

/** バリエーション検証結果 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * バリエーション商品の検証
 */
export function validateVariationProduct(product: VariationProduct): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 1. バリエーションが2つ以上あるか
  if (product.variations.length < 2) {
    errors.push('バリエーション商品には2つ以上のバリエーションが必要です');
  }
  
  // 2. 属性が設定されているか
  if (product.variationAttributes.length === 0) {
    errors.push('バリエーション属性（Color, Sizeなど）が設定されていません');
  }
  
  // 3. すべてのバリエーションに属性が設定されているか
  for (const v of product.variations) {
    if (v.attributes.length !== product.variationAttributes.length) {
      errors.push(`バリエーション ${v.variationSku} の属性数が不一致です`);
    }
  }
  
  // 4. SKUの重複チェック
  const skus = product.variations.map(v => v.variationSku);
  const uniqueSkus = new Set(skus);
  if (skus.length !== uniqueSkus.size) {
    errors.push('バリエーションSKUに重複があります');
  }
  
  // 5. 価格のチェック
  for (const v of product.variations) {
    if (v.price <= 0) {
      errors.push(`バリエーション ${v.variationSku} の価格が無効です`);
    }
    if (v.quantity < 0) {
      errors.push(`バリエーション ${v.variationSku} の数量が無効です`);
    }
  }
  
  // 警告
  if (product.variations.some(v => v.quantity === 0)) {
    warnings.push('在庫が0のバリエーションがあります');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * セット品の検証
 */
export function validateBundleProduct(bundle: BundleProduct): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 1. 構成品が1つ以上あるか
  if (bundle.items.length === 0) {
    errors.push('セット品には1つ以上の構成品が必要です');
  }
  
  // 2. 各構成品の数量チェック
  for (const item of bundle.items) {
    if (item.quantity <= 0) {
      errors.push(`構成品 ${item.sku} の数量が無効です`);
    }
    if (item.costPriceJpy <= 0) {
      errors.push(`構成品 ${item.sku} の原価が設定されていません`);
    }
  }
  
  // 3. 合計重量チェック
  if (bundle.totalWeightG <= 0) {
    warnings.push('セット品の合計重量が0です。送料計算に影響する可能性があります');
  }
  
  // 4. 在庫チェック
  if (bundle.minStock === 0) {
    warnings.push('いずれかの構成品の在庫が不足しているため、セット品は出品できません');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================
// エクスポート
// ============================================================

export default {
  // セット品
  calculateBundleCost,
  calculateBundleWeight,
  calculateBundleMinStock,
  calculateBundleDimensions,
  buildBundleProduct,
  validateBundleProduct,
  // バリエーション
  calculateDdpCost,
  calculateVariationPricing,
  buildEbayVariations,
  validateVariationProduct,
  // オークション
  convertDurationToEbay,
  applyAuctionSettings,
  buildEbayListingData,
};
