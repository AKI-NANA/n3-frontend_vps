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
"[project]/n3-frontend_vps/store/n3/operationsUIStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// store/n3/operationsUIStore.ts
/**
 * Operations N3 UI Store - オペレーション管理用UI状態
 *
 * 責務:
 * - タブ状態
 * - フィルター状態
 * - 選択状態
 * - 表示設定
 *
 * ゴールドスタンダード準拠:
 * - サーバーデータは React Query で管理（このStoreには持たない）
 * - 各セレクターは値ごとに分離
 */ __turbopack_context__.s([
    "operationsUIActions",
    ()=>operationsUIActions,
    "useOperationsActiveTab",
    ()=>useOperationsActiveTab,
    "useOperationsCurrentPage",
    ()=>useOperationsCurrentPage,
    "useOperationsFilters",
    ()=>useOperationsFilters,
    "useOperationsPageSize",
    ()=>useOperationsPageSize,
    "useOperationsSelectedIds",
    ()=>useOperationsSelectedIds,
    "useOperationsSelectedInquiryId",
    ()=>useOperationsSelectedInquiryId,
    "useOperationsSelectedOrderId",
    ()=>useOperationsSelectedOrderId,
    "useOperationsSelectedShippingId",
    ()=>useOperationsSelectedShippingId,
    "useOperationsShowLinkedPanel",
    ()=>useOperationsShowLinkedPanel,
    "useOperationsShowStats",
    ()=>useOperationsShowStats,
    "useOperationsSortField",
    ()=>useOperationsSortField,
    "useOperationsSortOrder",
    ()=>useOperationsSortOrder,
    "useOperationsUIStore",
    ()=>useOperationsUIStore,
    "useOperationsViewMode",
    ()=>useOperationsViewMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware/immer.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature(), _s12 = __turbopack_context__.k.signature();
;
;
;
// ============================================================
// 初期状態
// ============================================================
const initialState = {
    activeTab: 'orders',
    currentPage: 1,
    pageSize: 50,
    filters: {
        marketplace: 'all'
    },
    sortField: 'orderDate',
    sortOrder: 'desc',
    selectedOrderId: null,
    selectedShippingId: null,
    selectedInquiryId: null,
    selectedIds: [],
    viewMode: 'list',
    showStats: true,
    showLinkedPanel: true
};
const useOperationsUIStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["immer"])((set)=>({
        ...initialState,
        // ========================================
        // タブ
        // ========================================
        setActiveTab: (tab)=>{
            set((state)=>{
                state.activeTab = tab;
                state.currentPage = 1;
                state.selectedOrderId = null;
                state.selectedShippingId = null;
                state.selectedInquiryId = null;
                state.selectedIds = [];
            });
        },
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
                state.currentPage = 1;
            });
        },
        // ========================================
        // フィルター
        // ========================================
        setFilters: (filters)=>{
            set((state)=>{
                state.filters = filters;
                state.currentPage = 1;
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
                state.filters = {
                    marketplace: 'all'
                };
                state.currentPage = 1;
            });
        },
        // ========================================
        // ソート
        // ========================================
        setSort: (field, order)=>{
            set((state)=>{
                if (state.sortField === field && !order) {
                    state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    state.sortField = field;
                    state.sortOrder = order || 'desc';
                }
            });
        },
        // ========================================
        // 選択
        // ========================================
        selectOrder: (id)=>{
            set((state)=>{
                state.selectedOrderId = id;
                state.selectedShippingId = null;
                state.selectedInquiryId = null;
            });
        },
        selectShipping: (id)=>{
            set((state)=>{
                state.selectedShippingId = id;
                state.selectedOrderId = null;
                state.selectedInquiryId = null;
            });
        },
        selectInquiry: (id)=>{
            set((state)=>{
                state.selectedInquiryId = id;
                state.selectedOrderId = null;
                state.selectedShippingId = null;
            });
        },
        selectItem: (id)=>{
            set((state)=>{
                const index = state.selectedIds.indexOf(id);
                if (index === -1) {
                    state.selectedIds.push(id);
                } else {
                    state.selectedIds.splice(index, 1);
                }
            });
        },
        selectItems: (ids)=>{
            set((state)=>{
                state.selectedIds = [
                    ...ids
                ];
            });
        },
        clearSelection: ()=>{
            set((state)=>{
                state.selectedIds = [];
                state.selectedOrderId = null;
                state.selectedShippingId = null;
                state.selectedInquiryId = null;
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
        toggleStats: ()=>{
            set((state)=>{
                state.showStats = !state.showStats;
            });
        },
        toggleLinkedPanel: ()=>{
            set((state)=>{
                state.showLinkedPanel = !state.showLinkedPanel;
            });
        },
        // ========================================
        // リセット
        // ========================================
        reset: ()=>{
            set(initialState);
        }
    })), {
    name: 'operations-n3-ui-store',
    partialize: (state)=>({
            pageSize: state.pageSize,
            viewMode: state.viewMode,
            showStats: state.showStats,
            showLinkedPanel: state.showLinkedPanel,
            sortField: state.sortField,
            sortOrder: state.sortOrder
        })
}), {
    name: 'OperationsUIStore'
}));
const useOperationsActiveTab = ()=>{
    _s();
    return useOperationsUIStore({
        "useOperationsActiveTab.useOperationsUIStore": (state)=>state.activeTab
    }["useOperationsActiveTab.useOperationsUIStore"]);
};
_s(useOperationsActiveTab, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsCurrentPage = ()=>{
    _s1();
    return useOperationsUIStore({
        "useOperationsCurrentPage.useOperationsUIStore": (state)=>state.currentPage
    }["useOperationsCurrentPage.useOperationsUIStore"]);
};
_s1(useOperationsCurrentPage, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsPageSize = ()=>{
    _s2();
    return useOperationsUIStore({
        "useOperationsPageSize.useOperationsUIStore": (state)=>state.pageSize
    }["useOperationsPageSize.useOperationsUIStore"]);
};
_s2(useOperationsPageSize, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsFilters = ()=>{
    _s3();
    return useOperationsUIStore({
        "useOperationsFilters.useOperationsUIStore": (state)=>state.filters
    }["useOperationsFilters.useOperationsUIStore"]);
};
_s3(useOperationsFilters, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsSortField = ()=>{
    _s4();
    return useOperationsUIStore({
        "useOperationsSortField.useOperationsUIStore": (state)=>state.sortField
    }["useOperationsSortField.useOperationsUIStore"]);
};
_s4(useOperationsSortField, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsSortOrder = ()=>{
    _s5();
    return useOperationsUIStore({
        "useOperationsSortOrder.useOperationsUIStore": (state)=>state.sortOrder
    }["useOperationsSortOrder.useOperationsUIStore"]);
};
_s5(useOperationsSortOrder, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsSelectedOrderId = ()=>{
    _s6();
    return useOperationsUIStore({
        "useOperationsSelectedOrderId.useOperationsUIStore": (state)=>state.selectedOrderId
    }["useOperationsSelectedOrderId.useOperationsUIStore"]);
};
_s6(useOperationsSelectedOrderId, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsSelectedShippingId = ()=>{
    _s7();
    return useOperationsUIStore({
        "useOperationsSelectedShippingId.useOperationsUIStore": (state)=>state.selectedShippingId
    }["useOperationsSelectedShippingId.useOperationsUIStore"]);
};
_s7(useOperationsSelectedShippingId, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsSelectedInquiryId = ()=>{
    _s8();
    return useOperationsUIStore({
        "useOperationsSelectedInquiryId.useOperationsUIStore": (state)=>state.selectedInquiryId
    }["useOperationsSelectedInquiryId.useOperationsUIStore"]);
};
_s8(useOperationsSelectedInquiryId, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsSelectedIds = ()=>{
    _s9();
    return useOperationsUIStore({
        "useOperationsSelectedIds.useOperationsUIStore": (state)=>state.selectedIds
    }["useOperationsSelectedIds.useOperationsUIStore"]);
};
_s9(useOperationsSelectedIds, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsViewMode = ()=>{
    _s10();
    return useOperationsUIStore({
        "useOperationsViewMode.useOperationsUIStore": (state)=>state.viewMode
    }["useOperationsViewMode.useOperationsUIStore"]);
};
_s10(useOperationsViewMode, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsShowStats = ()=>{
    _s11();
    return useOperationsUIStore({
        "useOperationsShowStats.useOperationsUIStore": (state)=>state.showStats
    }["useOperationsShowStats.useOperationsUIStore"]);
};
_s11(useOperationsShowStats, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsShowLinkedPanel = ()=>{
    _s12();
    return useOperationsUIStore({
        "useOperationsShowLinkedPanel.useOperationsUIStore": (state)=>state.showLinkedPanel
    }["useOperationsShowLinkedPanel.useOperationsUIStore"]);
};
_s12(useOperationsShowLinkedPanel, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const operationsUIActions = {
    setActiveTab: (tab)=>useOperationsUIStore.getState().setActiveTab(tab),
    setPage: (page)=>useOperationsUIStore.getState().setPage(page),
    setFilters: (filters)=>useOperationsUIStore.getState().setFilters(filters),
    clearFilters: ()=>useOperationsUIStore.getState().clearFilters(),
    selectOrder: (id)=>useOperationsUIStore.getState().selectOrder(id),
    selectShipping: (id)=>useOperationsUIStore.getState().selectShipping(id),
    selectInquiry: (id)=>useOperationsUIStore.getState().selectInquiry(id),
    clearSelection: ()=>useOperationsUIStore.getState().clearSelection(),
    reset: ()=>useOperationsUIStore.getState().reset()
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_87ef73b3._.js.map