(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/lib/supabase.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @deprecated このファイルは廃止予定です。代わりに '@/lib/supabase/client' を使用してください。
 * このファイルは既存のインポートとの互換性のために残されています。
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/client.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabShipping",
    ()=>TabShipping
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// TabShipping - V11.0
// 🔥 ebay_shipping_masterテーブルから配送ポリシー取得（1200件）
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
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
    error: '#ef4444'
};
const SHIPPING_SERVICES = [
    {
        code: 'ExpeditedShippingFromOutsideUS',
        name: 'Expedited Shipping',
        nameJa: '速達配送',
        days: '1-4',
        category: 'expedited'
    },
    {
        code: 'StandardShippingFromOutsideUS',
        name: 'Standard Shipping',
        nameJa: '標準配送',
        days: '5-10',
        category: 'standard'
    },
    {
        code: 'eBaySpeedPAKEconomy',
        name: 'eBay SpeedPAK Economy',
        nameJa: 'SpeedPAK',
        days: '8-12',
        category: 'economy'
    },
    {
        code: 'EconomyShippingFromOutsideUS',
        name: 'Economy Shipping',
        nameJa: 'エコノミー',
        days: '11-23',
        category: 'economy'
    }
];
function TabShipping(param) {
    let { product, marketplace, marketplaceName, onRefresh } = param;
    var _this, _scraped_data, _this1, _this2, _this3, _this4, _this5;
    _s();
    const [selectedService, setSelectedService] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedPolicy, setSelectedPolicy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [policies, setPolicies] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [calculating, setCalculating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [totalCount, setTotalCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const listingData = ((_this = product) === null || _this === void 0 ? void 0 : _this.listing_data) || {};
    const weight = listingData.weight_g || ((_this1 = product) === null || _this1 === void 0 ? void 0 : (_scraped_data = _this1.scraped_data) === null || _scraped_data === void 0 ? void 0 : _scraped_data.weight_g) || ((_this2 = product) === null || _this2 === void 0 ? void 0 : _this2.weight_g) || 0;
    const dimensions = {
        l: listingData.length_cm || 0,
        w: listingData.width_cm || 0,
        h: listingData.height_cm || 0
    };
    const autoSelectedPolicy = {
        name: listingData.usa_shipping_policy_name || ((_this3 = product) === null || _this3 === void 0 ? void 0 : _this3.shipping_policy) || '',
        shippingCost: listingData.shipping_cost_usd || ((_this4 = product) === null || _this4 === void 0 ? void 0 : _this4.shipping_cost_usd) || 0,
        ddpPrice: listingData.ddp_price_usd || ((_this5 = product) === null || _this5 === void 0 ? void 0 : _this5.ddp_price_usd) || 0,
        carrierName: listingData.carrier_name || '',
        serviceName: listingData.carrier_service || ''
    };
    // 🔥 ebay_shipping_masterから配送ポリシー取得
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabShipping.useEffect": ()=>{
            async function loadShippingPolicies() {
                try {
                    setLoading(true);
                    const weightKg = Math.max(weight / 1000, 0.001);
                    // 総件数取得
                    const { count } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('ebay_shipping_master').select('*', {
                        count: 'exact',
                        head: true
                    }).eq('country_code', 'US');
                    setTotalCount(count || 0);
                    // 重量帯に合うポリシー取得
                    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('ebay_shipping_master').select('*').eq('country_code', 'US').lte('weight_from_kg', weightKg).gte('weight_to_kg', weightKg).order('shipping_cost_with_margin_usd', {
                        ascending: true
                    }).limit(50);
                    if (error) {
                        console.error('[TabShipping] ebay_shipping_master取得エラー:', error);
                    } else {
                        setPolicies(data || []);
                        console.log("[TabShipping] 配送ポリシー取得: ".concat((data === null || data === void 0 ? void 0 : data.length) || 0, "件 (重量: ").concat(weightKg, "kg, 全").concat(count, "件中)"));
                    }
                    if (listingData.shipping_service) {
                        setSelectedService(listingData.shipping_service);
                    }
                } catch (err) {
                    console.error('[TabShipping] データ取得エラー:', err);
                } finally{
                    setLoading(false);
                }
            }
            loadShippingPolicies();
        }
    }["TabShipping.useEffect"], [
        weight
    ]);
    const weightKg = weight / 1000;
    const filteredPolicies = policies.filter((policy)=>{
        if (searchTerm) {
            var _policy_service_name, _policy_carrier_name, _policy_service_code;
            const term = searchTerm.toLowerCase();
            return ((_policy_service_name = policy.service_name) === null || _policy_service_name === void 0 ? void 0 : _policy_service_name.toLowerCase().includes(term)) || ((_policy_carrier_name = policy.carrier_name) === null || _policy_carrier_name === void 0 ? void 0 : _policy_carrier_name.toLowerCase().includes(term)) || ((_policy_service_code = policy.service_code) === null || _policy_service_code === void 0 ? void 0 : _policy_service_code.toLowerCase().includes(term));
        }
        return true;
    });
    const handleCalculateProfit = async ()=>{
        if (!(product === null || product === void 0 ? void 0 : product.id)) return;
        setCalculating(true);
        try {
            var _data_errors;
            const res = await fetch('/api/tools/profit-calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productIds: [
                        String(product.id)
                    ],
                    forceZeroCost: true
                })
            });
            const data = await res.json();
            if (data.updated > 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('✅ 利益計算完了！配送ポリシー自動選択されました');
                onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
            } else if (((_data_errors = data.errors) === null || _data_errors === void 0 ? void 0 : _data_errors.length) > 0) {
                throw new Error(data.errors[0].error);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('計算完了しましたが更新はありませんでした');
            }
        } catch (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("エラー: ".concat(err.message));
        } finally{
            setCalculating(false);
        }
    };
    const handleUsePolicy = async (policy)=>{
        if (!(product === null || product === void 0 ? void 0 : product.id)) return;
        try {
            setSaving(true);
            const shippingCost = parseFloat(policy.shipping_cost_with_margin_usd) || 0;
            const baseRate = parseFloat(policy.base_rate_usd) || shippingCost;
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('products_master').update({
                listing_data: {
                    ...listingData,
                    shipping_policy_id: policy.id,
                    usa_shipping_policy_name: policy.service_name,
                    shipping_service: policy.service_name,
                    carrier_name: policy.carrier_name,
                    carrier_service: policy.service_code,
                    base_shipping_usd: baseRate,
                    shipping_cost_usd: shippingCost,
                    shipping_cost_calculated: true
                },
                shipping_policy: policy.service_name,
                shipping_cost_usd: shippingCost,
                updated_at: new Date().toISOString()
            }).eq('id', product.id);
            if (error) throw error;
            setSelectedPolicy(String(policy.id));
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("✓ ".concat(policy.service_name, " を適用しました ($").concat(shippingCost, ")"));
            onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
        } catch (err) {
            console.error('ポリシー適用エラー:', err);
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('適用に失敗しました');
        } finally{
            setSaving(false);
        }
    };
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '2rem',
                textAlign: 'center',
                color: T.textMuted
            },
            children: "商品データがありません"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
            lineNumber: 198,
            columnNumber: 12
        }, this);
    }
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                            title: "📦 Package Info",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: '0.5rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                                            label: "重量",
                                            value: "".concat(weight, "g"),
                                            highlight: weight > 0
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                            lineNumber: 209,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                                            label: "長さ",
                                            value: "".concat(dimensions.l, "cm")
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                            lineNumber: 210,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                                            label: "幅",
                                            value: "".concat(dimensions.w, "cm")
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                            lineNumber: 211,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                                            label: "高さ",
                                            value: "".concat(dimensions.h, "cm")
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                            lineNumber: 212,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                    lineNumber: 208,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        marginTop: '0.5rem',
                                        fontSize: '9px',
                                        color: T.textMuted
                                    },
                                    children: [
                                        "重量帯: ",
                                        weightKg.toFixed(3),
                                        " kg"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                            title: "✅ 現在の配送設定（利益計算で自動選択）",
                            children: [
                                autoSelectedPolicy.name ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.5rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: '0.75rem',
                                                borderRadius: '6px',
                                                background: "".concat(T.success, "15"),
                                                border: "2px solid ".concat(T.success)
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        color: T.success
                                                    },
                                                    children: autoSelectedPolicy.name
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                    lineNumber: 226,
                                                    columnNumber: 19
                                                }, this),
                                                autoSelectedPolicy.carrierName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '10px',
                                                        color: T.textMuted,
                                                        marginTop: '0.25rem'
                                                    },
                                                    children: [
                                                        autoSelectedPolicy.carrierName,
                                                        " - ",
                                                        autoSelectedPolicy.serviceName
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                            lineNumber: 222,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(2, 1fr)',
                                                gap: '0.5rem'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                                                    label: "送料",
                                                    value: "$".concat(autoSelectedPolicy.shippingCost.toFixed(2)),
                                                    color: T.accent,
                                                    highlight: true
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                                                    label: "DDP価格",
                                                    value: "$".concat(autoSelectedPolicy.ddpPrice.toFixed(2)),
                                                    color: T.success,
                                                    highlight: true
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                    lineNumber: 237,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                            lineNumber: 235,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                    lineNumber: 221,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '1rem',
                                        textAlign: 'center',
                                        color: T.warning,
                                        fontSize: '11px'
                                    },
                                    children: [
                                        "⚠️ 配送ポリシーが未選択です",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                            lineNumber: 242,
                                            columnNumber: 32
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '10px',
                                                color: T.textMuted
                                            },
                                            children: "「利益計算を実行」で自動選択されます"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                            lineNumber: 243,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                    lineNumber: 241,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleCalculateProfit,
                                    disabled: calculating,
                                    style: {
                                        marginTop: '0.75rem',
                                        width: '100%',
                                        padding: '0.5rem 1rem',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        borderRadius: '4px',
                                        border: 'none',
                                        background: T.accent,
                                        color: '#fff',
                                        cursor: calculating ? 'wait' : 'pointer',
                                        opacity: calculating ? 0.7 : 1
                                    },
                                    children: calculating ? '⏳ 計算中...' : '🔄 利益計算を実行（配送ポリシー自動選択）'
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                    lineNumber: 249,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                            lineNumber: 219,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                            title: "🚀 Shipping Service",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.375rem'
                                },
                                children: SHIPPING_SERVICES.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>setSelectedService(service.code),
                                        style: {
                                            padding: '0.5rem',
                                            borderRadius: '4px',
                                            background: selectedService === service.code ? "".concat(T.accent, "15") : T.highlight,
                                            border: "1px solid ".concat(selectedService === service.code ? T.accent : 'transparent'),
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.text
                                                        },
                                                        children: service.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                        lineNumber: 273,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '8px',
                                                            color: T.textMuted
                                                        },
                                                        children: service.nameJa
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                        lineNumber: 274,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                lineNumber: 272,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '9px',
                                                    fontWeight: 600,
                                                    color: service.category === 'expedited' ? T.error : service.category === 'standard' ? T.accent : T.success,
                                                    background: "".concat(service.category === 'expedited' ? T.error : service.category === 'standard' ? T.accent : T.success, "15"),
                                                    padding: '0.125rem 0.375rem',
                                                    borderRadius: '3px'
                                                },
                                                children: [
                                                    service.days,
                                                    " days"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                lineNumber: 276,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, service.code, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                        lineNumber: 264,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                lineNumber: 262,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                            lineNumber: 261,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                    lineNumber: 206,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '0.5rem',
                                alignItems: 'center'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "キャリア・サービス名で検索...",
                                    value: searchTerm,
                                    onChange: (e)=>setSearchTerm(e.target.value),
                                    style: {
                                        flex: 1,
                                        padding: '0.375rem 0.5rem',
                                        fontSize: '10px',
                                        border: "1px solid ".concat(T.panelBorder),
                                        borderRadius: '4px',
                                        background: T.panel
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                    lineNumber: 293,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '9px',
                                        color: T.textMuted
                                    },
                                    children: [
                                        filteredPolicies.length,
                                        " / ",
                                        policies.length,
                                        "件 (全",
                                        totalCount,
                                        "件)"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                    lineNumber: 300,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                            lineNumber: 292,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                            title: "📋 ebay_shipping_master (US, ".concat(weightKg.toFixed(3), "kg)"),
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '1rem',
                                    textAlign: 'center',
                                    color: T.textMuted,
                                    fontSize: '10px'
                                },
                                children: "⏳ ポリシーを読み込み中..."
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                lineNumber: 307,
                                columnNumber: 15
                            }, this) : filteredPolicies.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '1rem',
                                    textAlign: 'center',
                                    color: T.textMuted,
                                    fontSize: '10px'
                                },
                                children: [
                                    "該当する配送ポリシーがありません",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                        lineNumber: 312,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '9px'
                                        },
                                        children: [
                                            "（重量: ",
                                            weightKg,
                                            "kg に対応するデータがありません）"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                        lineNumber: 313,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                lineNumber: 311,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    maxHeight: '400px',
                                    overflow: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.375rem'
                                },
                                children: filteredPolicies.map((policy)=>{
                                    const isAutoSelected = autoSelectedPolicy.name === policy.service_name;
                                    const isManualSelected = selectedPolicy === String(policy.id);
                                    const shippingCost = parseFloat(policy.shipping_cost_with_margin_usd) || 0;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '0.5rem',
                                            borderRadius: '4px',
                                            background: isAutoSelected ? "".concat(T.success, "15") : isManualSelected ? "".concat(T.accent, "15") : T.highlight,
                                            border: "1px solid ".concat(isAutoSelected ? T.success : isManualSelected ? T.accent : 'transparent')
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        flex: 1
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.5rem'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: '10px',
                                                                        fontWeight: 600,
                                                                        color: T.text
                                                                    },
                                                                    children: policy.service_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                                    lineNumber: 333,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: '8px',
                                                                        padding: '1px 4px',
                                                                        borderRadius: '2px',
                                                                        background: policy.service_type === 'Express' ? "".concat(T.error, "20") : "".concat(T.success, "20"),
                                                                        color: policy.service_type === 'Express' ? T.error : T.success
                                                                    },
                                                                    children: policy.service_type
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                                    lineNumber: 336,
                                                                    columnNumber: 29
                                                                }, this),
                                                                isAutoSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: '8px',
                                                                        padding: '1px 4px',
                                                                        borderRadius: '2px',
                                                                        background: T.success,
                                                                        color: 'white'
                                                                    },
                                                                    children: "自動選択"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                                    lineNumber: 343,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                            lineNumber: 332,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '8px',
                                                                color: T.textMuted,
                                                                marginTop: '0.125rem'
                                                            },
                                                            children: [
                                                                policy.carrier_name,
                                                                " | 重量: ",
                                                                policy.weight_from_kg,
                                                                "-",
                                                                policy.weight_to_kg,
                                                                "kg |",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                    style: {
                                                                        color: T.accent
                                                                    },
                                                                    children: [
                                                                        "$",
                                                                        shippingCost.toFixed(2)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                                    lineNumber: 351,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                            lineNumber: 348,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                    lineNumber: 331,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleUsePolicy(policy),
                                                    disabled: saving,
                                                    style: {
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '9px',
                                                        fontWeight: 600,
                                                        borderRadius: '3px',
                                                        border: 'none',
                                                        background: isAutoSelected || isManualSelected ? T.success : T.accent,
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        opacity: saving ? 0.7 : 1
                                                    },
                                                    children: isAutoSelected || isManualSelected ? '✓ 適用中' : '使う'
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                                    lineNumber: 354,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                            lineNumber: 330,
                                            columnNumber: 23
                                        }, this)
                                    }, policy.id, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                        lineNumber: 323,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                                lineNumber: 316,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                            lineNumber: 305,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                    lineNumber: 291,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
            lineNumber: 203,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
        lineNumber: 202,
        columnNumber: 5
    }, this);
}
_s(TabShipping, "ZPmdZ3HIX6136tFnYAkSXuzzSyE=");
_c = TabShipping;
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
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                lineNumber: 380,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
        lineNumber: 379,
        columnNumber: 5
    }, this);
}
_c1 = Card;
function StatBox(param) {
    let { label, value, color, highlight } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '0.375rem',
            borderRadius: '4px',
            background: highlight ? "".concat(T.accent, "10") : T.highlight,
            textAlign: 'center',
            border: highlight ? "1px solid ".concat(T.accent, "30") : 'none'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '7px',
                    textTransform: 'uppercase',
                    color: T.textSubtle
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                lineNumber: 395,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '10px',
                    fontWeight: 700,
                    color: color || T.text
                },
                children: value
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
                lineNumber: 396,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx",
        lineNumber: 390,
        columnNumber: 5
    }, this);
}
_c2 = StatBox;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "TabShipping");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "StatBox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_e250859a._.js.map