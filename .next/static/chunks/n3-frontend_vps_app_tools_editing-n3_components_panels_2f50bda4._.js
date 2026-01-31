(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/panels/n3-grouping-panel.tsx
/**
 * N3 Grouping Panel - 右サイドバー
 * 
 * 機能:
 * 1. 選択商品のリスト表示
 * 2. DDP計算結果（適合性チェック）
 * 3. 価格シミュレーション
 * 4. バリエーション作成
 * 5. セット商品作成
 * 
 * 元のGroupingBoxSidebar.tsxを参考にN3デザインで再実装
 */ __turbopack_context__.s([
    "N3GroupingPanel",
    ()=>N3GroupingPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
// ============================================================
// サブコンポーネント
// ============================================================
// ステータスバッジ
const StatusBadge = (param)=>{
    let { passed, label } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1.5",
        children: [
            passed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                size: 14,
                className: "text-green-500"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                size: 14,
                className: "text-red-500"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: 11,
                    color: 'var(--text-muted)'
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                lineNumber: 77,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
        lineNumber: 71,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c = StatusBadge;
// 折りたたみセクション
const CollapsibleSection = (param)=>{
    let { title, icon, defaultOpen = true, children, badge } = param;
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultOpen);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            borderBottom: '1px solid var(--panel-border)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                style: {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        },
                        children: [
                            icon,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: 'var(--text)'
                                },
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            badge
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                        lineNumber: 117,
                        columnNumber: 19
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                        lineNumber: 117,
                        columnNumber: 45
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '0 12px 12px'
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CollapsibleSection, "QSEG/+wAbCqYSsrjeAEeSTwR0QA=");
_c1 = CollapsibleSection;
function N3GroupingPanel(param) {
    let { selectedProducts, onClose, onClearSelection, onCreateVariation, onCreateSet, onProductClick } = param;
    _s1();
    const [compatibility, setCompatibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAllProducts, setShowAllProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 最大DDPコストベースの価格シミュレーション
    const maxDdpCost = selectedProducts.length > 0 ? Math.max(...selectedProducts.map((p)=>p.cost_jpy ? p.cost_jpy / 150 : p.cost_price || 0)) : 0;
    const totalExcessProfit = selectedProducts.reduce((sum, p)=>{
        const actualCost = p.cost_jpy ? p.cost_jpy / 150 : p.cost_price || 0;
        return sum + (maxDdpCost - actualCost);
    }, 0);
    // 適合性チェック
    const checkCompatibility = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3GroupingPanel.useCallback[checkCompatibility]": async ()=>{
            if (selectedProducts.length < 2) {
                setCompatibility(null);
                return;
            }
            setLoading(true);
            try {
                // ローカル計算（APIが利用できない場合のフォールバック）
                const costs = selectedProducts.map({
                    "N3GroupingPanel.useCallback[checkCompatibility].costs": (p)=>p.cost_jpy ? p.cost_jpy / 150 : p.cost_price || 0
                }["N3GroupingPanel.useCallback[checkCompatibility].costs"]);
                const weights = selectedProducts.map({
                    "N3GroupingPanel.useCallback[checkCompatibility].weights": (p)=>{
                        var _p_source_data;
                        return ((_p_source_data = p.source_data) === null || _p_source_data === void 0 ? void 0 : _p_source_data.weight_g) || 0;
                    }
                }["N3GroupingPanel.useCallback[checkCompatibility].weights"]).filter({
                    "N3GroupingPanel.useCallback[checkCompatibility].weights": (w)=>w > 0
                }["N3GroupingPanel.useCallback[checkCompatibility].weights"]);
                const categories = [
                    ...new Set(selectedProducts.map({
                        "N3GroupingPanel.useCallback[checkCompatibility]": (p)=>p.category
                    }["N3GroupingPanel.useCallback[checkCompatibility]"]).filter(Boolean))
                ];
                const minCost = Math.min(...costs);
                const maxCost = Math.max(...costs);
                const costDiff = maxCost - minCost;
                const costDiffPercent = minCost > 0 ? costDiff / minCost * 100 : 0;
                const minWeight = weights.length > 0 ? Math.min(...weights) : 0;
                const maxWeight = weights.length > 0 ? Math.max(...weights) : 0;
                const weightRatio = minWeight > 0 ? maxWeight / minWeight : 0;
                const ddpCheckPassed = costDiff <= 20 || costDiffPercent <= 10;
                const weightCheckPassed = weights.length === 0 || weightRatio <= 1.5;
                const categoryCheckPassed = categories.length <= 1;
                const warnings = [];
                if (!ddpCheckPassed) {
                    warnings.push("DDPコスト差が大きすぎます（$".concat(costDiff.toFixed(2), ", ").concat(costDiffPercent.toFixed(1), "%）"));
                }
                if (!weightCheckPassed) {
                    warnings.push("重量差が大きすぎます（最大/最小: ".concat((weightRatio * 100).toFixed(0), "%）"));
                }
                if (!categoryCheckPassed) {
                    warnings.push("複数カテゴリーが混在（".concat(categories.length, "件）"));
                }
                setCompatibility({
                    isCompatible: ddpCheckPassed && weightCheckPassed && categoryCheckPassed,
                    ddpCostCheck: {
                        passed: ddpCheckPassed,
                        minCost,
                        maxCost,
                        difference: costDiff,
                        differencePercent: costDiffPercent
                    },
                    weightCheck: {
                        passed: weightCheckPassed,
                        minWeight,
                        maxWeight,
                        ratio: weightRatio
                    },
                    categoryCheck: {
                        passed: categoryCheckPassed,
                        categories: categories
                    },
                    shippingPolicy: null,
                    warnings
                });
            } catch (error) {
                console.error('適合性チェックエラー:', error);
            } finally{
                setLoading(false);
            }
        }
    }["N3GroupingPanel.useCallback[checkCompatibility]"], [
        selectedProducts
    ]);
    // 商品選択時に適合性チェック実行
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3GroupingPanel.useEffect": ()=>{
            const timeoutId = setTimeout({
                "N3GroupingPanel.useEffect.timeoutId": ()=>{
                    checkCompatibility();
                }
            }["N3GroupingPanel.useEffect.timeoutId"], 500);
            return ({
                "N3GroupingPanel.useEffect": ()=>clearTimeout(timeoutId)
            })["N3GroupingPanel.useEffect"];
        }
    }["N3GroupingPanel.useEffect"], [
        checkCompatibility
    ]);
    // 空の場合
    if (selectedProducts.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: 320,
                height: '100%',
                background: 'var(--panel)',
                borderLeft: '1px solid var(--panel-border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                textAlign: 'center'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                    size: 48,
                    style: {
                        color: 'var(--text-subtle)',
                        marginBottom: 16
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                    lineNumber: 248,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: 14,
                        fontWeight: 500,
                        color: 'var(--text-muted)',
                        marginBottom: 8
                    },
                    children: "商品が選択されていません"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: 12,
                        color: 'var(--text-subtle)'
                    },
                    children: "カードのチェックボックスをクリックして選択"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                    lineNumber: 252,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
            lineNumber: 234,
            columnNumber: 7
        }, this);
    }
    const displayProducts = showAllProducts ? selectedProducts : selectedProducts.slice(0, 5);
    const hasMore = selectedProducts.length > 5;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: 320,
            height: '100%',
            background: 'var(--panel)',
            borderLeft: '1px solid var(--panel-border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--panel-border)',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                size: 18,
                                style: {
                                    color: 'rgb(139, 92, 246)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                lineNumber: 286,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: 'var(--text)'
                                        },
                                        children: "グルーピング"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                        lineNumber: 288,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 11,
                                            color: 'var(--text-muted)'
                                        },
                                        children: [
                                            selectedProducts.length,
                                            "個選択中"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                        lineNumber: 291,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                lineNumber: 287,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                        lineNumber: 285,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 4
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClearSelection,
                                style: {
                                    padding: '4px 8px',
                                    fontSize: 11,
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: 'rgb(239, 68, 68)',
                                    border: 'none',
                                    borderRadius: 4,
                                    cursor: 'pointer'
                                },
                                children: "クリア"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                lineNumber: 297,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                style: {
                                    padding: 4,
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                    lineNumber: 321,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                lineNumber: 311,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                lineNumber: 275,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflowY: 'auto'
                },
                children: [
                    selectedProducts.length >= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CollapsibleSection, {
                        title: "適合性チェック",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                            size: 14,
                            style: {
                                color: 'var(--text-muted)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                            lineNumber: 332,
                            columnNumber: 19
                        }, void 0),
                        badge: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            size: 12,
                            className: "animate-spin",
                            style: {
                                color: 'var(--accent)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                            lineNumber: 335,
                            columnNumber: 17
                        }, void 0) : (compatibility === null || compatibility === void 0 ? void 0 : compatibility.isCompatible) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: 10,
                                padding: '2px 6px',
                                background: 'rgba(34, 197, 94, 0.1)',
                                color: 'rgb(34, 197, 94)',
                                borderRadius: 4
                            },
                            children: "OK"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                            lineNumber: 337,
                            columnNumber: 17
                        }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: 10,
                                padding: '2px 6px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: 'rgb(239, 68, 68)',
                                borderRadius: 4
                            },
                            children: "NG"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                            lineNumber: 347,
                            columnNumber: 17
                        }, void 0),
                        children: compatibility && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: 8,
                                        background: 'var(--highlight)',
                                        borderRadius: 4,
                                        fontSize: 11
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusBadge, {
                                            passed: compatibility.ddpCostCheck.passed,
                                            label: "DDPコスト近接"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                            lineNumber: 368,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: 4,
                                                paddingLeft: 20,
                                                color: 'var(--text-subtle)'
                                            },
                                            children: [
                                                "$",
                                                compatibility.ddpCostCheck.minCost.toFixed(2),
                                                " - $",
                                                compatibility.ddpCostCheck.maxCost.toFixed(2),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                    lineNumber: 371,
                                                    columnNumber: 21
                                                }, this),
                                                "差額: $",
                                                compatibility.ddpCostCheck.difference.toFixed(2),
                                                " (",
                                                compatibility.ddpCostCheck.differencePercent.toFixed(1),
                                                "%)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                            lineNumber: 369,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                    lineNumber: 362,
                                    columnNumber: 17
                                }, this),
                                compatibility.weightCheck.maxWeight > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: 8,
                                        background: 'var(--highlight)',
                                        borderRadius: 4,
                                        fontSize: 11
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusBadge, {
                                            passed: compatibility.weightCheck.passed,
                                            label: "重量許容範囲"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                            lineNumber: 384,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: 4,
                                                paddingLeft: 20,
                                                color: 'var(--text-subtle)'
                                            },
                                            children: [
                                                compatibility.weightCheck.minWeight,
                                                "g - ",
                                                compatibility.weightCheck.maxWeight,
                                                "g",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                    lineNumber: 387,
                                                    columnNumber: 23
                                                }, this),
                                                "比率: ",
                                                (compatibility.weightCheck.ratio * 100).toFixed(0),
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                            lineNumber: 385,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                    lineNumber: 378,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: 8,
                                        background: 'var(--highlight)',
                                        borderRadius: 4,
                                        fontSize: 11
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusBadge, {
                                            passed: compatibility.categoryCheck.passed,
                                            label: "カテゴリー一致"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                            lineNumber: 400,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginTop: 4,
                                                paddingLeft: 20,
                                                color: 'var(--text-subtle)'
                                            },
                                            children: compatibility.categoryCheck.categories.length > 0 ? compatibility.categoryCheck.categories.join(', ') : '未設定'
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                            lineNumber: 401,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                    lineNumber: 394,
                                    columnNumber: 17
                                }, this),
                                compatibility.warnings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: 8,
                                        background: 'rgba(245, 158, 11, 0.1)',
                                        border: '1px solid rgba(245, 158, 11, 0.3)',
                                        borderRadius: 4
                                    },
                                    children: compatibility.warnings.map((warning, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 6,
                                                fontSize: 10,
                                                color: 'rgb(180, 120, 0)',
                                                marginBottom: i < compatibility.warnings.length - 1 ? 4 : 0
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                    size: 12,
                                                    style: {
                                                        flexShrink: 0,
                                                        marginTop: 1
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: warning
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                    lineNumber: 426,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                            lineNumber: 417,
                                            columnNumber: 23
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                    lineNumber: 410,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                            lineNumber: 360,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                        lineNumber: 330,
                        columnNumber: 11
                    }, this),
                    selectedProducts.length >= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CollapsibleSection, {
                        title: "価格シミュレーション",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                            size: 14,
                            style: {
                                color: 'var(--text-muted)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                            lineNumber: 440,
                            columnNumber: 19
                        }, void 0),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: 12,
                                background: 'rgba(34, 197, 94, 0.05)',
                                border: '1px solid rgba(34, 197, 94, 0.2)',
                                borderRadius: 6
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: 8
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 11,
                                                color: 'var(--text-muted)'
                                            },
                                            children: "統一 Item Price:"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                            lineNumber: 449,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 16,
                                                fontWeight: 700,
                                                color: 'rgb(34, 197, 94)'
                                            },
                                            children: [
                                                "$",
                                                maxDdpCost.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                            lineNumber: 450,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                    lineNumber: 448,
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
                                                fontSize: 11,
                                                color: 'var(--text-muted)'
                                            },
                                            children: "追加利益合計:"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                            lineNumber: 455,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: 'rgb(34, 197, 94)'
                                            },
                                            children: [
                                                "+$",
                                                totalExcessProfit.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                            lineNumber: 456,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                    lineNumber: 454,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: 10,
                                        color: 'var(--text-subtle)',
                                        marginTop: 8,
                                        borderTop: '1px solid rgba(34, 197, 94, 0.2)',
                                        paddingTop: 8
                                    },
                                    children: "※ 最大DDPコスト戦略により赤字リスクなし"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                    lineNumber: 460,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                            lineNumber: 442,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                        lineNumber: 438,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CollapsibleSection, {
                        title: "選択商品",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                            size: 14,
                            style: {
                                color: 'var(--text-muted)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                            lineNumber: 476,
                            columnNumber: 17
                        }, void 0),
                        badge: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: 10,
                                padding: '2px 6px',
                                background: 'var(--accent)',
                                color: 'white',
                                borderRadius: 4
                            },
                            children: selectedProducts.length
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                            lineNumber: 478,
                            columnNumber: 13
                        }, void 0),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8
                            },
                            children: [
                                displayProducts.map((product)=>{
                                    var _product_images;
                                    const cost = product.cost_jpy ? product.cost_jpy / 150 : product.cost_price || 0;
                                    const excessProfit = maxDdpCost - cost;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>onProductClick === null || onProductClick === void 0 ? void 0 : onProductClick(product),
                                        style: {
                                            display: 'flex',
                                            gap: 8,
                                            padding: 8,
                                            background: 'var(--highlight)',
                                            borderRadius: 6,
                                            cursor: onProductClick ? 'pointer' : 'default'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 4,
                                                    overflow: 'hidden',
                                                    background: 'var(--panel)',
                                                    flexShrink: 0
                                                },
                                                children: product.image_url || product.images && product.images[0] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: product.image_url || ((_product_images = product.images) === null || _product_images === void 0 ? void 0 : _product_images[0]),
                                                    alt: "",
                                                    style: {
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                    lineNumber: 516,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                        size: 16,
                                                        style: {
                                                            color: 'var(--text-subtle)'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                        lineNumber: 529,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                    lineNumber: 522,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                lineNumber: 507,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1,
                                                    minWidth: 0
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 11,
                                                            fontWeight: 500,
                                                            color: 'var(--text)',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        },
                                                        children: product.title || product.product_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                        lineNumber: 534,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 10,
                                                            color: 'var(--text-subtle)',
                                                            fontFamily: 'monospace'
                                                        },
                                                        children: product.sku || 'SKU未設定'
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                        lineNumber: 544,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            gap: 4,
                                                            marginTop: 4
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: 10,
                                                                    padding: '1px 4px',
                                                                    background: 'var(--panel)',
                                                                    borderRadius: 2,
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                children: [
                                                                    "$",
                                                                    cost.toFixed(2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                                lineNumber: 548,
                                                                columnNumber: 23
                                                            }, this),
                                                            selectedProducts.length >= 2 && excessProfit > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: 10,
                                                                    padding: '1px 4px',
                                                                    background: 'rgba(34, 197, 94, 0.1)',
                                                                    borderRadius: 2,
                                                                    color: 'rgb(34, 197, 94)'
                                                                },
                                                                children: [
                                                                    "+$",
                                                                    excessProfit.toFixed(2)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                                lineNumber: 558,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                        lineNumber: 547,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                                lineNumber: 533,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, product.id, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                        lineNumber: 495,
                                        columnNumber: 17
                                    }, this);
                                }),
                                hasMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowAllProducts(!showAllProducts),
                                    style: {
                                        padding: '6px 12px',
                                        fontSize: 11,
                                        background: 'transparent',
                                        border: '1px dashed var(--panel-border)',
                                        borderRadius: 4,
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)'
                                    },
                                    children: showAllProducts ? '折りたたむ' : "他 ".concat(selectedProducts.length - 5, "件を表示")
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                    lineNumber: 575,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                            lineNumber: 489,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                        lineNumber: 474,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                lineNumber: 327,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: 12,
                    borderTop: '1px solid var(--panel-border)',
                    background: 'var(--highlight)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onCreateVariation,
                        disabled: selectedProducts.length < 2 || !(compatibility === null || compatibility === void 0 ? void 0 : compatibility.isCompatible),
                        style: {
                            width: '100%',
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            background: selectedProducts.length >= 2 && (compatibility === null || compatibility === void 0 ? void 0 : compatibility.isCompatible) ? 'linear-gradient(135deg, rgb(139, 92, 246), rgb(59, 130, 246))' : 'var(--text-subtle)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            cursor: selectedProducts.length >= 2 && (compatibility === null || compatibility === void 0 ? void 0 : compatibility.isCompatible) ? 'pointer' : 'not-allowed',
                            opacity: selectedProducts.length >= 2 && (compatibility === null || compatibility === void 0 ? void 0 : compatibility.isCompatible) ? 1 : 0.5
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                lineNumber: 627,
                                columnNumber: 11
                            }, this),
                            "バリエーション作成"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                        lineNumber: 605,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onCreateSet,
                        disabled: selectedProducts.length < 2,
                        style: {
                            width: '100%',
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            background: 'transparent',
                            color: selectedProducts.length >= 2 ? 'rgb(34, 197, 94)' : 'var(--text-subtle)',
                            border: "1px solid ".concat(selectedProducts.length >= 2 ? 'rgb(34, 197, 94)' : 'var(--panel-border)'),
                            borderRadius: 6,
                            cursor: selectedProducts.length >= 2 ? 'pointer' : 'not-allowed',
                            opacity: selectedProducts.length >= 2 ? 1 : 0.5
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                                lineNumber: 651,
                                columnNumber: 11
                            }, this),
                            "セット品作成"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                        lineNumber: 631,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: 10,
                            color: 'var(--text-subtle)',
                            textAlign: 'center'
                        },
                        children: selectedProducts.length < 2 ? '2個以上の商品を選択してください' : !(compatibility === null || compatibility === void 0 ? void 0 : compatibility.isCompatible) ? '適合性チェックに合格していません' : '作成の準備完了'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                        lineNumber: 655,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
                lineNumber: 597,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx",
        lineNumber: 263,
        columnNumber: 5
    }, this);
}
_s1(N3GroupingPanel, "7TwhxMDsGo4Y4gO4gM8WxEgMp1E=");
_c2 = N3GroupingPanel;
const __TURBOPACK__default__export__ = N3GroupingPanel;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "StatusBadge");
__turbopack_context__.k.register(_c1, "CollapsibleSection");
__turbopack_context__.k.register(_c2, "N3GroupingPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-tools-panel-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/panels/n3-tools-panel-content.tsx
/**
 * N3ToolsPanelContent - ツールパネルのコンテンツ
 * 
 * 責務:
 * - 各フィルターに応じたツールパネルの表示
 * - 承認アクションバーの表示
 */ __turbopack_context__.s([
    "N3ToolsPanelContent",
    ()=>N3ToolsPanelContent,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-tool-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$approval$2d$action$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/n3-approval-action-bar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$inventory$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/inventory-tool-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$variation$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/variation-tool-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$set$2d$product$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/l3-tabs/set-product-tool-panel.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
// ============================================================
// ヘルパー関数
// ============================================================
const isInventoryTab = (tabId)=>{
    return [
        'in_stock',
        'variation',
        'set_products',
        'in_stock_master'
    ].includes(tabId);
};
const N3ToolsPanelContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3ToolsPanelContent(param) {
    let { activeFilter, processing, currentStep, modifiedCount, readyCount, selectedMirrorCount, selectedCount, completeCount, incompleteCount, dataFilter, onDataFilterChange, marketplaces, onMarketplacesChange, inventoryData, inventorySyncing, inventorySelectedCount = 0, inventoryPendingCount = 0, showCandidatesOnly = false, showSetsOnly = false, variationStats, variationLoading = false, setLoading = false, selectedProductIds = [], toolHandlers, approvalHandlers, inventoryHandlers, approvedCount = 0 } = param;
    // 棚卸しタブ：有在庫/マスター
    if ((activeFilter === 'in_stock' || activeFilter === 'in_stock_master') && inventoryData && inventorySyncing && inventoryHandlers) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$inventory$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InventoryToolPanel"], {
            stats: inventoryData.stats,
            loading: inventoryData.loading,
            syncing: inventorySyncing,
            selectedCount: inventorySelectedCount,
            pendingCount: inventoryPendingCount,
            onSyncIncremental: inventoryHandlers.onSyncIncremental,
            onSyncFull: inventoryHandlers.onSyncFull,
            onSyncMercari: inventoryHandlers.onSyncMercari,
            onRefresh: inventoryHandlers.onRefresh,
            onBulkDelete: inventoryHandlers.onBulkDelete,
            onNewProduct: inventoryHandlers.onNewProduct,
            onBulkImageUpload: inventoryHandlers.onBulkImageUpload
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-tools-panel-content.tsx",
            lineNumber: 193,
            columnNumber: 7
        }, this);
    }
    // 棚卸しタブ：バリエーション
    if (activeFilter === 'variation' && variationStats && inventoryHandlers) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$variation$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VariationToolPanel"], {
            stats: variationStats,
            loading: (inventoryData === null || inventoryData === void 0 ? void 0 : inventoryData.loading) || variationLoading,
            selectedCount: inventorySelectedCount,
            showCandidatesOnly: showCandidatesOnly,
            onDetectCandidates: inventoryHandlers.onDetectCandidates,
            onToggleCandidatesOnly: inventoryHandlers.onToggleCandidatesOnly,
            onCreateVariation: inventoryHandlers.onCreateVariation,
            onClearSelection: inventoryHandlers.onClearSelection
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-tools-panel-content.tsx",
            lineNumber: 213,
            columnNumber: 7
        }, this);
    }
    // 棚卸しタブ：セット品
    if (activeFilter === 'set_products' && inventoryData && inventoryHandlers) {
        const setProducts = inventoryData.filteredProducts.filter((p)=>p.product_type === 'set');
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$l3$2d$tabs$2f$set$2d$product$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SetProductToolPanel"], {
            stats: {
                setCount: setProducts.length,
                totalValue: setProducts.reduce((sum, p)=>sum + (p.cost_jpy || 0), 0),
                selectedCount: inventorySelectedCount
            },
            loading: inventoryData.loading || setLoading,
            selectedCount: inventorySelectedCount,
            showSetsOnly: showSetsOnly,
            onCreateSet: inventoryHandlers.onCreateSet,
            onToggleSetsOnly: inventoryHandlers.onToggleSetsOnly,
            onEditSet: inventoryHandlers.onEditSet,
            onDeleteSet: inventoryHandlers.onDeleteSet
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-tools-panel-content.tsx",
            lineNumber: 230,
            columnNumber: 7
        }, this);
    }
    // 承認待ち or 承認済みフィルター
    if (activeFilter === 'approval_pending' || activeFilter === 'approved') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$approval$2d$action$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3ApprovalActionBar"], {
                    selectedCount: selectedCount,
                    modifiedCount: modifiedCount,
                    completeCount: completeCount,
                    incompleteCount: incompleteCount,
                    dataFilter: dataFilter,
                    onDataFilterChange: onDataFilterChange,
                    onSelectAll: approvalHandlers.onSelectAll,
                    onDeselectAll: approvalHandlers.onDeselectAll,
                    onApprove: approvalHandlers.onApprove,
                    onReject: approvalHandlers.onReject,
                    onScheduleListing: approvalHandlers.onScheduleListing,
                    onListNow: approvalHandlers.onListNow,
                    onSave: approvalHandlers.onSave,
                    processing: processing,
                    approvedCount: approvedCount,
                    isApprovedTab: activeFilter === 'approved'
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-tools-panel-content.tsx",
                    lineNumber: 251,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3ToolPanel"], {
                    processing: processing,
                    currentStep: currentStep,
                    modifiedCount: modifiedCount,
                    readyCount: readyCount,
                    selectedMirrorCount: selectedMirrorCount,
                    selectedProductIds: selectedProductIds,
                    ...toolHandlers
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-tools-panel-content.tsx",
                    lineNumber: 269,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-tools-panel-content.tsx",
            lineNumber: 250,
            columnNumber: 7
        }, this);
    }
    // 通常のツールパネル
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3ToolPanel"], {
        processing: processing,
        currentStep: currentStep,
        modifiedCount: modifiedCount,
        readyCount: readyCount,
        selectedMirrorCount: selectedMirrorCount,
        selectedProductIds: selectedProductIds,
        ...toolHandlers
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-tools-panel-content.tsx",
        lineNumber: 284,
        columnNumber: 5
    }, this);
});
_c1 = N3ToolsPanelContent;
const __TURBOPACK__default__export__ = N3ToolsPanelContent;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3ToolsPanelContent$memo");
__turbopack_context__.k.register(_c1, "N3ToolsPanelContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx
/**
 * N3StatsPanelContent - 統計パネルのコンテンツ
 * 
 * 責務:
 * - 各フィルターに応じた統計情報の表示
 */ __turbopack_context__.s([
    "N3StatsPanelContent",
    ()=>N3StatsPanelContent,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/n3-stats-bar.tsx [app-client] (ecmascript)");
'use client';
;
;
;
// ============================================================
// ヘルパー関数
// ============================================================
const isInventoryTab = (tabId)=>{
    return [
        'in_stock',
        'variation',
        'set_products',
        'in_stock_master'
    ].includes(tabId);
};
const N3StatsPanelContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3StatsPanelContent(param) {
    let { activeFilter, displayProducts, total, products, completeCount, incompleteCount, inventoryData } = param;
    // 棚卸しタブ：バリエーション
    if (activeFilter === 'variation' && inventoryData) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3StatsBar"], {
                stats: [
                    {
                        label: '総商品数',
                        value: inventoryData.filteredProducts.length,
                        color: 'default'
                    },
                    {
                        label: '親SKU',
                        value: inventoryData.stats.variationParentCount,
                        color: 'purple'
                    },
                    {
                        label: '子SKU',
                        value: inventoryData.stats.variationMemberCount,
                        color: 'blue'
                    },
                    {
                        label: '単独SKU',
                        value: inventoryData.stats.standaloneCount,
                        color: 'gray'
                    }
                ],
                size: "compact",
                gap: 8
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
                lineNumber: 70,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
            lineNumber: 69,
            columnNumber: 7
        }, this);
    }
    // 棚卸しタブ：セット品
    if (activeFilter === 'set_products' && inventoryData) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3StatsBar"], {
                stats: [
                    {
                        label: '総商品数',
                        value: inventoryData.filteredProducts.length,
                        color: 'default'
                    },
                    {
                        label: 'セット品',
                        value: inventoryData.filteredProducts.filter((p)=>p.product_type === 'set').length,
                        color: 'purple'
                    },
                    {
                        label: '単品',
                        value: inventoryData.filteredProducts.filter((p)=>p.product_type !== 'set').length,
                        color: 'gray'
                    }
                ],
                size: "compact",
                gap: 8
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
            lineNumber: 87,
            columnNumber: 7
        }, this);
    }
    // 棚卸しタブ：有在庫/マスター/無在庫
    if (isInventoryTab(activeFilter) && inventoryData) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3StatsBar"], {
                stats: [
                    {
                        label: '総商品数',
                        value: inventoryData.filteredProducts.length,
                        color: 'default'
                    },
                    {
                        label: '有在庫',
                        value: inventoryData.filteredProducts.filter((p)=>p.inventory_type === 'stock').length,
                        color: 'blue'
                    },
                    {
                        label: '無在庫',
                        value: inventoryData.filteredProducts.filter((p)=>p.inventory_type === 'mu' || !p.inventory_type).length,
                        color: 'yellow'
                    },
                    {
                        label: '出品中',
                        value: inventoryData.filteredProducts.filter((p)=>{
                            var _p_source_data;
                            return ((_p_source_data = p.source_data) === null || _p_source_data === void 0 ? void 0 : _p_source_data.listing_status) === 'active';
                        }).length,
                        color: 'green'
                    }
                ],
                size: "compact",
                gap: 8
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
                lineNumber: 105,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
            lineNumber: 104,
            columnNumber: 7
        }, this);
    }
    // データ編集タブ
    if (activeFilter === 'data_editing') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3StatsBar"], {
                stats: [
                    {
                        label: '総商品数',
                        value: displayProducts.length,
                        color: 'default'
                    },
                    {
                        label: '英語タイトルなし',
                        value: displayProducts.filter((p)=>!p.english_title).length,
                        color: 'red'
                    },
                    {
                        label: 'カテゴリなし',
                        value: displayProducts.filter((p)=>!p.ebay_category_id).length,
                        color: 'yellow'
                    },
                    {
                        label: '画像なし',
                        value: displayProducts.filter((p)=>!p.primary_image_url).length,
                        color: 'gray'
                    }
                ],
                size: "compact",
                gap: 8
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
                lineNumber: 123,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
            lineNumber: 122,
            columnNumber: 7
        }, this);
    }
    // 承認待ちタブ
    if (activeFilter === 'approval_pending') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3StatsBar"], {
                stats: [
                    {
                        label: '総商品数',
                        value: displayProducts.length,
                        color: 'default'
                    },
                    {
                        label: '完全',
                        value: completeCount,
                        color: 'green'
                    },
                    {
                        label: '不完全',
                        value: incompleteCount,
                        color: 'yellow'
                    }
                ],
                size: "compact",
                gap: 8
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
                lineNumber: 141,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
            lineNumber: 140,
            columnNumber: 7
        }, this);
    }
    // 出品中タブ
    if (activeFilter === 'active_listings') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-3",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3StatsBar"], {
                stats: [
                    {
                        label: '総商品数',
                        value: displayProducts.length,
                        color: 'default'
                    },
                    {
                        label: '有在庫',
                        value: displayProducts.filter((p)=>p.inventory_type === 'stock').length,
                        color: 'blue'
                    },
                    {
                        label: '無在庫',
                        value: displayProducts.filter((p)=>p.inventory_type === 'mu' || !p.inventory_type).length,
                        color: 'yellow'
                    },
                    {
                        label: '在庫0',
                        value: displayProducts.filter((p)=>!p.physical_quantity).length,
                        color: 'red'
                    }
                ],
                size: "compact",
                gap: 8
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
                lineNumber: 158,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
            lineNumber: 157,
            columnNumber: 7
        }, this);
    }
    // 全商品タブ（デフォルト）
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-3",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3StatsBar"], {
            stats: [
                {
                    label: '総商品数',
                    value: total,
                    color: 'default'
                },
                {
                    label: '出品準備完了',
                    value: products.filter((p)=>p.ready_to_list).length,
                    color: 'blue'
                },
                {
                    label: '未完了',
                    value: products.filter((p)=>!p.ready_to_list).length,
                    color: 'yellow'
                },
                {
                    label: '出品済み',
                    value: products.filter((p)=>p.listed_marketplaces && p.listed_marketplaces.length > 0).length,
                    color: 'green'
                }
            ],
            size: "compact",
            gap: 8
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
            lineNumber: 175,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx",
        lineNumber: 174,
        columnNumber: 5
    }, this);
});
_c1 = N3StatsPanelContent;
const __TURBOPACK__default__export__ = N3StatsPanelContent;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3StatsPanelContent$memo");
__turbopack_context__.k.register(_c1, "N3StatsPanelContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuditPanel",
    ()=>AuditPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$audit$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/services/audit/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$audit$2f$audit$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/services/audit/audit-service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// ============================================================
// アイコンコンポーネント
// ============================================================
const IconClose = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "20",
        height: "20",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "18",
                y1: "6",
                x2: "6",
                y2: "18"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 43,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "6",
                y1: "6",
                x2: "18",
                y2: "18"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 44,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
        lineNumber: 42,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = IconClose;
const IconCheck = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
            points: "20 6 9 17 4 12"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
            lineNumber: 50,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
        lineNumber: 49,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = IconCheck;
const IconWarning = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 56,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "9",
                x2: "12",
                y2: "13"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 57,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "17",
                x2: "12.01",
                y2: "17"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 58,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
        lineNumber: 55,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c2 = IconWarning;
const IconError = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 64,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "15",
                y1: "9",
                x2: "9",
                y2: "15"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 65,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "9",
                y1: "9",
                x2: "15",
                y2: "15"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 66,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
        lineNumber: 63,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c3 = IconError;
const IconInfo = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 72,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "16",
                x2: "12",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 73,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "8",
                x2: "12.01",
                y2: "8"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 74,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
        lineNumber: 71,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c4 = IconInfo;
const IconAutoFix = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
            lineNumber: 80,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
        lineNumber: 79,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c5 = IconAutoFix;
const IconArrowRight = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "5",
                y1: "12",
                x2: "19",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 86,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "12 5 19 12 12 19"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 87,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
        lineNumber: 85,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c6 = IconArrowRight;
const IconAI = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 2L2 7l10 5 10-5-10-5z"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 93,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 17l10 5 10-5"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 94,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 12l10 5 10-5"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 95,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
        lineNumber: 92,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c7 = IconAI;
const IconSpinner = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        className: "animate-spin",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "10",
                strokeOpacity: "0.25"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 101,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 2a10 10 0 0 1 10 10",
                strokeLinecap: "round"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 102,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
        lineNumber: 100,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c8 = IconSpinner;
// ============================================================
// サブコンポーネント
// ============================================================
/** 重大度アイコン */ const SeverityIcon = (param)=>{
    let { severity } = param;
    switch(severity){
        case 'error':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconError, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 113,
                columnNumber: 26
            }, ("TURBOPACK compile-time value", void 0));
        case 'warning':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconWarning, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 114,
                columnNumber: 28
            }, ("TURBOPACK compile-time value", void 0));
        case 'info':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconInfo, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 115,
                columnNumber: 25
            }, ("TURBOPACK compile-time value", void 0));
        case 'ok':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconCheck, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 116,
                columnNumber: 23
            }, ("TURBOPACK compile-time value", void 0));
        default:
            return null;
    }
};
_c9 = SeverityIcon;
/** 監査結果カード */ const AuditResultCard = (param)=>{
    let { result } = param;
    const color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$audit$2f$audit$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuditSeverityColor"])(result.severity);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '12px 16px',
            background: "".concat(color, "10"),
            borderLeft: "3px solid ".concat(color),
            borderRadius: '0 8px 8px 0',
            marginBottom: 8
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color,
                    marginTop: 2
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SeverityIcon, {
                    severity: result.severity
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    minWidth: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'var(--text)',
                            marginBottom: 4
                        },
                        children: result.field
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            color: 'var(--text-muted)',
                            marginBottom: 6
                        },
                        children: result.messageJa
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    result.currentValue !== null && result.expectedValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 11,
                            fontFamily: 'monospace'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    padding: '2px 6px',
                                    background: 'var(--panel)',
                                    borderRadius: 4,
                                    color: 'var(--text-muted)',
                                    textDecoration: 'line-through'
                                },
                                children: String(result.currentValue)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconArrowRight, {}, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 170,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    padding: '2px 6px',
                                    background: "".concat(color, "20"),
                                    borderRadius: 4,
                                    color,
                                    fontWeight: 600
                                },
                                children: String(result.expectedValue)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c10 = AuditResultCard;
/** 修正提案カード */ const FixSuggestionCard = (param)=>{
    let { patch, onToggle } = param;
    const confidenceColor = patch.confidence >= 0.9 ? '#10b981' : patch.confidence >= 0.7 ? '#f59e0b' : '#6b7280';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: onToggle,
        style: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '12px 16px',
            background: patch.selected ? 'rgba(59, 130, 246, 0.1)' : 'var(--panel)',
            border: "2px solid ".concat(patch.selected ? '#3b82f6' : 'transparent'),
            borderRadius: 8,
            marginBottom: 8,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: "2px solid ".concat(patch.selected ? '#3b82f6' : 'var(--text-subtle)'),
                    background: patch.selected ? '#3b82f6' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2
                },
                children: patch.selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconCheck, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                    lineNumber: 228,
                    columnNumber: 28
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    minWidth: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: 'var(--text)'
                                },
                                children: patch.field
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 239,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 10,
                                    padding: '2px 6px',
                                    borderRadius: 10,
                                    background: patch.source === 'rule' ? '#3b82f620' : '#8b5cf620',
                                    color: patch.source === 'rule' ? '#3b82f6' : '#8b5cf6',
                                    fontWeight: 600
                                },
                                children: patch.source === 'rule' ? 'Rule' : 'AI'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 246,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 10,
                                    padding: '2px 6px',
                                    borderRadius: 10,
                                    background: "".concat(confidenceColor, "20"),
                                    color: confidenceColor,
                                    fontWeight: 600
                                },
                                children: [
                                    Math.round(patch.confidence * 100),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 256,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            fontSize: 12,
                            fontFamily: 'monospace'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    padding: '4px 8px',
                                    background: 'var(--background)',
                                    borderRadius: 4,
                                    color: 'var(--text-muted)',
                                    maxWidth: 120,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                },
                                children: patch.currentValue !== null ? String(patch.currentValue) : '(未設定)'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 276,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconArrowRight, {}, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 288,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    padding: '4px 8px',
                                    background: '#10b98120',
                                    borderRadius: 4,
                                    color: '#10b981',
                                    fontWeight: 600,
                                    maxWidth: 120,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                },
                                children: String(patch.suggestedValue)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 289,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                        lineNumber: 269,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    patch.reason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            color: 'var(--text-muted)',
                            marginTop: 6,
                            fontStyle: 'italic'
                        },
                        children: patch.reason
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                        lineNumber: 306,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
        lineNumber: 198,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c11 = FixSuggestionCard;
function AuditPanel(param) {
    let { product, isOpen, onClose, onApplyFixes, onRefresh } = param;
    var _product_title, _product_title1, _product_listing_data;
    _s();
    const [isApplying, setIsApplying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAiProcessing, setIsAiProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [aiError, setAiError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [aiCost, setAiCost] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [patchSelections, setPatchSelections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // 監査実行
    const auditReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuditPanel.useMemo[auditReport]": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$audit$2f$audit$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auditProduct"])(product);
        }
    }["AuditPanel.useMemo[auditReport]"], [
        product
    ]);
    // パッチ選択の初期化
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AuditPanel.useMemo": ()=>{
            const patches = auditReport.autoFixSuggestions.map({
                "AuditPanel.useMemo.patches": (suggestion)=>({
                        field: suggestion.field,
                        selected: suggestion.confidence >= 0.9,
                        currentValue: suggestion.currentValue,
                        suggestedValue: suggestion.suggestedValue,
                        confidence: suggestion.confidence,
                        reason: suggestion.reason,
                        source: 'rule'
                    })
            }["AuditPanel.useMemo.patches"]);
            setPatchSelections(patches);
        }
    }["AuditPanel.useMemo"], [
        auditReport
    ]);
    // パッチ選択のトグル
    const togglePatch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuditPanel.useCallback[togglePatch]": (index)=>{
            setPatchSelections({
                "AuditPanel.useCallback[togglePatch]": (prev)=>prev.map({
                        "AuditPanel.useCallback[togglePatch]": (p, i)=>i === index ? {
                                ...p,
                                selected: !p.selected
                            } : p
                    }["AuditPanel.useCallback[togglePatch]"])
            }["AuditPanel.useCallback[togglePatch]"]);
        }
    }["AuditPanel.useCallback[togglePatch]"], []);
    // 全選択/全解除
    const selectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuditPanel.useCallback[selectAll]": (selected)=>{
            setPatchSelections({
                "AuditPanel.useCallback[selectAll]": (prev)=>prev.map({
                        "AuditPanel.useCallback[selectAll]": (p)=>({
                                ...p,
                                selected
                            })
                    }["AuditPanel.useCallback[selectAll]"])
            }["AuditPanel.useCallback[selectAll]"]);
        }
    }["AuditPanel.useCallback[selectAll]"], []);
    // 🔥 AI審査を実行
    const runAiAudit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuditPanel.useCallback[runAiAudit]": async ()=>{
            setIsAiProcessing(true);
            setAiError(null);
            setAiCost(null);
            try {
                const response = await fetch('/api/audit/ai-review', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        products: [
                            product
                        ],
                        auditReports: [
                            auditReport
                        ],
                        provider: 'gemini'
                    })
                });
                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.error || 'AI審査に失敗しました');
                }
                // AI提案をパッチリストに追加
                if (result.responses && result.responses.length > 0) {
                    const aiPatches = result.responses[0].patches.map({
                        "AuditPanel.useCallback[runAiAudit].aiPatches": (p)=>({
                                field: p.field,
                                selected: p.confidence >= 0.85,
                                currentValue: p.currentValue,
                                suggestedValue: p.suggestedValue,
                                confidence: p.confidence,
                                reason: p.reason,
                                source: 'ai'
                            })
                    }["AuditPanel.useCallback[runAiAudit].aiPatches"]);
                    // 既存のパッチとマージ（同じフィールドはAIで上書き）
                    setPatchSelections({
                        "AuditPanel.useCallback[runAiAudit]": (prev)=>{
                            const existingFields = new Set(aiPatches.map({
                                "AuditPanel.useCallback[runAiAudit]": (p)=>p.field
                            }["AuditPanel.useCallback[runAiAudit]"]));
                            const filteredPrev = prev.filter({
                                "AuditPanel.useCallback[runAiAudit].filteredPrev": (p)=>!existingFields.has(p.field)
                            }["AuditPanel.useCallback[runAiAudit].filteredPrev"]);
                            return [
                                ...filteredPrev,
                                ...aiPatches
                            ];
                        }
                    }["AuditPanel.useCallback[runAiAudit]"]);
                }
                setAiCost({
                    tokens: result.tokensUsed,
                    costUsd: result.costUsd
                });
            } catch (error) {
                setAiError(error instanceof Error ? error.message : 'AI審査エラー');
            } finally{
                setIsAiProcessing(false);
            }
        }
    }["AuditPanel.useCallback[runAiAudit]"], [
        product,
        auditReport
    ]);
    // 選択したパッチを適用
    const applySelectedPatches = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AuditPanel.useCallback[applySelectedPatches]": async ()=>{
            const selectedPatches = patchSelections.filter({
                "AuditPanel.useCallback[applySelectedPatches].selectedPatches": (p)=>p.selected
            }["AuditPanel.useCallback[applySelectedPatches].selectedPatches"]);
            if (selectedPatches.length === 0) return;
            setIsApplying(true);
            try {
                const updates = {};
                for (const patch of selectedPatches){
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
                    }
                }
                await onApplyFixes(product.id, updates);
                onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
            } catch (error) {
                console.error('Failed to apply patches:', error);
            } finally{
                setIsApplying(false);
            }
        }
    }["AuditPanel.useCallback[applySelectedPatches]"], [
        patchSelections,
        product.id,
        onApplyFixes,
        onRefresh
    ]);
    // 選択数
    const selectedCount = patchSelections.filter((p)=>p.selected).length;
    const aiPatchCount = patchSelections.filter((p)=>p.source === 'ai').length;
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: onClose,
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 999
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 464,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: 480,
                    height: '100vh',
                    background: 'var(--background)',
                    borderLeft: '1px solid var(--panel-border)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.2)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--panel-border)',
                            background: 'var(--panel)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            fontSize: 16,
                                            fontWeight: 700,
                                            color: 'var(--text)',
                                            margin: 0
                                        },
                                        children: "商品監査"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 505,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 12,
                                            color: 'var(--text-muted)',
                                            margin: '4px 0 0 0'
                                        },
                                        children: [
                                            (_product_title = product.title) === null || _product_title === void 0 ? void 0 : _product_title.slice(0, 40),
                                            (((_product_title1 = product.title) === null || _product_title1 === void 0 ? void 0 : _product_title1.length) || 0) > 40 ? '...' : ''
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 508,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 504,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                style: {
                                    width: 36,
                                    height: 36,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: 8,
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconClose, {}, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                    lineNumber: 527,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 512,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                        lineNumber: 494,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            background: "".concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$audit$2f$audit$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuditSeverityColor"])(auditReport.overallSeverity), "10"),
                            borderBottom: '1px solid var(--panel-border)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 56,
                                            height: 56,
                                            borderRadius: '50%',
                                            background: (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$audit$2f$audit$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuditScoreColor"])(auditReport.score),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: 20,
                                            fontWeight: 700
                                        },
                                        children: auditReport.score
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 543,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: 'var(--text)'
                                                },
                                                children: "監査スコア"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 560,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 12,
                                                    color: 'var(--text-muted)'
                                                },
                                                children: [
                                                    auditReport.results.length,
                                                    "件の問題を検出"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 563,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 559,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 542,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            textAlign: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 20,
                                                    fontWeight: 700,
                                                    color: '#ef4444'
                                                },
                                                children: auditReport.results.filter((r)=>r.severity === 'error').length
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 570,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 10,
                                                    color: 'var(--text-muted)'
                                                },
                                                children: "Error"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 573,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 569,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            textAlign: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 20,
                                                    fontWeight: 700,
                                                    color: '#f59e0b'
                                                },
                                                children: auditReport.results.filter((r)=>r.severity === 'warning').length
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 576,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 10,
                                                    color: 'var(--text-muted)'
                                                },
                                                children: "Warning"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 579,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 575,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            textAlign: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 20,
                                                    fontWeight: 700,
                                                    color: '#3b82f6'
                                                },
                                                children: auditReport.results.filter((r)=>r.severity === 'info').length
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 582,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 10,
                                                    color: 'var(--text-muted)'
                                                },
                                                children: "Info"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 585,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 581,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 568,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                        lineNumber: 532,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            overflow: 'auto',
                            padding: 20
                        },
                        children: [
                            auditReport.needsAiReview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 24,
                                    padding: 16,
                                    background: 'linear-gradient(135deg, #8b5cf610 0%, #6366f110 100%)',
                                    border: '1px solid #8b5cf630',
                                    borderRadius: 12
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconAI, {}, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                        lineNumber: 609,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 14,
                                                            fontWeight: 600,
                                                            color: 'var(--text)'
                                                        },
                                                        children: "AI審査が推奨されます"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                        lineNumber: 610,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 608,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: runAiAudit,
                                                disabled: isAiProcessing,
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    padding: '8px 16px',
                                                    background: isAiProcessing ? 'var(--text-subtle)' : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                                                    border: 'none',
                                                    borderRadius: 8,
                                                    color: '#fff',
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    cursor: isAiProcessing ? 'not-allowed' : 'pointer'
                                                },
                                                children: [
                                                    isAiProcessing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconSpinner, {}, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                        lineNumber: 631,
                                                        columnNumber: 37
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconAI, {}, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                        lineNumber: 631,
                                                        columnNumber: 55
                                                    }, this),
                                                    isAiProcessing ? 'AI分析中...' : 'AI審査を実行'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 614,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 602,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 12,
                                            color: 'var(--text-muted)',
                                            marginBottom: 8
                                        },
                                        children: "以下のフィールドは自動推定が困難です:"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 636,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 6
                                        },
                                        children: auditReport.aiReviewFields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 11,
                                                    padding: '4px 10px',
                                                    background: '#8b5cf620',
                                                    color: '#8b5cf6',
                                                    borderRadius: 12,
                                                    fontWeight: 500
                                                },
                                                children: field
                                            }, field, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 641,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 639,
                                        columnNumber: 15
                                    }, this),
                                    aiError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 12,
                                            padding: '8px 12px',
                                            background: '#ef444420',
                                            borderRadius: 6,
                                            fontSize: 12,
                                            color: '#ef4444'
                                        },
                                        children: [
                                            "⚠️ ",
                                            aiError
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 659,
                                        columnNumber: 17
                                    }, this),
                                    aiCost && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 12,
                                            fontSize: 11,
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                            gap: 12
                                        },
                                        children: [
                                            aiCost.tokens && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "🔢 ",
                                                    aiCost.tokens,
                                                    " tokens"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 679,
                                                columnNumber: 37
                                            }, this),
                                            aiCost.costUsd && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "💰 $",
                                                    aiCost.costUsd.toFixed(4)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 680,
                                                columnNumber: 38
                                            }, this),
                                            aiPatchCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "✅ ",
                                                    aiPatchCount,
                                                    "件の提案を追加"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 681,
                                                columnNumber: 40
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 672,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 595,
                                columnNumber: 13
                            }, this),
                            patchSelections.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: 12
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                    color: 'var(--text)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    margin: 0
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconAutoFix, {}, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                        lineNumber: 705,
                                                        columnNumber: 19
                                                    }, this),
                                                    "修正提案",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 11,
                                                            padding: '2px 8px',
                                                            borderRadius: 10,
                                                            background: '#10b98120',
                                                            color: '#10b981'
                                                        },
                                                        children: [
                                                            patchSelections.length,
                                                            "件"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                        lineNumber: 707,
                                                        columnNumber: 19
                                                    }, this),
                                                    aiPatchCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 11,
                                                            padding: '2px 8px',
                                                            borderRadius: 10,
                                                            background: '#8b5cf620',
                                                            color: '#8b5cf6'
                                                        },
                                                        children: [
                                                            "AI: ",
                                                            aiPatchCount,
                                                            "件"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                        lineNumber: 717,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 696,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    gap: 8
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>selectAll(true),
                                                        style: {
                                                            fontSize: 11,
                                                            padding: '4px 8px',
                                                            background: 'var(--panel)',
                                                            border: '1px solid var(--panel-border)',
                                                            borderRadius: 4,
                                                            color: 'var(--text-muted)',
                                                            cursor: 'pointer'
                                                        },
                                                        children: "全選択"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                        lineNumber: 729,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>selectAll(false),
                                                        style: {
                                                            fontSize: 11,
                                                            padding: '4px 8px',
                                                            background: 'var(--panel)',
                                                            border: '1px solid var(--panel-border)',
                                                            borderRadius: 4,
                                                            color: 'var(--text-muted)',
                                                            cursor: 'pointer'
                                                        },
                                                        children: "全解除"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                        lineNumber: 743,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 728,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 690,
                                        columnNumber: 15
                                    }, this),
                                    patchSelections.map((patch, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FixSuggestionCard, {
                                            patch: patch,
                                            onToggle: ()=>togglePatch(index)
                                        }, "".concat(patch.field, "-").concat(index), false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                            lineNumber: 761,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 689,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: 'var(--text)',
                                            marginBottom: 12,
                                            margin: '0 0 12px 0'
                                        },
                                        children: "監査結果"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 772,
                                        columnNumber: 13
                                    }, this),
                                    auditReport.results.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: 24,
                                            textAlign: 'center',
                                            color: 'var(--text-muted)',
                                            background: 'var(--panel)',
                                            borderRadius: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    color: '#10b981',
                                                    marginBottom: 8
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconCheck, {}, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 791,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 790,
                                                columnNumber: 17
                                            }, this),
                                            "問題は検出されませんでした"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 783,
                                        columnNumber: 15
                                    }, this) : auditReport.results.map((result, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuditResultCard, {
                                            result: result
                                        }, "".concat(result.ruleId, "-").concat(index), false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                            lineNumber: 797,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 771,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 24
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: 'var(--text)',
                                            marginBottom: 12,
                                            margin: '0 0 12px 0'
                                        },
                                        children: "現在のデータ"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 804,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: 'var(--panel)',
                                            borderRadius: 8,
                                            padding: 16,
                                            fontSize: 12
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: '100px 1fr',
                                                gap: '8px 12px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "原産国:"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 821,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: 'monospace'
                                                    },
                                                    children: product.origin_country || '(未設定)'
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 822,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "HTSコード:"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 824,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: 'monospace'
                                                    },
                                                    children: product.hts_code || '(未設定)'
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 825,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "関税率:"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 827,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: 'monospace'
                                                    },
                                                    children: product.hts_duty_rate ? "".concat((product.hts_duty_rate * 100).toFixed(1), "%") : '(未設定)'
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 828,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "素材:"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 832,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: 'monospace'
                                                    },
                                                    children: product.material || '(未設定)'
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 833,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "重量:"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 835,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: 'monospace'
                                                    },
                                                    children: ((_product_listing_data = product.listing_data) === null || _product_listing_data === void 0 ? void 0 : _product_listing_data.weight_g) ? "".concat(product.listing_data.weight_g, "g") : '(未設定)'
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 836,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "利益率:"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 840,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontFamily: 'monospace',
                                                        color: (product.profit_margin || 0) >= 0.15 ? '#10b981' : (product.profit_margin || 0) >= 0 ? '#f59e0b' : '#ef4444'
                                                    },
                                                    children: product.profit_margin ? "".concat((product.profit_margin * 100).toFixed(1), "%") : '(未設定)'
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                    lineNumber: 841,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                            lineNumber: 820,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 814,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 803,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                        lineNumber: 591,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '16px 20px',
                            borderTop: '1px solid var(--panel-border)',
                            background: 'var(--panel)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 12,
                                    color: 'var(--text-muted)'
                                },
                                children: selectedCount > 0 && "".concat(selectedCount, "件の修正を選択中")
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 863,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onClose,
                                        style: {
                                            padding: '10px 20px',
                                            background: 'var(--background)',
                                            border: '1px solid var(--panel-border)',
                                            borderRadius: 8,
                                            color: 'var(--text)',
                                            fontSize: 13,
                                            fontWeight: 500,
                                            cursor: 'pointer'
                                        },
                                        children: "キャンセル"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 867,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: applySelectedPatches,
                                        disabled: selectedCount === 0 || isApplying,
                                        style: {
                                            padding: '10px 20px',
                                            background: selectedCount > 0 ? '#3b82f6' : 'var(--text-subtle)',
                                            border: 'none',
                                            borderRadius: 8,
                                            color: '#fff',
                                            fontSize: 13,
                                            fontWeight: 600,
                                            cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                                            opacity: isApplying ? 0.7 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconAutoFix, {}, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                                lineNumber: 900,
                                                columnNumber: 15
                                            }, this),
                                            isApplying ? '適用中...' : "".concat(selectedCount, "件を適用")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                        lineNumber: 882,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                                lineNumber: 866,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                        lineNumber: 853,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx",
                lineNumber: 478,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(AuditPanel, "mXG0f3eGif2Ea81K0atURR/F2vQ=");
_c12 = AuditPanel;
const __TURBOPACK__default__export__ = AuditPanel;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "IconClose");
__turbopack_context__.k.register(_c1, "IconCheck");
__turbopack_context__.k.register(_c2, "IconWarning");
__turbopack_context__.k.register(_c3, "IconError");
__turbopack_context__.k.register(_c4, "IconInfo");
__turbopack_context__.k.register(_c5, "IconAutoFix");
__turbopack_context__.k.register(_c6, "IconArrowRight");
__turbopack_context__.k.register(_c7, "IconAI");
__turbopack_context__.k.register(_c8, "IconSpinner");
__turbopack_context__.k.register(_c9, "SeverityIcon");
__turbopack_context__.k.register(_c10, "AuditResultCard");
__turbopack_context__.k.register(_c11, "FixSuggestionCard");
__turbopack_context__.k.register(_c12, "AuditPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/panels/index.ts
/**
 * Panels - パネルコンポーネントのエクスポート
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$n3$2d$grouping$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-grouping-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$n3$2d$tools$2d$panel$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-tools-panel-content.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$n3$2d$stats$2d$panel$2d$content$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$panels$2f$audit$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/panels/audit-panel.tsx [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_editing-n3_components_panels_2f50bda4._.js.map