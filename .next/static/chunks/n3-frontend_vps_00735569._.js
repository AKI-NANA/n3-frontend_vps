(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/hooks/useProductImages.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * useProductImages - 商品画像の共通取得フック
 * 
 * 複数のソースから画像URLを取得し、優先順位に従って返す
 * 優先順位: gallery_images > scraped_data.images > image_urls > listing_data.images
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getProductImages",
    ()=>getProductImages,
    "useProductImages",
    ()=>useProductImages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useProductImages(product) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProductImages.useMemo": ()=>{
            if (!product) {
                return {
                    mainImage: null,
                    allImages: [],
                    imageCount: 0,
                    hasImages: false,
                    source: 'none'
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
                        source: 'gallery_images'
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
                            source: 'scraped_data'
                        };
                    }
                }
                // scraped_data.image_url（単一）
                if (product.scraped_data.image_url && isValidImageUrl(product.scraped_data.image_url)) {
                    return {
                        mainImage: product.scraped_data.image_url,
                        allImages: [
                            product.scraped_data.image_url
                        ],
                        imageCount: 1,
                        hasImages: true,
                        source: 'scraped_data'
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
                        source: 'image_urls'
                    };
                }
            }
            // 4. image_url（単一）
            if (product.image_url && isValidImageUrl(product.image_url)) {
                return {
                    mainImage: product.image_url,
                    allImages: [
                        product.image_url
                    ],
                    imageCount: 1,
                    hasImages: true,
                    source: 'image_urls'
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
                            source: 'listing_data'
                        };
                    }
                }
                // listing_data.picture_url（単一）
                if (product.listing_data.picture_url && isValidImageUrl(product.listing_data.picture_url)) {
                    return {
                        mainImage: product.listing_data.picture_url,
                        allImages: [
                            product.listing_data.picture_url
                        ],
                        imageCount: 1,
                        hasImages: true,
                        source: 'listing_data'
                    };
                }
            }
            // 画像なし
            return {
                mainImage: null,
                allImages: [],
                imageCount: 0,
                hasImages: false,
                source: 'none'
            };
        }
    }["useProductImages.useMemo"], [
        product
    ]);
}
_s(useProductImages, "nwk+m61qLgjDVUp4IGV/072DDN4=");
/**
 * 画像URLが有効かどうかをチェック
 */ function isValidImageUrl(url) {
    if (typeof url !== 'string' || !url.trim()) {
        return false;
    }
    // 基本的なURL形式チェック
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('//')) {
        return false;
    }
    // 画像拡張子またはクエリパラメータがある場合はOK
    const imageExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.webp',
        '.svg'
    ];
    const lowerUrl = url.toLowerCase();
    const hasImageExtension = imageExtensions.some((ext)=>lowerUrl.includes(ext));
    const hasImageIndicator = lowerUrl.includes('image') || lowerUrl.includes('img') || lowerUrl.includes('photo');
    // プレースホルダー画像を除外
    if (lowerUrl.includes('placeholder') || lowerUrl.includes('no-image') || lowerUrl.includes('noimage')) {
        return false;
    }
    return hasImageExtension || hasImageIndicator || url.includes('?');
}
function getProductImages(product) {
    var _product_gallery_images, _product_scraped_data_images, _product_scraped_data, _product_scraped_data1, _product_image_urls, _product_listing_data, _product_listing_data1, _product_listing_data2;
    if (!product) {
        return {
            mainImage: null,
            allImages: [],
            imageCount: 0,
            hasImages: false,
            source: 'none'
        };
    }
    // 同じロジックを関数として実行
    // 1. gallery_images
    if ((_product_gallery_images = product.gallery_images) === null || _product_gallery_images === void 0 ? void 0 : _product_gallery_images.length) {
        const filtered = product.gallery_images.filter(isValidImageUrl);
        if (filtered.length > 0) {
            return {
                mainImage: filtered[0],
                allImages: filtered,
                imageCount: filtered.length,
                hasImages: true,
                source: 'gallery_images'
            };
        }
    }
    // 2. scraped_data.images
    if ((_product_scraped_data = product.scraped_data) === null || _product_scraped_data === void 0 ? void 0 : (_product_scraped_data_images = _product_scraped_data.images) === null || _product_scraped_data_images === void 0 ? void 0 : _product_scraped_data_images.length) {
        const filtered = product.scraped_data.images.filter(isValidImageUrl);
        if (filtered.length > 0) {
            return {
                mainImage: filtered[0],
                allImages: filtered,
                imageCount: filtered.length,
                hasImages: true,
                source: 'scraped_data'
            };
        }
    }
    if (((_product_scraped_data1 = product.scraped_data) === null || _product_scraped_data1 === void 0 ? void 0 : _product_scraped_data1.image_url) && isValidImageUrl(product.scraped_data.image_url)) {
        return {
            mainImage: product.scraped_data.image_url,
            allImages: [
                product.scraped_data.image_url
            ],
            imageCount: 1,
            hasImages: true,
            source: 'scraped_data'
        };
    }
    // 3. image_urls
    if ((_product_image_urls = product.image_urls) === null || _product_image_urls === void 0 ? void 0 : _product_image_urls.length) {
        const filtered = product.image_urls.filter(isValidImageUrl);
        if (filtered.length > 0) {
            return {
                mainImage: filtered[0],
                allImages: filtered,
                imageCount: filtered.length,
                hasImages: true,
                source: 'image_urls'
            };
        }
    }
    if (product.image_url && isValidImageUrl(product.image_url)) {
        return {
            mainImage: product.image_url,
            allImages: [
                product.image_url
            ],
            imageCount: 1,
            hasImages: true,
            source: 'image_urls'
        };
    }
    // 4. listing_data
    const listingImages = ((_product_listing_data = product.listing_data) === null || _product_listing_data === void 0 ? void 0 : _product_listing_data.images) || ((_product_listing_data1 = product.listing_data) === null || _product_listing_data1 === void 0 ? void 0 : _product_listing_data1.gallery_images);
    if (listingImages === null || listingImages === void 0 ? void 0 : listingImages.length) {
        const filtered = listingImages.filter(isValidImageUrl);
        if (filtered.length > 0) {
            return {
                mainImage: filtered[0],
                allImages: filtered,
                imageCount: filtered.length,
                hasImages: true,
                source: 'listing_data'
            };
        }
    }
    if (((_product_listing_data2 = product.listing_data) === null || _product_listing_data2 === void 0 ? void 0 : _product_listing_data2.picture_url) && isValidImageUrl(product.listing_data.picture_url)) {
        return {
            mainImage: product.listing_data.picture_url,
            allImages: [
                product.listing_data.picture_url
            ],
            imageCount: 1,
            hasImages: true,
            source: 'listing_data'
        };
    }
    return {
        mainImage: null,
        allImages: [],
        imageCount: 0,
        hasImages: false,
        source: 'none'
    };
}
const __TURBOPACK__default__export__ = useProductImages;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/services/image/image-optimization.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ // ============================================================
// 型定義
// ============================================================
__turbopack_context__.s([
    "ERROR_PLACEHOLDER",
    ()=>ERROR_PLACEHOLDER,
    "IMAGE_SIZES",
    ()=>IMAGE_SIZES,
    "LAZY_LOAD_OPTIONS",
    ()=>LAZY_LOAD_OPTIONS,
    "PLACEHOLDER_IMAGE",
    ()=>PLACEHOLDER_IMAGE,
    "addThumbnailsToImages",
    ()=>addThumbnailsToImages,
    "clearImageCache",
    ()=>clearImageCache,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getCachedThumbnail",
    ()=>getCachedThumbnail,
    "getFirstImageUrl",
    ()=>getFirstImageUrl,
    "getOptimizedImageSet",
    ()=>getOptimizedImageSet,
    "getThumbnailUrl",
    ()=>getThumbnailUrl,
    "getTransformedUrl",
    ()=>getTransformedUrl,
    "normalizeImages",
    ()=>normalizeImages
]);
const IMAGE_SIZES = {
    thumbnail: {
        width: 80,
        height: 80,
        quality: 50
    },
    small: {
        width: 150,
        height: 150,
        quality: 60
    },
    medium: {
        width: 300,
        height: 300,
        quality: 70
    },
    large: {
        width: 600,
        height: 600,
        quality: 80
    },
    full: {
        width: 1000,
        height: 1000,
        quality: 85
    }
};
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
 */ function getEbayThumbnail(url, size) {
    const sizeMap = {
        thumbnail: 100,
        small: 200,
        medium: 400,
        large: 800,
        full: 1600
    };
    const targetSize = sizeMap[size];
    // s-l{number} パターンを置換
    if (url.includes('s-l')) {
        return url.replace(/s-l\d+/, "s-l".concat(targetSize));
    }
    // パターンがない場合はそのまま返す
    return url;
}
/**
 * Yahoo画像のサムネイルURLを生成
 * Yahoo Auctionは画像URLの末尾で制御
 */ function getYahooThumbnail(url, size) {
    // Yahoo Auctionの画像URLはそのまま返す（サイズ制御が難しい）
    return url;
}
/**
 * Mercari画像のサムネイルURLを生成
 */ function getMercariThumbnail(url, size) {
    // Mercariの画像URLはそのまま返す
    return url;
}
function getTransformedUrl(originalUrl, options) {
    if (!originalUrl) return '';
    // 1. Supabase Storage URL
    if (SUPABASE_STORAGE_PATTERN.test(originalUrl)) {
        let transformedUrl = originalUrl.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
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
 */ function getSizeKeyFromOptions(options) {
    const width = options.width || 100;
    if (width <= 100) return 'thumbnail';
    if (width <= 200) return 'small';
    if (width <= 400) return 'medium';
    if (width <= 800) return 'large';
    return 'full';
}
function getThumbnailUrl(originalUrl) {
    let size = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'thumbnail';
    return getTransformedUrl(originalUrl, IMAGE_SIZES[size]);
}
function getOptimizedImageSet(originalUrl) {
    return {
        original: originalUrl,
        thumbnail: getThumbnailUrl(originalUrl, 'thumbnail'),
        medium: getThumbnailUrl(originalUrl, 'medium'),
        large: getThumbnailUrl(originalUrl, 'large')
    };
}
const LAZY_LOAD_OPTIONS = {
    root: null,
    rootMargin: '500px',
    threshold: 0.01
};
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==';
const ERROR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZlZTJlMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2VmNDQ0NCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycjwvdGV4dD48L3N2Zz4=';
function getFirstImageUrl(images) {
    if (!images) return '';
    if (typeof images === 'string') return images;
    if (Array.isArray(images) && images.length > 0) return images[0];
    return '';
}
function normalizeImages(images) {
    if (!images) return [];
    if (typeof images === 'string') {
        try {
            const parsed = JSON.parse(images);
            if (Array.isArray(parsed)) return parsed;
            return [
                images
            ];
        } catch (e) {
            return [
                images
            ];
        }
    }
    if (Array.isArray(images)) return images.filter(Boolean);
    return [];
}
function addThumbnailsToImages(images) {
    return images.map((url)=>({
            original: url,
            thumbnail: getThumbnailUrl(url)
        }));
}
// ============================================================
// キャッシュ管理（メモリ）
// ============================================================
const imageCache = new Map();
const MAX_CACHE_SIZE = 1000; // 🚀 キャッシュサイズ増加
function getCachedThumbnail(originalUrl) {
    let size = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'thumbnail';
    const cacheKey = "".concat(originalUrl, ":").concat(size);
    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey);
    }
    const thumbnailUrl = getThumbnailUrl(originalUrl, size);
    if (imageCache.size >= MAX_CACHE_SIZE) {
        const firstKey = imageCache.keys().next().value;
        if (firstKey) imageCache.delete(firstKey);
    }
    imageCache.set(cacheKey, thumbnailUrl);
    return thumbnailUrl;
}
function clearImageCache() {
    imageCache.clear();
}
const __TURBOPACK__default__export__ = {
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
    LAZY_LOAD_OPTIONS
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/services/audit/audit-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/services/audit/audit-service.ts
/**
 * N3出品監査サービス - 3層フィルターアーキテクチャ
 * 
 * 【設計原則】
 * - 第1層：ルールエンジン（無料/即時）- 正規表現による矛盾検知
 * - 第2層：差分抽出（コスト最適化）- AI送信データの最小化
 * - 第3層：JSONパッチ（確実性）- ユーザー選択による反映
 * 
 * 【目的】
 * - HTSコード、原産国、素材の精度向上
 * - AIコストの最小化（80%以上をルールエンジンで処理）
 * - データの信頼性（エビデンス）の確保
 * 
 * 【Phase 1強化】
 * - トレカ特化ルール追加
 * - ブランド→原産国自動紐付け
 * - カテゴリベースのHTS自動推定
 */ __turbopack_context__.s([
    "applyAutoFixSuggestions",
    ()=>applyAutoFixSuggestions,
    "applySelectedPatches",
    ()=>applySelectedPatches,
    "auditProduct",
    ()=>auditProduct,
    "auditProducts",
    ()=>auditProducts,
    "default",
    ()=>__TURBOPACK__default__export__,
    "detectBatteryRisk",
    ()=>detectBatteryRisk,
    "detectFromCategory",
    ()=>detectFromCategory,
    "detectMaterialFromText",
    ()=>detectMaterialFromText,
    "detectOriginFromBrand",
    ()=>detectOriginFromBrand,
    "detectOriginFromTitle",
    ()=>detectOriginFromTitle,
    "extractForAiReview",
    ()=>extractForAiReview,
    "generateAiPromptData",
    ()=>generateAiPromptData,
    "generateAuditSummary",
    ()=>generateAuditSummary,
    "getAuditScoreColor",
    ()=>getAuditScoreColor,
    "getAuditSeverityColor",
    ()=>getAuditSeverityColor,
    "isTradingCard",
    ()=>isTradingCard,
    "parseAiResponse",
    ()=>parseAiResponse
]);
// ============================================================
// 定数：原産国キーワード
// ============================================================
/** 原産国を示すキーワード（優先度順） */ const ORIGIN_KEYWORDS = {
    'JP': [
        'japan',
        'japanese',
        '日本',
        '日本製',
        'made in japan',
        'nippon',
        'nihon',
        'jdm'
    ],
    'CN': [
        'china',
        'chinese',
        '中国',
        '中国製',
        'made in china',
        'prc'
    ],
    'KR': [
        'korea',
        'korean',
        '韓国',
        '韓国製',
        'made in korea',
        'rok',
        'hangul'
    ],
    'TW': [
        'taiwan',
        'taiwanese',
        '台湾',
        '台湾製',
        'made in taiwan',
        'roc'
    ],
    'US': [
        'usa',
        'american',
        'united states',
        'アメリカ',
        'made in usa',
        'made in u.s.a'
    ],
    'DE': [
        'germany',
        'german',
        'deutschland',
        'ドイツ',
        'made in germany'
    ],
    'GB': [
        'uk',
        'british',
        'england',
        'イギリス',
        'made in uk',
        'made in britain'
    ],
    'FR': [
        'france',
        'french',
        'フランス',
        'made in france'
    ],
    'IT': [
        'italy',
        'italian',
        'イタリア',
        'made in italy'
    ],
    'CH': [
        'switzerland',
        'swiss',
        'スイス',
        'made in switzerland'
    ]
};
// ============================================================
// 定数：ブランド→原産国マッピング（Phase 1強化）
// ============================================================
/** 有名ブランド→原産国（本社所在地）マッピング */ const BRAND_ORIGIN_MAP = {
    // 日本ブランド
    'canon': {
        country: 'JP',
        confidence: 0.9
    },
    'sony': {
        country: 'JP',
        confidence: 0.9
    },
    'nikon': {
        country: 'JP',
        confidence: 0.9
    },
    'fujifilm': {
        country: 'JP',
        confidence: 0.9
    },
    'panasonic': {
        country: 'JP',
        confidence: 0.9
    },
    'olympus': {
        country: 'JP',
        confidence: 0.9
    },
    'pentax': {
        country: 'JP',
        confidence: 0.9
    },
    'ricoh': {
        country: 'JP',
        confidence: 0.9
    },
    'tamron': {
        country: 'JP',
        confidence: 0.85
    },
    'sigma': {
        country: 'JP',
        confidence: 0.85
    },
    'tokina': {
        country: 'JP',
        confidence: 0.85
    },
    'toyota': {
        country: 'JP',
        confidence: 0.95
    },
    'honda': {
        country: 'JP',
        confidence: 0.95
    },
    'yamaha': {
        country: 'JP',
        confidence: 0.9
    },
    'seiko': {
        country: 'JP',
        confidence: 0.95
    },
    'casio': {
        country: 'JP',
        confidence: 0.9
    },
    'citizen': {
        country: 'JP',
        confidence: 0.9
    },
    'orient': {
        country: 'JP',
        confidence: 0.9
    },
    'bandai': {
        country: 'JP',
        confidence: 0.9
    },
    'takara': {
        country: 'JP',
        confidence: 0.9
    },
    'takaratomy': {
        country: 'JP',
        confidence: 0.9
    },
    'nintendo': {
        country: 'JP',
        confidence: 0.95
    },
    'konami': {
        country: 'JP',
        confidence: 0.9
    },
    'pokemon': {
        country: 'JP',
        confidence: 0.95
    },
    'sanrio': {
        country: 'JP',
        confidence: 0.95
    },
    'uniqlo': {
        country: 'JP',
        confidence: 0.85
    },
    // 韓国ブランド
    'samsung': {
        country: 'KR',
        confidence: 0.9
    },
    'lg': {
        country: 'KR',
        confidence: 0.9
    },
    'hyundai': {
        country: 'KR',
        confidence: 0.9
    },
    'kia': {
        country: 'KR',
        confidence: 0.9
    },
    // ドイツブランド
    'leica': {
        country: 'DE',
        confidence: 0.95
    },
    'zeiss': {
        country: 'DE',
        confidence: 0.95
    },
    'mercedes': {
        country: 'DE',
        confidence: 0.95
    },
    'bmw': {
        country: 'DE',
        confidence: 0.95
    },
    'porsche': {
        country: 'DE',
        confidence: 0.95
    },
    'audi': {
        country: 'DE',
        confidence: 0.95
    },
    'volkswagen': {
        country: 'DE',
        confidence: 0.95
    },
    'braun': {
        country: 'DE',
        confidence: 0.9
    },
    // スイスブランド（時計）
    'rolex': {
        country: 'CH',
        confidence: 0.98
    },
    'omega': {
        country: 'CH',
        confidence: 0.98
    },
    'tag heuer': {
        country: 'CH',
        confidence: 0.95
    },
    'tissot': {
        country: 'CH',
        confidence: 0.95
    },
    'swatch': {
        country: 'CH',
        confidence: 0.95
    },
    'patek philippe': {
        country: 'CH',
        confidence: 0.98
    },
    'audemars piguet': {
        country: 'CH',
        confidence: 0.98
    },
    // アメリカブランド
    'apple': {
        country: 'US',
        confidence: 0.9
    },
    'microsoft': {
        country: 'US',
        confidence: 0.9
    },
    'google': {
        country: 'US',
        confidence: 0.9
    },
    'gopro': {
        country: 'US',
        confidence: 0.9
    },
    'ford': {
        country: 'US',
        confidence: 0.95
    },
    'chevrolet': {
        country: 'US',
        confidence: 0.95
    },
    'harley davidson': {
        country: 'US',
        confidence: 0.95
    },
    // 中国ブランド
    'dji': {
        country: 'CN',
        confidence: 0.95
    },
    'huawei': {
        country: 'CN',
        confidence: 0.95
    },
    'xiaomi': {
        country: 'CN',
        confidence: 0.95
    },
    'oppo': {
        country: 'CN',
        confidence: 0.95
    },
    'vivo': {
        country: 'CN',
        confidence: 0.95
    },
    'lenovo': {
        country: 'CN',
        confidence: 0.9
    }
};
// ============================================================
// 定数：カテゴリ→HTS自動推定（Phase 1強化）
// ============================================================
/** トレカ関連カテゴリID */ const TRADING_CARD_CATEGORY_IDS = [
    '183454',
    '183456',
    '212',
    '2536',
    '213'
];
/** カテゴリ→HTS・素材の自動推定 */ const CATEGORY_HTS_MAP = {
    // トレカ
    '183454': {
        hts: '9504.40.00',
        material: 'Cardstock/Paper',
        confidence: 0.95,
        description: 'Trading Cards (CCG)'
    },
    '183456': {
        hts: '9504.40.00',
        material: 'Cardstock/Paper',
        confidence: 0.95,
        description: 'CCG Sealed Products'
    },
    '212': {
        hts: '9504.40.00',
        material: 'Cardstock/Paper',
        confidence: 0.9,
        description: 'Trading Cards'
    },
    // カメラ
    '31388': {
        hts: '9006.53.00',
        material: 'Electronics',
        confidence: 0.85,
        description: 'Digital Cameras'
    },
    '625': {
        hts: '9006.59.00',
        material: 'Electronics',
        confidence: 0.8,
        description: 'Camera Equipment'
    },
    // 時計
    '31387': {
        hts: '9102.11.00',
        material: 'Metal/Leather',
        confidence: 0.8,
        description: 'Wristwatches'
    },
    // おもちゃ・フィギュア
    '220': {
        hts: '9503.00.00',
        material: 'Plastic',
        confidence: 0.85,
        description: 'Action Figures'
    },
    '2624': {
        hts: '9503.00.00',
        material: 'Plastic',
        confidence: 0.85,
        description: 'Toys & Hobbies'
    },
    // ゲーム
    '139973': {
        hts: '9504.50.00',
        material: 'Electronics',
        confidence: 0.85,
        description: 'Video Games'
    }
};
// ============================================================
// 定数：素材キーワード
// ============================================================
/** 高関税素材キーワード */ const HIGH_DUTY_MATERIALS = {
    'leather': {
        keywords: [
            'leather',
            'レザー',
            '革',
            '本革',
            'genuine leather',
            'full grain',
            'calfskin',
            'cowhide'
        ],
        dutyRisk: 0.15
    },
    'silk': {
        keywords: [
            'silk',
            'シルク',
            '絹',
            '100% silk',
            'pure silk'
        ],
        dutyRisk: 0.12
    },
    'wool': {
        keywords: [
            'wool',
            'ウール',
            '羊毛',
            'merino',
            'cashmere',
            'カシミヤ',
            'angora'
        ],
        dutyRisk: 0.10
    },
    'cotton': {
        keywords: [
            'cotton',
            'コットン',
            '綿',
            '100% cotton'
        ],
        dutyRisk: 0.05
    },
    'linen': {
        keywords: [
            'linen',
            'リネン',
            '麻'
        ],
        dutyRisk: 0.06
    }
};
/** 低リスク素材（自動設定用） */ const LOW_RISK_MATERIALS = {
    'Cardstock/Paper': [
        'card',
        'cards',
        'カード',
        'trading card',
        'tcg',
        'ccg',
        'pokemon card',
        'yugioh',
        'magic the gathering'
    ],
    'Plastic': [
        'plastic',
        'プラスチック',
        'pvc',
        'abs',
        'figure',
        'figurine',
        'toy'
    ],
    'Electronics': [
        'electronic',
        'digital',
        'camera',
        'watch',
        'phone',
        'tablet'
    ],
    'Metal': [
        'metal',
        'steel',
        'aluminum',
        'brass',
        'copper',
        'silver',
        'gold'
    ]
};
// ============================================================
// 定数：リチウム電池リスク
// ============================================================
/** リチウム電池を含む可能性が高いカテゴリ・キーワード */ const BATTERY_RISK_CATEGORIES = [
    'cameras',
    'digital cameras',
    'カメラ',
    'デジカメ',
    'smartphones',
    'mobile phones',
    'スマートフォン',
    'スマホ',
    'laptops',
    'notebooks',
    'ノートパソコン',
    'ノートPC',
    'tablets',
    'タブレット',
    'ipad',
    'watches',
    'smartwatches',
    '時計',
    'スマートウォッチ',
    'apple watch',
    'drones',
    'ドローン',
    'quadcopter',
    'power banks',
    'モバイルバッテリー',
    'portable charger',
    'electric',
    '電動',
    'wireless',
    'bluetooth',
    'gopro',
    'action camera'
];
// ============================================================
// 定数：閾値
// ============================================================
const HIGH_DUTY_THRESHOLD = 0.05; // 5%
const LOW_PROFIT_THRESHOLD = 0.15; // 15%
const NEGATIVE_PROFIT_THRESHOLD = 0; // 0%
function detectOriginFromTitle(title) {
    const titleLower = title.toLowerCase();
    // 1. "Made in X" パターン（最高信頼度）
    for (const [countryCode, keywords] of Object.entries(ORIGIN_KEYWORDS)){
        for (const keyword of keywords){
            if (titleLower.includes("made in ".concat(keyword.toLowerCase()))) {
                return {
                    country: countryCode,
                    confidence: 0.95,
                    method: 'title_explicit'
                };
            }
        }
    }
    // 2. 単純なキーワードマッチ
    for (const [countryCode, keywords] of Object.entries(ORIGIN_KEYWORDS)){
        for (const keyword of keywords){
            if (titleLower.includes(keyword.toLowerCase())) {
                return {
                    country: countryCode,
                    confidence: 0.7,
                    method: 'title_keyword'
                };
            }
        }
    }
    return {
        country: null,
        confidence: 0,
        method: 'none'
    };
}
function detectOriginFromBrand(title) {
    const titleLower = title.toLowerCase();
    for (const [brand, info] of Object.entries(BRAND_ORIGIN_MAP)){
        // ブランド名の前後に単語境界があるか確認（部分一致を避ける）
        const brandPattern = new RegExp("\\b".concat(brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "\\b"), 'i');
        if (brandPattern.test(titleLower)) {
            return {
                country: info.country,
                confidence: info.confidence,
                brand
            };
        }
    }
    return {
        country: null,
        confidence: 0,
        brand: null
    };
}
function detectMaterialFromText(text) {
    const textLower = text.toLowerCase();
    // 1. 高リスク素材チェック
    for (const [material, { keywords, dutyRisk }] of Object.entries(HIGH_DUTY_MATERIALS)){
        for (const keyword of keywords){
            if (textLower.includes(keyword.toLowerCase())) {
                return {
                    material,
                    dutyRisk,
                    isHighRisk: dutyRisk > HIGH_DUTY_THRESHOLD
                };
            }
        }
    }
    // 2. 低リスク素材チェック（自動設定用）
    for (const [material, keywords] of Object.entries(LOW_RISK_MATERIALS)){
        for (const keyword of keywords){
            if (textLower.includes(keyword.toLowerCase())) {
                return {
                    material,
                    dutyRisk: 0,
                    isHighRisk: false
                };
            }
        }
    }
    return {
        material: null,
        dutyRisk: 0,
        isHighRisk: false
    };
}
function detectFromCategory(categoryId) {
    if (!categoryId) {
        return {
            hts: null,
            material: null,
            confidence: 0,
            description: null
        };
    }
    const mapping = CATEGORY_HTS_MAP[categoryId];
    if (mapping) {
        return {
            hts: mapping.hts,
            material: mapping.material,
            confidence: mapping.confidence,
            description: mapping.description
        };
    }
    return {
        hts: null,
        material: null,
        confidence: 0,
        description: null
    };
}
function isTradingCard(title, categoryId) {
    // カテゴリIDでの判定
    if (categoryId && TRADING_CARD_CATEGORY_IDS.includes(categoryId)) {
        return true;
    }
    // タイトルキーワードでの判定
    const titleLower = title.toLowerCase();
    const tradingCardKeywords = [
        'pokemon card',
        'ポケモンカード',
        'ポケカ',
        'yugioh',
        '遊戯王',
        'yu-gi-oh',
        'magic the gathering',
        'mtg',
        'one piece card',
        'ワンピースカード',
        'trading card',
        'tcg',
        'ccg',
        'weiss schwarz',
        'ヴァイスシュヴァルツ',
        'cardfight vanguard',
        'ヴァンガード'
    ];
    return tradingCardKeywords.some((keyword)=>titleLower.includes(keyword));
}
function detectBatteryRisk(title, category) {
    const textToCheck = "".concat(title, " ").concat(category || '').toLowerCase();
    // バッテリー関連キーワード
    const batteryKeywords = [
        'battery',
        'lithium',
        'li-ion',
        'lipo',
        'rechargeable',
        '充電',
        'バッテリー',
        'リチウム'
    ];
    for (const keyword of batteryKeywords){
        if (textToCheck.includes(keyword)) {
            return true;
        }
    }
    // カテゴリ/キーワードベースの判定
    for (const riskCategory of BATTERY_RISK_CATEGORIES){
        if (textToCheck.includes(riskCategory.toLowerCase())) {
            return true;
        }
    }
    return false;
}
function auditProduct(product) {
    var _product_origin_country, _product_listing_data, _product_listing_data1;
    const results = [];
    const aiReviewFields = [];
    const autoFixSuggestions = [];
    const timestamp = new Date().toISOString();
    const title = product.title || '';
    const categoryId = product.category_id || product.ebay_category_id || null;
    // ----------------------------------------
    // 0. トレカ検出（Phase 1強化）
    // ----------------------------------------
    const isTcg = isTradingCard(title, categoryId);
    if (isTcg) {
        results.push({
            ruleId: 'trading_card_detected',
            severity: 'info',
            field: 'category',
            currentValue: categoryId,
            message: 'Trading card detected - auto-suggestion available',
            messageJa: 'トレカを検出しました - 自動設定が利用可能です',
            autoFixable: true
        });
        // HTSとMaterialの自動提案
        if (!product.hts_code) {
            autoFixSuggestions.push({
                field: 'hts_code',
                currentValue: null,
                suggestedValue: '9504.40.00',
                confidence: 0.95,
                reason: 'Trading cards are classified under HTS 9504.40',
                ruleId: 'trading_card_detected'
            });
        }
        if (!product.material) {
            autoFixSuggestions.push({
                field: 'material',
                currentValue: null,
                suggestedValue: 'Cardstock/Paper',
                confidence: 0.95,
                reason: 'Trading cards are made of cardstock/paper',
                ruleId: 'trading_card_detected'
            });
        }
    }
    // ----------------------------------------
    // 1. 原産国チェック
    // ----------------------------------------
    const titleOrigin = detectOriginFromTitle(title);
    const brandOrigin = detectOriginFromBrand(title);
    const currentOrigin = (_product_origin_country = product.origin_country) === null || _product_origin_country === void 0 ? void 0 : _product_origin_country.toUpperCase();
    // ブランドから原産国推定（Phase 1強化）
    if (brandOrigin.country && !currentOrigin) {
        results.push({
            ruleId: 'brand_origin_suggested',
            severity: 'info',
            field: 'origin_country',
            currentValue: null,
            expectedValue: brandOrigin.country,
            message: 'Brand "'.concat(brandOrigin.brand, '" suggests origin "').concat(brandOrigin.country, '"'),
            messageJa: "ブランド「".concat(brandOrigin.brand, "」から原産国「").concat(brandOrigin.country, "」を推定"),
            suggestion: 'Set origin_country to "'.concat(brandOrigin.country, '"'),
            autoFixable: brandOrigin.confidence >= 0.85
        });
        if (brandOrigin.confidence >= 0.85) {
            autoFixSuggestions.push({
                field: 'origin_country',
                currentValue: null,
                suggestedValue: brandOrigin.country,
                confidence: brandOrigin.confidence,
                reason: 'Brand "'.concat(brandOrigin.brand, '" is headquartered in ').concat(brandOrigin.country),
                ruleId: 'brand_origin_suggested'
            });
        }
    }
    // タイトルと設定の矛盾チェック
    if (titleOrigin.country && currentOrigin && titleOrigin.country !== currentOrigin) {
        results.push({
            ruleId: 'origin_mismatch',
            severity: 'warning',
            field: 'origin_country',
            currentValue: currentOrigin,
            expectedValue: titleOrigin.country,
            message: 'Title suggests origin "'.concat(titleOrigin.country, '" but data shows "').concat(currentOrigin, '"'),
            messageJa: "タイトルは「".concat(titleOrigin.country, "」を示唆していますが、設定は「").concat(currentOrigin, "」です"),
            suggestion: 'Change origin_country to "'.concat(titleOrigin.country, '"'),
            autoFixable: titleOrigin.confidence >= 0.9
        });
    }
    if (!currentOrigin && titleOrigin.country) {
        results.push({
            ruleId: 'title_origin_conflict',
            severity: 'info',
            field: 'origin_country',
            currentValue: null,
            expectedValue: titleOrigin.country,
            message: 'Origin country not set but title suggests "'.concat(titleOrigin.country, '"'),
            messageJa: "原産国が未設定ですが、タイトルは「".concat(titleOrigin.country, "」を示唆しています"),
            suggestion: 'Set origin_country to "'.concat(titleOrigin.country, '"'),
            autoFixable: titleOrigin.confidence >= 0.9
        });
        if (titleOrigin.confidence >= 0.9) {
            autoFixSuggestions.push({
                field: 'origin_country',
                currentValue: null,
                suggestedValue: titleOrigin.country,
                confidence: titleOrigin.confidence,
                reason: 'Title contains "'.concat(titleOrigin.method, '" pattern'),
                ruleId: 'title_origin_conflict'
            });
        }
    }
    // ----------------------------------------
    // 2. HTSコードチェック
    // ----------------------------------------
    const categoryHts = detectFromCategory(categoryId);
    if (!product.hts_code) {
        if (categoryHts.hts) {
            // カテゴリから推定可能
            results.push({
                ruleId: 'category_hts_suggested',
                severity: 'info',
                field: 'hts_code',
                currentValue: null,
                expectedValue: categoryHts.hts,
                message: 'HTS "'.concat(categoryHts.hts, '" suggested based on category (').concat(categoryHts.description, ")"),
                messageJa: "カテゴリ（".concat(categoryHts.description, "）からHTS「").concat(categoryHts.hts, "」を推定"),
                suggestion: 'Set hts_code to "'.concat(categoryHts.hts, '"'),
                autoFixable: categoryHts.confidence >= 0.85
            });
            if (categoryHts.confidence >= 0.85) {
                autoFixSuggestions.push({
                    field: 'hts_code',
                    currentValue: null,
                    suggestedValue: categoryHts.hts,
                    confidence: categoryHts.confidence,
                    reason: 'Category "'.concat(categoryHts.description, '" maps to HTS ').concat(categoryHts.hts),
                    ruleId: 'category_hts_suggested'
                });
            }
        } else {
            // 推定不可 → AI必要
            results.push({
                ruleId: 'hts_missing',
                severity: 'error',
                field: 'hts_code',
                currentValue: null,
                message: 'HTS code is not set and cannot be auto-determined',
                messageJa: 'HTSコードが未設定で、自動推定もできません',
                autoFixable: false
            });
            aiReviewFields.push('hts_code');
        }
    }
    // 高関税チェック
    const dutyRate = product.hts_duty_rate || product.duty_rate || 0;
    if (dutyRate > HIGH_DUTY_THRESHOLD) {
        results.push({
            ruleId: 'hts_high_duty',
            severity: 'warning',
            field: 'hts_duty_rate',
            currentValue: dutyRate,
            message: "High duty rate: ".concat((dutyRate * 100).toFixed(1), "% (threshold: ").concat(HIGH_DUTY_THRESHOLD * 100, "%)"),
            messageJa: "高関税: ".concat((dutyRate * 100).toFixed(1), "%（閾値: ").concat(HIGH_DUTY_THRESHOLD * 100, "%）"),
            autoFixable: false
        });
    }
    // ----------------------------------------
    // 3. 素材チェック
    // ----------------------------------------
    const materialDetected = detectMaterialFromText(title);
    if (materialDetected.material && !product.material) {
        const severity = materialDetected.isHighRisk ? 'warning' : 'info';
        results.push({
            ruleId: materialDetected.isHighRisk ? 'material_high_risk' : 'material_auto_detected',
            severity,
            field: 'material',
            currentValue: null,
            expectedValue: materialDetected.material,
            message: 'Material "'.concat(materialDetected.material, '" detected in title').concat(materialDetected.isHighRisk ? ' (high duty risk)' : ''),
            messageJa: "素材「".concat(materialDetected.material, "」をタイトルから検出").concat(materialDetected.isHighRisk ? '（高関税リスク）' : ''),
            suggestion: 'Set material to "'.concat(materialDetected.material, '"'),
            autoFixable: !materialDetected.isHighRisk
        });
        if (!materialDetected.isHighRisk) {
            autoFixSuggestions.push({
                field: 'material',
                currentValue: null,
                suggestedValue: materialDetected.material,
                confidence: 0.8,
                reason: "Title contains material keyword",
                ruleId: 'material_auto_detected'
            });
        }
    } else if (!product.material && categoryHts.material) {
        // カテゴリから素材を推定
        autoFixSuggestions.push({
            field: 'material',
            currentValue: null,
            suggestedValue: categoryHts.material,
            confidence: categoryHts.confidence,
            reason: 'Category suggests material "'.concat(categoryHts.material, '"'),
            ruleId: 'category_hts_suggested'
        });
    }
    if (materialDetected.isHighRisk) {
        results.push({
            ruleId: 'material_high_risk',
            severity: 'warning',
            field: 'material',
            currentValue: materialDetected.material,
            message: 'Material "'.concat(materialDetected.material, '" has high duty risk: ').concat((materialDetected.dutyRisk * 100).toFixed(0), "%"),
            messageJa: "素材「".concat(materialDetected.material, "」は高関税リスクがあります: ").concat((materialDetected.dutyRisk * 100).toFixed(0), "%"),
            autoFixable: false
        });
    }
    // ----------------------------------------
    // 4. 重量チェック
    // ----------------------------------------
    const weight = (_product_listing_data = product.listing_data) === null || _product_listing_data === void 0 ? void 0 : _product_listing_data.weight_g;
    if (!weight || weight <= 0) {
        results.push({
            ruleId: 'weight_missing',
            severity: 'warning',
            field: 'weight_g',
            currentValue: weight || null,
            message: 'Weight is not set (required for shipping calculation)',
            messageJa: '重量が未設定です（送料計算に必要）',
            autoFixable: false
        });
        aiReviewFields.push('weight_g');
    }
    // ----------------------------------------
    // 5. 利益率チェック
    // ----------------------------------------
    const profitMargin = product.profit_margin || ((_product_listing_data1 = product.listing_data) === null || _product_listing_data1 === void 0 ? void 0 : _product_listing_data1.ddu_profit_margin) || 0;
    if (profitMargin < NEGATIVE_PROFIT_THRESHOLD) {
        results.push({
            ruleId: 'profit_negative',
            severity: 'error',
            field: 'profit_margin',
            currentValue: profitMargin,
            message: "Negative profit: ".concat((profitMargin * 100).toFixed(1), "%"),
            messageJa: "赤字: ".concat((profitMargin * 100).toFixed(1), "%"),
            autoFixable: false
        });
    } else if (profitMargin > 0 && profitMargin < LOW_PROFIT_THRESHOLD) {
        results.push({
            ruleId: 'profit_low',
            severity: 'warning',
            field: 'profit_margin',
            currentValue: profitMargin,
            message: "Low profit margin: ".concat((profitMargin * 100).toFixed(1), "% (threshold: ").concat(LOW_PROFIT_THRESHOLD * 100, "%)"),
            messageJa: "低利益率: ".concat((profitMargin * 100).toFixed(1), "%（閾値: ").concat(LOW_PROFIT_THRESHOLD * 100, "%）"),
            autoFixable: false
        });
    }
    // ----------------------------------------
    // 6. リチウム電池リスク
    // ----------------------------------------
    const hasBatteryRisk = detectBatteryRisk(title, product.category_name || product.category);
    if (hasBatteryRisk) {
        results.push({
            ruleId: 'battery_risk',
            severity: 'info',
            field: 'battery',
            currentValue: null,
            message: 'Product may contain lithium battery (shipping restrictions may apply)',
            messageJa: 'リチウム電池を含む可能性があります（配送制限の可能性）',
            autoFixable: false
        });
    }
    // ----------------------------------------
    // 7. VEROブランドチェック
    // ----------------------------------------
    if (product.is_vero_brand) {
        results.push({
            ruleId: 'vero_brand',
            severity: 'warning',
            field: 'vero_brand',
            currentValue: product.vero_brand_name || 'Unknown',
            message: "VERO brand detected: ".concat(product.vero_brand_name || 'Unknown'),
            messageJa: "VEROブランド検出: ".concat(product.vero_brand_name || '不明'),
            autoFixable: false
        });
    }
    // ----------------------------------------
    // 総合スコア計算
    // ----------------------------------------
    const errorCount = results.filter((r)=>r.severity === 'error').length;
    const warningCount = results.filter((r)=>r.severity === 'warning').length;
    const infoCount = results.filter((r)=>r.severity === 'info').length;
    // スコア: 100から減点方式
    const score = Math.max(0, 100 - errorCount * 30 - warningCount * 10 - infoCount * 2);
    // 総合重大度
    let overallSeverity = 'ok';
    if (errorCount > 0) {
        overallSeverity = 'error';
    } else if (warningCount > 0) {
        overallSeverity = 'warning';
    } else if (infoCount > 0) {
        overallSeverity = 'info';
    }
    return {
        productId: product.id,
        timestamp,
        overallSeverity,
        score,
        results,
        needsAiReview: aiReviewFields.length > 0 || errorCount > 0,
        aiReviewFields,
        autoFixSuggestions
    };
}
function auditProducts(products) {
    return products.map(auditProduct);
}
function extractForAiReview(products, auditReports) {
    const requests = [];
    for (const report of auditReports){
        if (!report.needsAiReview) continue;
        const product = products.find((p)=>p.id === report.productId);
        if (!product) continue;
        // 最小限のデータのみ抽出
        requests.push({
            productId: product.id,
            title: product.title || '',
            category: product.category_name || product.category || undefined,
            currentHts: product.hts_code || undefined,
            currentOrigin: product.origin_country || undefined,
            currentMaterial: product.material || undefined,
            auditIssues: report.results.map((r)=>r.ruleId)
        });
    }
    return requests;
}
function generateAiPromptData(requests) {
    const items = requests.map((req)=>({
            id: req.productId,
            title: req.title,
            category: req.category,
            current: {
                hts: req.currentHts,
                origin: req.currentOrigin,
                material: req.currentMaterial
            },
            issues: req.auditIssues
        }));
    return JSON.stringify(items, null, 2);
}
function parseAiResponse(responseJson) {
    try {
        const parsed = JSON.parse(responseJson);
        if (!Array.isArray(parsed)) {
            throw new Error('Response must be an array');
        }
        return parsed.map((item)=>({
                productId: item.id || item.productId,
                patches: (item.patches || []).map((p)=>{
                    var _p_currentValue, _p_suggestedValue, _ref, _p_confidence;
                    return {
                        field: p.field,
                        currentValue: (_p_currentValue = p.currentValue) !== null && _p_currentValue !== void 0 ? _p_currentValue : null,
                        suggestedValue: (_ref = (_p_suggestedValue = p.suggestedValue) !== null && _p_suggestedValue !== void 0 ? _p_suggestedValue : p.suggested) !== null && _ref !== void 0 ? _ref : null,
                        confidence: (_p_confidence = p.confidence) !== null && _p_confidence !== void 0 ? _p_confidence : 0.5,
                        reason: p.reason || '',
                        selected: false
                    };
                }),
                auditNote: item.auditNote || item.note || ''
            }));
    } catch (error) {
        console.error('Failed to parse AI response:', error);
        return [];
    }
}
function applySelectedPatches(product, patches) {
    const updates = {};
    for (const patch of patches){
        if (!patch.selected || patch.suggestedValue === null) continue;
        switch(patch.field){
            case 'hts_code':
                updates.hts_code = String(patch.suggestedValue);
                break;
            case 'origin_country':
                updates.origin_country = String(patch.suggestedValue);
                break;
            case 'material':
                updates.material = String(patch.suggestedValue);
                break;
            case 'weight_g':
                if (product.listing_data) {
                    updates.listing_data = {
                        ...product.listing_data,
                        weight_g: Number(patch.suggestedValue)
                    };
                }
                break;
        }
    }
    return updates;
}
function applyAutoFixSuggestions(product, suggestions) {
    let minConfidence = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0.85;
    const updates = {};
    for (const suggestion of suggestions){
        if (suggestion.confidence < minConfidence) continue;
        switch(suggestion.field){
            case 'hts_code':
                if (!product.hts_code) {
                    updates.hts_code = String(suggestion.suggestedValue);
                }
                break;
            case 'origin_country':
                if (!product.origin_country) {
                    updates.origin_country = String(suggestion.suggestedValue);
                }
                break;
            case 'material':
                if (!product.material) {
                    updates.material = String(suggestion.suggestedValue);
                }
                break;
        }
    }
    return updates;
}
function getAuditSeverityColor(severity) {
    switch(severity){
        case 'error':
            return '#ef4444';
        case 'warning':
            return '#f59e0b';
        case 'info':
            return '#3b82f6';
        case 'ok':
            return '#10b981';
        default:
            return '#6b7280';
    }
}
function getAuditScoreColor(score) {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 50) return '#f97316';
    return '#ef4444';
}
function generateAuditSummary(reports) {
    const total = reports.length;
    const errorCount = reports.filter((r)=>r.overallSeverity === 'error').length;
    const warningCount = reports.filter((r)=>r.overallSeverity === 'warning').length;
    const okCount = reports.filter((r)=>r.overallSeverity === 'ok').length;
    const averageScore = total > 0 ? Math.round(reports.reduce((sum, r)=>sum + r.score, 0) / total) : 0;
    const needsAiReview = reports.filter((r)=>r.needsAiReview).length;
    const autoFixableCount = reports.filter((r)=>r.autoFixSuggestions.length > 0).length;
    return {
        total,
        errorCount,
        warningCount,
        okCount,
        averageScore,
        needsAiReview,
        autoFixableCount
    };
}
const __TURBOPACK__default__export__ = {
    auditProduct,
    auditProducts,
    extractForAiReview,
    generateAiPromptData,
    parseAiResponse,
    applySelectedPatches,
    applyAutoFixSuggestions,
    detectOriginFromTitle,
    detectOriginFromBrand,
    detectMaterialFromText,
    detectFromCategory,
    detectBatteryRisk,
    isTradingCard,
    getAuditSeverityColor,
    getAuditScoreColor,
    generateAuditSummary
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/services/audit/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// lib/services/audit/index.ts
/**
 * 監査サービスのエクスポート
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$audit$2f$audit$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/services/audit/audit-service.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_00735569._.js.map