(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/app/tools/analytics-n3/hooks/use-analytics-integrated.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/analytics-n3/hooks/use-analytics-integrated.ts
/**
 * Analytics N3 統合フック
 *
 * ゴールドスタンダード準拠:
 * - Domain State: React Query (サーバーデータ)
 * - UI State: Zustand (日付範囲、フィルター、チャート設定)
 * - 統合フックでマージして単一インターフェースを提供
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useAnalyticsIntegrated",
    ()=>useAnalyticsIntegrated
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/n3/analyticsUIStore.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function getDateRange(preset, custom) {
    const now = new Date();
    const end = now.toISOString().split('T')[0];
    switch(preset){
        case 'today':
            return {
                start: end,
                end
            };
        case '7days':
            return {
                start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                end
            };
        case '30days':
            return {
                start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                end
            };
        case '90days':
            return {
                start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                end
            };
        case 'custom':
            return custom !== null && custom !== void 0 ? custom : {
                start: end,
                end
            };
        default:
            return {
                start: end,
                end
            };
    }
}
async function fetchAnalytics(params) {
    var _weeklyData_summary, _weeklyData_summary1, _weeklyData_summary2, _ordersData_summary;
    const dateRange = getDateRange(params.dateRangePreset, params.customDateRange);
    const days = Math.ceil((new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) / (24 * 60 * 60 * 1000)) + 1;
    // 実API呼び出し: /api/orders (売上データ取得)
    const ordersQuery = new URLSearchParams({
        limit: '1000',
        offset: '0'
    });
    if (params.marketplace.length > 0 && !params.marketplace.includes('all')) {
        ordersQuery.set('marketplace', params.marketplace[0]);
    }
    const ordersResponse = await fetch("/api/orders?".concat(ordersQuery.toString()));
    let ordersData = null;
    if (ordersResponse.ok) {
        const json = await ordersResponse.json();
        if (json.success) {
            ordersData = json.data;
        }
    }
    // 実API呼び出し: /api/analytics/weekly-review (タスク分析)
    const period = days <= 7 ? '7d' : '30d';
    const weeklyResponse = await fetch("/api/analytics/weekly-review?period=".concat(period));
    let weeklyData = null;
    if (weeklyResponse.ok) {
        const json = await weeklyResponse.json();
        if (json.success) {
            weeklyData = json.analytics;
        }
    }
    // 注文データからセールスデータを構築
    const orders = (ordersData === null || ordersData === void 0 ? void 0 : ordersData.orders) || [];
    const salesByDate = new Map();
    const salesByMarketplace = {
        ebay: 0,
        amazon: 0,
        mercari: 0,
        yahoo: 0,
        rakuten: 0
    };
    let totalSales = 0;
    let totalOrders = orders.length;
    orders.forEach((order)=>{
        var _order_order_date;
        const orderDate = ((_order_order_date = order.order_date) === null || _order_order_date === void 0 ? void 0 : _order_order_date.split('T')[0]) || new Date().toISOString().split('T')[0];
        const orderTotal = order.total_amount || 0;
        const existing = salesByDate.get(orderDate) || {
            sales: 0,
            orders: 0
        };
        salesByDate.set(orderDate, {
            sales: existing.sales + orderTotal,
            orders: existing.orders + 1
        });
        const mp = (order.marketplace || 'ebay').toLowerCase().split('_')[0];
        if (salesByMarketplace[mp] !== undefined) {
            salesByMarketplace[mp] += orderTotal;
        }
        totalSales += orderTotal;
    });
    const salesTimeline = Array.from(salesByDate.entries()).map((param)=>{
        let [date, data] = param;
        return {
            date,
            ...data
        };
    }).sort((a, b)=>a.date.localeCompare(b.date));
    const costRatio = 0.6;
    const profitTimeline = salesTimeline.map((s)=>({
            date: s.date,
            revenue: s.sales,
            cost: Math.floor(s.sales * 0.6),
            profit: Math.floor(s.sales * 0.4),
            margin: 40
        }));
    const totalRevenue = totalSales;
    const totalCost = Math.floor(totalSales * costRatio);
    const totalProfit = totalRevenue - totalCost;
    const avgMargin = Math.round((1 - costRatio) * 100);
    // 週次レビューデータからAIメトリクスを構築
    const aiMetrics = {
        generationQuality: {
            avgScore: (weeklyData === null || weeklyData === void 0 ? void 0 : (_weeklyData_summary = weeklyData.summary) === null || _weeklyData_summary === void 0 ? void 0 : _weeklyData_summary.accuracyRate) || 80,
            scoreDistribution: {
                excellent: 30,
                good: 50,
                fair: 15,
                poor: 5
            },
            trend: 'up'
        },
        seoPerformance: {
            avgScore: 75,
            improvementRate: 10,
            topKeywords: [
                'ブランド',
                '高品質',
                '正規品',
                '新品',
                '送料無料'
            ]
        },
        pricingAccuracy: {
            avgDeviation: 5.0,
            competitiveRatio: 0.85,
            profitOptimization: 90
        },
        processingStats: {
            totalProcessed: (weeklyData === null || weeklyData === void 0 ? void 0 : (_weeklyData_summary1 = weeklyData.summary) === null || _weeklyData_summary1 === void 0 ? void 0 : _weeklyData_summary1.tasksCount) || 0,
            successRate: (weeklyData === null || weeklyData === void 0 ? void 0 : (_weeklyData_summary2 = weeklyData.summary) === null || _weeklyData_summary2 === void 0 ? void 0 : _weeklyData_summary2.accuracyRate) || 95,
            avgProcessingTime: 2.0
        }
    };
    // デフォルトタイムライン生成関数
    const generateDefaultTimeline = (numDays, startDateStr)=>{
        return Array.from({
            length: numDays
        }, (_, i)=>{
            const date = new Date(new Date(startDateStr).getTime() + i * 24 * 60 * 60 * 1000);
            return {
                date: date.toISOString().split('T')[0],
                sales: 0,
                orders: 0
            };
        });
    };
    const generateDefaultProfitTimeline = (numDays, startDateStr)=>{
        return Array.from({
            length: numDays
        }, (_, i)=>{
            const date = new Date(new Date(startDateStr).getTime() + i * 24 * 60 * 60 * 1000);
            return {
                date: date.toISOString().split('T')[0],
                revenue: 0,
                cost: 0,
                profit: 0,
                margin: 0
            };
        });
    };
    return {
        sales: {
            timeline: salesTimeline.length > 0 ? salesTimeline : generateDefaultTimeline(days, dateRange.start),
            totalSales,
            totalOrders,
            avgOrderValue: totalOrders > 0 ? Math.floor(totalSales / totalOrders) : 0,
            byMarketplace: salesByMarketplace
        },
        profit: {
            timeline: profitTimeline.length > 0 ? profitTimeline : generateDefaultProfitTimeline(days, dateRange.start),
            totalRevenue,
            totalCost,
            totalProfit,
            avgMargin,
            byCategory: {}
        },
        aiMetrics,
        stats: {
            salesGrowth: 10.0,
            profitGrowth: 8.0,
            orderGrowth: 5.0,
            newCustomers: (ordersData === null || ordersData === void 0 ? void 0 : (_ordersData_summary = ordersData.summary) === null || _ordersData_summary === void 0 ? void 0 : _ordersData_summary.total) || 0,
            repeatRate: 30
        }
    };
}
function useAnalyticsIntegrated() {
    _s();
    // ===== UI State (Zustand) =====
    const activeTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsActiveTab"])();
    const dateRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsDateRange"])();
    const marketplace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsMarketplace"])();
    const chartType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsChartType"])();
    const granularity = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsGranularity"])();
    const currency = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsCurrency"])();
    const comparison = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsComparison"])();
    // ===== UI Actions =====
    const { setActiveTab, setDateRangePreset, setCustomDateRange, setMarketplace, setCategory, setProductType, toggleComparison, setComparisonPeriod, setChartType, setGranularity, setCurrency, clearFilters, reset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsUIStore"])();
    // ===== Domain State (React Query) =====
    const { data, isLoading, isFetching, error, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'analytics',
            dateRange.preset,
            dateRange.custom,
            marketplace,
            granularity
        ],
        queryFn: {
            "useAnalyticsIntegrated.useQuery": ()=>fetchAnalytics({
                    dateRangePreset: dateRange.preset,
                    customDateRange: dateRange.custom,
                    marketplace,
                    granularity
                })
        }["useAnalyticsIntegrated.useQuery"],
        staleTime: 60 * 1000
    });
    // ===== マージされたデータ =====
    const sales = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAnalyticsIntegrated.useMemo[sales]": ()=>{
            var _data_sales;
            return (_data_sales = data === null || data === void 0 ? void 0 : data.sales) !== null && _data_sales !== void 0 ? _data_sales : null;
        }
    }["useAnalyticsIntegrated.useMemo[sales]"], [
        data
    ]);
    const profit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAnalyticsIntegrated.useMemo[profit]": ()=>{
            var _data_profit;
            return (_data_profit = data === null || data === void 0 ? void 0 : data.profit) !== null && _data_profit !== void 0 ? _data_profit : null;
        }
    }["useAnalyticsIntegrated.useMemo[profit]"], [
        data
    ]);
    const aiMetrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAnalyticsIntegrated.useMemo[aiMetrics]": ()=>{
            var _data_aiMetrics;
            return (_data_aiMetrics = data === null || data === void 0 ? void 0 : data.aiMetrics) !== null && _data_aiMetrics !== void 0 ? _data_aiMetrics : null;
        }
    }["useAnalyticsIntegrated.useMemo[aiMetrics]"], [
        data
    ]);
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAnalyticsIntegrated.useMemo[stats]": ()=>{
            var _data_stats;
            return (_data_stats = data === null || data === void 0 ? void 0 : data.stats) !== null && _data_stats !== void 0 ? _data_stats : null;
        }
    }["useAnalyticsIntegrated.useMemo[stats]"], [
        data
    ]);
    // ===== 通貨変換 =====
    const formatCurrency = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAnalyticsIntegrated.useCallback[formatCurrency]": (value)=>{
            if (currency === 'USD') {
                return "$".concat((value / 150).toFixed(2));
            }
            return "¥".concat(value.toLocaleString());
        }
    }["useAnalyticsIntegrated.useCallback[formatCurrency]"], [
        currency
    ]);
    // ===== 日付範囲の実際の値 =====
    const actualDateRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAnalyticsIntegrated.useMemo[actualDateRange]": ()=>getDateRange(dateRange.preset, dateRange.custom)
    }["useAnalyticsIntegrated.useMemo[actualDateRange]"], [
        dateRange
    ]);
    const handleRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAnalyticsIntegrated.useCallback[handleRefresh]": ()=>{
            refetch();
        }
    }["useAnalyticsIntegrated.useCallback[handleRefresh]"], [
        refetch
    ]);
    // ===== 返却値 =====
    return {
        // データ
        sales,
        profit,
        aiMetrics,
        stats,
        actualDateRange,
        // UI状態
        activeTab,
        dateRangePreset: dateRange.preset,
        customDateRange: dateRange.custom,
        marketplace,
        chartType,
        granularity,
        currency,
        comparisonEnabled: comparison.enabled,
        comparisonPeriod: comparison.period,
        // ローディング・エラー
        isLoading,
        isFetching,
        error: error instanceof Error ? error.message : null,
        // アクション
        setActiveTab,
        setDateRangePreset,
        setCustomDateRange,
        setMarketplace,
        setCategory,
        setProductType,
        toggleComparison,
        setComparisonPeriod,
        setChartType,
        setGranularity,
        setCurrency,
        clearFilters,
        reset,
        // ユーティリティ
        formatCurrency,
        refresh: handleRefresh
    };
}
_s(useAnalyticsIntegrated, "HoTUE1obLW4c5/Hsgoge6xQ68hE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsActiveTab"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsDateRange"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsMarketplace"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsChartType"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsGranularity"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsCurrency"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsComparison"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
const __TURBOPACK__default__export__ = useAnalyticsIntegrated;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/analytics-n3/hooks/use-analytics-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/analytics-n3/hooks/use-analytics-data.ts
/**
 * Analytics N3 データフック
 * 売上・利益・KPIデータの取得・管理
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useAnalyticsData",
    ()=>useAnalyticsData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
// モック売上データ生成
const generateSalesData = (days, marketplace)=>{
    const data = [];
    const now = new Date();
    for(let i = days - 1; i >= 0; i--){
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const baseRevenue = 50000 + Math.random() * 100000;
        const orders = Math.floor(10 + Math.random() * 30);
        data.push({
            date: date.toISOString().split('T')[0],
            revenue: Math.round(baseRevenue),
            orders,
            averageOrderValue: Math.round(baseRevenue / orders),
            marketplace: marketplace === 'all' ? [
                'ebay',
                'amazon',
                'mercari'
            ][i % 3] : marketplace
        });
    }
    return data;
};
// モック利益データ生成
const generateProfitData = (days)=>{
    const data = [];
    const now = new Date();
    for(let i = days - 1; i >= 0; i--){
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const revenue = 50000 + Math.random() * 100000;
        const margin = 0.2 + Math.random() * 0.15;
        const profit = revenue * margin;
        const cost = revenue - profit;
        data.push({
            date: date.toISOString().split('T')[0],
            revenue: Math.round(revenue),
            cost: Math.round(cost),
            profit: Math.round(profit),
            margin: Math.round(margin * 100) / 100,
            marketplace: [
                'ebay',
                'amazon',
                'mercari'
            ][i % 3]
        });
    }
    return data;
};
// 費用内訳
const defaultCostBreakdown = [
    {
        category: '仕入れ原価',
        amount: 450000,
        percentage: 45,
        color: 'var(--color-primary)'
    },
    {
        category: 'プラットフォーム手数料',
        amount: 150000,
        percentage: 15,
        color: 'var(--color-success)'
    },
    {
        category: '送料',
        amount: 120000,
        percentage: 12,
        color: 'var(--color-warning)'
    },
    {
        category: '梱包材',
        amount: 30000,
        percentage: 3,
        color: 'var(--color-error)'
    },
    {
        category: '広告費',
        amount: 80000,
        percentage: 8,
        color: 'var(--color-info)'
    },
    {
        category: 'その他',
        amount: 70000,
        percentage: 7,
        color: 'var(--text-muted)'
    }
];
function useAnalyticsData() {
    _s();
    const [dateRange, setDateRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('30d');
    const [marketplace, setMarketplace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 日数変換
    const getDays = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAnalyticsData.useCallback[getDays]": (range)=>{
            switch(range){
                case '7d':
                    return 7;
                case '30d':
                    return 30;
                case '90d':
                    return 90;
                case '1y':
                    return 365;
                default:
                    return 30;
            }
        }
    }["useAnalyticsData.useCallback[getDays]"], []);
    // 売上データ
    const salesData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAnalyticsData.useMemo[salesData]": ()=>generateSalesData(getDays(dateRange), marketplace)
    }["useAnalyticsData.useMemo[salesData]"], [
        dateRange,
        marketplace,
        getDays
    ]);
    // 売上サマリー
    const salesSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAnalyticsData.useMemo[salesSummary]": ()=>{
            const totalRevenue = salesData.reduce({
                "useAnalyticsData.useMemo[salesSummary].totalRevenue": (sum, d)=>sum + d.revenue
            }["useAnalyticsData.useMemo[salesSummary].totalRevenue"], 0);
            const totalOrders = salesData.reduce({
                "useAnalyticsData.useMemo[salesSummary].totalOrders": (sum, d)=>sum + d.orders
            }["useAnalyticsData.useMemo[salesSummary].totalOrders"], 0);
            const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
            return {
                totalRevenue,
                totalOrders,
                averageOrderValue: Math.round(averageOrderValue),
                revenueChange: 12.5,
                ordersChange: 8.3,
                aovChange: 4.2
            };
        }
    }["useAnalyticsData.useMemo[salesSummary]"], [
        salesData
    ]);
    // 利益データ
    const profitData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAnalyticsData.useMemo[profitData]": ()=>generateProfitData(getDays(dateRange))
    }["useAnalyticsData.useMemo[profitData]"], [
        dateRange,
        getDays
    ]);
    // 利益サマリー
    const profitSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAnalyticsData.useMemo[profitSummary]": ()=>{
            const totalRevenue = profitData.reduce({
                "useAnalyticsData.useMemo[profitSummary].totalRevenue": (sum, d)=>sum + d.revenue
            }["useAnalyticsData.useMemo[profitSummary].totalRevenue"], 0);
            const totalCost = profitData.reduce({
                "useAnalyticsData.useMemo[profitSummary].totalCost": (sum, d)=>sum + d.cost
            }["useAnalyticsData.useMemo[profitSummary].totalCost"], 0);
            const totalProfit = profitData.reduce({
                "useAnalyticsData.useMemo[profitSummary].totalProfit": (sum, d)=>sum + d.profit
            }["useAnalyticsData.useMemo[profitSummary].totalProfit"], 0);
            const averageMargin = totalRevenue > 0 ? totalProfit / totalRevenue * 100 : 0;
            return {
                totalRevenue,
                totalCost,
                totalProfit,
                averageMargin: Math.round(averageMargin * 10) / 10,
                profitChange: 15.2,
                marginChange: 2.1
            };
        }
    }["useAnalyticsData.useMemo[profitSummary]"], [
        profitData
    ]);
    // 費用内訳
    const costBreakdown = defaultCostBreakdown;
    // KPIデータ
    const kpiData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAnalyticsData.useMemo[kpiData]": ()=>[
                {
                    id: 'revenue',
                    label: '売上高',
                    value: salesSummary.totalRevenue,
                    change: salesSummary.revenueChange,
                    changeLabel: '前期比',
                    trend: 'up',
                    format: 'currency',
                    color: 'var(--color-primary)'
                },
                {
                    id: 'orders',
                    label: '注文数',
                    value: salesSummary.totalOrders,
                    change: salesSummary.ordersChange,
                    changeLabel: '前期比',
                    trend: 'up',
                    format: 'number',
                    color: 'var(--color-success)'
                },
                {
                    id: 'profit',
                    label: '利益',
                    value: profitSummary.totalProfit,
                    change: profitSummary.profitChange,
                    changeLabel: '前期比',
                    trend: 'up',
                    format: 'currency',
                    color: 'var(--color-warning)'
                },
                {
                    id: 'margin',
                    label: '利益率',
                    value: profitSummary.averageMargin,
                    change: profitSummary.marginChange,
                    changeLabel: '前期比',
                    trend: 'up',
                    format: 'percentage',
                    color: 'var(--color-info)'
                }
            ]
    }["useAnalyticsData.useMemo[kpiData]"], [
        salesSummary,
        profitSummary
    ]);
    // リフレッシュ
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAnalyticsData.useCallback[refresh]": async ()=>{
            setLoading(true);
            await new Promise({
                "useAnalyticsData.useCallback[refresh]": (resolve)=>setTimeout(resolve, 500)
            }["useAnalyticsData.useCallback[refresh]"]);
            setLoading(false);
        }
    }["useAnalyticsData.useCallback[refresh]"], []);
    return {
        dateRange,
        setDateRange,
        marketplace,
        setMarketplace,
        salesData,
        salesSummary,
        profitData,
        profitSummary,
        costBreakdown,
        kpiData,
        loading,
        refresh
    };
}
_s(useAnalyticsData, "xgIeOYVXWY7mbX6IAODRgNGXbQ8=");
const __TURBOPACK__default__export__ = useAnalyticsData;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/analytics-n3/hooks/use-ai-metrics.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/analytics-n3/hooks/use-ai-metrics.ts
/**
 * AI品質管理フック
 * モデル精度・改善提案の管理
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useAIMetrics",
    ()=>useAIMetrics
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
// モックAIメトリクス
const mockAIMetrics = [
    {
        modelName: '価格予測モデル',
        accuracy: 92.3,
        precision: 89.7,
        recall: 94.1,
        f1Score: 91.8,
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'healthy'
    },
    {
        modelName: '需要予測モデル',
        accuracy: 87.5,
        precision: 85.2,
        recall: 89.8,
        f1Score: 87.4,
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'healthy'
    },
    {
        modelName: '商品分類モデル',
        accuracy: 78.2,
        precision: 76.5,
        recall: 79.9,
        f1Score: 78.1,
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'warning'
    },
    {
        modelName: 'SEOスコアリングモデル',
        accuracy: 94.8,
        precision: 93.2,
        recall: 96.3,
        f1Score: 94.7,
        lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        status: 'healthy'
    }
];
// モック改善提案
const mockImprovements = [
    {
        id: 'imp-1',
        type: 'data',
        title: '訓練データの追加',
        description: '商品分類モデルの精度向上のため、新カテゴリのラベル付きデータを500件以上追加することを推奨',
        impact: 'high',
        status: 'pending',
        priority: 1
    },
    {
        id: 'imp-2',
        type: 'accuracy',
        title: 'モデル再学習',
        description: '需要予測モデルの季節性パターンを改善するため、最新6ヶ月のデータで再学習を実施',
        impact: 'medium',
        status: 'in_progress',
        priority: 2
    },
    {
        id: 'imp-3',
        type: 'feature',
        title: '特徴量エンジニアリング',
        description: '価格予測モデルに競合価格の変動率を新しい特徴量として追加',
        impact: 'medium',
        status: 'pending',
        priority: 3
    },
    {
        id: 'imp-4',
        type: 'performance',
        title: '推論速度の最適化',
        description: 'バッチ推論の並列化により、処理速度を30%向上可能',
        impact: 'low',
        status: 'completed',
        priority: 4
    }
];
function useAIMetrics() {
    _s();
    const [metrics, setMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(mockAIMetrics);
    const [improvements, setImprovements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(mockImprovements);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 全体健全性スコア
    const healthScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAIMetrics.useMemo[healthScore]": ()=>{
            const healthyCount = metrics.filter({
                "useAIMetrics.useMemo[healthScore]": (m)=>m.status === 'healthy'
            }["useAIMetrics.useMemo[healthScore]"]).length;
            return Math.round(healthyCount / metrics.length * 100);
        }
    }["useAIMetrics.useMemo[healthScore]"], [
        metrics
    ]);
    // 平均精度
    const avgAccuracy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAIMetrics.useMemo[avgAccuracy]": ()=>{
            const sum = metrics.reduce({
                "useAIMetrics.useMemo[avgAccuracy].sum": (acc, m)=>acc + m.accuracy
            }["useAIMetrics.useMemo[avgAccuracy].sum"], 0);
            return Math.round(sum / metrics.length * 10) / 10;
        }
    }["useAIMetrics.useMemo[avgAccuracy]"], [
        metrics
    ]);
    // 改善提案統計
    const improvementStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useAIMetrics.useMemo[improvementStats]": ()=>({
                total: improvements.length,
                pending: improvements.filter({
                    "useAIMetrics.useMemo[improvementStats]": (i)=>i.status === 'pending'
                }["useAIMetrics.useMemo[improvementStats]"]).length,
                inProgress: improvements.filter({
                    "useAIMetrics.useMemo[improvementStats]": (i)=>i.status === 'in_progress'
                }["useAIMetrics.useMemo[improvementStats]"]).length,
                completed: improvements.filter({
                    "useAIMetrics.useMemo[improvementStats]": (i)=>i.status === 'completed'
                }["useAIMetrics.useMemo[improvementStats]"]).length,
                highImpact: improvements.filter({
                    "useAIMetrics.useMemo[improvementStats]": (i)=>i.impact === 'high' && i.status !== 'completed'
                }["useAIMetrics.useMemo[improvementStats]"]).length
            })
    }["useAIMetrics.useMemo[improvementStats]"], [
        improvements
    ]);
    // 改善提案のステータス更新
    const updateImprovementStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAIMetrics.useCallback[updateImprovementStatus]": (id, status)=>{
            setImprovements({
                "useAIMetrics.useCallback[updateImprovementStatus]": (prev)=>prev.map({
                        "useAIMetrics.useCallback[updateImprovementStatus]": (imp)=>imp.id === id ? {
                                ...imp,
                                status
                            } : imp
                    }["useAIMetrics.useCallback[updateImprovementStatus]"])
            }["useAIMetrics.useCallback[updateImprovementStatus]"]);
        }
    }["useAIMetrics.useCallback[updateImprovementStatus]"], []);
    // モデル再学習
    const retrainModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAIMetrics.useCallback[retrainModel]": async (modelName)=>{
            setLoading(true);
            // Simulate API call
            await new Promise({
                "useAIMetrics.useCallback[retrainModel]": (resolve)=>setTimeout(resolve, 2000)
            }["useAIMetrics.useCallback[retrainModel]"]);
            setMetrics({
                "useAIMetrics.useCallback[retrainModel]": (prev)=>prev.map({
                        "useAIMetrics.useCallback[retrainModel]": (m)=>m.modelName === modelName ? {
                                ...m,
                                accuracy: Math.min(99, m.accuracy + Math.random() * 3),
                                lastUpdated: new Date().toISOString(),
                                status: 'healthy'
                            } : m
                    }["useAIMetrics.useCallback[retrainModel]"])
            }["useAIMetrics.useCallback[retrainModel]"]);
            setLoading(false);
        }
    }["useAIMetrics.useCallback[retrainModel]"], []);
    // リフレッシュ
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAIMetrics.useCallback[refresh]": async ()=>{
            setLoading(true);
            await new Promise({
                "useAIMetrics.useCallback[refresh]": (resolve)=>setTimeout(resolve, 500)
            }["useAIMetrics.useCallback[refresh]"]);
            setMetrics(mockAIMetrics);
            setImprovements(mockImprovements);
            setLoading(false);
        }
    }["useAIMetrics.useCallback[refresh]"], []);
    return {
        metrics,
        improvements,
        healthScore,
        avgAccuracy,
        improvementStats,
        updateImprovementStatus,
        retrainModel,
        loading,
        refresh
    };
}
_s(useAIMetrics, "c7Oeeu8EC7qLaKhJPENgtYlriOM=");
const __TURBOPACK__default__export__ = useAIMetrics;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/analytics-n3/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/analytics-n3/hooks/index.ts
/**
 * Analytics N3 Hooks エクスポート
 *
 * ゴールドスタンダード:
 * - useAnalyticsIntegrated: 統合フック（推奨）- Domain State + UI Stateを連携
 * - 個別フック: 特定機能のみ必要な場合
 */ // 統合フック（推奨）
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$analytics$2d$n3$2f$hooks$2f$use$2d$analytics$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/analytics-n3/hooks/use-analytics-integrated.ts [app-client] (ecmascript)");
// 個別フック（後方互換性・特定機能用）
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$analytics$2d$n3$2f$hooks$2f$use$2d$analytics$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/analytics-n3/hooks/use-analytics-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$analytics$2d$n3$2f$hooks$2f$use$2d$ai$2d$metrics$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/analytics-n3/hooks/use-ai-metrics.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx
/**
 * Analytics N3 ページレイアウト
 * 分析ダッシュボードの統合レイアウト
 *
 * ゴールドスタンダード準拠: useAnalyticsIntegrated フックを使用
 */ __turbopack_context__.s([
    "AnalyticsN3PageLayout",
    ()=>AnalyticsN3PageLayout,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/brain.js [app-client] (ecmascript) <export default as Brain>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-chart.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$analytics$2d$n3$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/analytics-n3/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$analytics$2d$n3$2f$hooks$2f$use$2d$analytics$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/analytics-n3/hooks/use-analytics-integrated.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// L3タブ設定
const L3_TABS = [
    {
        id: 'sales',
        label: '売上分析',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
            lineNumber: 31,
            columnNumber: 39
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'profit',
        label: '利益分析',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
            lineNumber: 32,
            columnNumber: 40
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'ai',
        label: 'AI品質管理',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brain$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Brain$3e$__["Brain"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
            lineNumber: 33,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'pricing',
        label: '価格分析',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
            lineNumber: 34,
            columnNumber: 41
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'scoring',
        label: 'スコアリング',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
            lineNumber: 35,
            columnNumber: 43
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'reports',
        label: 'レポート',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
            lineNumber: 36,
            columnNumber: 41
        }, ("TURBOPACK compile-time value", void 0))
    }
];
// KPIカード
const KPICard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function KPICard(param) {
    let { data } = param;
    const formatValue = (value, format)=>{
        if (typeof value === 'string') return value;
        switch(format){
            case 'currency':
                return "¥".concat(value.toLocaleString());
            case 'percentage':
                return "".concat(value, "%");
            default:
                return value.toLocaleString();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '16px',
            background: 'var(--panel)',
            borderRadius: 'var(--style-radius-lg, 12px)',
            border: '1px solid var(--panel-border)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginBottom: '8px'
                },
                children: data.label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '24px',
                            fontWeight: 700,
                            color: 'var(--text)'
                        },
                        children: formatValue(data.value, data.format)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    data.change !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            fontSize: '12px',
                            color: data.change >= 0 ? 'var(--color-success)' : 'var(--color-error)'
                        },
                        children: [
                            data.change >= 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                lineNumber: 79,
                                columnNumber: 33
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                lineNumber: 79,
                                columnNumber: 60
                            }, this),
                            data.change >= 0 ? '+' : '',
                            data.change,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            data.changeLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    marginTop: '4px'
                },
                children: data.changeLabel
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                lineNumber: 85,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
});
_c = KPICard;
const AnalyticsN3PageLayout = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c1 = _s(function AnalyticsN3PageLayout() {
    _s();
    // ゴールドスタンダード: 統合フックを使用
    const { sales, profit, aiMetrics, stats, dateRangePreset, setDateRangePreset, isLoading, refresh } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$analytics$2d$n3$2f$hooks$2f$use$2d$analytics$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsIntegrated"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('sales');
    // 売上チャートデータ
    const salesChartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[salesChartData]": ()=>((sales === null || sales === void 0 ? void 0 : sales.timeline) || []).map({
                "AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[salesChartData]": (d)=>({
                        name: d.date.slice(5),
                        revenue: d.sales,
                        orders: d.orders * 1000
                    })
            }["AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[salesChartData]"])
    }["AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[salesChartData]"], [
        sales
    ]);
    // 利益チャートデータ
    const profitChartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[profitChartData]": ()=>((profit === null || profit === void 0 ? void 0 : profit.timeline) || []).map({
                "AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[profitChartData]": (d)=>({
                        name: d.date.slice(5),
                        revenue: d.revenue,
                        cost: d.cost,
                        profit: d.profit
                    })
            }["AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[profitChartData]"])
    }["AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[profitChartData]"], [
        profit
    ]);
    // 費用内訳チャートデータ
    const costPieData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[costPieData]": ()=>{
            const byCategory = (profit === null || profit === void 0 ? void 0 : profit.byCategory) || {};
            return Object.entries(byCategory).map({
                "AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[costPieData]": (param)=>{
                    let [category, amount] = param;
                    return {
                        name: category,
                        value: amount
                    };
                }
            }["AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[costPieData]"]);
        }
    }["AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[costPieData]"], [
        profit
    ]);
    // KPIデータを生成
    const kpiData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[kpiData]": ()=>[
                {
                    id: 'sales',
                    label: '総売上',
                    value: (sales === null || sales === void 0 ? void 0 : sales.totalSales) || 0,
                    format: 'currency',
                    change: stats === null || stats === void 0 ? void 0 : stats.salesGrowth
                },
                {
                    id: 'orders',
                    label: '受注数',
                    value: (sales === null || sales === void 0 ? void 0 : sales.totalOrders) || 0,
                    change: stats === null || stats === void 0 ? void 0 : stats.orderGrowth
                },
                {
                    id: 'avg',
                    label: '平均受注額',
                    value: (sales === null || sales === void 0 ? void 0 : sales.avgOrderValue) || 0,
                    format: 'currency'
                },
                {
                    id: 'profit',
                    label: '利益率',
                    value: (profit === null || profit === void 0 ? void 0 : profit.avgMargin) || 0,
                    format: 'percentage'
                }
            ]
    }["AnalyticsN3PageLayout.AnalyticsN3PageLayout.useMemo[kpiData]"], [
        sales,
        profit,
        stats
    ]);
    // タブコンテンツ
    const renderTabContent = ()=>{
        switch(activeTab){
            case 'sales':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '12px'
                            },
                            children: kpiData.map((kpi)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KPICard, {
                                    data: kpi
                                }, kpi.id, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 155,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                            lineNumber: 153,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '20px',
                                background: 'var(--panel)',
                                borderRadius: 'var(--style-radius-lg, 12px)',
                                border: '1px solid var(--panel-border)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: 'var(--text)',
                                        marginBottom: '16px'
                                    },
                                    children: "売上推移"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Chart"], {
                                    type: "area",
                                    data: salesChartData,
                                    series: [
                                        {
                                            dataKey: 'revenue',
                                            name: '売上',
                                            color: 'var(--color-primary)'
                                        }
                                    ],
                                    height: 300,
                                    showGrid: true,
                                    showLegend: true
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 171,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                            lineNumber: 160,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                    lineNumber: 151,
                    columnNumber: 11
                }, this);
            case 'profit':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '12px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KPICard, {
                                    data: {
                                        id: 'revenue',
                                        label: '総売上',
                                        value: (profit === null || profit === void 0 ? void 0 : profit.totalRevenue) || 0,
                                        format: 'currency'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 190,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KPICard, {
                                    data: {
                                        id: 'cost',
                                        label: '総コスト',
                                        value: (profit === null || profit === void 0 ? void 0 : profit.totalCost) || 0,
                                        format: 'currency'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 198,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KPICard, {
                                    data: {
                                        id: 'profit',
                                        label: '純利益',
                                        value: (profit === null || profit === void 0 ? void 0 : profit.totalProfit) || 0,
                                        change: stats === null || stats === void 0 ? void 0 : stats.profitGrowth,
                                        format: 'currency'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                            lineNumber: 189,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr',
                                gap: '16px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '20px',
                                        background: 'var(--panel)',
                                        borderRadius: 'var(--style-radius-lg, 12px)',
                                        border: '1px solid var(--panel-border)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'var(--text)',
                                                marginBottom: '16px'
                                            },
                                            children: "利益推移"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                            lineNumber: 227,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Chart"], {
                                            type: "stacked-bar",
                                            data: profitChartData,
                                            series: [
                                                {
                                                    dataKey: 'profit',
                                                    name: '利益',
                                                    color: 'var(--color-success)'
                                                },
                                                {
                                                    dataKey: 'cost',
                                                    name: 'コスト',
                                                    color: 'var(--color-error)'
                                                }
                                            ],
                                            height: 280,
                                            showGrid: true,
                                            showLegend: true
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                            lineNumber: 230,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 219,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '20px',
                                        background: 'var(--panel)',
                                        borderRadius: 'var(--style-radius-lg, 12px)',
                                        border: '1px solid var(--panel-border)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: 'var(--text)',
                                                marginBottom: '16px'
                                            },
                                            children: "費用内訳"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                            lineNumber: 251,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$chart$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Chart"], {
                                            type: "pie",
                                            data: costPieData,
                                            height: 250,
                                            showLegend: true
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                            lineNumber: 254,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 243,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                            lineNumber: 218,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                    lineNumber: 187,
                    columnNumber: 11
                }, this);
            case 'ai':
                var _aiMetrics_processingStats, _aiMetrics_generationQuality, _aiMetrics_processingStats1, _aiMetrics_seoPerformance, _aiMetrics_generationQuality1, _aiMetrics_generationQuality2, _aiMetrics_generationQuality3, _aiMetrics_pricingAccuracy;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '12px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KPICard, {
                                    data: {
                                        id: 'health',
                                        label: 'システム健全性',
                                        value: (aiMetrics === null || aiMetrics === void 0 ? void 0 : (_aiMetrics_processingStats = aiMetrics.processingStats) === null || _aiMetrics_processingStats === void 0 ? void 0 : _aiMetrics_processingStats.successRate) || 0,
                                        format: 'percentage'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 270,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KPICard, {
                                    data: {
                                        id: 'accuracy',
                                        label: '平均精度',
                                        value: (aiMetrics === null || aiMetrics === void 0 ? void 0 : (_aiMetrics_generationQuality = aiMetrics.generationQuality) === null || _aiMetrics_generationQuality === void 0 ? void 0 : _aiMetrics_generationQuality.avgScore) || 0,
                                        format: 'percentage'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 278,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KPICard, {
                                    data: {
                                        id: 'processed',
                                        label: '処理済み',
                                        value: (aiMetrics === null || aiMetrics === void 0 ? void 0 : (_aiMetrics_processingStats1 = aiMetrics.processingStats) === null || _aiMetrics_processingStats1 === void 0 ? void 0 : _aiMetrics_processingStats1.totalProcessed) || 0
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 286,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KPICard, {
                                    data: {
                                        id: 'seo',
                                        label: 'SEOスコア',
                                        value: (aiMetrics === null || aiMetrics === void 0 ? void 0 : (_aiMetrics_seoPerformance = aiMetrics.seoPerformance) === null || _aiMetrics_seoPerformance === void 0 ? void 0 : _aiMetrics_seoPerformance.avgScore) || 0,
                                        format: 'percentage'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 293,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                            lineNumber: 269,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--text)',
                                marginBottom: '8px'
                            },
                            children: "AI品質サマリー"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                            lineNumber: 304,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '16px',
                                background: 'var(--panel)',
                                borderRadius: 'var(--style-radius-lg, 12px)',
                                border: '1px solid var(--panel-border)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '16px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '12px',
                                                    color: 'var(--text-muted)',
                                                    marginBottom: '4px'
                                                },
                                                children: "生成品質トレンド"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                                lineNumber: 317,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '20px',
                                                    fontWeight: 600,
                                                    color: (aiMetrics === null || aiMetrics === void 0 ? void 0 : (_aiMetrics_generationQuality1 = aiMetrics.generationQuality) === null || _aiMetrics_generationQuality1 === void 0 ? void 0 : _aiMetrics_generationQuality1.trend) === 'up' ? 'var(--color-success)' : 'var(--text)'
                                                },
                                                children: (aiMetrics === null || aiMetrics === void 0 ? void 0 : (_aiMetrics_generationQuality2 = aiMetrics.generationQuality) === null || _aiMetrics_generationQuality2 === void 0 ? void 0 : _aiMetrics_generationQuality2.trend) === 'up' ? '上昇中' : (aiMetrics === null || aiMetrics === void 0 ? void 0 : (_aiMetrics_generationQuality3 = aiMetrics.generationQuality) === null || _aiMetrics_generationQuality3 === void 0 ? void 0 : _aiMetrics_generationQuality3.trend) === 'down' ? '低下中' : '安定'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                                lineNumber: 318,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                        lineNumber: 316,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '12px',
                                                    color: 'var(--text-muted)',
                                                    marginBottom: '4px'
                                                },
                                                children: "価格最適化"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                                lineNumber: 323,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '20px',
                                                    fontWeight: 600,
                                                    color: 'var(--text)'
                                                },
                                                children: [
                                                    (aiMetrics === null || aiMetrics === void 0 ? void 0 : (_aiMetrics_pricingAccuracy = aiMetrics.pricingAccuracy) === null || _aiMetrics_pricingAccuracy === void 0 ? void 0 : _aiMetrics_pricingAccuracy.profitOptimization) || 0,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                                lineNumber: 324,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                        lineNumber: 322,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                lineNumber: 315,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                            lineNumber: 307,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                    lineNumber: 267,
                    columnNumber: 11
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '300px',
                        background: 'var(--panel)',
                        borderRadius: 'var(--style-radius-lg, 12px)',
                        border: '1px solid var(--panel-border)'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: 'center',
                            color: 'var(--text-muted)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                size: 32,
                                style: {
                                    marginBottom: '8px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                lineNumber: 347,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '14px'
                                },
                                children: "準備中..."
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                lineNumber: 348,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                        lineNumber: 346,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                    lineNumber: 335,
                    columnNumber: 11
                }, this);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: 'var(--bg)',
            overflow: 'hidden'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--panel-border)',
                    background: 'var(--panel)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-info))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                        size: 20,
                                        color: "white"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                        lineNumber: 386,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 375,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            style: {
                                                fontSize: '18px',
                                                fontWeight: 700,
                                                color: 'var(--text)',
                                                margin: 0
                                            },
                                            children: "分析ダッシュボード (N3)"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                            lineNumber: 389,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontSize: '12px',
                                                color: 'var(--text-muted)',
                                                margin: 0
                                            },
                                            children: "売上・利益・AI品質の統合分析"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                            lineNumber: 392,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 388,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                            lineNumber: 374,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: '4px'
                                    },
                                    children: [
                                        '7days',
                                        '30days',
                                        '90days'
                                    ].map((range)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                            variant: dateRangePreset === range ? 'primary' : 'secondary',
                                            size: "sm",
                                            onClick: ()=>setDateRangePreset(range),
                                            children: range === '7days' ? '7日' : range === '30days' ? '30日' : '90日'
                                        }, range, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                            lineNumber: 402,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 400,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                    variant: "secondary",
                                    size: "sm",
                                    onClick: refresh,
                                    disabled: isLoading,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                        size: 14,
                                        className: isLoading ? 'animate-spin' : ''
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                        lineNumber: 414,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 413,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                    variant: "secondary",
                                    size: "sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                            lineNumber: 418,
                                            columnNumber: 15
                                        }, this),
                                        "エクスポート"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 417,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                            lineNumber: 398,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                    lineNumber: 373,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                lineNumber: 366,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flex: 1,
                    overflow: 'hidden'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '200px',
                            borderRight: '1px solid var(--panel-border)',
                            background: 'var(--panel)',
                            padding: '12px',
                            overflowY: 'auto'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px',
                                    padding: '0 8px'
                                },
                                children: "分析メニュー"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                lineNumber: 437,
                                columnNumber: 11
                            }, this),
                            L3_TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>setActiveTab(tab.id),
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 12px',
                                        borderRadius: 'var(--style-radius-md, 8px)',
                                        cursor: 'pointer',
                                        background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                        color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text)',
                                        marginBottom: '4px',
                                        transition: 'all 0.15s ease'
                                    },
                                    children: [
                                        tab.icon,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '13px',
                                                fontWeight: activeTab === tab.id ? 600 : 400
                                            },
                                            children: tab.label
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                            lineNumber: 458,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, tab.id, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                                    lineNumber: 441,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                        lineNumber: 428,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            padding: '16px',
                            overflowY: 'auto',
                            background: 'var(--bg)'
                        },
                        children: renderTabContent()
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                        lineNumber: 466,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
                lineNumber: 426,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx",
        lineNumber: 356,
        columnNumber: 5
    }, this);
}, "V6Kaln7mSC2ujOHUo3wfq4AjcOI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$analytics$2d$n3$2f$hooks$2f$use$2d$analytics$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsIntegrated"]
    ];
})), "V6Kaln7mSC2ujOHUo3wfq4AjcOI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$analytics$2d$n3$2f$hooks$2f$use$2d$analytics$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAnalyticsIntegrated"]
    ];
});
_c2 = AnalyticsN3PageLayout;
const __TURBOPACK__default__export__ = AnalyticsN3PageLayout;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "KPICard");
__turbopack_context__.k.register(_c1, "AnalyticsN3PageLayout$memo");
__turbopack_context__.k.register(_c2, "AnalyticsN3PageLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/analytics-n3/layouts/index.ts
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$analytics$2d$n3$2f$layouts$2f$analytics$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Qoo10PricingTab - Qoo10用価格計算・出品タブ
 * 
 * 機能:
 * - 利益計算（国内モール用）
 * - 価格設定
 * - 保存ボタン
 * - 出品ボタン
 * - 画像表示
 */ __turbopack_context__.s([
    "Qoo10PricingTab",
    ()=>Qoo10PricingTab,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$hooks$2f$useProductImages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/hooks/useProductImages.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// ============================================================
// 定数
// ============================================================
const QOO10_FEE_RATE = 0.12; // 販売手数料 12%
const QOO10_PAYMENT_RATE = 0.035; // 決済手数料 3.5%
const DEFAULT_SHIPPING_COST = 500; // デフォルト送料
const Qoo10PricingTab = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function Qoo10PricingTab(param) {
    let { product, onSave, onListToQoo10, isReadOnly = false } = param;
    _s();
    // 画像取得
    const { mainImage, allImages, hasImages } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$hooks$2f$useProductImages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductImages"])(product);
    // 状態管理
    const [calculating, setCalculating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [listing, setListing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // フォームデータ
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Qoo10PricingTab.Qoo10PricingTab.useState": ()=>{
            var _product_marketplace_listings;
            const existing = (_product_marketplace_listings = product.marketplace_listings) === null || _product_marketplace_listings === void 0 ? void 0 : _product_marketplace_listings.qoo10_jp;
            return {
                price_jpy: (existing === null || existing === void 0 ? void 0 : existing.price_jpy) || 0,
                profit_jpy: (existing === null || existing === void 0 ? void 0 : existing.profit_jpy) || 0,
                profit_margin: (existing === null || existing === void 0 ? void 0 : existing.profit_margin) || 0,
                shipping_cost: (existing === null || existing === void 0 ? void 0 : existing.shipping_cost) || DEFAULT_SHIPPING_COST,
                platform_fee: (existing === null || existing === void 0 ? void 0 : existing.platform_fee) || 0,
                payment_fee: (existing === null || existing === void 0 ? void 0 : existing.payment_fee) || 0,
                status: (existing === null || existing === void 0 ? void 0 : existing.status) || 'none',
                last_calculated_at: existing === null || existing === void 0 ? void 0 : existing.last_calculated_at,
                listed_at: existing === null || existing === void 0 ? void 0 : existing.listed_at,
                listing_id: existing === null || existing === void 0 ? void 0 : existing.listing_id,
                error_message: existing === null || existing === void 0 ? void 0 : existing.error_message
            };
        }
    }["Qoo10PricingTab.Qoo10PricingTab.useState"]);
    // 利益計算
    const calculateProfit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Qoo10PricingTab.Qoo10PricingTab.useCallback[calculateProfit]": async ()=>{
            setCalculating(true);
            setError(null);
            setSuccess(null);
            try {
                var _data_results;
                const costJpy = product.price_jpy || product.cost_price || 0;
                const weightG = product.weight_g || 500;
                if (costJpy <= 0) {
                    throw new Error('仕入れ価格が設定されていません');
                }
                // APIで計算
                const response = await fetch('/api/v2/pricing/multi-marketplace', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        costPriceJpy: costJpy,
                        weightGrams: weightG,
                        targetMarketplaces: [
                            'qoo10_jp'
                        ],
                        targetMargin: 15
                    })
                });
                const data = await response.json();
                if (data.success && ((_data_results = data.results) === null || _data_results === void 0 ? void 0 : _data_results[0])) {
                    const result = data.results[0];
                    setFormData({
                        "Qoo10PricingTab.Qoo10PricingTab.useCallback[calculateProfit]": (prev)=>{
                            var _result_costBreakdown, _result_costBreakdown1;
                            return {
                                ...prev,
                                price_jpy: Math.round(result.suggestedPrice),
                                profit_jpy: Math.round(result.profitJpy),
                                profit_margin: result.profitMargin,
                                platform_fee: Math.round(((_result_costBreakdown = result.costBreakdown) === null || _result_costBreakdown === void 0 ? void 0 : _result_costBreakdown.platformFee) || 0),
                                payment_fee: Math.round(((_result_costBreakdown1 = result.costBreakdown) === null || _result_costBreakdown1 === void 0 ? void 0 : _result_costBreakdown1.paymentFee) || 0),
                                status: result.isProfitable ? 'calculated' : 'error',
                                last_calculated_at: new Date().toISOString(),
                                error_message: result.isProfitable ? undefined : '利益率が低すぎます'
                            };
                        }
                    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[calculateProfit]"]);
                    setSuccess('利益計算が完了しました');
                } else {
                    throw new Error(data.error || '計算に失敗しました');
                }
            } catch (e) {
                setError(e.message);
            } finally{
                setCalculating(false);
            }
        }
    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[calculateProfit]"], [
        product
    ]);
    // 手動で価格変更時の再計算
    const recalculateFromPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Qoo10PricingTab.Qoo10PricingTab.useCallback[recalculateFromPrice]": (newPrice)=>{
            const costJpy = product.price_jpy || product.cost_price || 0;
            const shippingCost = formData.shipping_cost;
            const platformFee = Math.round(newPrice * QOO10_FEE_RATE);
            const paymentFee = Math.round(newPrice * QOO10_PAYMENT_RATE);
            const totalCost = costJpy + shippingCost + platformFee + paymentFee;
            const profitJpy = newPrice - totalCost;
            const profitMargin = newPrice > 0 ? profitJpy / newPrice * 100 : 0;
            setFormData({
                "Qoo10PricingTab.Qoo10PricingTab.useCallback[recalculateFromPrice]": (prev)=>({
                        ...prev,
                        price_jpy: newPrice,
                        profit_jpy: profitJpy,
                        profit_margin: profitMargin,
                        platform_fee: platformFee,
                        payment_fee: paymentFee,
                        status: profitJpy > 0 ? 'calculated' : 'error'
                    })
            }["Qoo10PricingTab.Qoo10PricingTab.useCallback[recalculateFromPrice]"]);
        }
    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[recalculateFromPrice]"], [
        product,
        formData.shipping_cost
    ]);
    // 保存
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Qoo10PricingTab.Qoo10PricingTab.useCallback[handleSave]": async ()=>{
            setSaving(true);
            setError(null);
            setSuccess(null);
            try {
                // marketplace_listings APIで保存
                const response = await fetch('/api/v2/marketplace-listings/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: product.id,
                        marketplace: 'qoo10_jp',
                        data: {
                            ...formData,
                            status: formData.profit_jpy > 0 ? 'ready' : 'error'
                        }
                    })
                });
                const result = await response.json();
                if (result.success) {
                    setFormData({
                        "Qoo10PricingTab.Qoo10PricingTab.useCallback[handleSave]": (prev)=>({
                                ...prev,
                                status: 'ready'
                            })
                    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[handleSave]"]);
                    setSuccess('保存しました');
                    onSave === null || onSave === void 0 ? void 0 : onSave({
                        marketplace_listings: {
                            ...product.marketplace_listings,
                            qoo10_jp: formData
                        }
                    });
                } else {
                    throw new Error(result.error || '保存に失敗しました');
                }
            } catch (e) {
                setError(e.message);
            } finally{
                setSaving(false);
            }
        }
    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[handleSave]"], [
        product.id,
        formData,
        onSave,
        product.marketplace_listings
    ]);
    // Qoo10に出品
    const handleListToQoo10 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Qoo10PricingTab.Qoo10PricingTab.useCallback[handleListToQoo10]": async ()=>{
            if (formData.status !== 'ready' && formData.status !== 'calculated') {
                setError('先に計算と保存を行ってください');
                return;
            }
            setListing(true);
            setError(null);
            setSuccess(null);
            try {
                var _product_listing_data, _product_listing_data1;
                const response = await fetch('/api/v2/listing/qoo10', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: product.id,
                        itemTitle: product.title_ja || product.title_en || 'Untitled',
                        itemDetail: ((_product_listing_data = product.listing_data) === null || _product_listing_data === void 0 ? void 0 : _product_listing_data.description_ja) || product.title_ja || '',
                        sellerCode: product.sku || "SKU-".concat(product.id),
                        secondCategoryCode: ((_product_listing_data1 = product.listing_data) === null || _product_listing_data1 === void 0 ? void 0 : _product_listing_data1.qoo10_category) || '001001001',
                        itemPrice: formData.price_jpy,
                        itemQty: 1,
                        shippingNo: '1',
                        imageUrl: mainImage || '',
                        optionImageUrls: allImages.slice(1, 10)
                    })
                });
                const result = await response.json();
                if (result.success) {
                    setFormData({
                        "Qoo10PricingTab.Qoo10PricingTab.useCallback[handleListToQoo10]": (prev)=>({
                                ...prev,
                                status: 'listed',
                                listed_at: new Date().toISOString(),
                                listing_id: result.itemCode
                            })
                    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[handleListToQoo10]"]);
                    setSuccess("Qoo10に出品しました (商品コード: ".concat(result.itemCode, ")"));
                    onListToQoo10 === null || onListToQoo10 === void 0 ? void 0 : onListToQoo10(product);
                } else {
                    throw new Error(result.error || '出品に失敗しました');
                }
            } catch (e) {
                setError(e.message);
            } finally{
                setListing(false);
            }
        }
    }["Qoo10PricingTab.Qoo10PricingTab.useCallback[handleListToQoo10]"], [
        product,
        formData,
        mainImage,
        allImages,
        onListToQoo10
    ]);
    // ステータスバッジ
    const getStatusBadge = ()=>{
        const statusConfig = {
            none: {
                label: '未計算',
                color: '#94a3b8',
                bg: '#f1f5f9'
            },
            calculated: {
                label: '計算済み',
                color: '#3b82f6',
                bg: '#dbeafe'
            },
            ready: {
                label: '出品準備完了',
                color: '#f59e0b',
                bg: '#fef3c7'
            },
            listed: {
                label: '出品中',
                color: '#22c55e',
                bg: '#dcfce7'
            },
            error: {
                label: 'エラー',
                color: '#ef4444',
                bg: '#fee2e2'
            }
        };
        const config = statusConfig[formData.status];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                color: config.color,
                background: config.bg,
                borderRadius: '4px'
            },
            children: config.label
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
            lineNumber: 286,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '16px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                size: 20,
                                style: {
                                    color: '#ff0066'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 304,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                style: {
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    margin: 0
                                },
                                children: "Qoo10 出品設定"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 305,
                                columnNumber: 11
                            }, this),
                            getStatusBadge()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                        lineNumber: 303,
                        columnNumber: 9
                    }, this),
                    formData.listed_at && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '11px',
                            color: '#64748b'
                        },
                        children: [
                            "出品日: ",
                            new Date(formData.listed_at).toLocaleDateString('ja-JP')
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                        lineNumber: 309,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    color: '#dc2626',
                    fontSize: '13px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        size: 16
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                        lineNumber: 328,
                        columnNumber: 11
                    }, this),
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                lineNumber: 317,
                columnNumber: 9
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: '#dcfce7',
                    border: '1px solid #bbf7d0',
                    borderRadius: '6px',
                    color: '#15803d',
                    fontSize: '13px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                        size: 16
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                        lineNumber: 344,
                        columnNumber: 11
                    }, this),
                    success
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                lineNumber: 333,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr',
                    gap: '24px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                style: {
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: '#64748b'
                                },
                                children: "商品画像"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 353,
                                columnNumber: 11
                            }, this),
                            hasImages ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '1px solid #e2e8f0'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: mainImage || '',
                                    alt: product.title_ja || 'Product',
                                    style: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                    lineNumber: 362,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '200px',
                                    height: '200px',
                                    borderRadius: '8px',
                                    border: '2px dashed #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#94a3b8'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                        size: 32
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 380,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '11px',
                                            marginTop: '8px'
                                        },
                                        children: "画像なし"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 381,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 369,
                                columnNumber: 13
                            }, this),
                            allImages.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '4px',
                                    flexWrap: 'wrap'
                                },
                                children: [
                                    allImages.slice(1, 5).map((url, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: '46px',
                                                height: '46px',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                                border: '1px solid #e2e8f0'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: url,
                                                alt: "",
                                                style: {
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 397,
                                                columnNumber: 19
                                            }, this)
                                        }, idx, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                            lineNumber: 387,
                                            columnNumber: 17
                                        }, this)),
                                    allImages.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '46px',
                                            height: '46px',
                                            borderRadius: '4px',
                                            background: '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '11px',
                                            color: '#64748b'
                                        },
                                        children: [
                                            "+",
                                            allImages.length - 5
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 401,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 385,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                        lineNumber: 352,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: '#64748b'
                                                },
                                                children: "仕入れ価格"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 428,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '18px',
                                                    fontWeight: 700,
                                                    color: '#1e293b'
                                                },
                                                children: [
                                                    "¥",
                                                    (product.price_jpy || product.cost_price || 0).toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 429,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 427,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: '#64748b'
                                                },
                                                children: "送料"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 434,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '18px',
                                                    fontWeight: 700,
                                                    color: '#1e293b'
                                                },
                                                children: [
                                                    "¥",
                                                    formData.shipping_cost.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 435,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 433,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: '#64748b'
                                                },
                                                children: "重量"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 440,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '18px',
                                                    fontWeight: 700,
                                                    color: '#1e293b'
                                                },
                                                children: [
                                                    product.weight_g || 500,
                                                    "g"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 441,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 439,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 422,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: '#64748b',
                                            marginBottom: '4px',
                                            display: 'block'
                                        },
                                        children: "販売価格（税込）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 449,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '20px',
                                                    fontWeight: 700,
                                                    color: '#64748b'
                                                },
                                                children: "¥"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 453,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: formData.price_jpy || '',
                                                onChange: (e)=>recalculateFromPrice(parseInt(e.target.value) || 0),
                                                disabled: isReadOnly,
                                                style: {
                                                    width: '150px',
                                                    padding: '8px 12px',
                                                    fontSize: '20px',
                                                    fontWeight: 700,
                                                    border: '2px solid #e2e8f0',
                                                    borderRadius: '6px',
                                                    outline: 'none'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 454,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: calculateProfit,
                                                disabled: calculating,
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '8px 16px',
                                                    background: '#ff0066',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    cursor: calculating ? 'not-allowed' : 'pointer',
                                                    opacity: calculating ? 0.7 : 1
                                                },
                                                children: [
                                                    calculating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        size: 16,
                                                        className: "animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                        lineNumber: 487,
                                                        columnNumber: 32
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                        lineNumber: 487,
                                                        columnNumber: 81
                                                    }, this),
                                                    "自動計算"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 469,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 452,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 448,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: '12px',
                                    padding: '12px',
                                    background: '#f8fafc',
                                    borderRadius: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: '#64748b'
                                                },
                                                children: "販売手数料 (12%)"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 503,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 600
                                                },
                                                children: [
                                                    "¥",
                                                    formData.platform_fee.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 504,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 502,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: '#64748b'
                                                },
                                                children: "決済手数料 (3.5%)"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 507,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 600
                                                },
                                                children: [
                                                    "¥",
                                                    formData.payment_fee.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 508,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 506,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: '#64748b'
                                                },
                                                children: "利益額"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 511,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    color: formData.profit_jpy >= 0 ? '#22c55e' : '#ef4444'
                                                },
                                                children: [
                                                    "¥",
                                                    formData.profit_jpy.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 512,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 510,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: '#64748b'
                                                },
                                                children: "利益率"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 521,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    color: formData.profit_margin >= 15 ? '#22c55e' : formData.profit_margin >= 10 ? '#f59e0b' : '#ef4444'
                                                },
                                                children: [
                                                    formData.profit_margin.toFixed(1),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 522,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 520,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 494,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '12px',
                                    marginTop: 'auto'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleSave,
                                        disabled: saving || formData.status === 'none',
                                        style: {
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            padding: '12px',
                                            background: formData.status !== 'none' ? '#3b82f6' : '#e2e8f0',
                                            color: formData.status !== 'none' ? 'white' : '#94a3b8',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: saving || formData.status === 'none' ? 'not-allowed' : 'pointer'
                                        },
                                        children: [
                                            saving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                size: 18,
                                                className: "animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 553,
                                                columnNumber: 25
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 553,
                                                columnNumber: 74
                                            }, this),
                                            "保存"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 534,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleListToQoo10,
                                        disabled: listing || formData.status === 'listed' || formData.status !== 'ready' && formData.status !== 'calculated',
                                        style: {
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            padding: '12px',
                                            background: formData.status === 'listed' ? '#22c55e' : '#ff0066',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            cursor: listing || formData.status === 'listed' ? 'not-allowed' : 'pointer',
                                            opacity: formData.status === 'listed' ? 0.7 : 1
                                        },
                                        children: [
                                            listing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                size: 18,
                                                className: "animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 577,
                                                columnNumber: 17
                                            }, this) : formData.status === 'listed' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 579,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                                lineNumber: 581,
                                                columnNumber: 17
                                            }, this),
                                            formData.status === 'listed' ? '出品済み' : 'Qoo10に出品'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                        lineNumber: 556,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                                lineNumber: 533,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                        lineNumber: 420,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
                lineNumber: 350,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/domestic-tab/qoo10-pricing-tab.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, this);
}, "vUhttj/nOBzScumLbpHl1iz5zDw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$hooks$2f$useProductImages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductImages"]
    ];
})), "vUhttj/nOBzScumLbpHl1iz5zDw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$hooks$2f$useProductImages$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductImages"]
    ];
});
_c1 = Qoo10PricingTab;
const __TURBOPACK__default__export__ = Qoo10PricingTab;
var _c, _c1;
__turbopack_context__.k.register(_c, "Qoo10PricingTab$memo");
__turbopack_context__.k.register(_c1, "Qoo10PricingTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/analytics-n3/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/analytics-n3/page.tsx
/**
 * Analytics N3 - 分析ダッシュボード統合ページ
 * 売上・利益・AI品質管理を一元表示
 */ __turbopack_context__.s([
    "default",
    ()=>AnalyticsN3Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$analytics$2d$n3$2f$layouts$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$analytics$2d$n3$2f$layouts$2f$analytics$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/analytics-n3/layouts/analytics-n3-page-layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$loading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-loading.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-section.tsx [app-client] (ecmascript)");
;
;
;
;
;
function AnalyticsLoading() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Flex"], {
        direction: "column",
        justify: "center",
        align: "center",
        style: {
            height: '100%',
            background: 'var(--bg)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$loading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Loading"], {
            size: "lg",
            text: "読み込み中...",
            centered: true
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/page.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/page.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = AnalyticsLoading;
function AnalyticsN3Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Flex"], {
        "data-theme": "dark",
        direction: "column",
        gap: "none",
        style: {
            height: 'calc(100vh - 60px)',
            overflow: 'hidden'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AnalyticsLoading, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/page.tsx",
                lineNumber: 34,
                columnNumber: 27
            }, void 0),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$analytics$2d$n3$2f$layouts$2f$analytics$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnalyticsN3PageLayout"], {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/page.tsx",
                lineNumber: 35,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/page.tsx",
            lineNumber: 34,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/analytics-n3/page.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
_c1 = AnalyticsN3Page;
var _c, _c1;
__turbopack_context__.k.register(_c, "AnalyticsLoading");
__turbopack_context__.k.register(_c1, "AnalyticsN3Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/analytics-n3/page.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/n3-frontend_vps/app/tools/analytics-n3/page.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_71d171ba._.js.map