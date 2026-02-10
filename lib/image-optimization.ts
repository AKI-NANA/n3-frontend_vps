// lib/image-optimization.ts
// 画像最適化ユーティリティ（Phase 7）

/**
 * 画像URLを最適化する
 * - Supabase Storage の画像は自動的にWebPに変換
 * - 外部URLは画像プロキシ経由でWebPに変換
 * 
 * @param url - 元の画像URL
 * @param width - 希望する幅（px）
 * @param quality - 画質（1-100）デフォルト80
 * @returns 最適化された画像URL
 */
export function optimizeImageUrl(
  url: string | null | undefined,
  width: number = 400,
  quality: number = 80
): string | null {
  if (!url) return null;

  try {
    // Supabase Storage の画像の場合
    if (url.includes('supabase.co/storage')) {
      // Supabase Transform API を使用
      // https://supabase.com/docs/guides/storage/serving/image-transformations
      const urlObj = new URL(url);
      urlObj.searchParams.set('width', String(width));
      urlObj.searchParams.set('quality', String(quality));
      urlObj.searchParams.set('format', 'webp');
      return urlObj.toString();
    }

    // 外部URL（Yahoo Auctions、eBay等）の場合
    // 画像プロキシ経由でWebPに変換
    return `/api/image-proxy?url=${encodeURIComponent(url)}&width=${width}&quality=${quality}`;
  } catch (error) {
    console.error('❌ 画像URL最適化エラー:', error);
    return url;
  }
}

/**
 * サムネイルサイズを取得
 */
export const THUMBNAIL_SIZES = {
  small: 100,    // リスト表示用
  medium: 400,   // モーダル・カード表示用
  large: 800,    // 詳細表示・ズーム用
  original: 0    // オリジナルサイズ
} as const;

/**
 * 画像を遅延読み込み用にプリロード
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * 複数の画像を並行してプリロード
 */
export async function preloadImages(urls: string[]): Promise<void> {
  await Promise.all(urls.map(url => preloadImage(url)));
}

/**
 * 画像のBase64エンコード（アップロード用）
 */
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // data:image/jpeg;base64, を除去
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 画像をリサイズ（ブラウザ上でリサイズ）
 */
export function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // アスペクト比を維持してリサイズ
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 画像の実際のサイズを取得
 */
export function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * 画像が読み込み可能かチェック
 */
export async function isImageLoadable(url: string): Promise<boolean> {
  try {
    await preloadImage(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * srcset用の文字列を生成
 * レスポンシブ対応の画像表示に使用
 */
export function generateSrcSet(url: string, sizes: number[]): string {
  return sizes
    .map(size => `${optimizeImageUrl(url, size)} ${size}w`)
    .join(', ');
}

/**
 * 画像プロキシAPIのエンドポイント
 * 外部画像をWebPに変換してキャッシュ
 */
export const IMAGE_PROXY_ENDPOINT = '/api/image-proxy';
