(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/lib/marketplace/marketplace-configs.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * 多販路マーケットプレイス設定
 * lib/marketplace/marketplace-configs.ts
 */ __turbopack_context__.s([
    "DEFAULT_EXCHANGE_RATES",
    ()=>DEFAULT_EXCHANGE_RATES,
    "MARKETPLACE_CONFIGS",
    ()=>MARKETPLACE_CONFIGS,
    "PRIORITY_MARKETPLACES",
    ()=>PRIORITY_MARKETPLACES,
    "getAllMarketplaceIds",
    ()=>getAllMarketplaceIds,
    "getEnabledMarketplaces",
    ()=>getEnabledMarketplaces,
    "getMarketplaceConfig",
    ()=>getMarketplaceConfig,
    "normalizeMarketplaceId",
    ()=>normalizeMarketplaceId,
    "toUiMarketplaceId",
    ()=>toUiMarketplaceId
]);
const MARKETPLACE_CONFIGS = {
    // =====================================================
    // eBay
    // =====================================================
    ebay_us: {
        id: 'ebay_us',
        name: 'ebay_us',
        displayName: 'eBay US',
        currency: 'USD',
        language: 'en',
        region: 'US',
        fees: {
            platformFeePercent: 12.9,
            paymentFeePercent: 2.9,
            paymentFeeFixed: 0.30
        },
        maxImages: 24,
        imageRequirements: {
            minWidth: 500,
            minHeight: 500,
            maxFileSizeMB: 12
        },
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'condition',
            'images'
        ],
        apiType: 'trading',
        enabled: true
    },
    ebay_uk: {
        id: 'ebay_uk',
        name: 'ebay_uk',
        displayName: 'eBay UK',
        currency: 'GBP',
        language: 'en',
        region: 'UK',
        fees: {
            platformFeePercent: 12.8,
            paymentFeePercent: 2.9,
            paymentFeeFixed: 0.30
        },
        maxImages: 24,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'condition',
            'images'
        ],
        apiType: 'trading',
        enabled: true
    },
    ebay_de: {
        id: 'ebay_de',
        name: 'ebay_de',
        displayName: 'eBay Germany',
        currency: 'EUR',
        language: 'en',
        region: 'DE',
        fees: {
            platformFeePercent: 11.0,
            paymentFeePercent: 2.9,
            paymentFeeFixed: 0.35
        },
        maxImages: 24,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'condition',
            'images'
        ],
        apiType: 'trading',
        enabled: true
    },
    ebay_au: {
        id: 'ebay_au',
        name: 'ebay_au',
        displayName: 'eBay Australia',
        currency: 'AUD',
        language: 'en',
        region: 'AU',
        fees: {
            platformFeePercent: 13.0,
            paymentFeePercent: 2.2,
            paymentFeeFixed: 0.30
        },
        maxImages: 24,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'condition',
            'images'
        ],
        apiType: 'trading',
        enabled: true
    },
    // =====================================================
    // Qoo10
    // =====================================================
    qoo10_jp: {
        id: 'qoo10_jp',
        name: 'qoo10_jp',
        displayName: 'Qoo10 Japan',
        currency: 'JPY',
        language: 'ja',
        region: 'JP',
        fees: {
            platformFeePercent: 12.0,
            paymentFeePercent: 3.5
        },
        maxImages: 10,
        imageRequirements: {
            minWidth: 500,
            minHeight: 500,
            maxFileSizeMB: 5
        },
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'images',
            'shipping_method'
        ],
        apiType: 'rest',
        enabled: true
    },
    qoo10_sg: {
        id: 'qoo10_sg',
        name: 'qoo10_sg',
        displayName: 'Qoo10 Singapore',
        currency: 'SGD',
        language: 'en',
        region: 'SG',
        fees: {
            platformFeePercent: 10.0,
            paymentFeePercent: 2.0
        },
        maxImages: 15,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'images'
        ],
        apiType: 'rest',
        enabled: true
    },
    // =====================================================
    // Amazon
    // =====================================================
    amazon_jp: {
        id: 'amazon_jp',
        name: 'amazon_jp',
        displayName: 'Amazon Japan',
        currency: 'JPY',
        language: 'ja',
        region: 'JP',
        fees: {
            platformFeePercent: 10.0,
            paymentFeePercent: 0,
            categoryFees: {
                'electronics': 8.0,
                'apparel': 10.0,
                'home': 15.0,
                'toys': 10.0
            }
        },
        maxImages: 9,
        imageRequirements: {
            minWidth: 1000,
            minHeight: 1000,
            maxFileSizeMB: 10
        },
        requiredFields: [
            'title',
            'description',
            'price',
            'jan_code',
            'brand',
            'images'
        ],
        apiType: 'rest',
        enabled: true
    },
    amazon_us: {
        id: 'amazon_us',
        name: 'amazon_us',
        displayName: 'Amazon US',
        currency: 'USD',
        language: 'en',
        region: 'US',
        fees: {
            platformFeePercent: 15.0,
            paymentFeePercent: 0,
            categoryFees: {
                'electronics': 8.0,
                'apparel': 17.0,
                'home': 15.0
            }
        },
        maxImages: 9,
        requiredFields: [
            'title',
            'description',
            'price',
            'upc',
            'brand',
            'images'
        ],
        apiType: 'rest',
        enabled: true
    },
    amazon_au: {
        id: 'amazon_au',
        name: 'amazon_au',
        displayName: 'Amazon Australia',
        currency: 'AUD',
        language: 'en',
        region: 'AU',
        fees: {
            platformFeePercent: 15.0,
            paymentFeePercent: 0
        },
        maxImages: 9,
        requiredFields: [
            'title',
            'description',
            'price',
            'brand',
            'images'
        ],
        apiType: 'rest',
        enabled: true
    },
    // =====================================================
    // Shopee
    // =====================================================
    shopee_sg: {
        id: 'shopee_sg',
        name: 'shopee_sg',
        displayName: 'Shopee Singapore',
        currency: 'SGD',
        language: 'en',
        region: 'SG',
        fees: {
            platformFeePercent: 5.0,
            paymentFeePercent: 2.0
        },
        maxImages: 9,
        imageRequirements: {
            minWidth: 800,
            minHeight: 800,
            maxFileSizeMB: 5
        },
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'images',
            'weight'
        ],
        apiType: 'rest',
        enabled: true
    },
    shopee_my: {
        id: 'shopee_my',
        name: 'shopee_my',
        displayName: 'Shopee Malaysia',
        currency: 'MYR',
        language: 'en',
        region: 'MY',
        fees: {
            platformFeePercent: 5.0,
            paymentFeePercent: 2.0
        },
        maxImages: 9,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'images',
            'weight'
        ],
        apiType: 'rest',
        enabled: true
    },
    shopee_th: {
        id: 'shopee_th',
        name: 'shopee_th',
        displayName: 'Shopee Thailand',
        currency: 'THB',
        language: 'th',
        region: 'TH',
        fees: {
            platformFeePercent: 5.0,
            paymentFeePercent: 2.0
        },
        maxImages: 9,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'images',
            'weight'
        ],
        apiType: 'rest',
        enabled: true
    },
    shopee_ph: {
        id: 'shopee_ph',
        name: 'shopee_ph',
        displayName: 'Shopee Philippines',
        currency: 'PHP',
        language: 'en',
        region: 'PH',
        fees: {
            platformFeePercent: 5.0,
            paymentFeePercent: 2.0
        },
        maxImages: 9,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'images',
            'weight'
        ],
        apiType: 'rest',
        enabled: true
    },
    shopee_tw: {
        id: 'shopee_tw',
        name: 'shopee_tw',
        displayName: 'Shopee Taiwan',
        currency: 'TWD',
        language: 'zh',
        region: 'TW',
        fees: {
            platformFeePercent: 5.0,
            paymentFeePercent: 2.0
        },
        maxImages: 9,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'images',
            'weight'
        ],
        apiType: 'rest',
        enabled: true
    },
    shopee_vn: {
        id: 'shopee_vn',
        name: 'shopee_vn',
        displayName: 'Shopee Vietnam',
        currency: 'VND',
        language: 'vi',
        region: 'VN',
        fees: {
            platformFeePercent: 5.0,
            paymentFeePercent: 2.0
        },
        maxImages: 9,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'images',
            'weight'
        ],
        apiType: 'rest',
        enabled: true
    },
    // =====================================================
    // その他
    // =====================================================
    shopify: {
        id: 'shopify',
        name: 'shopify',
        displayName: 'Shopify',
        currency: 'USD',
        language: 'en',
        region: 'global',
        fees: {
            platformFeePercent: 2.9,
            paymentFeePercent: 0.30
        },
        maxImages: 25,
        requiredFields: [
            'title',
            'description',
            'price',
            'images'
        ],
        apiType: 'graphql',
        enabled: false
    },
    coupang: {
        id: 'coupang',
        name: 'coupang',
        displayName: 'Coupang',
        currency: 'KRW',
        language: 'ko',
        region: 'KR',
        fees: {
            platformFeePercent: 11.0,
            paymentFeePercent: 0,
            categoryFees: {
                'fashion': 15.0,
                'beauty': 12.0,
                'electronics': 8.0
            }
        },
        maxImages: 20,
        requiredFields: [
            'title_ko',
            'description_ko',
            'price',
            'category',
            'brand',
            'images'
        ],
        apiType: 'rest',
        enabled: false
    },
    mercari_jp: {
        id: 'mercari_jp',
        name: 'mercari_jp',
        displayName: 'メルカリ',
        currency: 'JPY',
        language: 'ja',
        region: 'JP',
        fees: {
            platformFeePercent: 10.0,
            paymentFeePercent: 0
        },
        maxImages: 10,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'condition',
            'images'
        ],
        apiType: 'csv_upload',
        enabled: false
    },
    mercari_us: {
        id: 'mercari_us',
        name: 'mercari_us',
        displayName: 'Mercari US',
        currency: 'USD',
        language: 'en',
        region: 'US',
        fees: {
            platformFeePercent: 10.0,
            paymentFeePercent: 2.9,
            paymentFeeFixed: 0.50
        },
        maxImages: 12,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'condition',
            'images'
        ],
        apiType: 'csv_upload',
        enabled: false
    },
    yahoo_auction: {
        id: 'yahoo_auction',
        name: 'yahoo_auction',
        displayName: 'ヤフオク',
        currency: 'JPY',
        language: 'ja',
        region: 'JP',
        fees: {
            platformFeePercent: 8.8,
            paymentFeePercent: 0
        },
        maxImages: 10,
        requiredFields: [
            'title',
            'description',
            'starting_price',
            'category',
            'images'
        ],
        apiType: 'rest',
        enabled: false
    },
    yahoo_shopping: {
        id: 'yahoo_shopping',
        name: 'yahoo_shopping',
        displayName: 'Yahoo!ショッピング',
        currency: 'JPY',
        language: 'ja',
        region: 'JP',
        fees: {
            platformFeePercent: 6.0,
            paymentFeePercent: 3.0
        },
        maxImages: 20,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'jan_code',
            'images'
        ],
        apiType: 'rest',
        enabled: false
    },
    rakuten: {
        id: 'rakuten',
        name: 'rakuten',
        displayName: '楽天市場',
        currency: 'JPY',
        language: 'ja',
        region: 'JP',
        fees: {
            platformFeePercent: 8.0,
            paymentFeePercent: 3.0
        },
        maxImages: 20,
        requiredFields: [
            'title',
            'description',
            'price',
            'category',
            'jan_code',
            'images'
        ],
        apiType: 'rest',
        enabled: false
    }
};
const DEFAULT_EXCHANGE_RATES = {
    'JPY': 1,
    'USD': 150,
    'GBP': 190,
    'EUR': 165,
    'AUD': 100,
    'SGD': 112,
    'MYR': 34,
    'THB': 4.3,
    'PHP': 2.7,
    'TWD': 4.8,
    'VND': 0.0062,
    'KRW': 0.11
};
function getMarketplaceConfig(id) {
    return MARKETPLACE_CONFIGS[id];
}
function getEnabledMarketplaces() {
    return Object.values(MARKETPLACE_CONFIGS).filter((config)=>config.enabled);
}
function getAllMarketplaceIds() {
    return Object.keys(MARKETPLACE_CONFIGS);
}
const PRIORITY_MARKETPLACES = [
    'ebay_us',
    'qoo10_jp',
    'shopee_sg',
    'amazon_jp'
];
function normalizeMarketplaceId(uiId) {
    const mapping = {
        'ebay-us': 'ebay_us',
        'ebay-uk': 'ebay_uk',
        'ebay-de': 'ebay_de',
        'ebay-au': 'ebay_au',
        'qoo10-jp': 'qoo10_jp',
        'qoo10-sg': 'qoo10_sg',
        'amazon-jp': 'amazon_jp',
        'amazon-us': 'amazon_us',
        'amazon-au': 'amazon_au',
        'shopee-sg': 'shopee_sg',
        'shopee-my': 'shopee_my',
        'shopee-th': 'shopee_th',
        'shopee-ph': 'shopee_ph',
        'shopee-tw': 'shopee_tw',
        'shopee-vn': 'shopee_vn'
    };
    // 既にDB形式の場合はそのまま返す
    if (uiId in MARKETPLACE_CONFIGS) {
        return uiId;
    }
    return mapping[uiId] || null;
}
function toUiMarketplaceId(dbId) {
    return dbId.replace('_', '-');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * TabMultiListing - 多販路一括出品タブ
 * 
 * 機能:
 * - マーケットプレイス選択（チェックボックス）
 * - 一括利益計算
 * - 利益比較マトリックス表示
 * - 下書き保存 / スケジュール / 即時出品
 */ __turbopack_context__.s([
    "TabMultiListing",
    ()=>TabMultiListing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rocket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rocket$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/rocket.js [app-client] (ecmascript) <export default as Rocket>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$marketplace$2f$marketplace$2d$configs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/marketplace/marketplace-configs.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// =====================================================
// スタイル定数
// =====================================================
const T = {
    bg: '#F1F5F9',
    panel: '#ffffff',
    panelBorder: '#e2e8f0',
    highlight: '#f1f5f9',
    text: '#1e293b',
    textMuted: '#64748b',
    textSubtle: '#94a3b8',
    accent: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    qoo10: '#ff0066',
    shopee: '#ee4d2d',
    amazon: '#ff9900',
    ebay: '#0064d2'
};
// マーケットプレイスのカラー
const MP_COLORS = {
    ebay_us: '#0064d2',
    ebay_uk: '#0064d2',
    ebay_de: '#0064d2',
    ebay_au: '#0064d2',
    qoo10_jp: '#ff0066',
    qoo10_sg: '#ff0066',
    amazon_jp: '#ff9900',
    amazon_us: '#ff9900',
    shopee_sg: '#ee4d2d',
    shopee_my: '#ee4d2d',
    shopee_th: '#ee4d2d'
};
const TabMultiListing = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function TabMultiListing(param) {
    let { product, onSave, onRefresh } = param;
    var _this, // 新型定義
    _this1, _this2, _this3, _scraped_data, _this4, _this5, _this6, _this7, _this8, _this9, _this10, _this11, _product_images, _sortedResults_, _sortedResults_1, _sortedResults_2;
    _s();
    // ステート
    const [selectedMarketplaces, setSelectedMarketplaces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        'ebay_us',
        'qoo10_jp'
    ]);
    const [pricingResults, setPricingResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isCalculating, setIsCalculating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scheduleDate, setScheduleDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // 商品データ（拡張型対応）
    const costPriceJpy = ((_this = product) === null || _this === void 0 ? void 0 : _this.purchase_price_jpy) || ((_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.price_jpy) || ((_this2 = product) === null || _this2 === void 0 ? void 0 : _this2.cost_price_jpy) || ((_this3 = product) === null || _this3 === void 0 ? void 0 : _this3.cost) || ((_this4 = product) === null || _this4 === void 0 ? void 0 : (_scraped_data = _this4.scraped_data) === null || _scraped_data === void 0 ? void 0 : _scraped_data.price) || // 仕入れ先データから
    0;
    const weightGrams = ((_this5 = product) === null || _this5 === void 0 ? void 0 : _this5.weight_g) || ((_this6 = product) === null || _this6 === void 0 ? void 0 : _this6.weight_grams) || 500;
    const englishTitle = ((_this7 = product) === null || _this7 === void 0 ? void 0 : _this7.english_title) || (product === null || product === void 0 ? void 0 : product.title) || '';
    const japaneseTitle = ((_this8 = product) === null || _this8 === void 0 ? void 0 : _this8.japanese_title) || ((_this9 = product) === null || _this9 === void 0 ? void 0 : _this9.title_ja) || '';
    const imageUrls = (product === null || product === void 0 ? void 0 : product.selectedImages) || ((_this10 = product) === null || _this10 === void 0 ? void 0 : _this10.image_urls) || ((_this11 = product) === null || _this11 === void 0 ? void 0 : _this11.gallery_images) || (product === null || product === void 0 ? void 0 : (_product_images = product.images) === null || _product_images === void 0 ? void 0 : _product_images.map((img)=>img.url)) || [];
    // 有効なマーケットプレイス
    const enabledMarketplaces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$marketplace$2f$marketplace$2d$configs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEnabledMarketplaces"])();
    // =====================================================
    // マーケットプレイス選択
    // =====================================================
    const toggleMarketplace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabMultiListing.TabMultiListing.useCallback[toggleMarketplace]": (mpId)=>{
            setSelectedMarketplaces({
                "TabMultiListing.TabMultiListing.useCallback[toggleMarketplace]": (prev)=>{
                    if (prev.includes(mpId)) {
                        return prev.filter({
                            "TabMultiListing.TabMultiListing.useCallback[toggleMarketplace]": (id)=>id !== mpId
                        }["TabMultiListing.TabMultiListing.useCallback[toggleMarketplace]"]);
                    } else {
                        return [
                            ...prev,
                            mpId
                        ];
                    }
                }
            }["TabMultiListing.TabMultiListing.useCallback[toggleMarketplace]"]);
        }
    }["TabMultiListing.TabMultiListing.useCallback[toggleMarketplace]"], []);
    const selectAllMarketplaces = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabMultiListing.TabMultiListing.useCallback[selectAllMarketplaces]": ()=>{
            setSelectedMarketplaces(enabledMarketplaces.map({
                "TabMultiListing.TabMultiListing.useCallback[selectAllMarketplaces]": (mp)=>mp.id
            }["TabMultiListing.TabMultiListing.useCallback[selectAllMarketplaces]"]));
        }
    }["TabMultiListing.TabMultiListing.useCallback[selectAllMarketplaces]"], [
        enabledMarketplaces
    ]);
    const clearSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabMultiListing.TabMultiListing.useCallback[clearSelection]": ()=>{
            setSelectedMarketplaces([]);
        }
    }["TabMultiListing.TabMultiListing.useCallback[clearSelection]"], []);
    // =====================================================
    // 一括利益計算
    // =====================================================
    const handleCalculate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabMultiListing.TabMultiListing.useCallback[handleCalculate]": async ()=>{
            if (!(product === null || product === void 0 ? void 0 : product.id) || costPriceJpy <= 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('商品データまたは仕入れ価格がありません');
                return;
            }
            if (selectedMarketplaces.length === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('計算するマーケットプレイスを選択してください');
                return;
            }
            setIsCalculating(true);
            try {
                const response = await fetch('/api/v2/pricing/multi-marketplace', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        costPriceJpy,
                        weightGrams,
                        targetMarketplaces: selectedMarketplaces
                    })
                });
                const result = await response.json();
                if (result.success) {
                    setPricingResults(result.results);
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("".concat(result.results.length, "件のマーケットプレイスを計算しました"));
                    if (result.bestMarketplace) {
                        const bestConfig = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$marketplace$2f$marketplace$2d$configs$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MARKETPLACE_CONFIGS"][result.bestMarketplace];
                        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info("最高利益: ".concat(bestConfig === null || bestConfig === void 0 ? void 0 : bestConfig.displayName, " (¥").concat(Math.round(result.summary.maxProfitJpy).toLocaleString(), ")"));
                    }
                } else {
                    throw new Error(result.error || '計算に失敗しました');
                }
            } catch (error) {
                console.error('[TabMultiListing] 計算エラー:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("計算エラー: ".concat(error.message));
            } finally{
                setIsCalculating(false);
            }
        }
    }["TabMultiListing.TabMultiListing.useCallback[handleCalculate]"], [
        product === null || product === void 0 ? void 0 : product.id,
        costPriceJpy,
        weightGrams,
        selectedMarketplaces
    ]);
    // =====================================================
    // キューに保存
    // =====================================================
    const saveToQueue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabMultiListing.TabMultiListing.useCallback[saveToQueue]": async (status)=>{
            if (!(product === null || product === void 0 ? void 0 : product.id)) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('商品が選択されていません');
                return;
            }
            if (pricingResults.length === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('先に利益計算を実行してください');
                return;
            }
            if (status === 'scheduled' && !scheduleDate) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('スケジュール日時を選択してください');
                return;
            }
            setIsSaving(true);
            try {
                const profitMap = pricingResults.reduce({
                    "TabMultiListing.TabMultiListing.useCallback[saveToQueue].profitMap": (acc, r)=>{
                        acc[r.marketplace] = r;
                        return acc;
                    }
                }["TabMultiListing.TabMultiListing.useCallback[saveToQueue].profitMap"], {});
                const response = await fetch('/api/v2/listing-queue', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productMasterId: product.id,
                        marketplaces: selectedMarketplaces,
                        status,
                        scheduledAt: status === 'scheduled' ? new Date(scheduleDate).toISOString() : undefined,
                        listingData: {
                            title: englishTitle,
                            images: imageUrls,
                            sku: product.sku
                        },
                        profitCalculation: profitMap
                    })
                });
                const result = await response.json();
                if (result.success) {
                    const messages = {
                        draft: '下書きを保存しました',
                        scheduled: "".concat(new Date(scheduleDate).toLocaleString('ja-JP'), " に出品をスケジュールしました"),
                        pending: '出品キューに追加しました（まもなく実行されます）'
                    };
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(messages[status]);
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("保存エラー: ".concat(error.message));
            } finally{
                setIsSaving(false);
            }
        }
    }["TabMultiListing.TabMultiListing.useCallback[saveToQueue]"], [
        product === null || product === void 0 ? void 0 : product.id,
        product === null || product === void 0 ? void 0 : product.sku,
        selectedMarketplaces,
        pricingResults,
        englishTitle,
        imageUrls,
        scheduleDate
    ]);
    // =====================================================
    // 商品がない場合
    // =====================================================
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '2rem',
                textAlign: 'center',
                color: T.textMuted
            },
            children: "商品データがありません"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
            lineNumber: 257,
            columnNumber: 7
        }, this);
    }
    // =====================================================
    // 利益計算結果をソート（利益順）
    // =====================================================
    const sortedResults = [
        ...pricingResults
    ].sort((a, b)=>b.profitJpy - a.profitJpy);
    const maxProfitJpy = ((_sortedResults_ = sortedResults[0]) === null || _sortedResults_ === void 0 ? void 0 : _sortedResults_.profitJpy) || 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '1rem',
            background: T.bg,
            height: '100%',
            overflow: 'auto'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'grid',
                gridTemplateColumns: '280px 1fr',
                gap: '1rem'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                            title: "商品情報",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '10px',
                                        color: T.textMuted,
                                        marginBottom: '0.25rem'
                                    },
                                    children: [
                                        "SKU: ",
                                        product.sku || '-'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                    lineNumber: 280,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '11px',
                                        color: T.text,
                                        fontWeight: 500,
                                        marginBottom: '0.25rem',
                                        lineHeight: 1.3
                                    },
                                    children: [
                                        (japaneseTitle || englishTitle).substring(0, 50),
                                        (japaneseTitle || englishTitle).length > 50 ? '...' : ''
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                    lineNumber: 283,
                                    columnNumber: 13
                                }, this),
                                japaneseTitle && englishTitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '9px',
                                        color: T.textSubtle,
                                        marginBottom: '0.5rem'
                                    },
                                    children: [
                                        "EN: ",
                                        englishTitle.substring(0, 30),
                                        "..."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                    lineNumber: 287,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0.5rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                                            label: "仕入値",
                                            value: costPriceJpy > 0 ? "¥".concat(costPriceJpy.toLocaleString()) : '未設定'
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                            lineNumber: 292,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                                            label: "重量",
                                            value: "".concat(weightGrams, "g")
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                            lineNumber: 296,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this),
                                costPriceJpy <= 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: '0.5rem',
                                        padding: '0.375rem',
                                        background: "".concat(T.warning, "15"),
                                        borderRadius: '4px',
                                        fontSize: '9px',
                                        color: T.warning
                                    },
                                    children: "⚠️ 仕入れ価格が未設定です"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                    lineNumber: 299,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                            lineNumber: 279,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                            title: "マーケットプレイス選択",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: '0.25rem',
                                        marginBottom: '0.5rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MiniButton, {
                                            onClick: selectAllMarketplaces,
                                            children: "全選択"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                            lineNumber: 315,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MiniButton, {
                                            onClick: clearSelection,
                                            children: "クリア"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                            lineNumber: 316,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                    lineNumber: 314,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem',
                                        maxHeight: '250px',
                                        overflow: 'auto'
                                    },
                                    children: enabledMarketplaces.map((mp)=>{
                                        const isSelected = selectedMarketplaces.includes(mp.id);
                                        const color = MP_COLORS[mp.id] || T.accent;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.375rem 0.5rem',
                                                borderRadius: '4px',
                                                background: isSelected ? "".concat(color, "15") : T.highlight,
                                                border: "1px solid ".concat(isSelected ? color : 'transparent'),
                                                cursor: 'pointer',
                                                fontSize: '10px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: isSelected,
                                                    onChange: ()=>toggleMarketplace(mp.id),
                                                    style: {
                                                        accentColor: color
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                    lineNumber: 339,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        background: color,
                                                        flexShrink: 0
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                    lineNumber: 345,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontWeight: isSelected ? 600 : 400,
                                                        color: isSelected ? color : T.text
                                                    },
                                                    children: mp.displayName
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                    lineNumber: 352,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        marginLeft: 'auto',
                                                        color: T.textSubtle,
                                                        fontSize: '8px'
                                                    },
                                                    children: mp.currency
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                    lineNumber: 355,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, mp.id, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                            lineNumber: 325,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                    lineNumber: 319,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: '0.5rem',
                                        padding: '0.375rem',
                                        background: T.highlight,
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        color: T.textMuted,
                                        textAlign: 'center'
                                    },
                                    children: [
                                        selectedMarketplaces.length,
                                        "件選択中"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                    lineNumber: 363,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                            lineNumber: 313,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleCalculate,
                            disabled: isCalculating || selectedMarketplaces.length === 0,
                            style: {
                                padding: '0.625rem 1rem',
                                fontSize: '12px',
                                fontWeight: 600,
                                borderRadius: '6px',
                                border: 'none',
                                background: T.accent,
                                color: '#fff',
                                cursor: selectedMarketplaces.length > 0 ? 'pointer' : 'not-allowed',
                                opacity: selectedMarketplaces.length > 0 ? 1 : 0.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            },
                            children: isCalculating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        size: 14,
                                        className: "animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                        lineNumber: 397,
                                        columnNumber: 17
                                    }, this),
                                    " 計算中..."
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                        lineNumber: 399,
                                        columnNumber: 17
                                    }, this),
                                    " 一括利益計算"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                            lineNumber: 377,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                    lineNumber: 276,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    },
                    children: pricingResults.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        title: "利益比較マトリックス",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '2rem',
                                textAlign: 'center',
                                color: T.textMuted,
                                fontSize: '12px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                                    size: 32,
                                    style: {
                                        marginBottom: '0.5rem',
                                        opacity: 0.5
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                    lineNumber: 418,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: "マーケットプレイスを選択して「一括利益計算」をクリック"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                    lineNumber: 419,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                            lineNumber: 412,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                        lineNumber: 411,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: '0.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                                        label: "計算件数",
                                        value: "".concat(pricingResults.length, "件"),
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                            lineNumber: 433,
                                            columnNumber: 25
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                        lineNumber: 430,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                                        label: "黒字",
                                        value: "".concat(pricingResults.filter((r)=>r.isProfitable).length, "件"),
                                        color: T.success,
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                            lineNumber: 439,
                                            columnNumber: 25
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                        lineNumber: 435,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                                        label: "最高利益",
                                        value: "¥".concat(Math.round(maxProfitJpy).toLocaleString()),
                                        color: T.success,
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                            lineNumber: 445,
                                            columnNumber: 25
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                        lineNumber: 441,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryCard, {
                                        label: "ベスト",
                                        value: ((_sortedResults_1 = sortedResults[0]) === null || _sortedResults_1 === void 0 ? void 0 : _sortedResults_1.marketplaceName) || '-',
                                        color: MP_COLORS[(_sortedResults_2 = sortedResults[0]) === null || _sortedResults_2 === void 0 ? void 0 : _sortedResults_2.marketplace] || T.accent
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                        lineNumber: 447,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                lineNumber: 425,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                title: "利益比較マトリックス",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        overflowX: 'auto'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        style: {
                                            width: '100%',
                                            borderCollapse: 'collapse',
                                            fontSize: '10px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    style: {
                                                        background: T.highlight
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: thStyle,
                                                            children: "#"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                            lineNumber: 460,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: thStyle,
                                                            children: "マーケットプレイス"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                            lineNumber: 461,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                ...thStyle,
                                                                textAlign: 'right'
                                                            },
                                                            children: "販売価格"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                            lineNumber: 462,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                ...thStyle,
                                                                textAlign: 'right'
                                                            },
                                                            children: "送料"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                ...thStyle,
                                                                textAlign: 'right'
                                                            },
                                                            children: "手数料"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                            lineNumber: 464,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                ...thStyle,
                                                                textAlign: 'right'
                                                            },
                                                            children: "利益 (JPY)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                            lineNumber: 465,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            style: {
                                                                ...thStyle,
                                                                textAlign: 'right'
                                                            },
                                                            children: "利益率"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                            lineNumber: 466,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                    lineNumber: 459,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                lineNumber: 458,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                children: sortedResults.map((result, index)=>{
                                                    const color = MP_COLORS[result.marketplace] || T.accent;
                                                    const isTop = index === 0;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        style: {
                                                            background: isTop ? "".concat(T.success, "10") : 'transparent',
                                                            borderBottom: "1px solid ".concat(T.panelBorder)
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: tdStyle,
                                                                children: isTop ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        background: T.success,
                                                                        color: '#fff',
                                                                        padding: '2px 6px',
                                                                        borderRadius: '4px',
                                                                        fontSize: '8px',
                                                                        fontWeight: 700
                                                                    },
                                                                    children: "BEST"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                    lineNumber: 484,
                                                                    columnNumber: 33
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        color: T.textMuted
                                                                    },
                                                                    children: index + 1
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                    lineNumber: 495,
                                                                    columnNumber: 33
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                lineNumber: 482,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: tdStyle,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.375rem'
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: {
                                                                                width: '8px',
                                                                                height: '8px',
                                                                                borderRadius: '50%',
                                                                                background: color,
                                                                                flexShrink: 0
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                            lineNumber: 500,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: {
                                                                                fontWeight: 600,
                                                                                color: color
                                                                            },
                                                                            children: result.marketplaceName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                            lineNumber: 507,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                    lineNumber: 499,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                lineNumber: 498,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    ...tdStyle,
                                                                    textAlign: 'right',
                                                                    fontFamily: 'monospace'
                                                                },
                                                                children: formatCurrency(result.suggestedPrice, result.currency)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                lineNumber: 512,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    ...tdStyle,
                                                                    textAlign: 'right',
                                                                    fontFamily: 'monospace',
                                                                    color: T.textMuted
                                                                },
                                                                children: formatCurrency(result.shippingCost, result.currency)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                lineNumber: 515,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    ...tdStyle,
                                                                    textAlign: 'right',
                                                                    fontFamily: 'monospace',
                                                                    color: T.textMuted
                                                                },
                                                                children: formatCurrency(result.totalFees, result.currency)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                lineNumber: 518,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    ...tdStyle,
                                                                    textAlign: 'right',
                                                                    fontFamily: 'monospace',
                                                                    fontWeight: 700,
                                                                    color: result.isProfitable ? T.success : T.error
                                                                },
                                                                children: [
                                                                    "¥",
                                                                    Math.round(result.profitJpy).toLocaleString()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                lineNumber: 521,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                style: {
                                                                    ...tdStyle,
                                                                    textAlign: 'right',
                                                                    color: result.profitMargin >= 15 ? T.success : result.profitMargin >= 10 ? T.warning : T.error
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'flex-end',
                                                                        gap: '0.25rem'
                                                                    },
                                                                    children: [
                                                                        result.profitMargin >= 15 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                                            size: 10
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                            lineNumber: 536,
                                                                            columnNumber: 62
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
                                                                            size: 10
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                            lineNumber: 536,
                                                                            columnNumber: 89
                                                                        }, this),
                                                                        result.profitMargin.toFixed(1),
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                    lineNumber: 535,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                                lineNumber: 530,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, result.marketplace, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                        lineNumber: 475,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                lineNumber: 469,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                        lineNumber: 457,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                    lineNumber: 456,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                lineNumber: 455,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                                title: "出品アクション",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr 1fr',
                                            gap: '0.75rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                                    onClick: ()=>saveToQueue('draft'),
                                                    disabled: isSaving,
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                        lineNumber: 557,
                                                        columnNumber: 29
                                                    }, void 0),
                                                    label: "下書き保存",
                                                    description: "あとで編集",
                                                    color: T.textMuted
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                    lineNumber: 554,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                lineNumber: 553,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            marginBottom: '0.5rem'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "datetime-local",
                                                            value: scheduleDate,
                                                            onChange: (e)=>setScheduleDate(e.target.value),
                                                            style: {
                                                                width: '100%',
                                                                padding: '0.375rem',
                                                                fontSize: '10px',
                                                                borderRadius: '4px',
                                                                border: "1px solid ".concat(T.panelBorder)
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                            lineNumber: 567,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                        lineNumber: 566,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                                        onClick: ()=>saveToQueue('scheduled'),
                                                        disabled: isSaving || !scheduleDate,
                                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                            lineNumber: 583,
                                                            columnNumber: 29
                                                        }, void 0),
                                                        label: "スケジュール",
                                                        description: "指定日時に出品",
                                                        color: T.warning
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                        lineNumber: 580,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                lineNumber: 565,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                                    onClick: ()=>saveToQueue('pending'),
                                                    disabled: isSaving,
                                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rocket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rocket$3e$__["Rocket"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                        lineNumber: 595,
                                                        columnNumber: 29
                                                    }, void 0),
                                                    label: "即時出品",
                                                    description: "今すぐキューに追加",
                                                    color: T.success,
                                                    primary: true
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                    lineNumber: 592,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                lineNumber: 591,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                        lineNumber: 550,
                                        columnNumber: 17
                                    }, this),
                                    pricingResults.some((r)=>!r.isProfitable) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: '0.75rem',
                                            padding: '0.5rem 0.75rem',
                                            background: "".concat(T.warning, "15"),
                                            border: "1px solid ".concat(T.warning, "40"),
                                            borderRadius: '4px',
                                            fontSize: '10px',
                                            color: T.warning,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.375rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                                lineNumber: 618,
                                                columnNumber: 21
                                            }, this),
                                            "一部のマーケットプレイスで赤字になります"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                        lineNumber: 606,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                                lineNumber: 549,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                    lineNumber: 407,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
            lineNumber: 271,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
        lineNumber: 270,
        columnNumber: 5
    }, this);
}, "VlSslK5vDSAk720YVppXBSk2Fak=")), "VlSslK5vDSAk720YVppXBSk2Fak=");
_c1 = TabMultiListing;
// =====================================================
// サブコンポーネント
// =====================================================
function Card(param) {
    let { title, children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '0.75rem',
            borderRadius: '6px',
            background: T.panel,
            border: "1px solid ".concat(T.panelBorder)
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: T.textSubtle,
                    marginBottom: '0.5rem'
                },
                children: title
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                lineNumber: 643,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
        lineNumber: 637,
        columnNumber: 5
    }, this);
}
_c2 = Card;
function StatBox(param) {
    let { label, value } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '0.375rem',
            borderRadius: '4px',
            background: T.highlight,
            textAlign: 'center'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '8px',
                    color: T.textSubtle
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                lineNumber: 665,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '11px',
                    fontWeight: 600,
                    color: T.text
                },
                children: value
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                lineNumber: 666,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
        lineNumber: 659,
        columnNumber: 5
    }, this);
}
_c3 = StatBox;
function SummaryCard(param) {
    let { label, value, color = T.accent, icon } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '0.625rem',
            borderRadius: '6px',
            background: T.panel,
            border: "1px solid ".concat(T.panelBorder),
            textAlign: 'center'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '8px',
                    textTransform: 'uppercase',
                    color: T.textSubtle,
                    marginBottom: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                },
                children: [
                    icon,
                    label
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                lineNumber: 690,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '13px',
                    fontWeight: 700,
                    color
                },
                children: value
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                lineNumber: 703,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
        lineNumber: 683,
        columnNumber: 5
    }, this);
}
_c4 = SummaryCard;
function MiniButton(param) {
    let { onClick, children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        style: {
            padding: '0.25rem 0.5rem',
            fontSize: '9px',
            borderRadius: '3px',
            border: "1px solid ".concat(T.panelBorder),
            background: T.panel,
            color: T.textMuted,
            cursor: 'pointer'
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
        lineNumber: 710,
        columnNumber: 5
    }, this);
}
_c5 = MiniButton;
function ActionButton(param) {
    let { onClick, disabled, icon, label, description, color, primary } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        disabled: disabled,
        style: {
            width: '100%',
            padding: '0.625rem',
            borderRadius: '6px',
            border: primary ? 'none' : "1px solid ".concat(T.panelBorder),
            background: primary ? color : T.panel,
            color: primary ? '#fff' : color,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            textAlign: 'center'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.375rem',
                    marginBottom: '0.25rem'
                },
                children: [
                    icon,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '11px',
                            fontWeight: 600
                        },
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                        lineNumber: 762,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                lineNumber: 760,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '8px',
                    opacity: 0.8
                },
                children: description
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
                lineNumber: 764,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx",
        lineNumber: 745,
        columnNumber: 5
    }, this);
}
_c6 = ActionButton;
// =====================================================
// ユーティリティ
// =====================================================
const thStyle = {
    padding: '0.5rem',
    textAlign: 'left',
    fontWeight: 600,
    color: T.textMuted,
    borderBottom: "2px solid ".concat(T.panelBorder)
};
const tdStyle = {
    padding: '0.5rem',
    verticalAlign: 'middle'
};
function formatCurrency(value, currency) {
    const symbols = {
        'USD': '$',
        'JPY': '¥',
        'GBP': '£',
        'EUR': '€',
        'AUD': 'A$',
        'SGD': 'S$',
        'MYR': 'RM',
        'THB': '฿',
        'PHP': '₱',
        'TWD': 'NT$',
        'VND': '₫',
        'KRW': '₩'
    };
    const symbol = symbols[currency] || currency;
    if (currency === 'JPY' || currency === 'KRW' || currency === 'VND') {
        return "".concat(symbol).concat(Math.round(value).toLocaleString());
    }
    return "".concat(symbol).concat(value.toFixed(2));
}
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "TabMultiListing$memo");
__turbopack_context__.k.register(_c1, "TabMultiListing");
__turbopack_context__.k.register(_c2, "Card");
__turbopack_context__.k.register(_c3, "StatBox");
__turbopack_context__.k.register(_c4, "SummaryCard");
__turbopack_context__.k.register(_c5, "MiniButton");
__turbopack_context__.k.register(_c6, "ActionButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_be9add1b._.js.map