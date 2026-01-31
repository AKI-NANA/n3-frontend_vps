(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/header/n3-page-header.tsx
/**
 * N3PageHeader - ページヘッダーコンポーネント
 * 
 * 責務:
 * - パネルタブ（ツール/フロー/統計/フィルター）
 * - 検索バー
 * - 言語切替/時計/通貨/テーマ切替
 * - 通知/ユーザーメニュー
 */ __turbopack_context__.s([
    "HEADER_HEIGHT",
    ()=>HEADER_HEIGHT,
    "N3PageHeader",
    ()=>N3PageHeader,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/wrench.js [app-client] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/git-branch.js [app-client] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/palette.js [app-client] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-header-tab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$pin$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-pin-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$language$2d$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-language-switch.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$world$2d$clock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-world-clock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$currency$2d$display$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-currency-display.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$notification$2d$bell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-notification-bell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$user$2d$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-user-avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-divider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$search$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-header-search.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// ============================================================
// 定数
// ============================================================
const PANEL_TABS = [
    {
        id: 'tools',
        label: 'ツール',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
            lineNumber: 49,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'flow',
        label: 'フロー',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
            lineNumber: 50,
            columnNumber: 37
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'stats',
        label: '統計',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
            lineNumber: 51,
            columnNumber: 37
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'filter',
        label: 'マーケットプレイス',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
            lineNumber: 52,
            columnNumber: 45
        }, ("TURBOPACK compile-time value", void 0))
    }
];
const CLOCKS_CONFIG = [
    {
        label: "LA",
        tz: "America/Los_Angeles"
    },
    {
        label: "NY",
        tz: "America/New_York"
    },
    {
        label: "DE",
        tz: "Europe/Berlin"
    },
    {
        label: "JP",
        tz: "Asia/Tokyo"
    }
];
const HEADER_HEIGHT = 48;
const N3PageHeader = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3PageHeader(param) {
    let { user, onLogout, language, onLanguageToggle, pinnedTab, onPinnedTabChange, hoveredTab, onHoveredTabChange, isHeaderHovered, onHeaderHoveredChange, selectedCount = 0, onListNow, isListing = false } = param;
    _s();
    const [times, setTimes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [showUserMenu, setShowUserMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showNotifications, setShowNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentColorTheme, setCurrentColorTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('dawn');
    const userMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const notifRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const leaveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isPinned = pinnedTab !== null;
    const activeTab = pinnedTab || hoveredTab;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3PageHeader.N3PageHeader.useEffect": ()=>{
            const theme = localStorage.getItem('n3-color-theme') || 'dawn';
            setCurrentColorTheme(theme);
            document.documentElement.setAttribute('data-theme', theme);
        }
    }["N3PageHeader.N3PageHeader.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3PageHeader.N3PageHeader.useEffect": ()=>{
            const update = {
                "N3PageHeader.N3PageHeader.useEffect.update": ()=>{
                    const t = {};
                    CLOCKS_CONFIG.forEach({
                        "N3PageHeader.N3PageHeader.useEffect.update": (c)=>{
                            t[c.label] = new Date().toLocaleTimeString("en-US", {
                                timeZone: c.tz,
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false
                            });
                        }
                    }["N3PageHeader.N3PageHeader.useEffect.update"]);
                    setTimes(t);
                }
            }["N3PageHeader.N3PageHeader.useEffect.update"];
            update();
            const i = setInterval(update, 30000);
            return ({
                "N3PageHeader.N3PageHeader.useEffect": ()=>clearInterval(i)
            })["N3PageHeader.N3PageHeader.useEffect"];
        }
    }["N3PageHeader.N3PageHeader.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3PageHeader.N3PageHeader.useEffect": ()=>{
            const h = {
                "N3PageHeader.N3PageHeader.useEffect.h": (e)=>{
                    if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
                    if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
                }
            }["N3PageHeader.N3PageHeader.useEffect.h"];
            document.addEventListener("mousedown", h);
            return ({
                "N3PageHeader.N3PageHeader.useEffect": ()=>document.removeEventListener("mousedown", h)
            })["N3PageHeader.N3PageHeader.useEffect"];
        }
    }["N3PageHeader.N3PageHeader.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3PageHeader.N3PageHeader.useEffect": ()=>{
            return ({
                "N3PageHeader.N3PageHeader.useEffect": ()=>{
                    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
                }
            })["N3PageHeader.N3PageHeader.useEffect"];
        }
    }["N3PageHeader.N3PageHeader.useEffect"], []);
    const handleMouseEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3PageHeader.N3PageHeader.useCallback[handleMouseEnter]": ()=>{
            if (leaveTimeoutRef.current) {
                clearTimeout(leaveTimeoutRef.current);
                leaveTimeoutRef.current = null;
            }
            onHeaderHoveredChange(true);
        }
    }["N3PageHeader.N3PageHeader.useCallback[handleMouseEnter]"], [
        onHeaderHoveredChange
    ]);
    const handleMouseLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3PageHeader.N3PageHeader.useCallback[handleMouseLeave]": ()=>{
            if (pinnedTab) return;
            leaveTimeoutRef.current = setTimeout({
                "N3PageHeader.N3PageHeader.useCallback[handleMouseLeave]": ()=>{
                    onHoveredTabChange(null);
                    onHeaderHoveredChange(false);
                }
            }["N3PageHeader.N3PageHeader.useCallback[handleMouseLeave]"], 150);
        }
    }["N3PageHeader.N3PageHeader.useCallback[handleMouseLeave]"], [
        pinnedTab,
        onHoveredTabChange,
        onHeaderHoveredChange
    ]);
    const handleTabMouseEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3PageHeader.N3PageHeader.useCallback[handleTabMouseEnter]": (tabId)=>{
            if (leaveTimeoutRef.current) {
                clearTimeout(leaveTimeoutRef.current);
                leaveTimeoutRef.current = null;
            }
            if (!pinnedTab) onHoveredTabChange(tabId);
            onHeaderHoveredChange(true);
        }
    }["N3PageHeader.N3PageHeader.useCallback[handleTabMouseEnter]"], [
        pinnedTab,
        onHoveredTabChange,
        onHeaderHoveredChange
    ]);
    const handleTabClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3PageHeader.N3PageHeader.useCallback[handleTabClick]": (tabId)=>{
            if (pinnedTab === tabId) {
                onPinnedTabChange(null);
                onHoveredTabChange(null);
                onHeaderHoveredChange(false);
            } else {
                onPinnedTabChange(tabId);
                onHoveredTabChange(null);
            }
        }
    }["N3PageHeader.N3PageHeader.useCallback[handleTabClick]"], [
        pinnedTab,
        onPinnedTabChange,
        onHoveredTabChange,
        onHeaderHoveredChange
    ]);
    const handlePinToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3PageHeader.N3PageHeader.useCallback[handlePinToggle]": ()=>{
            if (pinnedTab) {
                onPinnedTabChange(null);
                onHoveredTabChange(null);
                onHeaderHoveredChange(false);
            } else if (hoveredTab) {
                onPinnedTabChange(hoveredTab);
                onHoveredTabChange(null);
            }
        }
    }["N3PageHeader.N3PageHeader.useCallback[handlePinToggle]"], [
        pinnedTab,
        hoveredTab,
        onPinnedTabChange,
        onHoveredTabChange,
        onHeaderHoveredChange
    ]);
    const handleThemeToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3PageHeader.N3PageHeader.useCallback[handleThemeToggle]": ()=>{
            const ts = [
                'dawn',
                'light',
                'dark',
                'cyber'
            ];
            const n = ts[(ts.indexOf(currentColorTheme) + 1) % ts.length];
            setCurrentColorTheme(n);
            document.documentElement.setAttribute('data-theme', n);
            localStorage.setItem('n3-color-theme', n);
        }
    }["N3PageHeader.N3PageHeader.useCallback[handleThemeToggle]"], [
        currentColorTheme
    ]);
    const clocksData = CLOCKS_CONFIG.map((c)=>({
            label: c.label,
            time: times[c.label] || '--:--'
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        style: {
            height: HEADER_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--glass)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--glass-border)',
            padding: '0 12px',
            flexShrink: 0
        },
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    gap: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$pin$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3PinButton"], {
                        pinned: isPinned,
                        onClick: handlePinToggle
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this),
                    PANEL_TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3HeaderTab"], {
                            id: tab.id,
                            label: tab.label,
                            icon: tab.icon,
                            active: activeTab === tab.id,
                            pinned: pinnedTab === tab.id,
                            onMouseEnter: ()=>handleTabMouseEnter(tab.id),
                            onClick: ()=>handleTabClick(tab.id)
                        }, tab.id, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                            lineNumber: 153,
                            columnNumber: 34
                        }, this)),
                    onListNow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                                orientation: "vertical",
                                style: {
                                    height: 20,
                                    margin: '0 8px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onListNow,
                                disabled: selectedCount === 0 || isListing,
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    borderRadius: '6px',
                                    border: '1px solid',
                                    borderColor: selectedCount > 0 ? 'rgba(245, 158, 11, 0.3)' : 'var(--panel-border)',
                                    background: selectedCount > 0 ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)' : 'var(--panel)',
                                    color: selectedCount > 0 ? 'rgb(245, 158, 11)' : 'var(--text-muted)',
                                    cursor: selectedCount > 0 && !isListing ? 'pointer' : 'not-allowed',
                                    opacity: selectedCount === 0 ? 0.5 : 1,
                                    transition: 'all 0.2s ease',
                                    ...selectedCount > 0 && !isListing && {
                                        ':hover': {
                                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)'
                                        }
                                    }
                                },
                                onMouseEnter: (e)=>{
                                    if (selectedCount > 0 && !isListing) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.2)';
                                    }
                                },
                                onMouseLeave: (e)=>{
                                    if (selectedCount > 0 && !isListing) {
                                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                        lineNumber: 202,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: isListing ? '出品中...' : "今すぐ出品 (".concat(selectedCount, ")")
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                        lineNumber: 203,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                lineNumber: 151,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$search$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3HeaderSearchInput"], {
                    placeholder: "Search...",
                    shortcut: "⌘K",
                    width: 240
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                    lineNumber: 210,
                    columnNumber: 97
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "https://docs.google.com/spreadsheets/d/1lD9ESIhv2oTE6sgL172wOOF9fJAcIy0SHrdhkLNw3MM/edit",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 10px',
                            fontSize: 11,
                            fontWeight: 500,
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.25))',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: 6,
                            color: 'var(--text)',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                        },
                        className: "hover:opacity-80",
                        title: "棚卸しスプレッドシート（新しいタブで開く）",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "シート"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                size: 10,
                                style: {
                                    opacity: 0.6
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 213,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "https://supabase.com/dashboard/project/zdzfpucdyxdlavkgrvil",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 10px',
                            fontSize: 11,
                            fontWeight: 500,
                            background: 'linear-gradient(135deg, rgba(62, 207, 142, 0.15), rgba(62, 207, 142, 0.25))',
                            border: '1px solid rgba(62, 207, 142, 0.3)',
                            borderRadius: 6,
                            color: 'var(--text)',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                        },
                        className: "hover:opacity-80",
                        title: "Supabaseダッシュボード（新しいタブで開く）",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 262,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Supabase"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 263,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                size: 10,
                                style: {
                                    opacity: 0.6
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 264,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.open('/stocktake', '_blank', 'noopener,noreferrer'),
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 10px',
                            fontSize: 11,
                            fontWeight: 500,
                            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.15))',
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            borderRadius: 6,
                            color: 'var(--text)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        },
                        title: "外注用棚卸しツール（新しいタブで開く）",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 285,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "外注ツール"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 286,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                size: 10,
                                style: {
                                    opacity: 0.6
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 287,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                        orientation: "vertical"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$language$2d$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3LanguageSwitch"], {
                        language: language,
                        onToggle: onLanguageToggle
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                        orientation: "vertical"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$world$2d$clock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3WorldClock"], {
                        clocks: clocksData
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 292,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                        orientation: "vertical"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 293,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$currency$2d$display$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3CurrencyDisplay"], {
                        value: 149.50,
                        trend: "up"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                        orientation: "vertical"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleThemeToggle,
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: '1px solid var(--panel-border)',
                            cursor: 'pointer'
                        },
                        title: "Theme: ".concat(currentColorTheme),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                            lineNumber: 296,
                            columnNumber: 259
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                        orientation: "vertical"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        ref: notifRef,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$notification$2d$bell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3NotificationBell"], {
                                count: 3,
                                active: showNotifications,
                                onClick: ()=>setShowNotifications(!showNotifications)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 299,
                                columnNumber: 11
                            }, this),
                            showNotifications && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-dropdown",
                                style: {
                                    width: 280,
                                    right: 0
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-3 py-2 border-b",
                                    style: {
                                        borderColor: 'var(--panel-border)'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-semibold",
                                        children: "Notifications"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                        lineNumber: 300,
                                        columnNumber: 178
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                    lineNumber: 300,
                                    columnNumber: 95
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 300,
                                columnNumber: 33
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 298,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        ref: userMenuRef,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$user$2d$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3UserAvatar"], {
                                name: (user === null || user === void 0 ? void 0 : user.username) || 'User',
                                onClick: ()=>setShowUserMenu(!showUserMenu)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 303,
                                columnNumber: 11
                            }, this),
                            showUserMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-dropdown",
                                style: {
                                    width: 180
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-dropdown-item",
                                    onClick: ()=>{
                                        setShowUserMenu(false);
                                        onLogout();
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                            lineNumber: 304,
                                            columnNumber: 170
                                        }, this),
                                        " Sign out"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                    lineNumber: 304,
                                    columnNumber: 80
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                                lineNumber: 304,
                                columnNumber: 28
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                        lineNumber: 302,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, this);
}, "kVGDTKaZC+qGyMdZ3LTrGlzRt64=")), "kVGDTKaZC+qGyMdZ3LTrGlzRt64=");
_c1 = N3PageHeader;
const __TURBOPACK__default__export__ = N3PageHeader;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3PageHeader$memo");
__turbopack_context__.k.register(_c1, "N3PageHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BulkAuditButton",
    ()=>BulkAuditButton,
    "BulkAuditResultDialog",
    ()=>BulkAuditResultDialog,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$audit$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/services/audit/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$audit$2f$audit$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/services/audit/audit-service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
// ============================================================
// アイコン
// ============================================================
const IconAudit = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 12l2 2 4-4"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                lineNumber: 34,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 3a9 9 0 1 0 9 9"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                lineNumber: 35,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
        lineNumber: 33,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = IconAudit;
const IconWarning = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                lineNumber: 41,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "9",
                x2: "12",
                y2: "13"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                lineNumber: 42,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "17",
                x2: "12.01",
                y2: "17"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                lineNumber: 43,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
        lineNumber: 40,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = IconWarning;
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
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                lineNumber: 49,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "6",
                y1: "6",
                x2: "18",
                y2: "18"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                lineNumber: 50,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
        lineNumber: 48,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c2 = IconClose;
const IconAutoFix = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "14",
        height: "14",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
            lineNumber: 56,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
        lineNumber: 55,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c3 = IconAutoFix;
function BulkAuditResultDialog(param) {
    let { isOpen, onClose, reports, products, onOpenAuditPanel, onApplyAutoFixes } = param;
    _s();
    const [isApplying, setIsApplying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedForAutoFix, setSelectedForAutoFix] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$audit$2f$audit$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateAuditSummary"])(reports);
    // 自動修正可能な商品
    const autoFixableReports = reports.filter((r)=>r.autoFixSuggestions.length > 0);
    // 選択トグル
    const toggleSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BulkAuditResultDialog.useCallback[toggleSelection]": (productId)=>{
            setSelectedForAutoFix({
                "BulkAuditResultDialog.useCallback[toggleSelection]": (prev)=>{
                    const next = new Set(prev);
                    if (next.has(productId)) {
                        next.delete(productId);
                    } else {
                        next.add(productId);
                    }
                    return next;
                }
            }["BulkAuditResultDialog.useCallback[toggleSelection]"]);
        }
    }["BulkAuditResultDialog.useCallback[toggleSelection]"], []);
    // 全選択/全解除
    const selectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BulkAuditResultDialog.useCallback[selectAll]": (selected)=>{
            if (selected) {
                setSelectedForAutoFix(new Set(autoFixableReports.map({
                    "BulkAuditResultDialog.useCallback[selectAll]": (r)=>r.productId
                }["BulkAuditResultDialog.useCallback[selectAll]"])));
            } else {
                setSelectedForAutoFix(new Set());
            }
        }
    }["BulkAuditResultDialog.useCallback[selectAll]"], [
        autoFixableReports
    ]);
    // 自動修正適用
    const handleApplyAutoFixes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BulkAuditResultDialog.useCallback[handleApplyAutoFixes]": async ()=>{
            if (selectedForAutoFix.size === 0) return;
            setIsApplying(true);
            try {
                await onApplyAutoFixes(Array.from(selectedForAutoFix));
                onClose();
            } catch (error) {
                console.error('Failed to apply auto fixes:', error);
            } finally{
                setIsApplying(false);
            }
        }
    }["BulkAuditResultDialog.useCallback[handleApplyAutoFixes]"], [
        selectedForAutoFix,
        onApplyAutoFixes,
        onClose
    ]);
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
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    maxHeight: '80vh',
                    background: 'var(--background)',
                    borderRadius: 12,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--panel-border)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: 'var(--text)',
                                    margin: 0
                                },
                                children: "一括監査結果"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                style: {
                                    width: 32,
                                    height: 32,
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
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                    lineNumber: 180,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                lineNumber: 165,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, 1fr)',
                            gap: 12,
                            padding: '16px 20px',
                            background: 'var(--panel)',
                            borderBottom: '1px solid var(--panel-border)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 24,
                                            fontWeight: 700,
                                            color: 'var(--text)'
                                        },
                                        children: summary.total
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 196,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 11,
                                            color: 'var(--text-muted)'
                                        },
                                        children: "監査対象"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 197,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                lineNumber: 195,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 24,
                                            fontWeight: 700,
                                            color: '#ef4444'
                                        },
                                        children: summary.errorCount
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 200,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 11,
                                            color: 'var(--text-muted)'
                                        },
                                        children: "Error"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 201,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                lineNumber: 199,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 24,
                                            fontWeight: 700,
                                            color: '#f59e0b'
                                        },
                                        children: summary.warningCount
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 11,
                                            color: 'var(--text-muted)'
                                        },
                                        children: "Warning"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 205,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 24,
                                            fontWeight: 700,
                                            color: '#10b981'
                                        },
                                        children: summary.okCount
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 11,
                                            color: 'var(--text-muted)'
                                        },
                                        children: "OK"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 209,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                lineNumber: 207,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 24,
                                            fontWeight: 700,
                                            color: '#3b82f6'
                                        },
                                        children: summary.autoFixableCount
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 11,
                                            color: 'var(--text-muted)'
                                        },
                                        children: "自動修正可"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 213,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            overflow: 'auto',
                            padding: 20
                        },
                        children: [
                            autoFixableReports.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: 20
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
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    color: 'var(--text)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8,
                                                    margin: 0
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconAutoFix, {}, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                        lineNumber: 237,
                                                        columnNumber: 19
                                                    }, this),
                                                    "自動修正可能 (",
                                                    autoFixableReports.length,
                                                    "件)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                lineNumber: 228,
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
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                        lineNumber: 241,
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
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                        lineNumber: 255,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                lineNumber: 240,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 222,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: 'var(--panel)',
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                            border: '1px solid var(--panel-border)'
                                        },
                                        children: autoFixableReports.map((report)=>{
                                            var _product_title, _product_title1;
                                            const product = products.find((p)=>p.id === report.productId);
                                            if (!product) return null;
                                            const isSelected = selectedForAutoFix.has(report.productId);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                onClick: ()=>toggleSelection(report.productId),
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 12,
                                                    padding: '10px 12px',
                                                    borderBottom: '1px solid var(--panel-border)',
                                                    cursor: 'pointer',
                                                    background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: 18,
                                                            height: 18,
                                                            borderRadius: 4,
                                                            border: "2px solid ".concat(isSelected ? '#3b82f6' : 'var(--text-subtle)'),
                                                            background: isSelected ? '#3b82f6' : 'transparent',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0
                                                        },
                                                        children: isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            width: "12",
                                                            height: "12",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "#fff",
                                                            strokeWidth: "3",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                                points: "20 6 9 17 4 12"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                                lineNumber: 313,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                            lineNumber: 312,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                        lineNumber: 298,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            flex: 1,
                                                            minWidth: 0
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: 12,
                                                                    color: 'var(--text)',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                                },
                                                                children: [
                                                                    (_product_title = product.title) === null || _product_title === void 0 ? void 0 : _product_title.slice(0, 50),
                                                                    (((_product_title1 = product.title) === null || _product_title1 === void 0 ? void 0 : _product_title1.length) || 0) > 50 ? '...' : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                                lineNumber: 318,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: 10,
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                children: report.autoFixSuggestions.map((s)=>s.field).join(', ')
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                                lineNumber: 327,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                        lineNumber: 317,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            onOpenAuditPanel(product);
                                                            onClose();
                                                        },
                                                        style: {
                                                            fontSize: 10,
                                                            padding: '4px 8px',
                                                            background: 'var(--background)',
                                                            border: '1px solid var(--panel-border)',
                                                            borderRadius: 4,
                                                            color: 'var(--text-muted)',
                                                            cursor: 'pointer'
                                                        },
                                                        children: "詳細"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                        lineNumber: 331,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, String(report.productId), true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                lineNumber: 285,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 272,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                lineNumber: 221,
                                columnNumber: 13
                            }, this),
                            reports.filter((r)=>r.overallSeverity !== 'ok' && r.autoFixSuggestions.length === 0).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: 'var(--text)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            margin: '0 0 12px 0'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconWarning, {}, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                lineNumber: 368,
                                                columnNumber: 17
                                            }, this),
                                            "要確認（手動対応）"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 359,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: 'var(--panel)',
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                            border: '1px solid var(--panel-border)'
                                        },
                                        children: reports.filter((r)=>r.overallSeverity !== 'ok' && r.autoFixSuggestions.length === 0).slice(0, 10).map((report)=>{
                                            var _product_title, _product_title1;
                                            const product = products.find((p)=>p.id === report.productId);
                                            if (!product) return null;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 12,
                                                    padding: '10px 12px',
                                                    borderBottom: '1px solid var(--panel-border)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: 6,
                                                            background: report.overallSeverity === 'error' ? '#ef444420' : '#f59e0b20',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: report.overallSeverity === 'error' ? '#ef4444' : '#f59e0b',
                                                            fontSize: 11,
                                                            fontWeight: 700
                                                        },
                                                        children: report.score
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                        lineNumber: 396,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            flex: 1,
                                                            minWidth: 0
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: 12,
                                                                    color: 'var(--text)',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                                },
                                                                children: [
                                                                    (_product_title = product.title) === null || _product_title === void 0 ? void 0 : _product_title.slice(0, 50),
                                                                    (((_product_title1 = product.title) === null || _product_title1 === void 0 ? void 0 : _product_title1.length) || 0) > 50 ? '...' : ''
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                                lineNumber: 413,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: 10,
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                children: [
                                                                    report.results.length,
                                                                    "件の問題"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                                lineNumber: 422,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                        lineNumber: 412,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            onOpenAuditPanel(product);
                                                            onClose();
                                                        },
                                                        style: {
                                                            fontSize: 10,
                                                            padding: '4px 8px',
                                                            background: 'var(--background)',
                                                            border: '1px solid var(--panel-border)',
                                                            borderRadius: 4,
                                                            color: 'var(--text-muted)',
                                                            cursor: 'pointer'
                                                        },
                                                        children: "詳細"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                        lineNumber: 426,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, String(report.productId), true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                lineNumber: 386,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 372,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                lineNumber: 358,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '16px 20px',
                            borderTop: '1px solid var(--panel-border)',
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
                                children: selectedForAutoFix.size > 0 && "".concat(selectedForAutoFix.size, "件を選択中")
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                lineNumber: 461,
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
                                            background: 'var(--panel)',
                                            border: '1px solid var(--panel-border)',
                                            borderRadius: 8,
                                            color: 'var(--text)',
                                            fontSize: 13,
                                            fontWeight: 500,
                                            cursor: 'pointer'
                                        },
                                        children: "閉じる"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 465,
                                        columnNumber: 13
                                    }, this),
                                    autoFixableReports.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleApplyAutoFixes,
                                        disabled: selectedForAutoFix.size === 0 || isApplying,
                                        style: {
                                            padding: '10px 20px',
                                            background: selectedForAutoFix.size > 0 ? '#10b981' : 'var(--text-subtle)',
                                            border: 'none',
                                            borderRadius: 8,
                                            color: '#fff',
                                            fontSize: 13,
                                            fontWeight: 600,
                                            cursor: selectedForAutoFix.size > 0 ? 'pointer' : 'not-allowed',
                                            opacity: isApplying ? 0.7 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconAutoFix, {}, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                                lineNumber: 499,
                                                columnNumber: 17
                                            }, this),
                                            isApplying ? '適用中...' : "".concat(selectedForAutoFix.size, "件を自動修正")
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                        lineNumber: 481,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                                lineNumber: 464,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                        lineNumber: 452,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(BulkAuditResultDialog, "B1zrqbNgrNJwAu/+zv6QvMDJ+zs=");
_c4 = BulkAuditResultDialog;
function BulkAuditButton(param) {
    let { selectedProducts, onAuditComplete, onOpenAuditPanel, onRefresh, disabled } = param;
    _s1();
    const [isAuditing, setIsAuditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showResults, setShowResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [auditReports, setAuditReports] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const handleAudit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BulkAuditButton.useCallback[handleAudit]": async ()=>{
            if (selectedProducts.length === 0) return;
            setIsAuditing(true);
            try {
                // クライアントサイドで監査実行
                const reports = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$services$2f$audit$2f$audit$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auditProducts"])(selectedProducts);
                setAuditReports(reports);
                setShowResults(true);
                onAuditComplete === null || onAuditComplete === void 0 ? void 0 : onAuditComplete(reports);
                // サーバーに監査結果を保存（オプション）
                try {
                    await fetch('/api/products/audit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            productIds: selectedProducts.map({
                                "BulkAuditButton.useCallback[handleAudit]": (p)=>p.id
                            }["BulkAuditButton.useCallback[handleAudit]"]),
                            saveToDb: true
                        })
                    });
                } catch (error) {
                    console.warn('Failed to save audit results to DB:', error);
                }
            } catch (error) {
                console.error('Failed to audit products:', error);
            } finally{
                setIsAuditing(false);
            }
        }
    }["BulkAuditButton.useCallback[handleAudit]"], [
        selectedProducts,
        onAuditComplete
    ]);
    const handleApplyAutoFixes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BulkAuditButton.useCallback[handleApplyAutoFixes]": async (productIds)=>{
            // 選択された商品のautoFixSuggestionsを適用
            const updates = [];
            for (const productId of productIds){
                const report = auditReports.find({
                    "BulkAuditButton.useCallback[handleApplyAutoFixes].report": (r)=>r.productId === productId
                }["BulkAuditButton.useCallback[handleApplyAutoFixes].report"]);
                if (!report || report.autoFixSuggestions.length === 0) continue;
                updates.push({
                    id: productId,
                    patches: report.autoFixSuggestions.map({
                        "BulkAuditButton.useCallback[handleApplyAutoFixes]": (s)=>({
                                field: s.field,
                                suggestedValue: s.suggestedValue,
                                confidence: s.confidence,
                                reason: s.reason
                            })
                    }["BulkAuditButton.useCallback[handleApplyAutoFixes]"])
                });
            }
            if (updates.length === 0) return;
            // APIに送信
            const response = await fetch('/api/products/audit-patch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: updates,
                    source: 'rule_auto',
                    model: 'audit-service'
                })
            });
            if (!response.ok) {
                throw new Error('Failed to apply auto fixes');
            }
            // 結果をログ
            const result = await response.json();
            console.log('Auto fix result:', result);
            // 🔥 リフレッシュコールバックを呼び出し
            onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
        }
    }["BulkAuditButton.useCallback[handleApplyAutoFixes]"], [
        auditReports,
        onRefresh
    ]);
    const isDisabled = disabled || selectedProducts.length === 0 || isAuditing;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleAudit,
                disabled: isDisabled,
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 12px',
                    background: isDisabled ? 'var(--text-subtle)' : '#3b82f6',
                    border: 'none',
                    borderRadius: 6,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isAuditing ? 0.7 : 1
                },
                title: selectedProducts.length === 0 ? '商品を選択してください' : "".concat(selectedProducts.length, "件を監査"),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IconAudit, {}, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                        lineNumber: 623,
                        columnNumber: 9
                    }, this),
                    isAuditing ? '監査中...' : "監査 (".concat(selectedProducts.length, ")")
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                lineNumber: 604,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BulkAuditResultDialog, {
                isOpen: showResults,
                onClose: ()=>setShowResults(false),
                reports: auditReports,
                products: selectedProducts,
                onOpenAuditPanel: (product)=>{
                    onOpenAuditPanel === null || onOpenAuditPanel === void 0 ? void 0 : onOpenAuditPanel(product);
                },
                onApplyAutoFixes: handleApplyAutoFixes
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx",
                lineNumber: 628,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s1(BulkAuditButton, "G2DFwGyTak14uHiDZvR8MJsjeU8=");
_c5 = BulkAuditButton;
const __TURBOPACK__default__export__ = BulkAuditButton;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "IconAudit");
__turbopack_context__.k.register(_c1, "IconWarning");
__turbopack_context__.k.register(_c2, "IconClose");
__turbopack_context__.k.register(_c3, "IconAutoFix");
__turbopack_context__.k.register(_c4, "BulkAuditResultDialog");
__turbopack_context__.k.register(_c5, "BulkAuditButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/header/n3-sub-toolbar.tsx
/**
 * N3SubToolbar - サブツールバーコンポーネント
 * 
 * 責務:
 * - Tips/Fastボタン
 * - ページサイズ選択
 * - ソート設定（棚卸しタブ用）
 * - ビューモード切替
 * - 🔥 一括監査ボタン
 */ __turbopack_context__.s([
    "N3SubToolbar",
    ()=>N3SubToolbar,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$view$2d$mode$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-view-mode-toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-divider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$bulk$2d$audit$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/bulk-audit-button.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
const N3SubToolbar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3SubToolbar(param) {
    let { tipsEnabled, onTipsToggle, fastMode, onFastModeToggle, pageSize, onPageSizeChange, displayCount, totalCount, viewMode, onViewModeChange, isInventoryTab, sortOption, onSortOptionChange, selectedProducts, onOpenAuditPanel, onAuditComplete } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--panel)',
            borderBottom: '1px solid var(--panel-border)',
            padding: '0 12px',
            flexShrink: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                },
                children: [
                    selectedProducts && onOpenAuditPanel && !isInventoryTab && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$bulk$2d$audit$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BulkAuditButton"], {
                                selectedProducts: selectedProducts,
                                onOpenAuditPanel: onOpenAuditPanel,
                                onRefresh: onAuditComplete
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                                orientation: "vertical",
                                style: {
                                    height: 20,
                                    margin: '0 4px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Tooltip"], {
                        content: "Tips切り替え",
                        position: "bottom",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onTipsToggle,
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '4px 8px',
                                fontSize: '11px',
                                background: tipsEnabled ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                border: '1px solid',
                                borderColor: tipsEnabled ? 'rgba(59, 130, 246, 0.3)' : 'var(--panel-border)',
                                borderRadius: '4px',
                                color: tipsEnabled ? 'rgb(59, 130, 246)' : 'var(--text-muted)',
                                cursor: 'pointer'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                                    size: 12
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                    lineNumber: 98,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Tips"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                    lineNumber: 98,
                                    columnNumber: 36
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onFastModeToggle,
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 8px',
                            fontSize: '11px',
                            background: fastMode ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                            border: '1px solid',
                            borderColor: fastMode ? 'rgba(245, 158, 11, 0.3)' : 'var(--panel-border)',
                            borderRadius: '4px',
                            color: fastMode ? 'rgb(245, 158, 11)' : 'var(--text-muted)',
                            cursor: 'pointer'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Fast"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                lineNumber: 111,
                                columnNumber: 28
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: pageSize,
                        onChange: (e)=>onPageSizeChange(Number(e.target.value)),
                        style: {
                            height: 28,
                            padding: '0 8px',
                            fontSize: '11px',
                            border: '1px solid var(--panel-border)',
                            borderRadius: '4px',
                            background: 'var(--panel)',
                            color: 'var(--text)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: 10,
                                children: "10"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                lineNumber: 119,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: 50,
                                children: "50"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: 100,
                                children: "100"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: 500,
                                children: "500"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '12px',
                            color: 'var(--text-muted)'
                        },
                        children: [
                            displayCount,
                            "/",
                            totalCount,
                            "件"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    isInventoryTab && sortOption && onSortOptionChange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                                orientation: "vertical",
                                style: {
                                    height: 20,
                                    margin: '0 8px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)'
                                },
                                children: "並び順:"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: sortOption.field,
                                onChange: (e)=>onSortOptionChange({
                                        ...sortOption,
                                        field: e.target.value
                                    }),
                                style: {
                                    height: 28,
                                    padding: '0 8px',
                                    fontSize: '11px',
                                    border: '1px solid var(--panel-border)',
                                    borderRadius: '4px',
                                    background: 'var(--panel)',
                                    color: 'var(--text)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "created_at",
                                        children: "登録日"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "updated_at",
                                        children: "更新日"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "product_name",
                                        children: "商品名"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "sku",
                                        children: "SKU"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "cost_price",
                                        children: "原価"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                        lineNumber: 140,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                lineNumber: 131,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onSortOptionChange({
                                        ...sortOption,
                                        order: sortOption.order === 'desc' ? 'asc' : 'desc'
                                    }),
                                style: {
                                    height: 28,
                                    width: 28,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid var(--panel-border)',
                                    borderRadius: '4px',
                                    background: 'var(--panel)',
                                    color: 'var(--text)',
                                    cursor: 'pointer'
                                },
                                children: sortOption.order === 'desc' ? '↓' : '↑'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$view$2d$mode$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3ViewModeToggle"], {
                value: viewMode,
                onChange: onViewModeChange,
                size: "sm",
                showLabels: true
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
});
_c1 = N3SubToolbar;
const __TURBOPACK__default__export__ = N3SubToolbar;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3SubToolbar$memo");
__turbopack_context__.k.register(_c1, "N3SubToolbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/header/n3-global-filter-bar.tsx
/**
 * N3GlobalFilterBar - グローバルフィルターバー（拡張版）
 * 
 * フィルターボタンをクリックでモーダル展開
 * 位置: サブツールバーの直下
 * 
 * フィルター項目（グループ別）:
 * 
 * 【基本】
 * - 保管場所 (env / plus1)
 * - L1-L3属性 (連動プルダウン)
 * - 在庫数 (範囲)
 * - 商品タイプ (有在庫/無在庫)
 * - アカウント (MJT/GREEN/Mystical)
 * 
 * 【価格・原価】
 * - 仕入れ値 (範囲)
 * - 販売価格USD (範囲)
 * - 利益率 (範囲)
 * - Pricing種類 (RATE/COST/ST)
 * 
 * 【分類・属性】
 * - カテゴリー (プルダウン)
 * - 原産国 (プルダウン)
 * - 素材 (プルダウン)
 * - 仕入先 (プルダウン)
 * 
 * 【関税・HTS】
 * - HTSコード (テキスト)
 * - HTS関税率 (範囲)
 * 
 * 【スコア・配送】
 * - Listing Score (範囲)
 * - 配送方法 (プルダウン)
 */ __turbopack_context__.s([
    "DEFAULT_FILTER_STATE",
    ()=>DEFAULT_FILTER_STATE,
    "N3GlobalFilterBar",
    ()=>N3GlobalFilterBar,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const DEFAULT_FILTER_STATE = {
    storageLocation: null,
    attrL1: null,
    attrL2: null,
    attrL3: null,
    stockMin: null,
    stockMax: null,
    productType: [],
    account: [],
    searchQuery: '',
    costMin: null,
    costMax: null,
    priceUsdMin: null,
    priceUsdMax: null,
    profitMarginMin: null,
    profitMarginMax: null,
    pricingType: [],
    category: null,
    originCountry: null,
    material: null,
    source: null,
    htsCode: null,
    htsDutyRateMin: null,
    htsDutyRateMax: null,
    listingScoreMin: null,
    listingScoreMax: null,
    shippingMethod: null
};
// ============================================================
// 定数（選択肢）
// ============================================================
const STORAGE_OPTIONS = [
    {
        value: null,
        label: 'すべて'
    },
    {
        value: 'env',
        label: 'env'
    },
    {
        value: 'plus1',
        label: 'plus1'
    }
];
const PRODUCT_TYPE_OPTIONS = [
    {
        value: 'stock',
        label: '有在庫',
        color: '#22c55e'
    },
    {
        value: 'dropship',
        label: '無在庫',
        color: '#3b82f6'
    }
];
const ACCOUNT_OPTIONS = [
    {
        value: 'MJT',
        label: 'MJT',
        color: '#3b82f6'
    },
    {
        value: 'GREEN',
        label: 'GREEN',
        color: '#22c55e'
    },
    {
        value: 'mystical-japan-treasures',
        label: 'Mystical',
        color: '#8b5cf6'
    }
];
const PRICING_TYPE_OPTIONS = [
    {
        value: 'RATE',
        label: 'RATE',
        color: '#f59e0b'
    },
    {
        value: 'COST',
        label: 'COST¥',
        color: '#ef4444'
    },
    {
        value: 'ST',
        label: 'ST',
        color: '#8b5cf6'
    }
];
const SOURCE_OPTIONS = [
    {
        value: 'yahoo_auction',
        label: 'ヤフオク'
    },
    {
        value: 'mercari',
        label: 'メルカリ'
    },
    {
        value: 'rakuma',
        label: 'ラクマ'
    },
    {
        value: 'amazon_jp',
        label: 'Amazon JP'
    },
    {
        value: 'manual',
        label: '手動登録'
    }
];
const ORIGIN_COUNTRY_OPTIONS = [
    {
        value: 'JP',
        label: '日本 (JP)'
    },
    {
        value: 'CN',
        label: '中国 (CN)'
    },
    {
        value: 'TW',
        label: '台湾 (TW)'
    },
    {
        value: 'KR',
        label: '韓国 (KR)'
    },
    {
        value: 'US',
        label: 'アメリカ (US)'
    },
    {
        value: 'VN',
        label: 'ベトナム (VN)'
    },
    {
        value: 'TH',
        label: 'タイ (TH)'
    },
    {
        value: 'OTHER',
        label: 'その他'
    }
];
const SHIPPING_METHOD_OPTIONS = [
    {
        value: 'economy',
        label: 'Economy'
    },
    {
        value: 'standard',
        label: 'Standard'
    },
    {
        value: 'expedited',
        label: 'Expedited'
    },
    {
        value: 'express',
        label: 'Express'
    }
];
// ============================================================
// サブコンポーネント
// ============================================================
/** セクションヘッダー（折りたたみ可能） */ const CollapsibleSection = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s(function CollapsibleSection(param) {
    let { icon: Icon, label, children, defaultOpen = true } = param;
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultOpen);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            marginBottom: 16
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    width: '100%',
                    padding: '8px 0',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--panel-border)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                        size: 14,
                        style: {
                            color: 'var(--accent)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 215,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            flex: 1,
                            textAlign: 'left',
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--text)'
                        },
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 216,
                        columnNumber: 9
                    }, this),
                    isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                        size: 14,
                        color: "var(--text-muted)"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 225,
                        columnNumber: 19
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                        size: 14,
                        color: "var(--text-muted)"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 225,
                        columnNumber: 71
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px 0'
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                lineNumber: 228,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
        lineNumber: 200,
        columnNumber: 5
    }, this);
}, "QSEG/+wAbCqYSsrjeAEeSTwR0QA="));
_c = CollapsibleSection;
/** ラジオボタングループ */ const RadioGroup = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function RadioGroup(param) {
    let { options, value, onChange } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap'
        },
        children: options.map((opt)=>{
            var _opt_value;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                    color: value === opt.value ? 'var(--accent)' : 'var(--text)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>onChange(opt.value),
                        style: {
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: value === opt.value ? 'var(--accent)' : 'var(--panel-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        children: value === opt.value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background: 'var(--accent)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                            lineNumber: 274,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 260,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        onClick: ()=>onChange(opt.value),
                        children: opt.label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this)
                ]
            }, (_opt_value = opt.value) !== null && _opt_value !== void 0 ? _opt_value : 'all', true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                lineNumber: 249,
                columnNumber: 9
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
        lineNumber: 247,
        columnNumber: 5
    }, this);
});
_c1 = RadioGroup;
/** チェックボックスグループ */ const CheckboxGroup = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function CheckboxGroup(param) {
    let { options, values, onChange } = param;
    const handleToggle = (value)=>{
        if (values.includes(value)) {
            onChange(values.filter((v)=>v !== value));
        } else {
            onChange([
                ...values,
                value
            ]);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap'
        },
        children: options.map((opt)=>{
            const isChecked = values.includes(opt.value);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    fontSize: 12,
                    color: isChecked ? opt.color || 'var(--accent)' : 'var(--text)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>handleToggle(opt.value),
                        style: {
                            width: 16,
                            height: 16,
                            borderRadius: 3,
                            border: '2px solid',
                            borderColor: isChecked ? opt.color || 'var(--accent)' : 'var(--panel-border)',
                            background: isChecked ? opt.color || 'var(--accent)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        children: isChecked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                            size: 10,
                            color: "white",
                            strokeWidth: 3
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                            lineNumber: 337,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 323,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        onClick: ()=>handleToggle(opt.value),
                        children: opt.label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 339,
                        columnNumber: 13
                    }, this)
                ]
            }, opt.value, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                lineNumber: 312,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
        lineNumber: 308,
        columnNumber: 5
    }, this);
});
_c2 = CheckboxGroup;
/** プルダウン */ const SelectDropdown = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function SelectDropdown(param) {
    let { value, options, onChange, disabled = false, placeholder = '選択' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
        value: value || '',
        onChange: (e)=>onChange(e.target.value || null),
        disabled: disabled,
        style: {
            padding: '6px 10px',
            fontSize: 12,
            border: '1px solid var(--panel-border)',
            borderRadius: 4,
            background: disabled ? 'var(--highlight)' : 'var(--panel)',
            color: disabled ? 'var(--text-muted)' : 'var(--text)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            minWidth: 120
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                value: "",
                children: placeholder
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                lineNumber: 377,
                columnNumber: 7
            }, this),
            options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                    value: opt.value,
                    children: opt.label
                }, opt.value, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                    lineNumber: 379,
                    columnNumber: 9
                }, this))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
        lineNumber: 362,
        columnNumber: 5
    }, this);
});
_c3 = SelectDropdown;
/** 数値範囲入力 */ const NumberRangeInput = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function NumberRangeInput(param) {
    let { minValue, maxValue, onMinChange, onMaxChange, minPlaceholder = '最小', maxPlaceholder = '最大', prefix = '', suffix = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 6
        },
        children: [
            prefix && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: 11,
                    color: 'var(--text-muted)'
                },
                children: prefix
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                lineNumber: 407,
                columnNumber: 18
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "number",
                value: minValue !== null && minValue !== void 0 ? minValue : '',
                onChange: (e)=>onMinChange(e.target.value ? parseFloat(e.target.value) : null),
                placeholder: minPlaceholder,
                style: {
                    width: 70,
                    padding: '6px 8px',
                    fontSize: 12,
                    border: '1px solid var(--panel-border)',
                    borderRadius: 4,
                    background: 'var(--panel)',
                    color: 'var(--text)'
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                lineNumber: 408,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    color: 'var(--text-muted)',
                    fontSize: 11
                },
                children: "〜"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                lineNumber: 423,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "number",
                value: maxValue !== null && maxValue !== void 0 ? maxValue : '',
                onChange: (e)=>onMaxChange(e.target.value ? parseFloat(e.target.value) : null),
                placeholder: maxPlaceholder,
                style: {
                    width: 70,
                    padding: '6px 8px',
                    fontSize: 12,
                    border: '1px solid var(--panel-border)',
                    borderRadius: 4,
                    background: 'var(--panel)',
                    color: 'var(--text)'
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                lineNumber: 424,
                columnNumber: 7
            }, this),
            suffix && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: 11,
                    color: 'var(--text-muted)'
                },
                children: suffix
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                lineNumber: 439,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
        lineNumber: 406,
        columnNumber: 5
    }, this);
});
_c4 = NumberRangeInput;
/** テキスト入力 */ const TextInput = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function TextInput(param) {
    let { value, onChange, placeholder = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: "text",
        value: value || '',
        onChange: (e)=>onChange(e.target.value || null),
        placeholder: placeholder,
        style: {
            padding: '6px 10px',
            fontSize: 12,
            border: '1px solid var(--panel-border)',
            borderRadius: 4,
            background: 'var(--panel)',
            color: 'var(--text)',
            minWidth: 150
        }
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
        lineNumber: 455,
        columnNumber: 5
    }, this);
});
_c5 = TextInput;
/** フィルターラベル付き行 */ const FilterRow = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function FilterRow(param) {
    let { label, children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 10
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    minWidth: 80,
                    flexShrink: 0
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                lineNumber: 488,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
        lineNumber: 482,
        columnNumber: 5
    }, this);
});
_c6 = FilterRow;
const N3GlobalFilterBar = /*#__PURE__*/ _s1((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c7 = _s1(function N3GlobalFilterBar(param) {
    let { filters, onFiltersChange, onApply } = param;
    _s1();
    const [isPanelOpen, setIsPanelOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchInput, setSearchInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(filters.searchQuery);
    // L1-L3属性オプション（API連動）
    const [l1Options, setL1Options] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [l2Options, setL2Options] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [l3Options, setL3Options] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categoryOptions, setCategoryOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // アクティブフィルター数
    const activeCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3GlobalFilterBar.N3GlobalFilterBar.useMemo[activeCount]": ()=>{
            let count = 0;
            if (filters.storageLocation) count++;
            if (filters.attrL1) count++;
            if (filters.attrL2) count++;
            if (filters.attrL3) count++;
            if (filters.stockMin !== null || filters.stockMax !== null) count++;
            if (filters.productType.length) count++;
            if (filters.account.length) count++;
            if (filters.searchQuery) count++;
            if (filters.costMin !== null || filters.costMax !== null) count++;
            if (filters.priceUsdMin !== null || filters.priceUsdMax !== null) count++;
            if (filters.profitMarginMin !== null || filters.profitMarginMax !== null) count++;
            if (filters.pricingType.length) count++;
            if (filters.category) count++;
            if (filters.originCountry) count++;
            if (filters.material) count++;
            if (filters.source) count++;
            if (filters.htsCode) count++;
            if (filters.htsDutyRateMin !== null || filters.htsDutyRateMax !== null) count++;
            if (filters.listingScoreMin !== null || filters.listingScoreMax !== null) count++;
            if (filters.shippingMethod) count++;
            return count;
        }
    }["N3GlobalFilterBar.N3GlobalFilterBar.useMemo[activeCount]"], [
        filters
    ]);
    // アクティブフィルターのバッジ表示用
    const activeBadges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3GlobalFilterBar.N3GlobalFilterBar.useMemo[activeBadges]": ()=>{
            const badges = [];
            if (filters.storageLocation) badges.push({
                label: "場所:".concat(filters.storageLocation),
                color: '#6366f1'
            });
            if (filters.productType.length) badges.push({
                label: filters.productType.map({
                    "N3GlobalFilterBar.N3GlobalFilterBar.useMemo[activeBadges]": (t)=>t === 'stock' ? '有在庫' : '無在庫'
                }["N3GlobalFilterBar.N3GlobalFilterBar.useMemo[activeBadges]"]).join('/'),
                color: '#22c55e'
            });
            if (filters.account.length) badges.push({
                label: filters.account.join('/'),
                color: '#3b82f6'
            });
            if (filters.category) badges.push({
                label: "Cat:".concat(filters.category.slice(0, 10)),
                color: '#f59e0b'
            });
            if (filters.originCountry) badges.push({
                label: "国:".concat(filters.originCountry),
                color: '#8b5cf6'
            });
            if (filters.pricingType.length) badges.push({
                label: "Pricing:".concat(filters.pricingType.join('/')),
                color: '#ef4444'
            });
            if (filters.listingScoreMin !== null || filters.listingScoreMax !== null) {
                var _filters_listingScoreMin, _filters_listingScoreMax;
                badges.push({
                    label: "Score:".concat((_filters_listingScoreMin = filters.listingScoreMin) !== null && _filters_listingScoreMin !== void 0 ? _filters_listingScoreMin : 0, "-").concat((_filters_listingScoreMax = filters.listingScoreMax) !== null && _filters_listingScoreMax !== void 0 ? _filters_listingScoreMax : 100),
                    color: '#14b8a6'
                });
            }
            return badges.slice(0, 4); // 最大4つまで表示
        }
    }["N3GlobalFilterBar.N3GlobalFilterBar.useMemo[activeBadges]"], [
        filters
    ]);
    // L1オプションを取得
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3GlobalFilterBar.N3GlobalFilterBar.useEffect": ()=>{
            const fetchL1Options = {
                "N3GlobalFilterBar.N3GlobalFilterBar.useEffect.fetchL1Options": async ()=>{
                    try {
                        const res = await fetch('/api/inventory/attribute-options');
                        const data = await res.json();
                        if (data.success) {
                            setL1Options(data.l1Options || []);
                        }
                    } catch (err) {
                        console.error('[N3GlobalFilterBar] Failed to fetch L1 options:', err);
                    }
                }
            }["N3GlobalFilterBar.N3GlobalFilterBar.useEffect.fetchL1Options"];
            fetchL1Options();
        }
    }["N3GlobalFilterBar.N3GlobalFilterBar.useEffect"], []);
    // L1選択時にL2オプションを取得
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3GlobalFilterBar.N3GlobalFilterBar.useEffect": ()=>{
            if (!filters.attrL1) {
                setL2Options([]);
                setL3Options([]);
                return;
            }
            const fetchL2Options = {
                "N3GlobalFilterBar.N3GlobalFilterBar.useEffect.fetchL2Options": async ()=>{
                    try {
                        const res = await fetch("/api/inventory/attribute-options?l1=".concat(encodeURIComponent(filters.attrL1)));
                        const data = await res.json();
                        if (data.success) {
                            setL2Options(data.l2Options || []);
                        }
                    } catch (err) {
                        console.error('[N3GlobalFilterBar] Failed to fetch L2 options:', err);
                    }
                }
            }["N3GlobalFilterBar.N3GlobalFilterBar.useEffect.fetchL2Options"];
            fetchL2Options();
        }
    }["N3GlobalFilterBar.N3GlobalFilterBar.useEffect"], [
        filters.attrL1
    ]);
    // L2選択時にL3オプションを取得
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3GlobalFilterBar.N3GlobalFilterBar.useEffect": ()=>{
            if (!filters.attrL1 || !filters.attrL2) {
                setL3Options([]);
                return;
            }
            const fetchL3Options = {
                "N3GlobalFilterBar.N3GlobalFilterBar.useEffect.fetchL3Options": async ()=>{
                    try {
                        const res = await fetch("/api/inventory/attribute-options?l1=".concat(encodeURIComponent(filters.attrL1), "&l2=").concat(encodeURIComponent(filters.attrL2)));
                        const data = await res.json();
                        if (data.success) {
                            setL3Options(data.l3Options || []);
                        }
                    } catch (err) {
                        console.error('[N3GlobalFilterBar] Failed to fetch L3 options:', err);
                    }
                }
            }["N3GlobalFilterBar.N3GlobalFilterBar.useEffect.fetchL3Options"];
            fetchL3Options();
        }
    }["N3GlobalFilterBar.N3GlobalFilterBar.useEffect"], [
        filters.attrL1,
        filters.attrL2
    ]);
    // フィルター更新
    const updateFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3GlobalFilterBar.N3GlobalFilterBar.useCallback[updateFilter]": (key, value)=>{
            const newFilters = {
                ...filters,
                [key]: value
            };
            // L1変更時はL2, L3をクリア
            if (key === 'attrL1') {
                newFilters.attrL2 = null;
                newFilters.attrL3 = null;
            }
            // L2変更時はL3をクリア
            if (key === 'attrL2') {
                newFilters.attrL3 = null;
            }
            onFiltersChange(newFilters);
        }
    }["N3GlobalFilterBar.N3GlobalFilterBar.useCallback[updateFilter]"], [
        filters,
        onFiltersChange
    ]);
    // 検索実行
    const handleSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3GlobalFilterBar.N3GlobalFilterBar.useCallback[handleSearch]": ()=>{
            updateFilter('searchQuery', searchInput);
        }
    }["N3GlobalFilterBar.N3GlobalFilterBar.useCallback[handleSearch]"], [
        searchInput,
        updateFilter
    ]);
    // リセット
    const handleReset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3GlobalFilterBar.N3GlobalFilterBar.useCallback[handleReset]": ()=>{
            setSearchInput('');
            onFiltersChange(DEFAULT_FILTER_STATE);
        }
    }["N3GlobalFilterBar.N3GlobalFilterBar.useCallback[handleReset]"], [
        onFiltersChange
    ]);
    // 適用
    const handleApply = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3GlobalFilterBar.N3GlobalFilterBar.useCallback[handleApply]": ()=>{
            setIsPanelOpen(false);
            onApply === null || onApply === void 0 ? void 0 : onApply();
        }
    }["N3GlobalFilterBar.N3GlobalFilterBar.useCallback[handleApply]"], [
        onApply
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'relative',
            zIndex: 50
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '4px 12px',
                    background: 'var(--highlight)',
                    borderBottom: '1px solid var(--panel-border)',
                    minHeight: 36
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsPanelOpen(!isPanelOpen),
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '5px 12px',
                            background: activeCount > 0 ? 'var(--accent)' : 'var(--panel)',
                            color: activeCount > 0 ? 'white' : 'var(--text)',
                            border: '1px solid var(--panel-border)',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 500
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                lineNumber: 682,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "絞込"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                lineNumber: 683,
                                columnNumber: 11
                            }, this),
                            activeCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    background: 'white',
                                    color: 'var(--accent)',
                                    padding: '1px 6px',
                                    borderRadius: 10,
                                    fontSize: 10,
                                    fontWeight: 700
                                },
                                children: activeCount
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                lineNumber: 685,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 666,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            background: 'var(--panel)',
                            borderRadius: 4,
                            padding: '0 8px',
                            border: '1px solid var(--panel-border)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                size: 14,
                                style: {
                                    color: 'var(--text-muted)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                lineNumber: 709,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: searchInput,
                                onChange: (e)=>setSearchInput(e.target.value),
                                onKeyDown: (e)=>e.key === 'Enter' && handleSearch(),
                                placeholder: "SKU, タイトルで検索...",
                                style: {
                                    width: 180,
                                    padding: '5px 8px',
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: 12,
                                    color: 'var(--text)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                lineNumber: 710,
                                columnNumber: 11
                            }, this),
                            searchInput && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 14,
                                style: {
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer'
                                },
                                onClick: ()=>{
                                    setSearchInput('');
                                    updateFilter('searchQuery', '');
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                lineNumber: 727,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 699,
                        columnNumber: 9
                    }, this),
                    activeBadges.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 4,
                            flexWrap: 'wrap'
                        },
                        children: [
                            activeBadges.map((badge, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        padding: '2px 8px',
                                        background: badge.color,
                                        color: 'white',
                                        borderRadius: 10,
                                        fontSize: 10,
                                        fontWeight: 500
                                    },
                                    children: badge.label
                                }, i, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                    lineNumber: 742,
                                    columnNumber: 15
                                }, this)),
                            activeCount > activeBadges.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    padding: '2px 8px',
                                    background: 'var(--text-muted)',
                                    color: 'white',
                                    borderRadius: 10,
                                    fontSize: 10
                                },
                                children: [
                                    "+",
                                    activeCount - activeBadges.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                lineNumber: 757,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 740,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 771,
                        columnNumber: 9
                    }, this),
                    activeCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleReset,
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '5px 10px',
                            background: 'transparent',
                            border: '1px solid var(--panel-border)',
                            borderRadius: 4,
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: 11
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                lineNumber: 790,
                                columnNumber: 13
                            }, this),
                            "リセット"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 775,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                lineNumber: 654,
                columnNumber: 7
            }, this),
            isPanelOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>setIsPanelOpen(false),
                        style: {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.4)',
                            zIndex: 9998
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 800,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '95%',
                            maxWidth: 1200,
                            maxHeight: '80vh',
                            background: 'var(--panel)',
                            border: '1px solid var(--panel-border)',
                            borderRadius: 8,
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                            zIndex: 9999,
                            display: 'flex',
                            flexDirection: 'column'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    borderBottom: '1px solid var(--panel-border)',
                                    flexShrink: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: 'var(--text)'
                                        },
                                        children: "フィルター設定"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                        lineNumber: 843,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setIsPanelOpen(false),
                                        style: {
                                            width: 28,
                                            height: 28,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'var(--highlight)',
                                            border: 'none',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                            color: 'var(--text-muted)'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                            lineNumber: 861,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                        lineNumber: 846,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                lineNumber: 833,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '16px 24px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr 1fr',
                                        gap: 32
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CollapsibleSection, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"],
                                                    label: "基本",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "保管場所",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RadioGroup, {
                                                                options: STORAGE_OPTIONS,
                                                                value: filters.storageLocation,
                                                                onChange: (v)=>updateFilter('storageLocation', v)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 876,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 875,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "在庫数",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NumberRangeInput, {
                                                                minValue: filters.stockMin,
                                                                maxValue: filters.stockMax,
                                                                onMinChange: (v)=>updateFilter('stockMin', v),
                                                                onMaxChange: (v)=>updateFilter('stockMax', v),
                                                                minPlaceholder: "0",
                                                                maxPlaceholder: "∞"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 883,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 882,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "商品タイプ",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckboxGroup, {
                                                                options: PRODUCT_TYPE_OPTIONS,
                                                                values: filters.productType,
                                                                onChange: (v)=>updateFilter('productType', v)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 893,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 892,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "アカウント",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckboxGroup, {
                                                                options: ACCOUNT_OPTIONS,
                                                                values: filters.account,
                                                                onChange: (v)=>updateFilter('account', v)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 900,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 899,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                    lineNumber: 874,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CollapsibleSection, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"],
                                                    label: "属性（L1-L3）",
                                                    defaultOpen: false,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "L1属性",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectDropdown, {
                                                                value: filters.attrL1,
                                                                options: l1Options.map((o)=>({
                                                                        value: o,
                                                                        label: o
                                                                    })),
                                                                onChange: (v)=>updateFilter('attrL1', v),
                                                                placeholder: "L1を選択"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 911,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 910,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "L2属性",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectDropdown, {
                                                                value: filters.attrL2,
                                                                options: l2Options.map((o)=>({
                                                                        value: o,
                                                                        label: o
                                                                    })),
                                                                onChange: (v)=>updateFilter('attrL2', v),
                                                                disabled: !filters.attrL1,
                                                                placeholder: !filters.attrL1 ? 'L1を先に選択' : 'L2を選択'
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 919,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 918,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "L3属性",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectDropdown, {
                                                                value: filters.attrL3,
                                                                options: l3Options.map((o)=>({
                                                                        value: o,
                                                                        label: o
                                                                    })),
                                                                onChange: (v)=>updateFilter('attrL3', v),
                                                                disabled: !filters.attrL2,
                                                                placeholder: !filters.attrL2 ? 'L2を先に選択' : 'L3を選択'
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 928,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 927,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                    lineNumber: 909,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                            lineNumber: 872,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CollapsibleSection, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"],
                                                    label: "分類・属性",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "仕入先",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectDropdown, {
                                                                value: filters.source,
                                                                options: SOURCE_OPTIONS,
                                                                onChange: (v)=>updateFilter('source', v),
                                                                placeholder: "仕入先"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 945,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 944,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "原産国",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectDropdown, {
                                                                value: filters.originCountry,
                                                                options: ORIGIN_COUNTRY_OPTIONS,
                                                                onChange: (v)=>updateFilter('originCountry', v),
                                                                placeholder: "原産国"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 953,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 952,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "素材",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                                                                value: filters.material,
                                                                onChange: (v)=>updateFilter('material', v),
                                                                placeholder: "例: プラスチック"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 961,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 960,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                    lineNumber: 943,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CollapsibleSection, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"],
                                                    label: "価格・原価",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "仕入れ値",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NumberRangeInput, {
                                                                minValue: filters.costMin,
                                                                maxValue: filters.costMax,
                                                                onMinChange: (v)=>updateFilter('costMin', v),
                                                                onMaxChange: (v)=>updateFilter('costMax', v),
                                                                prefix: "¥"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 972,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 971,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "販売価格",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NumberRangeInput, {
                                                                minValue: filters.priceUsdMin,
                                                                maxValue: filters.priceUsdMax,
                                                                onMinChange: (v)=>updateFilter('priceUsdMin', v),
                                                                onMaxChange: (v)=>updateFilter('priceUsdMax', v),
                                                                prefix: "$"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 981,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 980,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "利益率",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NumberRangeInput, {
                                                                minValue: filters.profitMarginMin,
                                                                maxValue: filters.profitMarginMax,
                                                                onMinChange: (v)=>updateFilter('profitMarginMin', v),
                                                                onMaxChange: (v)=>updateFilter('profitMarginMax', v),
                                                                suffix: "%"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 990,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 989,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "Pricing種類",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckboxGroup, {
                                                                options: PRICING_TYPE_OPTIONS,
                                                                values: filters.pricingType,
                                                                onChange: (v)=>updateFilter('pricingType', v)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 999,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 998,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                    lineNumber: 970,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                            lineNumber: 941,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CollapsibleSection, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"],
                                                    label: "関税・HTS",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "HTSコード",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextInput, {
                                                                value: filters.htsCode,
                                                                onChange: (v)=>updateFilter('htsCode', v),
                                                                placeholder: "例: 9503.00"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 1014,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 1013,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "HTS関税率",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NumberRangeInput, {
                                                                minValue: filters.htsDutyRateMin,
                                                                maxValue: filters.htsDutyRateMax,
                                                                onMinChange: (v)=>updateFilter('htsDutyRateMin', v),
                                                                onMaxChange: (v)=>updateFilter('htsDutyRateMax', v),
                                                                suffix: "%"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 1021,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 1020,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                    lineNumber: 1012,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CollapsibleSection, {
                                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
                                                    label: "スコア・配送",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "Listing Score",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NumberRangeInput, {
                                                                minValue: filters.listingScoreMin,
                                                                maxValue: filters.listingScoreMax,
                                                                onMinChange: (v)=>updateFilter('listingScoreMin', v),
                                                                onMaxChange: (v)=>updateFilter('listingScoreMax', v),
                                                                minPlaceholder: "0",
                                                                maxPlaceholder: "100"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 1034,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 1033,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterRow, {
                                                            label: "配送方法",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectDropdown, {
                                                                value: filters.shippingMethod,
                                                                options: SHIPPING_METHOD_OPTIONS,
                                                                onChange: (v)=>updateFilter('shippingMethod', v),
                                                                placeholder: "配送方法"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                                lineNumber: 1044,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                            lineNumber: 1043,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                    lineNumber: 1032,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                            lineNumber: 1010,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                    lineNumber: 870,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                lineNumber: 866,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    borderTop: '1px solid var(--panel-border)',
                                    background: 'var(--highlight)',
                                    flexShrink: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleReset,
                                        style: {
                                            padding: '8px 16px',
                                            background: 'transparent',
                                            border: '1px solid var(--panel-border)',
                                            borderRadius: 4,
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            fontSize: 12
                                        },
                                        children: "リセット"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                        lineNumber: 1067,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: 8
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setIsPanelOpen(false),
                                                style: {
                                                    padding: '8px 16px',
                                                    background: 'var(--panel)',
                                                    border: '1px solid var(--panel-border)',
                                                    borderRadius: 4,
                                                    color: 'var(--text)',
                                                    cursor: 'pointer',
                                                    fontSize: 12
                                                },
                                                children: "キャンセル"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                lineNumber: 1082,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleApply,
                                                style: {
                                                    padding: '8px 24px',
                                                    background: 'var(--accent)',
                                                    border: 'none',
                                                    borderRadius: 4,
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: 12,
                                                    fontWeight: 600
                                                },
                                                children: "適用"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                                lineNumber: 1096,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                        lineNumber: 1081,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                                lineNumber: 1057,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
                        lineNumber: 814,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx",
        lineNumber: 652,
        columnNumber: 5
    }, this);
}, "GYRluIy4LWLQgAM/bK2bmwdMx7s=")), "GYRluIy4LWLQgAM/bK2bmwdMx7s=");
_c8 = N3GlobalFilterBar;
const __TURBOPACK__default__export__ = N3GlobalFilterBar;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "CollapsibleSection");
__turbopack_context__.k.register(_c1, "RadioGroup");
__turbopack_context__.k.register(_c2, "CheckboxGroup");
__turbopack_context__.k.register(_c3, "SelectDropdown");
__turbopack_context__.k.register(_c4, "NumberRangeInput");
__turbopack_context__.k.register(_c5, "TextInput");
__turbopack_context__.k.register(_c6, "FilterRow");
__turbopack_context__.k.register(_c7, "N3GlobalFilterBar$memo");
__turbopack_context__.k.register(_c8, "N3GlobalFilterBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/header/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/header/index.ts
/**
 * Header - ヘッダーコンポーネントのエクスポート
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$page$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$sub$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-sub-toolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$global$2d$filter$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-global-filter-bar.tsx [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/amazon-research-n3/store/use-amazon-research-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/amazon-research-n3/store/use-amazon-research-store.ts
/**
 * Amazon Research N3 - Zustand Store
 */ __turbopack_context__.s([
    "useAmazonResearchStore",
    ()=>useAmazonResearchStore,
    "useFilteredItems",
    ()=>useFilteredItems,
    "usePaginatedItems",
    ()=>usePaginatedItems,
    "useSelectedItems",
    ()=>useSelectedItems
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
;
// ============================================================
// 初期値
// ============================================================
const initialStats = {
    total: 0,
    completed: 0,
    pending: 0,
    errors: 0,
    high_score_count: 0,
    medium_score_count: 0,
    low_score_count: 0,
    profitable_count: 0,
    marginal_count: 0,
    unprofitable_count: 0,
    high_sales_count: 0,
    medium_sales_count: 0,
    low_sales_count: 0,
    low_competition_count: 0,
    medium_competition_count: 0,
    high_competition_count: 0,
    new_products_count: 0,
    variation_candidates_count: 0,
    set_candidates_count: 0,
    risky_count: 0,
    exists_in_db_count: 0,
    auto_tracked_count: 0,
    avg_score: 0,
    avg_profit_margin: 0,
    avg_monthly_sales: 0,
    avg_bsr: 0,
    avg_review_count: 0,
    top_categories: [],
    top_brands: []
};
const initialFilter = {
    type: 'all'
};
const useAmazonResearchStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((set, get)=>({
        // 初期状態
        items: [],
        isLoading: false,
        isProcessing: false,
        loadingMessage: '',
        error: null,
        batchProgress: null,
        filter: initialFilter,
        sortType: 'score_desc',
        searchQuery: '',
        selectedIds: new Set(),
        selectedItem: null,
        showDetailPanel: false,
        stats: initialStats,
        viewMode: 'list',
        pageSize: 100,
        currentPage: 1,
        autoConfigs: [],
        // データ操作
        setItems: (items)=>set({
                items,
                currentPage: 1
            }),
        addItems: (newItems)=>set((state)=>({
                    items: [
                        ...state.items,
                        ...newItems
                    ]
                })),
        updateItem: (id, updates)=>set((state)=>{
                var _state_selectedItem;
                return {
                    items: state.items.map((item)=>item.id === id ? {
                            ...item,
                            ...updates,
                            updated_at: new Date().toISOString()
                        } : item),
                    selectedItem: ((_state_selectedItem = state.selectedItem) === null || _state_selectedItem === void 0 ? void 0 : _state_selectedItem.id) === id ? {
                        ...state.selectedItem,
                        ...updates
                    } : state.selectedItem
                };
            }),
        removeItems: (ids)=>set((state)=>({
                    items: state.items.filter((item)=>!ids.includes(item.id)),
                    selectedIds: new Set([
                        ...state.selectedIds
                    ].filter((id)=>!ids.includes(id)))
                })),
        // ローディング
        setIsLoading: (isLoading)=>set({
                isLoading
            }),
        setIsProcessing: (isProcessing)=>set({
                isProcessing
            }),
        setLoadingMessage: (loadingMessage)=>set({
                loadingMessage
            }),
        setError: (error)=>set({
                error
            }),
        setBatchProgress: (batchProgress)=>set({
                batchProgress
            }),
        // フィルター・ソート
        setFilter: (filter)=>set((state)=>({
                    filter: {
                        ...state.filter,
                        ...filter
                    },
                    currentPage: 1
                })),
        setSortType: (sortType)=>set({
                sortType
            }),
        setSearchQuery: (searchQuery)=>set({
                searchQuery,
                currentPage: 1
            }),
        // 選択
        toggleSelection: (id)=>set((state)=>{
                const newSet = new Set(state.selectedIds);
                if (newSet.has(id)) newSet.delete(id);
                else newSet.add(id);
                return {
                    selectedIds: newSet
                };
            }),
        selectAll: ()=>set((state)=>({
                    selectedIds: new Set(state.items.map((i)=>i.id))
                })),
        deselectAll: ()=>set({
                selectedIds: new Set()
            }),
        selectByFilter: (filterFn)=>set((state)=>({
                    selectedIds: new Set(state.items.filter(filterFn).map((i)=>i.id))
                })),
        // 詳細パネル
        setSelectedItem: (selectedItem)=>set({
                selectedItem
            }),
        setShowDetailPanel: (showDetailPanel)=>set({
                showDetailPanel
            }),
        // 統計
        setStats: (stats)=>set({
                stats
            }),
        recalculateStats: ()=>set((state)=>{
                const items = state.items;
                const total = items.length;
                if (total === 0) {
                    set({
                        stats: initialStats
                    });
                    return {};
                }
                const displayScore = (i)=>{
                    var _i_n3_keepa_score, _ref;
                    return (_ref = (_i_n3_keepa_score = i.n3_keepa_score) !== null && _i_n3_keepa_score !== void 0 ? _i_n3_keepa_score : i.n3_score) !== null && _ref !== void 0 ? _ref : 0;
                };
                const stats = {
                    total,
                    completed: items.filter((i)=>i.status === 'completed').length,
                    pending: items.filter((i)=>i.status === 'pending' || i.status === 'processing').length,
                    errors: items.filter((i)=>i.status === 'error').length,
                    high_score_count: items.filter((i)=>displayScore(i) >= 80).length,
                    medium_score_count: items.filter((i)=>displayScore(i) >= 60 && displayScore(i) < 80).length,
                    low_score_count: items.filter((i)=>displayScore(i) < 60).length,
                    profitable_count: items.filter((i)=>(i.estimated_profit_margin || 0) >= 20).length,
                    marginal_count: items.filter((i)=>{
                        const m = i.estimated_profit_margin || 0;
                        return m >= 10 && m < 20;
                    }).length,
                    unprofitable_count: items.filter((i)=>(i.estimated_profit_margin || 0) < 10).length,
                    high_sales_count: items.filter((i)=>(i.monthly_sales_estimate || 0) >= 100).length,
                    medium_sales_count: items.filter((i)=>{
                        const s = i.monthly_sales_estimate || 0;
                        return s >= 30 && s < 100;
                    }).length,
                    low_sales_count: items.filter((i)=>(i.monthly_sales_estimate || 0) < 30).length,
                    low_competition_count: items.filter((i)=>(i.fba_offer_count || 0) <= 5).length,
                    medium_competition_count: items.filter((i)=>{
                        const c = i.fba_offer_count || 0;
                        return c > 5 && c <= 15;
                    }).length,
                    high_competition_count: items.filter((i)=>(i.fba_offer_count || 0) > 15).length,
                    new_products_count: items.filter((i)=>i.is_new_product).length,
                    variation_candidates_count: items.filter((i)=>i.is_variation_candidate).length,
                    set_candidates_count: items.filter((i)=>i.is_set_candidate).length,
                    risky_count: items.filter((i)=>i.risk_level === 'high' || i.risk_level === 'medium').length,
                    exists_in_db_count: items.filter((i)=>i.status === 'exists').length,
                    auto_tracked_count: items.filter((i)=>i.is_auto_tracked).length,
                    avg_score: Math.round(items.reduce((sum, i)=>sum + displayScore(i), 0) / total),
                    avg_profit_margin: Math.round(items.reduce((sum, i)=>sum + (i.estimated_profit_margin || 0), 0) / total * 10) / 10,
                    avg_monthly_sales: Math.round(items.reduce((sum, i)=>sum + (i.monthly_sales_estimate || 0), 0) / total),
                    avg_bsr: Math.round(items.reduce((sum, i)=>sum + (i.bsr_current || 0), 0) / total),
                    avg_review_count: Math.round(items.reduce((sum, i)=>sum + (i.review_count || 0), 0) / total),
                    top_categories: calculateTopItems(items, 'category'),
                    top_brands: calculateTopItems(items, 'brand')
                };
                return {
                    stats
                };
            }),
        // 表示設定
        setViewMode: (viewMode)=>set({
                viewMode
            }),
        setPageSize: (pageSize)=>set({
                pageSize,
                currentPage: 1
            }),
        setCurrentPage: (currentPage)=>set({
                currentPage
            }),
        // 自動化
        setAutoConfigs: (autoConfigs)=>set({
                autoConfigs
            }),
        addAutoConfig: (config)=>set((state)=>({
                    autoConfigs: [
                        ...state.autoConfigs,
                        config
                    ]
                })),
        updateAutoConfig: (id, updates)=>set((state)=>({
                    autoConfigs: state.autoConfigs.map((c)=>c.id === id ? {
                            ...c,
                            ...updates
                        } : c)
                })),
        removeAutoConfig: (id)=>set((state)=>({
                    autoConfigs: state.autoConfigs.filter((c)=>c.id !== id)
                })),
        // リセット
        reset: ()=>set({
                items: [],
                isLoading: false,
                isProcessing: false,
                loadingMessage: '',
                error: null,
                batchProgress: null,
                filter: initialFilter,
                sortType: 'score_desc',
                searchQuery: '',
                selectedIds: new Set(),
                selectedItem: null,
                showDetailPanel: false,
                stats: initialStats,
                currentPage: 1
            })
    }), {
    name: 'amazon-research-store'
}));
// ============================================================
// ユーティリティ
// ============================================================
function calculateTopItems(items, field) {
    const counts = {};
    items.forEach((item)=>{
        const value = item[field];
        if (value) counts[value] = (counts[value] || 0) + 1;
    });
    return Object.entries(counts).map((param)=>{
        let [name, count] = param;
        return {
            name,
            count
        };
    }).sort((a, b)=>b.count - a.count).slice(0, 10);
}
function useFilteredItems() {
    _s();
    const { items, filter, sortType, searchQuery } = useAmazonResearchStore();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useFilteredItems.useMemo": ()=>{
            let filtered = [
                ...items
            ];
            // 検索フィルター
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                filtered = filtered.filter({
                    "useFilteredItems.useMemo": (i)=>{
                        var _i_asin, _i_title, _i_brand;
                        return ((_i_asin = i.asin) === null || _i_asin === void 0 ? void 0 : _i_asin.toLowerCase().includes(q)) || ((_i_title = i.title) === null || _i_title === void 0 ? void 0 : _i_title.toLowerCase().includes(q)) || ((_i_brand = i.brand) === null || _i_brand === void 0 ? void 0 : _i_brand.toLowerCase().includes(q));
                    }
                }["useFilteredItems.useMemo"]);
            }
            // タイプフィルター
            const displayScore = {
                "useFilteredItems.useMemo.displayScore": (i)=>{
                    var _i_n3_keepa_score, _ref;
                    return (_ref = (_i_n3_keepa_score = i.n3_keepa_score) !== null && _i_n3_keepa_score !== void 0 ? _i_n3_keepa_score : i.n3_score) !== null && _ref !== void 0 ? _ref : 0;
                }
            }["useFilteredItems.useMemo.displayScore"];
            switch(filter.type){
                case 'high_score':
                    filtered = filtered.filter({
                        "useFilteredItems.useMemo": (i)=>displayScore(i) >= 80
                    }["useFilteredItems.useMemo"]);
                    break;
                case 'profitable':
                    filtered = filtered.filter({
                        "useFilteredItems.useMemo": (i)=>(i.estimated_profit_margin || 0) >= 20
                    }["useFilteredItems.useMemo"]);
                    break;
                case 'high_sales':
                    filtered = filtered.filter({
                        "useFilteredItems.useMemo": (i)=>(i.monthly_sales_estimate || 0) >= 100
                    }["useFilteredItems.useMemo"]);
                    break;
                case 'low_competition':
                    filtered = filtered.filter({
                        "useFilteredItems.useMemo": (i)=>(i.fba_offer_count || 0) <= 5
                    }["useFilteredItems.useMemo"]);
                    break;
                case 'new_products':
                    filtered = filtered.filter({
                        "useFilteredItems.useMemo": (i)=>i.is_new_product
                    }["useFilteredItems.useMemo"]);
                    break;
                case 'risky':
                    filtered = filtered.filter({
                        "useFilteredItems.useMemo": (i)=>i.risk_level === 'high' || i.risk_level === 'medium'
                    }["useFilteredItems.useMemo"]);
                    break;
                case 'exists':
                    filtered = filtered.filter({
                        "useFilteredItems.useMemo": (i)=>i.status === 'exists'
                    }["useFilteredItems.useMemo"]);
                    break;
                case 'variation_candidates':
                    filtered = filtered.filter({
                        "useFilteredItems.useMemo": (i)=>i.is_variation_candidate
                    }["useFilteredItems.useMemo"]);
                    break;
                case 'set_candidates':
                    filtered = filtered.filter({
                        "useFilteredItems.useMemo": (i)=>i.is_set_candidate
                    }["useFilteredItems.useMemo"]);
                    break;
                case 'auto_tracked':
                    filtered = filtered.filter({
                        "useFilteredItems.useMemo": (i)=>i.is_auto_tracked
                    }["useFilteredItems.useMemo"]);
                    break;
            }
            // カスタムフィルター
            if (filter.category) {
                filtered = filtered.filter({
                    "useFilteredItems.useMemo": (i)=>i.category === filter.category
                }["useFilteredItems.useMemo"]);
            }
            if (filter.brand) {
                filtered = filtered.filter({
                    "useFilteredItems.useMemo": (i)=>i.brand === filter.brand
                }["useFilteredItems.useMemo"]);
            }
            if (filter.minScore !== undefined) {
                filtered = filtered.filter({
                    "useFilteredItems.useMemo": (i)=>displayScore(i) >= filter.minScore
                }["useFilteredItems.useMemo"]);
            }
            if (filter.maxScore !== undefined) {
                filtered = filtered.filter({
                    "useFilteredItems.useMemo": (i)=>displayScore(i) <= filter.maxScore
                }["useFilteredItems.useMemo"]);
            }
            if (filter.minProfit !== undefined) {
                filtered = filtered.filter({
                    "useFilteredItems.useMemo": (i)=>(i.estimated_profit_margin || 0) >= filter.minProfit
                }["useFilteredItems.useMemo"]);
            }
            if (filter.minBsr !== undefined) {
                filtered = filtered.filter({
                    "useFilteredItems.useMemo": (i)=>(i.bsr_current || 999999) >= filter.minBsr
                }["useFilteredItems.useMemo"]);
            }
            if (filter.maxBsr !== undefined) {
                filtered = filtered.filter({
                    "useFilteredItems.useMemo": (i)=>(i.bsr_current || 0) <= filter.maxBsr
                }["useFilteredItems.useMemo"]);
            }
            // ソート
            filtered.sort({
                "useFilteredItems.useMemo": (a, b)=>{
                    switch(sortType){
                        case 'score_desc':
                            return displayScore(b) - displayScore(a);
                        case 'score_asc':
                            return displayScore(a) - displayScore(b);
                        case 'profit_desc':
                            return (b.estimated_profit_margin || 0) - (a.estimated_profit_margin || 0);
                        case 'profit_asc':
                            return (a.estimated_profit_margin || 0) - (b.estimated_profit_margin || 0);
                        case 'sales_desc':
                            return (b.monthly_sales_estimate || 0) - (a.monthly_sales_estimate || 0);
                        case 'sales_asc':
                            return (a.monthly_sales_estimate || 0) - (b.monthly_sales_estimate || 0);
                        case 'bsr_asc':
                            return (a.bsr_current || 999999) - (b.bsr_current || 999999);
                        case 'bsr_desc':
                            return (b.bsr_current || 0) - (a.bsr_current || 0);
                        case 'review_desc':
                            return (b.review_count || 0) - (a.review_count || 0);
                        case 'price_desc':
                            return (b.amazon_price_jpy || 0) - (a.amazon_price_jpy || 0);
                        case 'price_asc':
                            return (a.amazon_price_jpy || 0) - (b.amazon_price_jpy || 0);
                        case 'date_desc':
                            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                        case 'date_asc':
                            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                        default:
                            return 0;
                    }
                }
            }["useFilteredItems.useMemo"]);
            return filtered;
        }
    }["useFilteredItems.useMemo"], [
        items,
        filter,
        sortType,
        searchQuery
    ]);
}
_s(useFilteredItems, "e0gHcVQ2X3C09LK6j7EswtkAri4=", false, function() {
    return [
        useAmazonResearchStore
    ];
});
function usePaginatedItems() {
    _s1();
    const filteredItems = useFilteredItems();
    const { pageSize, currentPage } = useAmazonResearchStore();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePaginatedItems.useMemo": ()=>{
            const start = (currentPage - 1) * pageSize;
            return filteredItems.slice(start, start + pageSize);
        }
    }["usePaginatedItems.useMemo"], [
        filteredItems,
        pageSize,
        currentPage
    ]);
}
_s1(usePaginatedItems, "gvdBECu1LaWW8vCEf83SwZ5kVhA=", false, function() {
    return [
        useFilteredItems,
        useAmazonResearchStore
    ];
});
function useSelectedItems() {
    _s2();
    const { items, selectedIds } = useAmazonResearchStore();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useSelectedItems.useMemo": ()=>items.filter({
                "useSelectedItems.useMemo": (i)=>selectedIds.has(i.id)
            }["useSelectedItems.useMemo"])
    }["useSelectedItems.useMemo"], [
        items,
        selectedIds
    ]);
}
_s2(useSelectedItems, "prSCXR6d4BHBo88wL8spMk3KVkM=", false, function() {
    return [
        useAmazonResearchStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/amazon-research-n3/lib/score-calculator.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/amazon-research-n3/lib/score-calculator.ts
/**
 * N3スコア計算ロジック - 3段階評価システム
 * 
 * 1. N3基本スコア (0-100) - PA-API/SP-APIデータのみ
 * 2. N3 Keepaスコア (0-100) - Keepa履歴データ追加
 * 3. N3 AIスコア (0-100) - AI分析データ追加
 */ __turbopack_context__.s([
    "CATEGORY_CONFIG",
    ()=>CATEGORY_CONFIG,
    "HIGH_RISK_BRANDS",
    ()=>HIGH_RISK_BRANDS,
    "calculateBasicDemandScore",
    ()=>calculateBasicDemandScore,
    "calculateCompetitionScore",
    ()=>calculateCompetitionScore,
    "calculateKeepaEnhancedDemandScore",
    ()=>calculateKeepaEnhancedDemandScore,
    "calculateKeepaRiskAdjustment",
    ()=>calculateKeepaRiskAdjustment,
    "calculateN3AIScore",
    ()=>calculateN3AIScore,
    "calculateN3BasicScore",
    ()=>calculateN3BasicScore,
    "calculateN3KeepaScore",
    ()=>calculateN3KeepaScore,
    "calculateProfitScore",
    ()=>calculateProfitScore,
    "calculateRiskScore",
    ()=>calculateRiskScore,
    "enrichItemsWithAllScores",
    ()=>enrichItemsWithAllScores,
    "estimateProfitMargin",
    ()=>estimateProfitMargin,
    "isNewProduct",
    ()=>isNewProduct,
    "isSetCandidate",
    ()=>isSetCandidate,
    "isVariationCandidate",
    ()=>isVariationCandidate
]);
const HIGH_RISK_BRANDS = [
    'Nintendo',
    'Sony',
    'Apple',
    'Disney',
    'Marvel',
    'Pokemon',
    'LEGO',
    'Bandai',
    'Takara Tomy',
    'Sanrio',
    'Gucci',
    'Louis Vuitton',
    'Chanel',
    'Rolex',
    'Nike',
    'Adidas',
    'Supreme',
    'Hermès',
    'Prada',
    'Burberry',
    'Tiffany',
    'Cartier',
    'Dior',
    'Fendi',
    'Balenciaga',
    'Versace',
    'ポケモン',
    '任天堂',
    'バンダイ',
    'タカラトミー',
    'サンリオ'
];
const CATEGORY_CONFIG = {
    'おもちゃ': {
        multiplier: 1.2,
        popularity: 'high',
        avgReturnRate: 0.05,
        seasonality: 'high'
    },
    'Toys & Games': {
        multiplier: 1.2,
        popularity: 'high',
        avgReturnRate: 0.05,
        seasonality: 'high'
    },
    'ホーム＆キッチン': {
        multiplier: 1.1,
        popularity: 'high',
        avgReturnRate: 0.08,
        seasonality: 'low'
    },
    'Home & Kitchen': {
        multiplier: 1.1,
        popularity: 'high',
        avgReturnRate: 0.08,
        seasonality: 'low'
    },
    'ビューティー': {
        multiplier: 1.15,
        popularity: 'high',
        avgReturnRate: 0.03,
        seasonality: 'low'
    },
    'Beauty': {
        multiplier: 1.15,
        popularity: 'high',
        avgReturnRate: 0.03,
        seasonality: 'low'
    },
    'ペット用品': {
        multiplier: 1.1,
        popularity: 'high',
        avgReturnRate: 0.04,
        seasonality: 'low'
    },
    'Pet Supplies': {
        multiplier: 1.1,
        popularity: 'high',
        avgReturnRate: 0.04,
        seasonality: 'low'
    },
    'DIY・工具': {
        multiplier: 1.05,
        popularity: 'medium',
        avgReturnRate: 0.06,
        seasonality: 'low'
    },
    'Tools & Home Improvement': {
        multiplier: 1.05,
        popularity: 'medium',
        avgReturnRate: 0.06,
        seasonality: 'low'
    },
    'スポーツ&アウトドア': {
        multiplier: 1.0,
        popularity: 'medium',
        avgReturnRate: 0.07,
        seasonality: 'high'
    },
    'Sports & Outdoors': {
        multiplier: 1.0,
        popularity: 'medium',
        avgReturnRate: 0.07,
        seasonality: 'high'
    },
    '家電&カメラ': {
        multiplier: 0.95,
        popularity: 'medium',
        avgReturnRate: 0.10,
        seasonality: 'medium'
    },
    'Electronics': {
        multiplier: 0.95,
        popularity: 'medium',
        avgReturnRate: 0.10,
        seasonality: 'medium'
    },
    'ファッション': {
        multiplier: 0.9,
        popularity: 'low',
        avgReturnRate: 0.15,
        seasonality: 'high'
    },
    'Clothing': {
        multiplier: 0.9,
        popularity: 'low',
        avgReturnRate: 0.15,
        seasonality: 'high'
    },
    '食品・飲料': {
        multiplier: 0.8,
        popularity: 'low',
        avgReturnRate: 0.02,
        seasonality: 'low'
    },
    'Grocery': {
        multiplier: 0.8,
        popularity: 'low',
        avgReturnRate: 0.02,
        seasonality: 'low'
    }
};
function estimateProfitMargin(amazonPriceJpy, weightG, dimensions) {
    let targetMargin = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0.15, exchangeRate = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 150;
    // eBay販売価格想定
    const ebayPriceUsd = amazonPriceJpy * (1 + targetMargin) / exchangeRate;
    // eBay手数料 12.9%
    const ebayFeeUsd = ebayPriceUsd * 0.129;
    // 決済手数料 (Payoneer等) 約3%
    const paymentFeeUsd = ebayPriceUsd * 0.03;
    // 送料計算（重量＋容積重量の大きい方）
    const weight = weightG || 500;
    let volumetricWeight = 0;
    if ((dimensions === null || dimensions === void 0 ? void 0 : dimensions.length) && (dimensions === null || dimensions === void 0 ? void 0 : dimensions.width) && (dimensions === null || dimensions === void 0 ? void 0 : dimensions.height)) {
        volumetricWeight = dimensions.length * dimensions.width * dimensions.height / 5000 * 1000; // g換算
    }
    const chargeableWeight = Math.max(weight, volumetricWeight);
    let shippingCostUsd = 8; // 基本料金
    if (chargeableWeight > 3000) shippingCostUsd = 35;
    else if (chargeableWeight > 2000) shippingCostUsd = 25;
    else if (chargeableWeight > 1000) shippingCostUsd = 15;
    else if (chargeableWeight > 500) shippingCostUsd = 10;
    // 原価 (USD)
    const costUsd = amazonPriceJpy / exchangeRate;
    // 総コスト
    const totalCostUsd = costUsd + ebayFeeUsd + paymentFeeUsd + shippingCostUsd;
    // 利益
    const profitUsd = ebayPriceUsd - totalCostUsd;
    const actualMargin = profitUsd / ebayPriceUsd * 100;
    return {
        margin: Math.round(actualMargin * 10) / 10,
        profitJpy: Math.round(profitUsd * exchangeRate),
        profitUsd: Math.round(profitUsd * 100) / 100,
        ebayPriceUsd: Math.round(ebayPriceUsd * 100) / 100,
        ebayFeeUsd: Math.round(ebayFeeUsd * 100) / 100,
        paymentFeeUsd: Math.round(paymentFeeUsd * 100) / 100,
        shippingCostUsd: Math.round(shippingCostUsd * 100) / 100,
        totalCostUsd: Math.round(totalCostUsd * 100) / 100
    };
}
function calculateProfitScore(profitMargin) {
    if (profitMargin === undefined || profitMargin === null) return 0;
    const margin = profitMargin > 1 ? profitMargin / 100 : profitMargin;
    if (margin >= 0.30) return 30;
    if (margin >= 0.25) return 27;
    if (margin >= 0.20) return 24;
    if (margin >= 0.15) return 20;
    if (margin >= 0.10) return 15;
    if (margin >= 0.05) return 10;
    if (margin >= 0) return 5;
    return 0;
}
function calculateBasicDemandScore(bsr, category) {
    let score = 0;
    // BSR評価（20点）
    if (bsr !== undefined && bsr !== null) {
        if (bsr <= 1000) score += 20;
        else if (bsr <= 5000) score += 17;
        else if (bsr <= 10000) score += 14;
        else if (bsr <= 30000) score += 11;
        else if (bsr <= 50000) score += 8;
        else if (bsr <= 100000) score += 5;
        else if (bsr <= 200000) score += 3;
        else score += 1;
    }
    // カテゴリ補正（10点）
    if (category) {
        const catInfo = CATEGORY_CONFIG[category];
        if ((catInfo === null || catInfo === void 0 ? void 0 : catInfo.popularity) === 'high') score += 10;
        else if ((catInfo === null || catInfo === void 0 ? void 0 : catInfo.popularity) === 'medium') score += 6;
        else score += 3;
    } else {
        score += 5;
    }
    return Math.min(30, score);
}
function calculateCompetitionScore(fbaOfferCount, totalOfferCount, isAmazon) {
    let score = 20;
    const total = totalOfferCount || 0;
    const fba = fbaOfferCount || 0;
    if (total >= 50) score -= 10;
    else if (total >= 30) score -= 7;
    else if (total >= 20) score -= 5;
    else if (total >= 10) score -= 3;
    if (fba >= 20) score -= 5;
    else if (fba >= 10) score -= 3;
    else if (fba >= 5) score -= 1;
    if (isAmazon) score -= 5;
    return Math.max(0, score);
}
function calculateRiskScore(item) {
    let score = 20;
    const flags = [];
    if (item.is_restricted) {
        score -= 8;
        flags.push('restricted');
    }
    if (item.requires_approval) {
        score -= 3;
        flags.push('approval_required');
    }
    if (item.hazmat_type) {
        score -= 5;
        flags.push('hazmat');
    }
    if (item.brand && HIGH_RISK_BRANDS.some((b)=>item.brand.toLowerCase().includes(b.toLowerCase()))) {
        score -= 7;
        flags.push('ip_risk');
    }
    if (item.is_amazon) {
        score -= 3;
        flags.push('amazon_sell');
    }
    if (item.estimated_profit_margin !== undefined && item.estimated_profit_margin < 10) {
        score -= 2;
        flags.push('low_margin');
    }
    if (item.fba_offer_count && item.fba_offer_count >= 20) {
        score -= 2;
        flags.push('high_competition');
    }
    const finalScore = Math.max(0, score);
    let level = 'low';
    if (finalScore <= 8) level = 'high';
    else if (finalScore <= 14) level = 'medium';
    return {
        score: finalScore,
        flags,
        level
    };
}
function calculateN3BasicScore(item) {
    let profitMargin = item.estimated_profit_margin;
    if (profitMargin === undefined && item.amazon_price_jpy) {
        const estimate = estimateProfitMargin(item.amazon_price_jpy, item.weight_g);
        profitMargin = estimate.margin;
    }
    const profitScore = calculateProfitScore(profitMargin);
    const demandScore = calculateBasicDemandScore(item.bsr_current, item.category);
    const competitionScore = calculateCompetitionScore(item.fba_offer_count, (item.new_offer_count || 0) + (item.fba_offer_count || 0), item.is_amazon);
    const riskResult = calculateRiskScore(item);
    const rawScore = profitScore + demandScore + competitionScore + riskResult.score;
    // カテゴリ補正
    let multiplier = 1.0;
    if (item.category && CATEGORY_CONFIG[item.category]) {
        multiplier = CATEGORY_CONFIG[item.category].multiplier;
    }
    const finalScore = Math.min(100, Math.max(0, Math.round(rawScore * multiplier)));
    // 信頼度（データの充実度）
    let dataPoints = 0;
    if (item.amazon_price_jpy) dataPoints++;
    if (item.bsr_current) dataPoints++;
    if (item.fba_offer_count !== undefined) dataPoints++;
    if (item.review_count !== undefined) dataPoints++;
    if (item.brand) dataPoints++;
    const confidence = dataPoints >= 4 ? 'high' : dataPoints >= 2 ? 'medium' : 'low';
    return {
        score: finalScore,
        breakdown: {
            profit_score: profitScore,
            demand_score: demandScore,
            competition_score: competitionScore,
            risk_score: riskResult.score
        },
        riskFlags: riskResult.flags,
        riskLevel: riskResult.level,
        confidence
    };
}
function calculateKeepaEnhancedDemandScore(bsr, bsrDrops30d, bsr30dAvg, outOfStockPct, category) {
    var _CATEGORY_CONFIG_category, _CATEGORY_CONFIG_category1;
    let score = 0;
    // BSR評価（12点）
    if (bsr !== undefined && bsr !== null) {
        if (bsr <= 1000) score += 12;
        else if (bsr <= 5000) score += 10;
        else if (bsr <= 10000) score += 8;
        else if (bsr <= 30000) score += 6;
        else if (bsr <= 50000) score += 5;
        else if (bsr <= 100000) score += 3;
        else score += 1;
    }
    // BSRドロップ（販売頻度）（10点）
    if (bsrDrops30d !== undefined && bsrDrops30d !== null) {
        if (bsrDrops30d >= 100) score += 10;
        else if (bsrDrops30d >= 50) score += 8;
        else if (bsrDrops30d >= 30) score += 6;
        else if (bsrDrops30d >= 15) score += 4;
        else if (bsrDrops30d >= 5) score += 2;
    }
    // BSR安定性（3点）
    if (bsr && bsr30dAvg) {
        const stability = Math.abs(bsr - bsr30dAvg) / bsr30dAvg;
        if (stability < 0.1) score += 3;
        else if (stability < 0.3) score += 2;
        else if (stability < 0.5) score += 1;
    }
    // 品切れ率ボーナス（高需要の証拠）（2点）
    if (outOfStockPct !== undefined) {
        if (outOfStockPct > 0.1 && outOfStockPct < 0.3) score += 2; // 適度な品切れは需要の証
        else if (outOfStockPct >= 0.3) score += 0; // 頻繁な品切れは問題
        else score += 1;
    }
    // カテゴリ（3点）
    if (category && ((_CATEGORY_CONFIG_category = CATEGORY_CONFIG[category]) === null || _CATEGORY_CONFIG_category === void 0 ? void 0 : _CATEGORY_CONFIG_category.popularity) === 'high') score += 3;
    else if (category && ((_CATEGORY_CONFIG_category1 = CATEGORY_CONFIG[category]) === null || _CATEGORY_CONFIG_category1 === void 0 ? void 0 : _CATEGORY_CONFIG_category1.popularity) === 'medium') score += 2;
    else score += 1;
    return Math.min(30, score);
}
function calculateKeepaRiskAdjustment(item) {
    var _CATEGORY_CONFIG_item_category;
    let adjustment = 0;
    const additionalFlags = [];
    // 価格変動リスク
    if (item.price_amazon_min && item.price_amazon_max && item.amazon_price_jpy) {
        const volatility = (item.price_amazon_max - item.price_amazon_min) / item.amazon_price_jpy;
        if (volatility > 0.5) {
            adjustment -= 4;
            additionalFlags.push('price_volatile');
        } else if (volatility > 0.3) adjustment -= 2;
    }
    // 季節性リスク
    if (item.category && ((_CATEGORY_CONFIG_item_category = CATEGORY_CONFIG[item.category]) === null || _CATEGORY_CONFIG_item_category === void 0 ? void 0 : _CATEGORY_CONFIG_item_category.seasonality) === 'high') {
        adjustment -= 2;
        additionalFlags.push('seasonal');
    }
    // 在庫不安定（頻繁な品切れ）
    if (item.out_of_stock_percentage_30d && item.out_of_stock_percentage_30d > 0.4) {
        adjustment -= 2;
    }
    return {
        adjustment,
        additionalFlags
    };
}
function calculateN3KeepaScore(item) {
    // Keepaデータがあるか確認
    const hasKeepaData = !!(item.bsr_drops_30d || item.bsr_30d_avg || item.monthly_sales_estimate);
    if (!hasKeepaData) {
        // Keepaデータなし → 基本スコアを返す
        const basic = calculateN3BasicScore(item);
        return {
            ...basic,
            hasKeepaData: false
        };
    }
    let profitMargin = item.estimated_profit_margin;
    if (profitMargin === undefined && item.amazon_price_jpy) {
        const estimate = estimateProfitMargin(item.amazon_price_jpy, item.weight_g);
        profitMargin = estimate.margin;
    }
    const profitScore = calculateProfitScore(profitMargin);
    const demandScore = calculateKeepaEnhancedDemandScore(item.bsr_current, item.bsr_drops_30d, item.bsr_30d_avg, item.out_of_stock_percentage_30d, item.category);
    const competitionScore = calculateCompetitionScore(item.fba_offer_count, (item.new_offer_count || 0) + (item.fba_offer_count || 0), item.is_amazon);
    const baseRisk = calculateRiskScore(item);
    const keepaRisk = calculateKeepaRiskAdjustment(item);
    const riskScore = Math.max(0, baseRisk.score + keepaRisk.adjustment);
    const allFlags = [
        ...baseRisk.flags,
        ...keepaRisk.additionalFlags
    ];
    const rawScore = profitScore + demandScore + competitionScore + riskScore;
    let multiplier = 1.0;
    if (item.category && CATEGORY_CONFIG[item.category]) {
        multiplier = CATEGORY_CONFIG[item.category].multiplier;
    }
    const finalScore = Math.min(100, Math.max(0, Math.round(rawScore * multiplier)));
    let level = 'low';
    if (riskScore <= 8) level = 'high';
    else if (riskScore <= 14) level = 'medium';
    return {
        score: finalScore,
        breakdown: {
            profit_score: profitScore,
            demand_score: demandScore,
            competition_score: competitionScore,
            risk_score: riskScore
        },
        riskFlags: allFlags,
        riskLevel: level,
        confidence: 'high',
        hasKeepaData: true
    };
}
function calculateN3AIScore(item, aiAnalysis) {
    const keepaResult = calculateN3KeepaScore(item);
    if (!aiAnalysis) {
        return {
            ...keepaResult,
            breakdown: {
                ...keepaResult.breakdown,
                ai_bonus: 0
            },
            hasAIData: false
        };
    }
    // AIボーナス計算（最大+10点）
    const aiBonus = Math.round((aiAnalysis.trendScore + aiAnalysis.competitivenessScore + aiAnalysis.sustainabilityScore) / 3);
    const finalScore = Math.min(100, keepaResult.score + aiBonus);
    return {
        score: finalScore,
        breakdown: {
            ...keepaResult.breakdown,
            ai_bonus: aiBonus
        },
        riskFlags: keepaResult.riskFlags,
        riskLevel: keepaResult.riskLevel,
        confidence: aiAnalysis.confidence > 0.8 ? 'high' : aiAnalysis.confidence > 0.5 ? 'medium' : 'low',
        hasAIData: true,
        aiRecommendation: aiAnalysis.recommendation
    };
}
function isNewProduct(releaseDate, firstAvailable) {
    const date = releaseDate || firstAvailable;
    if (!date) return false;
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return new Date(date) > threeMonthsAgo;
}
function isVariationCandidate(item) {
    if (item.parent_asin && item.parent_asin !== item.asin) return true;
    if (item.color || item.size) return true;
    return false;
}
function isSetCandidate(item, allItems) {
    if (!item.brand || !item.category) return false;
    const sameBrandCategory = allItems.filter((i)=>i.brand === item.brand && i.category === item.category && i.asin !== item.asin);
    return sameBrandCategory.length >= 2;
}
function enrichItemsWithAllScores(items) {
    return items.map((item)=>{
        // 利益推定
        let profitData = null;
        if (item.amazon_price_jpy) {
            profitData = estimateProfitMargin(item.amazon_price_jpy, item.weight_g, {
                length: item.length_cm,
                width: item.width_cm,
                height: item.height_cm
            });
        }
        var _profitData_margin, _profitData_profitJpy, _profitData_profitUsd, _profitData_ebayPriceUsd;
        const enrichedItem = {
            ...item,
            estimated_profit_margin: (_profitData_margin = profitData === null || profitData === void 0 ? void 0 : profitData.margin) !== null && _profitData_margin !== void 0 ? _profitData_margin : item.estimated_profit_margin,
            estimated_profit_jpy: (_profitData_profitJpy = profitData === null || profitData === void 0 ? void 0 : profitData.profitJpy) !== null && _profitData_profitJpy !== void 0 ? _profitData_profitJpy : item.estimated_profit_jpy,
            estimated_profit_usd: (_profitData_profitUsd = profitData === null || profitData === void 0 ? void 0 : profitData.profitUsd) !== null && _profitData_profitUsd !== void 0 ? _profitData_profitUsd : item.estimated_profit_usd,
            ebay_estimated_price_usd: (_profitData_ebayPriceUsd = profitData === null || profitData === void 0 ? void 0 : profitData.ebayPriceUsd) !== null && _profitData_ebayPriceUsd !== void 0 ? _profitData_ebayPriceUsd : item.ebay_estimated_price_usd
        };
        // 3つのスコアを計算
        const basicResult = calculateN3BasicScore(enrichedItem);
        const keepaResult = calculateN3KeepaScore(enrichedItem);
        const aiResult = calculateN3AIScore(enrichedItem); // AIデータなしの場合はKeepaスコアと同じ
        // 特殊判定
        const newProduct = isNewProduct(item.release_date, item.first_available);
        const variationCandidate = isVariationCandidate(item);
        return {
            ...enrichedItem,
            id: item.id || "".concat(item.asin, "-").concat(Date.now()),
            // 3段階スコア
            n3_score: basicResult.score,
            n3_score_breakdown: basicResult.breakdown,
            n3_keepa_score: keepaResult.score,
            n3_keepa_breakdown: keepaResult.breakdown,
            n3_ai_score: aiResult.score,
            n3_ai_breakdown: aiResult.breakdown,
            // メインスコアはKeepaデータがあればKeepa版、なければ基本版
            display_score: keepaResult.hasKeepaData ? keepaResult.score : basicResult.score,
            score_confidence: keepaResult.confidence,
            // リスク
            risk_flags: keepaResult.riskFlags,
            risk_level: keepaResult.riskLevel,
            // 特殊判定
            is_new_product: newProduct,
            is_variation: item.parent_asin !== undefined && item.parent_asin !== item.asin,
            is_variation_candidate: variationCandidate,
            // ステータス
            status: item.status || 'completed',
            created_at: item.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx
/**
 * Amazon Research N3 - メインレイアウト（完全版）
 * 
 * 3段階スコア表示:
 * - N3基本スコア (PA-API)
 * - N3 Keepaスコア (将来)
 * - N3 AIスコア (将来)
 */ __turbopack_context__.s([
    "AmazonResearchN3PageLayout",
    ()=>AmazonResearchN3PageLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/play.js [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/history.js [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pause.js [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$layout$2f$n3$2d$collapsible$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/layout/n3-collapsible-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$filter$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-filter-tab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-divider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$layout$2f$n3$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-toast.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$view$2d$mode$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-view-mode-toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/header/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$page$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/header/n3-page-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$amazon$2d$research$2d$n3$2f$store$2f$use$2d$amazon$2d$research$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/amazon-research-n3/store/use-amazon-research-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$amazon$2d$research$2d$n3$2f$lib$2f$score$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/amazon-research-n3/lib/score-calculator.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const L2_TABS = [
    {
        id: 'research',
        label: 'リサーチ',
        labelEn: 'Research',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"]
    },
    {
        id: 'automation',
        label: '自動化',
        labelEn: 'Automation',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"]
    },
    {
        id: 'history',
        label: '履歴',
        labelEn: 'History',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"]
    }
];
const FILTER_TABS = [
    {
        id: 'all',
        label: '全て'
    },
    {
        id: 'high_score',
        label: 'スコア80+'
    },
    {
        id: 'profitable',
        label: '利益率20%+'
    },
    {
        id: 'high_sales',
        label: '月販100+'
    },
    {
        id: 'low_competition',
        label: '競合少'
    },
    {
        id: 'new_products',
        label: '新製品'
    },
    {
        id: 'risky',
        label: 'リスク'
    },
    {
        id: 'exists',
        label: '登録済'
    }
];
const SORT_OPTIONS = [
    {
        value: 'score_desc',
        label: 'スコア↓'
    },
    {
        value: 'profit_desc',
        label: '利益率↓'
    },
    {
        value: 'sales_desc',
        label: '月販↓'
    },
    {
        value: 'bsr_asc',
        label: 'BSR↑'
    },
    {
        value: 'date_desc',
        label: '新しい↓'
    }
];
// 詳細パネル幅を拡大（580px）
const DETAIL_PANEL_WIDTH = 580;
// ============================================================
// サブコンポーネント
// ============================================================
// 3段階スコア表示
const N3ScoreDisplay = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function N3ScoreDisplay(param) {
    let { basicScore, keepaScore, aiScore, size = 'md', showAll = false } = param;
    var _ref;
    const displayScore = (_ref = keepaScore !== null && keepaScore !== void 0 ? keepaScore : basicScore) !== null && _ref !== void 0 ? _ref : 0;
    const color = displayScore >= 80 ? 'var(--success)' : displayScore >= 60 ? 'var(--warning)' : 'var(--error)';
    const sizes = {
        sm: 28,
        md: 36,
        lg: 52
    };
    const fonts = {
        sm: 10,
        md: 12,
        lg: 18
    };
    if (showAll) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                gap: 6,
                alignItems: 'center'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Tooltip"], {
                    content: "N3基本スコア (PA-API)",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: "".concat(color, "15"),
                            border: "2px solid ".concat(color),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 13,
                            fontWeight: 700,
                            color
                        },
                        children: basicScore !== null && basicScore !== void 0 ? basicScore : '-'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Tooltip"], {
                    content: "N3 Keepaスコア (履歴データ)",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: keepaScore ? 'rgba(59, 130, 246, 0.15)' : 'var(--panel)',
                            border: "2px solid ".concat(keepaScore ? 'rgb(59, 130, 246)' : 'var(--panel-border)'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 13,
                            fontWeight: 700,
                            color: keepaScore ? 'rgb(59, 130, 246)' : 'var(--text-muted)',
                            opacity: keepaScore ? 1 : 0.5
                        },
                        children: keepaScore !== null && keepaScore !== void 0 ? keepaScore : 'K'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 112,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Tooltip"], {
                    content: "N3 AIスコア (将来)",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: aiScore ? 'rgba(168, 85, 247, 0.15)' : 'var(--panel)',
                            border: "2px solid ".concat(aiScore ? 'rgb(168, 85, 247)' : 'var(--panel-border)'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 13,
                            fontWeight: 700,
                            color: aiScore ? 'rgb(168, 85, 247)' : 'var(--text-muted)',
                            opacity: aiScore ? 1 : 0.5
                        },
                        children: aiScore !== null && aiScore !== void 0 ? aiScore : 'AI'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 124,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
            lineNumber: 103,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: sizes[size],
            height: sizes[size],
            borderRadius: '50%',
            background: "".concat(color, "15"),
            border: "2px solid ".concat(color),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: fonts[size],
            fontWeight: 700,
            color
        },
        children: displayScore
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
});
_c = N3ScoreDisplay;
// リスクバッジ
const N3RiskBadge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function N3RiskBadge(param) {
    let { flags, level } = param;
    if (!flags || flags.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            style: {
                fontSize: 10,
                color: 'var(--success)',
                fontWeight: 500
            },
            children: "✓ 低リスク"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
            lineNumber: 151,
            columnNumber: 12
        }, this);
    }
    const labels = {
        ip_risk: {
            l: '知財',
            c: 'var(--error)'
        },
        hazmat: {
            l: '危険',
            c: 'var(--error)'
        },
        restricted: {
            l: '制限',
            c: 'var(--error)'
        },
        approval_required: {
            l: '承認',
            c: 'var(--warning)'
        },
        amazon_sell: {
            l: 'Amazon',
            c: 'var(--warning)'
        },
        high_competition: {
            l: '競合多',
            c: 'var(--warning)'
        },
        price_volatile: {
            l: '価格変動',
            c: 'var(--warning)'
        },
        low_margin: {
            l: '低益',
            c: 'var(--warning)'
        },
        seasonal: {
            l: '季節',
            c: 'var(--text-muted)'
        },
        new_product: {
            l: '新製品',
            c: 'var(--accent)'
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2
        },
        children: [
            flags.slice(0, 3).map((f)=>{
                var _labels_f, _labels_f1, _labels_f2;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        padding: '1px 4px',
                        fontSize: 9,
                        fontWeight: 500,
                        background: "".concat(((_labels_f = labels[f]) === null || _labels_f === void 0 ? void 0 : _labels_f.c) || 'var(--text-muted)', "15"),
                        color: ((_labels_f1 = labels[f]) === null || _labels_f1 === void 0 ? void 0 : _labels_f1.c) || 'var(--text-muted)',
                        borderRadius: 3
                    },
                    children: ((_labels_f2 = labels[f]) === null || _labels_f2 === void 0 ? void 0 : _labels_f2.l) || f
                }, f, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this);
            }),
            flags.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: 9,
                    color: 'var(--text-muted)'
                },
                children: [
                    "+",
                    flags.length - 3
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 178,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
        lineNumber: 168,
        columnNumber: 5
    }, this);
});
_c1 = N3RiskBadge;
// ASIN入力パネル
const ASINInputPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s(function ASINInputPanel(param) {
    let { onSubmit, isProcessing } = param;
    _s();
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const parsedCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ASINInputPanel.ASINInputPanel.useMemo[parsedCount]": ()=>[
                ...new Set(input.match(/[A-Z0-9]{10}/g) || [])
            ].length
    }["ASINInputPanel.ASINInputPanel.useMemo[parsedCount]"], [
        input
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: 'var(--highlight)',
            borderRadius: 8,
            border: '1px solid var(--panel-border)',
            overflow: 'hidden'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--panel-border)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                size: 14,
                                style: {
                                    color: 'var(--accent)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 199,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 12,
                                    fontWeight: 600
                                },
                                children: "ASIN一括入力"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: async ()=>{
                                    const text = await navigator.clipboard.readText();
                                    setInput((p)=>p + '\n' + text);
                                },
                                style: {
                                    padding: '3px 8px',
                                    fontSize: 11,
                                    background: 'var(--panel)',
                                    border: '1px solid var(--panel-border)',
                                    borderRadius: 4,
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                        size: 11
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 206,
                                        columnNumber: 12
                                    }, this),
                                    " 貼付"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setInput(''),
                                style: {
                                    padding: '3px 8px',
                                    fontSize: 11,
                                    background: 'var(--panel)',
                                    border: '1px solid var(--panel-border)',
                                    borderRadius: 4,
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        size: 11
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 210,
                                        columnNumber: 12
                                    }, this),
                                    " クリア"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 207,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                value: input,
                onChange: (e)=>setInput(e.target.value),
                placeholder: "ASINを入力（改行/カンマ/スペース区切り） 例: B08N5WRWNW, B09V3KXJPB, B07XJ8C8F5",
                style: {
                    width: '100%',
                    height: 70,
                    padding: 10,
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--bg)',
                    border: 'none',
                    color: 'var(--text)',
                    resize: 'none',
                    outline: 'none'
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderTop: '1px solid var(--panel-border)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 11,
                            color: 'var(--text-muted)'
                        },
                        children: parsedCount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    style: {
                                        color: 'var(--accent)'
                                    },
                                    children: parsedCount
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                    lineNumber: 226,
                                    columnNumber: 15
                                }, this),
                                "件のASIN検出"
                            ]
                        }, void 0, true) : 'ASINを入力してください'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "primary",
                        size: "sm",
                        onClick: ()=>{
                            const a = [
                                ...new Set(input.match(/[A-Z0-9]{10}/g) || [])
                            ];
                            if (a.length) {
                                onSubmit(a);
                                setInput('');
                            }
                        },
                        disabled: !parsedCount || isProcessing,
                        icon: isProcessing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            size: 14,
                            className: "animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                            lineNumber: 239,
                            columnNumber: 32
                        }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                            lineNumber: 239,
                            columnNumber: 81
                        }, void 0),
                        children: isProcessing ? '処理中...' : 'リサーチ開始'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
        lineNumber: 196,
        columnNumber: 5
    }, this);
}, "xpsB/4hXr3mrTDydvd9aARuiuco="));
_c2 = ASINInputPanel;
// テーブル行
const ResearchTableRow = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function ResearchTableRow(param) {
    let { item, isSelected, onSelect, onShowDetail } = param;
    var _item_estimated_profit_margin;
    const fmt = (n)=>{
        var _n_toLocaleString;
        return (_n_toLocaleString = n === null || n === void 0 ? void 0 : n.toLocaleString()) !== null && _n_toLocaleString !== void 0 ? _n_toLocaleString : '-';
    };
    const fmtY = (n)=>n ? "¥".concat(n.toLocaleString()) : '-';
    var _item_fba_offer_count;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        style: {
            background: isSelected ? 'var(--accent-subtle)' : 'transparent',
            cursor: 'pointer',
            transition: 'background 0.1s',
            borderBottom: '1px solid var(--panel-border)'
        },
        onMouseEnter: (e)=>!isSelected && (e.currentTarget.style.background = 'var(--highlight)'),
        onMouseLeave: (e)=>!isSelected && (e.currentTarget.style.background = 'transparent'),
        onClick: onShowDetail,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: {
                    padding: '8px',
                    width: 32
                },
                onClick: (e)=>e.stopPropagation(),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "checkbox",
                    checked: isSelected,
                    onChange: onSelect
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 276,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 275,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: {
                    padding: '8px',
                    width: 44
                },
                children: item.main_image_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: item.main_image_url,
                    alt: "",
                    style: {
                        width: 36,
                        height: 36,
                        objectFit: 'contain',
                        borderRadius: 4,
                        background: '#fff'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 280,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: 36,
                        height: 36,
                        background: 'var(--panel-border)',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                        size: 14,
                        style: {
                            color: 'var(--text-muted)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 283,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 282,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 278,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: {
                    padding: '8px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            fontWeight: 500,
                            color: 'var(--text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 300
                        },
                        children: item.title || item.asin
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 288,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 10,
                            marginTop: 2
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "https://www.amazon.co.jp/dp/".concat(item.asin),
                                target: "_blank",
                                rel: "noopener noreferrer",
                                onClick: (e)=>e.stopPropagation(),
                                style: {
                                    color: 'var(--accent)',
                                    fontFamily: 'var(--font-mono)'
                                },
                                children: item.asin
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, this),
                            item.brand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: 'var(--text-muted)'
                                },
                                children: [
                                    "• ",
                                    item.brand
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 299,
                                columnNumber: 26
                            }, this),
                            item.is_new_product && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                variant: "primary",
                                size: "sm",
                                children: "NEW"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 300,
                                columnNumber: 35
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 287,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: {
                    padding: '8px',
                    textAlign: 'center',
                    width: 50
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3ScoreDisplay, {
                    basicScore: item.n3_score,
                    keepaScore: item.n3_keepa_score,
                    size: "sm"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 304,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 303,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: {
                    padding: '8px',
                    textAlign: 'right',
                    width: 85
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            fontWeight: 600,
                            color: (item.estimated_profit_margin || 0) >= 20 ? 'var(--success)' : 'var(--text)'
                        },
                        children: fmtY(item.estimated_profit_jpy)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 307,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 10,
                            color: (item.estimated_profit_margin || 0) >= 20 ? 'var(--success)' : 'var(--text-muted)'
                        },
                        children: [
                            (_item_estimated_profit_margin = item.estimated_profit_margin) === null || _item_estimated_profit_margin === void 0 ? void 0 : _item_estimated_profit_margin.toFixed(1),
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 310,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 306,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: {
                    padding: '8px',
                    textAlign: 'right',
                    width: 75
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11
                        },
                        children: item.bsr_current ? "#".concat(fmt(item.bsr_current)) : '-'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 315,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 9,
                            color: 'var(--text-muted)'
                        },
                        children: item.bsr_drops_30d ? "↑".concat(item.bsr_drops_30d, "/月") : ''
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 316,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: {
                    padding: '8px',
                    textAlign: 'right',
                    width: 55
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            fontWeight: 500
                        },
                        children: fmt(item.monthly_sales_estimate)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 321,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 9,
                            color: 'var(--text-muted)'
                        },
                        children: "/月"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 322,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 320,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: {
                    padding: '8px',
                    textAlign: 'center',
                    width: 50
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11
                        },
                        children: (_item_fba_offer_count = item.fba_offer_count) !== null && _item_fba_offer_count !== void 0 ? _item_fba_offer_count : '-'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 325,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 9,
                            color: 'var(--text-muted)'
                        },
                        children: "FBA"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 326,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 324,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: {
                    padding: '8px',
                    width: 90
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3RiskBadge, {
                    flags: item.risk_flags,
                    level: item.risk_level
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 329,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 328,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                style: {
                    padding: '8px',
                    width: 50
                },
                children: item.status === 'exists' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                    variant: "secondary",
                    size: "sm",
                    children: "登録済"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 333,
                    columnNumber: 11
                }, this) : item.is_auto_tracked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                    variant: "primary",
                    size: "sm",
                    children: "追跡中"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 335,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                    variant: "success",
                    size: "sm",
                    children: "完了"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 337,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 331,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
        lineNumber: 264,
        columnNumber: 5
    }, this);
});
_c3 = ResearchTableRow;
// 詳細パネル（拡大版・スクロールなし）
const DetailPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function DetailPanel(param) {
    let { item, onClose, onSendToEditing } = param;
    var _item_estimated_profit_margin;
    if (!item) return null;
    const fmt = (n)=>{
        var _n_toLocaleString;
        return (_n_toLocaleString = n === null || n === void 0 ? void 0 : n.toLocaleString()) !== null && _n_toLocaleString !== void 0 ? _n_toLocaleString : '-';
    };
    const fmtY = (n)=>n ? "¥".concat(n.toLocaleString()) : '-';
    const fmtU = (n)=>n ? "$".concat(n.toFixed(2)) : '-';
    // グリッドセル共通スタイル
    const cellStyle = {
        padding: '6px 8px',
        background: 'var(--highlight)',
        borderRadius: 6
    };
    const labelStyle = {
        fontSize: 9,
        color: 'var(--text-muted)',
        marginBottom: 2
    };
    const valueStyle = {
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--text)'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: DETAIL_PANEL_WIDTH,
            height: '100%',
            borderLeft: '1px solid var(--panel-border)',
            background: 'var(--panel)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--panel-border)',
                    flexShrink: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 13,
                            fontWeight: 600
                        },
                        children: "商品詳細"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 377,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        style: {
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: 4
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                            lineNumber: 379,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 378,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 376,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 80,
                                    height: 80,
                                    flexShrink: 0,
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    background: '#fff',
                                    border: '1px solid var(--panel-border)'
                                },
                                children: item.main_image_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: item.main_image_url,
                                    alt: "",
                                    style: {
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                    lineNumber: 389,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--highlight)'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                        size: 28,
                                        style: {
                                            color: 'var(--text-muted)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 392,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                    lineNumber: 391,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 387,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    minWidth: 0
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: 12,
                                            fontWeight: 600,
                                            margin: 0,
                                            lineHeight: 1.35,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        },
                                        children: item.title
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 397,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            marginTop: 4,
                                            fontSize: 10
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://www.amazon.co.jp/dp/".concat(item.asin),
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                style: {
                                                    color: 'var(--accent)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2
                                                },
                                                children: [
                                                    item.asin,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                        size: 9
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 402,
                                                        columnNumber: 28
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 401,
                                                columnNumber: 15
                                            }, this),
                                            item.brand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: 'var(--text-muted)'
                                                },
                                                children: [
                                                    "• ",
                                                    item.brand
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 404,
                                                columnNumber: 30
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 400,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: 6
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3RiskBadge, {
                                            flags: item.risk_flags,
                                            level: item.risk_level
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 407,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 406,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 396,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 386,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: 10,
                            background: 'var(--highlight)',
                            borderRadius: 8
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3ScoreDisplay, {
                                    basicScore: item.n3_score,
                                    keepaScore: item.n3_keepa_score,
                                    aiScore: item.n3_ai_score,
                                    showAll: true
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                    lineNumber: 415,
                                    columnNumber: 13
                                }, this),
                                item.n3_score_breakdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                        gap: 8,
                                        fontSize: 10
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                textAlign: 'center'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "利益"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 600
                                                    },
                                                    children: [
                                                        item.n3_score_breakdown.profit_score,
                                                        "/30"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 423,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                textAlign: 'center'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "需要"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 428,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 600
                                                    },
                                                    children: [
                                                        item.n3_score_breakdown.demand_score,
                                                        "/30"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 429,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 427,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                textAlign: 'center'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "競合"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 432,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 600
                                                    },
                                                    children: [
                                                        item.n3_score_breakdown.competition_score,
                                                        "/20"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 433,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 431,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                textAlign: 'center'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        color: 'var(--text-muted)'
                                                    },
                                                    children: "リスク"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 436,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontWeight: 600
                                                    },
                                                    children: [
                                                        item.n3_score_breakdown.risk_score,
                                                        "/20"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 437,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 435,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                    lineNumber: 422,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                            lineNumber: 414,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 413,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                        size: 11
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 447,
                                        columnNumber: 13
                                    }, this),
                                    " 価格・利益"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 446,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(6, 1fr)',
                                    gap: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "Amazon"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 450,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: fmtY(item.amazon_price_jpy)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 450,
                                                columnNumber: 72
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 450,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "eBay想定"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 451,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: fmtU(item.ebay_estimated_price_usd)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 451,
                                                columnNumber: 72
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 451,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "利益"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 452,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...valueStyle,
                                                    color: 'var(--success)'
                                                },
                                                children: fmtY(item.estimated_profit_jpy)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 452,
                                                columnNumber: 68
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 452,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "利益率"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 453,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...valueStyle,
                                                    color: (item.estimated_profit_margin || 0) >= 20 ? 'var(--success)' : 'var(--text)'
                                                },
                                                children: [
                                                    (_item_estimated_profit_margin = item.estimated_profit_margin) === null || _item_estimated_profit_margin === void 0 ? void 0 : _item_estimated_profit_margin.toFixed(1),
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 453,
                                                columnNumber: 69
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 453,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "FBA手数料"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 454,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: fmtY(item.fba_fees_jpy)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 454,
                                                columnNumber: 72
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 454,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "紹介料"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 455,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: [
                                                    item.referral_fee_percent || 15,
                                                    "%"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 455,
                                                columnNumber: 69
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 455,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 449,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 445,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                        size: 11
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 462,
                                        columnNumber: 13
                                    }, this),
                                    " 需要指標"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 461,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(6, 1fr)',
                                    gap: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "BSR"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 465,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: item.bsr_current ? "#".concat(fmt(item.bsr_current)) : '-'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 465,
                                                columnNumber: 69
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 465,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "BSRドロップ"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 466,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: item.bsr_drops_30d ? "↑".concat(item.bsr_drops_30d) : '-'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 466,
                                                columnNumber: 73
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 466,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "月販"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 467,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: [
                                                    fmt(item.monthly_sales_estimate),
                                                    "個"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 467,
                                                columnNumber: 68
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 467,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "月間売上"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 468,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: fmtY(item.monthly_revenue_estimate)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 468,
                                                columnNumber: 70
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 468,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "品切れ率"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 469,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: item.out_of_stock_percentage_30d ? "".concat(Math.round(item.out_of_stock_percentage_30d * 100), "%") : '-'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 469,
                                                columnNumber: 70
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 469,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "新製品"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 470,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...valueStyle,
                                                    color: item.is_new_product ? 'var(--accent)' : 'var(--text-muted)'
                                                },
                                                children: item.is_new_product ? '✓' : '✗'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 470,
                                                columnNumber: 69
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 470,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 464,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 460,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        size: 11
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 477,
                                        columnNumber: 13
                                    }, this),
                                    " 競合状況"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 476,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(6, 1fr)',
                                    gap: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "出品者数"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 480,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: fmt((item.new_offer_count || 0) + (item.fba_offer_count || 0))
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 480,
                                                columnNumber: 70
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 480,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "FBA"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 481,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...valueStyle,
                                                    color: (item.fba_offer_count || 0) >= 15 ? 'var(--warning)' : 'var(--text)'
                                                },
                                                children: fmt(item.fba_offer_count)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 481,
                                                columnNumber: 69
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 481,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "Amazon"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 482,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    ...valueStyle,
                                                    color: item.is_amazon ? 'var(--warning)' : 'var(--success)'
                                                },
                                                children: item.is_amazon ? '⚠ Yes' : '✓ No'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 482,
                                                columnNumber: 72
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 482,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "Buy Box"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 483,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: fmtY(item.buy_box_price_jpy)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 483,
                                                columnNumber: 73
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 483,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "最安値"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 484,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: fmtY(item.lowest_new_price_jpy)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 484,
                                                columnNumber: 69
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 484,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "レビュー"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 485,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: valueStyle,
                                                children: [
                                                    fmt(item.review_count),
                                                    " ★",
                                                    item.star_rating || '-'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 485,
                                                columnNumber: 70
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 485,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 479,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 475,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 10,
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                        size: 11
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 492,
                                        columnNumber: 13
                                    }, this),
                                    " 物理情報"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 491,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: 4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "サイズ"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 495,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 11,
                                                    fontWeight: 500
                                                },
                                                children: item.length_cm ? "".concat(item.length_cm, "×").concat(item.width_cm, "×").concat(item.height_cm, "cm") : '-'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 495,
                                                columnNumber: 69
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 495,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "重量"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 496,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 11,
                                                    fontWeight: 500
                                                },
                                                children: item.weight_g ? "".concat(item.weight_g, "g") : '-'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 496,
                                                columnNumber: 68
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 496,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "カテゴリ"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 497,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 11,
                                                    fontWeight: 500,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                },
                                                children: item.category || '-'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 497,
                                                columnNumber: 70
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 497,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: cellStyle,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: labelStyle,
                                                children: "発売日"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 498,
                                                columnNumber: 36
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 11,
                                                    fontWeight: 500
                                                },
                                                children: item.release_date ? new Date(item.release_date).toLocaleDateString('ja-JP') : '-'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 498,
                                                columnNumber: 69
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 498,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 494,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 490,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 6
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "https://www.amazon.co.jp/dp/".concat(item.asin),
                                target: "_blank",
                                rel: "noopener noreferrer",
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 4,
                                    padding: 8,
                                    background: 'var(--highlight)',
                                    borderRadius: 6,
                                    color: 'var(--accent)',
                                    fontSize: 11,
                                    fontWeight: 500,
                                    textDecoration: 'none'
                                },
                                children: [
                                    "Amazon ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                        size: 10
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 505,
                                        columnNumber: 20
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 504,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "https://keepa.com/#!product/5-".concat(item.asin),
                                target: "_blank",
                                rel: "noopener noreferrer",
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 4,
                                    padding: 8,
                                    background: 'var(--highlight)',
                                    borderRadius: 6,
                                    color: 'var(--accent)',
                                    fontSize: 11,
                                    fontWeight: 500,
                                    textDecoration: 'none'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
                                        size: 11
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 508,
                                        columnNumber: 13
                                    }, this),
                                    " Keepa ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                        size: 10
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 508,
                                        columnNumber: 43
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 507,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "https://www.ebay.com/sch/i.html?_nkw=".concat(encodeURIComponent(item.title || item.asin)),
                                target: "_blank",
                                rel: "noopener noreferrer",
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 4,
                                    padding: 8,
                                    background: 'var(--highlight)',
                                    borderRadius: 6,
                                    color: 'var(--accent)',
                                    fontSize: 11,
                                    fontWeight: 500,
                                    textDecoration: 'none'
                                },
                                children: [
                                    "eBay検索 ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                        size: 10
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 511,
                                        columnNumber: 20
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 510,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 503,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 384,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: 12,
                    borderTop: '1px solid var(--panel-border)',
                    flexShrink: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                    variant: "primary",
                    onClick: ()=>onSendToEditing(item),
                    disabled: item.status === 'exists',
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 522,
                        columnNumber: 17
                    }, void 0),
                    style: {
                        width: '100%'
                    },
                    children: item.status === 'exists' ? '登録済み' : 'データ編集に登録'
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                    lineNumber: 518,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 517,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
        lineNumber: 366,
        columnNumber: 5
    }, this);
});
_c4 = DetailPanel;
// 自動化タブ
const AutomationTab = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s1(function AutomationTab() {
    _s1();
    const [configs, setConfigs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const { toast: showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AutomationTab.AutomationTab.useEffect": ()=>{
            loadConfigs();
        }
    }["AutomationTab.AutomationTab.useEffect"], []);
    const loadConfigs = async ()=>{
        setIsLoading(true);
        try {
            const res = await fetch('/api/research/amazon-auto?includeStats=true');
            const data = await res.json();
            if (data.success) setConfigs(data.data || []);
        } catch (err) {
            console.error('Load configs error:', err);
        }
        setIsLoading(false);
    };
    const handleRunNow = async (configId)=>{
        try {
            const res = await fetch('/api/cron/amazon-research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    configId
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast("✅ ".concat(data.processed || 0, "件処理完了"), 'success');
                loadConfigs();
            } else {
                showToast("❌ ".concat(data.error), 'error');
            }
        } catch (err) {
            showToast('エラーが発生しました', 'error');
        }
    };
    const handleToggleEnabled = async (config)=>{
        try {
            const res = await fetch('/api/research/amazon-auto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'update',
                    config: {
                        id: config.id,
                        enabled: !config.enabled
                    }
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast("".concat(config.enabled ? '⏸ 停止' : '▶ 有効化', "しました"), 'success');
                loadConfigs();
            }
        } catch (err) {
            showToast('エラーが発生しました', 'error');
        }
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                size: 24,
                className: "animate-spin",
                style: {
                    color: 'var(--accent)'
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 596,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
            lineNumber: 595,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            flex: 1,
            overflow: 'auto',
            padding: 16
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: 16,
                                    fontWeight: 600,
                                    margin: 0
                                },
                                children: "自動リサーチ設定"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 605,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 12,
                                    color: 'var(--text-muted)',
                                    margin: '4px 0 0'
                                },
                                children: "セラー監視・キーワード監視・カテゴリランキング取得を自動化"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 606,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 604,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "primary",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                            lineNumber: 610,
                            columnNumber: 43
                        }, void 0),
                        children: "新規作成"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 610,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 603,
                columnNumber: 7
            }, this),
            configs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'center',
                    padding: 60,
                    color: 'var(--text-muted)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                        size: 48,
                        style: {
                            marginBottom: 16,
                            opacity: 0.5
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 617,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 14,
                            fontWeight: 600,
                            marginBottom: 8
                        },
                        children: "自動リサーチ設定がありません"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 618,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            marginBottom: 16
                        },
                        children: [
                            "セラーID・キーワード・カテゴリを設定して",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 620,
                                columnNumber: 34
                            }, this),
                            "自動でASINを収集・分析できます"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 619,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "primary",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                            lineNumber: 623,
                            columnNumber: 45
                        }, void 0),
                        children: "最初の設定を作成"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 623,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 616,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                },
                children: configs.map((config)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: 16,
                            background: 'var(--panel)',
                            borderRadius: 8,
                            border: '1px solid var(--panel-border)',
                            opacity: config.enabled ? 1 : 0.6
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: 14,
                                                        fontWeight: 600
                                                    },
                                                    children: config.name
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 641,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                                    variant: config.enabled ? 'success' : 'secondary',
                                                    size: "sm",
                                                    children: config.enabled ? '有効' : '停止中'
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 642,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 640,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 11,
                                                color: 'var(--text-muted)',
                                                marginTop: 4
                                            },
                                            children: [
                                                config.schedule_type === 'daily' ? '毎日' : config.schedule_type === 'weekly' ? '毎週' : '毎時',
                                                config.schedule_time && " ".concat(config.schedule_time)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 646,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                    lineNumber: 639,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: 6
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                            variant: "secondary",
                                            size: "sm",
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 652,
                                                columnNumber: 65
                                            }, void 0),
                                            onClick: ()=>handleRunNow(config.id),
                                            children: "実行"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 652,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                            variant: "secondary",
                                            size: "sm",
                                            icon: config.enabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 655,
                                                columnNumber: 82
                                            }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 655,
                                                columnNumber: 104
                                            }, void 0),
                                            onClick: ()=>handleToggleEnabled(config),
                                            children: config.enabled ? '停止' : '有効'
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 655,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                    lineNumber: 651,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                            lineNumber: 638,
                            columnNumber: 15
                        }, this)
                    }, config.id, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 630,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 628,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
        lineNumber: 602,
        columnNumber: 5
    }, this);
}, "XECmo3LV9b+BJGbdtx6w1PlzLg4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
}));
_c5 = AutomationTab;
function AmazonResearchN3PageLayout() {
    _s2();
    const { user, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { toasts, removeToast, toast: showToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const mainContentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Store
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$amazon$2d$research$2d$n3$2f$store$2f$use$2d$amazon$2d$research$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAmazonResearchStore"])();
    const { items, setItems, addItems, updateItem, recalculateStats, isLoading, setIsLoading, isProcessing, setIsProcessing, filter, setFilter, sortType, setSortType, searchQuery, setSearchQuery, selectedIds, toggleSelection, selectAll, deselectAll, selectedItem, setSelectedItem, showDetailPanel, setShowDetailPanel, stats, setStats, viewMode, setViewMode, pageSize, setPageSize } = store;
    const filteredItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$amazon$2d$research$2d$n3$2f$store$2f$use$2d$amazon$2d$research$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFilteredItems"])();
    const paginatedItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$amazon$2d$research$2d$n3$2f$store$2f$use$2d$amazon$2d$research$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePaginatedItems"])();
    // UI状態
    const [activeL2Tab, setActiveL2Tab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('research');
    const [language, setLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('ja');
    const [pinnedTab, setPinnedTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hoveredTab, setHoveredTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isHeaderHovered, setIsHeaderHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [tipsEnabled, setTipsEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [fastMode, setFastMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isInitialLoading, setIsInitialLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // 初期データロード（DBから）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AmazonResearchN3PageLayout.useEffect": ()=>{
            loadFromDatabase();
        }
    }["AmazonResearchN3PageLayout.useEffect"], []);
    const loadFromDatabase = async ()=>{
        setIsLoading(true);
        setIsInitialLoading(true);
        try {
            const res = await fetch('/api/research/amazon-batch?limit=200');
            const data = await res.json();
            if (data.success && data.data && data.data.length > 0) {
                // DBからデータ取得成功
                const enriched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$amazon$2d$research$2d$n3$2f$lib$2f$score$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enrichItemsWithAllScores"])(data.data);
                setItems(enriched);
                showToast("📦 ".concat(data.data.length, "件のデータを読み込みました"), 'success');
            } else {
                // DBにデータがない場合は空のまま
                setItems([]);
            }
        } catch (err) {
            console.error('Load from DB error:', err);
            setItems([]);
        }
        setIsLoading(false);
        setIsInitialLoading(false);
        recalculateStats();
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AmazonResearchN3PageLayout.useEffect": ()=>{
            if (!isInitialLoading) {
                recalculateStats();
            }
        }
    }["AmazonResearchN3PageLayout.useEffect"], [
        items,
        isInitialLoading
    ]);
    // ASIN投入
    const handleSubmitASINs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AmazonResearchN3PageLayout.useCallback[handleSubmitASINs]": async (asins)=>{
            setIsProcessing(true);
            try {
                const res = await fetch('/api/research/amazon-batch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        asins
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.results) {
                        const enriched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$amazon$2d$research$2d$n3$2f$lib$2f$score$2d$calculator$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enrichItemsWithAllScores"])(data.results);
                        addItems(enriched);
                        showToast("✅ ".concat(data.completed, "/").concat(data.total, "件処理完了"), 'success');
                    }
                } else {
                    showToast('エラーが発生しました', 'error');
                }
            } catch (err) {
                showToast('エラーが発生しました', 'error');
            }
            setIsProcessing(false);
        }
    }["AmazonResearchN3PageLayout.useCallback[handleSubmitASINs]"], [
        addItems,
        showToast,
        setIsProcessing
    ]);
    // 商品登録
    const handleSendToEditing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AmazonResearchN3PageLayout.useCallback[handleSendToEditing]": async (item)=>{
            try {
                const res = await fetch('/api/products/create-from-research', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        asin: item.asin,
                        title: item.title,
                        image_url: item.main_image_url,
                        price_jpy: item.amazon_price_jpy,
                        brand: item.brand,
                        category: item.category,
                        n3_score: item.n3_score
                    })
                });
                if (res.ok) {
                    updateItem(item.id, {
                        status: 'exists'
                    });
                    showToast("✅ ".concat(item.asin, " をデータ編集に登録しました"), 'success');
                }
            } catch (err) {
                showToast('登録エラー', 'error');
            }
        }
    }["AmazonResearchN3PageLayout.useCallback[handleSendToEditing]"], [
        updateItem,
        showToast
    ]);
    // エクスポート
    const handleExport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AmazonResearchN3PageLayout.useCallback[handleExport]": async ()=>{
            showToast('📥 Excelエクスポート準備中...', 'success');
        // TODO: 実装
        }
    }["AmazonResearchN3PageLayout.useCallback[handleExport]"], [
        showToast
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            height: '100vh',
            overflow: 'hidden',
            background: 'var(--bg)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3ToastContainer"], {
                toasts: toasts,
                onClose: removeToast
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 793,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: mainContentRef,
                id: "main-scroll-container",
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    height: '100%',
                    minWidth: 0,
                    overflow: 'hidden'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$layout$2f$n3$2d$collapsible$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3CollapsibleHeader"], {
                        scrollContainerId: "main-scroll-container",
                        threshold: 10,
                        transitionDuration: 200,
                        zIndex: 40,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$header$2f$n3$2d$page$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3PageHeader"], {
                                user: user,
                                onLogout: logout,
                                language: language,
                                onLanguageToggle: ()=>setLanguage((l)=>l === 'ja' ? 'en' : 'ja'),
                                pinnedTab: pinnedTab,
                                onPinnedTabChange: setPinnedTab,
                                hoveredTab: hoveredTab,
                                onHoveredTabChange: setHoveredTab,
                                isHeaderHovered: isHeaderHovered,
                                onHeaderHoveredChange: setIsHeaderHovered
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 797,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'var(--panel)',
                                    borderBottom: '1px solid var(--panel-border)',
                                    padding: '0 12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            marginRight: 16
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 6,
                                                    background: 'linear-gradient(135deg, #FF9900, #FF6600)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                    size: 14,
                                                    style: {
                                                        color: 'white'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 814,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 813,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: 13,
                                                    fontWeight: 600
                                                },
                                                children: "Amazon Research"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 816,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 812,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                                        orientation: "vertical",
                                        style: {
                                            height: 24
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 818,
                                        columnNumber: 13
                                    }, this),
                                    L2_TABS.map((tab)=>{
                                        const Icon = tab.icon;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setActiveL2Tab(tab.id),
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 5,
                                                padding: '6px 12px',
                                                marginLeft: 6,
                                                fontSize: 12,
                                                fontWeight: 500,
                                                background: activeL2Tab === tab.id ? 'var(--accent)' : 'transparent',
                                                color: activeL2Tab === tab.id ? 'white' : 'var(--text-muted)',
                                                border: 'none',
                                                borderRadius: 6,
                                                cursor: 'pointer',
                                                transition: 'all 0.15s'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 835,
                                                    columnNumber: 19
                                                }, this),
                                                language === 'ja' ? tab.label : tab.labelEn
                                            ]
                                        }, tab.id, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 822,
                                            columnNumber: 17
                                        }, this);
                                    }),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 840,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                        variant: "secondary",
                                        size: "sm",
                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 844,
                                            columnNumber: 21
                                        }, void 0),
                                        onClick: loadFromDatabase,
                                        disabled: isLoading,
                                        children: "更新"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 841,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 811,
                                columnNumber: 11
                            }, this),
                            activeL2Tab === 'research' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(6, 1fr)',
                                            gap: 8,
                                            padding: '8px 12px',
                                            background: 'var(--highlight)',
                                            borderBottom: '1px solid var(--panel-border)'
                                        },
                                        children: [
                                            {
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 858,
                                                    columnNumber: 27
                                                }, this),
                                                label: 'リサーチ済',
                                                value: stats.total,
                                                color: 'var(--accent)'
                                            },
                                            {
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 859,
                                                    columnNumber: 27
                                                }, this),
                                                label: '完了',
                                                value: stats.completed,
                                                sub: "".concat(stats.total > 0 ? Math.round(stats.completed / stats.total * 100) : 0, "%"),
                                                color: 'var(--success)'
                                            },
                                            {
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 860,
                                                    columnNumber: 27
                                                }, this),
                                                label: 'スコア80+',
                                                value: stats.high_score_count,
                                                color: '#FFD700',
                                                onClick: ()=>setFilter({
                                                        type: 'high_score'
                                                    })
                                            },
                                            {
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 861,
                                                    columnNumber: 27
                                                }, this),
                                                label: '利益率20%+',
                                                value: stats.profitable_count,
                                                color: 'var(--success)',
                                                onClick: ()=>setFilter({
                                                        type: 'profitable'
                                                    })
                                            },
                                            {
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 862,
                                                    columnNumber: 27
                                                }, this),
                                                label: '月販100+',
                                                value: stats.high_sales_count,
                                                color: 'var(--accent)',
                                                onClick: ()=>setFilter({
                                                        type: 'high_sales'
                                                    })
                                            },
                                            {
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 863,
                                                    columnNumber: 27
                                                }, this),
                                                label: '登録済',
                                                value: stats.exists_in_db_count,
                                                color: 'var(--warning)',
                                                onClick: ()=>setFilter({
                                                        type: 'exists'
                                                    })
                                            }
                                        ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                onClick: s.onClick,
                                                style: {
                                                    padding: '10px 12px',
                                                    background: 'var(--panel)',
                                                    borderRadius: 8,
                                                    border: '1px solid var(--panel-border)',
                                                    cursor: s.onClick ? 'pointer' : 'default',
                                                    transition: 'transform 0.15s'
                                                },
                                                onMouseEnter: (e)=>s.onClick && (e.currentTarget.style.transform = 'translateY(-1px)'),
                                                onMouseLeave: (e)=>s.onClick && (e.currentTarget.style.transform = 'translateY(0)'),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 6,
                                                            marginBottom: 4
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: s.color
                                                                },
                                                                children: s.icon
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 877,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: 10,
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                children: s.label
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 878,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 876,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 20,
                                                            fontWeight: 700,
                                                            color: 'var(--text)'
                                                        },
                                                        children: s.value
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 880,
                                                        columnNumber: 21
                                                    }, this),
                                                    s.sub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 10,
                                                            color: 'var(--text-muted)'
                                                        },
                                                        children: s.sub
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 881,
                                                        columnNumber: 31
                                                    }, this)
                                                ]
                                            }, s.label, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 865,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 856,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '8px 12px',
                                            borderBottom: '1px solid var(--panel-border)'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ASINInputPanel, {
                                            onSubmit: handleSubmitASINs,
                                            isProcessing: isProcessing
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 888,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 887,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                            background: 'var(--highlight)',
                                            borderBottom: '1px solid var(--panel-border)',
                                            padding: '0 12px',
                                            overflowX: 'auto'
                                        },
                                        children: FILTER_TABS.map((tab)=>{
                                            const count = tab.id === 'all' ? items.length : tab.id === 'high_score' ? stats.high_score_count : tab.id === 'profitable' ? stats.profitable_count : tab.id === 'high_sales' ? stats.high_sales_count : tab.id === 'low_competition' ? stats.low_competition_count || 0 : tab.id === 'new_products' ? stats.new_products_count || 0 : tab.id === 'risky' ? stats.risky_count || 0 : stats.exists_in_db_count;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$filter$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3FilterTab"], {
                                                id: tab.id,
                                                label: tab.label,
                                                count: count,
                                                active: filter.type === tab.id,
                                                onClick: ()=>setFilter({
                                                        type: tab.id
                                                    })
                                            }, tab.id, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 903,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 892,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 44,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: 'var(--panel)',
                                            borderBottom: '1px solid var(--panel-border)',
                                            padding: '0 12px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setTipsEnabled(!tipsEnabled),
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 4,
                                                            padding: '5px 10px',
                                                            fontSize: 11,
                                                            background: tipsEnabled ? 'rgba(59,130,246,0.1)' : 'transparent',
                                                            border: "1px solid ".concat(tipsEnabled ? 'rgba(59,130,246,0.3)' : 'var(--panel-border)'),
                                                            borderRadius: 6,
                                                            color: tipsEnabled ? 'rgb(59,130,246)' : 'var(--text-muted)',
                                                            cursor: 'pointer'
                                                        },
                                                        children: "💡 Tips"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 918,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setFastMode(!fastMode),
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 4,
                                                            padding: '5px 10px',
                                                            fontSize: 11,
                                                            background: fastMode ? 'rgba(245,158,11,0.1)' : 'transparent',
                                                            border: "1px solid ".concat(fastMode ? 'rgba(245,158,11,0.3)' : 'var(--panel-border)'),
                                                            borderRadius: 6,
                                                            color: fastMode ? 'rgb(245,158,11)' : 'var(--text-muted)',
                                                            cursor: 'pointer'
                                                        },
                                                        children: "⚡ Fast"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 919,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: pageSize,
                                                        onChange: (e)=>setPageSize(Number(e.target.value)),
                                                        style: {
                                                            height: 30,
                                                            padding: '0 8px',
                                                            fontSize: 11,
                                                            border: '1px solid var(--panel-border)',
                                                            borderRadius: 6,
                                                            background: 'var(--panel)',
                                                            color: 'var(--text)'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: 50,
                                                                children: "50"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 921,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: 100,
                                                                children: "100"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 922,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: 200,
                                                                children: "200"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 923,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: 500,
                                                                children: "500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 924,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 920,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: 12,
                                                            color: 'var(--text-muted)'
                                                        },
                                                        children: [
                                                            filteredItems.length,
                                                            "/",
                                                            items.length,
                                                            "件"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 926,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 917,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 8
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Input"], {
                                                        value: searchQuery,
                                                        onChange: (e)=>setSearchQuery(e.target.value),
                                                        placeholder: "ASIN/タイトル/ブランド...",
                                                        style: {
                                                            width: 180,
                                                            height: 30,
                                                            fontSize: 11
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 929,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: sortType,
                                                        onChange: (e)=>setSortType(e.target.value),
                                                        style: {
                                                            height: 30,
                                                            padding: '0 8px',
                                                            fontSize: 11,
                                                            background: 'var(--panel)',
                                                            border: '1px solid var(--panel-border)',
                                                            borderRadius: 6,
                                                            color: 'var(--text)'
                                                        },
                                                        children: SORT_OPTIONS.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: o.value,
                                                                children: o.label
                                                            }, o.value, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 931,
                                                                columnNumber: 46
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 930,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                                                        orientation: "vertical",
                                                        style: {
                                                            height: 20
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 933,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                                        variant: "secondary",
                                                        size: "sm",
                                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                            lineNumber: 934,
                                                            columnNumber: 65
                                                        }, void 0),
                                                        onClick: handleExport,
                                                        children: "Excel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 934,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                                        variant: "primary",
                                                        size: "sm",
                                                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                            size: 12
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                            lineNumber: 935,
                                                            columnNumber: 63
                                                        }, void 0),
                                                        disabled: selectedIds.size === 0,
                                                        children: [
                                                            "登録(",
                                                            selectedIds.size,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 935,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$view$2d$mode$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3ViewModeToggle"], {
                                                        value: viewMode,
                                                        onChange: (m)=>setViewMode(m),
                                                        size: "sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 936,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 928,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 916,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 796,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            display: 'flex',
                            overflow: 'hidden'
                        },
                        children: [
                            activeL2Tab === 'research' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            overflow: 'auto'
                                        },
                                        children: isInitialLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    textAlign: 'center'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                        size: 32,
                                                        className: "animate-spin",
                                                        style: {
                                                            color: 'var(--accent)',
                                                            marginBottom: 12
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 951,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: 14,
                                                            color: 'var(--text-muted)'
                                                        },
                                                        children: "データを読み込み中..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 952,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                lineNumber: 950,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 949,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                            style: {
                                                width: '100%',
                                                borderCollapse: 'collapse',
                                                fontSize: 12
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                    style: {
                                                        position: 'sticky',
                                                        top: 0,
                                                        background: 'var(--panel)',
                                                        zIndex: 10
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        style: {
                                                            borderBottom: '1px solid var(--panel-border)'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: 8,
                                                                    width: 32
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "checkbox",
                                                                    checked: selectedIds.size === paginatedItems.length && paginatedItems.length > 0,
                                                                    onChange: ()=>selectedIds.size === paginatedItems.length ? deselectAll() : selectAll()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                    lineNumber: 960,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 959,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: 8,
                                                                    fontSize: 10,
                                                                    fontWeight: 600,
                                                                    color: 'var(--text-muted)',
                                                                    textAlign: 'left'
                                                                },
                                                                children: "画像"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 962,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: 8,
                                                                    fontSize: 10,
                                                                    fontWeight: 600,
                                                                    color: 'var(--text-muted)',
                                                                    textAlign: 'left'
                                                                },
                                                                children: "商品情報"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 963,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: 8,
                                                                    fontSize: 10,
                                                                    fontWeight: 600,
                                                                    color: 'var(--text-muted)',
                                                                    textAlign: 'center'
                                                                },
                                                                children: "スコア"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 964,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: 8,
                                                                    fontSize: 10,
                                                                    fontWeight: 600,
                                                                    color: 'var(--text-muted)',
                                                                    textAlign: 'right'
                                                                },
                                                                children: "利益"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 965,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: 8,
                                                                    fontSize: 10,
                                                                    fontWeight: 600,
                                                                    color: 'var(--text-muted)',
                                                                    textAlign: 'right'
                                                                },
                                                                children: "BSR"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 966,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: 8,
                                                                    fontSize: 10,
                                                                    fontWeight: 600,
                                                                    color: 'var(--text-muted)',
                                                                    textAlign: 'right'
                                                                },
                                                                children: "月販"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 967,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: 8,
                                                                    fontSize: 10,
                                                                    fontWeight: 600,
                                                                    color: 'var(--text-muted)',
                                                                    textAlign: 'center'
                                                                },
                                                                children: "競合"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 968,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: 8,
                                                                    fontSize: 10,
                                                                    fontWeight: 600,
                                                                    color: 'var(--text-muted)',
                                                                    textAlign: 'left'
                                                                },
                                                                children: "リスク"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 969,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                style: {
                                                                    padding: 8,
                                                                    fontSize: 10,
                                                                    fontWeight: 600,
                                                                    color: 'var(--text-muted)',
                                                                    textAlign: 'left'
                                                                },
                                                                children: "状態"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                lineNumber: 970,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 958,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 957,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                    children: paginatedItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            colSpan: 10,
                                                            style: {
                                                                padding: 60,
                                                                textAlign: 'center',
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                                    size: 48,
                                                                    style: {
                                                                        marginBottom: 12,
                                                                        opacity: 0.3
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                    lineNumber: 977,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: 14,
                                                                        fontWeight: 500
                                                                    },
                                                                    children: "データがありません"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                    lineNumber: 978,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        fontSize: 12,
                                                                        marginTop: 4
                                                                    },
                                                                    children: "ASINを入力してリサーチを開始してください"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                                    lineNumber: 979,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                            lineNumber: 976,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                        lineNumber: 975,
                                                        columnNumber: 25
                                                    }, this) : paginatedItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ResearchTableRow, {
                                                            item: item,
                                                            isSelected: selectedIds.has(item.id),
                                                            onSelect: ()=>toggleSelection(item.id),
                                                            onShowDetail: ()=>{
                                                                setSelectedItem(item);
                                                                setShowDetailPanel(true);
                                                            }
                                                        }, item.id, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                            lineNumber: 984,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                                    lineNumber: 973,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 956,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 947,
                                        columnNumber: 15
                                    }, this),
                                    showDetailPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailPanel, {
                                        item: selectedItem,
                                        onClose: ()=>setShowDetailPanel(false),
                                        onSendToEditing: handleSendToEditing
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                        lineNumber: 998,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true),
                            activeL2Tab === 'automation' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AutomationTab, {}, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 1007,
                                columnNumber: 44
                            }, this),
                            activeL2Tab === 'history' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-muted)'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        textAlign: 'center'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                            size: 48,
                                            style: {
                                                marginBottom: 16,
                                                opacity: 0.5
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 1012,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 14,
                                                fontWeight: 600,
                                                marginBottom: 8
                                            },
                                            children: "リサーチ履歴"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 1013,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 12
                                            },
                                            children: "過去のリサーチ結果・価格変動履歴を表示"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                            lineNumber: 1014,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                    lineNumber: 1011,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                                lineNumber: 1010,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 944,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$layout$2f$n3$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Footer"], {
                        copyright: "© 2025 N3 Platform",
                        version: "Amazon Research v3.0",
                        status: {
                            label: 'DB',
                            connected: true
                        },
                        links: [
                            {
                                id: 'amazon',
                                label: 'Amazon.co.jp',
                                href: 'https://www.amazon.co.jp'
                            },
                            {
                                id: 'keepa',
                                label: 'Keepa',
                                href: 'https://keepa.com'
                            }
                        ]
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                        lineNumber: 1020,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
                lineNumber: 795,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx",
        lineNumber: 792,
        columnNumber: 5
    }, this);
}
_s2(AmazonResearchN3PageLayout, "V48gxjmagW7cCnooNOeP7dqf39I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$amazon$2d$research$2d$n3$2f$store$2f$use$2d$amazon$2d$research$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAmazonResearchStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$amazon$2d$research$2d$n3$2f$store$2f$use$2d$amazon$2d$research$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFilteredItems"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$amazon$2d$research$2d$n3$2f$store$2f$use$2d$amazon$2d$research$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePaginatedItems"]
    ];
});
_c6 = AmazonResearchN3PageLayout;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "N3ScoreDisplay");
__turbopack_context__.k.register(_c1, "N3RiskBadge");
__turbopack_context__.k.register(_c2, "ASINInputPanel");
__turbopack_context__.k.register(_c3, "ResearchTableRow");
__turbopack_context__.k.register(_c4, "DetailPanel");
__turbopack_context__.k.register(_c5, "AutomationTab");
__turbopack_context__.k.register(_c6, "AmazonResearchN3PageLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/amazon-research-n3/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/amazon-research-n3/page.tsx
/**
 * Amazon Research N3 - メインページ
 * 
 * v3.0 - workspace統一アーキテクチャ
 * 
 * 設計:
 * - editing-n3と同じN3CollapsibleHeader構造
 * - L2タブ（リサーチ / 自動化 / 設定）
 * - L3フィルター
 * - 詳細パネル/モーダル対応
 */ __turbopack_context__.s([
    "default",
    ()=>AmazonResearchN3Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$amazon$2d$research$2d$n3$2f$components$2f$amazon$2d$research$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/amazon-research-n3/components/amazon-research-n3-page-layout.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// ============================================================
// 無限ループ検知設定
// ============================================================
const LOOP_DETECTION = {
    MOUNT_THRESHOLD: 10,
    MOUNT_RESET_INTERVAL: 10000
};
let renderCount = 0;
function AmazonResearchN3Page() {
    _s();
    renderCount++;
    if ("TURBOPACK compile-time truthy", 1) {
        console.log("[AmazonResearchN3Page] RENDER #".concat(renderCount));
    }
    const mountCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const [blocked, setBlocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AmazonResearchN3Page.useEffect": ()=>{
            mountCountRef.current++;
            if (mountCountRef.current > LOOP_DETECTION.MOUNT_THRESHOLD) {
                console.error('[AmazonResearchN3Page] 🚨 無限ループ検知!');
                setBlocked(true);
                return;
            }
            const timer = setTimeout({
                "AmazonResearchN3Page.useEffect.timer": ()=>{
                    mountCountRef.current = 0;
                }
            }["AmazonResearchN3Page.useEffect.timer"], LOOP_DETECTION.MOUNT_RESET_INTERVAL);
            return ({
                "AmazonResearchN3Page.useEffect": ()=>clearTimeout(timer)
            })["AmazonResearchN3Page.useEffect"];
        }
    }["AmazonResearchN3Page.useEffect"], []);
    if (blocked) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '2rem',
                textAlign: 'center',
                background: 'var(--bg)',
                color: 'var(--text)',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    style: {
                        color: 'var(--error)',
                        marginBottom: '1rem',
                        fontSize: '1.5rem'
                    },
                    children: "⚠️ 無限ループ検知"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/page.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        marginBottom: '2rem',
                        color: 'var(--text-muted)'
                    },
                    children: "ブラウザのDevTools → Consoleでログを確認してください。"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/page.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>window.location.reload(),
                    style: {
                        padding: '0.75rem 1.5rem',
                        background: 'var(--accent)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    },
                    children: "リロード"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/page.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/page.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$amazon$2d$research$2d$n3$2f$components$2f$amazon$2d$research$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmazonResearchN3PageLayout"], {}, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/amazon-research-n3/page.tsx",
        lineNumber: 91,
        columnNumber: 10
    }, this);
}
_s(AmazonResearchN3Page, "oWhp1Aw6z0p3TJfFBA7OxTpEG/M=");
_c = AmazonResearchN3Page;
var _c;
__turbopack_context__.k.register(_c, "AmazonResearchN3Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/amazon-research-n3/page.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/n3-frontend_vps/app/tools/amazon-research-n3/page.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_6b1b3e95._.js.map