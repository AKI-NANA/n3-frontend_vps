// lib/services/image/image-upload-optimizer.ts
/**
 * 画像アップロード最適化サービス
 * 
 * 【機能】
 * 1. eBay API送信前の画像リサイズ（1600px以下）
 * 2. WebP/JPEG圧縮
 * 3. クライアントサイド＆サーバーサイド両対応
 * 4. 進捗コールバック対応
 * 
 * 【eBay画像要件】
 * - 最小: 500x500px
 * - 推奨: 1600x1600px
 * - 最大: 12MB
 * - 形式: JPEG, PNG, GIF, TIFF
 */

// ============================================================
// 型定義
// ============================================================

export interface ImageOptimizeOptions {
  maxWidth: number;           // 最大幅（デフォルト: 1600）
  maxHeight: number;          // 最大高さ（デフォルト: 1600）
  quality: number;            // 圧縮品質 0-1（デフォルト: 0.85）
  format: 'jpeg' | 'webp' | 'png';  // 出力形式（デフォルト: jpeg）
  maxFileSizeMb: number;      // 最大ファイルサイズMB（デフォルト: 5）
}

export interface OptimizedImageResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  format: string;
}

export interface BatchOptimizeProgress {
  total: number;
  completed: number;
  current: string;
  errors: string[];
}

// ============================================================
// デフォルト設定
// ============================================================

export const EBAY_IMAGE_DEFAULTS: ImageOptimizeOptions = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.85,
  format: 'jpeg',
  maxFileSizeMb: 5,
};

export const THUMBNAIL_DEFAULTS: ImageOptimizeOptions = {
  maxWidth: 200,
  maxHeight: 200,
  quality: 0.7,
  format: 'webp',
  maxFileSizeMb: 0.1,
};

// ============================================================
// クライアントサイド画像処理
// ============================================================

/**
 * 画像をリサイズ・圧縮（ブラウザ環境）
 */
export async function optimizeImageClient(
  imageSource: File | Blob | string,
  options: Partial<ImageOptimizeOptions> = {}
): Promise<OptimizedImageResult> {
  const opts: ImageOptimizeOptions = { ...EBAY_IMAGE_DEFAULTS, ...options };
  
  // 画像をロード
  const img = await loadImage(imageSource);
  const originalSize = imageSource instanceof Blob 
    ? imageSource.size 
    : (await fetch(imageSource as string).then(r => r.blob())).size;
  
  // リサイズ計算
  const { width, height } = calculateResizeDimensions(
    img.naturalWidth,
    img.naturalHeight,
    opts.maxWidth,
    opts.maxHeight
  );
  
  // Canvasでリサイズ
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  // 高品質リサイズ設定
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  
  // 圧縮出力
  const mimeType = `image/${opts.format}`;
  let quality = opts.quality;
  let blob: Blob;
  
  // ファイルサイズ制限に収まるまで品質を下げる
  do {
    blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b!),
        mimeType,
        quality
      );
    });
    quality -= 0.05;
  } while (blob.size > opts.maxFileSizeMb * 1024 * 1024 && quality > 0.3);
  
  const dataUrl = await blobToDataUrl(blob);
  
  return {
    blob,
    dataUrl,
    width,
    height,
    originalSize,
    optimizedSize: blob.size,
    compressionRatio: 1 - (blob.size / originalSize),
    format: opts.format,
  };
}

/**
 * 複数画像の一括最適化（進捗コールバック付き）
 */
export async function optimizeImagesClient(
  images: Array<File | Blob | string>,
  options: Partial<ImageOptimizeOptions> = {},
  onProgress?: (progress: BatchOptimizeProgress) => void
): Promise<OptimizedImageResult[]> {
  const results: OptimizedImageResult[] = [];
  const errors: string[] = [];
  const total = images.length;
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const current = typeof image === 'string' ? image : `image_${i}`;
    
    try {
      onProgress?.({
        total,
        completed: i,
        current,
        errors,
      });
      
      const result = await optimizeImageClient(image, options);
      results.push(result);
    } catch (error) {
      const errorMsg = `Failed to optimize ${current}: ${error}`;
      errors.push(errorMsg);
      console.error(errorMsg);
    }
  }
  
  onProgress?.({
    total,
    completed: total,
    current: 'complete',
    errors,
  });
  
  return results;
}

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * 画像をロード
 */
function loadImage(source: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
    
    if (source instanceof Blob) {
      img.src = URL.createObjectURL(source);
    } else {
      img.src = source;
    }
  });
}

/**
 * リサイズ後の寸法を計算（アスペクト比維持）
 */
export function calculateResizeDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  // 元画像が既に制限内ならそのまま
  if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
    return { width: originalWidth, height: originalHeight };
  }
  
  const aspectRatio = originalWidth / originalHeight;
  
  let width = maxWidth;
  let height = width / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }
  
  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

/**
 * BlobをDataURLに変換
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * DataURLをBlobに変換
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mimeType });
}

/**
 * 画像URLの検証
 */
export function validateImageUrl(url: string): { valid: boolean; error?: string } {
  if (!url) {
    return { valid: false, error: 'URL is empty' };
  }
  
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:', 'data:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Invalid protocol' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

// ============================================================
// eBay用ヘルパー
// ============================================================

/**
 * eBay出品用に画像を最適化
 */
export async function prepareImageForEbay(
  imageSource: File | Blob | string
): Promise<OptimizedImageResult> {
  return optimizeImageClient(imageSource, EBAY_IMAGE_DEFAULTS);
}

/**
 * 複数画像をeBay出品用に最適化
 */
export async function prepareImagesForEbay(
  images: Array<File | Blob | string>,
  onProgress?: (progress: BatchOptimizeProgress) => void
): Promise<OptimizedImageResult[]> {
  return optimizeImagesClient(images, EBAY_IMAGE_DEFAULTS, onProgress);
}

/**
 * 画像サイズの概算を取得（最適化前）
 */
export function estimateOptimizedSize(
  originalWidth: number,
  originalHeight: number,
  originalSize: number,
  targetWidth: number = 1600,
  quality: number = 0.85
): number {
  const scaleFactor = Math.min(
    targetWidth / originalWidth,
    targetWidth / originalHeight,
    1
  );
  
  // 圧縮による削減 + リサイズによる削減
  const sizeAfterResize = originalSize * (scaleFactor ** 2);
  const sizeAfterCompression = sizeAfterResize * (quality * 1.2); // JPEGは約80%効率
  
  return Math.round(sizeAfterCompression);
}

// ============================================================
// エクスポート
// ============================================================

export default {
  optimizeImageClient,
  optimizeImagesClient,
  prepareImageForEbay,
  prepareImagesForEbay,
  calculateResizeDimensions,
  validateImageUrl,
  dataUrlToBlob,
  estimateOptimizedSize,
  EBAY_IMAGE_DEFAULTS,
  THUMBNAIL_DEFAULTS,
};
