// lib/services/image/image-optimization.ts
/**
 * 画像最適化サービス V2
 * 
 * 機能:
 * 1. Supabase Storage Transforms でサムネイル生成
 * 2. 外部画像（eBay/Yahoo/その他）のサムネイル化
 * 3. 遅延読み込み対応
 * 4. メモリキャッシュ
 * 
 * @version 2.0.0
 * @date 2025-12-22
 */

// ============================================================
// 型定義
// ============================================================

export interface ImageSize {
  width: number;
  height: number;
  quality?: number;
}

export interface OptimizedImage {
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
}

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'png' | 'jpg';
  resize?: 'cover' | 'contain' | 'fill';
}

// ============================================================
// 定数
// ============================================================

export const IMAGE_SIZES = {
  thumbnail: { width: 80, height: 80, quality: 50 },   // 🚀 より小さく
  small: { width: 150, height: 150, quality: 60 },     // 🚀 より小さく
  medium: { width: 300, height: 300, quality: 70 },    // 🚀 より小さく
  large: { width: 600, height: 600, quality: 80 },
  full: { width: 1000, height: 1000, quality: 85 },
} as const;

// URLパターン
const SUPABASE_STORAGE_PATTERN = /supabase\.co\/storage\/v1\/object\/public\//;
const EBAY_IMAGE_PATTERN = /i\.ebayimg\.com/;
const YAHOO_IMAGE_PATTERN = /\.yimg\.jp/;
const MERCARI_IMAGE_PATTERN = /static\.mercdn\.net/;

// ============================================================
// 外部画像サービス別の最適化
// ============================================================

/**
 * eBay画像のサムネイルURLを生成
 * eBayは s-l{size} パラメータで画像サイズを制御可能
 * 
 * @example
 * https://i.ebayimg.com/images/g/xxx/s-l1600.jpg → s-l200.jpg
 */
function getEbayThumbnail(url: string, size: keyof typeof IMAGE_SIZES): string {
  const sizeMap = {
    thumbnail: 100,
    small: 200,
    medium: 400,
    large: 800,
    full: 1600,
  };
  const targetSize = sizeMap[size];
  
  // s-l{number} パターンを置換
  if (url.includes('s-l')) {
    return url.replace(/s-l\d+/, `s-l${targetSize}`);
  }
  
  // パターンがない場合はそのまま返す
  return url;
}

/**
 * Yahoo画像のサムネイルURLを生成
 * Yahoo Auctionは画像URLの末尾で制御
 */
function getYahooThumbnail(url: string, size: keyof typeof IMAGE_SIZES): string {
  // Yahoo Auctionの画像URLはそのまま返す（サイズ制御が難しい）
  return url;
}

/**
 * Mercari画像のサムネイルURLを生成
 */
function getMercariThumbnail(url: string, size: keyof typeof IMAGE_SIZES): string {
  // Mercariの画像URLはそのまま返す
  return url;
}

// ============================================================
// メイン関数
// ============================================================

/**
 * 画像URLからサムネイルURLを生成（全画像ソース対応）
 * 
 * 🚀 高速化のポイント:
 * - Supabase画像: Storage Transformsで縮小
 * - eBay画像: s-l{size}パラメータで縮小
 * - その他: そのまま（将来的にプロキシ対応）
 */
export function getTransformedUrl(
  originalUrl: string,
  options: ImageTransformOptions
): string {
  if (!originalUrl) return '';
  
  // 1. Supabase Storage URL
  if (SUPABASE_STORAGE_PATTERN.test(originalUrl)) {
    let transformedUrl = originalUrl.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    
    const params = new URLSearchParams();
    if (options.width) params.set('width', String(options.width));
    if (options.height) params.set('height', String(options.height));
    if (options.quality) params.set('quality', String(options.quality));
    if (options.format) params.set('format', options.format);
    if (options.resize) params.set('resize', options.resize);
    
    const queryString = params.toString();
    if (queryString) {
      transformedUrl += (transformedUrl.includes('?') ? '&' : '?') + queryString;
    }
    
    return transformedUrl;
  }
  
  // 2. eBay画像（s-l{size}で制御可能）
  if (EBAY_IMAGE_PATTERN.test(originalUrl)) {
    const size = getSizeKeyFromOptions(options);
    return getEbayThumbnail(originalUrl, size);
  }
  
  // 3. Yahoo画像
  if (YAHOO_IMAGE_PATTERN.test(originalUrl)) {
    const size = getSizeKeyFromOptions(options);
    return getYahooThumbnail(originalUrl, size);
  }
  
  // 4. Mercari画像
  if (MERCARI_IMAGE_PATTERN.test(originalUrl)) {
    const size = getSizeKeyFromOptions(options);
    return getMercariThumbnail(originalUrl, size);
  }
  
  // 5. その他の外部URL（そのまま返す）
  return originalUrl;
}

/**
 * オプションからサイズキーを逆算
 */
function getSizeKeyFromOptions(options: ImageTransformOptions): keyof typeof IMAGE_SIZES {
  const width = options.width || 100;
  if (width <= 100) return 'thumbnail';
  if (width <= 200) return 'small';
  if (width <= 400) return 'medium';
  if (width <= 800) return 'large';
  return 'full';
}

/**
 * サムネイルURLを取得（簡易版）
 */
export function getThumbnailUrl(originalUrl: string, size: keyof typeof IMAGE_SIZES = 'thumbnail'): string {
  return getTransformedUrl(originalUrl, IMAGE_SIZES[size]);
}

/**
 * 画像URLから各サイズのURLセットを生成
 */
export function getOptimizedImageSet(originalUrl: string): OptimizedImage {
  return {
    original: originalUrl,
    thumbnail: getThumbnailUrl(originalUrl, 'thumbnail'),
    medium: getThumbnailUrl(originalUrl, 'medium'),
    large: getThumbnailUrl(originalUrl, 'large'),
  };
}

// ============================================================
// 遅延読み込みヘルパー
// ============================================================

export const LAZY_LOAD_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: '500px', // 🚀 500px手前で読み込み開始（さらに先読み）
  threshold: 0.01,
};

export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==';

export const ERROR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZlZTJlMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2VmNDQ0NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycjwvdGV4dD48L3N2Zz4=';

// ============================================================
// 画像配列処理
// ============================================================

export function getFirstImageUrl(images: string | string[] | null | undefined): string {
  if (!images) return '';
  if (typeof images === 'string') return images;
  if (Array.isArray(images) && images.length > 0) return images[0];
  return '';
}

export function normalizeImages(images: any): string[] {
  if (!images) return [];
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed;
      return [images];
    } catch {
      return [images];
    }
  }
  if (Array.isArray(images)) return images.filter(Boolean);
  return [];
}

export function addThumbnailsToImages(images: string[]): Array<{ original: string; thumbnail: string }> {
  return images.map(url => ({
    original: url,
    thumbnail: getThumbnailUrl(url),
  }));
}

// ============================================================
// キャッシュ管理（メモリ）
// ============================================================

const imageCache = new Map<string, string>();
const MAX_CACHE_SIZE = 1000; // 🚀 キャッシュサイズ増加

export function getCachedThumbnail(originalUrl: string, size: keyof typeof IMAGE_SIZES = 'thumbnail'): string {
  const cacheKey = `${originalUrl}:${size}`;
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }
  
  const thumbnailUrl = getThumbnailUrl(originalUrl, size);
  
  if (imageCache.size >= MAX_CACHE_SIZE) {
    const firstKey = imageCache.keys().next().value;
    if (firstKey) imageCache.delete(firstKey);
  }
  
  imageCache.set(cacheKey, thumbnailUrl);
  return thumbnailUrl;
}

export function clearImageCache(): void {
  imageCache.clear();
}

// ============================================================
// エクスポート
// ============================================================

export default {
  getTransformedUrl,
  getOptimizedImageSet,
  getThumbnailUrl,
  getFirstImageUrl,
  normalizeImages,
  addThumbnailsToImages,
  getCachedThumbnail,
  clearImageCache,
  IMAGE_SIZES,
  PLACEHOLDER_IMAGE,
  ERROR_PLACEHOLDER,
  LAZY_LOAD_OPTIONS,
};
