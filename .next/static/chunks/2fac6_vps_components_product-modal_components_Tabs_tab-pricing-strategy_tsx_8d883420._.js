(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabPricingStrategy",
    ()=>TabPricingStrategy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// TabPricingStrategy - V8.4
// デザインシステムV4準拠
// 機能: 15価格戦略表示、選択、適用 + 利益計算結果表示
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
    error: '#ef4444',
    purple: '#7c3aed'
};
const STRATEGIES = [
    {
        id: 'lowest',
        label: 'Lowest Price',
        desc: '最安値に合わせる',
        icon: 'fa-arrow-down',
        color: T.accent
    },
    {
        id: 'lowest-5',
        label: 'Lowest -5%',
        desc: '最安値より5%低く',
        icon: 'fa-minus',
        color: T.success
    },
    {
        id: 'lowest+5',
        label: 'Lowest +5%',
        desc: '最安値より5%高く',
        icon: 'fa-plus',
        color: T.warning
    },
    {
        id: 'average',
        label: 'Average Price',
        desc: '平均価格に合わせる',
        icon: 'fa-equals',
        color: T.purple
    },
    {
        id: 'avg-10',
        label: 'Average -10%',
        desc: '平均より10%低く',
        icon: 'fa-minus',
        color: T.success
    },
    {
        id: 'avg+10',
        label: 'Average +10%',
        desc: '平均より10%高く',
        icon: 'fa-plus',
        color: T.warning
    },
    {
        id: 'margin-15',
        label: '15% Margin',
        desc: '利益率15%確保',
        icon: 'fa-percentage',
        color: T.success
    },
    {
        id: 'margin-20',
        label: '20% Margin',
        desc: '利益率20%確保',
        icon: 'fa-percentage',
        color: T.success
    },
    {
        id: 'margin-25',
        label: '25% Margin',
        desc: '利益率25%確保',
        icon: 'fa-percentage',
        color: T.success
    },
    {
        id: 'undercut-1',
        label: 'Undercut $1',
        desc: '最安値-$1',
        icon: 'fa-dollar-sign',
        color: T.accent
    },
    {
        id: 'undercut-5',
        label: 'Undercut $5',
        desc: '最安値-$5',
        icon: 'fa-dollar-sign',
        color: T.accent
    },
    {
        id: 'premium',
        label: 'Premium',
        desc: '最高価格帯',
        icon: 'fa-gem',
        color: T.warning
    },
    {
        id: 'competitive',
        label: 'Competitive',
        desc: '競争力重視',
        icon: 'fa-bolt',
        color: T.accent
    },
    {
        id: 'breakeven',
        label: 'Break Even',
        desc: '損益分岐点',
        icon: 'fa-balance-scale',
        color: T.textMuted
    },
    {
        id: 'custom',
        label: 'Custom',
        desc: '手動設定',
        icon: 'fa-sliders-h',
        color: T.purple
    }
];
function TabPricingStrategy(param) {
    let { product, onTabChange, onSave } = param;
    var _this, _this1, _this2, _this3, _this4, _this5, _this6, _this7, _this8, _this9, _this10, _this11, _this12, _this13, _this14, _this15, _this16, _STRATEGIES_find;
    _s();
    const [selectedStrategy, setSelectedStrategy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [applying, setApplying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [calculating, setCalculating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [profitResult, setProfitResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [customPrice, setCustomPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // 商品からの初期戦略ロード
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabPricingStrategy.useEffect": ()=>{
            if (product) {
                var _this, _this1;
                const listingData = ((_this = product) === null || _this === void 0 ? void 0 : _this.listing_data) || {};
                const savedStrategy = listingData.pricing_strategy || ((_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.pricing_strategy);
                if (savedStrategy) {
                    setSelectedStrategy(savedStrategy);
                }
            }
        }
    }["TabPricingStrategy.useEffect"], [
        product
    ]);
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '2rem',
                textAlign: 'center',
                color: T.textMuted
            },
            children: "商品データがありません"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
            lineNumber: 77,
            columnNumber: 12
        }, this);
    }
    // ✅ 送料未計算の場合はブロック画面を表示
    const listingDataCheck = ((_this = product) === null || _this === void 0 ? void 0 : _this.listing_data) || {};
    const shippingCalculatedCheck = listingDataCheck.shipping_cost_calculated === true || ((_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.shipping_cost_calculated) === true;
    const weightGCheck = listingDataCheck.weight_g || ((_this2 = product) === null || _this2 === void 0 ? void 0 : _this2.weight_g) || 0;
    const hasWeightDataCheck = weightGCheck > 0;
    var _purchase_price_jpy, _ref;
    const purchasePriceJpyCheck = (_ref = (_purchase_price_jpy = (_this3 = product) === null || _this3 === void 0 ? void 0 : _this3.purchase_price_jpy) !== null && _purchase_price_jpy !== void 0 ? _purchase_price_jpy : (_this4 = product) === null || _this4 === void 0 ? void 0 : _this4.price_jpy) !== null && _ref !== void 0 ? _ref : null;
    const hasCostDataCheck = purchasePriceJpyCheck !== null && purchasePriceJpyCheck !== undefined;
    if (!shippingCalculatedCheck) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '1.5rem',
                background: T.bg,
                height: '100%',
                overflow: 'auto'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '2rem',
                    borderRadius: '8px',
                    background: T.panel,
                    border: "2px solid ".concat(T.warning),
                    textAlign: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas fa-lock",
                        style: {
                            fontSize: '48px',
                            color: T.warning,
                            marginBottom: '1rem'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 99,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            fontSize: '16px',
                            fontWeight: 700,
                            color: T.text,
                            marginBottom: '0.5rem'
                        },
                        children: "価格戦略の選択には送料計算が必要です"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: '12px',
                            color: T.textMuted,
                            marginBottom: '1.5rem'
                        },
                        children: "正確な利益計算のために、以下のステップを完了してください。"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            maxWidth: '400px',
                            margin: '0 auto 1.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                step: 1,
                                label: "Dataタブで重さ・サイズを入力",
                                completed: hasWeightDataCheck,
                                current: !hasWeightDataCheck
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                step: 2,
                                label: "Dataタブで原価（仕入れ値）を入力",
                                completed: hasCostDataCheck,
                                current: hasWeightDataCheck && !hasCostDataCheck
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                step: 3,
                                label: "Shippingタブで送料を計算",
                                completed: shippingCalculatedCheck,
                                current: hasWeightDataCheck && hasCostDataCheck && !shippingCalculatedCheck
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 121,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StepItem, {
                                step: 4,
                                label: "Pricingタブで価格戦略を選択",
                                completed: false,
                                current: false,
                                locked: true
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '1rem',
                            borderRadius: '6px',
                            background: T.highlight,
                            marginBottom: '1rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    color: T.textMuted,
                                    marginBottom: '0.5rem'
                                },
                                children: "現在のステータス"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                    gap: '0.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusItem, {
                                        label: "重さ",
                                        value: hasWeightDataCheck ? "".concat(weightGCheck, "g") : '未入力',
                                        ok: hasWeightDataCheck
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusItem, {
                                        label: "原価",
                                        value: hasCostDataCheck ? "¥".concat((purchasePriceJpyCheck === null || purchasePriceJpyCheck === void 0 ? void 0 : purchasePriceJpyCheck.toLocaleString()) || 0) : '未入力',
                                        ok: hasCostDataCheck
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 148,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusItem, {
                                        label: "送料",
                                        value: shippingCalculatedCheck ? '計算済み' : '未計算',
                                        ok: shippingCalculatedCheck
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 149,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: '11px',
                            color: T.textSubtle
                        },
                        children: "※ 送料計算完了後、このページが有効になります"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'center',
                            marginTop: '1rem'
                        },
                        children: [
                            !hasWeightDataCheck && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onTabChange === null || onTabChange === void 0 ? void 0 : onTabChange('data'),
                                style: {
                                    padding: '0.5rem 1rem',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: T.accent,
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-arrow-right"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 176,
                                        columnNumber: 17
                                    }, this),
                                    "Dataタブへ移動"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 160,
                                columnNumber: 15
                            }, this),
                            hasWeightDataCheck && !hasCostDataCheck && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onTabChange === null || onTabChange === void 0 ? void 0 : onTabChange('data'),
                                style: {
                                    padding: '0.5rem 1rem',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: T.accent,
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-arrow-right"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 197,
                                        columnNumber: 17
                                    }, this),
                                    "Dataタブへ移動"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 181,
                                columnNumber: 15
                            }, this),
                            hasWeightDataCheck && hasCostDataCheck && !shippingCalculatedCheck && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onTabChange === null || onTabChange === void 0 ? void 0 : onTabChange('shipping'),
                                style: {
                                    padding: '0.5rem 1rem',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: T.success,
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-shipping-fast"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 218,
                                        columnNumber: 17
                                    }, this),
                                    "Shippingタブへ移動"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 202,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 158,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 92,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
            lineNumber: 91,
            columnNumber: 7
        }, this);
    }
    const smLowest = ((_this5 = product) === null || _this5 === void 0 ? void 0 : _this5.sm_lowest_price) || 0;
    const smAverage = ((_this6 = product) === null || _this6 === void 0 ? void 0 : _this6.sm_average_price) || 0;
    const smHighest = ((_this7 = product) === null || _this7 === void 0 ? void 0 : _this7.sm_highest_price) || 0;
    const currentPrice = ((_this8 = product) === null || _this8 === void 0 ? void 0 : _this8.price_usd) || 0;
    const profitMargin = ((_this9 = product) === null || _this9 === void 0 ? void 0 : _this9.profit_margin_percent) || ((_this10 = product) === null || _this10 === void 0 ? void 0 : _this10.profit_margin) || 0;
    var _purchase_price_jpy1, _ref1;
    // ✅ 原価データ（仕入れ値 + 送料 + 経費）
    const purchasePriceJpyRaw = (_ref1 = (_purchase_price_jpy1 = (_this11 = product) === null || _this11 === void 0 ? void 0 : _this11.purchase_price_jpy) !== null && _purchase_price_jpy1 !== void 0 ? _purchase_price_jpy1 : (_this12 = product) === null || _this12 === void 0 ? void 0 : _this12.price_jpy) !== null && _ref1 !== void 0 ? _ref1 : null;
    const purchasePriceJpy = purchasePriceJpyRaw !== null && purchasePriceJpyRaw !== void 0 ? purchasePriceJpyRaw : 0;
    const exchangeRate = ((_this13 = product) === null || _this13 === void 0 ? void 0 : _this13.exchange_rate) || 150;
    const purchasePriceUsd = purchasePriceJpy / exchangeRate;
    const shippingCost = ((_this14 = product) === null || _this14 === void 0 ? void 0 : _this14.shipping_cost_usd) || listingDataCheck.shipping_cost_usd || 5;
    const otherCost = ((_this15 = product) === null || _this15 === void 0 ? void 0 : _this15.other_cost_usd) || 0;
    const dutyRate = ((_this16 = product) === null || _this16 === void 0 ? void 0 : _this16.duty_rate) || 0;
    const dutyAmount = currentPrice * (dutyRate / 100);
    const ebayFeeRate = 0.13; // eBay手数料13%
    const paypalFeeRate = 0.029; // PayPal手数料2.9%
    // ✅ 原価合計（商品代 + 送料 + その他）
    const totalCost = purchasePriceUsd + shippingCost + otherCost;
    // ✅ 原価データがあるかどうか
    const hasCostData = purchasePriceJpyRaw !== null && purchasePriceJpyRaw !== undefined;
    // ✅ 価格計算関数
    const calculatePrice = (strategyId)=>{
        const totalFeeRate = ebayFeeRate + paypalFeeRate;
        const calculateMarginPrice = (marginPercent)=>{
            if (!hasCostData) return 0;
            const divisor = 1 - totalFeeRate - marginPercent / 100;
            if (divisor <= 0) return 0;
            return totalCost / divisor;
        };
        switch(strategyId){
            case 'lowest':
                return smLowest;
            case 'lowest-5':
                return smLowest * 0.95;
            case 'lowest+5':
                return smLowest * 1.05;
            case 'average':
                return smAverage;
            case 'avg-10':
                return smAverage * 0.90;
            case 'avg+10':
                return smAverage * 1.10;
            case 'undercut-1':
                return Math.max(0, smLowest - 1);
            case 'undercut-5':
                return Math.max(0, smLowest - 5);
            case 'premium':
                return smHighest * 0.95;
            case 'margin-15':
                return calculateMarginPrice(15);
            case 'margin-20':
                return calculateMarginPrice(20);
            case 'margin-25':
                return calculateMarginPrice(25);
            case 'breakeven':
                return calculateMarginPrice(0);
            case 'competitive':
                return smLowest > 0 ? smLowest * 0.98 : smAverage * 0.95;
            case 'custom':
                return parseFloat(customPrice) || currentPrice;
            default:
                return currentPrice;
        }
    };
    // ✅ 未計算かどうか判定
    const isUncalculable = (strategyId)=>{
        const needsCostData = [
            'margin-15',
            'margin-20',
            'margin-25',
            'breakeven'
        ];
        if (needsCostData.includes(strategyId) && !hasCostData) return true;
        const needsSmData = [
            'lowest',
            'lowest-5',
            'lowest+5',
            'average',
            'avg-10',
            'avg+10',
            'undercut-1',
            'undercut-5',
            'premium',
            'competitive'
        ];
        if (needsSmData.includes(strategyId) && smLowest === 0 && smAverage === 0) return true;
        return false;
    };
    // ✅ 利益計算API呼び出し
    const handleCalculateProfit = async ()=>{
        if (!(product === null || product === void 0 ? void 0 : product.id) || !selectedStrategy) {
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('戦略を選択してください');
            return;
        }
        setCalculating(true);
        try {
            const targetPrice = calculatePrice(selectedStrategy);
            const totalFeeRate = ebayFeeRate + paypalFeeRate;
            const fees = targetPrice * totalFeeRate;
            const dutyAmt = targetPrice * (dutyRate / 100);
            const profit = targetPrice - totalCost - fees - dutyAmt;
            const margin = targetPrice > 0 ? profit / targetPrice * 100 : 0;
            const breakEven = totalCost / (1 - totalFeeRate);
            const result = {
                success: true,
                suggestedPrice: targetPrice,
                breakEvenPrice: breakEven,
                expectedProfit: profit,
                profitMargin: margin,
                redFlag: profit < 0 || margin < 5,
                strategyApplied: selectedStrategy,
                details: {
                    baseCostUsd: purchasePriceUsd,
                    feesUsd: fees,
                    shippingCostUsd: shippingCost,
                    dutyAmount: dutyAmt,
                    totalCost: totalCost + fees + dutyAmt
                }
            };
            setProfitResult(result);
            if (result.redFlag) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning('⚠️ 赤字警告: この価格では利益が確保できません');
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("✅ 利益計算完了: $".concat(profit.toFixed(2), " (").concat(margin.toFixed(1), "%)"));
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("利益計算エラー: ".concat(error.message));
        } finally{
            setCalculating(false);
        }
    };
    // ✅ 戦略適用
    const handleApply = async ()=>{
        if (!selectedStrategy || !(product === null || product === void 0 ? void 0 : product.id)) return;
        setApplying(true);
        try {
            const newPrice = calculatePrice(selectedStrategy);
            // 利益計算
            const totalFeeRate = ebayFeeRate + paypalFeeRate;
            const fees = newPrice * totalFeeRate;
            const dutyAmt = newPrice * (dutyRate / 100);
            const profit = newPrice - totalCost - fees - dutyAmt;
            const margin = newPrice > 0 ? profit / newPrice * 100 : 0;
            // 赤字ストッパー
            if (profit < 0) {
                const confirmed = window.confirm("⚠️ 赤字警告!\n\n" + "この価格 ($".concat(newPrice.toFixed(2), ") では\n") + "利益: -$".concat(Math.abs(profit).toFixed(2), "\n\n") + "本当に適用しますか？");
                if (!confirmed) {
                    setApplying(false);
                    return;
                }
            }
            // APIで保存
            const response = await fetch('/api/products/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: product.id,
                    updates: {
                        price_usd: newPrice,
                        profit_margin: margin,
                        profit_amount_usd: profit,
                        listing_data: {
                            ...listingDataCheck,
                            pricing_strategy: selectedStrategy,
                            calculated_price_usd: newPrice,
                            calculated_profit_usd: profit,
                            calculated_margin: margin,
                            price_calculated_at: new Date().toISOString()
                        }
                    }
                })
            });
            const data = await response.json();
            if (data.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("✓ 価格を $".concat(newPrice.toFixed(2), " に更新しました (利益: ").concat(margin.toFixed(1), "%)"));
                onSave === null || onSave === void 0 ? void 0 : onSave({
                    price_usd: newPrice,
                    profit_margin: margin,
                    profit_amount_usd: profit
                });
            } else {
                throw new Error(data.error || '保存に失敗しました');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("適用エラー: ".concat(error.message));
        } finally{
            setApplying(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '1rem',
            background: T.bg,
            height: '100%',
            overflow: 'auto'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: T.panel,
                    border: "1px solid ".concat(T.panelBorder)
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: '0.5rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                            label: "Current",
                            value: "$".concat(currentPrice.toFixed(2))
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                            lineNumber: 417,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                            label: "SM Lowest",
                            value: smLowest > 0 ? "$".concat(smLowest.toFixed(2)) : '-',
                            color: T.accent
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                            lineNumber: 418,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                            label: "SM Average",
                            value: smAverage > 0 ? "$".concat(smAverage.toFixed(2)) : '-'
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                            lineNumber: 419,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                            label: "SM Highest",
                            value: smHighest > 0 ? "$".concat(smHighest.toFixed(2)) : '-',
                            color: T.warning
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                            lineNumber: 420,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                            label: "Margin",
                            value: "".concat(profitMargin.toFixed(1), "%"),
                            color: profitMargin >= 15 ? T.success : T.warning
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                            lineNumber: 421,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                    lineNumber: 416,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 415,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: hasCostData ? "".concat(T.success, "10") : "".concat(T.error, "10"),
                    border: "1px solid ".concat(hasCostData ? "".concat(T.success, "40") : T.error)
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    color: hasCostData ? T.success : T.error
                                },
                                children: hasCostData ? '✓ 原価データ入力済み' : '✗ 原価データが未入力です'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 434,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleCalculateProfit,
                                disabled: calculating || !selectedStrategy,
                                style: {
                                    padding: '0.375rem 0.75rem',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: selectedStrategy ? T.accent : T.textMuted,
                                    color: '#fff',
                                    cursor: selectedStrategy ? 'pointer' : 'not-allowed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                },
                                children: calculating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-spinner fa-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                            lineNumber: 455,
                                            columnNumber: 17
                                        }, this),
                                        " 計算中..."
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-calculator"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                            lineNumber: 457,
                                            columnNumber: 17
                                        }, this),
                                        " 利益計算"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 437,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 433,
                        columnNumber: 9
                    }, this),
                    hasCostData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '8px',
                                            color: T.textMuted
                                        },
                                        children: "原価"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 465,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: T.text
                                        },
                                        children: [
                                            "¥",
                                            purchasePriceJpy.toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 466,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 464,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '8px',
                                            color: T.textMuted
                                        },
                                        children: "送料"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 471,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: T.text
                                        },
                                        children: [
                                            "$",
                                            shippingCost.toFixed(2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 472,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 470,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '8px',
                                            color: T.textMuted
                                        },
                                        children: "関税率"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 477,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: T.text
                                        },
                                        children: dutyRate > 0 ? "".concat(dutyRate, "%") : '-'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 478,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 476,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '8px',
                                            color: T.textMuted
                                        },
                                        children: "合計コスト"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 483,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: T.accent
                                        },
                                        children: [
                                            "$",
                                            totalCost.toFixed(2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 484,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 482,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '8px',
                                            color: T.textMuted
                                        },
                                        children: "推奨(20%)"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 489,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: T.success
                                        },
                                        children: [
                                            "$",
                                            calculatePrice('margin-20').toFixed(2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 490,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 488,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 463,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 426,
                columnNumber: 7
            }, this),
            profitResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: profitResult.redFlag ? "".concat(T.error, "15") : "".concat(T.success, "15"),
                    border: "2px solid ".concat(profitResult.redFlag ? T.error : T.success)
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas ".concat(profitResult.redFlag ? 'fa-exclamation-triangle' : 'fa-check-circle'),
                                style: {
                                    color: profitResult.redFlag ? T.error : T.success
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 508,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: profitResult.redFlag ? T.error : T.success
                                },
                                children: profitResult.redFlag ? '⚠️ 赤字警告' : '✓ 利益計算結果'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 510,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 507,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBox, {
                                label: "推奨価格",
                                value: "$".concat(profitResult.suggestedPrice.toFixed(2)),
                                highlight: true
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 516,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBox, {
                                label: "損益分岐",
                                value: "$".concat(profitResult.breakEvenPrice.toFixed(2))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 521,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBox, {
                                label: "予想利益",
                                value: "$".concat(profitResult.expectedProfit.toFixed(2)),
                                color: profitResult.expectedProfit >= 0 ? T.success : T.error
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 525,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBox, {
                                label: "利益率",
                                value: "".concat(profitResult.profitMargin.toFixed(1), "%"),
                                color: profitResult.profitMargin >= 15 ? T.success : profitResult.profitMargin >= 0 ? T.warning : T.error
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 530,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResultBox, {
                                label: "手数料",
                                value: "$".concat(profitResult.details.feesUsd.toFixed(2))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 535,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 515,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: '0.5rem',
                            fontSize: '9px',
                            color: T.textMuted
                        },
                        children: [
                            "内訳: 商品代 $",
                            profitResult.details.baseCostUsd.toFixed(2),
                            " + 送料 $",
                            profitResult.details.shippingCostUsd.toFixed(2),
                            " + 手数料 $",
                            profitResult.details.feesUsd.toFixed(2),
                            profitResult.details.dutyAmount > 0 && " + 関税 $".concat(profitResult.details.dutyAmount.toFixed(2)),
                            "= 総コスト $",
                            profitResult.details.totalCost.toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 542,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 500,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.5rem',
                    marginBottom: '0.75rem'
                },
                children: STRATEGIES.map((strategy)=>{
                    const isSelected = selectedStrategy === strategy.id;
                    const calculatedPrice = calculatePrice(strategy.id);
                    const uncalculable = isUncalculable(strategy.id);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>!uncalculable && setSelectedStrategy(strategy.id),
                        style: {
                            padding: '0.5rem',
                            borderRadius: '6px',
                            background: uncalculable ? "".concat(T.error, "08") : isSelected ? "".concat(strategy.color, "15") : T.panel,
                            border: "2px solid ".concat(uncalculable ? T.error : isSelected ? strategy.color : T.panelBorder),
                            cursor: uncalculable ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s ease',
                            opacity: uncalculable ? 0.6 : 1,
                            position: 'relative'
                        },
                        children: [
                            uncalculable && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'absolute',
                                    top: '-6px',
                                    right: '-6px',
                                    background: T.error,
                                    color: 'white',
                                    fontSize: '8px',
                                    padding: '1px 4px',
                                    borderRadius: '3px',
                                    fontWeight: 700
                                },
                                children: "要入力"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 575,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    marginBottom: '0.25rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas ".concat(strategy.icon),
                                        style: {
                                            fontSize: '10px',
                                            color: uncalculable ? T.error : strategy.color
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 590,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            color: T.text
                                        },
                                        children: strategy.label
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                        lineNumber: 591,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 589,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '8px',
                                    color: T.textMuted,
                                    marginBottom: '0.25rem'
                                },
                                children: strategy.desc
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 593,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: uncalculable ? T.error : strategy.color
                                },
                                children: strategy.id === 'custom' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    value: customPrice,
                                    onChange: (e)=>{
                                        setCustomPrice(e.target.value);
                                        setSelectedStrategy('custom');
                                    },
                                    onClick: (e)=>e.stopPropagation(),
                                    placeholder: "価格入力",
                                    style: {
                                        width: '100%',
                                        padding: '0.25rem',
                                        fontSize: '10px',
                                        border: "1px solid ".concat(T.panelBorder),
                                        borderRadius: '4px'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                    lineNumber: 596,
                                    columnNumber: 19
                                }, this) : uncalculable ? '※ 要入力' : "$".concat(calculatedPrice.toFixed(2))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 594,
                                columnNumber: 15
                            }, this)
                        ]
                    }, strategy.id, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 560,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 553,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '10px',
                            color: T.textMuted
                        },
                        children: selectedStrategy ? "Selected: ".concat((_STRATEGIES_find = STRATEGIES.find((s)=>s.id === selectedStrategy)) === null || _STRATEGIES_find === void 0 ? void 0 : _STRATEGIES_find.label) : 'Select a strategy'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 624,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleCalculateProfit,
                                disabled: !selectedStrategy || calculating,
                                style: {
                                    padding: '0.5rem 1rem',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: "1px solid ".concat(T.accent),
                                    background: 'transparent',
                                    color: T.accent,
                                    cursor: selectedStrategy ? 'pointer' : 'not-allowed',
                                    opacity: selectedStrategy ? 1 : 0.5
                                },
                                children: calculating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-spinner fa-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                            lineNumber: 643,
                                            columnNumber: 30
                                        }, this),
                                        " 計算中"
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-calculator"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                            lineNumber: 643,
                                            columnNumber: 84
                                        }, this),
                                        " 利益計算"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 628,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleApply,
                                disabled: !selectedStrategy || applying,
                                style: {
                                    padding: '0.5rem 1rem',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: selectedStrategy ? '#1e293b' : T.textMuted,
                                    color: '#fff',
                                    cursor: selectedStrategy ? 'pointer' : 'not-allowed'
                                },
                                children: applying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-spinner fa-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                            lineNumber: 659,
                                            columnNumber: 27
                                        }, this),
                                        " Applying..."
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-check"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                            lineNumber: 659,
                                            columnNumber: 89
                                        }, this),
                                        " Apply Strategy"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                                lineNumber: 645,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 627,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 623,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
        lineNumber: 413,
        columnNumber: 5
    }, this);
}
_s(TabPricingStrategy, "TrmW4WUJMRs/cekmIMpzfKyhSP4=");
_c = TabPricingStrategy;
function StatBox(param) {
    let { label, value, color } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '0.5rem',
            borderRadius: '4px',
            background: T.highlight,
            textAlign: 'center'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '8px',
                    textTransform: 'uppercase',
                    color: T.textSubtle
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 670,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: color || T.text
                },
                children: value
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 671,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
        lineNumber: 669,
        columnNumber: 5
    }, this);
}
_c1 = StatBox;
function ResultBox(param) {
    let { label, value, color, highlight } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '0.5rem',
            borderRadius: '4px',
            background: highlight ? T.accent : T.panel,
            textAlign: 'center',
            border: highlight ? 'none' : "1px solid ".concat(T.panelBorder)
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '8px',
                    textTransform: 'uppercase',
                    color: highlight ? 'rgba(255,255,255,0.8)' : T.textSubtle
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 685,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: highlight ? '#fff' : color || T.text
                },
                children: value
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 686,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
        lineNumber: 678,
        columnNumber: 5
    }, this);
}
_c2 = ResultBox;
// ✅ ステップ表示コンポーネント
function StepItem(param) {
    let { step, label, completed, current, locked } = param;
    const bgColor = completed ? T.success : current ? T.accent : locked ? T.textSubtle : T.panelBorder;
    const textColor = completed ? T.success : current ? T.accent : T.textMuted;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            background: current ? "".concat(T.accent, "10") : 'transparent',
            border: current ? "1px solid ".concat(T.accent, "40") : '1px solid transparent'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: bgColor,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    flexShrink: 0
                },
                children: completed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                    className: "fas fa-check"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                    lineNumber: 725,
                    columnNumber: 22
                }, this) : locked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                    className: "fas fa-lock"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                    lineNumber: 725,
                    columnNumber: 67
                }, this) : step
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 712,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: '12px',
                    fontWeight: current ? 600 : 400,
                    color: textColor,
                    textAlign: 'left'
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 727,
                columnNumber: 7
            }, this),
            current && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    marginLeft: 'auto',
                    fontSize: '9px',
                    fontWeight: 600,
                    color: T.accent,
                    background: "".concat(T.accent, "15"),
                    padding: '2px 6px',
                    borderRadius: '4px'
                },
                children: "← 次のステップ"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 736,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
        lineNumber: 703,
        columnNumber: 5
    }, this);
}
_c3 = StepItem;
// ✅ ステータス表示コンポーネント
function StatusItem(param) {
    let { label, value, ok } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            textAlign: 'center'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '9px',
                    color: T.textMuted
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 756,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '11px',
                    fontWeight: 600,
                    color: ok ? T.success : T.error,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas ".concat(ok ? 'fa-check-circle' : 'fa-times-circle')
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                        lineNumber: 766,
                        columnNumber: 9
                    }, this),
                    value
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
                lineNumber: 757,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx",
        lineNumber: 755,
        columnNumber: 5
    }, this);
}
_c4 = StatusItem;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "TabPricingStrategy");
__turbopack_context__.k.register(_c1, "StatBox");
__turbopack_context__.k.register(_c2, "ResultBox");
__turbopack_context__.k.register(_c3, "StepItem");
__turbopack_context__.k.register(_c4, "StatusItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=2fac6_vps_components_product-modal_components_Tabs_tab-pricing-strategy_tsx_8d883420._.js.map