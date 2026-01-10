/**
 * useProductImages - 商品画像の共通取得フック
 * 
 * 複数のソースから画像URLを取得し、優先順位に従って返す
 * 優先順位: gallery_images > scraped_data.images > image_urls > listing_data.images
 */

import { useMemo } from 'react';

interface ScrapedData {
  images?: string[];
  image_url?: string;
  [key: string]: any;
}

interface ListingData {
  images?: string[];
  gallery_images?: string[];
  picture_url?: string;
  [key: string]: any;
}

interface Product {
  id?: number | string;
  gallery_images?: string[];
  image_urls?: string[];
  image_url?: string;
  scraped_data?: ScrapedData;
  listing_data?: ListingData;
  [key: string]: any;
}

interface UseProductImagesResult {
  /** メイン画像URL */
  mainImage: string | null;
  /** 全画像URL配列 */
  allImages: string[];
  /** 画像の数 */
  imageCount: number;
  /** 画像があるかどうか */
  hasImages: boolean;
  /** 画像のソース（どこから取得したか） */
  source: 'gallery_images' | 'scraped_data' | 'image_urls' | 'listing_data' | 'none';
}

/**
 * 商品の画像を取得するフック
 * @param product 商品データ
 * @returns 画像情報
 */
export function useProductImages(product: Product | null | undefined): UseProductImagesResult {
  return useMemo(() => {
    if (!product) {
      return {
        mainImage: null,
        allImages: [],
        imageCount: 0,
        hasImages: false,
        source: 'none' as const,
      };
    }

    // 1. gallery_images（最優先）
    if (product.gallery_images && Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
      const filtered = product.gallery_images.filter(isValidImageUrl);
      if (filtered.length > 0) {
        return {
          mainImage: filtered[0],
          allImages: filtered,
          imageCount: filtered.length,
          hasImages: true,
          source: 'gallery_images' as const,
        };
      }
    }

    // 2. scraped_data.images
    if (product.scraped_data) {
      const scrapedImages = product.scraped_data.images;
      if (scrapedImages && Array.isArray(scrapedImages) && scrapedImages.length > 0) {
        const filtered = scrapedImages.filter(isValidImageUrl);
        if (filtered.length > 0) {
          return {
            mainImage: filtered[0],
            allImages: filtered,
            imageCount: filtered.length,
            hasImages: true,
            source: 'scraped_data' as const,
          };
        }
      }
      // scraped_data.image_url（単一）
      if (product.scraped_data.image_url && isValidImageUrl(product.scraped_data.image_url)) {
        return {
          mainImage: product.scraped_data.image_url,
          allImages: [product.scraped_data.image_url],
          imageCount: 1,
          hasImages: true,
          source: 'scraped_data' as const,
        };
      }
    }

    // 3. image_urls
    if (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
      const filtered = product.image_urls.filter(isValidImageUrl);
      if (filtered.length > 0) {
        return {
          mainImage: filtered[0],
          allImages: filtered,
          imageCount: filtered.length,
          hasImages: true,
          source: 'image_urls' as const,
        };
      }
    }

    // 4. image_url（単一）
    if (product.image_url && isValidImageUrl(product.image_url)) {
      return {
        mainImage: product.image_url,
        allImages: [product.image_url],
        imageCount: 1,
        hasImages: true,
        source: 'image_urls' as const,
      };
    }

    // 5. listing_data.images / listing_data.gallery_images
    if (product.listing_data) {
      const listingImages = product.listing_data.images || product.listing_data.gallery_images;
      if (listingImages && Array.isArray(listingImages) && listingImages.length > 0) {
        const filtered = listingImages.filter(isValidImageUrl);
        if (filtered.length > 0) {
          return {
            mainImage: filtered[0],
            allImages: filtered,
            imageCount: filtered.length,
            hasImages: true,
            source: 'listing_data' as const,
          };
        }
      }
      // listing_data.picture_url（単一）
      if (product.listing_data.picture_url && isValidImageUrl(product.listing_data.picture_url)) {
        return {
          mainImage: product.listing_data.picture_url,
          allImages: [product.listing_data.picture_url],
          imageCount: 1,
          hasImages: true,
          source: 'listing_data' as const,
        };
      }
    }

    // 画像なし
    return {
      mainImage: null,
      allImages: [],
      imageCount: 0,
      hasImages: false,
      source: 'none' as const,
    };
  }, [product]);
}

/**
 * 画像URLが有効かどうかをチェック
 */
function isValidImageUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) {
    return false;
  }
  // 基本的なURL形式チェック
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('//')) {
    return false;
  }
  // 画像拡張子またはクエリパラメータがある場合はOK
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowerUrl = url.toLowerCase();
  const hasImageExtension = imageExtensions.some(ext => lowerUrl.includes(ext));
  const hasImageIndicator = lowerUrl.includes('image') || lowerUrl.includes('img') || lowerUrl.includes('photo');
  // プレースホルダー画像を除外
  if (lowerUrl.includes('placeholder') || lowerUrl.includes('no-image') || lowerUrl.includes('noimage')) {
    return false;
  }
  return hasImageExtension || hasImageIndicator || url.includes('?');
}

/**
 * 商品画像を同期的に取得するユーティリティ関数
 */
export function getProductImages(product: Product | null | undefined): UseProductImagesResult {
  if (!product) {
    return {
      mainImage: null,
      allImages: [],
      imageCount: 0,
      hasImages: false,
      source: 'none',
    };
  }

  // 同じロジックを関数として実行
  // 1. gallery_images
  if (product.gallery_images?.length) {
    const filtered = product.gallery_images.filter(isValidImageUrl);
    if (filtered.length > 0) {
      return { mainImage: filtered[0], allImages: filtered, imageCount: filtered.length, hasImages: true, source: 'gallery_images' };
    }
  }

  // 2. scraped_data.images
  if (product.scraped_data?.images?.length) {
    const filtered = product.scraped_data.images.filter(isValidImageUrl);
    if (filtered.length > 0) {
      return { mainImage: filtered[0], allImages: filtered, imageCount: filtered.length, hasImages: true, source: 'scraped_data' };
    }
  }
  if (product.scraped_data?.image_url && isValidImageUrl(product.scraped_data.image_url)) {
    return { mainImage: product.scraped_data.image_url, allImages: [product.scraped_data.image_url], imageCount: 1, hasImages: true, source: 'scraped_data' };
  }

  // 3. image_urls
  if (product.image_urls?.length) {
    const filtered = product.image_urls.filter(isValidImageUrl);
    if (filtered.length > 0) {
      return { mainImage: filtered[0], allImages: filtered, imageCount: filtered.length, hasImages: true, source: 'image_urls' };
    }
  }
  if (product.image_url && isValidImageUrl(product.image_url)) {
    return { mainImage: product.image_url, allImages: [product.image_url], imageCount: 1, hasImages: true, source: 'image_urls' };
  }

  // 4. listing_data
  const listingImages = product.listing_data?.images || product.listing_data?.gallery_images;
  if (listingImages?.length) {
    const filtered = listingImages.filter(isValidImageUrl);
    if (filtered.length > 0) {
      return { mainImage: filtered[0], allImages: filtered, imageCount: filtered.length, hasImages: true, source: 'listing_data' };
    }
  }
  if (product.listing_data?.picture_url && isValidImageUrl(product.listing_data.picture_url)) {
    return { mainImage: product.listing_data.picture_url, allImages: [product.listing_data.picture_url], imageCount: 1, hasImages: true, source: 'listing_data' };
  }

  return { mainImage: null, allImages: [], imageCount: 0, hasImages: false, source: 'none' };
}

export default useProductImages;
