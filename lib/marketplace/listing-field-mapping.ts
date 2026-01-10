/**
 * モール別出品必須項目マッピング
 * lib/marketplace/listing-field-mapping.ts
 * 
 * eBayのデータを各モールにマッピングするための定義
 */

// =====================================================
// eBay基準フィールド（ソースデータ）
// =====================================================

export interface EbaySourceData {
  // 基本情報
  sku: string;
  englishTitle: string;
  japaneseTitle?: string;
  description?: string;
  htmlDescription?: string;
  
  // カテゴリ
  ebayCategoryId: string;
  ebayCategoryName?: string;
  
  // 画像
  imageUrls: string[];
  
  // 価格・コスト
  priceUsd?: number;
  purchasePriceJpy: number;
  
  // 属性
  brand?: string;
  manufacturer?: string;
  originCountry?: string;
  condition?: string;
  
  // 物理情報
  weightGrams?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  
  // 在庫
  stockQuantity: number;
  
  // その他
  janCode?: string;
  modelNumber?: string;
}

// =====================================================
// Qoo10 JP 出品フィールド
// =====================================================

export interface Qoo10ListingData {
  // 必須項目
  SecondSubCat: string;           // カテゴリコード（9桁）
  ItemTitle: string;              // 商品名（最大50文字）
  SellingPrice: number;           // 販売価格
  ItemQty: number;                // 在庫数（0で品切れ可）
  ShippingNo: string;             // 送料コード
  AdultYN: 'Y' | 'N';            // 成人商品
  ItemDetail: string;             // 商品詳細HTML
  ContactInfo: string;            // 返品連絡先
  
  // 推奨項目
  SellerCode?: string;            // 販売者商品コード（SKU）
  BrandNo?: string;               // ブランドコード
  PromotionName?: string;         // 広告文
  RetailPrice?: number;           // 定価（参考価格）
  IndustrialCodeType?: string;    // コードタイプ（J=JAN）
  IndustrialCode?: string;        // JANコード
  ModelNM?: string;               // モデル名
  OriginType?: string;            // 原産国タイプ
  OriginCountryCode?: string;     // 原産国コード
  
  // 画像（最大10枚）
  ImageUrl?: string;
  ImageUrl2?: string;
  ImageUrl3?: string;
  ImageUrl4?: string;
  ImageUrl5?: string;
  ImageUrl6?: string;
  ImageUrl7?: string;
  ImageUrl8?: string;
  ImageUrl9?: string;
  ImageUrl10?: string;
  
  // 配送設定
  DesiredShippingDate?: string;   // 発送日数
  
  // 販売期間
  AvailableDateType?: string;
  AvailableDateValue?: string;
}

// =====================================================
// Shopee SG 出品フィールド
// =====================================================

export interface ShopeeListingData {
  // 必須項目
  item_name: string;              // 商品名（最大120文字）
  description: string;            // 商品説明（最大3000文字）
  category_id: number;            // カテゴリID
  original_price: number;         // 販売価格（SGD）
  normal_stock: number;           // 在庫数
  weight: number;                 // 重量（kg）
  
  // 推奨項目
  item_sku?: string;              // SKU
  brand?: string;                 // ブランド
  condition?: string;             // 状態 (NEW/USED)
  
  // 画像
  images: {
    url: string;
  }[];
  
  // 配送
  logistic_info?: {
    logistic_id: number;
    enabled: boolean;
    shipping_fee?: number;
  }[];
  
  // サイズ
  dimension?: {
    package_length: number;
    package_width: number;
    package_height: number;
  };
}

// =====================================================
// Amazon JP 出品フィールド
// =====================================================

export interface AmazonListingData {
  // 必須項目
  sku: string;
  product_id: string;             // ASIN or JAN
  product_id_type: string;        // 'ASIN' | 'JAN' | 'EAN'
  title: string;
  description: string;
  price: number;                  // 販売価格（円）
  quantity: number;               // 在庫数
  condition_type: string;         // 'New' | 'UsedLikeNew' | 'UsedVeryGood' | 'UsedGood' | 'UsedAcceptable'
  
  // 推奨項目
  brand?: string;
  manufacturer?: string;
  bullet_point1?: string;
  bullet_point2?: string;
  bullet_point3?: string;
  bullet_point4?: string;
  bullet_point5?: string;
  
  // 画像
  main_image_url?: string;
  other_image_url1?: string;
  other_image_url2?: string;
  other_image_url3?: string;
  
  // 配送
  fulfillment_channel?: 'DEFAULT' | 'AMAZON_JP';  // FBA or FBM
}

// =====================================================
// マッピング関数
// =====================================================

/**
 * eBayデータ → Qoo10データ変換
 */
export function mapEbayToQoo10(
  ebayData: EbaySourceData,
  options: {
    categoryCode: string;
    shippingNo: string;
    contactInfo: string;
    sellingPrice: number;
    promotionName?: string;
    stockQty?: number;
  }
): Qoo10ListingData {
  return {
    // 必須
    SecondSubCat: options.categoryCode,
    ItemTitle: truncateString(ebayData.japaneseTitle || ebayData.englishTitle, 50),
    SellingPrice: options.sellingPrice,
    ItemQty: options.stockQty ?? ebayData.stockQuantity,
    ShippingNo: options.shippingNo,
    AdultYN: 'N',
    ItemDetail: ebayData.htmlDescription || `<p>${ebayData.description || ''}</p>`,
    ContactInfo: options.contactInfo,
    
    // 推奨
    SellerCode: ebayData.sku,
    PromotionName: options.promotionName || '',
    RetailPrice: Math.round(options.sellingPrice * 1.2),
    IndustrialCodeType: ebayData.janCode ? 'J' : '',
    IndustrialCode: ebayData.janCode || '',
    ModelNM: ebayData.modelNumber || '',
    OriginType: '0',
    OriginCountryCode: ebayData.originCountry || 'JP',
    
    // 画像
    ImageUrl: ebayData.imageUrls[0],
    ImageUrl2: ebayData.imageUrls[1],
    ImageUrl3: ebayData.imageUrls[2],
    ImageUrl4: ebayData.imageUrls[3],
    ImageUrl5: ebayData.imageUrls[4],
    ImageUrl6: ebayData.imageUrls[5],
    ImageUrl7: ebayData.imageUrls[6],
    ImageUrl8: ebayData.imageUrls[7],
    ImageUrl9: ebayData.imageUrls[8],
    ImageUrl10: ebayData.imageUrls[9],
    
    // 配送
    DesiredShippingDate: '3',
  };
}

/**
 * eBayデータ → Shopeeデータ変換
 */
export function mapEbayToShopee(
  ebayData: EbaySourceData,
  options: {
    categoryId: number;
    originalPrice: number;
    logisticId?: number;
    stockQty?: number;
  }
): ShopeeListingData {
  return {
    // 必須
    item_name: truncateString(ebayData.englishTitle, 120),
    description: truncateString(ebayData.description || '', 3000),
    category_id: options.categoryId,
    original_price: options.originalPrice,
    normal_stock: options.stockQty ?? ebayData.stockQuantity,
    weight: (ebayData.weightGrams || 500) / 1000,
    
    // 推奨
    item_sku: ebayData.sku,
    brand: ebayData.brand,
    condition: 'NEW',
    
    // 画像
    images: ebayData.imageUrls.slice(0, 9).map(url => ({ url })),
    
    // 配送
    logistic_info: options.logisticId ? [{
      logistic_id: options.logisticId,
      enabled: true,
    }] : undefined,
    
    // サイズ
    dimension: ebayData.lengthCm && ebayData.widthCm && ebayData.heightCm ? {
      package_length: ebayData.lengthCm,
      package_width: ebayData.widthCm,
      package_height: ebayData.heightCm,
    } : undefined,
  };
}

/**
 * eBayデータ → Amazonデータ変換
 */
export function mapEbayToAmazon(
  ebayData: EbaySourceData,
  options: {
    price: number;
    stockQty?: number;
    bulletPoints?: string[];
  }
): AmazonListingData {
  return {
    // 必須
    sku: ebayData.sku,
    product_id: ebayData.janCode || '',
    product_id_type: ebayData.janCode ? 'JAN' : 'ASIN',
    title: truncateString(ebayData.japaneseTitle || ebayData.englishTitle, 200),
    description: ebayData.description || '',
    price: options.price,
    quantity: options.stockQty ?? ebayData.stockQuantity,
    condition_type: ebayData.condition === 'New' ? 'New' : 'UsedLikeNew',
    
    // 推奨
    brand: ebayData.brand,
    manufacturer: ebayData.manufacturer,
    bullet_point1: options.bulletPoints?.[0],
    bullet_point2: options.bulletPoints?.[1],
    bullet_point3: options.bulletPoints?.[2],
    bullet_point4: options.bulletPoints?.[3],
    bullet_point5: options.bulletPoints?.[4],
    
    // 画像
    main_image_url: ebayData.imageUrls[0],
    other_image_url1: ebayData.imageUrls[1],
    other_image_url2: ebayData.imageUrls[2],
    other_image_url3: ebayData.imageUrls[3],
    
    // 配送
    fulfillment_channel: 'DEFAULT',
  };
}

// =====================================================
// フィールド検証
// =====================================================

export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
  warnings: string[];
}

/**
 * Qoo10出品データ検証
 */
export function validateQoo10Data(data: Partial<Qoo10ListingData>): ValidationResult {
  const missingFields: string[] = [];
  const warnings: string[] = [];
  
  // 必須フィールドチェック
  if (!data.SecondSubCat) missingFields.push('SecondSubCat (カテゴリコード)');
  if (!data.ItemTitle) missingFields.push('ItemTitle (商品名)');
  if (data.SellingPrice === undefined || data.SellingPrice <= 0) missingFields.push('SellingPrice (販売価格)');
  if (data.ItemQty === undefined) missingFields.push('ItemQty (在庫数)');
  if (!data.ShippingNo) missingFields.push('ShippingNo (送料コード)');
  if (!data.AdultYN) missingFields.push('AdultYN (成人商品フラグ)');
  if (!data.ItemDetail) missingFields.push('ItemDetail (商品詳細)');
  if (!data.ContactInfo) missingFields.push('ContactInfo (返品連絡先)');
  if (!data.ImageUrl) missingFields.push('ImageUrl (メイン画像)');
  
  // 警告チェック
  if (!data.SellerCode) warnings.push('SellerCode (SKU) がありません - 後の管理が困難になります');
  if (data.ItemTitle && data.ItemTitle.length > 50) warnings.push('商品名が50文字を超えています');
  if (data.ItemQty === 0) warnings.push('在庫数が0です - 品切れ状態で出品されます');
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
    warnings,
  };
}

/**
 * Shopee出品データ検証
 */
export function validateShopeeData(data: Partial<ShopeeListingData>): ValidationResult {
  const missingFields: string[] = [];
  const warnings: string[] = [];
  
  if (!data.item_name) missingFields.push('item_name (商品名)');
  if (!data.description) missingFields.push('description (商品説明)');
  if (!data.category_id) missingFields.push('category_id (カテゴリ)');
  if (data.original_price === undefined || data.original_price <= 0) missingFields.push('original_price (価格)');
  if (data.normal_stock === undefined) missingFields.push('normal_stock (在庫数)');
  if (!data.weight || data.weight <= 0) missingFields.push('weight (重量)');
  if (!data.images || data.images.length === 0) missingFields.push('images (画像)');
  
  if (data.item_name && data.item_name.length > 120) warnings.push('商品名が120文字を超えています');
  if (data.description && data.description.length > 3000) warnings.push('商品説明が3000文字を超えています');
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
    warnings,
  };
}

// =====================================================
// ユーティリティ
// =====================================================

function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

// =====================================================
// フィールド定義エクスポート
// =====================================================

export const QOO10_REQUIRED_FIELDS = [
  { key: 'SecondSubCat', label: 'カテゴリコード', required: true },
  { key: 'ItemTitle', label: '商品名', required: true, maxLength: 50 },
  { key: 'SellingPrice', label: '販売価格', required: true },
  { key: 'ItemQty', label: '在庫数', required: true },
  { key: 'ShippingNo', label: '送料コード', required: true },
  { key: 'AdultYN', label: '成人商品', required: true },
  { key: 'ItemDetail', label: '商品詳細HTML', required: true },
  { key: 'ContactInfo', label: '返品連絡先', required: true },
  { key: 'ImageUrl', label: 'メイン画像', required: true },
  { key: 'SellerCode', label: '販売者商品コード', required: false },
  { key: 'BrandNo', label: 'ブランドコード', required: false },
  { key: 'PromotionName', label: '広告文', required: false },
];

export const SHOPEE_REQUIRED_FIELDS = [
  { key: 'item_name', label: '商品名', required: true, maxLength: 120 },
  { key: 'description', label: '商品説明', required: true, maxLength: 3000 },
  { key: 'category_id', label: 'カテゴリID', required: true },
  { key: 'original_price', label: '販売価格', required: true },
  { key: 'normal_stock', label: '在庫数', required: true },
  { key: 'weight', label: '重量(kg)', required: true },
  { key: 'images', label: '画像', required: true },
  { key: 'item_sku', label: 'SKU', required: false },
];
