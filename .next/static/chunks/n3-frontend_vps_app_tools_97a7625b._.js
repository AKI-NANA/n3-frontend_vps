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
"[project]/n3-frontend_vps/app/tools/bookkeeping-n3/store/use-bookkeeping-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/bookkeeping-n3/store/use-bookkeeping-store.ts
/**
 * N3 記帳オートメーション - Zustand Store
 * 
 * 左パネル（取引リスト）と右パネル（ルール作成）の連動状態を管理
 */ __turbopack_context__.s([
    "useActiveRules",
    ()=>useActiveRules,
    "useBookkeepingStore",
    ()=>useBookkeepingStore,
    "useDraftRule",
    ()=>useDraftRule,
    "useFilteredTransactions",
    ()=>useFilteredTransactions,
    "useRules",
    ()=>useRules,
    "useSelectedTransaction",
    ()=>useSelectedTransaction,
    "useTransactionStats",
    ()=>useTransactionStats,
    "useTransactions",
    ()=>useTransactions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
// ============================================================
// Initial State
// ============================================================
const initialFilter = {
    status: 'pending',
    sourceName: '',
    dateFrom: '',
    dateTo: '',
    searchKeyword: ''
};
const initialDraftRule = {
    keyword: '',
    match_type: 'partial',
    target_category: '',
    target_sub_category: '',
    tax_code: '課税仕入 10%',
    priority: 100,
    rule_name: '',
    rule_description: ''
};
const initialState = {
    transactions: [],
    transactionsLoading: false,
    transactionsError: null,
    transactionStats: {
        pending: 0,
        simulated: 0,
        submitted: 0,
        ignored: 0,
        total: 0
    },
    rules: [],
    rulesLoading: false,
    rulesError: null,
    selectedTransactionId: null,
    selectedTransaction: null,
    filter: initialFilter,
    isCreatingRule: false,
    draftRule: initialDraftRule,
    extractedKeywords: [],
    suggestedAccounts: [],
    aiLoading: false,
    showAIAssistModal: false,
    showBulkApplyModal: false,
    showMFSyncModal: false,
    showRuleDetailModal: false,
    editingRuleId: null,
    isSyncing: false,
    isApplyingRules: false,
    isSubmitting: false
};
const useBookkeepingStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((set, get)=>({
        ...initialState,
        // ============================================================
        // 取引データ操作
        // ============================================================
        setTransactions: (transactions)=>set({
                transactions
            }),
        setTransactionsLoading: (loading)=>set({
                transactionsLoading: loading
            }),
        setTransactionsError: (error)=>set({
                transactionsError: error
            }),
        updateTransactionStats: (stats)=>set({
                transactionStats: stats
            }),
        updateTransaction: (id, updates)=>set((state)=>{
                var _state_selectedTransaction;
                return {
                    transactions: state.transactions.map((t)=>t.id === id ? {
                            ...t,
                            ...updates
                        } : t),
                    selectedTransaction: ((_state_selectedTransaction = state.selectedTransaction) === null || _state_selectedTransaction === void 0 ? void 0 : _state_selectedTransaction.id) === id ? {
                        ...state.selectedTransaction,
                        ...updates
                    } : state.selectedTransaction
                };
            }),
        // ============================================================
        // ルールデータ操作
        // ============================================================
        setRules: (rules)=>set({
                rules
            }),
        setRulesLoading: (loading)=>set({
                rulesLoading: loading
            }),
        setRulesError: (error)=>set({
                rulesError: error
            }),
        addRule: (rule)=>set((state)=>({
                    rules: [
                        ...state.rules,
                        rule
                    ]
                })),
        updateRule: (id, updates)=>set((state)=>({
                    rules: state.rules.map((r)=>r.id === id ? {
                            ...r,
                            ...updates
                        } : r)
                })),
        deleteRule: (id)=>set((state)=>({
                    rules: state.rules.filter((r)=>r.id !== id)
                })),
        // ============================================================
        // 取引選択・フィルター
        // ============================================================
        selectTransaction: (id)=>set((state)=>{
                const transaction = id ? state.transactions.find((t)=>t.id === id) || null : null;
                return {
                    selectedTransactionId: id,
                    selectedTransaction: transaction,
                    // 取引選択時にルール作成モードを開始
                    isCreatingRule: !!transaction,
                    draftRule: transaction ? {
                        ...initialDraftRule,
                        keyword: ''
                    } : initialDraftRule,
                    extractedKeywords: [],
                    suggestedAccounts: []
                };
            }),
        setFilter: (filter)=>set((state)=>({
                    filter: {
                        ...state.filter,
                        ...filter
                    }
                })),
        resetFilter: ()=>set({
                filter: initialFilter
            }),
        // ============================================================
        // ルール作成
        // ============================================================
        startCreatingRule: (fromTransaction)=>set({
                isCreatingRule: true,
                selectedTransaction: fromTransaction || null,
                selectedTransactionId: (fromTransaction === null || fromTransaction === void 0 ? void 0 : fromTransaction.id) || null,
                draftRule: initialDraftRule,
                extractedKeywords: [],
                suggestedAccounts: []
            }),
        cancelCreatingRule: ()=>set({
                isCreatingRule: false,
                draftRule: initialDraftRule,
                extractedKeywords: [],
                suggestedAccounts: []
            }),
        updateDraftRule: (updates)=>set((state)=>({
                    draftRule: {
                        ...state.draftRule,
                        ...updates
                    }
                })),
        selectKeyword: (keyword)=>set((state)=>({
                    draftRule: {
                        ...state.draftRule,
                        keyword,
                        rule_name: state.draftRule.rule_name || "".concat(keyword, "の自動仕訳")
                    }
                })),
        selectAccount: (account)=>set((state)=>({
                    draftRule: {
                        ...state.draftRule,
                        target_category: account.account,
                        target_sub_category: account.sub_account || '',
                        tax_code: account.tax_code
                    },
                    suggestedAccounts: state.suggestedAccounts.map((a)=>({
                            ...a,
                            selected: a.account === account.account
                        }))
                })),
        // ============================================================
        // AI サジェスション
        // ============================================================
        setExtractedKeywords: (keywords)=>set({
                extractedKeywords: keywords
            }),
        setSuggestedAccounts: (accounts)=>set({
                suggestedAccounts: accounts
            }),
        setAILoading: (loading)=>set({
                aiLoading: loading
            }),
        // ============================================================
        // モーダル操作
        // ============================================================
        openAIAssistModal: ()=>set({
                showAIAssistModal: true
            }),
        closeAIAssistModal: ()=>set({
                showAIAssistModal: false
            }),
        openBulkApplyModal: ()=>set({
                showBulkApplyModal: true
            }),
        closeBulkApplyModal: ()=>set({
                showBulkApplyModal: false
            }),
        openMFSyncModal: ()=>set({
                showMFSyncModal: true
            }),
        closeMFSyncModal: ()=>set({
                showMFSyncModal: false
            }),
        openRuleDetailModal: (ruleId)=>set({
                showRuleDetailModal: true,
                editingRuleId: ruleId
            }),
        closeRuleDetailModal: ()=>set({
                showRuleDetailModal: false,
                editingRuleId: null
            }),
        // ============================================================
        // 処理状態
        // ============================================================
        setIsSyncing: (syncing)=>set({
                isSyncing: syncing
            }),
        setIsApplyingRules: (applying)=>set({
                isApplyingRules: applying
            }),
        setIsSubmitting: (submitting)=>set({
                isSubmitting: submitting
            }),
        // ============================================================
        // リセット
        // ============================================================
        reset: ()=>set(initialState)
    }), {
    name: 'bookkeeping-store'
}));
const useTransactions = ()=>{
    _s();
    return useBookkeepingStore({
        "useTransactions.useBookkeepingStore": (state)=>state.transactions
    }["useTransactions.useBookkeepingStore"]);
};
_s(useTransactions, "SOnc8kGJE82f2hlIQkRLi0Vh6BA=", false, function() {
    return [
        useBookkeepingStore
    ];
});
const useSelectedTransaction = ()=>{
    _s1();
    return useBookkeepingStore({
        "useSelectedTransaction.useBookkeepingStore": (state)=>state.selectedTransaction
    }["useSelectedTransaction.useBookkeepingStore"]);
};
_s1(useSelectedTransaction, "SOnc8kGJE82f2hlIQkRLi0Vh6BA=", false, function() {
    return [
        useBookkeepingStore
    ];
});
const useRules = ()=>{
    _s2();
    return useBookkeepingStore({
        "useRules.useBookkeepingStore": (state)=>state.rules
    }["useRules.useBookkeepingStore"]);
};
_s2(useRules, "SOnc8kGJE82f2hlIQkRLi0Vh6BA=", false, function() {
    return [
        useBookkeepingStore
    ];
});
const useDraftRule = ()=>{
    _s3();
    return useBookkeepingStore({
        "useDraftRule.useBookkeepingStore": (state)=>state.draftRule
    }["useDraftRule.useBookkeepingStore"]);
};
_s3(useDraftRule, "SOnc8kGJE82f2hlIQkRLi0Vh6BA=", false, function() {
    return [
        useBookkeepingStore
    ];
});
const useTransactionStats = ()=>{
    _s4();
    return useBookkeepingStore({
        "useTransactionStats.useBookkeepingStore": (state)=>state.transactionStats
    }["useTransactionStats.useBookkeepingStore"]);
};
_s4(useTransactionStats, "SOnc8kGJE82f2hlIQkRLi0Vh6BA=", false, function() {
    return [
        useBookkeepingStore
    ];
});
const useFilteredTransactions = ()=>{
    _s5();
    const transactions = useBookkeepingStore({
        "useFilteredTransactions.useBookkeepingStore[transactions]": (state)=>state.transactions
    }["useFilteredTransactions.useBookkeepingStore[transactions]"]);
    const filter = useBookkeepingStore({
        "useFilteredTransactions.useBookkeepingStore[filter]": (state)=>state.filter
    }["useFilteredTransactions.useBookkeepingStore[filter]"]);
    return transactions.filter((t)=>{
        if (filter.status !== 'all' && t.status !== filter.status) return false;
        if (filter.sourceName && t.source_name !== filter.sourceName) return false;
        if (filter.dateFrom && t.transaction_date < filter.dateFrom) return false;
        if (filter.dateTo && t.transaction_date > filter.dateTo) return false;
        if (filter.searchKeyword && !t.raw_memo.toLowerCase().includes(filter.searchKeyword.toLowerCase())) return false;
        return true;
    });
};
_s5(useFilteredTransactions, "Z3RhgCoMzlpZQP05wPqXSOGFJYo=", false, function() {
    return [
        useBookkeepingStore,
        useBookkeepingStore
    ];
});
const useActiveRules = ()=>{
    _s6();
    const rules = useBookkeepingStore({
        "useActiveRules.useBookkeepingStore[rules]": (state)=>state.rules
    }["useActiveRules.useBookkeepingStore[rules]"]);
    return rules.filter((r)=>r.status === 'active').sort((a, b)=>a.priority - b.priority);
};
_s6(useActiveRules, "T5wmeS92kCiZocFxKd5/bvk8aPc=", false, function() {
    return [
        useBookkeepingStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/bookkeeping-n3/hooks/use-bookkeeping-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/bookkeeping-n3/hooks/use-bookkeeping-data.ts
/**
 * N3 記帳オートメーション - データ取得フック
 */ __turbopack_context__.s([
    "useBookkeepingData",
    ()=>useBookkeepingData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$store$2f$use$2d$bookkeeping$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/bookkeeping-n3/store/use-bookkeeping-store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
// ============================================================
// API呼び出し関数
// ============================================================
async function fetchTransactions(params) {
    const searchParams = new URLSearchParams();
    if (params.status && params.status !== 'all') searchParams.set('status', params.status);
    if (params.sourceName) searchParams.set('source_name', params.sourceName);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.pageSize) searchParams.set('page_size', params.pageSize.toString());
    const response = await fetch("/api/bookkeeping-n3/transactions?".concat(searchParams.toString()));
    if (!response.ok) throw new Error('Failed to fetch transactions');
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Unknown error');
    return data.data;
}
async function fetchRules() {
    const response = await fetch('/api/bookkeeping-n3/rules');
    if (!response.ok) throw new Error('Failed to fetch rules');
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Unknown error');
    return data.data.rules;
}
async function createRule(rule) {
    const response = await fetch('/api/bookkeeping-n3/rules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rule)
    });
    if (!response.ok) throw new Error('Failed to create rule');
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Unknown error');
    return data.data.rule;
}
async function applyRulesToTransactions(transactionIds) {
    const response = await fetch('/api/bookkeeping-n3/apply-rules', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            transaction_ids: transactionIds
        })
    });
    if (!response.ok) throw new Error('Failed to apply rules');
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Unknown error');
    return data.data;
}
async function getAISuggestions(rawMemo) {
    const response = await fetch('/api/bookkeeping-n3/ai-suggest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            raw_memo: rawMemo
        })
    });
    if (!response.ok) throw new Error('Failed to get AI suggestions');
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Unknown error');
    return data.data;
}
function useBookkeepingData() {
    _s();
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$store$2f$use$2d$bookkeeping$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookkeepingStore"])();
    const initialLoadRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // ============================================================
    // 取引データ読み込み
    // ============================================================
    const loadTransactions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBookkeepingData.useCallback[loadTransactions]": async ()=>{
            store.setTransactionsLoading(true);
            store.setTransactionsError(null);
            try {
                const { transactions, total, stats } = await fetchTransactions({
                    status: store.filter.status,
                    sourceName: store.filter.sourceName || undefined
                });
                store.setTransactions(transactions);
                store.updateTransactionStats({
                    ...stats,
                    total
                });
            } catch (error) {
                store.setTransactionsError(error instanceof Error ? error.message : 'Unknown error');
            } finally{
                store.setTransactionsLoading(false);
            }
        }
    }["useBookkeepingData.useCallback[loadTransactions]"], [
        store.filter.status,
        store.filter.sourceName
    ]);
    // ============================================================
    // ルールデータ読み込み
    // ============================================================
    const loadRules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBookkeepingData.useCallback[loadRules]": async ()=>{
            store.setRulesLoading(true);
            store.setRulesError(null);
            try {
                const rules = await fetchRules();
                store.setRules(rules);
            } catch (error) {
                store.setRulesError(error instanceof Error ? error.message : 'Unknown error');
            } finally{
                store.setRulesLoading(false);
            }
        }
    }["useBookkeepingData.useCallback[loadRules]"], []);
    // ============================================================
    // ルール作成
    // ============================================================
    const saveRule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBookkeepingData.useCallback[saveRule]": async ()=>{
            const { draftRule } = store;
            if (!draftRule.keyword || !draftRule.target_category) {
                return false;
            }
            try {
                const newRule = await createRule({
                    rule_name: draftRule.rule_name || "".concat(draftRule.keyword, "の自動仕訳"),
                    rule_description: draftRule.rule_description,
                    keyword: draftRule.keyword,
                    match_type: draftRule.match_type,
                    target_category: draftRule.target_category,
                    target_sub_category: draftRule.target_sub_category,
                    tax_code: draftRule.tax_code,
                    priority: draftRule.priority,
                    status: 'active'
                });
                store.addRule(newRule);
                store.cancelCreatingRule();
                // ルール作成後、取引に適用
                await applyRulesToPendingTransactions();
                return true;
            } catch (error) {
                console.error('Failed to save rule:', error);
                return false;
            }
        }
    }["useBookkeepingData.useCallback[saveRule]"], [
        store.draftRule
    ]);
    // ============================================================
    // ルール適用
    // ============================================================
    const applyRulesToPendingTransactions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBookkeepingData.useCallback[applyRulesToPendingTransactions]": async ()=>{
            store.setIsApplyingRules(true);
            try {
                const pendingIds = store.transactions.filter({
                    "useBookkeepingData.useCallback[applyRulesToPendingTransactions].pendingIds": (t)=>t.status === 'pending'
                }["useBookkeepingData.useCallback[applyRulesToPendingTransactions].pendingIds"]).map({
                    "useBookkeepingData.useCallback[applyRulesToPendingTransactions].pendingIds": (t)=>t.id
                }["useBookkeepingData.useCallback[applyRulesToPendingTransactions].pendingIds"]);
                if (pendingIds.length === 0) return;
                const { transactions } = await applyRulesToTransactions(pendingIds);
                // ローカル状態を更新
                transactions.forEach({
                    "useBookkeepingData.useCallback[applyRulesToPendingTransactions]": (t)=>{
                        store.updateTransaction(t.id, t);
                    }
                }["useBookkeepingData.useCallback[applyRulesToPendingTransactions]"]);
                // 統計を再計算
                await loadTransactions();
            } catch (error) {
                console.error('Failed to apply rules:', error);
            } finally{
                store.setIsApplyingRules(false);
            }
        }
    }["useBookkeepingData.useCallback[applyRulesToPendingTransactions]"], [
        store.transactions,
        loadTransactions
    ]);
    // ============================================================
    // AI サジェスション取得
    // ============================================================
    const fetchAISuggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBookkeepingData.useCallback[fetchAISuggestions]": async (rawMemo)=>{
            if (!rawMemo) return;
            store.setAILoading(true);
            try {
                const { keywords, accounts } = await getAISuggestions(rawMemo);
                store.setExtractedKeywords(keywords.map({
                    "useBookkeepingData.useCallback[fetchAISuggestions]": (k)=>({
                            keyword: k.keyword,
                            confidence: k.confidence,
                            source: k.source
                        })
                }["useBookkeepingData.useCallback[fetchAISuggestions]"]));
                store.setSuggestedAccounts(accounts.map({
                    "useBookkeepingData.useCallback[fetchAISuggestions]": (a)=>({
                            account: a.account,
                            sub_account: a.sub_account,
                            tax_code: a.tax_code,
                            confidence: a.confidence,
                            reasoning: a.reasoning
                        })
                }["useBookkeepingData.useCallback[fetchAISuggestions]"]));
            } catch (error) {
                console.error('Failed to get AI suggestions:', error);
            } finally{
                store.setAILoading(false);
            }
        }
    }["useBookkeepingData.useCallback[fetchAISuggestions]"], []);
    // ============================================================
    // 初回ロード
    // ============================================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBookkeepingData.useEffect": ()=>{
            if (initialLoadRef.current) return;
            initialLoadRef.current = true;
            loadTransactions();
            loadRules();
        }
    }["useBookkeepingData.useEffect"], []);
    // ============================================================
    // フィルター変更時にリロード
    // ============================================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBookkeepingData.useEffect": ()=>{
            if (!initialLoadRef.current) return;
            loadTransactions();
        }
    }["useBookkeepingData.useEffect"], [
        store.filter.status,
        store.filter.sourceName
    ]);
    // ============================================================
    // 取引選択時にAIサジェスション取得
    // ============================================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useBookkeepingData.useEffect": ()=>{
            var _store_selectedTransaction;
            if ((_store_selectedTransaction = store.selectedTransaction) === null || _store_selectedTransaction === void 0 ? void 0 : _store_selectedTransaction.raw_memo) {
                fetchAISuggestions(store.selectedTransaction.raw_memo);
            }
        }
    }["useBookkeepingData.useEffect"], [
        store.selectedTransactionId
    ]);
    return {
        // State
        transactions: store.transactions,
        transactionsLoading: store.transactionsLoading,
        transactionsError: store.transactionsError,
        transactionStats: store.transactionStats,
        rules: store.rules,
        rulesLoading: store.rulesLoading,
        rulesError: store.rulesError,
        selectedTransaction: store.selectedTransaction,
        draftRule: store.draftRule,
        extractedKeywords: store.extractedKeywords,
        suggestedAccounts: store.suggestedAccounts,
        aiLoading: store.aiLoading,
        isCreatingRule: store.isCreatingRule,
        isApplyingRules: store.isApplyingRules,
        filter: store.filter,
        // Actions
        loadTransactions,
        loadRules,
        saveRule,
        applyRulesToPendingTransactions,
        fetchAISuggestions,
        selectTransaction: store.selectTransaction,
        setFilter: store.setFilter,
        resetFilter: store.resetFilter,
        updateDraftRule: store.updateDraftRule,
        selectKeyword: store.selectKeyword,
        selectAccount: store.selectAccount,
        cancelCreatingRule: store.cancelCreatingRule
    };
}
_s(useBookkeepingData, "3/O+6UleQ1VCtxhgEmZ0i1YhXIw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$store$2f$use$2d$bookkeeping$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookkeepingStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/bookkeeping-n3/hooks/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/bookkeeping-n3/hooks/index.ts
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$hooks$2f$use$2d$bookkeeping$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/bookkeeping-n3/hooks/use-bookkeeping-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$store$2f$use$2d$bookkeeping$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/bookkeeping-n3/store/use-bookkeeping-store.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/bookkeeping-n3/components/transaction-list-panel.tsx
/**
 * 左パネル: 未処理取引リスト
 * 
 * - pending 状態の取引を一覧表示
 * - クリックで右パネルにデータを流す
 * - フィルター・検索機能
 */ __turbopack_context__.s([
    "TransactionListPanel",
    ()=>TransactionListPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
// ============================================================
// Status Config
// ============================================================
const STATUS_CONFIG = {
    pending: {
        label: '未処理',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
        color: 'var(--warning)'
    },
    simulated: {
        label: 'ルール適用済',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
        color: 'var(--accent)'
    },
    submitted: {
        label: '記帳完了',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"],
        color: 'var(--success)'
    },
    ignored: {
        label: '除外',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
        color: 'var(--text-muted)'
    }
};
// ============================================================
// Sub Components
// ============================================================
const TransactionRow = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function TransactionRow(param) {
    let { transaction, isSelected, onClick } = param;
    const config = STATUS_CONFIG[transaction.status];
    const StatusIcon = config.icon;
    const isIncome = transaction.amount > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: onClick,
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 12px',
            background: isSelected ? 'var(--accent-subtle)' : 'transparent',
            borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
            cursor: 'pointer',
            borderBottom: '1px solid var(--panel-border)',
            transition: 'background 0.15s ease'
        },
        onMouseEnter: (e)=>{
            if (!isSelected) e.currentTarget.style.background = 'var(--highlight)';
        },
        onMouseLeave: (e)=>{
            if (!isSelected) e.currentTarget.style.background = 'transparent';
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flexShrink: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusIcon, {
                    size: 16,
                    style: {
                        color: config.color
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                    lineNumber: 95,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    minWidth: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 13,
                            fontWeight: 500,
                            color: 'var(--text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        },
                        children: transaction.raw_memo
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            marginTop: 2,
                            fontSize: 11,
                            color: 'var(--text-muted)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: transaction.transaction_date
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "•"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: transaction.source_name
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flexShrink: 0,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    color: isIncome ? 'var(--success)' : 'var(--text)'
                },
                children: [
                    isIncome ? '+' : '',
                    "¥",
                    Math.abs(transaction.amount).toLocaleString()
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
});
_c = TransactionRow;
const StatsBar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function StatsBar(param) {
    let { stats, currentFilter, onFilterChange } = param;
    const items = [
        {
            key: 'all',
            label: '全て',
            count: stats.total,
            color: 'var(--text)'
        },
        {
            key: 'pending',
            label: '未処理',
            count: stats.pending,
            color: 'var(--warning)'
        },
        {
            key: 'simulated',
            label: '適用済',
            count: stats.simulated,
            color: 'var(--accent)'
        },
        {
            key: 'submitted',
            label: '完了',
            count: stats.submitted,
            color: 'var(--success)'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            gap: 4,
            padding: '8px 12px',
            borderBottom: '1px solid var(--panel-border)',
            overflowX: 'auto'
        },
        children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onFilterChange(item.key),
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    fontSize: 11,
                    fontWeight: 500,
                    background: currentFilter === item.key ? 'var(--accent)' : 'var(--highlight)',
                    color: currentFilter === item.key ? 'white' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: item.label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            padding: '1px 4px',
                            fontSize: 10,
                            background: currentFilter === item.key ? 'rgba(255,255,255,0.2)' : 'var(--panel)',
                            borderRadius: 3
                        },
                        children: item.count
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this)
                ]
            }, item.key, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                lineNumber: 174,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
        lineNumber: 164,
        columnNumber: 5
    }, this);
});
_c1 = StatsBar;
const TransactionListPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c2 = function TransactionListPanel(param) {
    let { transactions, loading, error, selectedId, filter, stats, onSelect, onFilterChange, onRefresh, onSync } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: 'var(--panel)',
            borderRight: '1px solid var(--panel-border)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatsBar, {
                stats: stats,
                currentFilter: filter.status,
                onFilterChange: (status)=>onFilterChange({
                        status
                    })
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                lineNumber: 236,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--panel-border)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        position: 'relative'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                            size: 14,
                            style: {
                                position: 'absolute',
                                left: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                            lineNumber: 245,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "摘要を検索...",
                            value: filter.searchKeyword,
                            onChange: (e)=>onFilterChange({
                                    searchKeyword: e.target.value
                                }),
                            style: {
                                width: '100%',
                                padding: '6px 8px 6px 28px',
                                fontSize: 12,
                                background: 'var(--highlight)',
                                border: '1px solid var(--panel-border)',
                                borderRadius: 4,
                                color: 'var(--text)',
                                outline: 'none'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                            lineNumber: 255,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                    lineNumber: 244,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflowY: 'auto'
                },
                children: loading && transactions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: 12
                    },
                    children: [
                        ...Array(5)
                    ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Skeleton"], {
                            style: {
                                height: 56,
                                marginBottom: 8
                            }
                        }, i, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                            lineNumber: 279,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                    lineNumber: 277,
                    columnNumber: 11
                }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 24,
                        gap: 8,
                        color: 'var(--error)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                            size: 24
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                            lineNumber: 294,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: 12
                            },
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                            lineNumber: 295,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                            variant: "ghost",
                            size: "sm",
                            onClick: onRefresh,
                            children: "再試行"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                            lineNumber: 296,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                    lineNumber: 283,
                    columnNumber: 11
                }, this) : transactions.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 24,
                        gap: 8,
                        color: 'var(--text-muted)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                            size: 24
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                            lineNumber: 312,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                fontSize: 12
                            },
                            children: "取引データがありません"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                            lineNumber: 313,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                            variant: "ghost",
                            size: "sm",
                            onClick: onSync,
                            children: "MFから同期"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                            lineNumber: 314,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                    lineNumber: 301,
                    columnNumber: 11
                }, this) : transactions.map((tx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TransactionRow, {
                        transaction: tx,
                        isSelected: tx.id === selectedId,
                        onClick: ()=>onSelect(tx.id)
                    }, tx.id, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                        lineNumber: 320,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
                lineNumber: 275,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx",
        lineNumber: 226,
        columnNumber: 5
    }, this);
});
_c3 = TransactionListPanel;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "TransactionRow");
__turbopack_context__.k.register(_c1, "StatsBar");
__turbopack_context__.k.register(_c2, "TransactionListPanel$memo");
__turbopack_context__.k.register(_c3, "TransactionListPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/bookkeeping-n3/components/rule-builder-panel.tsx
/**
 * 右パネル: ルール作成フォーム
 * 
 * - 選択した取引の生テキストを表示
 * - キーワード抽出（AI/手動）
 * - 勘定科目の割り当て
 * - ルールの保存
 */ __turbopack_context__.s([
    "RuleBuilderPanel",
    ()=>RuleBuilderPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-skeleton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// ============================================================
// Constants
// ============================================================
const ACCOUNT_OPTIONS = [
    {
        value: '仕入高',
        label: '仕入高'
    },
    {
        value: '支払手数料',
        label: '支払手数料'
    },
    {
        value: '発送費',
        label: '発送費'
    },
    {
        value: '広告宣伝費',
        label: '広告宣伝費'
    },
    {
        value: '通信費',
        label: '通信費'
    },
    {
        value: '消耗品費',
        label: '消耗品費'
    },
    {
        value: '雑費',
        label: '雑費'
    },
    {
        value: '売上高',
        label: '売上高'
    }
];
const TAX_OPTIONS = [
    {
        value: '課税仕入 10%',
        label: '課税仕入 10%'
    },
    {
        value: '課税仕入 8%',
        label: '課税仕入 8%（軽減）'
    },
    {
        value: '課税売上 10%',
        label: '課税売上 10%'
    },
    {
        value: '非課税',
        label: '非課税'
    },
    {
        value: '不課税',
        label: '不課税'
    }
];
// ============================================================
// Sub Components
// ============================================================
const EmptyState = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function EmptyState() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: 24,
            gap: 12,
            color: 'var(--text-muted)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'var(--highlight)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"], {
                    size: 28,
                    style: {
                        color: 'var(--accent)'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                    lineNumber: 109,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 14,
                            fontWeight: 500,
                            marginBottom: 4
                        },
                        children: "取引を選択してください"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12
                        },
                        children: [
                            "左の一覧から取引をクリックすると、",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this),
                            "ここにルール作成フォームが表示されます"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
});
_c = EmptyState;
const KeywordChip = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function KeywordChip(param) {
    let { keyword, confidence, source, isSelected, onClick } = param;
    const confidenceColor = confidence >= 0.8 ? 'var(--success)' : confidence >= 0.5 ? 'var(--warning)' : 'var(--text-muted)';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            fontSize: 12,
            fontWeight: 500,
            background: isSelected ? 'var(--accent)' : 'var(--highlight)',
            color: isSelected ? 'white' : 'var(--text)',
            border: isSelected ? 'none' : '1px solid var(--panel-border)',
            borderRadius: 16,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
        },
        children: [
            source === 'ai' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                size: 12,
                style: {
                    color: isSelected ? 'white' : 'var(--accent)'
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                lineNumber: 161,
                columnNumber: 27
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: keyword
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: 10,
                    padding: '1px 4px',
                    background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--panel)',
                    borderRadius: 8,
                    color: isSelected ? 'white' : confidenceColor
                },
                children: [
                    Math.round(confidence * 100),
                    "%"
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
});
_c1 = KeywordChip;
const AccountSuggestionCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function AccountSuggestionCard(param) {
    let { suggestion, isSelected, onClick } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        style: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: 12,
            background: isSelected ? 'var(--accent-subtle)' : 'var(--highlight)',
            border: isSelected ? '2px solid var(--accent)' : '1px solid var(--panel-border)',
            borderRadius: 8,
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'all 0.15s ease'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: isSelected ? 'var(--accent)' : 'var(--panel-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                },
                children: isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                    size: 12,
                    style: {
                        color: 'white'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                    lineNumber: 216,
                    columnNumber: 24
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
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
                            gap: 6,
                            marginBottom: 4
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: 'var(--text)'
                                },
                                children: suggestion.account
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this),
                            suggestion.sub_account && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11,
                                    color: 'var(--text-muted)'
                                },
                                children: [
                                    "/ ",
                                    suggestion.sub_account
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 225,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                variant: suggestion.confidence >= 0.8 ? 'success' : 'secondary',
                                size: "sm",
                                children: [
                                    Math.round(suggestion.confidence * 100),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            color: 'var(--text-muted)',
                            marginBottom: 4
                        },
                        children: [
                            "税区分: ",
                            suggestion.tax_code
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 237,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            color: 'var(--text-secondary)',
                            fontStyle: 'italic'
                        },
                        children: suggestion.reasoning
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
        lineNumber: 188,
        columnNumber: 5
    }, this);
});
_c2 = AccountSuggestionCard;
const RuleBuilderPanel = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c3 = _s(function RuleBuilderPanel(param) {
    let { transaction, draftRule, extractedKeywords, suggestedAccounts, aiLoading, isCreatingRule, onUpdateDraft, onSelectKeyword, onSelectAccount, onSave, onCancel, onRequestAI } = param;
    _s();
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saveError, setSaveError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleSave = async ()=>{
        setIsSaving(true);
        setSaveError(null);
        try {
            const success = await onSave();
            if (!success) {
                setSaveError('ルールの保存に失敗しました');
            }
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : 'Unknown error');
        } finally{
            setIsSaving(false);
        }
    };
    // 空状態
    if (!transaction) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                height: '100%',
                background: 'var(--bg)'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyState, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                lineNumber: 290,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
            lineNumber: 289,
            columnNumber: 7
        }, this);
    }
    const isValid = draftRule.keyword && draftRule.target_category;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: 'var(--bg)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--panel-border)',
                    background: 'var(--panel)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            fontSize: 14,
                            fontWeight: 600,
                            color: 'var(--text)',
                            margin: 0
                        },
                        children: "ルール作成"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "ghost",
                        size: "sm",
                        onClick: onCancel,
                        style: {
                            padding: 4
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                            lineNumber: 321,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 320,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                lineNumber: 307,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflowY: 'auto',
                    padding: 16
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 11,
                                    fontWeight: 500,
                                    color: 'var(--text-muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: 8
                                },
                                children: "対象取引"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 329,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: 12,
                                    background: 'var(--panel)',
                                    borderRadius: 8,
                                    border: '1px solid var(--panel-border)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 14,
                                            fontWeight: 500,
                                            color: 'var(--text)',
                                            marginBottom: 6
                                        },
                                        children: transaction.raw_memo
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 349,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: 12,
                                            fontSize: 12,
                                            color: 'var(--text-muted)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: transaction.transaction_date
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                lineNumber: 353,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: transaction.source_name
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                lineNumber: 354,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontWeight: 600,
                                                    fontFamily: 'var(--font-mono)'
                                                },
                                                children: [
                                                    "¥",
                                                    Math.abs(transaction.amount).toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                lineNumber: 355,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 352,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 328,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            background: draftRule.keyword ? 'var(--success)' : 'var(--accent)',
                                            color: 'white',
                                            fontSize: 11,
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        },
                                        children: draftRule.keyword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                            lineNumber: 386,
                                            columnNumber: 36
                                        }, this) : '1'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 372,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: 'var(--text)'
                                        },
                                        children: "キーワードを選択"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 388,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        onClick: onRequestAI,
                                        disabled: aiLoading,
                                        style: {
                                            marginLeft: 'auto',
                                            padding: '2px 8px',
                                            fontSize: 11
                                        },
                                        children: [
                                            aiLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                size: 12,
                                                className: "animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                lineNumber: 398,
                                                columnNumber: 28
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                lineNumber: 398,
                                                columnNumber: 77
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    marginLeft: 4
                                                },
                                                children: "AI抽出"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                lineNumber: 399,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 391,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this),
                            aiLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 6
                                },
                                children: [
                                    ...Array(4)
                                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Skeleton"], {
                                        style: {
                                            width: 80,
                                            height: 28,
                                            borderRadius: 16
                                        }
                                    }, i, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 406,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 404,
                                columnNumber: 13
                            }, this) : extractedKeywords.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 6,
                                    marginBottom: 8
                                },
                                children: extractedKeywords.map((kw)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KeywordChip, {
                                        keyword: kw.keyword,
                                        confidence: kw.confidence,
                                        source: kw.source,
                                        isSelected: draftRule.keyword === kw.keyword,
                                        onClick: ()=>onSelectKeyword(kw.keyword)
                                    }, kw.keyword, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 412,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 410,
                                columnNumber: 13
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Input"], {
                                value: draftRule.keyword,
                                onChange: (e)=>onUpdateDraft({
                                        keyword: e.target.value
                                    }),
                                placeholder: "キーワードを入力または上から選択",
                                style: {
                                    marginTop: 8
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 424,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 363,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            background: draftRule.target_category ? 'var(--success)' : 'var(--panel-border)',
                                            color: draftRule.target_category ? 'white' : 'var(--text-muted)',
                                            fontSize: 11,
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        },
                                        children: draftRule.target_category ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                            lineNumber: 456,
                                            columnNumber: 44
                                        }, this) : '2'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 442,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: 'var(--text)'
                                        },
                                        children: "勘定科目を選択"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 458,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 434,
                                columnNumber: 11
                            }, this),
                            suggestedAccounts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8,
                                    marginBottom: 12
                                },
                                children: suggestedAccounts.slice(0, 3).map((suggestion)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AccountSuggestionCard, {
                                        suggestion: suggestion,
                                        isSelected: draftRule.target_category === suggestion.account,
                                        onClick: ()=>onSelectAccount(suggestion)
                                    }, suggestion.account, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 467,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 465,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: 11,
                                                    color: 'var(--text-muted)',
                                                    display: 'block',
                                                    marginBottom: 4
                                                },
                                                children: "勘定科目"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                lineNumber: 480,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: draftRule.target_category,
                                                onChange: (e)=>onUpdateDraft({
                                                        target_category: e.target.value
                                                    }),
                                                style: {
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    fontSize: 13,
                                                    background: 'var(--panel)',
                                                    border: '1px solid var(--panel-border)',
                                                    borderRadius: 6,
                                                    color: 'var(--text)',
                                                    outline: 'none'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "選択..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 17
                                                    }, this),
                                                    ACCOUNT_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: opt.value,
                                                            children: opt.label
                                                        }, opt.value, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                            lineNumber: 499,
                                                            columnNumber: 19
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                lineNumber: 483,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 479,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    fontSize: 11,
                                                    color: 'var(--text-muted)',
                                                    display: 'block',
                                                    marginBottom: 4
                                                },
                                                children: "税区分"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                lineNumber: 505,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: draftRule.tax_code,
                                                onChange: (e)=>onUpdateDraft({
                                                        tax_code: e.target.value
                                                    }),
                                                style: {
                                                    width: '100%',
                                                    padding: '8px 10px',
                                                    fontSize: 13,
                                                    background: 'var(--panel)',
                                                    border: '1px solid var(--panel-border)',
                                                    borderRadius: 6,
                                                    color: 'var(--text)',
                                                    outline: 'none'
                                                },
                                                children: TAX_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: opt.value,
                                                        children: opt.label
                                                    }, opt.value, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                        lineNumber: 523,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                                lineNumber: 508,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 504,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 478,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 433,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: 20
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    marginBottom: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            background: 'var(--panel-border)',
                                            color: 'var(--text-muted)',
                                            fontSize: 11,
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        },
                                        children: "3"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 540,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: 'var(--text)'
                                        },
                                        children: "ルール詳細（任意）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 556,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 532,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Input"], {
                                        value: draftRule.rule_name,
                                        onChange: (e)=>onUpdateDraft({
                                                rule_name: e.target.value
                                            }),
                                        placeholder: "ルール名（例: Amazon仕入れ）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 562,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Input"], {
                                        value: draftRule.rule_description,
                                        onChange: (e)=>onUpdateDraft({
                                                rule_description: e.target.value
                                            }),
                                        placeholder: "説明（任意）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                        lineNumber: 567,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 561,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 531,
                        columnNumber: 9
                    }, this),
                    saveError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: 12,
                            background: 'var(--error-subtle)',
                            borderRadius: 8,
                            marginBottom: 16
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                size: 16,
                                style: {
                                    color: 'var(--error)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 588,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 12,
                                    color: 'var(--error)'
                                },
                                children: saveError
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                lineNumber: 589,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 577,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                lineNumber: 326,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 8,
                    padding: 16,
                    borderTop: '1px solid var(--panel-border)',
                    background: 'var(--panel)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "ghost",
                        onClick: onCancel,
                        style: {
                            flex: 1
                        },
                        children: "キャンセル"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 604,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "primary",
                        onClick: handleSave,
                        disabled: !isValid || isSaving,
                        style: {
                            flex: 1
                        },
                        children: isSaving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    size: 14,
                                    className: "animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                    lineNumber: 615,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        marginLeft: 6
                                    },
                                    children: "保存中..."
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                    lineNumber: 616,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                    lineNumber: 620,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        marginLeft: 6
                                    },
                                    children: "ルール保存"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                                    lineNumber: 621,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                        lineNumber: 607,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
                lineNumber: 595,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx",
        lineNumber: 298,
        columnNumber: 5
    }, this);
}, "0ymV7Os/PgR/7ihRlJ5ZXl4VzLc=")), "0ymV7Os/PgR/7ihRlJ5ZXl4VzLc=");
_c4 = RuleBuilderPanel;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "EmptyState");
__turbopack_context__.k.register(_c1, "KeywordChip");
__turbopack_context__.k.register(_c2, "AccountSuggestionCard");
__turbopack_context__.k.register(_c3, "RuleBuilderPanel$memo");
__turbopack_context__.k.register(_c4, "RuleBuilderPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/bookkeeping-n3/components/rules-management-panel.tsx
/**
 * ルール管理パネル
 * - ルール一覧表示（Excel風テーブル）
 * - スプレッドシートからインポート
 * - CSVアップロード
 * - 個別/一括削除
 */ __turbopack_context__.s([
    "RulesManagementPanel",
    ()=>RulesManagementPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// ============================================================
// 定数
// ============================================================
const DEFAULT_SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/14c0kwE-jhrMkqhRe96XcR78Y5XOQH0o7qsJfRBcmM80/edit';
const RulesManagementPanel = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function RulesManagementPanel() {
    _s();
    const [rules, setRules] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filterSource, setFilterSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [pageSize, setPageSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(500);
    // 選択関連
    const [selectedIds, setSelectedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // 削除関連
    const [showDeleteConfirm, setShowDeleteConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deleteMode, setDeleteMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [deleting, setDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // インポート関連
    const [showImportModal, setShowImportModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [spreadsheetUrl, setSpreadsheetUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SPREADSHEET_URL);
    const [sheetName, setSheetName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('統合ルール');
    const [importing, setImporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [importResult, setImportResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // CSV関連
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [csvUploading, setCsvUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ルール読み込み
    const loadRules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RulesManagementPanel.RulesManagementPanel.useCallback[loadRules]": async ()=>{
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/bookkeeping-n3/rules');
                const data = await response.json();
                if (data.success) {
                    setRules(data.data.rules || []);
                } else {
                    setError(data.error || 'ルールの読み込みに失敗しました');
                }
            } catch (err) {
                setError('ルールの読み込みに失敗しました');
            } finally{
                setLoading(false);
            }
        }
    }["RulesManagementPanel.RulesManagementPanel.useCallback[loadRules]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RulesManagementPanel.RulesManagementPanel.useEffect": ()=>{
            loadRules();
        }
    }["RulesManagementPanel.RulesManagementPanel.useEffect"], [
        loadRules
    ]);
    // フィルター（useMemoで先に定義）
    const filteredRules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "RulesManagementPanel.RulesManagementPanel.useMemo[filteredRules]": ()=>{
            return rules.filter({
                "RulesManagementPanel.RulesManagementPanel.useMemo[filteredRules]": (rule)=>{
                    var _rule_target_category;
                    const matchesSearch = searchQuery === '' || rule.keyword.toLowerCase().includes(searchQuery.toLowerCase()) || ((_rule_target_category = rule.target_category) === null || _rule_target_category === void 0 ? void 0 : _rule_target_category.toLowerCase().includes(searchQuery.toLowerCase()));
                    const matchesSource = filterSource === 'all' || rule.match_source === filterSource;
                    return matchesSearch && matchesSource;
                }
            }["RulesManagementPanel.RulesManagementPanel.useMemo[filteredRules]"]).slice(0, pageSize);
        }
    }["RulesManagementPanel.RulesManagementPanel.useMemo[filteredRules]"], [
        rules,
        searchQuery,
        filterSource,
        pageSize
    ]);
    // 統計
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "RulesManagementPanel.RulesManagementPanel.useMemo[stats]": ()=>({
                total: rules.length,
                bySource: {
                    '借方補助科目': rules.filter({
                        "RulesManagementPanel.RulesManagementPanel.useMemo[stats]": (r)=>r.match_source === '借方補助科目'
                    }["RulesManagementPanel.RulesManagementPanel.useMemo[stats]"]).length,
                    '貸方補助科目': rules.filter({
                        "RulesManagementPanel.RulesManagementPanel.useMemo[stats]": (r)=>r.match_source === '貸方補助科目'
                    }["RulesManagementPanel.RulesManagementPanel.useMemo[stats]"]).length,
                    '摘要': rules.filter({
                        "RulesManagementPanel.RulesManagementPanel.useMemo[stats]": (r)=>r.match_source === '摘要'
                    }["RulesManagementPanel.RulesManagementPanel.useMemo[stats]"]).length,
                    'メモ': rules.filter({
                        "RulesManagementPanel.RulesManagementPanel.useMemo[stats]": (r)=>r.match_source === 'メモ'
                    }["RulesManagementPanel.RulesManagementPanel.useMemo[stats]"]).length
                },
                highConfidence: rules.filter({
                    "RulesManagementPanel.RulesManagementPanel.useMemo[stats]": (r)=>(r.ai_confidence_score || 0) >= 0.9
                }["RulesManagementPanel.RulesManagementPanel.useMemo[stats]"]).length
            })
    }["RulesManagementPanel.RulesManagementPanel.useMemo[stats]"], [
        rules
    ]);
    // 全ルール削除
    const handleDeleteAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RulesManagementPanel.RulesManagementPanel.useCallback[handleDeleteAll]": async ()=>{
            setDeleting(true);
            setError(null);
            try {
                const response = await fetch('/api/bookkeeping-n3/rules/delete-all?confirm=yes', {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (data.success) {
                    setShowDeleteConfirm(false);
                    setSelectedIds(new Set());
                    await loadRules();
                } else {
                    setError(data.error || '削除に失敗しました');
                }
            } catch (err) {
                setError('削除に失敗しました');
            } finally{
                setDeleting(false);
            }
        }
    }["RulesManagementPanel.RulesManagementPanel.useCallback[handleDeleteAll]"], [
        loadRules
    ]);
    // 選択したルールを削除
    const handleDeleteSelected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RulesManagementPanel.RulesManagementPanel.useCallback[handleDeleteSelected]": async ()=>{
            if (selectedIds.size === 0) return;
            setDeleting(true);
            setError(null);
            try {
                for (const id of selectedIds){
                    await fetch("/api/bookkeeping-n3/rules?rule_id=".concat(id), {
                        method: 'DELETE'
                    });
                }
                setSelectedIds(new Set());
                setShowDeleteConfirm(false);
                await loadRules();
            } catch (err) {
                setError('削除に失敗しました');
            } finally{
                setDeleting(false);
            }
        }
    }["RulesManagementPanel.RulesManagementPanel.useCallback[handleDeleteSelected]"], [
        selectedIds,
        loadRules
    ]);
    // 個別ルール削除
    const handleDeleteOne = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RulesManagementPanel.RulesManagementPanel.useCallback[handleDeleteOne]": async (id)=>{
            try {
                await fetch("/api/bookkeeping-n3/rules?rule_id=".concat(id), {
                    method: 'DELETE'
                });
                await loadRules();
            } catch (err) {
                setError('削除に失敗しました');
            }
        }
    }["RulesManagementPanel.RulesManagementPanel.useCallback[handleDeleteOne]"], [
        loadRules
    ]);
    // チェックボックストグル
    const toggleSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RulesManagementPanel.RulesManagementPanel.useCallback[toggleSelect]": (id)=>{
            setSelectedIds({
                "RulesManagementPanel.RulesManagementPanel.useCallback[toggleSelect]": (prev)=>{
                    const next = new Set(prev);
                    if (next.has(id)) {
                        next.delete(id);
                    } else {
                        next.add(id);
                    }
                    return next;
                }
            }["RulesManagementPanel.RulesManagementPanel.useCallback[toggleSelect]"]);
        }
    }["RulesManagementPanel.RulesManagementPanel.useCallback[toggleSelect]"], []);
    // 全選択/全解除
    const toggleSelectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RulesManagementPanel.RulesManagementPanel.useCallback[toggleSelectAll]": ()=>{
            if (selectedIds.size === filteredRules.length) {
                setSelectedIds(new Set());
            } else {
                setSelectedIds(new Set(filteredRules.map({
                    "RulesManagementPanel.RulesManagementPanel.useCallback[toggleSelectAll]": (r)=>r.id
                }["RulesManagementPanel.RulesManagementPanel.useCallback[toggleSelectAll]"])));
            }
        }
    }["RulesManagementPanel.RulesManagementPanel.useCallback[toggleSelectAll]"], [
        filteredRules,
        selectedIds.size
    ]);
    // スプレッドシートからインポート
    const handleImportFromSheet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RulesManagementPanel.RulesManagementPanel.useCallback[handleImportFromSheet]": async ()=>{
            if (!spreadsheetUrl) {
                setError('スプレッドシートURLを入力してください');
                return;
            }
            setImporting(true);
            setImportResult(null);
            setError(null);
            try {
                const response = await fetch('/api/bookkeeping-n3/rules/import-from-sheet', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        spreadsheet_url: spreadsheetUrl,
                        sheet_name: sheetName
                    })
                });
                const data = await response.json();
                if (data.success) {
                    setImportResult(data.data);
                    await loadRules();
                } else {
                    setError(data.error || 'インポートに失敗しました');
                }
            } catch (err) {
                setError('インポートに失敗しました');
            } finally{
                setImporting(false);
            }
        }
    }["RulesManagementPanel.RulesManagementPanel.useCallback[handleImportFromSheet]"], [
        spreadsheetUrl,
        sheetName,
        loadRules
    ]);
    // CSVアップロード
    const handleCsvUpload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RulesManagementPanel.RulesManagementPanel.useCallback[handleCsvUpload]": async (event)=>{
            var _event_target_files;
            const file = (_event_target_files = event.target.files) === null || _event_target_files === void 0 ? void 0 : _event_target_files[0];
            if (!file) return;
            setCsvUploading(true);
            setError(null);
            try {
                const text = await file.text();
                const lines = text.split('\n').filter({
                    "RulesManagementPanel.RulesManagementPanel.useCallback[handleCsvUpload].lines": (l)=>l.trim()
                }["RulesManagementPanel.RulesManagementPanel.useCallback[handleCsvUpload].lines"]);
                if (lines.length < 2) {
                    setError('CSVにデータがありません');
                    return;
                }
                const headers = lines[0].split(',').map({
                    "RulesManagementPanel.RulesManagementPanel.useCallback[handleCsvUpload].headers": (h)=>h.replace(/^"|"$/g, '').trim()
                }["RulesManagementPanel.RulesManagementPanel.useCallback[handleCsvUpload].headers"]);
                const csvRules = [];
                for(let i = 1; i < lines.length; i++){
                    const values = lines[i].split(',').map({
                        "RulesManagementPanel.RulesManagementPanel.useCallback[handleCsvUpload].values": (v)=>v.replace(/^"|"$/g, '').trim()
                    }["RulesManagementPanel.RulesManagementPanel.useCallback[handleCsvUpload].values"]);
                    if (!values[0] || values[0].includes('統計')) continue;
                    const row = {};
                    headers.forEach({
                        "RulesManagementPanel.RulesManagementPanel.useCallback[handleCsvUpload]": (h, idx)=>{
                            row[h] = values[idx] || '';
                        }
                    }["RulesManagementPanel.RulesManagementPanel.useCallback[handleCsvUpload]"]);
                    csvRules.push({
                        keyword: row['キーワード'] || row['主キーワード'] || '',
                        match_source: row['抽出元'] || '摘要',
                        priority: parseInt(row['優先度']) || 100,
                        debit_account: row['借方勘定科目'] || '',
                        debit_sub_account: row['借方補助科目'] || '',
                        debit_tax_code: row['借方税区分'] || '',
                        credit_account: row['貸方勘定科目'] || '',
                        credit_sub_account: row['貸方補助科目'] || '',
                        credit_tax_code: row['貸方税区分'] || '',
                        applied_count: parseInt(row['出現回数'] || row['総出現回数']) || 0,
                        confidence_score: (parseInt(row['信頼度(%)'] || row['最高信頼度(%)'] || row['信頼度']) || 0) / 100
                    });
                }
                const response = await fetch('/api/bookkeeping-n3/rules/import', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        rules: csvRules,
                        spreadsheet_id: 'csv_upload'
                    })
                });
                const data = await response.json();
                if (data.success) {
                    setImportResult(data.data);
                    await loadRules();
                } else {
                    setError(data.error || 'CSVインポートに失敗');
                }
            } catch (err) {
                setError('CSVの読み込みに失敗しました');
            } finally{
                setCsvUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }
    }["RulesManagementPanel.RulesManagementPanel.useCallback[handleCsvUpload]"], [
        loadRules
    ]);
    // 削除確認を開く
    const openDeleteConfirm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RulesManagementPanel.RulesManagementPanel.useCallback[openDeleteConfirm]": (mode)=>{
            setDeleteMode(mode);
            setShowDeleteConfirm(true);
        }
    }["RulesManagementPanel.RulesManagementPanel.useCallback[openDeleteConfirm]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: 'var(--bg)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    borderBottom: '1px solid var(--panel-border)',
                    background: 'var(--panel)',
                    flexWrap: 'wrap',
                    gap: 8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            flexWrap: 'wrap'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '4px 10px',
                                    background: 'var(--highlight)',
                                    borderRadius: 4,
                                    border: '1px solid var(--panel-border)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        size: 12,
                                        style: {
                                            color: 'var(--text-muted)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 346,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        placeholder: "キーワード検索...",
                                        style: {
                                            border: 'none',
                                            background: 'transparent',
                                            fontSize: 11,
                                            color: 'var(--text)',
                                            outline: 'none',
                                            width: 120
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 347,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 337,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: filterSource,
                                onChange: (e)=>setFilterSource(e.target.value),
                                style: {
                                    padding: '4px 8px',
                                    fontSize: 11,
                                    border: '1px solid var(--panel-border)',
                                    borderRadius: 4,
                                    background: 'var(--panel)',
                                    color: 'var(--text)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: "全ソース"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 376,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "借方補助科目",
                                        children: "借方補助科目"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 377,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "貸方補助科目",
                                        children: "貸方補助科目"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 378,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "摘要",
                                        children: "摘要"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 379,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "メモ",
                                        children: "メモ"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 380,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: pageSize,
                                onChange: (e)=>setPageSize(Number(e.target.value)),
                                style: {
                                    padding: '4px 8px',
                                    fontSize: 11,
                                    border: '1px solid var(--panel-border)',
                                    borderRadius: 4,
                                    background: 'var(--panel)',
                                    color: 'var(--text)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 100,
                                        children: "100件"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 396,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 300,
                                        children: "300件"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 397,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 500,
                                        children: "500件"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 398,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 1000,
                                        children: "1000件"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 399,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 9999,
                                        children: "全件"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 400,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 384,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 11,
                                    color: 'var(--text-muted)'
                                },
                                children: [
                                    filteredRules.length,
                                    " / ",
                                    stats.total,
                                    " 件"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 403,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            flexWrap: 'wrap'
                        },
                        children: [
                            selectedIds.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>openDeleteConfirm('selected'),
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '4px 10px',
                                    fontSize: 11,
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: 4,
                                    color: 'var(--error)',
                                    cursor: 'pointer'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 426,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            selectedIds.size,
                                            "件削除"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 427,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 411,
                                columnNumber: 13
                            }, this),
                            rules.length > 0 && selectedIds.size === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>openDeleteConfirm('all'),
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '4px 10px',
                                    fontSize: 11,
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: 4,
                                    color: 'var(--error)',
                                    cursor: 'pointer'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 448,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "全削除"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 449,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 433,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowImportModal(true),
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '4px 10px',
                                    fontSize: 11,
                                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.3))',
                                    border: '1px solid rgba(59, 130, 246, 0.4)',
                                    borderRadius: 4,
                                    color: 'var(--text)',
                                    cursor: 'pointer'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 469,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "シートからインポート"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 470,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 454,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: fileInputRef,
                                type: "file",
                                accept: ".csv",
                                onChange: handleCsvUpload,
                                style: {
                                    display: 'none'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 474,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    var _fileInputRef_current;
                                    return (_fileInputRef_current = fileInputRef.current) === null || _fileInputRef_current === void 0 ? void 0 : _fileInputRef_current.click();
                                },
                                disabled: csvUploading,
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '4px 10px',
                                    fontSize: 11,
                                    background: 'var(--highlight)',
                                    border: '1px solid var(--panel-border)',
                                    borderRadius: 4,
                                    color: 'var(--text)',
                                    cursor: 'pointer'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 497,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: csvUploading ? '...' : 'CSV'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 498,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 481,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: loadRules,
                                disabled: loading,
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '4px 10px',
                                    fontSize: 11,
                                    background: 'var(--accent)',
                                    border: 'none',
                                    borderRadius: 4,
                                    color: 'white',
                                    cursor: 'pointer'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    size: 12,
                                    className: loading ? 'animate-spin' : ''
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 518,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 502,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                        lineNumber: 408,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                lineNumber: 325,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 12,
                    padding: '6px 16px',
                    borderBottom: '1px solid var(--panel-border)',
                    background: 'var(--highlight)',
                    fontSize: 10,
                    flexWrap: 'wrap'
                },
                children: [
                    Object.entries(stats.bySource).map((param)=>{
                        let [source, count] = param;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: 'var(--text-muted)'
                                    },
                                    children: [
                                        source,
                                        ":"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 535,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontWeight: 600,
                                        color: 'var(--text)'
                                    },
                                    children: count
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 536,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, source, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                            lineNumber: 534,
                            columnNumber: 11
                        }, this);
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: 'var(--text-muted)'
                                },
                                children: "高信頼:"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 540,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 600,
                                    color: 'var(--success)'
                                },
                                children: stats.highConfidence
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 541,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                        lineNumber: 539,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                lineNumber: 524,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '8px 16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--error)',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                        lineNumber: 556,
                        columnNumber: 11
                    }, this),
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                lineNumber: 547,
                columnNumber: 9
            }, this),
            importResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '8px 16px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: 'var(--success)',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                        lineNumber: 571,
                        columnNumber: 11
                    }, this),
                    "インポート完了: ",
                    importResult.total,
                    "件 - 新規",
                    importResult.inserted,
                    " / 更新",
                    importResult.updated,
                    " / スキップ",
                    importResult.skipped
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                lineNumber: 562,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflow: 'auto'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    style: {
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: 10
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                style: {
                                    background: 'var(--panel)',
                                    position: 'sticky',
                                    top: 0,
                                    zIndex: 10
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            ...thStyle,
                                            width: 30
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: filteredRules.length > 0 && selectedIds.size === filteredRules.length,
                                            onChange: toggleSelectAll,
                                            style: {
                                                cursor: 'pointer'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 582,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 581,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            ...thStyle,
                                            width: 35
                                        },
                                        children: "#"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 589,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: thStyle,
                                        children: "キーワード"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 590,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: thStyle,
                                        children: "ソース"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 591,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            ...thStyle,
                                            width: 40
                                        },
                                        children: "優先"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 592,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: thStyle,
                                        children: "借方科目"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 593,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: thStyle,
                                        children: "借方補助"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 594,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: thStyle,
                                        children: "借方税"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 595,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: thStyle,
                                        children: "貸方科目"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 596,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: thStyle,
                                        children: "貸方補助"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 597,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: thStyle,
                                        children: "貸方税"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 598,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            ...thStyle,
                                            width: 40
                                        },
                                        children: "回数"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 599,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            ...thStyle,
                                            width: 40
                                        },
                                        children: "信頼"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 600,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        style: {
                                            ...thStyle,
                                            width: 35
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                        lineNumber: 601,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 580,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                            lineNumber: 579,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    colSpan: 12,
                                    style: {
                                        padding: 40,
                                        textAlign: 'center',
                                        color: 'var(--text-muted)'
                                    },
                                    children: "読み込み中..."
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 607,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 606,
                                columnNumber: 15
                            }, this) : filteredRules.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    colSpan: 14,
                                    style: {
                                        padding: 40,
                                        textAlign: 'center',
                                        color: 'var(--text-muted)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                marginBottom: 12
                                            },
                                            children: "ルールがありません"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 614,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowImportModal(true),
                                            style: {
                                                padding: '8px 16px',
                                                fontSize: 11,
                                                background: 'var(--accent)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: 4,
                                                cursor: 'pointer'
                                            },
                                            children: "スプレッドシートからインポート"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 615,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 613,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                lineNumber: 612,
                                columnNumber: 15
                            }, this) : filteredRules.map((rule, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    style: {
                                        background: selectedIds.has(rule.id) ? 'rgba(59, 130, 246, 0.1)' : index % 2 === 0 ? 'var(--bg)' : 'var(--highlight)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                ...tdStyle,
                                                textAlign: 'center'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: selectedIds.has(rule.id),
                                                onChange: ()=>toggleSelect(rule.id),
                                                style: {
                                                    cursor: 'pointer'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                                lineNumber: 642,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 641,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                ...tdStyle,
                                                textAlign: 'center',
                                                color: 'var(--text-muted)',
                                                fontSize: 9
                                            },
                                            children: index + 1
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 649,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: tdStyle,
                                            children: rule.keyword
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 652,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: tdStyle,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    padding: '1px 4px',
                                                    borderRadius: 3,
                                                    fontSize: 9,
                                                    background: getSourceColor(rule.match_source),
                                                    color: 'white'
                                                },
                                                children: rule.match_source
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                                lineNumber: 654,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 653,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                ...tdStyle,
                                                textAlign: 'center'
                                            },
                                            children: rule.priority
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 664,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: tdStyle,
                                            children: rule.target_category
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 665,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: tdStyle,
                                            children: rule.target_sub_category
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 666,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: tdStyle,
                                            children: rule.tax_code
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 667,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: tdStyle,
                                            children: rule.credit_account
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 668,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: tdStyle,
                                            children: rule.credit_sub_account
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 669,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: tdStyle,
                                            children: rule.credit_tax_code
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 670,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                ...tdStyle,
                                                textAlign: 'center'
                                            },
                                            children: rule.applied_count
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 671,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                ...tdStyle,
                                                textAlign: 'center'
                                            },
                                            children: rule.ai_confidence_score ? "".concat(Math.round(rule.ai_confidence_score * 100), "%") : '-'
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 672,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            style: {
                                                ...tdStyle,
                                                textAlign: 'center'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleDeleteOne(rule.id),
                                                style: {
                                                    padding: '2px 4px',
                                                    fontSize: 9,
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--error)',
                                                    cursor: 'pointer',
                                                    opacity: 0.6
                                                },
                                                title: "削除",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                                    lineNumber: 689,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                                lineNumber: 676,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 675,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, rule.id, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 633,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                            lineNumber: 604,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                    lineNumber: 578,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                lineNumber: 577,
                columnNumber: 7
            }, this),
            showImportModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: 'var(--panel)',
                        borderRadius: 12,
                        padding: 24,
                        width: '90%',
                        maxWidth: 500,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                margin: '0 0 16px',
                                fontSize: 16,
                                fontWeight: 600
                            },
                            children: "スプレッドシートからインポート"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                            lineNumber: 721,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 16
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: 'block',
                                        fontSize: 12,
                                        marginBottom: 6,
                                        color: 'var(--text-muted)'
                                    },
                                    children: "スプレッドシートURL"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 726,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: spreadsheetUrl,
                                    onChange: (e)=>setSpreadsheetUrl(e.target.value),
                                    placeholder: "https://docs.google.com/spreadsheets/d/...",
                                    style: {
                                        width: '100%',
                                        padding: '10px 12px',
                                        fontSize: 12,
                                        border: '1px solid var(--panel-border)',
                                        borderRadius: 6,
                                        background: 'var(--bg)',
                                        color: 'var(--text)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 729,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                            lineNumber: 725,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 16
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: 'block',
                                        fontSize: 12,
                                        marginBottom: 6,
                                        color: 'var(--text-muted)'
                                    },
                                    children: "シート名"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 747,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: sheetName,
                                    onChange: (e)=>setSheetName(e.target.value),
                                    style: {
                                        width: '100%',
                                        padding: '10px 12px',
                                        fontSize: 12,
                                        border: '1px solid var(--panel-border)',
                                        borderRadius: 6,
                                        background: 'var(--bg)',
                                        color: 'var(--text)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "統合ルール",
                                            children: "統合ルール（推奨）"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 763,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "個別ルール",
                                            children: "個別ルール"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                            lineNumber: 764,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 750,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                            lineNumber: 746,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: 12,
                                background: 'rgba(245, 158, 11, 0.1)',
                                borderRadius: 6,
                                marginBottom: 16,
                                fontSize: 11,
                                color: 'var(--warning)'
                            },
                            children: "⚠️ スプレッドシートを「リンクを知っている全員が閲覧可」に設定してください"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                            lineNumber: 768,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 12
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowImportModal(false);
                                        setError(null);
                                        setImportResult(null);
                                    },
                                    style: {
                                        padding: '10px 20px',
                                        fontSize: 12,
                                        background: 'var(--highlight)',
                                        border: '1px solid var(--panel-border)',
                                        borderRadius: 6,
                                        color: 'var(--text)',
                                        cursor: 'pointer'
                                    },
                                    children: "キャンセル"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 780,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleImportFromSheet,
                                    disabled: importing,
                                    style: {
                                        padding: '10px 20px',
                                        fontSize: 12,
                                        background: 'var(--accent)',
                                        border: 'none',
                                        borderRadius: 6,
                                        color: 'white',
                                        cursor: 'pointer',
                                        opacity: importing ? 0.7 : 1
                                    },
                                    children: importing ? 'インポート中...' : 'インポート実行'
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 794,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                            lineNumber: 779,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                    lineNumber: 713,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                lineNumber: 701,
                columnNumber: 9
            }, this),
            showDeleteConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: 'var(--panel)',
                        borderRadius: 12,
                        padding: 24,
                        width: '90%',
                        maxWidth: 400,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            style: {
                                margin: '0 0 16px',
                                fontSize: 16,
                                fontWeight: 600,
                                color: 'var(--error)'
                            },
                            children: deleteMode === 'all' ? '全ルール削除' : '選択ルール削除'
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                            lineNumber: 837,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                margin: '0 0 16px',
                                fontSize: 13,
                                color: 'var(--text)'
                            },
                            children: [
                                deleteMode === 'all' ? "".concat(rules.length, "件のルールをすべて削除します。") : "".concat(selectedIds.size, "件の選択したルールを削除します。"),
                                "この操作は取り消せません。"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                            lineNumber: 841,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 12
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowDeleteConfirm(false),
                                    style: {
                                        padding: '10px 20px',
                                        fontSize: 12,
                                        background: 'var(--highlight)',
                                        border: '1px solid var(--panel-border)',
                                        borderRadius: 6,
                                        color: 'var(--text)',
                                        cursor: 'pointer'
                                    },
                                    children: "キャンセル"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 850,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: deleteMode === 'all' ? handleDeleteAll : handleDeleteSelected,
                                    disabled: deleting,
                                    style: {
                                        padding: '10px 20px',
                                        fontSize: 12,
                                        background: 'var(--error)',
                                        border: 'none',
                                        borderRadius: 6,
                                        color: 'white',
                                        cursor: 'pointer',
                                        opacity: deleting ? 0.7 : 1
                                    },
                                    children: deleting ? '削除中...' : '削除する'
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                                    lineNumber: 864,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                            lineNumber: 849,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                    lineNumber: 829,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
                lineNumber: 817,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx",
        lineNumber: 323,
        columnNumber: 5
    }, this);
}, "YEIfaeEaP9LZbLGin3uwZjSRpuE=")), "YEIfaeEaP9LZbLGin3uwZjSRpuE=");
_c1 = RulesManagementPanel;
// スタイル
const thStyle = {
    padding: '6px 8px',
    textAlign: 'left',
    fontWeight: 600,
    color: 'var(--text-muted)',
    borderBottom: '2px solid var(--panel-border)',
    whiteSpace: 'nowrap'
};
const tdStyle = {
    padding: '5px 8px',
    borderBottom: '1px solid var(--panel-border)',
    color: 'var(--text)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 120
};
function getSourceColor(source) {
    switch(source){
        case '借方補助科目':
            return 'rgba(59, 130, 246, 0.8)';
        case '貸方補助科目':
            return 'rgba(34, 197, 94, 0.8)';
        case '摘要':
            return 'rgba(168, 85, 247, 0.8)';
        case 'メモ':
            return 'rgba(245, 158, 11, 0.8)';
        default:
            return 'rgba(107, 114, 128, 0.8)';
    }
}
const __TURBOPACK__default__export__ = RulesManagementPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "RulesManagementPanel$memo");
__turbopack_context__.k.register(_c1, "RulesManagementPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx
/**
 * N3 記帳オートメーション - ページレイアウト
 * 
 * editing-n3と同じアーキテクチャ:
 * - N3CollapsibleHeader (スクロールで縮小)
 * - L2タブ（取引マッパー / ルール管理 / MF連携 / 履歴）
 * - L3フィルター
 * - 2パネル構造
 */ __turbopack_context__.s([
    "BookkeepingN3PageLayout",
    ()=>BookkeepingN3PageLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/history.js [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/wrench.js [app-client] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/git-branch.js [app-client] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/database.js [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$filter$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-filter-tab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$layout$2f$n3$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$layout$2f$n3$2d$collapsible$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/layout/n3-collapsible-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-divider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-header-tab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$pin$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-pin-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$language$2d$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-language-switch.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$world$2d$clock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-world-clock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$currency$2d$display$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-currency-display.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$user$2d$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-user-avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$search$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-header-search.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-tooltip.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$error$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/error/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$error$2f$error$2d$boundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/error/error-boundary.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$hooks$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/bookkeeping-n3/hooks/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$hooks$2f$use$2d$bookkeeping$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/bookkeeping-n3/hooks/use-bookkeeping-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$store$2f$use$2d$bookkeeping$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/bookkeeping-n3/store/use-bookkeeping-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$components$2f$transaction$2d$list$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/transaction-list-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$components$2f$rule$2d$builder$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rule-builder-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$components$2f$rules$2d$management$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/rules-management-panel.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
// ============================================================
// 定数
// ============================================================
const L2_TABS = [
    {
        id: 'mapper',
        label: '取引マッパー',
        labelEn: 'Mapper',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
    },
    {
        id: 'rules',
        label: 'ルール管理',
        labelEn: 'Rules',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
    },
    {
        id: 'mf-sync',
        label: 'MF連携',
        labelEn: 'MF Sync',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"]
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
        label: '全取引'
    },
    {
        id: 'pending',
        label: '未処理'
    },
    {
        id: 'simulated',
        label: 'ルール適用済'
    },
    {
        id: 'submitted',
        label: '記帳完了'
    },
    {
        id: 'ignored',
        label: '除外'
    }
];
const PANEL_TABS = [
    {
        id: 'tools',
        label: 'ツール',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
            lineNumber: 83,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'flow',
        label: 'フロー',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
            lineNumber: 84,
            columnNumber: 37
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'stats',
        label: '統計',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
            lineNumber: 85,
            columnNumber: 37
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'filter',
        label: 'フィルター',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
            lineNumber: 86,
            columnNumber: 41
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
// ============================================================
// サブコンポーネント
// ============================================================
const BookkeepingHeader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s(function BookkeepingHeader(param) {
    let { user, onLogout, language, onLanguageToggle, pinnedTab, onPinnedTabChange, hoveredTab, onHoveredTabChange, isHeaderHovered, onHeaderHoveredChange } = param;
    _s();
    const [times, setTimes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [showUserMenu, setShowUserMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const userMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const leaveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isPinned = pinnedTab !== null;
    const activeTab = pinnedTab || hoveredTab;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BookkeepingHeader.BookkeepingHeader.useEffect": ()=>{
            const update = {
                "BookkeepingHeader.BookkeepingHeader.useEffect.update": ()=>{
                    const t = {};
                    CLOCKS_CONFIG.forEach({
                        "BookkeepingHeader.BookkeepingHeader.useEffect.update": (c)=>{
                            t[c.label] = new Date().toLocaleTimeString("en-US", {
                                timeZone: c.tz,
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false
                            });
                        }
                    }["BookkeepingHeader.BookkeepingHeader.useEffect.update"]);
                    setTimes(t);
                }
            }["BookkeepingHeader.BookkeepingHeader.useEffect.update"];
            update();
            const i = setInterval(update, 30000);
            return ({
                "BookkeepingHeader.BookkeepingHeader.useEffect": ()=>clearInterval(i)
            })["BookkeepingHeader.BookkeepingHeader.useEffect"];
        }
    }["BookkeepingHeader.BookkeepingHeader.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BookkeepingHeader.BookkeepingHeader.useEffect": ()=>{
            const h = {
                "BookkeepingHeader.BookkeepingHeader.useEffect.h": (e)=>{
                    if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                        setShowUserMenu(false);
                    }
                }
            }["BookkeepingHeader.BookkeepingHeader.useEffect.h"];
            document.addEventListener("mousedown", h);
            return ({
                "BookkeepingHeader.BookkeepingHeader.useEffect": ()=>document.removeEventListener("mousedown", h)
            })["BookkeepingHeader.BookkeepingHeader.useEffect"];
        }
    }["BookkeepingHeader.BookkeepingHeader.useEffect"], []);
    const handleMouseEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookkeepingHeader.BookkeepingHeader.useCallback[handleMouseEnter]": ()=>{
            if (leaveTimeoutRef.current) {
                clearTimeout(leaveTimeoutRef.current);
                leaveTimeoutRef.current = null;
            }
            onHeaderHoveredChange(true);
        }
    }["BookkeepingHeader.BookkeepingHeader.useCallback[handleMouseEnter]"], [
        onHeaderHoveredChange
    ]);
    const handleMouseLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookkeepingHeader.BookkeepingHeader.useCallback[handleMouseLeave]": ()=>{
            if (pinnedTab) return;
            leaveTimeoutRef.current = setTimeout({
                "BookkeepingHeader.BookkeepingHeader.useCallback[handleMouseLeave]": ()=>{
                    onHoveredTabChange(null);
                    onHeaderHoveredChange(false);
                }
            }["BookkeepingHeader.BookkeepingHeader.useCallback[handleMouseLeave]"], 150);
        }
    }["BookkeepingHeader.BookkeepingHeader.useCallback[handleMouseLeave]"], [
        pinnedTab,
        onHoveredTabChange,
        onHeaderHoveredChange
    ]);
    const handleTabMouseEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookkeepingHeader.BookkeepingHeader.useCallback[handleTabMouseEnter]": (tabId)=>{
            if (leaveTimeoutRef.current) {
                clearTimeout(leaveTimeoutRef.current);
                leaveTimeoutRef.current = null;
            }
            if (!pinnedTab) onHoveredTabChange(tabId);
            onHeaderHoveredChange(true);
        }
    }["BookkeepingHeader.BookkeepingHeader.useCallback[handleTabMouseEnter]"], [
        pinnedTab,
        onHoveredTabChange,
        onHeaderHoveredChange
    ]);
    const handleTabClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookkeepingHeader.BookkeepingHeader.useCallback[handleTabClick]": (tabId)=>{
            if (pinnedTab === tabId) {
                onPinnedTabChange(null);
                onHoveredTabChange(null);
                onHeaderHoveredChange(false);
            } else {
                onPinnedTabChange(tabId);
                onHoveredTabChange(null);
            }
        }
    }["BookkeepingHeader.BookkeepingHeader.useCallback[handleTabClick]"], [
        pinnedTab,
        onPinnedTabChange,
        onHoveredTabChange,
        onHeaderHoveredChange
    ]);
    const handlePinToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookkeepingHeader.BookkeepingHeader.useCallback[handlePinToggle]": ()=>{
            if (pinnedTab) {
                onPinnedTabChange(null);
                onHoveredTabChange(null);
                onHeaderHoveredChange(false);
            } else if (hoveredTab) {
                onPinnedTabChange(hoveredTab);
                onHoveredTabChange(null);
            }
        }
    }["BookkeepingHeader.BookkeepingHeader.useCallback[handlePinToggle]"], [
        pinnedTab,
        hoveredTab,
        onPinnedTabChange,
        onHoveredTabChange,
        onHeaderHoveredChange
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
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 204,
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
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                lineNumber: 203,
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
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                    lineNumber: 221,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                lineNumber: 220,
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
                        href: "https://docs.google.com/spreadsheets/d/14c0kwE-jhrMkqhRe96XcR78Y5XOQH0o7qsJfRBcmM80/edit?gid=1127843525#gid=1127843525",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 10px',
                            fontSize: 11,
                            fontWeight: 500,
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.25))',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: 6,
                            color: 'var(--text)',
                            cursor: 'pointer',
                            textDecoration: 'none'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 246,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "ルールシート"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                size: 10,
                                style: {
                                    opacity: 0.6
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "https://biz.moneyforward.com/",
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
                            textDecoration: 'none'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "MFクラウド"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 272,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                size: 10,
                                style: {
                                    opacity: 0.6
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 252,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                        orientation: "vertical"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 276,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$language$2d$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3LanguageSwitch"], {
                        language: language,
                        onToggle: onLanguageToggle
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                        orientation: "vertical"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$world$2d$clock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3WorldClock"], {
                        clocks: clocksData
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                        orientation: "vertical"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$currency$2d$display$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3CurrencyDisplay"], {
                        value: 149.50,
                        trend: "up"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 281,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                        orientation: "vertical"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 282,
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
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 285,
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
                                    children: "Sign out"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                    lineNumber: 288,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 287,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                lineNumber: 225,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
        lineNumber: 187,
        columnNumber: 5
    }, this);
}, "8iAu4J05azTgUUmS0j3pB7ymiAc="));
_c = BookkeepingHeader;
const BookkeepingSubToolbar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function BookkeepingSubToolbar(param) {
    let { pageSize, onPageSizeChange, displayCount, totalCount, onRefresh, onSync, loading } = param;
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Tooltip"], {
                        content: "データ更新",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onRefresh,
                            disabled: loading,
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '4px 8px',
                                fontSize: '11px',
                                background: 'transparent',
                                border: '1px solid var(--panel-border)',
                                borderRadius: '4px',
                                color: 'var(--text-muted)',
                                cursor: 'pointer'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    size: 12,
                                    className: loading ? 'animate-spin' : ''
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                    lineNumber: 348,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "更新"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                    lineNumber: 349,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                            lineNumber: 332,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 331,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onSync,
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '4px 8px',
                            fontSize: '11px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '4px',
                            color: 'rgb(59, 130, 246)',
                            cursor: 'pointer'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 368,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "MF同期"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 369,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 353,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                        orientation: "vertical",
                        style: {
                            height: 20
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 372,
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
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 387,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: 50,
                                children: "50"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 388,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: 100,
                                children: "100"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 389,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 374,
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
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 392,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                lineNumber: 330,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 8px',
                        fontSize: '11px',
                        background: 'transparent',
                        border: '1px solid var(--panel-border)',
                        borderRadius: '4px',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                            size: 12
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                            lineNumber: 412,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "設定"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                            lineNumber: 413,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                    lineNumber: 398,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                lineNumber: 397,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
        lineNumber: 320,
        columnNumber: 5
    }, this);
});
_c1 = BookkeepingSubToolbar;
// ============================================================
// ツールパネルコンテンツ
// ============================================================
const ToolsPanelContent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function ToolsPanelContent(param) {
    let { transactionStats, rulesCount, onApplyRules, isApplying } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 16
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: 8
                        },
                        children: "取引統計"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 439,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 8
                        },
                        children: [
                            {
                                label: '未処理',
                                value: transactionStats.pending,
                                color: 'var(--warning)'
                            },
                            {
                                label: '適用済',
                                value: transactionStats.simulated,
                                color: 'var(--accent)'
                            },
                            {
                                label: '完了',
                                value: transactionStats.submitted,
                                color: 'var(--success)'
                            },
                            {
                                label: '除外',
                                value: transactionStats.ignored,
                                color: 'var(--text-muted)'
                            }
                        ].map((stat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: 8,
                                    background: 'var(--highlight)',
                                    borderRadius: 6,
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 18,
                                            fontWeight: 700,
                                            color: stat.color
                                        },
                                        children: stat.value
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                        lineNumber: 458,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: 10,
                                            color: 'var(--text-muted)'
                                        },
                                        children: stat.label
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                        lineNumber: 459,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, stat.label, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 449,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 442,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                lineNumber: 438,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: 8
                        },
                        children: "一括操作"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 467,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onApplyRules,
                            disabled: isApplying || transactionStats.pending === 0,
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                padding: '8px 12px',
                                fontSize: 12,
                                fontWeight: 500,
                                background: 'var(--accent)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 6,
                                cursor: transactionStats.pending === 0 ? 'not-allowed' : 'pointer',
                                opacity: transactionStats.pending === 0 ? 0.5 : 1
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                    lineNumber: 490,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: isApplying ? '適用中...' : "全ルール適用 (".concat(rulesCount, "ルール)")
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                    lineNumber: 491,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                            lineNumber: 471,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 470,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                lineNumber: 466,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
        lineNumber: 436,
        columnNumber: 5
    }, this);
});
_c2 = ToolsPanelContent;
function BookkeepingN3PageLayout() {
    _s1();
    const { user, logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // UI状態
    const [pinnedTab, setPinnedTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hoveredTab, setHoveredTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isHeaderHovered, setIsHeaderHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeL2Tab, setActiveL2Tab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('mapper');
    const [activeFilter, setActiveFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('pending');
    const [language, setLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('ja');
    const [pageSize, setPageSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(50);
    const mainContentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isPinned = pinnedTab !== null;
    // データフック
    const { transactions, transactionsLoading, transactionsError, transactionStats, rules, selectedTransaction, draftRule, extractedKeywords, suggestedAccounts, aiLoading, isCreatingRule, isApplyingRules, filter, loadTransactions, loadRules, saveRule, applyRulesToPendingTransactions, selectTransaction, setFilter, updateDraftRule, selectKeyword, selectAccount, cancelCreatingRule, fetchAISuggestions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$hooks$2f$use$2d$bookkeeping$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookkeepingData"])();
    const { openMFSyncModal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$store$2f$use$2d$bookkeeping$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookkeepingStore"])();
    // フィルター変更
    const handleFilterChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "BookkeepingN3PageLayout.useCallback[handleFilterChange]": (filterId)=>{
            setActiveFilter(filterId);
            setFilter({
                status: filterId === 'all' ? 'all' : filterId
            });
        }
    }["BookkeepingN3PageLayout.useCallback[handleFilterChange]"], [
        setFilter
    ]);
    // パネルコンテンツ取得
    const getPanelContent = (tabId)=>{
        if (tabId === 'tools') {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToolsPanelContent, {
                transactionStats: transactionStats,
                rulesCount: rules.length,
                onApplyRules: applyRulesToPendingTransactions,
                isApplying: isApplyingRules
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                lineNumber: 558,
                columnNumber: 9
            }, this);
        }
        if (tabId === 'stats') {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: 12
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: 11,
                        color: 'var(--text-muted)'
                    },
                    children: "統計パネル（開発中）"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                    lineNumber: 569,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                lineNumber: 568,
                columnNumber: 9
            }, this);
        }
        return null;
    };
    const showHoverPanel = !isPinned && hoveredTab !== null && isHeaderHovered;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            height: '100vh',
            overflow: 'hidden',
            background: 'var(--bg)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: mainContentRef,
            id: "main-scroll-container",
            style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                height: '100%',
                minWidth: 0,
                overflow: 'auto'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$layout$2f$n3$2d$collapsible$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3CollapsibleHeader"], {
                    scrollContainerId: "main-scroll-container",
                    threshold: 10,
                    transitionDuration: 200,
                    zIndex: 40,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BookkeepingHeader, {
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
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                            lineNumber: 594,
                            columnNumber: 11
                        }, this),
                        showHoverPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: 'absolute',
                                top: HEADER_HEIGHT,
                                left: 0,
                                right: 0,
                                padding: 6,
                                zIndex: 100,
                                maxHeight: '60vh',
                                overflowY: 'auto',
                                background: 'var(--panel)',
                                borderBottom: '1px solid var(--panel-border)'
                            },
                            children: getPanelContent(hoveredTab)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                            lineNumber: 609,
                            columnNumber: 13
                        }, this),
                        isPinned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flexShrink: 0,
                                padding: 6,
                                background: 'var(--panel)',
                                borderBottom: '1px solid var(--panel-border)'
                            },
                            children: getPanelContent(pinnedTab)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                            lineNumber: 627,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                height: 36,
                                display: 'flex',
                                alignItems: 'center',
                                background: 'var(--panel)',
                                borderBottom: '1px solid var(--panel-border)',
                                padding: '0 12px',
                                flexShrink: 0
                            },
                            children: L2_TABS.map((tab)=>{
                                const Icon = tab.icon;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setActiveL2Tab(tab.id),
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        background: activeL2Tab === tab.id ? 'var(--accent)' : 'transparent',
                                        color: activeL2Tab === tab.id ? 'white' : 'var(--text-muted)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                            lineNumber: 662,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: language === 'ja' ? tab.label : tab.labelEn
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                            lineNumber: 663,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, tab.id, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                    lineNumber: 645,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                            lineNumber: 633,
                            columnNumber: 11
                        }, this),
                        activeL2Tab === 'mapper' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                height: 36,
                                display: 'flex',
                                alignItems: 'center',
                                background: 'var(--highlight)',
                                borderBottom: '1px solid var(--panel-border)',
                                padding: '0 12px',
                                flexShrink: 0,
                                overflowX: 'auto'
                            },
                            children: FILTER_TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$filter$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3FilterTab"], {
                                    id: tab.id,
                                    label: tab.label,
                                    count: tab.id === 'all' ? transactionStats.total : tab.id === 'pending' ? transactionStats.pending : tab.id === 'simulated' ? transactionStats.simulated : tab.id === 'submitted' ? transactionStats.submitted : transactionStats.ignored,
                                    active: activeFilter === tab.id,
                                    onClick: ()=>handleFilterChange(tab.id)
                                }, tab.id, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                    lineNumber: 682,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                            lineNumber: 671,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BookkeepingSubToolbar, {
                            pageSize: pageSize,
                            onPageSizeChange: setPageSize,
                            displayCount: transactions.length,
                            totalCount: transactionStats.total,
                            onRefresh: loadTransactions,
                            onSync: ()=>openMFSyncModal(),
                            loading: transactionsLoading
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                            lineNumber: 701,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                    lineNumber: 592,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$error$2f$error$2d$boundary$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ErrorBoundary"], {
                    componentName: "BookkeepingMainContent",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        style: {
                            display: 'flex',
                            flex: 1,
                            overflow: 'hidden'
                        },
                        children: [
                            activeL2Tab === 'mapper' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 420,
                                            flexShrink: 0
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$components$2f$transaction$2d$list$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionListPanel"], {
                                            transactions: transactions,
                                            loading: transactionsLoading,
                                            error: transactionsError,
                                            selectedId: (selectedTransaction === null || selectedTransaction === void 0 ? void 0 : selectedTransaction.id) || null,
                                            filter: filter,
                                            stats: transactionStats,
                                            onSelect: selectTransaction,
                                            onFilterChange: setFilter,
                                            onRefresh: loadTransactions,
                                            onSync: ()=>openMFSyncModal()
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                            lineNumber: 719,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                        lineNumber: 718,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            minWidth: 0
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$components$2f$rule$2d$builder$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RuleBuilderPanel"], {
                                            transaction: selectedTransaction,
                                            draftRule: draftRule,
                                            extractedKeywords: extractedKeywords,
                                            suggestedAccounts: suggestedAccounts,
                                            aiLoading: aiLoading,
                                            isCreatingRule: isCreatingRule,
                                            onUpdateDraft: updateDraftRule,
                                            onSelectKeyword: selectKeyword,
                                            onSelectAccount: selectAccount,
                                            onSave: saveRule,
                                            onCancel: cancelCreatingRule,
                                            onRequestAI: ()=>{
                                                if (selectedTransaction === null || selectedTransaction === void 0 ? void 0 : selectedTransaction.raw_memo) {
                                                    fetchAISuggestions(selectedTransaction.raw_memo);
                                                }
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                            lineNumber: 735,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                        lineNumber: 734,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true),
                            activeL2Tab === 'rules' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    overflow: 'hidden'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$components$2f$rules$2d$management$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RulesManagementPanel"], {}, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                    lineNumber: 759,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 758,
                                columnNumber: 15
                            }, this),
                            activeL2Tab === 'mf-sync' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                            size: 48,
                                            style: {
                                                marginBottom: 16,
                                                opacity: 0.5
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                            lineNumber: 766,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 14,
                                                marginBottom: 8
                                            },
                                            children: "MFクラウド連携"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                            lineNumber: 767,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 12
                                            },
                                            children: "API連携設定・同期履歴"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                            lineNumber: 768,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                    lineNumber: 765,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 764,
                                columnNumber: 15
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
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                            lineNumber: 776,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 14,
                                                marginBottom: 8
                                            },
                                            children: "履歴"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                            lineNumber: 777,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 12
                                            },
                                            children: "操作ログ・変更履歴"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                            lineNumber: 778,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                    lineNumber: 775,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                                lineNumber: 774,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                        lineNumber: 714,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                    lineNumber: 713,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$layout$2f$n3$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Footer"], {
                    copyright: "© 2025 N3 Platform",
                    version: "Bookkeeping v1.0.0",
                    status: {
                        label: 'DB',
                        connected: !transactionsError
                    },
                    links: [
                        {
                            id: 'mf',
                            label: 'MFクラウド',
                            href: 'https://biz.moneyforward.com/'
                        }
                    ]
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
                    lineNumber: 786,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
            lineNumber: 580,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx",
        lineNumber: 579,
        columnNumber: 5
    }, this);
}
_s1(BookkeepingN3PageLayout, "VkZJOy0RjkhC0FdNhdsmzv7RY9g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$hooks$2f$use$2d$bookkeeping$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookkeepingData"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$store$2f$use$2d$bookkeeping$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBookkeepingStore"]
    ];
});
_c3 = BookkeepingN3PageLayout;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "BookkeepingHeader");
__turbopack_context__.k.register(_c1, "BookkeepingSubToolbar");
__turbopack_context__.k.register(_c2, "ToolsPanelContent");
__turbopack_context__.k.register(_c3, "BookkeepingN3PageLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/bookkeeping-n3/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/bookkeeping-n3/page.tsx
/**
 * N3 記帳オートメーション - メインページ
 * 
 * editing-n3と同じN3デザインシステムを使用
 * - N3CollapsibleHeader
 * - L2タブ（取引マッパー / ルール管理 / MF連携 / 履歴）
 * - L3フィルター
 */ __turbopack_context__.s([
    "default",
    ()=>BookkeepingN3Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$components$2f$bookkeeping$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/bookkeeping-n3/components/bookkeeping-n3-page-layout.tsx [app-client] (ecmascript)");
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
function BookkeepingN3Page() {
    _s();
    renderCount++;
    if ("TURBOPACK compile-time truthy", 1) {
        console.log("[BookkeepingN3Page] RENDER #".concat(renderCount));
    }
    const mountCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const [blocked, setBlocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BookkeepingN3Page.useEffect": ()=>{
            mountCountRef.current++;
            if (mountCountRef.current > LOOP_DETECTION.MOUNT_THRESHOLD) {
                console.error('[BookkeepingN3Page] 🚨 無限ループ検知!');
                setBlocked(true);
                return;
            }
            const timer = setTimeout({
                "BookkeepingN3Page.useEffect.timer": ()=>{
                    mountCountRef.current = 0;
                }
            }["BookkeepingN3Page.useEffect.timer"], LOOP_DETECTION.MOUNT_RESET_INTERVAL);
            return ({
                "BookkeepingN3Page.useEffect": ()=>clearTimeout(timer)
            })["BookkeepingN3Page.useEffect"];
        }
    }["BookkeepingN3Page.useEffect"], []);
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
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/page.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        marginBottom: '2rem',
                        color: 'var(--text-muted)'
                    },
                    children: "ブラウザのDevTools → Consoleでログを確認してください。"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/page.tsx",
                    lineNumber: 81,
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
                    fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/page.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/page.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$bookkeeping$2d$n3$2f$components$2f$bookkeeping$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BookkeepingN3PageLayout"], {}, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/bookkeeping-n3/page.tsx",
        lineNumber: 101,
        columnNumber: 10
    }, this);
}
_s(BookkeepingN3Page, "oWhp1Aw6z0p3TJfFBA7OxTpEG/M=");
_c = BookkeepingN3Page;
var _c;
__turbopack_context__.k.register(_c, "BookkeepingN3Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/bookkeeping-n3/page.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/n3-frontend_vps/app/tools/bookkeeping-n3/page.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_97a7625b._.js.map