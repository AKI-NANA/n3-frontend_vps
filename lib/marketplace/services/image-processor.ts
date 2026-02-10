/**
 * 画像処理サービス
 * /lib/marketplace/services/image-processor.ts
 * 
 * ストック画像挿入・ウォーターマーク・リサイズ等
 * 全販路共通で使用
 */

// =====================================================
// 型定義
// =====================================================

export type ImagePosition = 'first' | 'second' | 'last' | number;

export interface StockImage {
  id: string;
  name: string;
  url: string;
  category: 'shipping' | 'quality' | 'support' | 'promotion' | 'custom';
  description?: string;
  isDefault?: boolean;
}

export interface WatermarkConfig {
  enabled: boolean;
  type: 'text' | 'image';
  text?: string;
  imageUrl?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number;  // 0-1
  scale: number;    // 0.1-1
}

export interface ImageProcessingOptions {
  resize?: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
  };
  watermark?: WatermarkConfig;
  stockImages?: {
    images: StockImage[];
    insertAt: ImagePosition[];
  };
  removeBackground?: boolean;
}

export interface ProcessedImage {
  originalUrl: string;
  processedUrl: string;
  width: number;
  height: number;
  size: number;
  processingTime: number;
}

// =====================================================
// デフォルトストック画像
// =====================================================

export const DEFAULT_STOCK_IMAGES: StockImage[] = [
  {
    id: 'shipping-jp-1',
    name: '国内発送バナー',
    url: '/stock-images/shipping-jp-banner.jpg',
    category: 'shipping',
    description: '日本国内より発送いたします',
    isDefault: true,
  },
  {
    id: 'quality-check-1',
    name: '検品済みバナー',
    url: '/stock-images/quality-check-banner.jpg',
    category: 'quality',
    description: '丁寧に検品してお届けします',
  },
  {
    id: 'support-1',
    name: 'サポートバナー',
    url: '/stock-images/support-banner.jpg',
    category: 'support',
    description: 'お問い合わせはお気軽に',
  },
  {
    id: 'free-shipping-1',
    name: '送料無料バナー',
    url: '/stock-images/free-shipping-banner.jpg',
    category: 'promotion',
    description: '送料無料',
  },
];

// =====================================================
// 画像配列にストック画像を挿入
// =====================================================

export function insertStockImages(
  images: string[],
  stockImages: StockImage[],
  positions: ImagePosition[]
): string[] {
  if (!stockImages.length || !positions.length) {
    return images;
  }
  
  const result = [...images];
  
  // positionsとstockImagesをペアにして挿入
  const insertions = positions.map((pos, idx) => ({
    position: pos,
    image: stockImages[idx % stockImages.length],
  }));
  
  // 後ろから挿入することでインデックスのずれを防ぐ
  const sortedInsertions = insertions
    .map(ins => ({
      ...ins,
      numericPosition: getNumericPosition(ins.position, result.length),
    }))
    .sort((a, b) => b.numericPosition - a.numericPosition);
  
  for (const ins of sortedInsertions) {
    result.splice(ins.numericPosition, 0, ins.image.url);
  }
  
  return result;
}

function getNumericPosition(pos: ImagePosition, length: number): number {
  if (typeof pos === 'number') {
    return Math.min(Math.max(0, pos), length);
  }
  
  switch (pos) {
    case 'first': return 0;
    case 'second': return Math.min(1, length);
    case 'last': return length;
    default: return length;
  }
}

// =====================================================
// 画像処理（サーバーサイドAPI呼び出し）
// =====================================================

export async function processImages(
  images: string[],
  options: ImageProcessingOptions
): Promise<ProcessedImage[]> {
  // ストック画像挿入
  let processedUrls = images;
  if (options.stockImages) {
    processedUrls = insertStockImages(
      images,
      options.stockImages.images,
      options.stockImages.insertAt
    );
  }
  
  // サーバーサイドで画像処理
  if (options.resize || options.watermark || options.removeBackground) {
    try {
      const response = await fetch('/api/images/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: processedUrls,
          options: {
            resize: options.resize,
            watermark: options.watermark,
            removeBackground: options.removeBackground,
          },
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.processed;
      }
    } catch (error) {
      console.error('[processImages] エラー:', error);
    }
  }
  
  // 処理なしの場合はそのまま返す
  return processedUrls.map(url => ({
    originalUrl: url,
    processedUrl: url,
    width: 0,
    height: 0,
    size: 0,
    processingTime: 0,
  }));
}

// =====================================================
// マーケットプレイス別の画像制限
// =====================================================

export const MARKETPLACE_IMAGE_LIMITS: Record<string, {
  maxCount: number;
  maxWidth: number;
  maxHeight: number;
  maxFileSize: number;  // bytes
  formats: string[];
  mainImageRequired: boolean;
}> = {
  ebay_us: {
    maxCount: 24,
    maxWidth: 1600,
    maxHeight: 1600,
    maxFileSize: 12 * 1024 * 1024,
    formats: ['jpg', 'jpeg', 'png', 'gif'],
    mainImageRequired: true,
  },
  qoo10_jp: {
    maxCount: 10,
    maxWidth: 1000,
    maxHeight: 1000,
    maxFileSize: 2 * 1024 * 1024,
    formats: ['jpg', 'jpeg', 'png', 'gif'],
    mainImageRequired: true,
  },
  amazon_jp: {
    maxCount: 9,
    maxWidth: 2000,
    maxHeight: 2000,
    maxFileSize: 10 * 1024 * 1024,
    formats: ['jpg', 'jpeg', 'png', 'gif', 'tiff'],
    mainImageRequired: true,
  },
  mercari_jp: {
    maxCount: 10,
    maxWidth: 1080,
    maxHeight: 1080,
    maxFileSize: 5 * 1024 * 1024,
    formats: ['jpg', 'jpeg', 'png'],
    mainImageRequired: true,
  },
  yahoo_auction_jp: {
    maxCount: 10,
    maxWidth: 1200,
    maxHeight: 1200,
    maxFileSize: 5 * 1024 * 1024,
    formats: ['jpg', 'jpeg', 'png', 'gif'],
    mainImageRequired: true,
  },
};

// =====================================================
// 画像の最適化（マーケットプレイス別）
// =====================================================

export async function optimizeForMarketplace(
  images: string[],
  marketplace: string
): Promise<string[]> {
  const limits = MARKETPLACE_IMAGE_LIMITS[marketplace];
  if (!limits) {
    return images;
  }
  
  // 枚数制限
  const limitedImages = images.slice(0, limits.maxCount);
  
  // サイズ最適化
  const processed = await processImages(limitedImages, {
    resize: {
      maxWidth: limits.maxWidth,
      maxHeight: limits.maxHeight,
      quality: 85,
    },
  });
  
  return processed.map(p => p.processedUrl);
}

// =====================================================
// ストック画像の取得
// =====================================================

export async function getStockImages(
  category?: StockImage['category']
): Promise<StockImage[]> {
  try {
    const response = await fetch(`/api/stock-images${category ? `?category=${category}` : ''}`);
    if (response.ok) {
      const data = await response.json();
      return data.images || DEFAULT_STOCK_IMAGES;
    }
  } catch (error) {
    console.error('[getStockImages] エラー:', error);
  }
  
  // フォールバック
  return category 
    ? DEFAULT_STOCK_IMAGES.filter(img => img.category === category)
    : DEFAULT_STOCK_IMAGES;
}

// =====================================================
// 画像URLの検証
// =====================================================

export async function validateImageUrl(url: string): Promise<{
  valid: boolean;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  error?: string;
}> {
  try {
    const response = await fetch('/api/images/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    return { valid: false, error: 'Validation failed' };
  } catch (error) {
    return { valid: false, error: String(error) };
  }
}

// =====================================================
// 画像のプリロード（UI用）
// =====================================================

export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(url => new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load: ${url}`));
      img.src = url;
    }))
  );
}

// =====================================================
// 画像の並び替え
// =====================================================

export function reorderImages(
  images: string[],
  fromIndex: number,
  toIndex: number
): string[] {
  const result = [...images];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

// =====================================================
// メイン画像の設定
// =====================================================

export function setMainImage(images: string[], mainIndex: number): string[] {
  if (mainIndex === 0 || mainIndex >= images.length) {
    return images;
  }
  
  const result = [...images];
  const [main] = result.splice(mainIndex, 1);
  result.unshift(main);
  return result;
}
