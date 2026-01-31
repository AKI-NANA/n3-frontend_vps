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
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabQoo10",
    ()=>TabQoo10,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * TabQoo10 - V9.0 完全版
 * 
 * 機能:
 * 1. 仕入れ先データ取得（Amazon JP等からのインポート）
 * 2. 利益計算（国内送料 + Qoo10手数料）
 * 3. HTML説明文生成
 * 4. 画像設定（ストック画像対応）
 * 5. 必須項目管理
 * 6. Excel出力
 * 7. 在庫0での下書き出品
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
// 利益計算インポート
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/qoo10/profit-calculator.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/qoo10/shipping-rates.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// スタイル定数
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
// Qoo10カテゴリ
const QOO10_CATEGORIES = [
    {
        code: '001',
        name: 'ファッション',
        fee: 10
    },
    {
        code: '002',
        name: 'ビューティー・コスメ',
        fee: 10
    },
    {
        code: '003',
        name: 'デジタル・家電',
        fee: 8
    },
    {
        code: '004',
        name: 'スポーツ・アウトドア',
        fee: 10
    },
    {
        code: '005',
        name: '生活雑貨・日用品',
        fee: 10
    },
    {
        code: '006',
        name: 'ベビー・キッズ',
        fee: 10
    },
    {
        code: '007',
        name: '食品・飲料',
        fee: 12
    },
    {
        code: '008',
        name: 'ホビー・コレクション',
        fee: 10
    },
    {
        code: '009',
        name: 'インテリア・家具',
        fee: 10
    }
];
function TabQoo10(param) {
    let { product, onSave } = param;
    _s();
    // === フォームデータ ===
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        // 基本情報
        title: '',
        promotionText: '',
        description: '',
        htmlDescription: '',
        // 価格
        costPrice: 0,
        sellingPrice: 0,
        originalPrice: 0,
        // カテゴリ・在庫
        categoryCode: '',
        stockQuantity: 1,
        adultYn: 'N',
        // 配送
        shippingCarrier: 'jp_post',
        shippingSize: '60',
        shippingRegion: 'kanto',
        isFreeShipping: true,
        // その他
        sellerCode: '',
        janCode: '',
        brandName: '',
        contactInfo: '返品・交換はお問い合わせください',
        // 画像
        images: []
    });
    // === 計算結果 ===
    const [profitResult, setProfitResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // === UI状態 ===
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('basic');
    const [calculating, setCalculating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [exporting, setExporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [listing, setListing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // === 商品データからフォーム初期化 ===
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabQoo10.useEffect": ()=>{
            if (product) {
                var _this, _this1;
                const listingData = ((_this = product) === null || _this === void 0 ? void 0 : _this.listing_data) || {};
                const qoo10Data = ((_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.qoo10_data) || {};
                setFormData({
                    "TabQoo10.useEffect": (prev)=>{
                        var _this, _this1, _this2, _this3, _this4, _this5, _product_stock, _this6, _product_images;
                        return {
                            ...prev,
                            // タイトル（日本語優先）
                            title: qoo10Data.title || listingData.title_ja || ((_this = product) === null || _this === void 0 ? void 0 : _this.japanese_title) || (product === null || product === void 0 ? void 0 : product.title) || '',
                            promotionText: qoo10Data.promotionText || '',
                            description: qoo10Data.description || (product === null || product === void 0 ? void 0 : product.description) || '',
                            htmlDescription: qoo10Data.htmlDescription || ((_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.html_description) || '',
                            // 価格
                            costPrice: ((_this2 = product) === null || _this2 === void 0 ? void 0 : _this2.purchase_price_jpy) || ((_this3 = product) === null || _this3 === void 0 ? void 0 : _this3.price_jpy) || 0,
                            sellingPrice: qoo10Data.sellingPrice || ((_this4 = product) === null || _this4 === void 0 ? void 0 : _this4.price_jpy) || 0,
                            originalPrice: qoo10Data.originalPrice || Math.round((((_this5 = product) === null || _this5 === void 0 ? void 0 : _this5.price_jpy) || 0) * 1.3),
                            // 在庫
                            stockQuantity: (product === null || product === void 0 ? void 0 : (_product_stock = product.stock) === null || _product_stock === void 0 ? void 0 : _product_stock.available) || 1,
                            // SKU
                            sellerCode: (product === null || product === void 0 ? void 0 : product.sku) || '',
                            // ブランド
                            brandName: (product === null || product === void 0 ? void 0 : product.brand_name) || ((_this6 = product) === null || _this6 === void 0 ? void 0 : _this6.brand) || '',
                            // 画像
                            images: (product === null || product === void 0 ? void 0 : product.selectedImages) || (product === null || product === void 0 ? void 0 : (_product_images = product.images) === null || _product_images === void 0 ? void 0 : _product_images.map({
                                "TabQoo10.useEffect": (img)=>img.url
                            }["TabQoo10.useEffect"])) || []
                        };
                    }
                }["TabQoo10.useEffect"]);
            }
        }
    }["TabQoo10.useEffect"], [
        product
    ]);
    // === 利益計算 ===
    const handleCalculate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabQoo10.useCallback[handleCalculate]": ()=>{
            if (formData.costPrice <= 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('仕入れ価格を入力してください');
                return;
            }
            setCalculating(true);
            try {
                const feeRate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getQoo10FeeRate"])(formData.categoryCode);
                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateQoo10Profit"])({
                    selling_price: formData.sellingPrice,
                    cost_price: formData.costPrice,
                    shipping_carrier: formData.shippingCarrier,
                    shipping_size: formData.shippingSize,
                    shipping_region: formData.shippingRegion,
                    qoo10_fee_rate: feeRate,
                    payment_fee_rate: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PAYMENT_FEE_RATE"],
                    is_free_shipping: formData.isFreeShipping,
                    target_margin: 0.20
                });
                const recommendedPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateRecommendedPrice"])(formData.costPrice, formData.shippingCarrier, formData.shippingSize, formData.shippingRegion, feeRate, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PAYMENT_FEE_RATE"], 100, formData.isFreeShipping, 0.20);
                const breakEvenPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["calculateRecommendedPrice"])(formData.costPrice, formData.shippingCarrier, formData.shippingSize, formData.shippingRegion, feeRate, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PAYMENT_FEE_RATE"], 100, formData.isFreeShipping, 0);
                setProfitResult({
                    netProfit: result.net_profit,
                    profitMargin: result.profit_margin_percent,
                    qoo10Fee: result.qoo10_fee,
                    paymentFee: result.payment_fee,
                    shippingFee: result.shipping_fee,
                    totalDeductions: result.total_deductions,
                    isProfitable: result.is_profitable,
                    warnings: result.warnings,
                    recommendedPrice,
                    breakEvenPrice
                });
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
    }["TabQoo10.useCallback[handleCalculate]"], [
        formData
    ]);
    // === 推奨価格を適用 ===
    const applyRecommendedPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabQoo10.useCallback[applyRecommendedPrice]": ()=>{
            if (profitResult === null || profitResult === void 0 ? void 0 : profitResult.recommendedPrice) {
                setFormData({
                    "TabQoo10.useCallback[applyRecommendedPrice]": (prev)=>({
                            ...prev,
                            sellingPrice: profitResult.recommendedPrice
                        })
                }["TabQoo10.useCallback[applyRecommendedPrice]"]);
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("推奨価格 ".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.recommendedPrice), " を適用しました"));
            }
        }
    }["TabQoo10.useCallback[applyRecommendedPrice]"], [
        profitResult
    ]);
    // === 最安送料を自動選択 ===
    const autoSelectShipping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabQoo10.useCallback[autoSelectShipping]": ()=>{
            var _this, _this1, _this2, _this3;
            const weightG = ((_this = product) === null || _this === void 0 ? void 0 : _this.weight_g) || 500;
            const lengthCm = (_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.length_cm;
            const widthCm = (_this2 = product) === null || _this2 === void 0 ? void 0 : _this2.width_cm;
            const heightCm = (_this3 = product) === null || _this3 === void 0 ? void 0 : _this3.height_cm;
            const cheapest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$shipping$2d$rates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findCheapestShipping"])(weightG, lengthCm, widthCm, heightCm, formData.shippingRegion);
            if (cheapest) {
                setFormData({
                    "TabQoo10.useCallback[autoSelectShipping]": (prev)=>({
                            ...prev,
                            shippingCarrier: cheapest.service.carrier,
                            shippingSize: cheapest.service.sizeCode
                        })
                }["TabQoo10.useCallback[autoSelectShipping]"]);
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("最安送料: ".concat(cheapest.service.nameJa, " (").concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(cheapest.rate), ") を選択しました"));
            }
        }
    }["TabQoo10.useCallback[autoSelectShipping]"], [
        product,
        formData.shippingRegion
    ]);
    // === HTML説明文生成 ===
    const generateHtml = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabQoo10.useCallback[generateHtml]": ()=>{
            const html = '\n<div style="max-width: 800px; margin: 0 auto; font-family: \'Hiragino Sans\', \'Yu Gothic\', sans-serif;">\n  <!-- ヘッダー -->\n  <div style="background: linear-gradient(135deg, #ff0066, #ff6699); padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">\n    <h1 style="color: white; font-size: 24px; margin: 0;">'.concat(formData.title, "</h1>\n    ").concat(formData.promotionText ? '<p style="color: rgba(255,255,255,0.9); margin-top: 10px;">'.concat(formData.promotionText, "</p>") : '', "\n  </div>\n\n  <!-- 商品画像 -->\n  ").concat(formData.images.length > 0 ? '\n  <div style="text-align: center; margin-bottom: 20px;">\n    <img src="'.concat(formData.images[0], '" alt="').concat(formData.title, '" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">\n  </div>\n  ') : '', '\n\n  <!-- 商品説明 -->\n  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">\n    <h2 style="color: #333; font-size: 18px; border-bottom: 2px solid #ff0066; padding-bottom: 10px; margin-bottom: 15px;">\n      商品説明\n    </h2>\n    <p style="color: #555; line-height: 1.8; white-space: pre-wrap;">').concat(formData.description, '</p>\n  </div>\n\n  <!-- 商品情報 -->\n  <div style="background: white; border: 1px solid #eee; padding: 20px; border-radius: 8px; margin-bottom: 20px;">\n    <h2 style="color: #333; font-size: 18px; border-bottom: 2px solid #ff0066; padding-bottom: 10px; margin-bottom: 15px;">\n      商品情報\n    </h2>\n    <table style="width: 100%; border-collapse: collapse;">\n      ').concat(formData.brandName ? '<tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">ブランド</td><td style="padding: 8px; border-bottom: 1px solid #eee;">'.concat(formData.brandName, "</td></tr>") : '', "\n      ").concat(formData.janCode ? '<tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">JANコード</td><td style="padding: 8px; border-bottom: 1px solid #eee;">'.concat(formData.janCode, "</td></tr>") : '', '\n      <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">状態</td><td style="padding: 8px; border-bottom: 1px solid #eee;">新品</td></tr>\n    </table>\n  </div>\n\n  <!-- 配送について -->\n  <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">\n    <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 14px;">📦 配送について</h3>\n    <p style="color: #856404; margin: 0; font-size: 13px;">\n      ').concat(formData.isFreeShipping ? '送料無料でお届けします！' : '別途送料がかかります。', '\n      ご注文確認後、3〜5営業日以内に発送いたします。\n    </p>\n  </div>\n\n  <!-- 返品について -->\n  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">\n    <h3 style="color: #666; margin: 0 0 10px 0; font-size: 14px;">📞 返品・お問い合わせ</h3>\n    <p style="color: #666; margin: 0; font-size: 13px;">').concat(formData.contactInfo, "</p>\n  </div>\n</div>\n").trim();
            setFormData({
                "TabQoo10.useCallback[generateHtml]": (prev)=>({
                        ...prev,
                        htmlDescription: html
                    })
            }["TabQoo10.useCallback[generateHtml]"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('HTML説明文を生成しました');
        }
    }["TabQoo10.useCallback[generateHtml]"], [
        formData
    ]);
    // === Excel出力 ===
    const handleExportExcel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabQoo10.useCallback[handleExportExcel]": async ()=>{
            if (!profitResult) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('先に利益計算を実行してください');
                return;
            }
            setExporting(true);
            try {
                var _QOO10_CATEGORIES_find;
                // CSVデータ作成
                const csvData = [
                    [
                        '項目',
                        '値'
                    ],
                    [
                        '商品名',
                        formData.title
                    ],
                    [
                        '販売者商品コード',
                        formData.sellerCode
                    ],
                    [
                        'カテゴリ',
                        ((_QOO10_CATEGORIES_find = QOO10_CATEGORIES.find({
                            "TabQoo10.useCallback[handleExportExcel]": (c)=>c.code === formData.categoryCode
                        }["TabQoo10.useCallback[handleExportExcel]"])) === null || _QOO10_CATEGORIES_find === void 0 ? void 0 : _QOO10_CATEGORIES_find.name) || ''
                    ],
                    [
                        '仕入れ価格',
                        formData.costPrice.toString()
                    ],
                    [
                        '販売価格',
                        formData.sellingPrice.toString()
                    ],
                    [
                        '定価',
                        formData.originalPrice.toString()
                    ],
                    [
                        '在庫数',
                        formData.stockQuantity.toString()
                    ],
                    [
                        '送料（セラー負担）',
                        profitResult.shippingFee.toString()
                    ],
                    [
                        'Qoo10手数料',
                        profitResult.qoo10Fee.toString()
                    ],
                    [
                        '決済手数料',
                        profitResult.paymentFee.toString()
                    ],
                    [
                        '利益',
                        profitResult.netProfit.toString()
                    ],
                    [
                        '利益率',
                        "".concat(profitResult.profitMargin.toFixed(1), "%")
                    ],
                    [
                        '推奨価格(20%)',
                        profitResult.recommendedPrice.toString()
                    ],
                    [
                        '損益分岐価格',
                        profitResult.breakEvenPrice.toString()
                    ]
                ];
                const csvContent = csvData.map({
                    "TabQoo10.useCallback[handleExportExcel].csvContent": (row)=>row.join(',')
                }["TabQoo10.useCallback[handleExportExcel].csvContent"]).join('\n');
                const bom = '\uFEFF';
                const blob = new Blob([
                    bom + csvContent
                ], {
                    type: 'text/csv;charset=utf-8;'
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = "qoo10_".concat(formData.sellerCode || 'export', "_").concat(new Date().toISOString().split('T')[0], ".csv");
                link.click();
                URL.revokeObjectURL(url);
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('CSVをダウンロードしました');
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("エクスポートエラー: ".concat(error.message));
            } finally{
                setExporting(false);
            }
        }
    }["TabQoo10.useCallback[handleExportExcel]"], [
        formData,
        profitResult
    ]);
    // === 出品（下書き/即時） ===
    const handleListing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabQoo10.useCallback[handleListing]": async (asDraft)=>{
            // バリデーション
            const errors = [];
            if (!formData.title) errors.push('商品名');
            if (!formData.categoryCode) errors.push('カテゴリ');
            if (formData.sellingPrice <= 0) errors.push('販売価格');
            if (!formData.htmlDescription) errors.push('HTML説明文');
            if (formData.images.length === 0) errors.push('画像');
            if (errors.length > 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("必須項目が未入力: ".concat(errors.join(', ')));
                return;
            }
            setListing(true);
            try {
                // Qoo10出品データ
                const qoo10ListingData = {
                    SecondSubCat: formData.categoryCode,
                    ItemTitle: formData.title.substring(0, 50),
                    PromotionName: formData.promotionText,
                    SellerCode: formData.sellerCode,
                    SellingPrice: formData.sellingPrice,
                    RetailPrice: formData.originalPrice,
                    ItemQty: asDraft ? 0 : formData.stockQuantity,
                    ShippingNo: '0',
                    AdultYN: formData.adultYn,
                    ItemDetail: formData.htmlDescription,
                    ContactInfo: formData.contactInfo,
                    IndustrialCodeType: formData.janCode ? 'J' : '',
                    IndustrialCode: formData.janCode,
                    ImageUrl: formData.images[0],
                    ImageUrl2: formData.images[1],
                    ImageUrl3: formData.images[2],
                    ImageUrl4: formData.images[3],
                    ImageUrl5: formData.images[4]
                };
                // N3 DBに保存
                onSave === null || onSave === void 0 ? void 0 : onSave({
                    qoo10_data: {
                        ...formData,
                        listingData: qoo10ListingData,
                        listingStatus: asDraft ? 'draft' : 'pending',
                        calculatedAt: new Date().toISOString(),
                        profitResult
                    }
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(asDraft ? '✓ 下書き保存しました（在庫0）' : '✓ 出品キューに追加しました');
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("エラー: ".concat(error.message));
            } finally{
                setListing(false);
            }
        }
    }["TabQoo10.useCallback[handleListing]"], [
        formData,
        profitResult,
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
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
            lineNumber: 436,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            height: '100%',
            background: T.bg
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '240px',
                    borderRight: "1px solid ".concat(T.panelBorder),
                    padding: '0.75rem',
                    overflow: 'auto'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '0.75rem',
                            background: "linear-gradient(135deg, ".concat(T.accent, ", #ff6699)"),
                            borderRadius: '6px',
                            marginBottom: '0.75rem',
                            textAlign: 'center'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '14px'
                            },
                            children: "Qoo10 出品"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                            lineNumber: 454,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                        lineNumber: 447,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            marginBottom: '1rem'
                        },
                        children: [
                            {
                                id: 'basic',
                                label: '基本情報',
                                icon: 'fa-info-circle'
                            },
                            {
                                id: 'pricing',
                                label: '価格・送料',
                                icon: 'fa-calculator'
                            },
                            {
                                id: 'html',
                                label: 'HTML説明文',
                                icon: 'fa-code'
                            },
                            {
                                id: 'images',
                                label: '画像設定',
                                icon: 'fa-images'
                            }
                        ].map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveSection(section.id),
                                style: {
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: activeSection === section.id ? T.accent : 'transparent',
                                    color: activeSection === section.id ? 'white' : T.text,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '11px',
                                    fontWeight: activeSection === section.id ? 600 : 400,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas ".concat(section.icon)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 483,
                                        columnNumber: 15
                                    }, this),
                                    section.label
                                ]
                            }, section.id, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 465,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                        lineNumber: 458,
                        columnNumber: 9
                    }, this),
                    profitResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '0.75rem',
                            background: profitResult.isProfitable ? "".concat(T.success, "15") : "".concat(T.error, "15"),
                            borderRadius: '6px',
                            border: "1px solid ".concat(profitResult.isProfitable ? T.success : T.error)
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '9px',
                                    fontWeight: 600,
                                    color: T.textMuted,
                                    marginBottom: '0.5rem'
                                },
                                children: "利益計算結果"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 497,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gap: '0.25rem',
                                    fontSize: '10px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: T.textMuted
                                                },
                                                children: "利益"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 502,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontWeight: 700,
                                                    color: profitResult.isProfitable ? T.success : T.error
                                                },
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.netProfit)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 503,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 501,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: T.textMuted
                                                },
                                                children: "利益率"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 508,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontWeight: 700,
                                                    color: profitResult.isProfitable ? T.success : T.error
                                                },
                                                children: [
                                                    profitResult.profitMargin.toFixed(1),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 509,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 507,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: T.textMuted
                                                },
                                                children: "推奨価格"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 514,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontWeight: 600,
                                                    color: T.blue
                                                },
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.recommendedPrice)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 515,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 513,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 500,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                        lineNumber: 491,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleCalculate,
                                disabled: calculating,
                                style: {
                                    padding: '0.5rem',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
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
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                            lineNumber: 539,
                                            columnNumber: 30
                                        }, this),
                                        " 計算中..."
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-calculator"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                            lineNumber: 539,
                                            columnNumber: 87
                                        }, this),
                                        " 利益計算"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 525,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleExportExcel,
                                disabled: !profitResult || exporting,
                                style: {
                                    padding: '0.5rem',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: "1px solid ".concat(T.success),
                                    background: 'transparent',
                                    color: T.success,
                                    cursor: profitResult ? 'pointer' : 'not-allowed',
                                    opacity: profitResult ? 1 : 0.5
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-file-excel"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 557,
                                        columnNumber: 13
                                    }, this),
                                    " CSV出力"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 542,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleListing(true),
                                        disabled: listing,
                                        style: {
                                            padding: '0.5rem',
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            borderRadius: '4px',
                                            border: "1px solid ".concat(T.accent),
                                            background: 'transparent',
                                            color: T.accent,
                                            cursor: 'pointer'
                                        },
                                        children: "下書き"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 561,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleListing(false),
                                        disabled: listing,
                                        style: {
                                            padding: '0.5rem',
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: T.accent,
                                            color: 'white',
                                            cursor: 'pointer'
                                        },
                                        children: "出品"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 577,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 560,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                        lineNumber: 524,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                lineNumber: 445,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    padding: '0.75rem',
                    overflow: 'auto'
                },
                children: [
                    activeSection === 'basic' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "商品情報",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                        label: "商品名 *",
                                        maxLength: 50,
                                        currentLength: formData.title.length,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.title,
                                            onChange: (e)=>setFormData((prev)=>({
                                                        ...prev,
                                                        title: e.target.value.substring(0, 50)
                                                    })),
                                            placeholder: "Qoo10用商品タイトル（50文字以内）",
                                            style: inputStyle
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                            lineNumber: 604,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 603,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                        label: "キャッチコピー（広告文）",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.promotionText,
                                            onChange: (e)=>setFormData((prev)=>({
                                                        ...prev,
                                                        promotionText: e.target.value
                                                    })),
                                            placeholder: "送料無料！今だけ限定価格！",
                                            style: inputStyle
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                            lineNumber: 614,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 613,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                        label: "商品説明",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: formData.description,
                                            onChange: (e)=>setFormData((prev)=>({
                                                        ...prev,
                                                        description: e.target.value
                                                    })),
                                            rows: 4,
                                            placeholder: "商品の特徴、使い方、スペックなど",
                                            style: {
                                                ...inputStyle,
                                                resize: 'vertical'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                            lineNumber: 624,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 623,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 602,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.75rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                        title: "カテゴリ・属性",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "カテゴリ *",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: formData.categoryCode,
                                                    onChange: (e)=>setFormData((prev)=>({
                                                                ...prev,
                                                                categoryCode: e.target.value
                                                            })),
                                                    style: inputStyle,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "選択してください"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 642,
                                                            columnNumber: 21
                                                        }, this),
                                                        QOO10_CATEGORIES.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: cat.code,
                                                                children: [
                                                                    cat.name,
                                                                    " (手数料 ",
                                                                    cat.fee,
                                                                    "%)"
                                                                ]
                                                            }, cat.code, true, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                                lineNumber: 644,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 637,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 636,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "成人商品",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        gap: '1rem'
                                                    },
                                                    children: [
                                                        'N',
                                                        'Y'
                                                    ].map((val)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            style: {
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.25rem',
                                                                fontSize: '11px',
                                                                cursor: 'pointer'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "radio",
                                                                    checked: formData.adultYn === val,
                                                                    onChange: ()=>setFormData((prev)=>({
                                                                                ...prev,
                                                                                adultYn: val
                                                                            }))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                                    lineNumber: 655,
                                                                    columnNumber: 25
                                                                }, this),
                                                                val === 'N' ? '一般商品' : '成人商品'
                                                            ]
                                                        }, val, true, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 654,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 652,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 651,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "ブランド",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: formData.brandName,
                                                    onChange: (e)=>setFormData((prev)=>({
                                                                ...prev,
                                                                brandName: e.target.value
                                                            })),
                                                    placeholder: "ブランド名",
                                                    style: inputStyle
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 667,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 666,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 635,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                        title: "識別情報",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "販売者商品コード（SKU）",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: formData.sellerCode,
                                                    onChange: (e)=>setFormData((prev)=>({
                                                                ...prev,
                                                                sellerCode: e.target.value
                                                            })),
                                                    placeholder: "SKU-12345",
                                                    style: inputStyle
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 679,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 678,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "JANコード",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: formData.janCode,
                                                    onChange: (e)=>setFormData((prev)=>({
                                                                ...prev,
                                                                janCode: e.target.value
                                                            })),
                                                    placeholder: "4901234567890",
                                                    style: inputStyle
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 689,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 688,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "返品連絡先 *",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    value: formData.contactInfo,
                                                    onChange: (e)=>setFormData((prev)=>({
                                                                ...prev,
                                                                contactInfo: e.target.value
                                                            })),
                                                    style: inputStyle
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 699,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 698,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 677,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 634,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                        lineNumber: 601,
                        columnNumber: 11
                    }, this),
                    activeSection === 'pricing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            gridTemplateColumns: 'repeat(4, 1fr)',
                                            gap: '0.75rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "仕入れ価格 *",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 718,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            value: formData.costPrice,
                                                            onChange: (e)=>setFormData((prev)=>({
                                                                        ...prev,
                                                                        costPrice: Number(e.target.value)
                                                                    })),
                                                            style: {
                                                                ...inputStyle,
                                                                paddingLeft: '20px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 719,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 717,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 716,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "販売価格 *",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 730,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            value: formData.sellingPrice,
                                                            onChange: (e)=>setFormData((prev)=>({
                                                                        ...prev,
                                                                        sellingPrice: Number(e.target.value)
                                                                    })),
                                                            style: {
                                                                ...inputStyle,
                                                                paddingLeft: '20px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 731,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 729,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 728,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "定価（元値表示用）",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 742,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            value: formData.originalPrice,
                                                            onChange: (e)=>setFormData((prev)=>({
                                                                        ...prev,
                                                                        originalPrice: Number(e.target.value)
                                                                    })),
                                                            style: {
                                                                ...inputStyle,
                                                                paddingLeft: '20px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 743,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 741,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 740,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "在庫数",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: formData.stockQuantity,
                                                    onChange: (e)=>setFormData((prev)=>({
                                                                ...prev,
                                                                stockQuantity: Number(e.target.value)
                                                            })),
                                                    min: 0,
                                                    style: inputStyle
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 753,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 752,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 715,
                                        columnNumber: 15
                                    }, this),
                                    profitResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: '0.5rem',
                                            marginTop: '0.5rem'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: applyRecommendedPrice,
                                            style: {
                                                padding: '0.375rem 0.75rem',
                                                fontSize: '10px',
                                                borderRadius: '4px',
                                                border: "1px solid ".concat(T.blue),
                                                background: "".concat(T.blue, "10"),
                                                color: T.blue,
                                                cursor: 'pointer'
                                            },
                                            children: [
                                                "推奨価格 ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.recommendedPrice),
                                                " を適用"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                            lineNumber: 766,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 765,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 714,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "配送設定",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(4, 1fr)',
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
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 792,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "yamato",
                                                            children: "ヤマト運輸"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 793,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "sagawa",
                                                            children: "佐川急便"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 794,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 787,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 786,
                                                columnNumber: 17
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
                                                            children: [
                                                                s.nameJa,
                                                                " (",
                                                                s.isFlat ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(s.flatRate) : 'サイズ制',
                                                                ")"
                                                            ]
                                                        }, s.id, true, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 805,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 799,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 798,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "発送元地域",
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
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 819,
                                                            columnNumber: 23
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 813,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 812,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormField, {
                                                label: "送料負担",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        gap: '0.5rem',
                                                        alignItems: 'center',
                                                        height: '32px'
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                            fontSize: '11px',
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
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                                lineNumber: 827,
                                                                columnNumber: 23
                                                            }, this),
                                                            "送料無料"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                        lineNumber: 826,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 825,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 824,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 785,
                                        columnNumber: 15
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
                                            marginTop: '0.5rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fas fa-magic"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 851,
                                                columnNumber: 17
                                            }, this),
                                            " 最安送料を自動選択"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 838,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 784,
                                columnNumber: 13
                            }, this),
                            profitResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "利益計算詳細",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(5, 1fr)',
                                            gap: '0.5rem'
                                        },
                                        children: [
                                            {
                                                label: '送料',
                                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.shippingFee)
                                            },
                                            {
                                                label: 'Qoo10手数料',
                                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.qoo10Fee)
                                            },
                                            {
                                                label: '決済手数料',
                                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.paymentFee)
                                            },
                                            {
                                                label: '損益分岐',
                                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.breakEvenPrice)
                                            },
                                            {
                                                label: '純利益',
                                                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$qoo10$2f$profit$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatJPY"])(profitResult.netProfit),
                                                color: profitResult.isProfitable ? T.success : T.error
                                            }
                                        ].map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                        children: item.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                        lineNumber: 867,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '12px',
                                                            fontWeight: 700,
                                                            color: item.color || T.text
                                                        },
                                                        children: item.value
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                        lineNumber: 868,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 866,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 858,
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
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                        lineNumber: 877,
                                                        columnNumber: 25
                                                    }, this),
                                                    " ",
                                                    w
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 876,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 874,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 857,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                        lineNumber: 713,
                        columnNumber: 11
                    }, this),
                    activeSection === 'html' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "HTML商品説明",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: '0.5rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: generateHtml,
                                                style: {
                                                    padding: '0.5rem 1rem',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    background: T.accent,
                                                    color: 'white',
                                                    cursor: 'pointer'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fas fa-magic"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                        lineNumber: 905,
                                                        columnNumber: 19
                                                    }, this),
                                                    " HTMLを自動生成"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 892,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    marginLeft: '0.5rem',
                                                    fontSize: '10px',
                                                    color: T.textMuted
                                                },
                                                children: "※商品情報から自動でHTMLを生成します"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 907,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 891,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: formData.htmlDescription,
                                        onChange: (e)=>setFormData((prev)=>({
                                                    ...prev,
                                                    htmlDescription: e.target.value
                                                })),
                                        rows: 20,
                                        placeholder: "<div>...</div>",
                                        style: {
                                            ...inputStyle,
                                            fontFamily: 'monospace',
                                            fontSize: '10px',
                                            resize: 'vertical'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 912,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 890,
                                columnNumber: 13
                            }, this),
                            formData.htmlDescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "プレビュー",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '1rem',
                                        background: 'white',
                                        borderRadius: '4px',
                                        border: "1px solid ".concat(T.panelBorder),
                                        maxHeight: '400px',
                                        overflow: 'auto'
                                    },
                                    dangerouslySetInnerHTML: {
                                        __html: formData.htmlDescription
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                    lineNumber: 924,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 923,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                        lineNumber: 889,
                        columnNumber: 11
                    }, this),
                    activeSection === 'images' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "商品画像（最大10枚）",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(5, 1fr)',
                                            gap: '0.5rem'
                                        },
                                        children: [
                                            ...Array(10)
                                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    aspectRatio: '1',
                                                    borderRadius: '4px',
                                                    border: "2px dashed ".concat(formData.images[i] ? T.success : T.panelBorder),
                                                    background: formData.images[i] ? 'white' : T.highlight,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    overflow: 'hidden',
                                                    position: 'relative'
                                                },
                                                children: formData.images[i] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: formData.images[i],
                                                            alt: "Image ".concat(i + 1),
                                                            style: {
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 962,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                position: 'absolute',
                                                                top: '4px',
                                                                left: '4px',
                                                                background: i === 0 ? T.accent : T.textMuted,
                                                                color: 'white',
                                                                fontSize: '8px',
                                                                padding: '2px 4px',
                                                                borderRadius: '2px'
                                                            },
                                                            children: i === 0 ? 'メイン' : i + 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 967,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        textAlign: 'center',
                                                        color: T.textSubtle,
                                                        fontSize: '10px'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fas fa-image",
                                                            style: {
                                                                fontSize: '20px',
                                                                marginBottom: '4px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 982,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: i + 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                            lineNumber: 983,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                    lineNumber: 981,
                                                    columnNumber: 23
                                                }, this)
                                            }, i, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 946,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 944,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: '0.75rem',
                                            fontSize: '10px',
                                            color: T.textMuted
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fas fa-info-circle"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                                lineNumber: 991,
                                                columnNumber: 17
                                            }, this),
                                            ' ',
                                            "画像はモーダルの「Images」タブで設定できます。メイン画像は正方形推奨（600x600px以上）"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                        lineNumber: 990,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 943,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionCard, {
                                title: "ストック画像設定（今後実装予定）",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '1rem',
                                        background: T.highlight,
                                        borderRadius: '4px',
                                        textAlign: 'center',
                                        color: T.textMuted,
                                        fontSize: '11px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-tools",
                                            style: {
                                                fontSize: '24px',
                                                marginBottom: '0.5rem'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                            lineNumber: 998,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: "モール別ストック画像（品質保証マーク等）の設定機能は今後追加予定です"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                            lineNumber: 999,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                    lineNumber: 997,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                                lineNumber: 996,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                        lineNumber: 942,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                lineNumber: 598,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
        lineNumber: 443,
        columnNumber: 5
    }, this);
}
_s(TabQoo10, "vS5kPi7eBuTuFSH2Lgi2d2s41CE=");
_c = TabQoo10;
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
                    marginBottom: '0.75rem',
                    paddingBottom: '0.5rem',
                    borderBottom: "1px solid ".concat(T.panelBorder)
                },
                children: title
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                lineNumber: 1019,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                lineNumber: 1030,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
        lineNumber: 1013,
        columnNumber: 5
    }, this);
}
_c1 = SectionCard;
function FormField(param) {
    let { label, children, maxLength, currentLength } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: T.textMuted,
                    marginBottom: '0.25rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                        lineNumber: 1054,
                        columnNumber: 9
                    }, this),
                    maxLength && currentLength !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: currentLength > maxLength * 0.8 ? T.warning : T.textSubtle
                        },
                        children: [
                            currentLength,
                            "/",
                            maxLength
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                        lineNumber: 1056,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
                lineNumber: 1045,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx",
        lineNumber: 1044,
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
const __TURBOPACK__default__export__ = TabQoo10;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "TabQoo10");
__turbopack_context__.k.register(_c1, "SectionCard");
__turbopack_context__.k.register(_c2, "FormField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_d4c3d429._.js.map