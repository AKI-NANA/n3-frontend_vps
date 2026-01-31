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
"[project]/n3-frontend_vps/lib/product/completeness-check.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/product/completeness-check.ts
/**
 * 商品データ完全性チェック
 * 出品に必要な項目が全て揃っているかを判定
 */ __turbopack_context__.s([
    "checkProductCompleteness",
    ()=>checkProductCompleteness,
    "filterApprovalReady",
    ()=>filterApprovalReady,
    "getCompletenessBorderColor",
    ()=>getCompletenessBorderColor,
    "getCompletenessColor",
    ()=>getCompletenessColor,
    "isReadyForApproval",
    ()=>isReadyForApproval
]);
function checkProductCompleteness(product) {
    var _this, _listingData_image_urls;
    // listing_dataからも確認
    const listingData = ((_this = product) === null || _this === void 0 ? void 0 : _this.listing_data) || {};
    var _product_profit_margin, _listingData_profit_margin;
    const checks = {
        englishTitle: !!(product.english_title || product.title_en || listingData.english_title),
        categoryId: !!(product.category_id || product.ebay_category_id || listingData.category_id || listingData.ebay_category_id),
        htsCode: !!product.hts_code,
        originCountry: !!product.origin_country,
        // フィルター: nullまたはundefinedの場合は警告、falseの場合はエラー
        filterPassed: product.filter_passed !== false,
        profitPositive: ((_product_profit_margin = product.profit_margin) !== null && _product_profit_margin !== void 0 ? _product_profit_margin : 0) > 0 || ((_listingData_profit_margin = listingData.profit_margin) !== null && _listingData_profit_margin !== void 0 ? _listingData_profit_margin : 0) > 0,
        hasImage: !!(product.primary_image_url || product.image_url || product.images && product.images.length > 0 || ((_listingData_image_urls = listingData.image_urls) === null || _listingData_image_urls === void 0 ? void 0 : _listingData_image_urls.length) > 0),
        hasPrice: !!(product.ddp_price_usd || product.price_usd || listingData.ddp_price_usd || listingData.price_usd),
        // 🔥 HTMLチェック - 複数フィールドに対応
        hasHtmlDescription: !!(product.html_content || product.html_description || listingData.html_description || listingData.html_description_en || listingData.description_html),
        // 🔥 配送ポリシーチェック
        hasShipping: !!(product.shipping_policy || listingData.shipping_service || listingData.usa_shipping_policy_name || listingData.carrier_service)
    };
    const missingItems = [];
    const warningItems = [];
    // 必須項目のチェック
    if (!checks.englishTitle) missingItems.push('英語タイトル');
    if (!checks.categoryId) missingItems.push('カテゴリーID');
    if (!checks.htsCode) missingItems.push('HTSコード');
    if (!checks.originCountry) missingItems.push('原産国');
    if (!checks.profitPositive) missingItems.push('利益率');
    if (!checks.hasImage) missingItems.push('画像');
    if (!checks.hasPrice) missingItems.push('価格');
    if (!checks.hasHtmlDescription) missingItems.push('HTML Description');
    if (!checks.hasShipping) missingItems.push('配送設定');
    // フィルターは警告扱い（手動確認可能）
    if (!checks.filterPassed) {
        // filter_passed === false の場合のみ警告
        if (product.filter_passed === false) {
            warningItems.push('フィルター未通過（要確認）');
        }
    } else if (product.filter_passed === null || product.filter_passed === undefined) {
        // まだチェックされていない場合
        warningItems.push('フィルター未実行');
    }
    const missingCount = missingItems.length;
    const totalChecks = Object.keys(checks).length;
    const passedChecks = Object.values(checks).filter((v)=>v).length;
    const completionScore = Math.round(passedChecks / totalChecks * 100);
    return {
        isComplete: missingCount === 0,
        missingCount,
        checks,
        missingItems,
        warningItems,
        completionScore
    };
}
function isReadyForApproval(product) {
    return checkProductCompleteness(product).isComplete;
}
function filterApprovalReady(products) {
    return products.filter(isReadyForApproval);
}
function getCompletenessColor(score) {
    if (score >= 100) return '#dcfce7'; // 緑 - 完璧
    if (score >= 80) return '#fef9c3'; // 黄 - もう少し
    if (score >= 60) return '#fed7aa'; // オレンジ - 半分以上
    return '#fecaca'; // 赤 - 多くの項目が不足
}
function getCompletenessBorderColor(score) {
    if (score >= 100) return '#86efac'; // 緑
    if (score >= 80) return '#fde047'; // 黄
    if (score >= 60) return '#fdba74'; // オレンジ
    return '#fca5a5'; // 赤
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/product/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// lib/product/index.ts
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$product$2f$completeness$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/product/completeness-check.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/api/errors.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/api/errors.ts
/**
 * API エラー定義 - 統一されたエラーハンドリング
 * 
 * 全てのAPIエラーはこのクラスを使用して統一的に処理する
 */ // ============================================================
// エラーコード定義
// ============================================================
__turbopack_context__.s([
    "API_ERROR_CODES",
    ()=>API_ERROR_CODES,
    "ApiError",
    ()=>ApiError,
    "ConflictError",
    ()=>ConflictError,
    "ValidationError",
    ()=>ValidationError,
    "createApiError",
    ()=>createApiError,
    "createNetworkError",
    ()=>createNetworkError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
const API_ERROR_CODES = {
    // 認証・認可
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    // クライアントエラー
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    VALIDATION_ERROR: 422,
    TOO_MANY_REQUESTS: 429,
    // サーバーエラー
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    // ネットワークエラー
    NETWORK_ERROR: 0,
    TIMEOUT: -1
};
class ApiError extends Error {
    /** 認証エラーかどうか */ get isAuthError() {
        return this.code === API_ERROR_CODES.UNAUTHORIZED || this.code === API_ERROR_CODES.FORBIDDEN;
    }
    /** 競合エラー（楽観的ロック）かどうか */ get isConflict() {
        return this.code === API_ERROR_CODES.CONFLICT;
    }
    /** バリデーションエラーかどうか */ get isValidationError() {
        return this.code === API_ERROR_CODES.VALIDATION_ERROR;
    }
    /** ネットワークエラーかどうか */ get isNetworkError() {
        return this.code === API_ERROR_CODES.NETWORK_ERROR || this.code === API_ERROR_CODES.TIMEOUT;
    }
    /** リトライ可能かどうか */ get isRetryable() {
        return this.code === API_ERROR_CODES.NETWORK_ERROR || this.code === API_ERROR_CODES.TIMEOUT || this.code === API_ERROR_CODES.SERVICE_UNAVAILABLE || this.code === API_ERROR_CODES.TOO_MANY_REQUESTS;
    }
    /** ユーザーフレンドリーなメッセージを取得 */ getUserMessage() {
        switch(this.code){
            case API_ERROR_CODES.UNAUTHORIZED:
                return 'ログインが必要です。再度ログインしてください。';
            case API_ERROR_CODES.FORBIDDEN:
                return 'この操作を実行する権限がありません。';
            case API_ERROR_CODES.NOT_FOUND:
                return '要求されたリソースが見つかりません。';
            case API_ERROR_CODES.CONFLICT:
                return '他のユーザーがこのデータを更新しました。画面をリロードして再試行してください。';
            case API_ERROR_CODES.VALIDATION_ERROR:
                return '入力内容に問題があります。内容を確認してください。';
            case API_ERROR_CODES.TOO_MANY_REQUESTS:
                return 'リクエストが多すぎます。しばらく待ってから再試行してください。';
            case API_ERROR_CODES.NETWORK_ERROR:
                return 'ネットワーク接続を確認してください。';
            case API_ERROR_CODES.TIMEOUT:
                return 'サーバーからの応答がありません。しばらく待ってから再試行してください。';
            case API_ERROR_CODES.SERVICE_UNAVAILABLE:
                return 'サービスが一時的に利用できません。しばらく待ってから再試行してください。';
            default:
                return 'エラーが発生しました。しばらく待ってから再試行してください。';
        }
    }
    /** JSON形式でエクスポート */ toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            details: this.details,
            requestId: this.requestId,
            timestamp: this.timestamp
        };
    }
    constructor(message, code, options){
        super(message), (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "code", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "details", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "requestId", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "timestamp", void 0), (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "originalError", void 0);
        this.name = 'ApiError';
        this.code = code;
        this.details = options === null || options === void 0 ? void 0 : options.details;
        this.requestId = options === null || options === void 0 ? void 0 : options.requestId;
        this.timestamp = new Date().toISOString();
        this.originalError = options === null || options === void 0 ? void 0 : options.originalError;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
}
function createApiError(response, data) {
    const code = response.status;
    const requestId = response.headers.get('x-request-id') || undefined;
    let message = response.statusText || 'Unknown error';
    let details;
    // レスポンスボディからエラー情報を抽出
    if (data && typeof data === 'object') {
        const errorData = data;
        if (typeof errorData.message === 'string') {
            message = errorData.message;
        }
        if (Array.isArray(errorData.errors)) {
            details = errorData.errors;
        }
        if (Array.isArray(errorData.details)) {
            details = errorData.details;
        }
    }
    return new ApiError(message, code, {
        details,
        requestId
    });
}
function createNetworkError(error) {
    const isTimeout = error instanceof Error && error.name === 'AbortError';
    return new ApiError(isTimeout ? 'Request timeout' : 'Network error', isTimeout ? API_ERROR_CODES.TIMEOUT : API_ERROR_CODES.NETWORK_ERROR, {
        originalError: error
    });
}
class ConflictError extends ApiError {
    constructor(message, conflictData, requestId){
        super(message, API_ERROR_CODES.CONFLICT, {
            requestId
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "conflictData", void 0);
        this.name = 'ConflictError';
        this.conflictData = conflictData;
    }
}
class ValidationError extends ApiError {
    /** フィールドごとのエラーマップを取得 */ getFieldErrors() {
        const fieldErrors = {};
        if (this.details) {
            for (const detail of this.details){
                if (detail.field) {
                    if (!fieldErrors[detail.field]) {
                        fieldErrors[detail.field] = [];
                    }
                    fieldErrors[detail.field].push(detail.message);
                }
            }
        }
        return fieldErrors;
    }
    constructor(message, details, requestId){
        super(message, API_ERROR_CODES.VALIDATION_ERROR, {
            details,
            requestId
        });
        this.name = 'ValidationError';
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/api/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/api/client.ts
/**
 * API Client - 統一されたHTTPクライアント
 * 
 * 機能:
 * - 統一されたエラーハンドリング
 * - 認証トークン自動付与
 * - リトライロジック
 * - タイムアウト処理
 * - 楽観的ロック対応
 */ __turbopack_context__.s([
    "apiClient",
    ()=>apiClient,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getCurrentUserId",
    ()=>getCurrentUserId
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$api$2f$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/api/errors.ts [app-client] (ecmascript)");
;
;
// ============================================================
// 設定
// ============================================================
const DEFAULT_TIMEOUT = 30000; // 30秒
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒
// ============================================================
// 認証トークン取得（実装に応じて変更）
// ============================================================
async function getAuthToken() {
    // TODO: 実際の認証実装に応じて変更
    // 例: Firebase Auth, Supabase Auth, Cookie, localStorage など
    if ("TURBOPACK compile-time truthy", 1) {
        return localStorage.getItem('auth_token');
    }
    //TURBOPACK unreachable
    ;
}
function getCurrentUserId() {
    // TODO: 実際の認証実装に応じて変更
    if ("TURBOPACK compile-time truthy", 1) {
        return localStorage.getItem('user_id');
    }
    //TURBOPACK unreachable
    ;
}
// ============================================================
// APIクライアント
// ============================================================
class ApiClient {
    /**
   * リクエストを実行
   */ async request(endpoint) {
        let config = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        const { body, timeout = DEFAULT_TIMEOUT, retries = 0, expectedVersion, skipAuth = false, headers: customHeaders = {}, ...fetchConfig } = config;
        // URL構築
        const url = this.buildUrl(endpoint);
        // ヘッダー構築
        const headers = new Headers(customHeaders);
        headers.set('Content-Type', 'application/json');
        // 認証トークン
        if (!skipAuth) {
            const token = await getAuthToken();
            if (token) {
                headers.set('Authorization', "Bearer ".concat(token));
            }
        }
        // 楽観的ロック用のバージョン
        if (expectedVersion !== undefined) {
            headers.set('If-Match', String(expectedVersion));
        }
        // AbortController（タイムアウト用）
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), timeout);
        try {
            const response = await fetch(url, {
                ...fetchConfig,
                headers,
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            // エラーレスポンスの処理
            if (!response.ok) {
                const errorData = await this.parseErrorResponse(response);
                // 競合エラー（楽観的ロック）
                if (response.status === 409 && errorData) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$api$2f$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConflictError"](errorData.message || 'Conflict detected', {
                        currentVersion: expectedVersion || 0,
                        serverVersion: errorData.serverVersion || 0,
                        updatedBy: errorData.updatedBy,
                        updatedAt: errorData.updatedAt
                    }, response.headers.get('x-request-id') || undefined);
                }
                // 認証エラー
                if (response.status === 401) {
                    this.handleUnauthorized();
                }
                throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$api$2f$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createApiError"])(response, errorData);
            }
            // 成功レスポンス
            const data = await this.parseSuccessResponse(response);
            return {
                data,
                status: response.status,
                headers: response.headers
            };
        } catch (error) {
            clearTimeout(timeoutId);
            // ApiErrorはそのまま再throw
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$api$2f$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ApiError"]) {
                throw error;
            }
            // ネットワークエラー
            const apiError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$api$2f$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createNetworkError"])(error);
            // リトライ可能な場合
            if (apiError.isRetryable && retries < MAX_RETRIES) {
                console.log("[ApiClient] Retrying... (".concat(retries + 1, "/").concat(MAX_RETRIES, ")"));
                await this.delay(RETRY_DELAY * (retries + 1));
                return this.request(endpoint, {
                    ...config,
                    retries: retries + 1
                });
            }
            throw apiError;
        }
    }
    /**
   * GETリクエスト
   */ async get(endpoint, config) {
        const response = await this.request(endpoint, {
            ...config,
            method: 'GET'
        });
        return response.data;
    }
    /**
   * POSTリクエスト
   */ async post(endpoint, body, config) {
        const response = await this.request(endpoint, {
            ...config,
            method: 'POST',
            body
        });
        return response.data;
    }
    /**
   * PUTリクエスト
   */ async put(endpoint, body, config) {
        const response = await this.request(endpoint, {
            ...config,
            method: 'PUT',
            body
        });
        return response.data;
    }
    /**
   * PATCHリクエスト
   */ async patch(endpoint, body, config) {
        const response = await this.request(endpoint, {
            ...config,
            method: 'PATCH',
            body
        });
        return response.data;
    }
    /**
   * DELETEリクエスト
   */ async delete(endpoint, config) {
        const response = await this.request(endpoint, {
            ...config,
            method: 'DELETE'
        });
        return response.data;
    }
    // ============================================================
    // ヘルパーメソッド
    // ============================================================
    buildUrl(endpoint) {
        if (endpoint.startsWith('http')) {
            return endpoint;
        }
        return "".concat(this.baseUrl).concat(endpoint);
    }
    async parseSuccessResponse(response) {
        const contentType = response.headers.get('content-type');
        if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('application/json')) {
            return response.json();
        }
        // JSONでない場合はテキストとして返す
        const text = await response.text();
        return text;
    }
    async parseErrorResponse(response) {
        try {
            const contentType = response.headers.get('content-type');
            if (contentType === null || contentType === void 0 ? void 0 : contentType.includes('application/json')) {
                return await response.json();
            }
        } catch (e) {
        // パースエラーは無視
        }
        return null;
    }
    handleUnauthorized() {
        // TODO: 認証エラー時の処理
        // 例: ログインページにリダイレクト
        console.warn('[ApiClient] Unauthorized - redirect to login');
    // if (typeof window !== 'undefined') {
    //   window.location.href = '/login';
    // }
    }
    delay(ms) {
        return new Promise((resolve)=>setTimeout(resolve, ms));
    }
    constructor(baseUrl = ''){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "baseUrl", void 0);
        this.baseUrl = baseUrl;
    }
}
const apiClient = new ApiClient('/api');
const __TURBOPACK__default__export__ = apiClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/audit/audit-log.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/audit/audit-log.ts
/**
 * 監査ログ - 変更履歴の追跡
 * 
 * 機能:
 * - 誰が、いつ、何を、どのように変更したかを記録
 * - フロントエンド側の変更追跡
 * - サーバー側API連携
 */ __turbopack_context__.s([
    "calculateChanges",
    ()=>calculateChanges,
    "fetchAuditLogs",
    ()=>fetchAuditLogs,
    "getLocalAuditLog",
    ()=>getLocalAuditLog,
    "logAuditLocal",
    ()=>logAuditLocal,
    "logProductBulkUpdate",
    ()=>logProductBulkUpdate,
    "logProductDelete",
    ()=>logProductDelete,
    "logProductUpdate",
    ()=>logProductUpdate,
    "sendAuditLog",
    ()=>sendAuditLog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/api/client.ts [app-client] (ecmascript)");
;
// ============================================================
// ローカル監査ログ（デバッグ・開発用）
// ============================================================
const LOCAL_AUDIT_LOG = [];
const MAX_LOCAL_LOGS = 100;
function logAuditLocal(entry) {
    const fullEntry = {
        id: "local-".concat(Date.now(), "-").concat(Math.random().toString(36).slice(2)),
        timestamp: new Date().toISOString(),
        userId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$api$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserId"])(),
        ...entry
    };
    LOCAL_AUDIT_LOG.unshift(fullEntry);
    // ログ数制限
    if (LOCAL_AUDIT_LOG.length > MAX_LOCAL_LOGS) {
        LOCAL_AUDIT_LOG.pop();
    }
    // 開発時はコンソールにも出力
    if ("TURBOPACK compile-time truthy", 1) {
        console.log('[AuditLog]', fullEntry);
    }
}
function getLocalAuditLog(filter) {
    let logs = [
        ...LOCAL_AUDIT_LOG
    ];
    if (filter) {
        if (filter.entityType) {
            logs = logs.filter((l)=>l.entityType === filter.entityType);
        }
        if (filter.entityId) {
            logs = logs.filter((l)=>Array.isArray(l.entityId) ? l.entityId.includes(filter.entityId) : l.entityId === filter.entityId);
        }
        if (filter.userId) {
            logs = logs.filter((l)=>l.userId === filter.userId);
        }
        if (filter.action) {
            logs = logs.filter((l)=>l.action === filter.action);
        }
        if (filter.startDate) {
            logs = logs.filter((l)=>l.timestamp >= filter.startDate);
        }
        if (filter.endDate) {
            logs = logs.filter((l)=>l.timestamp <= filter.endDate);
        }
        if (filter.offset) {
            logs = logs.slice(filter.offset);
        }
        if (filter.limit) {
            logs = logs.slice(0, filter.limit);
        }
    }
    return logs;
}
function calculateChanges(original, updated) {
    const changes = {};
    for (const key of Object.keys(updated)){
        const oldValue = original[key];
        const newValue = updated[key];
        // 値が実際に変更されている場合のみ記録
        if (!isEqual(oldValue, newValue)) {
            changes[key] = {
                old: oldValue,
                new: newValue
            };
        }
    }
    return changes;
}
/**
 * 簡易的な等価比較
 */ function isEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    if (typeof a !== typeof b) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        return a.every((item, index)=>isEqual(item, b[index]));
    }
    if (typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        return keysA.every((key)=>isEqual(a[key], b[key]));
    }
    return false;
}
async function sendAuditLog(entry) {
    // ローカルにも記録
    logAuditLocal(entry);
// TODO: サーバーAPIが実装されたら有効化
// try {
//   await apiClient.post('/api/audit-logs', {
//     ...entry,
//     timestamp: new Date().toISOString(),
//     userId: getCurrentUserId(),
//   });
// } catch (error) {
//   console.error('[AuditLog] Failed to send:', error);
// }
}
async function fetchAuditLogs(filter) {
    // TODO: サーバーAPIが実装されたら変更
    // const logs = await apiClient.get<AuditLogEntry[]>('/api/audit-logs', { params: filter });
    // return logs;
    // 現時点ではローカルログを返す
    return getLocalAuditLog(filter);
}
function logProductUpdate(productId, original, updates) {
    const changes = calculateChanges(original, updates);
    if (Object.keys(changes).length > 0) {
        sendAuditLog({
            action: 'UPDATE',
            entityType: 'Product',
            entityId: productId,
            changes
        });
    }
}
function logProductBulkUpdate(productIds, commonUpdates) {
    sendAuditLog({
        action: 'BULK_UPDATE',
        entityType: 'Product',
        entityId: productIds,
        metadata: commonUpdates ? {
            updates: commonUpdates
        } : undefined
    });
}
function logProductDelete(productIds) {
    sendAuditLog({
        action: productIds.length > 1 ? 'BULK_DELETE' : 'DELETE',
        entityType: 'Product',
        entityId: productIds.length > 1 ? productIds : productIds[0]
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/audit/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// lib/audit/index.ts
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$audit$2f$audit$2d$log$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/audit/audit-log.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/validation/listing-validator.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/validation/listing-validator.ts
/**
 * 出品前バリデーションシステム
 * 
 * 機能:
 * 1. 必須項目チェック（出品不可）
 * 2. 推奨項目チェック（警告表示）
 * 3. 利益率チェック（赤字防止）
 * 4. VEROブランドチェック
 * 5. 完成度スコア計算
 * 
 * @version 2.0.0
 * @date 2025-12-21
 */ __turbopack_context__.s([
    "canListProduct",
    ()=>canListProduct,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getCompletionRate",
    ()=>getCompletionRate,
    "getValidationSummary",
    ()=>getValidationSummary,
    "validateForListing",
    ()=>validateForListing,
    "validateProducts",
    ()=>validateProducts
]);
// ============================================================
// 定数
// ============================================================
/** 必須フィールド定義 */ const REQUIRED_FIELDS = [
    {
        field: 'english_title',
        label: '英語タイトル',
        check: (p)=>!!(p.english_title || p.title_en) && (p.english_title || p.title_en).length >= 10
    },
    {
        field: 'price_usd',
        label: '価格(USD)',
        check: (p)=>{
            var _p_listing_data;
            const price = p.price_usd || ((_p_listing_data = p.listing_data) === null || _p_listing_data === void 0 ? void 0 : _p_listing_data.price_usd) || p.selling_price;
            return price && price > 0;
        }
    },
    {
        field: 'primary_image_url',
        label: 'メイン画像',
        check: (p)=>{
            var _p_images, _p_gallery_images;
            return !!(p.primary_image_url || ((_p_images = p.images) === null || _p_images === void 0 ? void 0 : _p_images[0]) || ((_p_gallery_images = p.gallery_images) === null || _p_gallery_images === void 0 ? void 0 : _p_gallery_images[0]));
        }
    },
    {
        field: 'category_id',
        label: 'eBayカテゴリ',
        check: (p)=>!!(p.category_id || p.ebay_category_id)
    },
    {
        field: 'condition_id',
        label: 'コンディション',
        check: (p)=>!!(p.condition_id || p.ebay_condition_id || p.condition_name)
    }
];
/** 推奨フィールド定義 */ const RECOMMENDED_FIELDS = [
    {
        field: 'hts_code',
        label: 'HTSコード',
        check: (p)=>!!(p.hts_code && p.hts_code.length >= 6),
        weight: 3
    },
    {
        field: 'origin_country',
        label: '原産国',
        check: (p)=>!!(p.origin_country && p.origin_country.length === 2),
        weight: 2
    },
    {
        field: 'weight_g',
        label: '重量',
        check: (p)=>{
            var _p_listing_data;
            const weight = p.weight_g || ((_p_listing_data = p.listing_data) === null || _p_listing_data === void 0 ? void 0 : _p_listing_data.weight_g);
            return weight && weight > 0;
        },
        weight: 2
    },
    {
        field: 'shipping_cost_usd',
        label: '送料',
        check: (p)=>{
            var _p_listing_data;
            const shipping = p.shipping_cost_usd || ((_p_listing_data = p.listing_data) === null || _p_listing_data === void 0 ? void 0 : _p_listing_data.shipping_cost_usd);
            return shipping !== undefined && shipping >= 0;
        },
        weight: 2
    },
    {
        field: 'material',
        label: '素材',
        check: (p)=>!!(p.material && p.material.length >= 2),
        weight: 1
    },
    {
        field: 'dimensions',
        label: 'サイズ',
        check: (p)=>{
            const ld = p.listing_data || {};
            return ld.width_cm > 0 || ld.length_cm > 0 || ld.height_cm > 0;
        },
        weight: 1
    },
    {
        field: 'description',
        label: '商品説明',
        check: (p)=>{
            const desc = p.english_description || p.description_en || p.html_content;
            return desc && desc.length >= 50;
        },
        weight: 2
    },
    {
        field: 'gallery_images',
        label: '追加画像',
        check: (p)=>{
            const images = p.gallery_images || p.images || [];
            return images.length >= 3;
        },
        weight: 1
    }
];
/** デフォルト設定 */ const DEFAULT_CONFIG = {
    checkProfit: true,
    minProfitMargin: 0,
    checkVero: true,
    checkHts: true,
    strictMode: false
};
// ============================================================
// ユーティリティ関数
// ============================================================
/**
 * ネストされたオブジェクトの値を取得
 */ function getNestedValue(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((current, key)=>current === null || current === void 0 ? void 0 : current[key], obj);
}
/**
 * 利益率を取得
 */ function getProfitMargin(product) {
    var _product_listing_data, _product_listing_data1, _product_listing_data2;
    return product.profit_margin || ((_product_listing_data = product.listing_data) === null || _product_listing_data === void 0 ? void 0 : _product_listing_data.ddu_profit_margin) || ((_product_listing_data1 = product.listing_data) === null || _product_listing_data1 === void 0 ? void 0 : _product_listing_data1.ddp_profit_margin) || ((_product_listing_data2 = product.listing_data) === null || _product_listing_data2 === void 0 ? void 0 : _product_listing_data2.profit_margin);
}
/**
 * 利益額を取得
 */ function getProfitAmount(product) {
    var _product_listing_data, _product_listing_data1, _product_listing_data2;
    return product.profit_amount_usd || ((_product_listing_data = product.listing_data) === null || _product_listing_data === void 0 ? void 0 : _product_listing_data.ddu_profit_usd) || ((_product_listing_data1 = product.listing_data) === null || _product_listing_data1 === void 0 ? void 0 : _product_listing_data1.ddp_profit_usd) || ((_product_listing_data2 = product.listing_data) === null || _product_listing_data2 === void 0 ? void 0 : _product_listing_data2.profit_amount_usd);
}
function validateForListing(product) {
    let config = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const cfg = {
        ...DEFAULT_CONFIG,
        ...config
    };
    const errors = [];
    const warnings = [];
    const infos = [];
    const missingFields = [];
    // ============================================================
    // 1. 必須項目チェック
    // ============================================================
    for (const { field, label, check } of REQUIRED_FIELDS){
        if (!check(product)) {
            errors.push({
                field,
                label,
                message: "".concat(label, "が設定されていません"),
                severity: 'error'
            });
            missingFields.push(field);
        }
    }
    // ============================================================
    // 2. 推奨項目チェック
    // ============================================================
    for (const { field, label, check } of RECOMMENDED_FIELDS){
        if (!check(product)) {
            if (cfg.strictMode) {
                errors.push({
                    field,
                    label,
                    message: "".concat(label, "が未設定です"),
                    severity: 'error'
                });
            } else {
                warnings.push({
                    field,
                    label,
                    message: "".concat(label, "が未設定です（推奨）"),
                    severity: 'warning'
                });
            }
            missingFields.push(field);
        }
    }
    // ============================================================
    // 3. 利益率チェック
    // ============================================================
    if (cfg.checkProfit) {
        const profitMargin = getProfitMargin(product);
        const profitAmount = getProfitAmount(product);
        if (profitMargin !== undefined) {
            if (profitMargin < 0) {
                errors.push({
                    field: 'profit_margin',
                    label: '利益率',
                    message: "🚨 赤字出品になります（利益率: ".concat(profitMargin.toFixed(1), "%、損失: $").concat(Math.abs(profitAmount || 0).toFixed(2), "）"),
                    severity: 'error',
                    value: profitMargin
                });
            } else if (profitMargin < cfg.minProfitMargin) {
                warnings.push({
                    field: 'profit_margin',
                    label: '利益率',
                    message: "利益率が低いです（".concat(profitMargin.toFixed(1), "%）"),
                    severity: 'warning',
                    value: profitMargin
                });
            } else if (profitMargin < 10) {
                infos.push({
                    field: 'profit_margin',
                    label: '利益率',
                    message: "利益率: ".concat(profitMargin.toFixed(1), "%（$").concat((profitAmount || 0).toFixed(2), "）"),
                    severity: 'info',
                    value: profitMargin
                });
            }
        } else {
            warnings.push({
                field: 'profit_margin',
                label: '利益率',
                message: '利益率が計算されていません',
                severity: 'warning'
            });
        }
    }
    // ============================================================
    // 4. VEROチェック
    // ============================================================
    if (cfg.checkVero && product.is_vero_brand) {
        errors.push({
            field: 'is_vero_brand',
            label: 'VEROブランド',
            message: '⛔ VEROブランドのため出品できません',
            severity: 'error',
            value: true
        });
    }
    // ============================================================
    // 5. HTSコード形式チェック
    // ============================================================
    if (cfg.checkHts && product.hts_code) {
        const htsCode = product.hts_code.replace(/\D/g, '');
        if (htsCode.length < 6) {
            warnings.push({
                field: 'hts_code',
                label: 'HTSコード',
                message: 'HTSコードが不完全です（6桁以上必要）',
                severity: 'warning',
                value: product.hts_code
            });
        }
    }
    // ============================================================
    // 6. 完成度計算
    // ============================================================
    const requiredWeight = REQUIRED_FIELDS.length * 3; // 必須は重み3
    const recommendedWeight = RECOMMENDED_FIELDS.reduce((sum, f)=>sum + f.weight, 0);
    const totalWeight = requiredWeight + recommendedWeight;
    let earnedWeight = 0;
    // 必須項目
    for (const { check } of REQUIRED_FIELDS){
        if (check(product)) earnedWeight += 3;
    }
    // 推奨項目
    for (const { check, weight } of RECOMMENDED_FIELDS){
        if (check(product)) earnedWeight += weight;
    }
    const completionRate = Math.round(earnedWeight / totalWeight * 100);
    // ============================================================
    // 7. サマリー生成
    // ============================================================
    let summary = '';
    if (errors.length === 0 && warnings.length === 0) {
        summary = '✅ 出品準備完了';
    } else if (errors.length === 0) {
        summary = "⚠️ ".concat(warnings.length, "件の警告があります");
    } else {
        summary = "❌ ".concat(errors.length, "件のエラーがあります");
    }
    return {
        isValid: errors.length === 0,
        canList: errors.length === 0,
        errors,
        warnings,
        infos,
        completionRate,
        missingFields,
        summary
    };
}
function validateProducts(products) {
    let config = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const results = new Map();
    for (const product of products){
        const id = String(product.id);
        results.set(id, validateForListing(product, config));
    }
    return results;
}
function getValidationSummary(results) {
    const total = results.size;
    let valid = 0;
    let invalid = 0;
    let totalCompletion = 0;
    const errorCounts = new Map();
    results.forEach((result)=>{
        if (result.isValid) {
            valid++;
        } else {
            invalid++;
        }
        totalCompletion += result.completionRate;
        for (const error of result.errors){
            errorCounts.set(error.field, (errorCounts.get(error.field) || 0) + 1);
        }
    });
    const commonErrors = Array.from(errorCounts.entries()).map((param)=>{
        let [field, count] = param;
        return {
            field,
            count
        };
    }).sort((a, b)=>b.count - a.count).slice(0, 5);
    return {
        total,
        valid,
        invalid,
        averageCompletion: total > 0 ? Math.round(totalCompletion / total) : 0,
        commonErrors
    };
}
function canListProduct(product) {
    const result = validateForListing(product);
    return result.canList;
}
function getCompletionRate(product) {
    const result = validateForListing(product);
    return result.completionRate;
}
const __TURBOPACK__default__export__ = {
    validateForListing,
    validateProducts,
    getValidationSummary,
    canListProduct,
    getCompletionRate,
    REQUIRED_FIELDS,
    RECOMMENDED_FIELDS
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/lib/services/sm/candidate-scoring.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/services/sm/candidate-scoring.ts
/**
 * SM（SellerMirror）分析候補スコアリングシステム
 * 
 * 機能:
 * 1. SM分析結果から最適な候補を自動選択
 * 2. タイトル類似度、価格妥当性、情報量でスコアリング
 * 3. 人間確認用のランキング表示
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */ // ============================================================
// 型定義
// ============================================================
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getBestCandidate",
    ()=>getBestCandidate,
    "getTopCandidates",
    ()=>getTopCandidates,
    "scoreCandidates",
    ()=>scoreCandidates,
    "shouldAutoSelect",
    ()=>shouldAutoSelect
]);
// ============================================================
// デフォルト設定
// ============================================================
const DEFAULT_CONFIG = {
    weights: {
        titleSimilarity: 35,
        priceScore: 30,
        infoQuality: 20,
        sellerTrust: 15
    },
    priceRange: {
        minRatio: 0.5,
        maxRatio: 2.0
    },
    minScore: 40
};
// ============================================================
// ユーティリティ関数
// ============================================================
/**
 * 文字列のトークン化（正規化）
 */ function tokenize(text) {
    if (!text) return new Set();
    return new Set(text.toLowerCase().replace(/[^\w\s\u3000-\u9fff]/g, ' ').split(/\s+/).filter((token)=>token.length >= 2));
}
/**
 * Jaccard類似度計算
 */ function jaccardSimilarity(set1, set2) {
    if (set1.size === 0 && set2.size === 0) return 0;
    const intersection = new Set([
        ...set1
    ].filter((x)=>set2.has(x)));
    const union = new Set([
        ...set1,
        ...set2
    ]);
    return intersection.size / union.size;
}
/**
 * タイトル類似度計算（0-100）
 */ function calculateTitleSimilarity(candidateTitle, productContext) {
    const candidateTokens = tokenize(candidateTitle);
    // 日本語タイトルとの比較
    const jpTokens = tokenize(productContext.title);
    const jpSimilarity = jaccardSimilarity(candidateTokens, jpTokens);
    // 英語タイトルとの比較（あれば）
    let enSimilarity = 0;
    if (productContext.englishTitle) {
        const enTokens = tokenize(productContext.englishTitle);
        enSimilarity = jaccardSimilarity(candidateTokens, enTokens);
    }
    // 高い方を採用
    const similarity = Math.max(jpSimilarity, enSimilarity);
    return Math.round(similarity * 100);
}
/**
 * 価格スコア計算（0-100）
 */ function calculatePriceScore(candidatePrice, productContext, config) {
    const warnings = [];
    // 基準価格（期待価格 or 原価の1.5倍）
    const basePrice = productContext.expectedPrice || (productContext.costPrice || 0) * 1.5;
    if (!basePrice || basePrice <= 0) {
        // 基準価格がない場合は中間スコア
        return {
            score: 50,
            warnings: [
                '基準価格が設定されていません'
            ]
        };
    }
    const priceRatio = candidatePrice / basePrice;
    // 範囲外チェック
    if (priceRatio < config.priceRange.minRatio) {
        warnings.push("価格が低すぎる可能性（基準の".concat(Math.round(priceRatio * 100), "%）"));
        return {
            score: 20,
            warnings
        };
    }
    if (priceRatio > config.priceRange.maxRatio) {
        warnings.push("価格が高すぎる可能性（基準の".concat(Math.round(priceRatio * 100), "%）"));
        return {
            score: 30,
            warnings
        };
    }
    // 理想範囲（0.8-1.2）なら高スコア
    if (priceRatio >= 0.8 && priceRatio <= 1.2) {
        return {
            score: 100,
            warnings
        };
    }
    // 許容範囲（0.6-0.8, 1.2-1.5）
    if (priceRatio >= 0.6 && priceRatio <= 1.5) {
        return {
            score: 70,
            warnings
        };
    }
    // それ以外
    return {
        score: 50,
        warnings
    };
}
/**
 * 情報品質スコア計算（0-100）
 */ function calculateInfoQuality(candidate) {
    var _candidate_images;
    let score = 0;
    // 画像数（最大30点）
    const imageCount = candidate.imageCount || ((_candidate_images = candidate.images) === null || _candidate_images === void 0 ? void 0 : _candidate_images.length) || 0;
    score += Math.min(imageCount, 12) * 2.5;
    // Item Specifics（最大30点）
    const specificsCount = Object.keys(candidate.itemSpecifics || {}).length;
    score += Math.min(specificsCount, 10) * 3;
    // コンディション情報（10点）
    if (candidate.condition || candidate.conditionId) score += 10;
    // 送料情報（10点）
    if (candidate.shippingCost !== undefined) score += 10;
    // 販売実績（20点）
    if (candidate.soldCount && candidate.soldCount > 0) {
        score += Math.min(candidate.soldCount, 10) * 2;
    }
    return Math.min(score, 100);
}
/**
 * 出品者信頼度スコア計算（0-100）
 */ function calculateSellerTrust(candidate) {
    let score = 50; // ベーススコア
    // 評価がある場合
    if (candidate.sellerRating !== undefined) {
        if (candidate.sellerRating >= 99) score = 100;
        else if (candidate.sellerRating >= 98) score = 90;
        else if (candidate.sellerRating >= 95) score = 70;
        else if (candidate.sellerRating >= 90) score = 50;
        else score = 30;
    }
    return score;
}
function scoreCandidates(candidates, productContext) {
    let config = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const cfg = {
        ...DEFAULT_CONFIG,
        ...config
    };
    cfg.weights = {
        ...DEFAULT_CONFIG.weights,
        ...config.weights
    };
    cfg.priceRange = {
        ...DEFAULT_CONFIG.priceRange,
        ...config.priceRange
    };
    const scoredCandidates = candidates.map((candidate)=>{
        const warnings = [];
        // 各スコア計算
        const titleSimilarity = calculateTitleSimilarity(candidate.title, productContext);
        const { score: priceScore, warnings: priceWarnings } = calculatePriceScore(candidate.price, productContext, cfg);
        warnings.push(...priceWarnings);
        const infoQuality = calculateInfoQuality(candidate);
        const sellerTrust = calculateSellerTrust(candidate);
        // ボーナス計算
        let bonus = 0;
        // コンディション一致ボーナス
        if (productContext.condition && candidate.condition) {
            const conditionMatch = productContext.condition.toLowerCase().includes(candidate.condition.toLowerCase().split(' ')[0]);
            if (conditionMatch) bonus += 5;
        }
        // 重み付き合計スコア
        const totalScore = Math.round((titleSimilarity * cfg.weights.titleSimilarity + priceScore * cfg.weights.priceScore + infoQuality * cfg.weights.infoQuality + sellerTrust * cfg.weights.sellerTrust) / 100 + bonus);
        // 推奨度判定
        let recommendation;
        if (totalScore >= 70) recommendation = 'best';
        else if (totalScore >= 55) recommendation = 'good';
        else if (totalScore >= cfg.minScore) recommendation = 'acceptable';
        else recommendation = 'low';
        return {
            ...candidate,
            score: totalScore,
            scoreBreakdown: {
                titleSimilarity,
                priceScore,
                infoQuality,
                sellerTrust,
                bonus
            },
            rank: 0,
            recommendation,
            warnings
        };
    });
    // スコア順にソート & ランク付け
    scoredCandidates.sort((a, b)=>b.score - a.score);
    scoredCandidates.forEach((candidate, index)=>{
        candidate.rank = index + 1;
    });
    return scoredCandidates;
}
function getBestCandidate(candidates, productContext) {
    let config = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const scored = scoreCandidates(candidates, productContext, config);
    if (scored.length === 0) return null;
    const best = scored[0];
    // 最低スコアを満たしているか
    const cfg = {
        ...DEFAULT_CONFIG,
        ...config
    };
    if (best.score < cfg.minScore) {
        console.warn("[SM Scoring] Best candidate score (".concat(best.score, ") below minimum (").concat(cfg.minScore, ")"));
    }
    return best;
}
function getTopCandidates(candidates, productContext) {
    let topN = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 5, config = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const scored = scoreCandidates(candidates, productContext, config);
    return scored.slice(0, topN);
}
function shouldAutoSelect(bestCandidate) {
    let minAutoSelectScore = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 75;
    if (!bestCandidate) return false;
    return bestCandidate.score >= minAutoSelectScore && bestCandidate.warnings.length === 0 && bestCandidate.recommendation === 'best';
}
const __TURBOPACK__default__export__ = {
    scoreCandidates,
    getBestCandidate,
    getTopCandidates,
    shouldAutoSelect
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/store/product/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// store/product/types.ts
/**
 * Product Store 共通型定義
 */ __turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/store/product/domainStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// store/product/domainStore.ts
/**
 * Product Domain Store - クライアントドメイン状態
 * 
 * 責務:
 * - 未保存の変更追跡 (modifiedProducts)
 * - 選択状態 (selectedIds)
 * - 新規作成中のデータ (draftProduct)
 * 
 * 特徴:
 * - Immer による安全な状態更新
 * - DevTools 連携
 * - サーバーデータは保持しない（React Query の責務）
 */ __turbopack_context__.s([
    "getModifiedProductsData",
    ()=>getModifiedProductsData,
    "getSelectedIdsArray",
    ()=>getSelectedIdsArray,
    "productDomainActions",
    ()=>productDomainActions,
    "useIsModifiedSelector",
    ()=>useIsModifiedSelector,
    "useIsSelectedSelector",
    ()=>useIsSelectedSelector,
    "useModifiedCountSelector",
    ()=>useModifiedCountSelector,
    "useModifiedIdsSelector",
    ()=>useModifiedIdsSelector,
    "useProductChangeSelector",
    ()=>useProductChangeSelector,
    "useProductDomainStore",
    ()=>useProductDomainStore,
    "useSelectedCountSelector",
    ()=>useSelectedCountSelector,
    "useSelectedIdsSelector",
    ()=>useSelectedIdsSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware/immer.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
;
// ============================================================
// 初期状態
// ============================================================
const initialState = {
    modifiedProducts: {},
    selectedIds: new Set(),
    draftProduct: null,
    saveError: null
};
const useProductDomainStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeWithSelector"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["immer"])((set, get)=>({
        ...initialState,
        // ========================================
        // 変更追跡
        // ========================================
        trackChange: (productId, original, updates)=>{
            set((state)=>{
                const existing = state.modifiedProducts[productId];
                if (existing) {
                    // 既存の変更に追加
                    state.modifiedProducts[productId] = {
                        original: existing.original,
                        current: {
                            ...existing.current,
                            ...updates
                        },
                        changedAt: new Date().toISOString()
                    };
                } else {
                    // 新規変更
                    state.modifiedProducts[productId] = {
                        original,
                        current: updates,
                        changedAt: new Date().toISOString()
                    };
                }
            });
        },
        updateChange: (productId, updates)=>{
            set((state)=>{
                const existing = state.modifiedProducts[productId];
                if (existing) {
                    state.modifiedProducts[productId].current = {
                        ...existing.current,
                        ...updates
                    };
                    state.modifiedProducts[productId].changedAt = new Date().toISOString();
                }
            });
        },
        discardChange: (productId)=>{
            set((state)=>{
                delete state.modifiedProducts[productId];
            });
        },
        discardAllChanges: ()=>{
            set((state)=>{
                state.modifiedProducts = {};
            });
        },
        markAsSaved: (productIds)=>{
            set((state)=>{
                for (const id of productIds){
                    delete state.modifiedProducts[id];
                }
            });
        },
        // ========================================
        // 選択
        // ========================================
        select: (productId)=>{
            set((state)=>{
                state.selectedIds = new Set(state.selectedIds).add(productId);
            });
        },
        deselect: (productId)=>{
            set((state)=>{
                const newSet = new Set(state.selectedIds);
                newSet.delete(productId);
                state.selectedIds = newSet;
            });
        },
        toggleSelect: (productId)=>{
            set((state)=>{
                const newSet = new Set(state.selectedIds);
                if (newSet.has(productId)) {
                    newSet.delete(productId);
                } else {
                    newSet.add(productId);
                }
                state.selectedIds = newSet;
            });
        },
        selectAll: (productIds)=>{
            set((state)=>{
                state.selectedIds = new Set(productIds);
            });
        },
        deselectAll: ()=>{
            set((state)=>{
                state.selectedIds = new Set();
            });
        },
        setSelectedIds: (ids)=>{
            set((state)=>{
                state.selectedIds = ids;
            });
        },
        // ========================================
        // ドラフト
        // ========================================
        setDraft: (product)=>{
            set((state)=>{
                state.draftProduct = product;
            });
        },
        updateDraft: (updates)=>{
            set((state)=>{
                if (state.draftProduct) {
                    state.draftProduct = {
                        ...state.draftProduct,
                        ...updates
                    };
                }
            });
        },
        clearDraft: ()=>{
            set((state)=>{
                state.draftProduct = null;
            });
        },
        // ========================================
        // エラー
        // ========================================
        setSaveError: (error)=>{
            set((state)=>{
                state.saveError = error;
            });
        },
        // ========================================
        // リセット
        // ========================================
        reset: ()=>{
            set(initialState);
        }
    }))), {
    name: 'ProductDomainStore'
}));
const useModifiedIdsSelector = ()=>{
    _s();
    return useProductDomainStore({
        "useModifiedIdsSelector.useProductDomainStore": (state)=>Object.keys(state.modifiedProducts)
    }["useModifiedIdsSelector.useProductDomainStore"]);
};
_s(useModifiedIdsSelector, "NZsRl/Yk0znE5p2zXrOpdpWahAA=", false, function() {
    return [
        useProductDomainStore
    ];
});
const useModifiedCountSelector = ()=>{
    _s1();
    return useProductDomainStore({
        "useModifiedCountSelector.useProductDomainStore": (state)=>Object.keys(state.modifiedProducts).length
    }["useModifiedCountSelector.useProductDomainStore"]);
};
_s1(useModifiedCountSelector, "NZsRl/Yk0znE5p2zXrOpdpWahAA=", false, function() {
    return [
        useProductDomainStore
    ];
});
const useIsModifiedSelector = (productId)=>{
    _s2();
    return useProductDomainStore({
        "useIsModifiedSelector.useProductDomainStore": (state)=>productId in state.modifiedProducts
    }["useIsModifiedSelector.useProductDomainStore"]);
};
_s2(useIsModifiedSelector, "NZsRl/Yk0znE5p2zXrOpdpWahAA=", false, function() {
    return [
        useProductDomainStore
    ];
});
const useProductChangeSelector = (productId)=>{
    _s3();
    return useProductDomainStore({
        "useProductChangeSelector.useProductDomainStore": (state)=>state.modifiedProducts[productId]
    }["useProductChangeSelector.useProductDomainStore"]);
};
_s3(useProductChangeSelector, "NZsRl/Yk0znE5p2zXrOpdpWahAA=", false, function() {
    return [
        useProductDomainStore
    ];
});
const useSelectedIdsSelector = ()=>{
    _s4();
    return useProductDomainStore({
        "useSelectedIdsSelector.useProductDomainStore": (state)=>state.selectedIds
    }["useSelectedIdsSelector.useProductDomainStore"]);
};
_s4(useSelectedIdsSelector, "NZsRl/Yk0znE5p2zXrOpdpWahAA=", false, function() {
    return [
        useProductDomainStore
    ];
});
const useSelectedCountSelector = ()=>{
    _s5();
    return useProductDomainStore({
        "useSelectedCountSelector.useProductDomainStore": (state)=>state.selectedIds.size
    }["useSelectedCountSelector.useProductDomainStore"]);
};
_s5(useSelectedCountSelector, "NZsRl/Yk0znE5p2zXrOpdpWahAA=", false, function() {
    return [
        useProductDomainStore
    ];
});
const useIsSelectedSelector = (productId)=>{
    _s6();
    return useProductDomainStore({
        "useIsSelectedSelector.useProductDomainStore": (state)=>state.selectedIds.has(productId)
    }["useIsSelectedSelector.useProductDomainStore"]);
};
_s6(useIsSelectedSelector, "NZsRl/Yk0znE5p2zXrOpdpWahAA=", false, function() {
    return [
        useProductDomainStore
    ];
});
const productDomainActions = {
    trackChange: (productId, original, updates)=>useProductDomainStore.getState().trackChange(productId, original, updates),
    updateChange: (productId, updates)=>useProductDomainStore.getState().updateChange(productId, updates),
    discardChange: (productId)=>useProductDomainStore.getState().discardChange(productId),
    discardAllChanges: ()=>useProductDomainStore.getState().discardAllChanges(),
    markAsSaved: (productIds)=>useProductDomainStore.getState().markAsSaved(productIds),
    select: (productId)=>useProductDomainStore.getState().select(productId),
    deselect: (productId)=>useProductDomainStore.getState().deselect(productId),
    toggleSelect: (productId)=>useProductDomainStore.getState().toggleSelect(productId),
    selectAll: (productIds)=>useProductDomainStore.getState().selectAll(productIds),
    deselectAll: ()=>useProductDomainStore.getState().deselectAll(),
    setSelectedIds: (ids)=>useProductDomainStore.getState().setSelectedIds(ids),
    reset: ()=>useProductDomainStore.getState().reset()
};
const getModifiedProductsData = ()=>{
    const state = useProductDomainStore.getState();
    return Object.entries(state.modifiedProducts).map((param)=>{
        let [id, change] = param;
        return {
            id,
            updates: change.current
        };
    });
};
const getSelectedIdsArray = ()=>{
    return Array.from(useProductDomainStore.getState().selectedIds);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/store/product/uiStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// store/product/uiStore.ts
/**
 * Product UI Store - クライアントUI状態
 * 
 * 責務:
 * - ページネーション (currentPage, pageSize)
 * - フィルター状態
 * - ソート状態
 * - UI表示設定
 * 
 * 特徴:
 * - サーバーデータに依存しない純粋なUI状態
 * - URLパラメータとの同期が可能
 * - コンポーネント間で共有が必要なUI状態のみ
 */ __turbopack_context__.s([
    "productUIActions",
    ()=>productUIActions,
    "useFiltersSelector",
    ()=>useFiltersSelector,
    "usePaginationSelector",
    ()=>usePaginationSelector,
    "useProductUIStore",
    ()=>useProductUIStore,
    "useSortSelector",
    ()=>useSortSelector,
    "useViewSettingsSelector",
    ()=>useViewSettingsSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware/immer.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
;
;
;
// ============================================================
// 初期状態
// ============================================================
const initialFilters = {};
const initialSort = {
    field: 'sku',
    order: 'asc'
};
const initialState = {
    currentPage: 1,
    pageSize: 25,
    filters: initialFilters,
    sort: initialSort,
    viewMode: 'list',
    wrapText: false,
    showTooltips: true,
    useVirtualScroll: true,
    language: 'ja',
    listFilter: 'all'
};
const useProductUIStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["immer"])((set, get)=>({
        ...initialState,
        // ========================================
        // ページネーション
        // ========================================
        setPage: (page)=>{
            set((state)=>{
                state.currentPage = Math.max(1, page);
            });
        },
        setPageSize: (size)=>{
            set((state)=>{
                state.pageSize = size;
                state.currentPage = 1; // ページサイズ変更時は1ページ目に戻す
            });
        },
        resetPagination: ()=>{
            set((state)=>{
                state.currentPage = 1;
                state.pageSize = 50;
            });
        },
        // ========================================
        // フィルター
        // ========================================
        setFilters: (filters)=>{
            set((state)=>{
                state.filters = filters;
                state.currentPage = 1; // フィルター変更時は1ページ目に戻す
            });
        },
        updateFilter: (key, value)=>{
            set((state)=>{
                if (value === undefined || value === null || value === '') {
                    delete state.filters[key];
                } else {
                    state.filters[key] = value;
                }
                state.currentPage = 1;
            });
        },
        clearFilters: ()=>{
            set((state)=>{
                state.filters = {};
                state.currentPage = 1;
            });
        },
        // ========================================
        // ソート
        // ========================================
        setSort: (sort)=>{
            set((state)=>{
                state.sort = sort;
            });
        },
        toggleSortOrder: ()=>{
            set((state)=>{
                state.sort.order = state.sort.order === 'asc' ? 'desc' : 'asc';
            });
        },
        // ========================================
        // 表示設定
        // ========================================
        setViewMode: (mode)=>{
            set((state)=>{
                state.viewMode = mode;
            });
        },
        setWrapText: (wrap)=>{
            set((state)=>{
                state.wrapText = wrap;
            });
        },
        setShowTooltips: (show)=>{
            set((state)=>{
                state.showTooltips = show;
            });
        },
        setUseVirtualScroll: (use)=>{
            set((state)=>{
                state.useVirtualScroll = use;
            });
        },
        // ========================================
        // 言語
        // ========================================
        setLanguage: (lang)=>{
            set((state)=>{
                state.language = lang;
            });
        },
        // ========================================
        // リストフィルター
        // ========================================
        setListFilter: (filter)=>{
            console.log('[ProductUIStore] setListFilter called with:', filter);
            set((state)=>{
                state.listFilter = filter;
                state.currentPage = 1;
            });
        },
        // ========================================
        // リセット
        // ========================================
        reset: ()=>{
            set(initialState);
        }
    })), {
    name: 'product-ui-store',
    // 永続化するフィールドを選択
    partialize: (state)=>({
            pageSize: state.pageSize,
            viewMode: state.viewMode,
            wrapText: state.wrapText,
            showTooltips: state.showTooltips,
            useVirtualScroll: state.useVirtualScroll,
            language: state.language,
            sort: state.sort
        })
}), {
    name: 'ProductUIStore'
}));
const usePaginationSelector = ()=>{
    _s();
    const currentPage = useProductUIStore({
        "usePaginationSelector.useProductUIStore[currentPage]": (state)=>state.currentPage
    }["usePaginationSelector.useProductUIStore[currentPage]"]);
    const pageSize = useProductUIStore({
        "usePaginationSelector.useProductUIStore[pageSize]": (state)=>state.pageSize
    }["usePaginationSelector.useProductUIStore[pageSize]"]);
    return {
        currentPage,
        pageSize
    };
};
_s(usePaginationSelector, "3pgbACyDIbxMeFM6f4RpYqVKO5U=", false, function() {
    return [
        useProductUIStore,
        useProductUIStore
    ];
});
const useFiltersSelector = ()=>{
    _s1();
    return useProductUIStore({
        "useFiltersSelector.useProductUIStore": (state)=>state.filters
    }["useFiltersSelector.useProductUIStore"]);
};
_s1(useFiltersSelector, "5FyhhXAJvVSyDnu+ySz2vzhbP0c=", false, function() {
    return [
        useProductUIStore
    ];
});
const useSortSelector = ()=>{
    _s2();
    return useProductUIStore({
        "useSortSelector.useProductUIStore": (state)=>state.sort
    }["useSortSelector.useProductUIStore"]);
};
_s2(useSortSelector, "5FyhhXAJvVSyDnu+ySz2vzhbP0c=", false, function() {
    return [
        useProductUIStore
    ];
});
const useViewSettingsSelector = ()=>{
    _s3();
    const viewMode = useProductUIStore({
        "useViewSettingsSelector.useProductUIStore[viewMode]": (state)=>state.viewMode
    }["useViewSettingsSelector.useProductUIStore[viewMode]"]);
    const wrapText = useProductUIStore({
        "useViewSettingsSelector.useProductUIStore[wrapText]": (state)=>state.wrapText
    }["useViewSettingsSelector.useProductUIStore[wrapText]"]);
    const showTooltips = useProductUIStore({
        "useViewSettingsSelector.useProductUIStore[showTooltips]": (state)=>state.showTooltips
    }["useViewSettingsSelector.useProductUIStore[showTooltips]"]);
    const useVirtualScroll = useProductUIStore({
        "useViewSettingsSelector.useProductUIStore[useVirtualScroll]": (state)=>state.useVirtualScroll
    }["useViewSettingsSelector.useProductUIStore[useVirtualScroll]"]);
    return {
        viewMode,
        wrapText,
        showTooltips,
        useVirtualScroll
    };
};
_s3(useViewSettingsSelector, "tPw6dKBQ3cs/K5o9Pwqj76Ii4hk=", false, function() {
    return [
        useProductUIStore,
        useProductUIStore,
        useProductUIStore,
        useProductUIStore
    ];
});
const productUIActions = {
    setPage: (page)=>useProductUIStore.getState().setPage(page),
    setPageSize: (size)=>useProductUIStore.getState().setPageSize(size),
    setFilters: (filters)=>useProductUIStore.getState().setFilters(filters),
    clearFilters: ()=>useProductUIStore.getState().clearFilters(),
    setSort: (sort)=>useProductUIStore.getState().setSort(sort),
    setViewMode: (mode)=>useProductUIStore.getState().setViewMode(mode),
    setListFilter: (filter)=>useProductUIStore.getState().setListFilter(filter),
    reset: ()=>useProductUIStore.getState().reset()
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/store/product/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// store/product/index.ts
/**
 * Product Store - エクスポート集約
 * 
 * 3つのStoreに分離:
 * 1. domainStore - クライアントドメイン状態（変更追跡、選択）
 * 2. uiStore - UI状態（ページネーション、フィルター、表示設定）
 * 3. サーバーデータ - React Query（このファイルでは管理しない）
 */ // Types
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/product/types.ts [app-client] (ecmascript)");
// Domain Store
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/product/domainStore.ts [app-client] (ecmascript)");
// UI Store
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/product/uiStore.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/store/mirrorSelectionStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// store/mirrorSelectionStore.ts
__turbopack_context__.s([
    "useMirrorSelectionStore",
    ()=>useMirrorSelectionStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const useMirrorSelectionStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        selectedItems: {},
        // アイテムの選択/解除（単一選択）
        toggleItem: async (productId, item)=>{
            // 🔥 単一選択に変更：その商品の他の選択を全て解除
            set((state)=>{
                const newItems = {
                    ...state.selectedItems
                };
                // 🔥 同じ商品の他の選択を削除
                Object.keys(newItems).forEach((key)=>{
                    if (key.startsWith("".concat(productId, "_"))) {
                        delete newItems[key];
                    }
                });
                // 🔥 新しい選択を追加
                const key = "".concat(productId, "_").concat(item.itemId);
                newItems[key] = item;
                return {
                    selectedItems: newItems
                };
            });
            // 🔥 選択された商品をDBに保存
            try {
                console.log('💾 SM選択商品をDBに保存中:', {
                    productId,
                    itemId: item.itemId,
                    title: item.title
                });
                const response = await fetch("/api/products/".concat(productId, "/sm-selected-item"), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        itemId: item.itemId,
                        title: item.title,
                        price: item.price,
                        image: item.image,
                        seller: item.seller,
                        condition: item.condition
                    })
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ SM選択商品の保存に失敗:', {
                        status: response.status,
                        statusText: response.statusText,
                        errorText,
                        url: response.url
                    });
                    return;
                }
                const result = await response.json();
                if (result.success) {
                    console.log('✅ SM選択商品をDBに保存しました:', item.title);
                } else {
                    console.error('❌ SM選択商品の保存に失敗:', {
                        error: result.error || 'Unknown error',
                        result
                    });
                }
            } catch (error) {
                console.error('❌ API呼び出しエラー:', error);
            }
        },
        // アイテムを選択（toggleItemの別名）
        setSelectedItem: async (productId, item)=>{
            return get().toggleItem(productId, item);
        },
        // 特定商品の選択されたアイテムIDを取得
        getSelectedByProduct: (productId)=>{
            const items = get().selectedItems;
            return Object.entries(items).filter((param)=>{
                let [key] = param;
                return key.startsWith("".concat(productId, "_"));
            }).map((param)=>{
                let [_, item] = param;
                return item.itemId;
            });
        },
        // 全ての選択されたアイテムを取得
        getAllSelected: ()=>{
            return Object.values(get().selectedItems);
        },
        // 選択数を取得
        getSelectedCount: ()=>{
            return Object.keys(get().selectedItems).length;
        },
        // 全てクリア
        clearAll: ()=>{
            set({
                selectedItems: {}
            });
        },
        // 特定商品の選択をクリア
        removeByProductId: (productId)=>{
            set((state)=>{
                const newItems = {
                    ...state.selectedItems
                };
                Object.keys(newItems).forEach((key)=>{
                    if (key.startsWith("".concat(productId, "_"))) {
                        delete newItems[key];
                    }
                });
                return {
                    selectedItems: newItems
                };
            });
        }
    }), {
    name: 'mirror-selection-storage'
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/store/persistentFilter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// store/persistentFilter.ts
/**
 * グローバル永続フィルターStore
 * 
 * 機能:
 * 1. タブを跨いだ属性フィルターの永続化
 * 2. 3階層の属性フィルター (attr_l1, attr_l2, attr_l3)
 * 3. is_verified フラグによる確定済み商品の絞り込み
 * 4. Supusi (スプレッドシート) との双方向同期対応
 * 
 * 設計原則:
 * - Zustand persist middleware でブラウザに永続化
 * - API リクエストに自動的にパラメータを付与
 * - タブ切り替えでもフィルター状態を維持
 */ __turbopack_context__.s([
    "persistentFilterActions",
    ()=>persistentFilterActions,
    "useAttributeFilter",
    ()=>useAttributeFilter,
    "useAttributeOptions",
    ()=>useAttributeOptions,
    "useFilterActive",
    ()=>useFilterActive,
    "useFilterQueryParams",
    ()=>useFilterQueryParams,
    "usePersistentFilterStore",
    ()=>usePersistentFilterStore,
    "useVerifiedFilter",
    ()=>useVerifiedFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware/immer.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
;
;
;
// ============================================================
// 初期状態
// ============================================================
const initialState = {
    attribute: {
        l1: null,
        l2: null,
        l3: null
    },
    options: {
        l1Options: [],
        l2Options: [],
        l3Options: [],
        loading: false,
        error: null,
        lastFetched: null
    },
    verified: {
        showVerifiedOnly: false,
        verifiedConditions: {
            hasCost: true,
            hasQuantity: true,
            hasTitle: true
        }
    },
    isActive: true,
    lastUpdated: Date.now()
};
const usePersistentFilterStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["immer"])((set, get)=>({
        ...initialState,
        // ========================================
        // 属性フィルター
        // ========================================
        setAttributeL1: (value)=>{
            set((state)=>{
                state.attribute.l1 = value;
                // L1を変更したらL2, L3をリセット
                state.attribute.l2 = null;
                state.attribute.l3 = null;
                state.lastUpdated = Date.now();
            });
            // L2オプションを再取得
            if (value) {
                get().fetchAttributeOptions();
            }
        },
        setAttributeL2: (value)=>{
            set((state)=>{
                state.attribute.l2 = value;
                // L2を変更したらL3をリセット
                state.attribute.l3 = null;
                state.lastUpdated = Date.now();
            });
            // L3オプションを再取得
            if (value) {
                get().fetchAttributeOptions();
            }
        },
        setAttributeL3: (value)=>{
            set((state)=>{
                state.attribute.l3 = value;
                state.lastUpdated = Date.now();
            });
        },
        clearAttribute: ()=>{
            set((state)=>{
                state.attribute = {
                    l1: null,
                    l2: null,
                    l3: null
                };
                state.lastUpdated = Date.now();
            });
        },
        // ========================================
        // 属性選択肢の取得
        // ========================================
        fetchAttributeOptions: async ()=>{
            const { attribute } = get();
            set((state)=>{
                state.options.loading = true;
                state.options.error = null;
            });
            try {
                const params = new URLSearchParams();
                if (attribute.l1) params.set('l1', attribute.l1);
                if (attribute.l2) params.set('l2', attribute.l2);
                const response = await fetch("/api/inventory/attribute-options?".concat(params.toString()));
                const data = await response.json();
                if (data.success) {
                    set((state)=>{
                        state.options.l1Options = data.l1Options || [];
                        state.options.l2Options = data.l2Options || [];
                        state.options.l3Options = data.l3Options || [];
                        state.options.loading = false;
                        state.options.lastFetched = Date.now();
                    });
                } else {
                    throw new Error(data.error || '属性取得エラー');
                }
            } catch (err) {
                set((state)=>{
                    state.options.loading = false;
                    state.options.error = err.message;
                });
            }
        },
        setAttributeOptions: (options)=>{
            set((state)=>{
                Object.assign(state.options, options);
            });
        },
        // ========================================
        // 確定フィルター
        // ========================================
        setShowVerifiedOnly: (show)=>{
            set((state)=>{
                state.verified.showVerifiedOnly = show;
                state.lastUpdated = Date.now();
            });
        },
        toggleVerifiedOnly: ()=>{
            set((state)=>{
                state.verified.showVerifiedOnly = !state.verified.showVerifiedOnly;
                state.lastUpdated = Date.now();
            });
        },
        // ========================================
        // フィルター有効/無効
        // ========================================
        setActive: (active)=>{
            set((state)=>{
                state.isActive = active;
            });
        },
        toggleActive: ()=>{
            set((state)=>{
                state.isActive = !state.isActive;
            });
        },
        // ========================================
        // リセット
        // ========================================
        reset: ()=>{
            set(initialState);
        },
        // ========================================
        // APIクエリパラメータを生成
        // ========================================
        getQueryParams: ()=>{
            const state = get();
            const params = {};
            if (!state.isActive) return params;
            if (state.attribute.l1) params.attr_l1 = state.attribute.l1;
            if (state.attribute.l2) params.attr_l2 = state.attribute.l2;
            if (state.attribute.l3) params.attr_l3 = state.attribute.l3;
            if (state.verified.showVerifiedOnly) params.is_verified = 'true';
            return params;
        }
    })), {
    name: 'persistent-filter-store',
    // 永続化するフィールドを選択
    partialize: (state)=>({
            attribute: state.attribute,
            verified: state.verified,
            isActive: state.isActive,
            lastUpdated: state.lastUpdated
        })
}), {
    name: 'PersistentFilterStore'
}));
const useAttributeFilter = ()=>{
    _s();
    return usePersistentFilterStore({
        "useAttributeFilter.usePersistentFilterStore": (state)=>state.attribute
    }["useAttributeFilter.usePersistentFilterStore"]);
};
_s(useAttributeFilter, "tOyImYiGTNhcn5tbu6MZ/IzxX6Q=", false, function() {
    return [
        usePersistentFilterStore
    ];
});
const useAttributeOptions = ()=>{
    _s1();
    return usePersistentFilterStore({
        "useAttributeOptions.usePersistentFilterStore": (state)=>state.options
    }["useAttributeOptions.usePersistentFilterStore"]);
};
_s1(useAttributeOptions, "tOyImYiGTNhcn5tbu6MZ/IzxX6Q=", false, function() {
    return [
        usePersistentFilterStore
    ];
});
const useVerifiedFilter = ()=>{
    _s2();
    return usePersistentFilterStore({
        "useVerifiedFilter.usePersistentFilterStore": (state)=>state.verified
    }["useVerifiedFilter.usePersistentFilterStore"]);
};
_s2(useVerifiedFilter, "tOyImYiGTNhcn5tbu6MZ/IzxX6Q=", false, function() {
    return [
        usePersistentFilterStore
    ];
});
const useFilterActive = ()=>{
    _s3();
    return usePersistentFilterStore({
        "useFilterActive.usePersistentFilterStore": (state)=>state.isActive
    }["useFilterActive.usePersistentFilterStore"]);
};
_s3(useFilterActive, "tOyImYiGTNhcn5tbu6MZ/IzxX6Q=", false, function() {
    return [
        usePersistentFilterStore
    ];
});
const useFilterQueryParams = ()=>{
    _s4();
    return usePersistentFilterStore({
        "useFilterQueryParams.usePersistentFilterStore": (state)=>state.getQueryParams()
    }["useFilterQueryParams.usePersistentFilterStore"]);
};
_s4(useFilterQueryParams, "tOyImYiGTNhcn5tbu6MZ/IzxX6Q=", false, function() {
    return [
        usePersistentFilterStore
    ];
});
const persistentFilterActions = {
    setAttributeL1: (value)=>usePersistentFilterStore.getState().setAttributeL1(value),
    setAttributeL2: (value)=>usePersistentFilterStore.getState().setAttributeL2(value),
    setAttributeL3: (value)=>usePersistentFilterStore.getState().setAttributeL3(value),
    clearAttribute: ()=>usePersistentFilterStore.getState().clearAttribute(),
    fetchAttributeOptions: ()=>usePersistentFilterStore.getState().fetchAttributeOptions(),
    setShowVerifiedOnly: (show)=>usePersistentFilterStore.getState().setShowVerifiedOnly(show),
    toggleVerifiedOnly: ()=>usePersistentFilterStore.getState().toggleVerifiedOnly(),
    setActive: (active)=>usePersistentFilterStore.getState().setActive(active),
    toggleActive: ()=>usePersistentFilterStore.getState().toggleActive(),
    reset: ()=>usePersistentFilterStore.getState().reset(),
    getQueryParams: ()=>usePersistentFilterStore.getState().getQueryParams()
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/types/inventory.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 棚卸し・在庫管理システムの型定義
 */ // 商品タイプ
__turbopack_context__.s([
    "COST_ITEM_PRESETS",
    ()=>COST_ITEM_PRESETS,
    "SALES_CHANNEL_LABELS",
    ()=>SALES_CHANNEL_LABELS
]);
const SALES_CHANNEL_LABELS = {
    ebay_us: 'eBay US',
    ebay_uk: 'eBay UK',
    ebay_au: 'eBay AU',
    amazon_us: 'Amazon US',
    amazon_jp: 'Amazon JP',
    qoo10_jp: 'Qoo10 JP',
    shopee: 'Shopee',
    mercari: 'メルカリ',
    undecided: '未定'
};
const COST_ITEM_PRESETS = [
    {
        key: 'domestic_shipping',
        label: '国内送料'
    },
    {
        key: 'inspection',
        label: '検品費'
    },
    {
        key: 'packaging',
        label: '梱包資材費'
    },
    {
        key: 'agent_fee',
        label: '代行手数料'
    },
    {
        key: 'customs_tax',
        label: '関税・消費税'
    },
    {
        key: 'storage',
        label: '保管費用'
    },
    {
        key: 'other',
        label: 'その他'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_87e91925._.js.map