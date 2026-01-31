(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/lib/qoo10/shipping-rates.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Qoo10 Domestic Shipping Rates Data (2024)
 * Shipping rates for Yamato, Japan Post, and Sagawa from Kanto region
 */ __turbopack_context__.s([
    "CARRIER_DISPLAY_NAMES",
    ()=>CARRIER_DISPLAY_NAMES,
    "CLICK_POST_RATE",
    ()=>CLICK_POST_RATE,
    "LETTERPACK_RATES",
    ()=>LETTERPACK_RATES,
    "NEKOPOS_RATE",
    ()=>NEKOPOS_RATE,
    "REGION_DISPLAY_NAMES",
    ()=>REGION_DISPLAY_NAMES,
    "SHIPPING_SERVICES",
    ()=>SHIPPING_SERVICES,
    "YAMATO_COMPACT_RATES",
    ()=>YAMATO_COMPACT_RATES,
    "YAMATO_TAKKYUBIN_RATES",
    ()=>YAMATO_TAKKYUBIN_RATES,
    "YUPACKET_RATES",
    ()=>YUPACKET_RATES,
    "YUPACK_RATES",
    ()=>YUPACK_RATES,
    "calculateAverageShippingRate",
    ()=>calculateAverageShippingRate,
    "findCheapestShipping",
    ()=>findCheapestShipping,
    "getServicesForCarrier",
    ()=>getServicesForCarrier,
    "getShippingRate",
    ()=>getShippingRate,
    "getShippingRatesByRegion",
    ()=>getShippingRatesByRegion
]);
const YAMATO_TAKKYUBIN_RATES = {
    '60': {
        kanto: 930,
        shinetsu: 930,
        hokuriku: 930,
        tokai: 930,
        kinki: 1040,
        chugoku: 1150,
        shikoku: 1150,
        kyushu: 1150,
        hokkaido: 1370,
        okinawa: 1430
    },
    '80': {
        kanto: 1150,
        shinetsu: 1150,
        hokuriku: 1150,
        tokai: 1150,
        kinki: 1260,
        chugoku: 1370,
        shikoku: 1370,
        kyushu: 1480,
        hokkaido: 1590,
        okinawa: 1650
    },
    '100': {
        kanto: 1390,
        shinetsu: 1390,
        hokuriku: 1390,
        tokai: 1390,
        kinki: 1500,
        chugoku: 1610,
        shikoku: 1610,
        kyushu: 1720,
        hokkaido: 1830,
        okinawa: 2070
    },
    '120': {
        kanto: 1610,
        shinetsu: 1610,
        hokuriku: 1610,
        tokai: 1610,
        kinki: 1720,
        chugoku: 1830,
        shikoku: 1830,
        kyushu: 1940,
        hokkaido: 2050,
        okinawa: 2510
    },
    '140': {
        kanto: 1850,
        shinetsu: 1850,
        hokuriku: 1850,
        tokai: 1850,
        kinki: 1960,
        chugoku: 2070,
        shikoku: 2070,
        kyushu: 2180,
        hokkaido: 2290,
        okinawa: 2950
    },
    '160': {
        kanto: 2070,
        shinetsu: 2070,
        hokuriku: 2070,
        tokai: 2070,
        kinki: 2180,
        chugoku: 2290,
        shikoku: 2290,
        kyushu: 2400,
        hokkaido: 2510,
        okinawa: 3390
    }
};
const NEKOPOS_RATE = 385;
const YAMATO_COMPACT_RATES = {
    kanto: 690,
    shinetsu: 690,
    hokuriku: 690,
    tokai: 690,
    kinki: 800,
    chugoku: 910,
    shikoku: 910,
    kyushu: 910,
    hokkaido: 1130,
    okinawa: 1130
};
const YUPACK_RATES = {
    '60': {
        kanto: 870,
        shinetsu: 870,
        hokuriku: 920,
        tokai: 920,
        kinki: 970,
        chugoku: 1100,
        shikoku: 1100,
        kyushu: 1100,
        hokkaido: 1300,
        okinawa: 1350
    },
    '80': {
        kanto: 1100,
        shinetsu: 1100,
        hokuriku: 1140,
        tokai: 1140,
        kinki: 1200,
        chugoku: 1310,
        shikoku: 1310,
        kyushu: 1310,
        hokkaido: 1530,
        okinawa: 1560
    },
    '100': {
        kanto: 1330,
        shinetsu: 1330,
        hokuriku: 1390,
        tokai: 1390,
        kinki: 1440,
        chugoku: 1560,
        shikoku: 1560,
        kyushu: 1560,
        hokkaido: 1760,
        okinawa: 1970
    },
    '120': {
        kanto: 1590,
        shinetsu: 1590,
        hokuriku: 1640,
        tokai: 1640,
        kinki: 1690,
        chugoku: 1800,
        shikoku: 1800,
        kyushu: 1800,
        hokkaido: 2010,
        okinawa: 2410
    },
    '140': {
        kanto: 1830,
        shinetsu: 1830,
        hokuriku: 1890,
        tokai: 1890,
        kinki: 1950,
        chugoku: 2060,
        shikoku: 2060,
        kyushu: 2060,
        hokkaido: 2260,
        okinawa: 2840
    },
    '160': {
        kanto: 2060,
        shinetsu: 2060,
        hokuriku: 2130,
        tokai: 2130,
        kinki: 2190,
        chugoku: 2310,
        shikoku: 2310,
        kyushu: 2310,
        hokkaido: 2500,
        okinawa: 3280
    },
    '170': {
        kanto: 2410,
        shinetsu: 2410,
        hokuriku: 2480,
        tokai: 2480,
        kinki: 2540,
        chugoku: 2660,
        shikoku: 2660,
        kyushu: 2660,
        hokkaido: 2850,
        okinawa: 3780
    }
};
const YUPACKET_RATES = {
    '1cm': 250,
    '2cm': 310,
    '3cm': 360 // 厚さ3cm以内
};
const CLICK_POST_RATE = 185;
const LETTERPACK_RATES = {
    plus: 520,
    light: 370 // レターパックライト（4kg、厚さ3cm）
};
const SHIPPING_SERVICES = [
    // Yamato services
    {
        id: 'yamato-nekopos',
        carrier: 'yamato',
        name: 'NekoPos',
        nameJa: 'ネコポス',
        sizeCode: 'A4',
        maxWeightG: 1000,
        maxLengthCm: 31.2,
        maxWidthCm: 22.8,
        maxHeightCm: 3,
        isFlat: true,
        flatRate: NEKOPOS_RATE,
        tracking: true,
        compensation: false,
        description: 'A4サイズ、厚さ3cm以内、1kg以内。ポスト投函。'
    },
    {
        id: 'yamato-compact',
        carrier: 'yamato',
        name: 'Takkyubin Compact',
        nameJa: '宅急便コンパクト',
        sizeCode: 'compact',
        maxWeightG: 10000,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '専用BOX（70円別途）。手渡し配達。'
    },
    {
        id: 'yamato-60',
        carrier: 'yamato',
        name: 'Takkyubin 60',
        nameJa: '宅急便 60サイズ',
        sizeCode: '60',
        maxWeightG: 2000,
        maxTotalCm: 60,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計60cm以内、2kg以内'
    },
    {
        id: 'yamato-80',
        carrier: 'yamato',
        name: 'Takkyubin 80',
        nameJa: '宅急便 80サイズ',
        sizeCode: '80',
        maxWeightG: 5000,
        maxTotalCm: 80,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計80cm以内、5kg以内'
    },
    {
        id: 'yamato-100',
        carrier: 'yamato',
        name: 'Takkyubin 100',
        nameJa: '宅急便 100サイズ',
        sizeCode: '100',
        maxWeightG: 10000,
        maxTotalCm: 100,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計100cm以内、10kg以内'
    },
    {
        id: 'yamato-120',
        carrier: 'yamato',
        name: 'Takkyubin 120',
        nameJa: '宅急便 120サイズ',
        sizeCode: '120',
        maxWeightG: 15000,
        maxTotalCm: 120,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計120cm以内、15kg以内'
    },
    {
        id: 'yamato-140',
        carrier: 'yamato',
        name: 'Takkyubin 140',
        nameJa: '宅急便 140サイズ',
        sizeCode: '140',
        maxWeightG: 20000,
        maxTotalCm: 140,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計140cm以内、20kg以内'
    },
    {
        id: 'yamato-160',
        carrier: 'yamato',
        name: 'Takkyubin 160',
        nameJa: '宅急便 160サイズ',
        sizeCode: '160',
        maxWeightG: 25000,
        maxTotalCm: 160,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計160cm以内、25kg以内'
    },
    // Japan Post services
    {
        id: 'jp-clickpost',
        carrier: 'jp_post',
        name: 'Click Post',
        nameJa: 'クリックポスト',
        sizeCode: '3cm',
        maxWeightG: 1000,
        maxLengthCm: 34,
        maxWidthCm: 25,
        maxHeightCm: 3,
        isFlat: true,
        flatRate: CLICK_POST_RATE,
        tracking: true,
        compensation: false,
        description: 'A4サイズ、厚さ3cm以内、1kg以内。ポスト投函。最安！'
    },
    {
        id: 'jp-yupacket-1cm',
        carrier: 'jp_post',
        name: 'Yu-Packet 1cm',
        nameJa: 'ゆうパケット（1cm）',
        sizeCode: '1cm',
        maxWeightG: 1000,
        maxLengthCm: 34,
        maxWidthCm: 25,
        maxHeightCm: 1,
        isFlat: true,
        flatRate: YUPACKET_RATES['1cm'],
        tracking: true,
        compensation: false,
        description: 'A4サイズ、厚さ1cm以内'
    },
    {
        id: 'jp-yupacket-2cm',
        carrier: 'jp_post',
        name: 'Yu-Packet 2cm',
        nameJa: 'ゆうパケット（2cm）',
        sizeCode: '2cm',
        maxWeightG: 1000,
        maxLengthCm: 34,
        maxWidthCm: 25,
        maxHeightCm: 2,
        isFlat: true,
        flatRate: YUPACKET_RATES['2cm'],
        tracking: true,
        compensation: false,
        description: 'A4サイズ、厚さ2cm以内'
    },
    {
        id: 'jp-yupacket-3cm',
        carrier: 'jp_post',
        name: 'Yu-Packet 3cm',
        nameJa: 'ゆうパケット（3cm）',
        sizeCode: '3cm',
        maxWeightG: 1000,
        maxLengthCm: 34,
        maxWidthCm: 25,
        maxHeightCm: 3,
        isFlat: true,
        flatRate: YUPACKET_RATES['3cm'],
        tracking: true,
        compensation: false,
        description: 'A4サイズ、厚さ3cm以内'
    },
    {
        id: 'jp-letterpack-light',
        carrier: 'jp_post',
        name: 'Letter Pack Light',
        nameJa: 'レターパックライト',
        sizeCode: '3cm',
        maxWeightG: 4000,
        maxLengthCm: 34,
        maxWidthCm: 24.8,
        maxHeightCm: 3,
        isFlat: true,
        flatRate: LETTERPACK_RATES.light,
        tracking: true,
        compensation: false,
        description: '専用封筒、4kg以内、厚さ3cm以内。ポスト投函。'
    },
    {
        id: 'jp-letterpack-plus',
        carrier: 'jp_post',
        name: 'Letter Pack Plus',
        nameJa: 'レターパックプラス',
        sizeCode: '4kg',
        maxWeightG: 4000,
        maxLengthCm: 34,
        maxWidthCm: 24.8,
        isFlat: true,
        flatRate: LETTERPACK_RATES.plus,
        tracking: true,
        compensation: false,
        description: '専用封筒、4kg以内、厚さ制限なし。対面配達。'
    },
    {
        id: 'jp-yupack-60',
        carrier: 'jp_post',
        name: 'Yu-Pack 60',
        nameJa: 'ゆうパック 60サイズ',
        sizeCode: '60',
        maxWeightG: 25000,
        maxTotalCm: 60,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計60cm以内、25kg以内'
    },
    {
        id: 'jp-yupack-80',
        carrier: 'jp_post',
        name: 'Yu-Pack 80',
        nameJa: 'ゆうパック 80サイズ',
        sizeCode: '80',
        maxWeightG: 25000,
        maxTotalCm: 80,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計80cm以内、25kg以内'
    },
    {
        id: 'jp-yupack-100',
        carrier: 'jp_post',
        name: 'Yu-Pack 100',
        nameJa: 'ゆうパック 100サイズ',
        sizeCode: '100',
        maxWeightG: 25000,
        maxTotalCm: 100,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計100cm以内、25kg以内'
    },
    {
        id: 'jp-yupack-120',
        carrier: 'jp_post',
        name: 'Yu-Pack 120',
        nameJa: 'ゆうパック 120サイズ',
        sizeCode: '120',
        maxWeightG: 25000,
        maxTotalCm: 120,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計120cm以内、25kg以内'
    },
    {
        id: 'jp-yupack-140',
        carrier: 'jp_post',
        name: 'Yu-Pack 140',
        nameJa: 'ゆうパック 140サイズ',
        sizeCode: '140',
        maxWeightG: 25000,
        maxTotalCm: 140,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計140cm以内、25kg以内'
    },
    {
        id: 'jp-yupack-160',
        carrier: 'jp_post',
        name: 'Yu-Pack 160',
        nameJa: 'ゆうパック 160サイズ',
        sizeCode: '160',
        maxWeightG: 25000,
        maxTotalCm: 160,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計160cm以内、25kg以内'
    },
    {
        id: 'jp-yupack-170',
        carrier: 'jp_post',
        name: 'Yu-Pack 170',
        nameJa: 'ゆうパック 170サイズ',
        sizeCode: '170',
        maxWeightG: 25000,
        maxTotalCm: 170,
        isFlat: false,
        tracking: true,
        compensation: true,
        description: '3辺合計170cm以内、25kg以内'
    }
];
const REGION_DISPLAY_NAMES = {
    kanto: '関東',
    shinetsu: '信越',
    hokuriku: '北陸',
    tokai: '東海',
    kinki: '近畿',
    chugoku: '中国',
    shikoku: '四国',
    kyushu: '九州',
    hokkaido: '北海道',
    okinawa: '沖縄'
};
const CARRIER_DISPLAY_NAMES = {
    yamato: 'ヤマト運輸',
    jp_post: '日本郵便',
    sagawa: '佐川急便'
};
function getShippingRate(carrier, sizeCode) {
    let region = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 'kanto';
    // Handle flat rate services
    if (carrier === 'yamato' && sizeCode === 'A4') {
        return NEKOPOS_RATE;
    }
    if (carrier === 'jp_post') {
        if (sizeCode === '1cm') return YUPACKET_RATES['1cm'];
        if (sizeCode === '2cm') return YUPACKET_RATES['2cm'];
        if (sizeCode === '3cm') {
            // Could be Yu-Packet or Click Post - return Click Post as it's cheaper
            return CLICK_POST_RATE;
        }
        if (sizeCode === '4kg') return LETTERPACK_RATES.plus;
    }
    // Handle variable rate services
    if (carrier === 'yamato') {
        if (sizeCode === 'compact') {
            return YAMATO_COMPACT_RATES[region] || YAMATO_COMPACT_RATES.kanto;
        }
        const rates = YAMATO_TAKKYUBIN_RATES[sizeCode];
        if (rates) {
            return rates[region] || rates.kanto;
        }
    }
    if (carrier === 'jp_post') {
        const rates = YUPACK_RATES[sizeCode];
        if (rates) {
            return rates[region] || rates.kanto;
        }
    }
    // Default fallback
    return 0;
}
function getShippingRatesByRegion(carrier, sizeCode) {
    if (carrier === 'yamato') {
        if (sizeCode === 'compact') return YAMATO_COMPACT_RATES;
        return YAMATO_TAKKYUBIN_RATES[sizeCode] || null;
    }
    if (carrier === 'jp_post') {
        return YUPACK_RATES[sizeCode] || null;
    }
    return null;
}
function getServicesForCarrier(carrier) {
    return SHIPPING_SERVICES.filter((s)=>s.carrier === carrier);
}
function findCheapestShipping(weightG, lengthCm, widthCm, heightCm) {
    let region = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 'kanto';
    const totalCm = (lengthCm || 0) + (widthCm || 0) + (heightCm || 0);
    const maxDim = Math.max(lengthCm || 0, widthCm || 0, heightCm || 0);
    const eligibleServices = SHIPPING_SERVICES.filter((service)=>{
        // Check weight
        if (weightG > service.maxWeightG) return false;
        // Check dimensions for size-based services
        if (service.maxTotalCm && totalCm > service.maxTotalCm) return false;
        // Check individual dimensions for flat services
        if (service.maxHeightCm && heightCm && heightCm > service.maxHeightCm) return false;
        if (service.maxLengthCm && lengthCm && lengthCm > service.maxLengthCm) return false;
        if (service.maxWidthCm && widthCm && widthCm > service.maxWidthCm) return false;
        return true;
    });
    if (eligibleServices.length === 0) return null;
    let cheapest = null;
    for (const service of eligibleServices){
        const rate = service.isFlat && service.flatRate ? service.flatRate : getShippingRate(service.carrier, service.sizeCode, region);
        if (!cheapest || rate < cheapest.rate) {
            cheapest = {
                service,
                rate
            };
        }
    }
    return cheapest;
}
function calculateAverageShippingRate(carrier, sizeCode) {
    const rates = getShippingRatesByRegion(carrier, sizeCode);
    if (!rates) return 0;
    const values = Object.values(rates);
    return Math.round(values.reduce((a, b)=>a + b, 0) / values.length);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabShippingDomestic",
    ()=>TabShippingDomestic,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * TabShippingDomestic - 国内配送設定タブ
 * 
 * ヤマト運輸、日本郵便、佐川急便の国内送料計算
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/qoo10/shipping-rates.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// スタイル
const T = {
    bg: '#F1F5F9',
    panel: '#ffffff',
    panelBorder: '#e2e8f0',
    highlight: '#f1f5f9',
    text: '#1e293b',
    textMuted: '#64748b',
    textSubtle: '#94a3b8',
    accent: '#ff0066',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    blue: '#3b82f6'
};
function TabShippingDomestic(param) {
    let { product, marketplace = 'qoo10-jp', onSave } = param;
    _s();
    // === 状態 ===
    const [selectedCarrier, setSelectedCarrier] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('jp_post');
    const [selectedService, setSelectedService] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedRegion, setSelectedRegion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('kanto');
    const [isFreeShipping, setIsFreeShipping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // 商品情報
    const [productInfo, setProductInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        weightG: 500,
        lengthCm: 0,
        widthCm: 0,
        heightCm: 0
    });
    // === 商品データから初期化 ===
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabShippingDomestic.useEffect": ()=>{
            if (product) {
                var _this, _this1, _this2, _this3;
                setProductInfo({
                    weightG: ((_this = product) === null || _this === void 0 ? void 0 : _this.weight_g) || 500,
                    lengthCm: ((_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.length_cm) || 0,
                    widthCm: ((_this2 = product) === null || _this2 === void 0 ? void 0 : _this2.width_cm) || 0,
                    heightCm: ((_this3 = product) === null || _this3 === void 0 ? void 0 : _this3.height_cm) || 0
                });
            }
        }
    }["TabShippingDomestic.useEffect"], [
        product
    ]);
    // === 利用可能なサービス ===
    const availableServices = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabShippingDomestic.useMemo[availableServices]": ()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIPPING_SERVICES"].filter({
                "TabShippingDomestic.useMemo[availableServices]": (s)=>s.carrier === selectedCarrier
            }["TabShippingDomestic.useMemo[availableServices]"]);
        }
    }["TabShippingDomestic.useMemo[availableServices]"], [
        selectedCarrier
    ]);
    // 最初のサービスを選択
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabShippingDomestic.useEffect": ()=>{
            if (availableServices.length > 0 && !selectedService) {
                setSelectedService(availableServices[0].id);
            }
        }
    }["TabShippingDomestic.useEffect"], [
        availableServices,
        selectedService
    ]);
    // === 選択中のサービス ===
    const currentService = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabShippingDomestic.useMemo[currentService]": ()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIPPING_SERVICES"].find({
                "TabShippingDomestic.useMemo[currentService]": (s)=>s.id === selectedService
            }["TabShippingDomestic.useMemo[currentService]"]);
        }
    }["TabShippingDomestic.useMemo[currentService]"], [
        selectedService
    ]);
    // === 送料計算 ===
    const shippingCost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabShippingDomestic.useMemo[shippingCost]": ()=>{
            if (!currentService) return 0;
            return currentService.isFlat && currentService.flatRate ? currentService.flatRate : (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getShippingRate"])(selectedCarrier, currentService.sizeCode, selectedRegion);
        }
    }["TabShippingDomestic.useMemo[shippingCost]"], [
        currentService,
        selectedCarrier,
        selectedRegion
    ]);
    // === 最安送料を自動選択 ===
    const autoSelectCheapest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabShippingDomestic.useCallback[autoSelectCheapest]": ()=>{
            const cheapest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findCheapestShipping"])(productInfo.weightG, productInfo.lengthCm || undefined, productInfo.widthCm || undefined, productInfo.heightCm || undefined, selectedRegion);
            if (cheapest) {
                setSelectedCarrier(cheapest.service.carrier);
                setSelectedService(cheapest.service.id);
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("最安送料: ".concat(cheapest.service.nameJa, " (¥").concat(cheapest.rate, ") を選択しました"));
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('適切な送料が見つかりませんでした');
            }
        }
    }["TabShippingDomestic.useCallback[autoSelectCheapest]"], [
        productInfo,
        selectedRegion
    ]);
    // === 保存 ===
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabShippingDomestic.useCallback[handleSave]": ()=>{
            onSave === null || onSave === void 0 ? void 0 : onSave({
                domestic_shipping: {
                    carrier: selectedCarrier,
                    service_id: selectedService,
                    service_name: currentService === null || currentService === void 0 ? void 0 : currentService.nameJa,
                    size_code: currentService === null || currentService === void 0 ? void 0 : currentService.sizeCode,
                    region: selectedRegion,
                    is_free_shipping: isFreeShipping,
                    shipping_cost: shippingCost,
                    product_weight_g: productInfo.weightG,
                    saved_at: new Date().toISOString()
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('配送設定を保存しました');
        }
    }["TabShippingDomestic.useCallback[handleSave]"], [
        selectedCarrier,
        selectedService,
        currentService,
        selectedRegion,
        isFreeShipping,
        shippingCost,
        productInfo,
        onSave
    ]);
    // === レンダリング ===
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '2rem',
                textAlign: 'center',
                color: T.textMuted
            },
            children: "商品を選択してください"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
            lineNumber: 138,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '1rem',
            overflow: 'auto',
            background: T.bg
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: "linear-gradient(135deg, ".concat(T.blue, ", #60a5fa)"),
                    borderRadius: '6px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-truck",
                                style: {
                                    color: 'white'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '14px'
                                },
                                children: "国内配送設定"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                        lineNumber: 156,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: autoSelectCheapest,
                        style: {
                            padding: '0.375rem 0.75rem',
                            fontSize: '10px',
                            fontWeight: 600,
                            borderRadius: '4px',
                            border: 'none',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            cursor: 'pointer'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-magic"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, this),
                            " 最安自動選択"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "商品サイズ・重量",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(4, 1fr)',
                                            gap: '0.5rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "重量 (g)",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: productInfo.weightG,
                                                    onChange: (e)=>setProductInfo((prev)=>({
                                                                ...prev,
                                                                weightG: Number(e.target.value)
                                                            })),
                                                    style: inputStyle
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                lineNumber: 185,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "縦 (cm)",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: productInfo.lengthCm,
                                                    onChange: (e)=>setProductInfo((prev)=>({
                                                                ...prev,
                                                                lengthCm: Number(e.target.value)
                                                            })),
                                                    style: inputStyle
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                    lineNumber: 194,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                lineNumber: 193,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "横 (cm)",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: productInfo.widthCm,
                                                    onChange: (e)=>setProductInfo((prev)=>({
                                                                ...prev,
                                                                widthCm: Number(e.target.value)
                                                            })),
                                                    style: inputStyle
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                    lineNumber: 202,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                lineNumber: 201,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "高さ (cm)",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: productInfo.heightCm,
                                                    onChange: (e)=>setProductInfo((prev)=>({
                                                                ...prev,
                                                                heightCm: Number(e.target.value)
                                                            })),
                                                    style: inputStyle
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                lineNumber: 209,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                        lineNumber: 184,
                                        columnNumber: 13
                                    }, this),
                                    productInfo.lengthCm > 0 && productInfo.widthCm > 0 && productInfo.heightCm > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: '0.5rem',
                                            fontSize: '10px',
                                            color: T.textMuted
                                        },
                                        children: [
                                            "3辺合計: ",
                                            productInfo.lengthCm + productInfo.widthCm + productInfo.heightCm,
                                            " cm"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                        lineNumber: 219,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "配送業者",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '0.5rem'
                                    },
                                    children: [
                                        'jp_post',
                                        'yamato',
                                        'sagawa'
                                    ].map((carrier)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setSelectedCarrier(carrier);
                                                setSelectedService('');
                                            },
                                            style: {
                                                padding: '0.75rem',
                                                borderRadius: '6px',
                                                border: "2px solid ".concat(selectedCarrier === carrier ? T.blue : T.panelBorder),
                                                background: selectedCarrier === carrier ? "".concat(T.blue, "10") : 'white',
                                                cursor: 'pointer',
                                                textAlign: 'center'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: selectedCarrier === carrier ? T.blue : T.text
                                                },
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARRIER_DISPLAY_NAMES"][carrier]
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                lineNumber: 244,
                                                columnNumber: 19
                                            }, this)
                                        }, carrier, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                            lineNumber: 229,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                    lineNumber: 227,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "配送サービス",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem',
                                        maxHeight: '200px',
                                        overflow: 'auto'
                                    },
                                    children: availableServices.map((service)=>{
                                        const rate = service.isFlat && service.flatRate ? service.flatRate : (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getShippingRate"])(selectedCarrier, service.sizeCode, selectedRegion);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedService(service.id),
                                            style: {
                                                padding: '0.5rem',
                                                borderRadius: '4px',
                                                border: "1px solid ".concat(selectedService === service.id ? T.blue : T.panelBorder),
                                                background: selectedService === service.id ? "".concat(T.blue, "10") : 'white',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '11px',
                                                                fontWeight: 600,
                                                                color: T.text
                                                            },
                                                            children: service.nameJa
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                            lineNumber: 277,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '9px',
                                                                color: T.textMuted
                                                            },
                                                            children: service.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                            lineNumber: 278,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                    lineNumber: 276,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        color: T.accent
                                                    },
                                                    children: [
                                                        "¥",
                                                        rate.toLocaleString()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, service.id, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                            lineNumber: 261,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                lineNumber: 253,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "発送設定",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0.75rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                            label: "発送元地域",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: selectedRegion,
                                                onChange: (e)=>setSelectedRegion(e.target.value),
                                                style: inputStyle,
                                                children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REGION_DISPLAY_NAMES"]).map((param)=>{
                                                    let [key, name] = param;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: key,
                                                        children: name
                                                    }, key, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                        lineNumber: 299,
                                                        columnNumber: 21
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                lineNumber: 293,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                            lineNumber: 292,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                            label: "送料負担",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    height: '32px',
                                                    cursor: 'pointer'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: isFreeShipping,
                                                        onChange: (e)=>setIsFreeShipping(e.target.checked)
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                        lineNumber: 305,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '11px'
                                                        },
                                                        children: "送料無料（セラー負担）"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                        lineNumber: 310,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                lineNumber: 304,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                            lineNumber: 303,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                lineNumber: 290,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                        lineNumber: 181,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "選択中の配送方法",
                                children: currentService ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: 'center',
                                        padding: '1rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '12px',
                                                color: T.textMuted,
                                                marginBottom: '0.5rem'
                                            },
                                            children: [
                                                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CARRIER_DISPLAY_NAMES"][selectedCarrier],
                                                " / ",
                                                currentService.nameJa
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                            lineNumber: 323,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '32px',
                                                fontWeight: 700,
                                                color: T.accent
                                            },
                                            children: [
                                                "¥",
                                                shippingCost.toLocaleString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                            lineNumber: 326,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '10px',
                                                color: T.textMuted,
                                                marginTop: '0.5rem'
                                            },
                                            children: [
                                                currentService.tracking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        marginRight: '0.5rem'
                                                    },
                                                    children: "✓ 追跡可"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                    lineNumber: 330,
                                                    columnNumber: 47
                                                }, this),
                                                currentService.compensation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "✓ 補償あり"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                    lineNumber: 331,
                                                    columnNumber: 51
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                            lineNumber: 329,
                                            columnNumber: 17
                                        }, this),
                                        isFreeShipping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: '0.5rem',
                                                padding: '0.25rem 0.5rem',
                                                background: "".concat(T.accent, "15"),
                                                color: T.accent,
                                                borderRadius: '4px',
                                                fontSize: '10px',
                                                fontWeight: 600,
                                                display: 'inline-block'
                                            },
                                            children: "送料無料（この料金はセラー負担）"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                            lineNumber: 334,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                    lineNumber: 322,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: 'center',
                                        color: T.textMuted,
                                        padding: '2rem'
                                    },
                                    children: "配送サービスを選択してください"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                    lineNumber: 349,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                lineNumber: 320,
                                columnNumber: 11
                            }, this),
                            currentService && !currentService.isFlat && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "地域別送料",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        maxHeight: '200px',
                                        overflow: 'auto'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        style: {
                                            width: '100%',
                                            borderCollapse: 'collapse',
                                            fontSize: '10px'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REGION_DISPLAY_NAMES"]).map((param)=>{
                                                let [key, name] = param;
                                                const rate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getShippingRate"])(selectedCarrier, currentService.sizeCode, key);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    style: {
                                                        background: key === selectedRegion ? "".concat(T.blue, "10") : 'transparent'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: '0.375rem',
                                                                borderBottom: "1px solid ".concat(T.panelBorder)
                                                            },
                                                            children: name
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                            lineNumber: 365,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            style: {
                                                                padding: '0.375rem',
                                                                borderBottom: "1px solid ".concat(T.panelBorder),
                                                                textAlign: 'right',
                                                                fontWeight: 600
                                                            },
                                                            children: [
                                                                "¥",
                                                                rate.toLocaleString()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                            lineNumber: 366,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, key, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                                    lineNumber: 364,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                            lineNumber: 360,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                        lineNumber: 359,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                    lineNumber: 358,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                lineNumber: 357,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSave,
                                style: {
                                    padding: '0.75rem',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: T.success,
                                    color: 'white',
                                    cursor: 'pointer',
                                    marginTop: 'auto'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-save"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                        lineNumber: 393,
                                        columnNumber: 13
                                    }, this),
                                    " 配送設定を保存"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                                lineNumber: 379,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                        lineNumber: 318,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
        lineNumber: 145,
        columnNumber: 5
    }, this);
}
_s(TabShippingDomestic, "5aT70aWmHaH3WylBAg0d53J7tiU=");
_c = TabShippingDomestic;
// === ヘルパーコンポーネント ===
function SectionCard(param) {
    let { title, children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: T.panel,
            borderRadius: '6px',
            border: "1px solid ".concat(T.panelBorder),
            padding: '0.75rem'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '10px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: T.textMuted,
                    marginBottom: '0.5rem',
                    paddingBottom: '0.375rem',
                    borderBottom: "1px solid ".concat(T.panelBorder)
                },
                children: title
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                lineNumber: 411,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
        lineNumber: 405,
        columnNumber: 5
    }, this);
}
_c1 = SectionCard;
function FormField(param) {
    let { label, children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                style: {
                    display: 'block',
                    fontSize: '9px',
                    fontWeight: 600,
                    color: T.textMuted,
                    marginBottom: '0.25rem'
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
                lineNumber: 430,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx",
        lineNumber: 429,
        columnNumber: 5
    }, this);
}
_c2 = FormField;
const inputStyle = {
    width: '100%',
    padding: '0.375rem 0.5rem',
    fontSize: '11px',
    borderRadius: '4px',
    border: "1px solid ".concat(T.panelBorder),
    background: T.panel,
    color: T.text
};
const __TURBOPACK__default__export__ = TabShippingDomestic;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "TabShippingDomestic");
__turbopack_context__.k.register(_c1, "SectionCard");
__turbopack_context__.k.register(_c2, "FormField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_6f9d5e71._.js.map