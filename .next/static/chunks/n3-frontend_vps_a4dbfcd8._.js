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
"[project]/n3-frontend_vps/lib/qoo10/profit-calculator.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Qoo10 Profit Calculator
 * Calculate profit margins and recommended prices for Qoo10 listings
 */ __turbopack_context__.s([
    "DEFAULT_PACKAGING_COST",
    ()=>DEFAULT_PACKAGING_COST,
    "DEFAULT_PAYMENT_FEE_RATE",
    ()=>DEFAULT_PAYMENT_FEE_RATE,
    "DEFAULT_QOO10_FEE_RATE",
    ()=>DEFAULT_QOO10_FEE_RATE,
    "PROFIT_DANGER_THRESHOLD",
    ()=>PROFIT_DANGER_THRESHOLD,
    "PROFIT_WARNING_THRESHOLD",
    ()=>PROFIT_WARNING_THRESHOLD,
    "QOO10_CATEGORY_FEE_RATES",
    ()=>QOO10_CATEGORY_FEE_RATES,
    "RECOMMENDED_TARGET_MARGIN",
    ()=>RECOMMENDED_TARGET_MARGIN,
    "calculateBreakEvenPrice",
    ()=>calculateBreakEvenPrice,
    "calculatePricePoints",
    ()=>calculatePricePoints,
    "calculateQoo10Profit",
    ()=>calculateQoo10Profit,
    "calculateRecommendedPrice",
    ()=>calculateRecommendedPrice,
    "formatJPY",
    ()=>formatJPY,
    "formatPercent",
    ()=>formatPercent,
    "getQoo10FeeRate",
    ()=>getQoo10FeeRate,
    "validateQoo10Listing",
    ()=>validateQoo10Listing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/qoo10/shipping-rates.ts [app-client] (ecmascript)");
;
const DEFAULT_QOO10_FEE_RATE = 0.10; // 10%
const DEFAULT_PAYMENT_FEE_RATE = 0.035; // 3.5%
const DEFAULT_PACKAGING_COST = 100; // 100 JPY
const QOO10_CATEGORY_FEE_RATES = {
    '001': 0.10,
    '002': 0.10,
    '003': 0.08,
    '004': 0.10,
    '005': 0.10,
    '006': 0.10,
    '007': 0.12,
    '008': 0.10,
    '009': 0.10
};
const PROFIT_WARNING_THRESHOLD = 10; // Warn if margin < 10%
const PROFIT_DANGER_THRESHOLD = 0; // Danger if margin <= 0%
const RECOMMENDED_TARGET_MARGIN = 20; // Target 20% margin
function calculateQoo10Profit(params) {
    const { selling_price, cost_price, shipping_carrier, shipping_size, shipping_region = 'kanto', qoo10_fee_rate = DEFAULT_QOO10_FEE_RATE, payment_fee_rate = DEFAULT_PAYMENT_FEE_RATE, packaging_cost = DEFAULT_PACKAGING_COST, is_free_shipping = false, target_margin = RECOMMENDED_TARGET_MARGIN / 100 } = params;
    const warnings = [];
    // Calculate fees
    const qoo10_fee = Math.floor(selling_price * qoo10_fee_rate);
    const payment_fee = Math.floor(selling_price * payment_fee_rate);
    // Get shipping fee
    const shipping_fee = is_free_shipping ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getShippingRate"])(shipping_carrier, shipping_size, shipping_region) : 0; // If buyer pays, seller doesn't deduct from profit
    // Calculate totals
    const total_deductions = cost_price + qoo10_fee + payment_fee + shipping_fee + packaging_cost;
    const net_profit = selling_price - total_deductions;
    const profit_margin_percent = selling_price > 0 ? net_profit / selling_price * 100 : 0;
    // Check profitability and add warnings
    const is_profitable = net_profit > 0;
    if (profit_margin_percent <= PROFIT_DANGER_THRESHOLD) {
        warnings.push('赤字です！販売価格を見直してください。');
    } else if (profit_margin_percent < PROFIT_WARNING_THRESHOLD) {
        warnings.push('利益率が低すぎます。販売価格の再検討を推奨します。');
    }
    if (selling_price < cost_price) {
        warnings.push('販売価格が仕入原価を下回っています。');
    }
    // Calculate recommended price for target margin
    const recommended_price_for_target_margin = calculateRecommendedPrice(cost_price, shipping_carrier, shipping_size, shipping_region, qoo10_fee_rate, payment_fee_rate, packaging_cost, is_free_shipping, target_margin);
    return {
        selling_price,
        cost_price,
        qoo10_fee,
        payment_fee,
        shipping_fee,
        packaging_cost,
        total_deductions,
        net_profit,
        profit_margin_percent: Math.round(profit_margin_percent * 10) / 10,
        recommended_price_for_target_margin,
        is_profitable,
        warnings
    };
}
function calculateRecommendedPrice(cost_price, shipping_carrier, shipping_size) {
    let shipping_region = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 'kanto', qoo10_fee_rate = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : DEFAULT_QOO10_FEE_RATE, payment_fee_rate = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : DEFAULT_PAYMENT_FEE_RATE, packaging_cost = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : DEFAULT_PACKAGING_COST, is_free_shipping = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : false, target_margin = arguments.length > 8 && arguments[8] !== void 0 ? arguments[8] : RECOMMENDED_TARGET_MARGIN / 100;
    // Get shipping cost if seller pays
    const shipping_fee = is_free_shipping ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getShippingRate"])(shipping_carrier, shipping_size, shipping_region) : 0;
    // Fixed costs that don't depend on price
    const fixed_costs = cost_price + shipping_fee + packaging_cost;
    // Price formula: price = fixed_costs / (1 - qoo10_rate - payment_rate - target_margin)
    const rate_multiplier = 1 - qoo10_fee_rate - payment_fee_rate - target_margin;
    if (rate_multiplier <= 0) {
        // Invalid configuration - rates too high
        return Math.ceil(fixed_costs * 2); // Return at least 2x costs
    }
    const recommended_price = Math.ceil(fixed_costs / rate_multiplier);
    // Round up to nearest 10 yen for nicer pricing
    return Math.ceil(recommended_price / 10) * 10;
}
function getQoo10FeeRate(category_code) {
    // Extract main category (first 3 digits)
    const main_category = category_code.substring(0, 3);
    return QOO10_CATEGORY_FEE_RATES[main_category] || DEFAULT_QOO10_FEE_RATE;
}
function calculateBreakEvenPrice(cost_price, shipping_carrier, shipping_size) {
    let shipping_region = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 'kanto', qoo10_fee_rate = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : DEFAULT_QOO10_FEE_RATE, payment_fee_rate = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : DEFAULT_PAYMENT_FEE_RATE, packaging_cost = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : DEFAULT_PACKAGING_COST, is_free_shipping = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : false;
    return calculateRecommendedPrice(cost_price, shipping_carrier, shipping_size, shipping_region, qoo10_fee_rate, payment_fee_rate, packaging_cost, is_free_shipping, 0 // 0% target margin = break-even
    );
}
function calculatePricePoints(cost_price, shipping_carrier, shipping_size) {
    let shipping_region = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 'kanto', qoo10_fee_rate = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : DEFAULT_QOO10_FEE_RATE, is_free_shipping = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : false;
    const margins = [
        0,
        10,
        15,
        20,
        25,
        30
    ];
    return margins.map((margin)=>{
        const price = calculateRecommendedPrice(cost_price, shipping_carrier, shipping_size, shipping_region, qoo10_fee_rate, DEFAULT_PAYMENT_FEE_RATE, DEFAULT_PACKAGING_COST, is_free_shipping, margin / 100);
        const calculation = calculateQoo10Profit({
            selling_price: price,
            cost_price,
            shipping_carrier,
            shipping_size,
            shipping_region,
            qoo10_fee_rate,
            is_free_shipping
        });
        return {
            margin,
            price,
            profit: calculation.net_profit
        };
    });
}
function formatJPY(amount) {
    return "¥".concat(amount.toLocaleString('ja-JP'));
}
function formatPercent(value) {
    return "".concat(value.toFixed(1), "%");
}
function validateQoo10Listing(data) {
    const errors = [];
    // Title validation (max 100 chars)
    if (!data.title_ja) {
        errors.push('商品タイトルは必須です。');
    } else if (data.title_ja.length > 100) {
        errors.push('商品タイトルは100文字以内にしてください。');
    }
    // Price validation
    if (!data.selling_price || data.selling_price < 100) {
        errors.push('販売価格は100円以上を設定してください。');
    }
    // Stock validation
    if (!data.stock_quantity || data.stock_quantity < 1) {
        errors.push('在庫数は1以上を設定してください。');
    }
    // Category validation
    if (!data.qoo10_category_code) {
        errors.push('カテゴリを選択してください。');
    }
    // Shipping validation
    if (!data.shipping_carrier) {
        errors.push('配送業者を選択してください。');
    }
    if (!data.shipping_size) {
        errors.push('梱包サイズを選択してください。');
    }
    return {
        valid: errors.length === 0,
        errors
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabPricingDomestic",
    ()=>TabPricingDomestic,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * TabPricingDomestic - 国内販路用価格計算タブ
 * 
 * Qoo10, Amazon JP, ヤフオク, メルカリ等の国内販売価格計算
 * lib/qoo10/profit-calculator.ts を使用
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/qoo10/profit-calculator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/qoo10/shipping-rates.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
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
// 国内モール手数料率
const DOMESTIC_FEE_RATES = {
    'qoo10-jp': {
        platform: 10,
        payment: 3.5,
        name: 'Qoo10'
    },
    'amazon-jp': {
        platform: 15,
        payment: 0,
        name: 'Amazon JP'
    },
    'yahoo-auction': {
        platform: 8.8,
        payment: 0,
        name: 'ヤフオク'
    },
    'mercari': {
        platform: 10,
        payment: 0,
        name: 'メルカリ'
    }
};
function TabPricingDomestic(param) {
    let { product, marketplace = 'qoo10-jp', onSave } = param;
    _s();
    // === フォームデータ ===
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        costPrice: 0,
        sellingPrice: 0,
        stockQuantity: 1,
        // 配送設定
        shippingCarrier: 'jp_post',
        shippingSize: '60',
        shippingRegion: 'kanto',
        isFreeShipping: true,
        // 梱包費
        packagingCost: 100
    });
    // === 計算結果 ===
    const [profitResult, setProfitResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // === 価格ポイント ===
    const [pricePoints, setPricePoints] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // === UI状態 ===
    const [calculating, setCalculating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // モール情報
    const feeInfo = DOMESTIC_FEE_RATES[marketplace] || DOMESTIC_FEE_RATES['qoo10-jp'];
    // === 商品データからフォーム初期化 ===
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabPricingDomestic.useEffect": ()=>{
            if (product) {
                setFormData({
                    "TabPricingDomestic.useEffect": (prev)=>{
                        var _this, _this1, _this2, _this3, _product_stock;
                        return {
                            ...prev,
                            costPrice: ((_this = product) === null || _this === void 0 ? void 0 : _this.purchase_price_jpy) || ((_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.price_jpy) || 0,
                            sellingPrice: ((_this2 = product) === null || _this2 === void 0 ? void 0 : _this2.domestic_price_jpy) || ((_this3 = product) === null || _this3 === void 0 ? void 0 : _this3.price_jpy) || 0,
                            stockQuantity: (product === null || product === void 0 ? void 0 : (_product_stock = product.stock) === null || _product_stock === void 0 ? void 0 : _product_stock.available) || 1
                        };
                    }
                }["TabPricingDomestic.useEffect"]);
            }
        }
    }["TabPricingDomestic.useEffect"], [
        product
    ]);
    // === 利益計算 ===
    const handleCalculate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabPricingDomestic.useCallback[handleCalculate]": ()=>{
            if (formData.costPrice <= 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('仕入れ価格を入力してください');
                return;
            }
            setCalculating(true);
            try {
                const platformFeeRate = feeInfo.platform / 100;
                const paymentFeeRate = feeInfo.payment / 100;
                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateQoo10Profit"])({
                    selling_price: formData.sellingPrice,
                    cost_price: formData.costPrice,
                    shipping_carrier: formData.shippingCarrier,
                    shipping_size: formData.shippingSize,
                    shipping_region: formData.shippingRegion,
                    qoo10_fee_rate: platformFeeRate,
                    payment_fee_rate: paymentFeeRate,
                    packaging_cost: formData.packagingCost,
                    is_free_shipping: formData.isFreeShipping,
                    target_margin: 0.20
                });
                setProfitResult({
                    netProfit: result.net_profit,
                    profitMargin: result.profit_margin_percent,
                    platformFee: result.qoo10_fee,
                    paymentFee: result.payment_fee,
                    shippingFee: result.shipping_fee,
                    totalDeductions: result.total_deductions,
                    isProfitable: result.is_profitable,
                    warnings: result.warnings
                });
                // 価格ポイント計算
                const points = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculatePricePoints"])(formData.costPrice, formData.shippingCarrier, formData.shippingSize, formData.shippingRegion, platformFeeRate, formData.isFreeShipping);
                setPricePoints(points);
                if (result.is_profitable) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("利益計算完了: ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(result.net_profit), " (").concat(result.profit_margin_percent.toFixed(1), "%)"));
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning('⚠️ 赤字です！価格を見直してください');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("計算エラー: ".concat(error.message));
            } finally{
                setCalculating(false);
            }
        }
    }["TabPricingDomestic.useCallback[handleCalculate]"], [
        formData,
        feeInfo
    ]);
    // === 推奨価格を適用 ===
    const applyRecommendedPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabPricingDomestic.useCallback[applyRecommendedPrice]": (targetMargin)=>{
            const platformFeeRate = feeInfo.platform / 100;
            const paymentFeeRate = feeInfo.payment / 100;
            const recommendedPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateRecommendedPrice"])(formData.costPrice, formData.shippingCarrier, formData.shippingSize, formData.shippingRegion, platformFeeRate, paymentFeeRate, formData.packagingCost, formData.isFreeShipping, targetMargin / 100);
            setFormData({
                "TabPricingDomestic.useCallback[applyRecommendedPrice]": (prev)=>({
                        ...prev,
                        sellingPrice: recommendedPrice
                    })
            }["TabPricingDomestic.useCallback[applyRecommendedPrice]"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("".concat(targetMargin, "%利益で ").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(recommendedPrice), " を設定しました"));
        }
    }["TabPricingDomestic.useCallback[applyRecommendedPrice]"], [
        formData,
        feeInfo
    ]);
    // === 最安送料を自動選択 ===
    const autoSelectShipping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabPricingDomestic.useCallback[autoSelectShipping]": ()=>{
            var _this, _this1, _this2, _this3;
            const weightG = ((_this = product) === null || _this === void 0 ? void 0 : _this.weight_g) || 500;
            const lengthCm = (_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.length_cm;
            const widthCm = (_this2 = product) === null || _this2 === void 0 ? void 0 : _this2.width_cm;
            const heightCm = (_this3 = product) === null || _this3 === void 0 ? void 0 : _this3.height_cm;
            const cheapest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findCheapestShipping"])(weightG, lengthCm, widthCm, heightCm, formData.shippingRegion);
            if (cheapest) {
                setFormData({
                    "TabPricingDomestic.useCallback[autoSelectShipping]": (prev)=>({
                            ...prev,
                            shippingCarrier: cheapest.service.carrier,
                            shippingSize: cheapest.service.sizeCode
                        })
                }["TabPricingDomestic.useCallback[autoSelectShipping]"]);
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("最安送料: ".concat(cheapest.service.nameJa, " (").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(cheapest.rate), ") を選択しました"));
            }
        }
    }["TabPricingDomestic.useCallback[autoSelectShipping]"], [
        product,
        formData.shippingRegion
    ]);
    // === 保存 ===
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabPricingDomestic.useCallback[handleSave]": ()=>{
            onSave === null || onSave === void 0 ? void 0 : onSave({
                domestic_pricing: {
                    marketplace,
                    cost_price: formData.costPrice,
                    selling_price: formData.sellingPrice,
                    shipping_carrier: formData.shippingCarrier,
                    shipping_size: formData.shippingSize,
                    shipping_region: formData.shippingRegion,
                    is_free_shipping: formData.isFreeShipping,
                    profit_result: profitResult,
                    calculated_at: new Date().toISOString()
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('価格設定を保存しました');
        }
    }["TabPricingDomestic.useCallback[handleSave]"], [
        formData,
        profitResult,
        marketplace,
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
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
            lineNumber: 232,
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
                    background: "linear-gradient(135deg, ".concat(T.accent, ", #ff6699)"),
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
                                className: "fas fa-yen-sign",
                                style: {
                                    color: 'white'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '14px'
                                },
                                children: [
                                    feeInfo.name,
                                    " 価格計算"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '4px',
                            color: 'white',
                            fontSize: '10px'
                        },
                        children: [
                            "手数料: ",
                            feeInfo.platform,
                            "% + ",
                            feeInfo.payment,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                lineNumber: 241,
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
                                title: "価格設定",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '0.75rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "仕入れ価格 *",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PriceInput, {
                                                    value: formData.costPrice,
                                                    onChange: (v)=>setFormData((prev)=>({
                                                                ...prev,
                                                                costPrice: v
                                                            }))
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                lineNumber: 273,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "販売価格 *",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PriceInput, {
                                                    value: formData.sellingPrice,
                                                    onChange: (v)=>setFormData((prev)=>({
                                                                ...prev,
                                                                sellingPrice: v
                                                            }))
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                lineNumber: 279,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                        lineNumber: 272,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: '0.5rem',
                                            marginTop: '0.5rem',
                                            flexWrap: 'wrap'
                                        },
                                        children: [
                                            10,
                                            15,
                                            20,
                                            25,
                                            30
                                        ].map((margin)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>applyRecommendedPrice(margin),
                                                style: {
                                                    padding: '0.25rem 0.5rem',
                                                    fontSize: '10px',
                                                    borderRadius: '4px',
                                                    border: "1px solid ".concat(T.blue),
                                                    background: "".concat(T.blue, "10"),
                                                    color: T.blue,
                                                    cursor: 'pointer'
                                                },
                                                children: [
                                                    margin,
                                                    "%利益"
                                                ]
                                            }, margin, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                lineNumber: 290,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                        lineNumber: 288,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "配送設定",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '0.75rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "配送業者",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: formData.shippingCarrier,
                                                    onChange: (e)=>setFormData((prev)=>({
                                                                ...prev,
                                                                shippingCarrier: e.target.value
                                                            })),
                                                    style: inputStyle,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "jp_post",
                                                            children: "日本郵便"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                            lineNumber: 318,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "yamato",
                                                            children: "ヤマト運輸"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                            lineNumber: 319,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "sagawa",
                                                            children: "佐川急便"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                            lineNumber: 320,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 313,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                lineNumber: 312,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "サイズ",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: formData.shippingSize,
                                                    onChange: (e)=>setFormData((prev)=>({
                                                                ...prev,
                                                                shippingSize: e.target.value
                                                            })),
                                                    style: inputStyle,
                                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIPPING_SERVICES"].filter((s)=>s.carrier === formData.shippingCarrier).map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: s.sizeCode,
                                                            children: s.nameJa
                                                        }, s.id, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                            lineNumber: 330,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 324,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                lineNumber: 323,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                        lineNumber: 311,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '0.75rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "発送元",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: formData.shippingRegion,
                                                    onChange: (e)=>setFormData((prev)=>({
                                                                ...prev,
                                                                shippingRegion: e.target.value
                                                            })),
                                                    style: inputStyle,
                                                    children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REGION_DISPLAY_NAMES"]).map((param)=>{
                                                        let [key, name] = param;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: key,
                                                            children: name
                                                        }, key, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                            lineNumber: 346,
                                                            columnNumber: 21
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 340,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                lineNumber: 339,
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
                                                            checked: formData.isFreeShipping,
                                                            onChange: (e)=>setFormData((prev)=>({
                                                                        ...prev,
                                                                        isFreeShipping: e.target.checked
                                                                    }))
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                            lineNumber: 352,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '11px'
                                                            },
                                                            children: "送料無料（セラー負担）"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                            lineNumber: 357,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 351,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                lineNumber: 350,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                        lineNumber: 338,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: autoSelectShipping,
                                        style: {
                                            padding: '0.375rem 0.75rem',
                                            fontSize: '10px',
                                            borderRadius: '4px',
                                            border: "1px solid ".concat(T.success),
                                            background: "".concat(T.success, "10"),
                                            color: T.success,
                                            cursor: 'pointer',
                                            marginTop: '0.25rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fas fa-magic"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                lineNumber: 375,
                                                columnNumber: 15
                                            }, this),
                                            " 最安送料を自動選択"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                        lineNumber: 362,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                lineNumber: 310,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '0.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCalculate,
                                        disabled: calculating,
                                        style: {
                                            flex: 1,
                                            padding: '0.75rem',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: T.blue,
                                            color: 'white',
                                            cursor: 'pointer'
                                        },
                                        children: calculating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fas fa-spinner fa-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 396,
                                                    columnNumber: 32
                                                }, this),
                                                " 計算中..."
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fas fa-calculator"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 396,
                                                    columnNumber: 89
                                                }, this),
                                                " 利益計算"
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                        lineNumber: 381,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleSave,
                                        disabled: !profitResult,
                                        style: {
                                            padding: '0.75rem 1.5rem',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: profitResult ? T.success : T.textSubtle,
                                            color: 'white',
                                            cursor: profitResult ? 'pointer' : 'not-allowed'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fas fa-save"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                lineNumber: 412,
                                                columnNumber: 15
                                            }, this),
                                            " 保存"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                        lineNumber: 398,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                lineNumber: 380,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        },
                        children: profitResult ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                    title: "計算結果",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1fr',
                                                gap: '0.5rem'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBox, {
                                                    label: "純利益",
                                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.netProfit),
                                                    color: profitResult.isProfitable ? T.success : T.error,
                                                    large: true
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 428,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBox, {
                                                    label: "利益率",
                                                    value: "".concat(profitResult.profitMargin.toFixed(1), "%"),
                                                    color: profitResult.isProfitable ? T.success : T.error,
                                                    large: true
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 429,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                            lineNumber: 423,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: '0.5rem',
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(4, 1fr)',
                                                gap: '0.5rem'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBox, {
                                                    label: "モール手数料",
                                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.platformFee)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBox, {
                                                    label: "決済手数料",
                                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.paymentFee)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 434,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBox, {
                                                    label: "送料",
                                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.shippingFee)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 435,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBox, {
                                                    label: "総コスト",
                                                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.totalDeductions)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 436,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                            lineNumber: 432,
                                            columnNumber: 17
                                        }, this),
                                        profitResult.warnings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: '0.5rem',
                                                padding: '0.5rem',
                                                background: "".concat(T.warning, "15"),
                                                borderRadius: '4px'
                                            },
                                            children: profitResult.warnings.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '10px',
                                                        color: T.warning
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-exclamation-triangle"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                            lineNumber: 443,
                                                            columnNumber: 25
                                                        }, this),
                                                        " ",
                                                        w
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 442,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                            lineNumber: 440,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                    lineNumber: 422,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                    title: "利益率別 推奨価格",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            overflowX: 'auto'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            style: {
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                fontSize: '11px'
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
                                                                children: "利益率"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                                lineNumber: 456,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: thStyle,
                                                                children: "販売価格"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                                lineNumber: 457,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: thStyle,
                                                                children: "利益"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                                lineNumber: 458,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: thStyle
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                                lineNumber: 459,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                        lineNumber: 455,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 454,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    children: pricePoints.map((point, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            style: {
                                                                background: point.margin === 20 ? "".concat(T.blue, "10") : 'transparent'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: tdStyle,
                                                                    children: [
                                                                        point.margin,
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                                    lineNumber: 465,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: tdStyle,
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(point.price)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                                    lineNumber: 466,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: {
                                                                        ...tdStyle,
                                                                        color: point.profit >= 0 ? T.success : T.error
                                                                    },
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(point.profit)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                                    lineNumber: 467,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                    style: tdStyle,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>{
                                                                            setFormData((prev)=>({
                                                                                    ...prev,
                                                                                    sellingPrice: point.price
                                                                                }));
                                                                            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("".concat(point.margin, "%利益の価格を適用しました"));
                                                                        },
                                                                        style: {
                                                                            padding: '0.125rem 0.375rem',
                                                                            fontSize: '9px',
                                                                            borderRadius: '3px',
                                                                            border: 'none',
                                                                            background: T.blue,
                                                                            color: 'white',
                                                                            cursor: 'pointer'
                                                                        },
                                                                        children: "適用"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                                        lineNumber: 471,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                                    lineNumber: 470,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, i, true, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                            lineNumber: 464,
                                                            columnNumber: 25
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                                    lineNumber: 462,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                            lineNumber: 453,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                        lineNumber: 452,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                    lineNumber: 451,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: T.panel,
                                borderRadius: '6px',
                                border: "1px solid ".concat(T.panelBorder)
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    color: T.textMuted
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-calculator",
                                        style: {
                                            fontSize: '32px',
                                            marginBottom: '0.5rem'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                        lineNumber: 507,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '12px'
                                        },
                                        children: "価格を入力して「利益計算」を押してください"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                        lineNumber: 508,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                                lineNumber: 506,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                            lineNumber: 497,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                        lineNumber: 418,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
        lineNumber: 239,
        columnNumber: 5
    }, this);
}
_s(TabPricingDomestic, "0D7QjeFDjTMRpL3kk4HQ30KDQKs=");
_c = TabPricingDomestic;
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
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                lineNumber: 528,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
        lineNumber: 522,
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
                    fontSize: '10px',
                    fontWeight: 600,
                    color: T.textMuted,
                    marginBottom: '0.25rem'
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                lineNumber: 547,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
        lineNumber: 546,
        columnNumber: 5
    }, this);
}
_c2 = FormField;
function PriceInput(param) {
    let { value, onChange } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'relative'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: T.textMuted,
                    fontSize: '11px'
                },
                children: "¥"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                lineNumber: 558,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "number",
                value: value,
                onChange: (e)=>onChange(Number(e.target.value)),
                style: {
                    ...inputStyle,
                    paddingLeft: '20px'
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                lineNumber: 559,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
        lineNumber: 557,
        columnNumber: 5
    }, this);
}
_c3 = PriceInput;
function ResultBox(param) {
    let { label, value, color, large } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '0.5rem',
            background: T.highlight,
            borderRadius: '4px',
            textAlign: 'center'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '8px',
                    color: T.textMuted
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                lineNumber: 572,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: large ? '16px' : '12px',
                    fontWeight: 700,
                    color: color || T.text
                },
                children: value
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
                lineNumber: 573,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx",
        lineNumber: 571,
        columnNumber: 5
    }, this);
}
_c4 = ResultBox;
const inputStyle = {
    width: '100%',
    padding: '0.375rem 0.5rem',
    fontSize: '11px',
    borderRadius: '4px',
    border: "1px solid ".concat(T.panelBorder),
    background: T.panel,
    color: T.text
};
const thStyle = {
    padding: '0.5rem',
    textAlign: 'left',
    fontWeight: 600,
    borderBottom: "1px solid ".concat(T.panelBorder)
};
const tdStyle = {
    padding: '0.5rem',
    borderBottom: "1px solid ".concat(T.panelBorder)
};
const __TURBOPACK__default__export__ = TabPricingDomestic;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "TabPricingDomestic");
__turbopack_context__.k.register(_c1, "SectionCard");
__turbopack_context__.k.register(_c2, "FormField");
__turbopack_context__.k.register(_c3, "PriceInput");
__turbopack_context__.k.register(_c4, "ResultBox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_a4dbfcd8._.js.map