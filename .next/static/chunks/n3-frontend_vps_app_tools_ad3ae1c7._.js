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
"[project]/n3-frontend_vps/app/tools/operations-n3/hooks/use-operations-integrated.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/hooks/use-operations-integrated.ts
/**
 * Operations N3 統合フック
 *
 * ゴールドスタンダード準拠:
 * - ドメインステート: React Query (TanStack Query)
 * - UIステート: Zustand (operationsUIStore)
 * - 単一インターフェース: コンポーネントからはこのフックのみ使用
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useOperationsIntegrated",
    ()=>useOperationsIntegrated
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/n3/operationsUIStore.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
async function fetchOrders(params) {
    var _result_data, _result_data_summary, _result_data1;
    const queryParams = new URLSearchParams({
        limit: String(params.pageSize),
        offset: String((params.page - 1) * params.pageSize)
    });
    if (params.filters.marketplace && params.filters.marketplace !== 'all') {
        queryParams.set('marketplace', params.filters.marketplace);
    }
    if (params.filters.status) {
        queryParams.set('status', params.filters.status);
    }
    if (params.filters.search) {
        queryParams.set('search', params.filters.search);
    }
    const response = await fetch("/api/orders?".concat(queryParams.toString()));
    if (!response.ok) {
        throw new Error('Failed to fetch orders');
    }
    const result = await response.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to fetch orders');
    }
    // APIレスポンスをOrder型に変換
    const orders = (((_result_data = result.data) === null || _result_data === void 0 ? void 0 : _result_data.orders) || []).map((o)=>{
        var _o_marketplace;
        return {
            id: o.id,
            orderId: o.order_id,
            marketplace: ((_o_marketplace = o.marketplace) === null || _o_marketplace === void 0 ? void 0 : _o_marketplace.split('_')[0]) || 'ebay',
            orderDate: o.order_date,
            shippingDeadline: o.shipping_deadline || o.order_date,
            customerName: o.buyer_name || o.buyer_user_id || 'Unknown',
            customerId: o.buyer_user_id || '',
            items: (o.order_items || []).map((item)=>({
                    id: item.id,
                    sku: item.sku,
                    title: item.title,
                    quantity: item.quantity,
                    unitPrice: item.unit_price,
                    imageUrl: item.image_url
                })),
            orderStatus: mapOrderStatus(o.order_status),
            purchaseStatus: o.purchase_status || '未仕入れ',
            totalAmount: o.total_amount || 0,
            currency: o.currency || 'USD',
            estimatedProfit: o.estimated_profit || 0,
            confirmedProfit: o.confirmed_profit,
            isProfitConfirmed: o.is_profit_confirmed || false,
            estimatedPurchaseUrl: o.estimated_purchase_url,
            actualPurchaseUrl: o.actual_purchase_url,
            actualPurchaseCostJpy: o.actual_purchase_cost_jpy,
            shippingMethod: o.shipping_method,
            trackingNumber: o.tracking_number,
            destinationCountry: o.destination_country || 'Unknown',
            inquiryCount: o.inquiry_count || 0,
            createdAt: o.created_at,
            updatedAt: o.updated_at
        };
    });
    // 統計を計算
    const stats = {
        total: orders.length,
        new: orders.filter((o)=>o.orderStatus === 'new').length,
        paid: orders.filter((o)=>o.orderStatus === 'paid').length,
        processing: orders.filter((o)=>o.orderStatus === 'processing').length,
        shipped: orders.filter((o)=>o.orderStatus === 'shipped').length,
        delivered: orders.filter((o)=>o.orderStatus === 'delivered').length,
        todayDeadline: orders.filter((o)=>{
            const today = new Date().toDateString();
            return new Date(o.shippingDeadline).toDateString() === today;
        }).length,
        unpurchased: orders.filter((o)=>o.purchaseStatus === '未仕入れ').length
    };
    return {
        orders,
        total: ((_result_data1 = result.data) === null || _result_data1 === void 0 ? void 0 : (_result_data_summary = _result_data1.summary) === null || _result_data_summary === void 0 ? void 0 : _result_data_summary.total) || orders.length,
        stats
    };
}
function mapOrderStatus(status) {
    const statusMap = {
        'new': 'new',
        'paid': 'paid',
        'processing': 'processing',
        'shipped': 'shipped',
        'delivered': 'delivered',
        'cancelled': 'cancelled'
    };
    return statusMap[status === null || status === void 0 ? void 0 : status.toLowerCase()] || 'new';
}
async function fetchShipping(params) {
    const queryParams = new URLSearchParams({
        limit: String(params.pageSize),
        offset: String((params.page - 1) * params.pageSize)
    });
    if (params.filters.marketplace && params.filters.marketplace !== 'all') {
        queryParams.set('marketplace', params.filters.marketplace);
    }
    const response = await fetch("/api/shipping?".concat(queryParams.toString()));
    if (!response.ok) {
        // 404などの場合は空配列を返す
        return {
            items: [],
            total: 0,
            stats: {
                total: 0,
                pending: 0,
                picking: 0,
                packed: 0,
                shipped: 0,
                urgent: 0
            }
        };
    }
    const result = await response.json();
    if (!result.success) {
        return {
            items: [],
            total: 0,
            stats: {
                total: 0,
                pending: 0,
                picking: 0,
                packed: 0,
                shipped: 0,
                urgent: 0
            }
        };
    }
    const items = (result.data || []).map((s)=>{
        var _s_marketplace;
        return {
            id: s.id,
            orderId: s.order_id,
            orderItemId: s.order_item_id,
            marketplace: ((_s_marketplace = s.marketplace) === null || _s_marketplace === void 0 ? void 0 : _s_marketplace.split('_')[0]) || 'ebay',
            customerName: s.customer_name || 'Unknown',
            productTitle: s.product_title || '',
            productSku: s.product_sku || '',
            quantity: s.quantity || 1,
            productImageUrl: s.product_image_url,
            status: mapShippingStatus(s.status),
            priority: s.priority || 'medium',
            deadline: s.deadline,
            shippingMethod: s.shipping_method,
            trackingNumber: s.tracking_number,
            shippingAddress: s.shipping_address || '',
            destinationCountry: s.destination_country || '',
            packageDimensions: s.package_dimensions,
            checklist: s.checklist || {
                itemVerified: false,
                packaged: false,
                labelAttached: false,
                weightMeasured: false,
                documentsPrepared: false
            },
            createdAt: s.created_at,
            updatedAt: s.updated_at
        };
    });
    const stats = {
        total: items.length,
        pending: items.filter((s)=>s.status === 'pending').length,
        picking: items.filter((s)=>s.status === 'picking').length,
        packed: items.filter((s)=>s.status === 'packed').length,
        shipped: items.filter((s)=>s.status === 'shipped').length,
        urgent: items.filter((s)=>s.priority === 'critical' || s.priority === 'high').length
    };
    return {
        items,
        total: items.length,
        stats
    };
}
function mapShippingStatus(status) {
    const statusMap = {
        'pending': 'pending',
        'picking': 'picking',
        'packed': 'packed',
        'shipped': 'shipped',
        'delivered': 'delivered'
    };
    return statusMap[status === null || status === void 0 ? void 0 : status.toLowerCase()] || 'pending';
}
async function fetchInquiries(params) {
    const queryParams = new URLSearchParams({
        limit: String(params.pageSize),
        offset: String((params.page - 1) * params.pageSize)
    });
    if (params.filters.marketplace && params.filters.marketplace !== 'all') {
        queryParams.set('marketplace', params.filters.marketplace);
    }
    if (params.filters.status) {
        queryParams.set('status', params.filters.status);
    }
    const response = await fetch("/api/inquiries?".concat(queryParams.toString()));
    if (!response.ok) {
        return {
            inquiries: [],
            total: 0,
            stats: {
                total: 0,
                unread: 0,
                aiResponded: 0,
                pendingManual: 0,
                completed: 0,
                critical: 0
            }
        };
    }
    const result = await response.json();
    if (!result.success) {
        return {
            inquiries: [],
            total: 0,
            stats: {
                total: 0,
                unread: 0,
                aiResponded: 0,
                pendingManual: 0,
                completed: 0,
                critical: 0
            }
        };
    }
    const inquiries = (result.data || []).map((i)=>{
        var _i_marketplace;
        return {
            id: i.id,
            marketplace: ((_i_marketplace = i.marketplace) === null || _i_marketplace === void 0 ? void 0 : _i_marketplace.split('_')[0]) || 'ebay',
            orderId: i.order_id,
            customerId: i.customer_id || '',
            customerName: i.customer_name || 'Unknown',
            subject: i.subject || '',
            content: i.content || '',
            receivedAt: i.received_at || i.created_at,
            aiUrgency: i.ai_urgency || 'medium',
            aiCategory: i.ai_category || 'OTHER',
            aiSentiment: i.ai_sentiment || 'neutral',
            aiSuggestedResponse: i.ai_suggested_response,
            status: mapInquiryStatus(i.status),
            autoRespondedAt: i.auto_responded_at,
            manualResponseAt: i.manual_response_at,
            respondedBy: i.responded_by,
            createdAt: i.created_at,
            updatedAt: i.updated_at
        };
    });
    const stats = {
        total: inquiries.length,
        unread: inquiries.filter((i)=>i.status === 'unread').length,
        aiResponded: inquiries.filter((i)=>i.status === 'ai_responded').length,
        pendingManual: inquiries.filter((i)=>i.status === 'pending_manual').length,
        completed: inquiries.filter((i)=>i.status === 'completed' || i.status === 'resolved').length,
        critical: inquiries.filter((i)=>i.aiUrgency === 'critical').length
    };
    return {
        inquiries,
        total: inquiries.length,
        stats
    };
}
function mapInquiryStatus(status) {
    const statusMap = {
        'unread': 'unread',
        'ai_responded': 'ai_responded',
        'pending_manual': 'pending_manual',
        'resolved': 'resolved',
        'completed': 'completed'
    };
    return statusMap[status === null || status === void 0 ? void 0 : status.toLowerCase()] || 'unread';
}
function useOperationsIntegrated() {
    var _ordersQuery_data, _shippingQuery_data, _inquiriesQuery_data, _ordersQuery_error, _shippingQuery_error, _inquiriesQuery_error, _ordersQuery_data1, _shippingQuery_data1, _inquiriesQuery_data1;
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    // UI State (Zustand)
    const activeTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsActiveTab"])();
    const currentPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsCurrentPage"])();
    const pageSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsPageSize"])();
    const filters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsFilters"])();
    const sortField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsSortField"])();
    const sortOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsSortOrder"])();
    const selectedOrderId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsSelectedOrderId"])();
    const selectedShippingId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsSelectedShippingId"])();
    const selectedInquiryId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsSelectedInquiryId"])();
    const selectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsSelectedIds"])();
    const showStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsShowStats"])();
    const showLinkedPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsShowLinkedPanel"])();
    // UI Actions
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsUIStore"].getState();
    // Query params
    const queryParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useOperationsIntegrated.useMemo[queryParams]": ()=>({
                page: currentPage,
                pageSize,
                filters: {
                    marketplace: filters.marketplace,
                    status: filters.status,
                    search: filters.search
                },
                sortField,
                sortOrder
            })
    }["useOperationsIntegrated.useMemo[queryParams]"], [
        currentPage,
        pageSize,
        filters,
        sortField,
        sortOrder
    ]);
    // ============================================================
    // React Query - Orders
    // ============================================================
    const ordersQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'operations',
            'orders',
            queryParams
        ],
        queryFn: {
            "useOperationsIntegrated.useQuery[ordersQuery]": ()=>fetchOrders(queryParams)
        }["useOperationsIntegrated.useQuery[ordersQuery]"],
        enabled: activeTab === 'orders',
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true
    });
    // ============================================================
    // React Query - Shipping
    // ============================================================
    const shippingQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'operations',
            'shipping',
            queryParams
        ],
        queryFn: {
            "useOperationsIntegrated.useQuery[shippingQuery]": ()=>fetchShipping(queryParams)
        }["useOperationsIntegrated.useQuery[shippingQuery]"],
        enabled: activeTab === 'shipping',
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true
    });
    // ============================================================
    // React Query - Inquiries
    // ============================================================
    const inquiriesQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            'operations',
            'inquiries',
            queryParams
        ],
        queryFn: {
            "useOperationsIntegrated.useQuery[inquiriesQuery]": ()=>fetchInquiries(queryParams)
        }["useOperationsIntegrated.useQuery[inquiriesQuery]"],
        enabled: activeTab === 'inquiries',
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true
    });
    // ============================================================
    // Mutations - Order
    // ============================================================
    const updateOrderMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useOperationsIntegrated.useMutation[updateOrderMutation]": async (param)=>{
                let { id, updates } = param;
                const response = await fetch("/api/orders/".concat(id), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updates)
                });
                if (!response.ok) throw new Error('Failed to update order');
                return response.json();
            }
        }["useOperationsIntegrated.useMutation[updateOrderMutation]"],
        onSuccess: {
            "useOperationsIntegrated.useMutation[updateOrderMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'operations',
                        'orders'
                    ]
                });
            }
        }["useOperationsIntegrated.useMutation[updateOrderMutation]"]
    });
    const markOrderShippedMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useOperationsIntegrated.useMutation[markOrderShippedMutation]": async (id)=>{
                const response = await fetch("/api/orders/".concat(id), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        order_status: 'shipped'
                    })
                });
                if (!response.ok) throw new Error('Failed to mark order shipped');
                return response.json();
            }
        }["useOperationsIntegrated.useMutation[markOrderShippedMutation]"],
        onSuccess: {
            "useOperationsIntegrated.useMutation[markOrderShippedMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'operations',
                        'orders'
                    ]
                });
            }
        }["useOperationsIntegrated.useMutation[markOrderShippedMutation]"]
    });
    // ============================================================
    // Mutations - Shipping
    // ============================================================
    const updateShippingMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useOperationsIntegrated.useMutation[updateShippingMutation]": async (param)=>{
                let { id, updates } = param;
                const response = await fetch("/api/shipping/".concat(id), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updates)
                });
                if (!response.ok) throw new Error('Failed to update shipping');
                return response.json();
            }
        }["useOperationsIntegrated.useMutation[updateShippingMutation]"],
        onSuccess: {
            "useOperationsIntegrated.useMutation[updateShippingMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'operations',
                        'shipping'
                    ]
                });
            }
        }["useOperationsIntegrated.useMutation[updateShippingMutation]"]
    });
    const markShippingCompleteMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useOperationsIntegrated.useMutation[markShippingCompleteMutation]": async (param)=>{
                let { id, trackingNumber } = param;
                const response = await fetch("/api/shipping/".concat(id), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'shipped',
                        tracking_number: trackingNumber
                    })
                });
                if (!response.ok) throw new Error('Failed to complete shipping');
                return response.json();
            }
        }["useOperationsIntegrated.useMutation[markShippingCompleteMutation]"],
        onSuccess: {
            "useOperationsIntegrated.useMutation[markShippingCompleteMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'operations',
                        'shipping'
                    ]
                });
            }
        }["useOperationsIntegrated.useMutation[markShippingCompleteMutation]"]
    });
    // ============================================================
    // Mutations - Inquiry
    // ============================================================
    const sendInquiryResponseMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useOperationsIntegrated.useMutation[sendInquiryResponseMutation]": async (param)=>{
                let { id, message } = param;
                const response = await fetch("/api/inquiries/".concat(id, "/respond"), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message
                    })
                });
                if (!response.ok) throw new Error('Failed to send response');
                return response.json();
            }
        }["useOperationsIntegrated.useMutation[sendInquiryResponseMutation]"],
        onSuccess: {
            "useOperationsIntegrated.useMutation[sendInquiryResponseMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'operations',
                        'inquiries'
                    ]
                });
            }
        }["useOperationsIntegrated.useMutation[sendInquiryResponseMutation]"]
    });
    const markInquiryResolvedMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useOperationsIntegrated.useMutation[markInquiryResolvedMutation]": async (id)=>{
                const response = await fetch("/api/inquiries/".concat(id), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'resolved'
                    })
                });
                if (!response.ok) throw new Error('Failed to resolve inquiry');
                return response.json();
            }
        }["useOperationsIntegrated.useMutation[markInquiryResolvedMutation]"],
        onSuccess: {
            "useOperationsIntegrated.useMutation[markInquiryResolvedMutation]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: [
                        'operations',
                        'inquiries'
                    ]
                });
            }
        }["useOperationsIntegrated.useMutation[markInquiryResolvedMutation]"]
    });
    // ============================================================
    // 選択されたアイテム
    // ============================================================
    const selectedOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useOperationsIntegrated.useMemo[selectedOrder]": ()=>{
            if (!selectedOrderId || !ordersQuery.data) return null;
            return ordersQuery.data.orders.find({
                "useOperationsIntegrated.useMemo[selectedOrder]": (o)=>o.id === selectedOrderId
            }["useOperationsIntegrated.useMemo[selectedOrder]"]) || null;
        }
    }["useOperationsIntegrated.useMemo[selectedOrder]"], [
        selectedOrderId,
        ordersQuery.data
    ]);
    const selectedShipping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useOperationsIntegrated.useMemo[selectedShipping]": ()=>{
            if (!selectedShippingId || !shippingQuery.data) return null;
            return shippingQuery.data.items.find({
                "useOperationsIntegrated.useMemo[selectedShipping]": (s)=>s.id === selectedShippingId
            }["useOperationsIntegrated.useMemo[selectedShipping]"]) || null;
        }
    }["useOperationsIntegrated.useMemo[selectedShipping]"], [
        selectedShippingId,
        shippingQuery.data
    ]);
    const selectedInquiry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useOperationsIntegrated.useMemo[selectedInquiry]": ()=>{
            if (!selectedInquiryId || !inquiriesQuery.data) return null;
            return inquiriesQuery.data.inquiries.find({
                "useOperationsIntegrated.useMemo[selectedInquiry]": (i)=>i.id === selectedInquiryId
            }["useOperationsIntegrated.useMemo[selectedInquiry]"]) || null;
        }
    }["useOperationsIntegrated.useMemo[selectedInquiry]"], [
        selectedInquiryId,
        inquiriesQuery.data
    ]);
    // ============================================================
    // 統合統計
    // ============================================================
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useOperationsIntegrated.useMemo[stats]": ()=>{
            var _ordersQuery_data, _shippingQuery_data, _inquiriesQuery_data;
            return {
                orders: ((_ordersQuery_data = ordersQuery.data) === null || _ordersQuery_data === void 0 ? void 0 : _ordersQuery_data.stats) || {
                    total: 0,
                    new: 0,
                    paid: 0,
                    processing: 0,
                    shipped: 0,
                    delivered: 0,
                    todayDeadline: 0,
                    unpurchased: 0
                },
                shipping: ((_shippingQuery_data = shippingQuery.data) === null || _shippingQuery_data === void 0 ? void 0 : _shippingQuery_data.stats) || {
                    total: 0,
                    pending: 0,
                    picking: 0,
                    packed: 0,
                    shipped: 0,
                    urgent: 0
                },
                inquiries: ((_inquiriesQuery_data = inquiriesQuery.data) === null || _inquiriesQuery_data === void 0 ? void 0 : _inquiriesQuery_data.stats) || {
                    total: 0,
                    unread: 0,
                    aiResponded: 0,
                    pendingManual: 0,
                    completed: 0,
                    critical: 0
                },
                byMarketplace: {}
            };
        }
    }["useOperationsIntegrated.useMemo[stats]"], [
        ordersQuery.data,
        shippingQuery.data,
        inquiriesQuery.data
    ]);
    // ============================================================
    // リフレッシュ
    // ============================================================
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOperationsIntegrated.useCallback[refresh]": ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    'operations'
                ]
            });
        }
    }["useOperationsIntegrated.useCallback[refresh]"], [
        queryClient
    ]);
    // ============================================================
    // 返り値
    // ============================================================
    return {
        // データ
        orders: ((_ordersQuery_data = ordersQuery.data) === null || _ordersQuery_data === void 0 ? void 0 : _ordersQuery_data.orders) || [],
        shippingItems: ((_shippingQuery_data = shippingQuery.data) === null || _shippingQuery_data === void 0 ? void 0 : _shippingQuery_data.items) || [],
        inquiries: ((_inquiriesQuery_data = inquiriesQuery.data) === null || _inquiriesQuery_data === void 0 ? void 0 : _inquiriesQuery_data.inquiries) || [],
        stats,
        // ローディング・エラー
        isLoading: activeTab === 'orders' ? ordersQuery.isLoading : activeTab === 'shipping' ? shippingQuery.isLoading : inquiriesQuery.isLoading,
        error: activeTab === 'orders' ? (_ordersQuery_error = ordersQuery.error) === null || _ordersQuery_error === void 0 ? void 0 : _ordersQuery_error.message : activeTab === 'shipping' ? (_shippingQuery_error = shippingQuery.error) === null || _shippingQuery_error === void 0 ? void 0 : _shippingQuery_error.message : ((_inquiriesQuery_error = inquiriesQuery.error) === null || _inquiriesQuery_error === void 0 ? void 0 : _inquiriesQuery_error.message) || null,
        // ページネーション
        currentPage,
        pageSize,
        totalOrders: ((_ordersQuery_data1 = ordersQuery.data) === null || _ordersQuery_data1 === void 0 ? void 0 : _ordersQuery_data1.total) || 0,
        totalShipping: ((_shippingQuery_data1 = shippingQuery.data) === null || _shippingQuery_data1 === void 0 ? void 0 : _shippingQuery_data1.total) || 0,
        totalInquiries: ((_inquiriesQuery_data1 = inquiriesQuery.data) === null || _inquiriesQuery_data1 === void 0 ? void 0 : _inquiriesQuery_data1.total) || 0,
        // UI状態
        activeTab,
        filters,
        sortField,
        sortOrder,
        showStats,
        showLinkedPanel,
        // 選択
        selectedOrderId,
        selectedShippingId,
        selectedInquiryId,
        selectedOrder,
        selectedShipping,
        selectedInquiry,
        selectedIds,
        // UIアクション
        setActiveTab: store.setActiveTab,
        setPage: store.setPage,
        setPageSize: store.setPageSize,
        setFilters: store.setFilters,
        updateFilter: store.updateFilter,
        clearFilters: store.clearFilters,
        setSort: store.setSort,
        selectOrder: store.selectOrder,
        selectShipping: store.selectShipping,
        selectInquiry: store.selectInquiry,
        selectItem: store.selectItem,
        selectItems: store.selectItems,
        clearSelection: store.clearSelection,
        toggleStats: store.toggleStats,
        toggleLinkedPanel: store.toggleLinkedPanel,
        // データ操作
        updateOrder: (id, updates)=>updateOrderMutation.mutateAsync({
                id,
                updates
            }),
        markOrderShipped: (id)=>markOrderShippedMutation.mutateAsync(id),
        updateShipping: (id, updates)=>updateShippingMutation.mutateAsync({
                id,
                updates
            }),
        markShippingComplete: (id, trackingNumber)=>markShippingCompleteMutation.mutateAsync({
                id,
                trackingNumber
            }),
        sendInquiryResponse: (id, message)=>sendInquiryResponseMutation.mutateAsync({
                id,
                message
            }),
        markInquiryResolved: (id)=>markInquiryResolvedMutation.mutateAsync(id),
        // リフレッシュ
        refresh,
        // ミューテーション状態
        isUpdating: updateOrderMutation.isPending || updateShippingMutation.isPending || sendInquiryResponseMutation.isPending
    };
}
_s(useOperationsIntegrated, "cAkYaXk0Pf/M1PaoScFOv71601Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsActiveTab"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsCurrentPage"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsPageSize"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsFilters"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsSortField"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsSortOrder"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsSelectedOrderId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsSelectedShippingId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsSelectedInquiryId"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsSelectedIds"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsShowStats"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsShowLinkedPanel"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
const __TURBOPACK__default__export__ = useOperationsIntegrated;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/hooks/use-linked-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/hooks/use-linked-data.ts
/**
 * useLinkedData - 連動データ取得フック
 * 商品情報、在庫状況、顧客情報、履歴などを取得
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useLinkedData",
    ()=>useLinkedData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useLinkedData() {
    _s();
    // 商品
    const [product, setProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoadingProduct, setIsLoadingProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 在庫
    const [inventory, setInventory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [movements, setMovements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingInventory, setIsLoadingInventory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 顧客
    const [customer, setCustomer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [orderHistory, setOrderHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingCustomer, setIsLoadingCustomer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 履歴
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingHistory, setIsLoadingHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasMoreHistory, setHasMoreHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [historyOffset, setHistoryOffset] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [currentReferenceId, setCurrentReferenceId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // メッセージ
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [templates, setTemplates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingMessages, setIsLoadingMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // エラー
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const clearError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLinkedData.useCallback[clearError]": ()=>setError(null)
    }["useLinkedData.useCallback[clearError]"], []);
    // 商品情報取得
    const fetchProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLinkedData.useCallback[fetchProduct]": async (sku)=>{
            setIsLoadingProduct(true);
            setError(null);
            try {
                const response = await fetch("/api/products/by-sku/".concat(encodeURIComponent(sku)));
                const result = await response.json();
                if (result.success && result.data) {
                    const p = result.data;
                    setProduct({
                        id: p.id,
                        sku: p.sku,
                        title: p.title,
                        imageUrl: p.image_url,
                        productType: p.product_type || 'stock',
                        condition: p.condition,
                        asin: p.asin,
                        ebayItemId: p.ebay_item_id,
                        sellingPrice: p.selling_price,
                        purchaseCost: p.purchase_cost,
                        estimatedProfit: p.estimated_profit,
                        currentStock: p.current_stock,
                        totalSold: p.total_sold,
                        listedMarketplaces: p.listed_marketplaces,
                        purchaseUrl: p.purchase_url,
                        listingUrl: p.listing_url
                    });
                } else {
                    setProduct(null);
                }
            } catch (err) {
                setError(err.message || '商品情報の取得に失敗しました');
                setProduct(null);
            } finally{
                setIsLoadingProduct(false);
            }
        }
    }["useLinkedData.useCallback[fetchProduct]"], []);
    // 在庫情報取得
    const fetchInventory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLinkedData.useCallback[fetchInventory]": async (sku)=>{
            setIsLoadingInventory(true);
            setError(null);
            try {
                const response = await fetch("/api/inventory/by-sku/".concat(encodeURIComponent(sku)));
                const result = await response.json();
                if (result.success && result.data) {
                    const inv = result.data.inventory;
                    const moves = result.data.movements || [];
                    setInventory({
                        productId: inv.product_id,
                        sku: inv.sku,
                        currentStock: inv.current_stock || 0,
                        physicalStock: inv.physical_stock,
                        reservedStock: inv.reserved_stock,
                        availableStock: inv.available_stock,
                        incomingStock: inv.incoming_stock,
                        reorderPoint: inv.reorder_point,
                        location: inv.location,
                        salesToday: inv.sales_today,
                        salesWeek: inv.sales_week,
                        salesMonth: inv.sales_month,
                        averageDailySales: inv.average_daily_sales
                    });
                    setMovements(moves.map({
                        "useLinkedData.useCallback[fetchInventory]": (m)=>({
                                id: m.id,
                                type: m.movement_type,
                                quantityBefore: m.quantity_before,
                                quantityAfter: m.quantity_after,
                                quantityChange: m.quantity_change,
                                source: m.source,
                                createdAt: m.created_at
                            })
                    }["useLinkedData.useCallback[fetchInventory]"]));
                } else {
                    setInventory(null);
                    setMovements([]);
                }
            } catch (err) {
                setError(err.message || '在庫情報の取得に失敗しました');
                setInventory(null);
                setMovements([]);
            } finally{
                setIsLoadingInventory(false);
            }
        }
    }["useLinkedData.useCallback[fetchInventory]"], []);
    // 顧客情報取得
    const fetchCustomer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLinkedData.useCallback[fetchCustomer]": async (customerId)=>{
            setIsLoadingCustomer(true);
            setError(null);
            try {
                const response = await fetch("/api/customers/".concat(encodeURIComponent(customerId)));
                const result = await response.json();
                if (result.success && result.data) {
                    const c = result.data.customer;
                    const orders = result.data.orders || [];
                    setCustomer({
                        id: c.id,
                        customerId: c.customer_id,
                        name: c.name,
                        email: c.email,
                        phone: c.phone,
                        address: c.address,
                        country: c.country,
                        marketplace: c.marketplace,
                        status: c.status,
                        totalOrders: c.total_orders,
                        totalSpent: c.total_spent,
                        totalInquiries: c.total_inquiries,
                        averageOrderValue: c.average_order_value,
                        firstOrderDate: c.first_order_date,
                        lastOrderDate: c.last_order_date,
                        notes: c.notes
                    });
                    setOrderHistory(orders.map({
                        "useLinkedData.useCallback[fetchCustomer]": (o)=>({
                                orderId: o.order_id,
                                orderDate: o.order_date,
                                totalAmount: o.total_amount,
                                status: o.status,
                                itemCount: o.item_count
                            })
                    }["useLinkedData.useCallback[fetchCustomer]"]));
                } else {
                    setCustomer(null);
                    setOrderHistory([]);
                }
            } catch (err) {
                setError(err.message || '顧客情報の取得に失敗しました');
                setCustomer(null);
                setOrderHistory([]);
            } finally{
                setIsLoadingCustomer(false);
            }
        }
    }["useLinkedData.useCallback[fetchCustomer]"], []);
    // 履歴取得
    const fetchHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLinkedData.useCallback[fetchHistory]": async (referenceId, type)=>{
            setIsLoadingHistory(true);
            setError(null);
            setCurrentReferenceId(referenceId);
            setHistoryOffset(0);
            try {
                const params = new URLSearchParams({
                    reference_id: referenceId
                });
                if (type) params.set('type', type);
                params.set('limit', '20');
                params.set('offset', '0');
                const response = await fetch("/api/history?".concat(params.toString()));
                const result = await response.json();
                if (result.success && result.data) {
                    setHistory(result.data.items.map({
                        "useLinkedData.useCallback[fetchHistory]": (h)=>({
                                id: h.id,
                                type: h.type,
                                title: h.title,
                                description: h.description,
                                timestamp: h.timestamp,
                                actor: h.actor,
                                relatedId: h.related_id,
                                statusIcon: h.status_icon,
                                details: h.details
                            })
                    }["useLinkedData.useCallback[fetchHistory]"]));
                    setHasMoreHistory(result.data.has_more || false);
                    setHistoryOffset(result.data.items.length);
                } else {
                    setHistory([]);
                    setHasMoreHistory(false);
                }
            } catch (err) {
                setError(err.message || '履歴の取得に失敗しました');
                setHistory([]);
                setHasMoreHistory(false);
            } finally{
                setIsLoadingHistory(false);
            }
        }
    }["useLinkedData.useCallback[fetchHistory]"], []);
    // 履歴追加読み込み
    const loadMoreHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLinkedData.useCallback[loadMoreHistory]": async ()=>{
            if (!currentReferenceId || isLoadingHistory || !hasMoreHistory) return;
            setIsLoadingHistory(true);
            try {
                const params = new URLSearchParams({
                    reference_id: currentReferenceId,
                    limit: '20',
                    offset: String(historyOffset)
                });
                const response = await fetch("/api/history?".concat(params.toString()));
                const result = await response.json();
                if (result.success && result.data) {
                    const newItems = result.data.items.map({
                        "useLinkedData.useCallback[loadMoreHistory].newItems": (h)=>({
                                id: h.id,
                                type: h.type,
                                title: h.title,
                                description: h.description,
                                timestamp: h.timestamp,
                                actor: h.actor,
                                relatedId: h.related_id,
                                statusIcon: h.status_icon,
                                details: h.details
                            })
                    }["useLinkedData.useCallback[loadMoreHistory].newItems"]);
                    setHistory({
                        "useLinkedData.useCallback[loadMoreHistory]": (prev)=>[
                                ...prev,
                                ...newItems
                            ]
                    }["useLinkedData.useCallback[loadMoreHistory]"]);
                    setHasMoreHistory(result.data.has_more || false);
                    setHistoryOffset({
                        "useLinkedData.useCallback[loadMoreHistory]": (prev)=>prev + newItems.length
                    }["useLinkedData.useCallback[loadMoreHistory]"]);
                }
            } catch (err) {
                setError(err.message || '履歴の取得に失敗しました');
            } finally{
                setIsLoadingHistory(false);
            }
        }
    }["useLinkedData.useCallback[loadMoreHistory]"], [
        currentReferenceId,
        isLoadingHistory,
        hasMoreHistory,
        historyOffset
    ]);
    // メッセージ取得
    const fetchMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLinkedData.useCallback[fetchMessages]": async (inquiryId)=>{
            setIsLoadingMessages(true);
            setError(null);
            try {
                const response = await fetch("/api/inquiries/".concat(inquiryId, "/messages"));
                const result = await response.json();
                if (result.success && result.data) {
                    setMessages(result.data.map({
                        "useLinkedData.useCallback[fetchMessages]": (m)=>({
                                id: m.id,
                                inquiryId: m.inquiry_id,
                                sender: m.sender,
                                content: m.content,
                                sentAt: m.sent_at,
                                isAIGenerated: m.is_ai_generated
                            })
                    }["useLinkedData.useCallback[fetchMessages]"]));
                } else {
                    setMessages([]);
                }
            } catch (err) {
                setError(err.message || 'メッセージの取得に失敗しました');
                setMessages([]);
            } finally{
                setIsLoadingMessages(false);
            }
        }
    }["useLinkedData.useCallback[fetchMessages]"], []);
    // テンプレート取得
    const fetchTemplates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLinkedData.useCallback[fetchTemplates]": async (category)=>{
            try {
                const params = new URLSearchParams();
                if (category) params.set('category', category);
                const response = await fetch("/api/inquiry/templates?".concat(params.toString()));
                const result = await response.json();
                if (result.success && result.data) {
                    setTemplates(result.data.map({
                        "useLinkedData.useCallback[fetchTemplates]": (t)=>({
                                id: t.id,
                                name: t.name,
                                content: t.content,
                                category: t.category,
                                usageCount: t.usage_count
                            })
                    }["useLinkedData.useCallback[fetchTemplates]"]));
                } else {
                    setTemplates([]);
                }
            } catch (err) {
                console.error('Templates fetch error:', err);
                setTemplates([]);
            }
        }
    }["useLinkedData.useCallback[fetchTemplates]"], []);
    return {
        // 商品
        product,
        isLoadingProduct,
        fetchProduct,
        // 在庫
        inventory,
        movements,
        isLoadingInventory,
        fetchInventory,
        // 顧客
        customer,
        orderHistory,
        isLoadingCustomer,
        fetchCustomer,
        // 履歴
        history,
        isLoadingHistory,
        hasMoreHistory,
        fetchHistory,
        loadMoreHistory,
        // メッセージ
        messages,
        templates,
        isLoadingMessages,
        fetchMessages,
        fetchTemplates,
        // エラー
        error,
        clearError
    };
}
_s(useLinkedData, "n7Dw4IsyDLQKOqHiqHHdJvJ4rQs=");
const __TURBOPACK__default__export__ = useLinkedData;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx
/**
 * OrdersToolPanel - 受注ツールパネル (Container)
 */ __turbopack_context__.s([
    "OrdersToolPanel",
    ()=>OrdersToolPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/n3-stats-bar.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
const OrdersToolPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function OrdersToolPanel(param) {
    let { stats, loading = false, selectedCount, onRefresh, onProcessSelected, onMarkShipped, onExportCSV } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '12px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3StatsBar"], {
                stats: [
                    {
                        label: '総件数',
                        value: stats.total,
                        color: 'default'
                    },
                    {
                        label: '新規',
                        value: stats.new,
                        color: 'default'
                    },
                    {
                        label: '支払済',
                        value: stats.paid,
                        color: 'blue'
                    },
                    {
                        label: '処理中',
                        value: stats.processing,
                        color: 'yellow'
                    },
                    {
                        label: '出荷済',
                        value: stats.shipped,
                        color: 'green'
                    },
                    {
                        label: '本日期限',
                        value: stats.todayDeadline,
                        color: 'yellow'
                    },
                    {
                        label: '未仕入',
                        value: stats.unpurchased,
                        color: 'red'
                    }
                ],
                size: "compact",
                gap: 8
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '12px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: onRefresh,
                        disabled: loading,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                size: 14,
                                className: loading ? 'animate-spin' : ''
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            "更新"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '1px',
                            height: '20px',
                            background: 'var(--panel-border)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "primary",
                        size: "sm",
                        onClick: onProcessSelected,
                        disabled: selectedCount === 0,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this),
                            "仕入処理 ",
                            selectedCount > 0 && "(".concat(selectedCount, ")")
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "success",
                        size: "sm",
                        onClick: onMarkShipped,
                        disabled: selectedCount === 0,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            "出荷完了 ",
                            selectedCount > 0 && "(".concat(selectedCount, ")")
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: 'auto'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: onExportCSV,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            "CSV出力"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            (stats.todayDeadline > 0 || stats.unpurchased > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '6px',
                    fontSize: '12px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        size: 16,
                        style: {
                            color: 'var(--color-warning)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this),
                    stats.todayDeadline > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'var(--color-warning)'
                        },
                        children: [
                            "本日期限: ",
                            stats.todayDeadline,
                            "件"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                        lineNumber: 109,
                        columnNumber: 13
                    }, this),
                    stats.unpurchased > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'var(--color-error)'
                        },
                        children: [
                            "未仕入れ: ",
                            stats.unpurchased,
                            "件"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                        lineNumber: 114,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
                lineNumber: 95,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
});
_c1 = OrdersToolPanel;
const __TURBOPACK__default__export__ = OrdersToolPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "OrdersToolPanel$memo");
__turbopack_context__.k.register(_c1, "OrdersToolPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx
/**
 * ShippingToolPanel - 出荷ツールパネル (Container)
 */ __turbopack_context__.s([
    "ShippingToolPanel",
    ()=>ShippingToolPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/n3-stats-bar.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
const ShippingToolPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function ShippingToolPanel(param) {
    let { stats, loading = false, selectedCount, onRefresh, onPrintLabels, onBulkShip, onOpenExternalService } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '12px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3StatsBar"], {
                stats: [
                    {
                        label: '総件数',
                        value: stats.total,
                        color: 'default'
                    },
                    {
                        label: '出荷待ち',
                        value: stats.pending,
                        color: 'default'
                    },
                    {
                        label: 'ピッキング',
                        value: stats.picking,
                        color: 'yellow'
                    },
                    {
                        label: '梱包完了',
                        value: stats.packed,
                        color: 'blue'
                    },
                    {
                        label: '出荷済',
                        value: stats.shipped,
                        color: 'green'
                    },
                    {
                        label: '緊急',
                        value: stats.urgent,
                        color: 'red'
                    }
                ],
                size: "compact",
                gap: 8
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '12px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: onRefresh,
                        disabled: loading,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                size: 14,
                                className: loading ? 'animate-spin' : ''
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this),
                            "更新"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '1px',
                            height: '20px',
                            background: 'var(--panel-border)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: onPrintLabels,
                        disabled: selectedCount === 0,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            "ラベル印刷 ",
                            selectedCount > 0 && "(".concat(selectedCount, ")")
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "success",
                        size: "sm",
                        onClick: onBulkShip,
                        disabled: selectedCount === 0,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this),
                            "一括出荷 ",
                            selectedCount > 0 && "(".concat(selectedCount, ")")
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '1px',
                            height: '20px',
                            background: 'var(--panel-border)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    marginRight: '4px'
                                },
                                children: "伝票発行:"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onOpenExternalService('eloi'),
                                style: {
                                    padding: '4px 8px',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    background: '#1a73e8',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                },
                                children: "eLoi"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onOpenExternalService('cpas'),
                                style: {
                                    padding: '4px 8px',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    background: '#ff6b00',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                },
                                children: "Cpas"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onOpenExternalService('japanpost'),
                                style: {
                                    padding: '4px 8px',
                                    fontSize: '10px',
                                    fontWeight: 500,
                                    background: '#cc0000',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                },
                                children: "日本郵便"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            stats.urgent > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: 'rgba(220, 38, 38, 0.1)',
                    borderRadius: '6px',
                    fontSize: '12px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        size: 16,
                        style: {
                            color: 'var(--color-error)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                        lineNumber: 153,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'var(--color-error)',
                            fontWeight: 500
                        },
                        children: [
                            "緊急対応が必要な出荷が ",
                            stats.urgent,
                            "件 あります"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
                lineNumber: 141,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
});
_c1 = ShippingToolPanel;
const __TURBOPACK__default__export__ = ShippingToolPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "ShippingToolPanel$memo");
__turbopack_context__.k.register(_c1, "ShippingToolPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx
/**
 * InquiryToolPanel - 問い合わせツールパネル (Container)
 */ __turbopack_context__.s([
    "InquiryToolPanel",
    ()=>InquiryToolPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/n3-stats-bar.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
const InquiryToolPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function InquiryToolPanel(param) {
    let { stats, loading = false, selectedCount, onRefresh, onBulkApproveAI, onOpenTemplates, onGenerateDrafts } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '12px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$stats$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3StatsBar"], {
                stats: [
                    {
                        label: '総件数',
                        value: stats.total,
                        color: 'default'
                    },
                    {
                        label: '未読',
                        value: stats.unread,
                        color: 'default'
                    },
                    {
                        label: 'AI対応済',
                        value: stats.aiResponded,
                        color: 'blue'
                    },
                    {
                        label: '手動待ち',
                        value: stats.pendingManual,
                        color: 'yellow'
                    },
                    {
                        label: '完了',
                        value: stats.completed,
                        color: 'green'
                    },
                    {
                        label: '緊急',
                        value: stats.critical,
                        color: 'red'
                    }
                ],
                size: "compact",
                gap: 8
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '12px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: onRefresh,
                        disabled: loading,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                size: 14,
                                className: loading ? 'animate-spin' : ''
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this),
                            "更新"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '1px',
                            height: '20px',
                            background: 'var(--panel-border)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "primary",
                        size: "sm",
                        onClick: onGenerateDrafts,
                        disabled: stats.unread === 0,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            "AI回答生成"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "success",
                        size: "sm",
                        onClick: onBulkApproveAI,
                        disabled: stats.aiResponded === 0,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this),
                            "AI提案を一括承認 ",
                            stats.aiResponded > 0 && "(".concat(stats.aiResponded, ")")
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '1px',
                            height: '20px',
                            background: 'var(--panel-border)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: onOpenTemplates,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this),
                            "テンプレート管理"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            (stats.critical > 0 || stats.pendingManual > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: stats.critical > 0 ? 'rgba(220, 38, 38, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '6px',
                    fontSize: '12px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                        size: 16,
                        style: {
                            color: stats.critical > 0 ? 'var(--color-error)' : 'var(--color-warning)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this),
                    stats.critical > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'var(--color-error)',
                            fontWeight: 500
                        },
                        children: [
                            "緊急対応: ",
                            stats.critical,
                            "件"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                        lineNumber: 108,
                        columnNumber: 13
                    }, this),
                    stats.pendingManual > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            color: 'var(--color-warning)'
                        },
                        children: [
                            "手動対応待ち: ",
                            stats.pendingManual,
                            "件"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                        lineNumber: 113,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
                lineNumber: 94,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
});
_c1 = InquiryToolPanel;
const __TURBOPACK__default__export__ = InquiryToolPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "InquiryToolPanel$memo");
__turbopack_context__.k.register(_c1, "InquiryToolPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/l3-tabs/index.ts
/**
 * Operations N3 - L3 Tab Tool Panels (Container)
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$l3$2d$tabs$2f$orders$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$l3$2d$tabs$2f$shipping$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$l3$2d$tabs$2f$inquiry$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/cards/operations-badges.tsx
/**
 * Operations N3 - ステータスバッジ (Presentational)
 * React.memo + 外部マージン禁止
 */ __turbopack_context__.s([
    "DeadlineDisplay",
    ()=>DeadlineDisplay,
    "InquiryStatusBadge",
    ()=>InquiryStatusBadge,
    "MarketplaceBadge",
    ()=>MarketplaceBadge,
    "OrderStatusBadge",
    ()=>OrderStatusBadge,
    "PriorityBadge",
    ()=>PriorityBadge,
    "ProfitDisplay",
    ()=>ProfitDisplay,
    "ShippingStatusBadge",
    ()=>ShippingStatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
// ============================================================
// OrderStatusBadge - 注文ステータス
// ============================================================
const ORDER_STATUS_CONFIG = {
    new: {
        label: '新規',
        color: 'var(--text)',
        bg: 'var(--highlight)'
    },
    paid: {
        label: '支払済',
        color: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.1)'
    },
    processing: {
        label: '処理中',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)'
    },
    shipped: {
        label: '出荷済',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)'
    },
    delivered: {
        label: '配送完了',
        color: '#8b5cf6',
        bg: 'rgba(139, 92, 246, 0.1)'
    },
    cancelled: {
        label: 'キャンセル',
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.1)'
    }
};
const OrderStatusBadge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function OrderStatusBadge(param) {
    let { status, size = 'sm' } = param;
    const config = ORDER_STATUS_CONFIG[status];
    const fontSize = size === 'sm' ? '10px' : '11px';
    const padding = size === 'sm' ? '2px 6px' : '3px 8px';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            padding,
            fontSize,
            fontWeight: 500,
            color: config.color,
            background: config.bg,
            borderRadius: '4px',
            whiteSpace: 'nowrap'
        },
        children: config.label
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
});
_c1 = OrderStatusBadge;
// ============================================================
// ShippingStatusBadge - 出荷ステータス
// ============================================================
const SHIPPING_STATUS_CONFIG = {
    pending: {
        label: '出荷待ち',
        color: '#6b7280',
        bg: 'rgba(107, 114, 128, 0.1)'
    },
    picking: {
        label: 'ピッキング',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)'
    },
    packed: {
        label: '梱包完了',
        color: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.1)'
    },
    shipped: {
        label: '出荷済',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)'
    },
    delivered: {
        label: '配送完了',
        color: '#8b5cf6',
        bg: 'rgba(139, 92, 246, 0.1)'
    }
};
const ShippingStatusBadge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c2 = function ShippingStatusBadge(param) {
    let { status, size = 'sm' } = param;
    const config = SHIPPING_STATUS_CONFIG[status];
    const fontSize = size === 'sm' ? '10px' : '11px';
    const padding = size === 'sm' ? '2px 6px' : '3px 8px';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            padding,
            fontSize,
            fontWeight: 500,
            color: config.color,
            background: config.bg,
            borderRadius: '4px',
            whiteSpace: 'nowrap'
        },
        children: config.label
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
});
_c3 = ShippingStatusBadge;
// ============================================================
// InquiryStatusBadge - 問い合わせステータス
// ============================================================
const INQUIRY_STATUS_CONFIG = {
    unread: {
        label: '未読',
        color: '#6b7280',
        bg: 'rgba(107, 114, 128, 0.1)'
    },
    ai_responded: {
        label: 'AI対応済',
        color: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.1)'
    },
    pending_manual: {
        label: '手動対応待ち',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)'
    },
    completed: {
        label: '完了',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)'
    }
};
const InquiryStatusBadge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c4 = function InquiryStatusBadge(param) {
    let { status, size = 'sm' } = param;
    const config = INQUIRY_STATUS_CONFIG[status];
    const fontSize = size === 'sm' ? '10px' : '11px';
    const padding = size === 'sm' ? '2px 6px' : '3px 8px';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            padding,
            fontSize,
            fontWeight: 500,
            color: config.color,
            background: config.bg,
            borderRadius: '4px',
            whiteSpace: 'nowrap'
        },
        children: config.label
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
});
_c5 = InquiryStatusBadge;
// ============================================================
// PriorityBadge - 優先度
// ============================================================
const PRIORITY_CONFIG = {
    critical: {
        label: '緊急',
        color: '#dc2626',
        bg: 'rgba(220, 38, 38, 0.1)',
        icon: '🔴'
    },
    high: {
        label: '高',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)',
        icon: '🟠'
    },
    medium: {
        label: '中',
        color: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.1)',
        icon: '🔵'
    },
    low: {
        label: '低',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.1)',
        icon: '🟢'
    }
};
const PriorityBadge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c6 = function PriorityBadge(param) {
    let { priority, showIcon = true, size = 'sm' } = param;
    const config = PRIORITY_CONFIG[priority];
    const fontSize = size === 'sm' ? '10px' : '11px';
    const padding = size === 'sm' ? '2px 6px' : '3px 8px';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding,
            fontSize,
            fontWeight: 500,
            color: config.color,
            background: config.bg,
            borderRadius: '4px',
            whiteSpace: 'nowrap'
        },
        children: [
            showIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: '8px'
                },
                children: config.icon
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx",
                lineNumber: 185,
                columnNumber: 20
            }, this),
            config.label
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, this);
});
_c7 = PriorityBadge;
// ============================================================
// MarketplaceBadge - モール
// ============================================================
const MARKETPLACE_CONFIG = {
    ebay: {
        label: 'eBay',
        color: '#0064d2',
        bg: 'rgba(0, 100, 210, 0.1)'
    },
    amazon: {
        label: 'Amazon',
        color: '#ff9900',
        bg: 'rgba(255, 153, 0, 0.1)'
    },
    mercari: {
        label: 'メルカリ',
        color: '#ff0211',
        bg: 'rgba(255, 2, 17, 0.1)'
    },
    yahoo: {
        label: 'Yahoo',
        color: '#ff0033',
        bg: 'rgba(255, 0, 51, 0.1)'
    },
    rakuten: {
        label: '楽天',
        color: '#bf0000',
        bg: 'rgba(191, 0, 0, 0.1)'
    },
    shopee: {
        label: 'Shopee',
        color: '#ee4d2d',
        bg: 'rgba(238, 77, 45, 0.1)'
    },
    qoo10: {
        label: 'Qoo10',
        color: '#e4002b',
        bg: 'rgba(228, 0, 43, 0.1)'
    }
};
const MarketplaceBadge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c8 = function MarketplaceBadge(param) {
    let { marketplace, size = 'sm' } = param;
    const config = MARKETPLACE_CONFIG[marketplace];
    const fontSize = size === 'sm' ? '10px' : '11px';
    const padding = size === 'sm' ? '2px 6px' : '3px 8px';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            padding,
            fontSize,
            fontWeight: 600,
            color: config.color,
            background: config.bg,
            borderRadius: '4px',
            whiteSpace: 'nowrap'
        },
        children: config.label
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx",
        lineNumber: 219,
        columnNumber: 5
    }, this);
});
_c9 = MarketplaceBadge;
const DeadlineDisplay = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c10 = function DeadlineDisplay(param) {
    let { deadline, size = 'sm' } = param;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    let label;
    let color;
    let bg;
    if (diffMs < 0) {
        label = '期限超過';
        color = '#dc2626';
        bg = 'rgba(220, 38, 38, 0.1)';
    } else if (diffHours < 24) {
        label = "".concat(diffHours, "時間");
        color = '#dc2626';
        bg = 'rgba(220, 38, 38, 0.1)';
    } else if (diffDays <= 3) {
        label = "".concat(diffDays, "日");
        color = '#f59e0b';
        bg = 'rgba(245, 158, 11, 0.1)';
    } else {
        label = "".concat(diffDays, "日");
        color = '#10b981';
        bg = 'rgba(16, 185, 129, 0.1)';
    }
    const fontSize = size === 'sm' ? '10px' : '11px';
    const padding = size === 'sm' ? '2px 6px' : '3px 8px';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding,
            fontSize,
            fontWeight: 500,
            color,
            background: bg,
            borderRadius: '4px',
            whiteSpace: 'nowrap'
        },
        children: [
            "⏰ ",
            label
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx",
        lineNumber: 282,
        columnNumber: 5
    }, this);
});
_c11 = DeadlineDisplay;
const ProfitDisplay = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c12 = function ProfitDisplay(param) {
    let { amount, currency = '¥', isConfirmed = false, size = 'sm' } = param;
    const color = amount >= 0 ? 'var(--color-success)' : 'var(--color-error)';
    const fontSize = size === 'sm' ? '12px' : '14px';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        style: {
            fontFamily: 'monospace',
            fontSize,
            fontWeight: 600,
            color
        },
        children: [
            currency,
            amount.toLocaleString(),
            isConfirmed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    marginLeft: '4px',
                    fontSize: '10px',
                    color: 'var(--color-success)'
                },
                children: "✓"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx",
                lineNumber: 332,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx",
        lineNumber: 322,
        columnNumber: 5
    }, this);
});
_c13 = ProfitDisplay;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13;
__turbopack_context__.k.register(_c, "OrderStatusBadge$memo");
__turbopack_context__.k.register(_c1, "OrderStatusBadge");
__turbopack_context__.k.register(_c2, "ShippingStatusBadge$memo");
__turbopack_context__.k.register(_c3, "ShippingStatusBadge");
__turbopack_context__.k.register(_c4, "InquiryStatusBadge$memo");
__turbopack_context__.k.register(_c5, "InquiryStatusBadge");
__turbopack_context__.k.register(_c6, "PriorityBadge$memo");
__turbopack_context__.k.register(_c7, "PriorityBadge");
__turbopack_context__.k.register(_c8, "MarketplaceBadge$memo");
__turbopack_context__.k.register(_c9, "MarketplaceBadge");
__turbopack_context__.k.register(_c10, "DeadlineDisplay$memo");
__turbopack_context__.k.register(_c11, "DeadlineDisplay");
__turbopack_context__.k.register(_c12, "ProfitDisplay$memo");
__turbopack_context__.k.register(_c13, "ProfitDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/cards/order-card.tsx
/**
 * OrderCard - 注文カード (Presentational)
 * React.memo + 外部マージン禁止
 */ __turbopack_context__.s([
    "OrderCard",
    ()=>OrderCard,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
const OrderCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function OrderCard(param) {
    let { order, selected = false, onSelect, onClick, onOpenLinkedData } = param;
    const mainItem = order.items[0];
    const itemCount = order.items.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: selected ? 'rgba(59, 130, 246, 0.05)' : 'var(--panel)',
            border: "1px solid ".concat(selected ? 'var(--color-primary)' : 'var(--panel-border)'),
            borderRadius: '8px',
            padding: '12px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
        },
        onClick: ()=>onClick === null || onClick === void 0 ? void 0 : onClick(order),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                },
                children: [
                    onSelect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Checkbox"], {
                        checked: selected,
                        onChange: ()=>onSelect(order.id),
                        onClick: (e)=>e.stopPropagation()
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                        lineNumber: 53,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceBadge"], {
                        marketplace: order.marketplace
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            fontFamily: 'monospace'
                        },
                        children: order.orderId
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: 'auto',
                            display: 'flex',
                            gap: '4px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeadlineDisplay"], {
                                deadline: order.shippingDeadline
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                lineNumber: 64,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrderStatusBadge"], {
                                status: order.orderStatus
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '8px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '48px',
                            height: '48px',
                            borderRadius: '6px',
                            background: 'var(--highlight)',
                            overflow: 'hidden',
                            flexShrink: 0
                        },
                        children: (mainItem === null || mainItem === void 0 ? void 0 : mainItem.imageUrl) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: mainItem.imageUrl,
                            alt: "",
                            style: {
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                            lineNumber: 82,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                size: 20,
                                style: {
                                    color: 'var(--text-muted)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                lineNumber: 89,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                            lineNumber: 88,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            minWidth: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: 'var(--text)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                },
                                children: (mainItem === null || mainItem === void 0 ? void 0 : mainItem.title) || '商品情報なし'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    marginTop: '2px'
                                },
                                children: [
                                    (mainItem === null || mainItem === void 0 ? void 0 : mainItem.sku) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "SKU: ",
                                            mainItem.sku
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                        lineNumber: 107,
                                        columnNumber: 31
                                    }, this),
                                    itemCount > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            marginLeft: '8px'
                                        },
                                        children: [
                                            "他",
                                            itemCount - 1,
                                            "点"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                        lineNumber: 108,
                                        columnNumber: 31
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    marginTop: '2px'
                                },
                                children: [
                                    "顧客: ",
                                    order.customerName,
                                    " • ",
                                    order.destinationCountry
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--panel-border)'
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
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "売上"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                        lineNumber: 128,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            fontFamily: 'monospace'
                                        },
                                        children: [
                                            order.currency,
                                            order.totalAmount.toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                        lineNumber: 129,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: order.isProfitConfirmed ? '確定利益' : '見込利益'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                        lineNumber: 134,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProfitDisplay"], {
                                        amount: order.isProfitConfirmed ? order.confirmedProfit || 0 : order.estimatedProfit,
                                        isConfirmed: order.isProfitConfirmed
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                        lineNumber: 137,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                lineNumber: 133,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        },
                        children: [
                            order.inquiryCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px',
                                    color: 'var(--color-warning)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this),
                                    order.inquiryCount
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this),
                            onOpenLinkedData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onOpenLinkedData(order);
                                },
                                style: {
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '4px',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                },
                                title: "連動データを表示",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                    lineNumber: 177,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                                lineNumber: 160,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
});
_c1 = OrderCard;
const __TURBOPACK__default__export__ = OrderCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "OrderCard$memo");
__turbopack_context__.k.register(_c1, "OrderCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/cards/shipping-card.tsx
/**
 * ShippingCard - 出荷カード (Presentational)
 * React.memo + 外部マージン禁止
 */ __turbopack_context__.s([
    "ShippingCard",
    ()=>ShippingCard,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
const ShippingCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function ShippingCard(param) {
    let { item, selected = false, onSelect, onClick } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: selected ? 'rgba(59, 130, 246, 0.05)' : 'var(--panel)',
            border: "1px solid ".concat(selected ? 'var(--color-primary)' : 'var(--panel-border)'),
            borderRadius: '8px',
            padding: '12px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
        },
        onClick: ()=>onClick === null || onClick === void 0 ? void 0 : onClick(item),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                },
                children: [
                    onSelect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Checkbox"], {
                        checked: selected,
                        onChange: ()=>onSelect(item.id),
                        onClick: (e)=>e.stopPropagation()
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                        lineNumber: 48,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceBadge"], {
                        marketplace: item.marketplace
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    item.priority === 'critical' || item.priority === 'high' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PriorityBadge"], {
                        priority: item.priority
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: 'auto',
                            display: 'flex',
                            gap: '4px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeadlineDisplay"], {
                                deadline: item.deadline
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShippingStatusBadge"], {
                                status: item.status
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '8px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '48px',
                            height: '48px',
                            borderRadius: '6px',
                            background: 'var(--highlight)',
                            overflow: 'hidden',
                            flexShrink: 0
                        },
                        children: item.imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: item.imageUrl,
                            alt: "",
                            style: {
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                            lineNumber: 77,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                size: 20,
                                style: {
                                    color: 'var(--text-muted)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                                lineNumber: 84,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                            lineNumber: 83,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            minWidth: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: 'var(--text)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                },
                                children: item.productTitle
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    marginTop: '2px'
                                },
                                children: [
                                    "SKU: ",
                                    item.productSku,
                                    " • 数量: ",
                                    item.quantity
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    marginTop: '2px'
                                },
                                children: [
                                    "顧客: ",
                                    item.customerName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--panel-border)'
                },
                children: [
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
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px',
                                    color: 'var(--text-muted)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                                        lineNumber: 122,
                                        columnNumber: 13
                                    }, this),
                                    item.destinationCountry
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this),
                            item.shippingMethod && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px',
                                    color: 'var(--text-muted)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, this),
                                    item.shippingMethod
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    item.trackingNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '10px',
                            color: 'var(--text-muted)',
                            fontFamily: 'monospace'
                        },
                        children: item.trackingNumber
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            (item.packingChecklist || item.shippingChecklist) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: '8px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            height: '4px',
                            background: 'var(--highlight)',
                            borderRadius: '2px',
                            overflow: 'hidden'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                height: '100%',
                                background: 'var(--color-primary)',
                                borderRadius: '2px',
                                width: "".concat(calculateProgress(item), "%"),
                                transition: 'width 0.3s ease'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                            lineNumber: 151,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                        lineNumber: 143,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '10px',
                            color: 'var(--text-muted)',
                            marginTop: '4px',
                            textAlign: 'right'
                        },
                        children: [
                            calculateProgress(item),
                            "% 完了"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
                lineNumber: 142,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
});
_c1 = ShippingCard;
function calculateProgress(item) {
    const packing = item.packingChecklist || [];
    const shipping = item.shippingChecklist || [];
    const total = packing.length + shipping.length;
    if (total === 0) return 0;
    const checked = [
        ...packing,
        ...shipping
    ].filter((c)=>c.checked).length;
    return Math.round(checked / total * 100);
}
const __TURBOPACK__default__export__ = ShippingCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "ShippingCard$memo");
__turbopack_context__.k.register(_c1, "ShippingCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/cards/inquiry-card.tsx
/**
 * InquiryCard - 問い合わせカード (Presentational)
 * React.memo + 外部マージン禁止
 */ __turbopack_context__.s([
    "InquiryCard",
    ()=>InquiryCard,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
const SENTIMENT_CONFIG = {
    positive: {
        icon: '😊',
        color: 'var(--color-success)'
    },
    neutral: {
        icon: '😐',
        color: 'var(--text-muted)'
    },
    negative: {
        icon: '😞',
        color: 'var(--color-error)'
    }
};
const CATEGORY_LABELS = {
    DELIVERY: '配送',
    RETURN: '返品',
    PRODUCT: '商品',
    OTHER: 'その他'
};
const InquiryCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function InquiryCard(param) {
    let { inquiry, selected = false, onSelect, onClick } = param;
    const sentiment = SENTIMENT_CONFIG[inquiry.aiSentiment];
    const categoryLabel = CATEGORY_LABELS[inquiry.aiCategory] || inquiry.aiCategory;
    const timeAgo = getTimeAgo(inquiry.receivedAt);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: selected ? 'rgba(59, 130, 246, 0.05)' : 'var(--panel)',
            border: "1px solid ".concat(selected ? 'var(--color-primary)' : 'var(--panel-border)'),
            borderRadius: '8px',
            padding: '12px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
        },
        onClick: ()=>onClick === null || onClick === void 0 ? void 0 : onClick(inquiry),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                },
                children: [
                    onSelect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Checkbox"], {
                        checked: selected,
                        onChange: ()=>onSelect(inquiry.id),
                        onClick: (e)=>e.stopPropagation()
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PriorityBadge"], {
                        priority: inquiry.aiUrgency
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceBadge"], {
                        marketplace: inquiry.marketplace
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '10px',
                            padding: '2px 6px',
                            background: 'var(--highlight)',
                            borderRadius: '4px',
                            color: 'var(--text-muted)'
                        },
                        children: categoryLabel
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: 'auto'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InquiryStatusBadge"], {
                            status: inquiry.status
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--highlight)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                            size: 16,
                            style: {
                                color: 'var(--text-muted)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: 'var(--text)'
                                },
                                children: inquiry.customerName
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)'
                                },
                                children: inquiry.customerId
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '18px'
                        },
                        title: "感情: ".concat(inquiry.aiSentiment),
                        children: sentiment.icon
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                lineNumber: 90,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: '8px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '13px',
                            fontWeight: 500,
                            color: 'var(--text)',
                            marginBottom: '4px'
                        },
                        children: inquiry.subject
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4
                        },
                        children: inquiry.content
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--panel-border)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            color: 'var(--text-muted)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                size: 12
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            timeAgo
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        },
                        children: [
                            inquiry.aiSuggestedResponse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '10px',
                                    color: 'var(--color-primary)',
                                    padding: '2px 6px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    borderRadius: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                                        lineNumber: 173,
                                        columnNumber: 15
                                    }, this),
                                    "AI提案あり"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this),
                            inquiry.orderId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '10px',
                                    color: 'var(--text-muted)',
                                    fontFamily: 'monospace'
                                },
                                children: [
                                    "注文: ",
                                    inquiry.orderId
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
});
_c1 = InquiryCard;
function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMins < 60) return "".concat(diffMins, "分前");
    if (diffHours < 24) return "".concat(diffHours, "時間前");
    if (diffDays < 7) return "".concat(diffDays, "日前");
    return date.toLocaleDateString('ja-JP');
}
const __TURBOPACK__default__export__ = InquiryCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "InquiryCard$memo");
__turbopack_context__.k.register(_c1, "InquiryCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/cards/index.ts
/**
 * Operations N3 - Card Components (Presentational)
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$order$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$shipping$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$inquiry$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/panels/order-detail-panel.tsx
/**
 * OrderDetailPanel - 受注詳細パネル (Container)
 * 既存のJuchuDetailPanelをN3対応で再構築
 */ __turbopack_context__.s([
    "OrderDetailPanel",
    ()=>OrderDetailPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pen.js [app-client] (ecmascript) <export default as Edit2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-detail-row.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const OrderDetailPanel = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function OrderDetailPanel(param) {
    let { order, onUpdateOrder, onMarkShipped, onOpenInquiry, onOpenLinkedData } = param;
    _s();
    const [isEditing, setIsEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editData, setEditData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        actualPurchaseUrl: '',
        actualPurchaseCostJpy: 0
    });
    const handleStartEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OrderDetailPanel.OrderDetailPanel.useCallback[handleStartEdit]": ()=>{
            if (order) {
                setEditData({
                    actualPurchaseUrl: order.actualPurchaseUrl || order.estimatedPurchaseUrl || '',
                    actualPurchaseCostJpy: order.actualPurchaseCostJpy || 0
                });
                setIsEditing(true);
            }
        }
    }["OrderDetailPanel.OrderDetailPanel.useCallback[handleStartEdit]"], [
        order
    ]);
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OrderDetailPanel.OrderDetailPanel.useCallback[handleSave]": ()=>{
            if (order && onUpdateOrder) {
                onUpdateOrder(order.id, {
                    actualPurchaseUrl: editData.actualPurchaseUrl,
                    actualPurchaseCostJpy: editData.actualPurchaseCostJpy,
                    purchaseStatus: '仕入れ済み'
                });
            }
            setIsEditing(false);
        }
    }["OrderDetailPanel.OrderDetailPanel.useCallback[handleSave]"], [
        order,
        editData,
        onUpdateOrder
    ]);
    const handleCancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OrderDetailPanel.OrderDetailPanel.useCallback[handleCancel]": ()=>{
            setIsEditing(false);
        }
    }["OrderDetailPanel.OrderDetailPanel.useCallback[handleCancel]"], []);
    if (!order) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "注文を選択してください"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
            lineNumber: 83,
            columnNumber: 7
        }, this);
    }
    const mainItem = order.items[0];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '16px',
                    borderBottom: '1px solid var(--panel-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceBadge"], {
                        marketplace: order.marketplace,
                        size: "md"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    fontFamily: 'monospace'
                                },
                                children: order.orderId
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)'
                                },
                                children: new Date(order.orderDate).toLocaleDateString('ja-JP')
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 108,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeadlineDisplay"], {
                        deadline: order.shippingDeadline,
                        size: "md"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrderStatusBadge"], {
                        status: order.orderStatus,
                        size: "md"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflow: 'auto',
                    padding: '16px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px'
                                },
                                children: "商品情報"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 120,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '8px',
                                            background: 'var(--highlight)',
                                            overflow: 'hidden'
                                        },
                                        children: (mainItem === null || mainItem === void 0 ? void 0 : mainItem.imageUrl) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: mainItem.imageUrl,
                                            alt: "",
                                            style: {
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                            lineNumber: 134,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                size: 24,
                                                style: {
                                                    color: 'var(--text-muted)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                lineNumber: 137,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                            lineNumber: 136,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 124,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 500
                                                },
                                                children: mainItem === null || mainItem === void 0 ? void 0 : mainItem.title
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                lineNumber: 142,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '12px',
                                                    color: 'var(--text-muted)',
                                                    marginTop: '4px'
                                                },
                                                children: [
                                                    "SKU: ",
                                                    mainItem === null || mainItem === void 0 ? void 0 : mainItem.sku
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                lineNumber: 143,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '12px',
                                                    color: 'var(--text-muted)'
                                                },
                                                children: [
                                                    "数量: ",
                                                    mainItem === null || mainItem === void 0 ? void 0 : mainItem.quantity
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                lineNumber: 146,
                                                columnNumber: 15
                                            }, this),
                                            order.items.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '11px',
                                                    color: 'var(--color-primary)',
                                                    marginTop: '4px'
                                                },
                                                children: [
                                                    "他 ",
                                                    order.items.length - 1,
                                                    " 点"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                lineNumber: 150,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 141,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px'
                                },
                                children: "顧客・配送情報"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gap: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                        label: "顧客名",
                                        value: order.customerName
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 164,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                        label: "顧客ID",
                                        value: order.customerId,
                                        copyable: true
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 165,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                        label: "配送先",
                                        value: order.destinationCountry
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                        label: "配送方法",
                                        value: order.shippingMethod || '-'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 167,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                        label: "追跡番号",
                                        value: order.trackingNumber || '-',
                                        copyable: !!order.trackingNumber
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 168,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px'
                                },
                                children: "金額・利益"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '12px',
                                    padding: '12px',
                                    background: 'var(--highlight)',
                                    borderRadius: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: 'var(--text-muted)'
                                                },
                                                children: "売上"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                lineNumber: 188,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '18px',
                                                    fontWeight: 600,
                                                    fontFamily: 'monospace'
                                                },
                                                children: [
                                                    order.currency,
                                                    order.totalAmount.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                lineNumber: 189,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 187,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: 'var(--text-muted)'
                                                },
                                                children: order.isProfitConfirmed ? '確定利益' : '見込利益'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                lineNumber: 194,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '18px',
                                                    fontWeight: 600
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProfitDisplay"], {
                                                    amount: order.isProfitConfirmed ? order.confirmedProfit || 0 : order.estimatedProfit,
                                                    isConfirmed: order.isProfitConfirmed,
                                                    size: "md"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                    lineNumber: 198,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                lineNumber: 197,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 193,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        style: {
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: 'var(--text-muted)'
                                        },
                                        children: "仕入れ情報"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 211,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                        variant: order.purchaseStatus === '仕入れ済み' ? 'success' : order.purchaseStatus === 'キャンセル' ? 'error' : 'warning',
                                        children: order.purchaseStatus
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 214,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 210,
                                columnNumber: 11
                            }, this),
                            isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Input"], {
                                        label: "仕入れ先URL",
                                        value: editData.actualPurchaseUrl,
                                        onValueChange: (v)=>setEditData((prev)=>({
                                                    ...prev,
                                                    actualPurchaseUrl: v
                                                })),
                                        placeholder: "https://..."
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 226,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Input"], {
                                        type: "number",
                                        label: "仕入れ原価 (JPY)",
                                        value: String(editData.actualPurchaseCostJpy),
                                        onValueChange: (v)=>setEditData((prev)=>({
                                                    ...prev,
                                                    actualPurchaseCostJpy: Number(v)
                                                })),
                                        placeholder: "0"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 232,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: '8px',
                                            marginTop: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                                variant: "primary",
                                                size: "sm",
                                                onClick: handleSave,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 19
                                                    }, this),
                                                    "保存"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                lineNumber: 240,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                                variant: "secondary",
                                                size: "sm",
                                                onClick: handleCancel,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                        lineNumber: 245,
                                                        columnNumber: 19
                                                    }, this),
                                                    "キャンセル"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                lineNumber: 244,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 239,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 225,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gap: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                        label: "仕入れ先",
                                        value: order.actualPurchaseUrl || order.estimatedPurchaseUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: order.actualPurchaseUrl || order.estimatedPurchaseUrl,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            style: {
                                                color: 'var(--color-primary)',
                                                fontSize: '12px'
                                            },
                                            children: [
                                                "リンクを開く ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                    size: 10,
                                                    style: {
                                                        marginLeft: '4px'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 30
                                                }, void 0)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                            lineNumber: 256,
                                            columnNumber: 21
                                        }, void 0) : '-'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 252,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                        label: "仕入れ原価",
                                        value: order.actualPurchaseCostJpy ? "¥".concat(order.actualPurchaseCostJpy.toLocaleString()) : '-'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 267,
                                        columnNumber: 15
                                    }, this),
                                    order.purchaseStatus === '未仕入れ' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                        variant: "secondary",
                                        size: "sm",
                                        onClick: handleStartEdit,
                                        style: {
                                            marginTop: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit2$3e$__["Edit2"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                                lineNumber: 273,
                                                columnNumber: 19
                                            }, this),
                                            "仕入れ情報を入力"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                        lineNumber: 272,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 251,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                        lineNumber: 209,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px 16px',
                    borderTop: '1px solid var(--panel-border)',
                    display: 'flex',
                    gap: '8px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "success",
                        size: "sm",
                        onClick: ()=>onMarkShipped === null || onMarkShipped === void 0 ? void 0 : onMarkShipped(order.id),
                        disabled: order.orderStatus === 'shipped' || order.orderStatus === 'delivered',
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 297,
                                columnNumber: 11
                            }, this),
                            "出荷完了"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this),
                    order.inquiryCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: ()=>onOpenInquiry === null || onOpenInquiry === void 0 ? void 0 : onOpenInquiry(order),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 302,
                                columnNumber: 13
                            }, this),
                            "問い合わせ (",
                            order.inquiryCount,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                        lineNumber: 301,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: ()=>onOpenLinkedData === null || onOpenLinkedData === void 0 ? void 0 : onOpenLinkedData(order),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                                lineNumber: 307,
                                columnNumber: 11
                            }, this),
                            "商品詳細"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                        lineNumber: 306,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
                lineNumber: 283,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx",
        lineNumber: 92,
        columnNumber: 5
    }, this);
}, "y7fnTJ+uq3jXGEVWREHTE8ehToo=")), "y7fnTJ+uq3jXGEVWREHTE8ehToo=");
_c1 = OrderDetailPanel;
const __TURBOPACK__default__export__ = OrderDetailPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "OrderDetailPanel$memo");
__turbopack_context__.k.register(_c1, "OrderDetailPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/panels/shipping-work-panel.tsx
/**
 * ShippingWorkPanel - 出荷作業パネル (Container)
 * 既存のShukkaWorkSectionをN3対応で再構築
 */ __turbopack_context__.s([
    "ShippingWorkPanel",
    ()=>ShippingWorkPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scale$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/scale.js [app-client] (ecmascript) <export default as Scale>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ruler$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/ruler.js [app-client] (ecmascript) <export default as Ruler>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/box.js [app-client] (ecmascript) <export default as Box>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// チェックリスト項目
const CHECKLIST_ITEMS = [
    {
        key: 'itemVerified',
        label: '商品確認'
    },
    {
        key: 'packaged',
        label: '梱包完了'
    },
    {
        key: 'labelAttached',
        label: 'ラベル貼付'
    },
    {
        key: 'weightMeasured',
        label: '重量計測'
    },
    {
        key: 'documentsPrepared',
        label: '書類準備'
    }
];
// 配送業者オプション
const CARRIER_OPTIONS = [
    {
        value: 'japan_post',
        label: '日本郵便'
    },
    {
        value: 'yamato',
        label: 'ヤマト運輸'
    },
    {
        value: 'sagawa',
        label: '佐川急便'
    },
    {
        value: 'fedex',
        label: 'FedEx'
    },
    {
        value: 'dhl',
        label: 'DHL'
    },
    {
        value: 'ups',
        label: 'UPS'
    }
];
// 外部サービス
const EXTERNAL_SERVICES = [
    {
        key: 'elogi',
        label: 'eLogi',
        url: 'https://elogi.jp'
    },
    {
        key: 'cpas',
        label: 'Cpas',
        url: 'https://cpas.jp'
    },
    {
        key: 'japanpost',
        label: '日本郵便',
        url: 'https://www.post.japanpost.jp/intmypageq/'
    }
];
const ShippingWorkPanel = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function ShippingWorkPanel(param) {
    let { item, onUpdateItem, onMarkShipped, onPrintLabel, onOpenLinkedData } = param;
    _s();
    const [trackingInput, setTrackingInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedCarrier, setSelectedCarrier] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('japan_post');
    const [dimensions, setDimensions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        length: '',
        width: '',
        height: '',
        weight: ''
    });
    const handleChecklistToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShippingWorkPanel.ShippingWorkPanel.useCallback[handleChecklistToggle]": (key)=>{
            if (item && onUpdateItem) {
                const newChecklist = {
                    ...item.checklist,
                    [key]: !item.checklist[key]
                };
                onUpdateItem(item.id, {
                    checklist: newChecklist
                });
            }
        }
    }["ShippingWorkPanel.ShippingWorkPanel.useCallback[handleChecklistToggle]"], [
        item,
        onUpdateItem
    ]);
    const handleShip = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShippingWorkPanel.ShippingWorkPanel.useCallback[handleShip]": ()=>{
            if (item && trackingInput && onMarkShipped) {
                onMarkShipped(item.id, trackingInput);
                setTrackingInput('');
            }
        }
    }["ShippingWorkPanel.ShippingWorkPanel.useCallback[handleShip]"], [
        item,
        trackingInput,
        onMarkShipped
    ]);
    const handleCopyAddress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShippingWorkPanel.ShippingWorkPanel.useCallback[handleCopyAddress]": ()=>{
            if (item) {
                const address = "".concat(item.customerName, "\n").concat(item.shippingAddress);
                navigator.clipboard.writeText(address);
            }
        }
    }["ShippingWorkPanel.ShippingWorkPanel.useCallback[handleCopyAddress]"], [
        item
    ]);
    const handleSaveDimensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShippingWorkPanel.ShippingWorkPanel.useCallback[handleSaveDimensions]": ()=>{
            if (item && onUpdateItem) {
                onUpdateItem(item.id, {
                    packageDimensions: {
                        length: Number(dimensions.length),
                        width: Number(dimensions.width),
                        height: Number(dimensions.height),
                        weight: Number(dimensions.weight)
                    }
                });
            }
        }
    }["ShippingWorkPanel.ShippingWorkPanel.useCallback[handleSaveDimensions]"], [
        item,
        dimensions,
        onUpdateItem
    ]);
    if (!item) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "出荷アイテムを選択してください"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
            lineNumber: 126,
            columnNumber: 7
        }, this);
    }
    const completedChecks = CHECKLIST_ITEMS.filter((c)=>item.checklist[c.key]).length;
    const totalChecks = CHECKLIST_ITEMS.length;
    const isReadyToShip = completedChecks === totalChecks;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '16px',
                    borderBottom: '1px solid var(--panel-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceBadge"], {
                        marketplace: item.marketplace,
                        size: "md"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    fontFamily: 'monospace'
                                },
                                children: item.orderId
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)'
                                },
                                children: item.customerName
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PriorityBadge"], {
                        priority: item.priority
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShippingStatusBadge"], {
                        status: item.status,
                        size: "md"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflow: 'auto',
                    padding: '16px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px'
                                },
                                children: "商品情報"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '6px',
                                            background: 'var(--highlight)',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        },
                                        children: item.productImageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: item.productImageUrl,
                                            alt: "",
                                            style: {
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                            lineNumber: 184,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                            size: 20,
                                            style: {
                                                color: 'var(--text-muted)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                            lineNumber: 186,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 171,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '13px',
                                                    fontWeight: 500
                                                },
                                                children: item.productTitle
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                                lineNumber: 190,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '11px',
                                                    color: 'var(--text-muted)',
                                                    marginTop: '2px'
                                                },
                                                children: [
                                                    "SKU: ",
                                                    item.productSku
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                                lineNumber: 191,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '11px',
                                                    color: 'var(--text-muted)'
                                                },
                                                children: [
                                                    "数量: ",
                                                    item.quantity
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                                lineNumber: 194,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 189,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        style: {
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: 'var(--text-muted)'
                                        },
                                        children: "配送先"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCopyAddress,
                                        style: {
                                            background: 'transparent',
                                            border: 'none',
                                            padding: '4px',
                                            cursor: 'pointer',
                                            color: 'var(--color-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '11px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                                lineNumber: 221,
                                                columnNumber: 15
                                            }, this),
                                            "コピー"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 207,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '12px',
                                    background: 'var(--highlight)',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    lineHeight: 1.6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 500
                                        },
                                        children: item.customerName
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 234,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            color: 'var(--text-muted)',
                                            whiteSpace: 'pre-wrap'
                                        },
                                        children: item.shippingAddress
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 235,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                        variant: "secondary",
                                        style: {
                                            marginTop: '8px'
                                        },
                                        children: item.destinationCountry
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 225,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        style: {
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: 'var(--text-muted)'
                                        },
                                        children: "出荷チェックリスト"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 247,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '11px',
                                            color: isReadyToShip ? 'var(--color-success)' : 'var(--text-muted)'
                                        },
                                        children: [
                                            completedChecks,
                                            "/",
                                            totalChecks
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 250,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 246,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '12px',
                                    background: 'var(--highlight)',
                                    borderRadius: '8px',
                                    display: 'grid',
                                    gap: '8px'
                                },
                                children: CHECKLIST_ITEMS.map((checkItem)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Checkbox"], {
                                                checked: item.checklist[checkItem.key] || false,
                                                onChange: ()=>handleChecklistToggle(checkItem.key)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                                lineNumber: 274,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: checkItem.label
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                                lineNumber: 278,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, checkItem.key, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 264,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 245,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px'
                                },
                                children: "梱包サイズ・重量"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 286,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Input"], {
                                        label: "長さ (cm)",
                                        value: dimensions.length,
                                        onValueChange: (v)=>setDimensions((prev)=>({
                                                    ...prev,
                                                    length: v
                                                })),
                                        placeholder: "0",
                                        leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ruler$3e$__["Ruler"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                            lineNumber: 301,
                                            columnNumber: 25
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 296,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Input"], {
                                        label: "幅 (cm)",
                                        value: dimensions.width,
                                        onValueChange: (v)=>setDimensions((prev)=>({
                                                    ...prev,
                                                    width: v
                                                })),
                                        placeholder: "0",
                                        leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ruler$3e$__["Ruler"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                            lineNumber: 308,
                                            columnNumber: 25
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 303,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Input"], {
                                        label: "高さ (cm)",
                                        value: dimensions.height,
                                        onValueChange: (v)=>setDimensions((prev)=>({
                                                    ...prev,
                                                    height: v
                                                })),
                                        placeholder: "0",
                                        leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$box$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Box$3e$__["Box"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                            lineNumber: 315,
                                            columnNumber: 25
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 310,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Input"], {
                                        label: "重量 (g)",
                                        value: dimensions.weight,
                                        onValueChange: (v)=>setDimensions((prev)=>({
                                                    ...prev,
                                                    weight: v
                                                })),
                                        placeholder: "0",
                                        leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$scale$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Scale$3e$__["Scale"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                            lineNumber: 322,
                                            columnNumber: 25
                                        }, void 0)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 317,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 289,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                variant: "secondary",
                                size: "sm",
                                onClick: handleSaveDimensions,
                                style: {
                                    marginTop: '8px'
                                },
                                children: "サイズ保存"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 325,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 285,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px'
                                },
                                children: "配送情報"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 337,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Select"], {
                                        label: "配送業者",
                                        value: selectedCarrier,
                                        onValueChange: setSelectedCarrier,
                                        options: CARRIER_OPTIONS
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 341,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Input"], {
                                        label: "追跡番号",
                                        value: trackingInput,
                                        onValueChange: setTrackingInput,
                                        placeholder: "追跡番号を入力"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 347,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 340,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 336,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px'
                                },
                                children: "外部サービス"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 358,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '8px',
                                    flexWrap: 'wrap'
                                },
                                children: EXTERNAL_SERVICES.map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: service.url,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '6px 10px',
                                            background: 'var(--highlight)',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            color: 'var(--text)',
                                            textDecoration: 'none',
                                            transition: 'background 0.15s ease'
                                        },
                                        children: [
                                            service.label,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                size: 10
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                                lineNumber: 382,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, service.key, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                        lineNumber: 363,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 361,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 357,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px 16px',
                    borderTop: '1px solid var(--panel-border)',
                    display: 'flex',
                    gap: '8px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "primary",
                        size: "sm",
                        onClick: ()=>onPrintLabel === null || onPrintLabel === void 0 ? void 0 : onPrintLabel(item.id),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 403,
                                columnNumber: 11
                            }, this),
                            "ラベル印刷"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 398,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "success",
                        size: "sm",
                        onClick: handleShip,
                        disabled: !isReadyToShip || !trackingInput,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 412,
                                columnNumber: 11
                            }, this),
                            "出荷完了"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 406,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: ()=>onOpenLinkedData === null || onOpenLinkedData === void 0 ? void 0 : onOpenLinkedData(item),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                                lineNumber: 420,
                                columnNumber: 11
                            }, this),
                            "商品詳細"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                        lineNumber: 415,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
                lineNumber: 390,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
}, "yC0OYdlK57nXm26IfW8e2dN3L78=")), "yC0OYdlK57nXm26IfW8e2dN3L78=");
_c1 = ShippingWorkPanel;
const __TURBOPACK__default__export__ = ShippingWorkPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "ShippingWorkPanel$memo");
__turbopack_context__.k.register(_c1, "ShippingWorkPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/panels/inquiry-response-panel.tsx
/**
 * InquiryResponsePanel - 問い合わせ対応パネル (Container)
 * チャット形式の対応画面、AIドラフト、テンプレート挿入
 */ __turbopack_context__.s([
    "InquiryResponsePanel",
    ()=>InquiryResponsePanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/thumbs-up.js [app-client] (ecmascript) <export default as ThumbsUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsDown$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/thumbs-down.js [app-client] (ecmascript) <export default as ThumbsDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// センチメント設定
const SENTIMENT_CONFIG = {
    positive: {
        icon: '😊',
        label: 'ポジティブ',
        color: 'var(--color-success)'
    },
    neutral: {
        icon: '😐',
        label: '中立',
        color: 'var(--text-muted)'
    },
    negative: {
        icon: '😞',
        label: 'ネガティブ',
        color: 'var(--color-error)'
    }
};
// カテゴリラベル
const CATEGORY_LABELS = {
    DELIVERY: '配送',
    RETURN: '返品',
    PRODUCT: '商品',
    OTHER: 'その他'
};
const InquiryResponsePanel = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function InquiryResponsePanel(param) {
    let { inquiry, messages = [], templates = [], onSendResponse, onGenerateAIDraft, onMarkResolved, onOpenLinkedData, onFeedback } = param;
    _s();
    const [responseText, setResponseText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isGeneratingAI, setIsGeneratingAI] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showTemplates, setShowTemplates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAISuggestion, setShowAISuggestion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // メッセージ一覧の末尾にスクロール
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InquiryResponsePanel.InquiryResponsePanel.useEffect": ()=>{
            var _messagesEndRef_current;
            (_messagesEndRef_current = messagesEndRef.current) === null || _messagesEndRef_current === void 0 ? void 0 : _messagesEndRef_current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }["InquiryResponsePanel.InquiryResponsePanel.useEffect"], [
        messages
    ]);
    // テキストエリアの高さを自動調整
    const adjustTextareaHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InquiryResponsePanel.InquiryResponsePanel.useCallback[adjustTextareaHeight]": ()=>{
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = "".concat(Math.min(textareaRef.current.scrollHeight, 150), "px");
            }
        }
    }["InquiryResponsePanel.InquiryResponsePanel.useCallback[adjustTextareaHeight]"], []);
    const handleSend = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InquiryResponsePanel.InquiryResponsePanel.useCallback[handleSend]": ()=>{
            if (inquiry && responseText.trim() && onSendResponse) {
                onSendResponse(inquiry.id, responseText.trim());
                setResponseText('');
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                }
            }
        }
    }["InquiryResponsePanel.InquiryResponsePanel.useCallback[handleSend]"], [
        inquiry,
        responseText,
        onSendResponse
    ]);
    const handleGenerateAI = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InquiryResponsePanel.InquiryResponsePanel.useCallback[handleGenerateAI]": async ()=>{
            if (inquiry && onGenerateAIDraft) {
                setIsGeneratingAI(true);
                try {
                    const draft = await onGenerateAIDraft(inquiry.id);
                    setResponseText(draft);
                    adjustTextareaHeight();
                } catch (error) {
                    console.error('AI draft generation failed:', error);
                } finally{
                    setIsGeneratingAI(false);
                }
            }
        }
    }["InquiryResponsePanel.InquiryResponsePanel.useCallback[handleGenerateAI]"], [
        inquiry,
        onGenerateAIDraft,
        adjustTextareaHeight
    ]);
    const handleUseAISuggestion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InquiryResponsePanel.InquiryResponsePanel.useCallback[handleUseAISuggestion]": ()=>{
            if (inquiry === null || inquiry === void 0 ? void 0 : inquiry.aiSuggestedResponse) {
                setResponseText(inquiry.aiSuggestedResponse);
                adjustTextareaHeight();
            }
        }
    }["InquiryResponsePanel.InquiryResponsePanel.useCallback[handleUseAISuggestion]"], [
        inquiry,
        adjustTextareaHeight
    ]);
    const handleInsertTemplate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InquiryResponsePanel.InquiryResponsePanel.useCallback[handleInsertTemplate]": (template)=>{
            setResponseText({
                "InquiryResponsePanel.InquiryResponsePanel.useCallback[handleInsertTemplate]": (prev)=>{
                    const newText = prev ? "".concat(prev, "\n\n").concat(template.content) : template.content;
                    return newText;
                }
            }["InquiryResponsePanel.InquiryResponsePanel.useCallback[handleInsertTemplate]"]);
            setShowTemplates(false);
            adjustTextareaHeight();
        }
    }["InquiryResponsePanel.InquiryResponsePanel.useCallback[handleInsertTemplate]"], [
        adjustTextareaHeight
    ]);
    const handleCopyToClipboard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InquiryResponsePanel.InquiryResponsePanel.useCallback[handleCopyToClipboard]": (text)=>{
            navigator.clipboard.writeText(text);
        }
    }["InquiryResponsePanel.InquiryResponsePanel.useCallback[handleCopyToClipboard]"], []);
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "InquiryResponsePanel.InquiryResponsePanel.useCallback[handleKeyDown]": (e)=>{
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSend();
            }
        }
    }["InquiryResponsePanel.InquiryResponsePanel.useCallback[handleKeyDown]"], [
        handleSend
    ]);
    if (!inquiry) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "問い合わせを選択してください"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
            lineNumber: 147,
            columnNumber: 7
        }, this);
    }
    const sentiment = SENTIMENT_CONFIG[inquiry.aiSentiment];
    const categoryLabel = CATEGORY_LABELS[inquiry.aiCategory] || inquiry.aiCategory;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        },
        className: "jsx-532d500bfc6d5d04",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--panel-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                },
                className: "jsx-532d500bfc6d5d04",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceBadge"], {
                        marketplace: inquiry.marketplace,
                        size: "sm"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 168,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PriorityBadge"], {
                        priority: inquiry.aiUrgency
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                        variant: "secondary",
                        children: categoryLabel
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '16px'
                        },
                        title: "感情: ".concat(sentiment.label),
                        className: "jsx-532d500bfc6d5d04",
                        children: sentiment.icon
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginLeft: 'auto'
                        },
                        className: "jsx-532d500bfc6d5d04",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InquiryStatusBadge"], {
                            status: inquiry.status,
                            size: "md"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px 16px',
                    background: 'var(--highlight)',
                    borderBottom: '1px solid var(--panel-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                },
                className: "jsx-532d500bfc6d5d04",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'var(--panel)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        className: "jsx-532d500bfc6d5d04",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                            size: 18,
                            style: {
                                color: 'var(--text-muted)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        },
                        className: "jsx-532d500bfc6d5d04",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 500
                                },
                                className: "jsx-532d500bfc6d5d04",
                                children: inquiry.customerName
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)'
                                },
                                className: "jsx-532d500bfc6d5d04",
                                children: [
                                    inquiry.customerId,
                                    inquiry.orderId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            marginLeft: '8px'
                                        },
                                        className: "jsx-532d500bfc6d5d04",
                                        children: [
                                            "注文: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontFamily: 'monospace'
                                                },
                                                className: "jsx-532d500bfc6d5d04",
                                                children: inquiry.orderId
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                                lineNumber: 209,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                        lineNumber: 208,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 205,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this),
                    inquiry.orderId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: ()=>onOpenLinkedData === null || onOpenLinkedData === void 0 ? void 0 : onOpenLinkedData(inquiry),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this),
                            "注文詳細"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 215,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                lineNumber: 180,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflow: 'auto',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                },
                className: "jsx-532d500bfc6d5d04",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'flex-start'
                        },
                        className: "jsx-532d500bfc6d5d04",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: 'var(--highlight)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                },
                                className: "jsx-532d500bfc6d5d04",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                    size: 14,
                                    style: {
                                        color: 'var(--text-muted)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                    lineNumber: 257,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 245,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1
                                },
                                className: "jsx-532d500bfc6d5d04",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            marginBottom: '4px'
                                        },
                                        className: "jsx-532d500bfc6d5d04",
                                        children: inquiry.subject
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '10px 12px',
                                            background: 'var(--highlight)',
                                            borderRadius: '0 12px 12px 12px',
                                            fontSize: '13px',
                                            lineHeight: 1.5
                                        },
                                        className: "jsx-532d500bfc6d5d04",
                                        children: inquiry.content
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                        lineNumber: 263,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            color: 'var(--text-muted)',
                                            marginTop: '4px'
                                        },
                                        className: "jsx-532d500bfc6d5d04",
                                        children: new Date(inquiry.receivedAt).toLocaleString('ja-JP')
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 259,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 238,
                        columnNumber: 9
                    }, this),
                    messages.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'flex-start',
                                flexDirection: msg.sender === 'seller' ? 'row-reverse' : 'row'
                            },
                            className: "jsx-532d500bfc6d5d04",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '50%',
                                        background: msg.sender === 'seller' ? 'var(--color-primary)' : 'var(--highlight)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    },
                                    className: "jsx-532d500bfc6d5d04",
                                    children: msg.sender === 'seller' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        size: 14,
                                        style: {
                                            color: 'white'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                        lineNumber: 304,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                        size: 14,
                                        style: {
                                            color: 'var(--text-muted)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                        lineNumber: 306,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: 1,
                                        maxWidth: '80%'
                                    },
                                    className: "jsx-532d500bfc6d5d04",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: '10px 12px',
                                                background: msg.sender === 'seller' ? 'rgba(59, 130, 246, 0.1)' : 'var(--highlight)',
                                                borderRadius: msg.sender === 'seller' ? '12px 0 12px 12px' : '0 12px 12px 12px',
                                                fontSize: '13px',
                                                lineHeight: 1.5
                                            },
                                            className: "jsx-532d500bfc6d5d04",
                                            children: msg.content
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                            lineNumber: 310,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '10px',
                                                color: 'var(--text-muted)',
                                                marginTop: '4px',
                                                textAlign: msg.sender === 'seller' ? 'right' : 'left'
                                            },
                                            className: "jsx-532d500bfc6d5d04",
                                            children: [
                                                new Date(msg.sentAt).toLocaleString('ja-JP'),
                                                msg.isAIGenerated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        marginLeft: '8px',
                                                        color: 'var(--color-primary)'
                                                    },
                                                    className: "jsx-532d500bfc6d5d04",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                                            size: 10,
                                                            style: {
                                                                display: 'inline',
                                                                verticalAlign: 'middle'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                                            lineNumber: 332,
                                                            columnNumber: 21
                                                        }, this),
                                                        " AI生成"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                                    lineNumber: 331,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                            lineNumber: 321,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                    lineNumber: 309,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, msg.id, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                            lineNumber: 282,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesEndRef,
                        className: "jsx-532d500bfc6d5d04"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this),
            inquiry.aiSuggestedResponse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    borderTop: '1px solid var(--panel-border)',
                    background: 'rgba(59, 130, 246, 0.03)'
                },
                className: "jsx-532d500bfc6d5d04",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowAISuggestion(!showAISuggestion),
                        style: {
                            width: '100%',
                            padding: '8px 16px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--color-primary)',
                            fontSize: '12px',
                            fontWeight: 500
                        },
                        className: "jsx-532d500bfc6d5d04",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 367,
                                columnNumber: 13
                            }, this),
                            "AI提案",
                            showAISuggestion ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 369,
                                columnNumber: 33
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 369,
                                columnNumber: 59
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 351,
                        columnNumber: 11
                    }, this),
                    showAISuggestion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '0 16px 12px'
                        },
                        className: "jsx-532d500bfc6d5d04",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px 12px',
                                    background: 'var(--panel)',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    lineHeight: 1.5,
                                    border: '1px solid rgba(59, 130, 246, 0.2)'
                                },
                                className: "jsx-532d500bfc6d5d04",
                                children: inquiry.aiSuggestedResponse
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 373,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '8px',
                                    marginTop: '8px'
                                },
                                className: "jsx-532d500bfc6d5d04",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                        variant: "primary",
                                        size: "sm",
                                        onClick: handleUseAISuggestion,
                                        children: "使用する"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                        lineNumber: 386,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                        variant: "secondary",
                                        size: "sm",
                                        onClick: ()=>handleCopyToClipboard(inquiry.aiSuggestedResponse),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                            lineNumber: 394,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                        lineNumber: 389,
                                        columnNumber: 17
                                    }, this),
                                    onFeedback && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>onFeedback(inquiry.id, true),
                                                style: {
                                                    background: 'transparent',
                                                    border: 'none',
                                                    padding: '4px',
                                                    cursor: 'pointer',
                                                    color: 'var(--color-success)'
                                                },
                                                title: "良い提案",
                                                className: "jsx-532d500bfc6d5d04",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__["ThumbsUp"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                                lineNumber: 398,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>onFeedback(inquiry.id, false),
                                                style: {
                                                    background: 'transparent',
                                                    border: 'none',
                                                    padding: '4px',
                                                    cursor: 'pointer',
                                                    color: 'var(--color-error)'
                                                },
                                                title: "改善が必要",
                                                className: "jsx-532d500bfc6d5d04",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsDown$3e$__["ThumbsDown"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                                lineNumber: 411,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 385,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 372,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                lineNumber: 345,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px 16px',
                    borderTop: '1px solid var(--panel-border)',
                    background: 'var(--bg)'
                },
                className: "jsx-532d500bfc6d5d04",
                children: [
                    showTemplates && templates.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '12px',
                            padding: '12px',
                            background: 'var(--highlight)',
                            borderRadius: '8px',
                            maxHeight: '200px',
                            overflow: 'auto'
                        },
                        className: "jsx-532d500bfc6d5d04",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px'
                                },
                                className: "jsx-532d500bfc6d5d04",
                                children: "テンプレートを選択"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 452,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gap: '8px'
                                },
                                className: "jsx-532d500bfc6d5d04",
                                children: templates.map((template)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleInsertTemplate(template),
                                        style: {
                                            background: 'var(--panel)',
                                            border: '1px solid var(--panel-border)',
                                            borderRadius: '6px',
                                            padding: '8px 12px',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            transition: 'border-color 0.15s ease'
                                        },
                                        className: "jsx-532d500bfc6d5d04",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '12px',
                                                    fontWeight: 500
                                                },
                                                className: "jsx-532d500bfc6d5d04",
                                                children: template.name
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                                lineNumber: 470,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '11px',
                                                    color: 'var(--text-muted)',
                                                    marginTop: '4px',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                },
                                                className: "jsx-532d500bfc6d5d04",
                                                children: template.content
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                                lineNumber: 471,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, template.id, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                        lineNumber: 457,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 455,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 442,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '8px',
                            marginBottom: '8px'
                        },
                        className: "jsx-532d500bfc6d5d04",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                variant: "secondary",
                                size: "sm",
                                onClick: ()=>setShowTemplates(!showTemplates),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                        lineNumber: 497,
                                        columnNumber: 13
                                    }, this),
                                    "テンプレート"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 492,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                variant: "secondary",
                                size: "sm",
                                onClick: handleGenerateAI,
                                disabled: isGeneratingAI,
                                children: [
                                    isGeneratingAI ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                        size: 14,
                                        style: {
                                            animation: 'spin 1s linear infinite'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                        lineNumber: 507,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                        lineNumber: 509,
                                        columnNumber: 15
                                    }, this),
                                    isGeneratingAI ? '生成中...' : 'AI下書き'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 500,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginLeft: 'auto'
                                },
                                className: "jsx-532d500bfc6d5d04",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                    variant: "success",
                                    size: "sm",
                                    onClick: ()=>onMarkResolved === null || onMarkResolved === void 0 ? void 0 : onMarkResolved(inquiry.id),
                                    disabled: inquiry.status === 'resolved',
                                    children: "解決済み"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                    lineNumber: 514,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 513,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 491,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'flex-end'
                        },
                        className: "jsx-532d500bfc6d5d04",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                ref: textareaRef,
                                value: responseText,
                                onChange: (e)=>{
                                    setResponseText(e.target.value);
                                    adjustTextareaHeight();
                                },
                                onKeyDown: handleKeyDown,
                                placeholder: "返信を入力... (Ctrl+Enter で送信)",
                                style: {
                                    flex: 1,
                                    minHeight: '40px',
                                    maxHeight: '150px',
                                    padding: '10px 12px',
                                    border: '1px solid var(--panel-border)',
                                    borderRadius: '8px',
                                    background: 'var(--panel)',
                                    color: 'var(--text)',
                                    fontSize: '13px',
                                    lineHeight: 1.5,
                                    resize: 'none',
                                    outline: 'none'
                                },
                                className: "jsx-532d500bfc6d5d04"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 527,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                variant: "primary",
                                size: "md",
                                onClick: handleSend,
                                disabled: !responseText.trim(),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                    lineNumber: 557,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                                lineNumber: 551,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                        lineNumber: 526,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
                lineNumber: 433,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "532d500bfc6d5d04",
                children: "@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx",
        lineNumber: 157,
        columnNumber: 5
    }, this);
}, "v+GQekWY9yGxkb4SdOGaXnUNXqc=")), "v+GQekWY9yGxkb4SdOGaXnUNXqc=");
_c1 = InquiryResponsePanel;
const __TURBOPACK__default__export__ = InquiryResponsePanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "InquiryResponsePanel$memo");
__turbopack_context__.k.register(_c1, "InquiryResponsePanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/panels/index.ts
/**
 * パネルコンポーネント (Container)
 * 詳細表示・作業パネル
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$panels$2f$order$2d$detail$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$panels$2f$shipping$2d$work$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$panels$2f$inquiry$2d$response$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/linked/product-info-panel.tsx
/**
 * ProductInfoPanel - 商品情報パネル (Container)
 * 右オーバーレイで表示する商品詳細情報
 */ __turbopack_context__.s([
    "ProductInfoPanel",
    ()=>ProductInfoPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-detail-row.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
const ProductInfoPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function ProductInfoPanel(param) {
    let { product, isLoading = false, onOpenOriginal, onOpenStock } = param;
    var _product_sellingPrice, _product_purchaseCost, _product_currentStock, _product_totalSold, _product_listedMarketplaces;
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "読み込み中..."
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this);
    }
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "商品情報がありません"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this);
    }
    const handleCopy = (text)=>{
        navigator.clipboard.writeText(text);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '100%',
                    aspectRatio: '1',
                    maxHeight: '200px',
                    borderRadius: '12px',
                    background: 'var(--highlight)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                children: product.imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: product.imageUrl,
                    alt: product.title,
                    style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                    lineNumber: 74,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                    size: 48,
                    style: {
                        color: 'var(--text-muted)'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                    lineNumber: 80,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'var(--text)',
                            lineHeight: 1.4,
                            marginBottom: '8px'
                        },
                        children: product.title
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                variant: product.productType === 'stock' ? 'success' : 'warning',
                                children: product.productType === 'stock' ? '在庫品' : '無在庫'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, this),
                            product.condition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                variant: "secondary",
                                children: product.condition
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '12px',
                    background: 'var(--highlight)',
                    borderRadius: '8px'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'grid',
                        gap: '8px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '11px',
                                        color: 'var(--text-muted)'
                                    },
                                    children: "SKU"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '12px',
                                                fontFamily: 'monospace'
                                            },
                                            children: product.sku
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                            lineNumber: 119,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleCopy(product.sku),
                                            style: {
                                                background: 'transparent',
                                                border: 'none',
                                                padding: '2px',
                                                cursor: 'pointer',
                                                color: 'var(--text-muted)'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                                lineNumber: 130,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                            lineNumber: 120,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, this),
                        product.asin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '11px',
                                        color: 'var(--text-muted)'
                                    },
                                    children: "ASIN"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                    lineNumber: 136,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '12px',
                                                fontFamily: 'monospace'
                                            },
                                            children: product.asin
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                            lineNumber: 138,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleCopy(product.asin),
                                            style: {
                                                background: 'transparent',
                                                border: 'none',
                                                padding: '2px',
                                                cursor: 'pointer',
                                                color: 'var(--text-muted)'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                                lineNumber: 149,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                            lineNumber: 139,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                    lineNumber: 137,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this),
                        product.ebayItemId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '11px',
                                        color: 'var(--text-muted)'
                                    },
                                    children: "eBay ID"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                    lineNumber: 156,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '12px',
                                                fontFamily: 'monospace'
                                            },
                                            children: product.ebayItemId
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                            lineNumber: 158,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleCopy(product.ebayItemId),
                                            style: {
                                                background: 'transparent',
                                                border: 'none',
                                                padding: '2px',
                                                cursor: 'pointer',
                                                color: 'var(--text-muted)'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                size: 12
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                                lineNumber: 169,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                            lineNumber: 159,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                    lineNumber: 157,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                            lineNumber: 155,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                    lineNumber: 115,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this),
                            "価格情報"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px',
                                    background: 'var(--highlight)',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "販売価格"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            fontFamily: 'monospace'
                                        },
                                        children: [
                                            "$",
                                            ((_product_sellingPrice = product.sellingPrice) === null || _product_sellingPrice === void 0 ? void 0 : _product_sellingPrice.toLocaleString()) || '-'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                        lineNumber: 209,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px',
                                    background: 'var(--highlight)',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "仕入原価"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                        lineNumber: 221,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            fontFamily: 'monospace'
                                        },
                                        children: [
                                            "¥",
                                            ((_product_purchaseCost = product.purchaseCost) === null || _product_purchaseCost === void 0 ? void 0 : _product_purchaseCost.toLocaleString()) || '-'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                        lineNumber: 222,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 213,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this),
                    product.estimatedProfit !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: '8px',
                            padding: '10px',
                            background: product.estimatedProfit > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '6px',
                            textAlign: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '10px',
                                    color: 'var(--text-muted)'
                                },
                                children: "見込利益"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 237,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    fontFamily: 'monospace',
                                    color: product.estimatedProfit > 0 ? 'var(--color-success)' : 'var(--color-error)'
                                },
                                children: [
                                    "¥",
                                    product.estimatedProfit.toLocaleString()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 238,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 265,
                                columnNumber: 11
                            }, this),
                            "在庫・販売"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                        lineNumber: 254,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gap: '4px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                label: "現在庫数",
                                value: ((_product_currentStock = product.currentStock) === null || _product_currentStock === void 0 ? void 0 : _product_currentStock.toString()) || '-'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                label: "販売数",
                                value: ((_product_totalSold = product.totalSold) === null || _product_totalSold === void 0 ? void 0 : _product_totalSold.toString()) || '-'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 270,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                label: "出品中マーケット",
                                value: ((_product_listedMarketplaces = product.listedMarketplaces) === null || _product_listedMarketplaces === void 0 ? void 0 : _product_listedMarketplaces.join(', ')) || '-'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 271,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                lineNumber: 253,
                columnNumber: 7
            }, this),
            product.purchaseUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 289,
                                columnNumber: 13
                            }, this),
                            "仕入先"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: product.purchaseUrl,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 12px',
                            background: 'var(--highlight)',
                            borderRadius: '6px',
                            color: 'var(--color-primary)',
                            textDecoration: 'none',
                            fontSize: '12px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 308,
                                columnNumber: 13
                            }, this),
                            "仕入先ページを開く"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                        lineNumber: 292,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                lineNumber: 277,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '8px',
                    marginTop: '8px'
                },
                children: [
                    product.listingUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: ()=>onOpenOriginal === null || onOpenOriginal === void 0 ? void 0 : onOpenOriginal(product.listingUrl),
                        style: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 323,
                                columnNumber: 13
                            }, this),
                            "出品ページ"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                        lineNumber: 317,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: onOpenStock,
                        style: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                                lineNumber: 333,
                                columnNumber: 11
                            }, this),
                            "在庫詳細"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                        lineNumber: 327,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
                lineNumber: 315,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
});
_c1 = ProductInfoPanel;
const __TURBOPACK__default__export__ = ProductInfoPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProductInfoPanel$memo");
__turbopack_context__.k.register(_c1, "ProductInfoPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/linked/inventory-status-panel.tsx
/**
 * InventoryStatusPanel - 在庫状況パネル (Container)
 * 在庫の詳細情報、変動履歴、発注推奨など
 */ __turbopack_context__.s([
    "InventoryStatusPanel",
    ()=>InventoryStatusPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-detail-row.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$progress$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-progress-bar.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
const MOVEMENT_TYPE_CONFIG = {
    sale: {
        label: '販売',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"],
        color: 'var(--color-error)'
    },
    purchase: {
        label: '入荷',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
        color: 'var(--color-success)'
    },
    adjustment: {
        label: '調整',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"],
        color: 'var(--color-warning)'
    },
    return: {
        label: '返品',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
        color: 'var(--color-primary)'
    }
};
const InventoryStatusPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function InventoryStatusPanel(param) {
    let { inventory, movements = [], isLoading = false, onRefresh, onOrderStock } = param;
    var _inventory_physicalStock, _inventory_reservedStock, _inventory_availableStock, _inventory_incomingStock;
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "読み込み中..."
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this);
    }
    if (!inventory) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "在庫情報がありません"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, this);
    }
    const stockLevel = inventory.reorderPoint ? inventory.currentStock / inventory.reorderPoint * 100 : 100;
    const isLowStock = inventory.currentStock <= (inventory.reorderPoint || 0);
    const isOutOfStock = inventory.currentStock === 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '16px',
                    background: isOutOfStock ? 'rgba(239, 68, 68, 0.1)' : isLowStock ? 'rgba(245, 158, 11, 0.1)' : 'var(--highlight)',
                    borderRadius: '12px',
                    border: "1px solid ".concat(isOutOfStock ? 'rgba(239, 68, 68, 0.3)' : isLowStock ? 'rgba(245, 158, 11, 0.3)' : 'var(--panel-border)')
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '12px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: '12px',
                                    color: 'var(--text-muted)'
                                },
                                children: "現在庫数"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            isLowStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                variant: isOutOfStock ? 'error' : 'warning',
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        size: 10
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                        lineNumber: 92,
                                        columnNumber: 15
                                    }, this),
                                    isOutOfStock ? '在庫切れ' : '在庫少'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '32px',
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: isOutOfStock ? 'var(--color-error)' : isLowStock ? 'var(--color-warning)' : 'var(--text)',
                            marginBottom: '8px'
                        },
                        children: [
                            inventory.currentStock,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 400,
                                    color: 'var(--text-muted)',
                                    marginLeft: '4px'
                                },
                                children: "個"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this),
                    inventory.reorderPoint !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '11px',
                                    marginBottom: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--text-muted)'
                                        },
                                        children: [
                                            "発注点: ",
                                            inventory.reorderPoint
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                        lineNumber: 114,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--text-muted)'
                                        },
                                        children: [
                                            Math.round(stockLevel),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                        lineNumber: 115,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 113,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$progress$2d$bar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3ProgressBar"], {
                                value: Math.min(stockLevel, 100),
                                variant: isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success',
                                size: "sm"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, this),
                            "在庫詳細"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gap: '4px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                label: "物理在庫",
                                value: ((_inventory_physicalStock = inventory.physicalStock) === null || _inventory_physicalStock === void 0 ? void 0 : _inventory_physicalStock.toString()) || '-'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                label: "予約済み",
                                value: ((_inventory_reservedStock = inventory.reservedStock) === null || _inventory_reservedStock === void 0 ? void 0 : _inventory_reservedStock.toString()) || '0'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                label: "利用可能",
                                value: ((_inventory_availableStock = inventory.availableStock) === null || _inventory_availableStock === void 0 ? void 0 : _inventory_availableStock.toString()) || inventory.currentStock.toString()
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                label: "入荷予定",
                                value: ((_inventory_incomingStock = inventory.incomingStock) === null || _inventory_incomingStock === void 0 ? void 0 : _inventory_incomingStock.toString()) || '0'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            inventory.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                label: "保管場所",
                                value: inventory.location
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, this),
                            "販売実績"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '8px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px',
                                    background: 'var(--highlight)',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "今日"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                        lineNumber: 184,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            fontFamily: 'monospace'
                                        },
                                        children: inventory.salesToday || 0
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                        lineNumber: 185,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 176,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px',
                                    background: 'var(--highlight)',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "週間"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                        lineNumber: 197,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            fontFamily: 'monospace'
                                        },
                                        children: inventory.salesWeek || 0
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                        lineNumber: 198,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px',
                                    background: 'var(--highlight)',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "月間"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                        lineNumber: 210,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            fontFamily: 'monospace'
                                        },
                                        children: inventory.salesMonth || 0
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                        lineNumber: 211,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    inventory.averageDailySales !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: '8px',
                            fontSize: '11px',
                            color: 'var(--text-muted)'
                        },
                        children: [
                            "平均日販: ",
                            inventory.averageDailySales.toFixed(1),
                            " 個/日",
                            inventory.currentStock > 0 && inventory.averageDailySales > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    marginLeft: '8px'
                                },
                                children: [
                                    "(残り約 ",
                                    Math.floor(inventory.currentStock / inventory.averageDailySales),
                                    " 日分)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 220,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this),
            movements.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 242,
                                columnNumber: 13
                            }, this),
                            "変動履歴"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                        lineNumber: 231,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: 'var(--highlight)',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        },
                        children: movements.slice(0, 5).map((movement, index)=>{
                            const config = MOVEMENT_TYPE_CONFIG[movement.type];
                            const Icon = config.icon;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px 12px',
                                    borderBottom: index < movements.length - 1 ? '1px solid var(--panel-border)' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: "".concat(config.color, "20"),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            size: 12,
                                            style: {
                                                color: config.color
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                            lineNumber: 277,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                        lineNumber: 266,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '12px',
                                                    fontWeight: 500
                                                },
                                                children: [
                                                    config.label,
                                                    movement.source && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text-muted)',
                                                            fontWeight: 400,
                                                            marginLeft: '6px'
                                                        },
                                                        children: [
                                                            "(",
                                                            movement.source,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                                        lineNumber: 283,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                                lineNumber: 280,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: 'var(--text-muted)'
                                                },
                                                children: new Date(movement.createdAt).toLocaleString('ja-JP')
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                                lineNumber: 288,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                        lineNumber: 279,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '12px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: 'var(--text-muted)'
                                                },
                                                children: movement.quantityBefore
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                                lineNumber: 293,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                size: 10,
                                                style: {
                                                    color: 'var(--text-muted)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                                lineNumber: 294,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontWeight: 600
                                                },
                                                children: movement.quantityAfter
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                                lineNumber: 295,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    marginLeft: '6px',
                                                    fontWeight: 600,
                                                    color: movement.quantityChange > 0 ? 'var(--color-success)' : 'var(--color-error)'
                                                },
                                                children: [
                                                    movement.quantityChange > 0 ? '+' : '',
                                                    movement.quantityChange
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                                lineNumber: 296,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                        lineNumber: 292,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, movement.id, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 256,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                        lineNumber: 245,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                lineNumber: 230,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '8px',
                    marginTop: '8px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: onRefresh,
                        style: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 316,
                                columnNumber: 11
                            }, this),
                            "更新"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                        lineNumber: 315,
                        columnNumber: 9
                    }, this),
                    isLowStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "warning",
                        size: "sm",
                        onClick: onOrderStock,
                        style: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                                lineNumber: 321,
                                columnNumber: 13
                            }, this),
                            "発注"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                        lineNumber: 320,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
});
_c1 = InventoryStatusPanel;
const __TURBOPACK__default__export__ = InventoryStatusPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "InventoryStatusPanel$memo");
__turbopack_context__.k.register(_c1, "InventoryStatusPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/linked/customer-info-panel.tsx
/**
 * CustomerInfoPanel - 顧客情報パネル (Container)
 * 顧客の詳細情報、購入履歴、問い合わせ履歴
 */ __turbopack_context__.s([
    "CustomerInfoPanel",
    ()=>CustomerInfoPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-detail-row.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/operations-badges.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
// 顧客ステータス設定
const CUSTOMER_STATUS_CONFIG = {
    vip: {
        label: 'VIP',
        color: 'var(--color-warning)',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"]
    },
    regular: {
        label: '通常',
        color: 'var(--text-muted)',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
    },
    new: {
        label: '新規',
        color: 'var(--color-primary)',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
    },
    problem: {
        label: '注意',
        color: 'var(--color-error)',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"]
    }
};
const CustomerInfoPanel = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function CustomerInfoPanel(param) {
    let { customer, orderHistory = [], isLoading = false, onViewOrders, onViewInquiries, onSendMessage } = param;
    var _customer_totalSpent, _customer_averageOrderValue;
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "読み込み中..."
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
            lineNumber: 53,
            columnNumber: 7
        }, this);
    }
    if (!customer) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "顧客情報がありません"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this);
    }
    const statusConfig = CUSTOMER_STATUS_CONFIG[customer.status || 'regular'];
    const StatusIcon = statusConfig.icon;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '16px',
                    background: 'var(--highlight)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: 'var(--panel)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                            size: 28,
                            style: {
                                color: 'var(--text-muted)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '16px',
                                            fontWeight: 600
                                        },
                                        children: customer.name
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                        variant: customer.status === 'vip' ? 'warning' : customer.status === 'problem' ? 'error' : 'secondary',
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusIcon, {
                                                size: 10
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                                lineNumber: 102,
                                                columnNumber: 15
                                            }, this),
                                            statusConfig.label
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                        lineNumber: 99,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '12px',
                                    color: 'var(--text-muted)',
                                    fontFamily: 'monospace'
                                },
                                children: customer.customerId
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this),
                            customer.marketplace && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: '6px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$operations$2d$badges$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceBadge"], {
                                    marketplace: customer.marketplace,
                                    size: "sm"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                    lineNumber: 111,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 110,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this),
                            "連絡先"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gap: '4px'
                        },
                        children: [
                            customer.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                label: "メール",
                                value: customer.email,
                                copyable: true
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this),
                            customer.phone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$detail$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3DetailRow"], {
                                label: "電話",
                                value: customer.phone,
                                copyable: true
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 138,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            customer.address && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this),
                            "配送先住所"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 146,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '12px',
                            background: 'var(--highlight)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap'
                        },
                        children: [
                            customer.address,
                            customer.country && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: '8px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                    variant: "secondary",
                                    children: customer.country
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                    lineNumber: 173,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 172,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 160,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                lineNumber: 145,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this),
                            "購入統計"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '8px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px',
                                    background: 'var(--highlight)',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "総購入回数"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                        lineNumber: 211,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '20px',
                                            fontWeight: 600,
                                            fontFamily: 'monospace'
                                        },
                                        children: customer.totalOrders || 0
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px',
                                    background: 'var(--highlight)',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "総購入金額"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                        lineNumber: 224,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '20px',
                                            fontWeight: 600,
                                            fontFamily: 'monospace'
                                        },
                                        children: [
                                            "$",
                                            ((_customer_totalSpent = customer.totalSpent) === null || _customer_totalSpent === void 0 ? void 0 : _customer_totalSpent.toLocaleString()) || 0
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                        lineNumber: 225,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 216,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px',
                                    background: 'var(--highlight)',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "問い合わせ数"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                        lineNumber: 237,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '20px',
                                            fontWeight: 600,
                                            fontFamily: 'monospace'
                                        },
                                        children: customer.totalInquiries || 0
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px',
                                    background: 'var(--highlight)',
                                    borderRadius: '6px',
                                    textAlign: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "平均購入額"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                        lineNumber: 250,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '20px',
                                            fontWeight: 600,
                                            fontFamily: 'monospace'
                                        },
                                        children: [
                                            "$",
                                            ((_customer_averageOrderValue = customer.averageOrderValue) === null || _customer_averageOrderValue === void 0 ? void 0 : _customer_averageOrderValue.toLocaleString()) || 0
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                        lineNumber: 251,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this),
                    customer.firstOrderDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: '8px',
                            fontSize: '11px',
                            color: 'var(--text-muted)'
                        },
                        children: [
                            "初回購入: ",
                            new Date(customer.firstOrderDate).toLocaleDateString('ja-JP'),
                            customer.lastOrderDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    marginLeft: '12px'
                                },
                                children: [
                                    "最終購入: ",
                                    new Date(customer.lastOrderDate).toLocaleDateString('ja-JP')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 260,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this),
            orderHistory.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 282,
                                columnNumber: 13
                            }, this),
                            "最近の購入"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 271,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: 'var(--highlight)',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        },
                        children: orderHistory.slice(0, 5).map((order, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '10px 12px',
                                    borderBottom: index < orderHistory.length - 1 ? '1px solid var(--panel-border)' : 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    fontFamily: 'monospace'
                                                },
                                                children: order.orderId
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                                lineNumber: 304,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: 'var(--text-muted)'
                                                },
                                                children: [
                                                    new Date(order.orderDate).toLocaleDateString('ja-JP'),
                                                    order.itemCount && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            marginLeft: '8px'
                                                        },
                                                        children: [
                                                            order.itemCount,
                                                            "点"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                                        lineNumber: 310,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                                lineNumber: 307,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                        lineNumber: 303,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            textAlign: 'right'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    fontFamily: 'monospace'
                                                },
                                                children: [
                                                    "$",
                                                    order.totalAmount.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                                lineNumber: 315,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                                variant: order.status === 'completed' || order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'secondary',
                                                children: order.status
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                                lineNumber: 318,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                        lineNumber: 314,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, order.orderId, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 293,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 285,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                lineNumber: 270,
                columnNumber: 9
            }, this),
            customer.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        style: {
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '8px'
                        },
                        children: "メモ"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 339,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '12px',
                            background: 'rgba(245, 158, 11, 0.1)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            lineHeight: 1.5,
                            border: '1px solid rgba(245, 158, 11, 0.2)'
                        },
                        children: customer.notes
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 349,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                lineNumber: 338,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '8px',
                    marginTop: '8px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: onViewOrders,
                        style: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 367,
                                columnNumber: 11
                            }, this),
                            "注文履歴"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 366,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "secondary",
                        size: "sm",
                        onClick: onViewInquiries,
                        style: {
                            flex: 1
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                size: 14
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                                lineNumber: 371,
                                columnNumber: 11
                            }, this),
                            "問い合わせ"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 370,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                        variant: "primary",
                        size: "sm",
                        onClick: onSendMessage,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                            lineNumber: 375,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                        lineNumber: 374,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
                lineNumber: 365,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
});
_c1 = CustomerInfoPanel;
const __TURBOPACK__default__export__ = CustomerInfoPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "CustomerInfoPanel$memo");
__turbopack_context__.k.register(_c1, "CustomerInfoPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/linked/history-panel.tsx
/**
 * HistoryPanel - 履歴パネル (Container)
 * 受注・出荷・問い合わせの履歴を時系列で表示
 */ __turbopack_context__.s([
    "HistoryPanel",
    ()=>HistoryPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// 履歴タイプ設定
const HISTORY_TYPE_CONFIG = {
    order: {
        label: '受注',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
        color: 'var(--color-primary)'
    },
    shipping: {
        label: '出荷',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"],
        color: 'var(--color-success)'
    },
    inquiry: {
        label: '問合せ',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"],
        color: 'var(--color-warning)'
    },
    status_change: {
        label: 'ステータス',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"],
        color: 'var(--text-muted)'
    },
    note: {
        label: 'メモ',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
        color: 'var(--text-muted)'
    }
};
// ステータスアイコン
const STATUS_ICON_CONFIG = {
    success: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"],
        color: 'var(--color-success)'
    },
    error: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
        color: 'var(--color-error)'
    },
    warning: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
        color: 'var(--color-warning)'
    },
    info: {
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
        color: 'var(--color-primary)'
    }
};
const HistoryPanel = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function HistoryPanel(param) {
    let { items, isLoading = false, onItemClick, onLoadMore, hasMore = false } = param;
    _s();
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [expandedItems, setExpandedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const toggleExpand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HistoryPanel.HistoryPanel.useCallback[toggleExpand]": (id)=>{
            setExpandedItems({
                "HistoryPanel.HistoryPanel.useCallback[toggleExpand]": (prev)=>{
                    const next = new Set(prev);
                    if (next.has(id)) {
                        next.delete(id);
                    } else {
                        next.add(id);
                    }
                    return next;
                }
            }["HistoryPanel.HistoryPanel.useCallback[toggleExpand]"]);
        }
    }["HistoryPanel.HistoryPanel.useCallback[toggleExpand]"], []);
    const filteredItems = filter === 'all' ? items : items.filter((item)=>item.type === filter);
    // 日付でグループ化
    const groupedItems = filteredItems.reduce((acc, item)=>{
        const date = new Date(item.timestamp).toLocaleDateString('ja-JP');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});
    if (isLoading && items.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "読み込み中..."
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, this);
    }
    if (items.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '24px',
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "履歴がありません"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
            lineNumber: 101,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--panel-border)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setFilter('all'),
                        style: {
                            padding: '4px 10px',
                            borderRadius: '12px',
                            border: 'none',
                            background: filter === 'all' ? 'var(--color-primary)' : 'var(--highlight)',
                            color: filter === 'all' ? 'white' : 'var(--text-muted)',
                            fontSize: '11px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        },
                        children: "すべて"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    Object.keys(HISTORY_TYPE_CONFIG).map((type)=>{
                        const config = HISTORY_TYPE_CONFIG[type];
                        const count = items.filter((i)=>i.type === type).length;
                        if (count === 0) return null;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setFilter(type),
                            style: {
                                padding: '4px 10px',
                                borderRadius: '12px',
                                border: 'none',
                                background: filter === type ? config.color : 'var(--highlight)',
                                color: filter === type ? 'white' : 'var(--text-muted)',
                                fontSize: '11px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            },
                            children: [
                                config.label,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        opacity: 0.7
                                    },
                                    children: [
                                        "(",
                                        count,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                    lineNumber: 157,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, type, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                            lineNumber: 139,
                            columnNumber: 13
                        }, this);
                    })
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                },
                children: Object.entries(groupedItems).map((param)=>{
                    let [date, dateItems] = param;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)',
                                    marginBottom: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                        lineNumber: 179,
                                        columnNumber: 15
                                    }, this),
                                    date
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'relative',
                                    paddingLeft: '20px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'absolute',
                                            left: '6px',
                                            top: '12px',
                                            bottom: '12px',
                                            width: '2px',
                                            background: 'var(--panel-border)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                        lineNumber: 191,
                                        columnNumber: 15
                                    }, this),
                                    dateItems.map((item, index)=>{
                                        const typeConfig = HISTORY_TYPE_CONFIG[item.type];
                                        const TypeIcon = typeConfig.icon;
                                        const statusConfig = item.statusIcon ? STATUS_ICON_CONFIG[item.statusIcon] : null;
                                        const isExpanded = expandedItems.has(item.id);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: 'relative',
                                                marginBottom: index < dateItems.length - 1 ? '12px' : 0
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        position: 'absolute',
                                                        left: '-14px',
                                                        top: '10px',
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        background: typeConfig.color,
                                                        border: '2px solid var(--panel)'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        background: 'var(--highlight)',
                                                        borderRadius: '8px',
                                                        padding: '10px 12px',
                                                        cursor: item.details ? 'pointer' : 'default'
                                                    },
                                                    onClick: ()=>{
                                                        if (item.details) toggleExpand(item.id);
                                                        onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(item);
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: '8px'
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        width: '24px',
                                                                        height: '24px',
                                                                        borderRadius: '6px',
                                                                        background: "".concat(typeConfig.color, "20"),
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        flexShrink: 0
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypeIcon, {
                                                                        size: 12,
                                                                        style: {
                                                                            color: typeConfig.color
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                        lineNumber: 259,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                    lineNumber: 247,
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
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: '6px',
                                                                                marginBottom: '2px'
                                                                            },
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    style: {
                                                                                        fontSize: '12px',
                                                                                        fontWeight: 500
                                                                                    },
                                                                                    children: item.title
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                                    lineNumber: 263,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                statusConfig && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(statusConfig.icon, {
                                                                                    size: 12,
                                                                                    style: {
                                                                                        color: statusConfig.color
                                                                                    }
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                                    lineNumber: 267,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                            lineNumber: 262,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            style: {
                                                                                fontSize: '11px',
                                                                                color: 'var(--text-muted)'
                                                                            },
                                                                            children: item.description
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                            lineNumber: 270,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            style: {
                                                                                fontSize: '10px',
                                                                                color: 'var(--text-muted)',
                                                                                marginTop: '4px'
                                                                            },
                                                                            children: [
                                                                                new Date(item.timestamp).toLocaleTimeString('ja-JP', {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit'
                                                                                }),
                                                                                item.actor && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    style: {
                                                                                        marginLeft: '8px'
                                                                                    },
                                                                                    children: [
                                                                                        "by ",
                                                                                        item.actor
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                                    lineNumber: 279,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                            lineNumber: 273,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                    lineNumber: 261,
                                                                    columnNumber: 25
                                                                }, this),
                                                                item.details && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: (e)=>{
                                                                        e.stopPropagation();
                                                                        toggleExpand(item.id);
                                                                    },
                                                                    style: {
                                                                        background: 'transparent',
                                                                        border: 'none',
                                                                        padding: '2px',
                                                                        cursor: 'pointer',
                                                                        color: 'var(--text-muted)'
                                                                    },
                                                                    children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                        lineNumber: 297,
                                                                        columnNumber: 43
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                        size: 14
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                        lineNumber: 297,
                                                                        columnNumber: 69
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                    lineNumber: 284,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                            lineNumber: 246,
                                                            columnNumber: 23
                                                        }, this),
                                                        isExpanded && item.details && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                marginTop: '10px',
                                                                paddingTop: '10px',
                                                                borderTop: '1px solid var(--panel-border)',
                                                                fontSize: '11px',
                                                                color: 'var(--text-muted)',
                                                                lineHeight: 1.5
                                                            },
                                                            children: typeof item.details === 'string' ? item.details : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    display: 'grid',
                                                                    gap: '4px'
                                                                },
                                                                children: Object.entries(item.details).map((param)=>{
                                                                    let [key, value] = param;
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        style: {
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between'
                                                                        },
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: key
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                                lineNumber: 320,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    color: 'var(--text)',
                                                                                    fontWeight: 500
                                                                                },
                                                                                children: String(value)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                                lineNumber: 321,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, key, true, {
                                                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                        lineNumber: 319,
                                                                        columnNumber: 33
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                lineNumber: 317,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                            lineNumber: 304,
                                                            columnNumber: 25
                                                        }, this),
                                                        item.relatedId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                marginTop: '8px'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                                                variant: "secondary",
                                                                style: {
                                                                    fontSize: '9px'
                                                                },
                                                                children: item.relatedId
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                                lineNumber: 334,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                            lineNumber: 333,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                            lineNumber: 211,
                                            columnNumber: 19
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                                lineNumber: 184,
                                columnNumber: 13
                            }, this)
                        ]
                    }, date, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                        lineNumber: 166,
                        columnNumber: 11
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            hasMore && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                variant: "secondary",
                size: "sm",
                onClick: onLoadMore,
                disabled: isLoading,
                style: {
                    alignSelf: 'center'
                },
                children: isLoading ? '読み込み中...' : 'さらに表示'
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
                lineNumber: 350,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}, "B5fD161mMdcLh19fb5d1o0oJRog=")), "B5fD161mMdcLh19fb5d1o0oJRog=");
_c1 = HistoryPanel;
const __TURBOPACK__default__export__ = HistoryPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "HistoryPanel$memo");
__turbopack_context__.k.register(_c1, "HistoryPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/components/linked/index.ts
/**
 * 連動データパネルコンポーネント (Container)
 * 右サイドオーバーレイで表示する関連情報
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$product$2d$info$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$inventory$2d$status$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$customer$2d$info$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$history$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/layouts/operations-n3-page-layout.tsx
/**
 * OperationsN3PageLayout - オペレーション統合ページレイアウト
 * 3列構成: リスト | 詳細作業 | 連動データ(オーバーレイ)
 *
 * ゴールドスタンダード準拠: useOperationsIntegrated フックを使用
 */ __turbopack_context__.s([
    "OperationsN3PageLayout",
    ()=>OperationsN3PageLayout,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/truck.js [app-client] (ecmascript) <export default as Truck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$side$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/n3-side-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$hooks$2f$use$2d$operations$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/hooks/use-operations-integrated.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$hooks$2f$use$2d$linked$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/hooks/use-linked-data.ts [app-client] (ecmascript)");
// Tool Panels
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$l3$2d$tabs$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$l3$2d$tabs$2f$orders$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/orders-tool-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$l3$2d$tabs$2f$shipping$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/shipping-tool-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$l3$2d$tabs$2f$inquiry$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/l3-tabs/inquiry-tool-panel.tsx [app-client] (ecmascript)");
// Cards
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$order$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/order-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$shipping$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/shipping-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$inquiry$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/cards/inquiry-card.tsx [app-client] (ecmascript)");
// Detail Panels
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$panels$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$panels$2f$order$2d$detail$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/order-detail-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$panels$2f$shipping$2d$work$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/shipping-work-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$panels$2f$inquiry$2d$response$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/panels/inquiry-response-panel.tsx [app-client] (ecmascript)");
// Linked Panels
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$product$2d$info$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/product-info-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$inventory$2d$status$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/inventory-status-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$customer$2d$info$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/customer-info-panel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$history$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/components/linked/history-panel.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
const OperationsN3PageLayout = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function OperationsN3PageLayout(param) {
    let { className = '' } = param;
    _s();
    // ゴールドスタンダード: 統合フックを使用
    const { orders, shippingItems, inquiries, stats, isLoading, error, activeTab, setActiveTab, selectedOrderId, selectedShippingId, selectedInquiryId, selectOrder: handleSelectOrder, selectShipping: handleSelectShipping, selectInquiry: handleSelectInquiry, updateOrderStatus, updateShippingStatus, sendResponse, refresh } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$hooks$2f$use$2d$operations$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsIntegrated"])();
    // 選択されたアイテムを取得
    const selectedOrder = orders.find((o)=>o.id === selectedOrderId) || null;
    const selectedShipping = shippingItems.find((s)=>s.id === selectedShippingId) || null;
    const selectedInquiry = inquiries.find((i)=>i.id === selectedInquiryId) || null;
    // レガシーフック互換のラッパー
    const selectOrder = (id)=>handleSelectOrder(id);
    const selectShipping = (id)=>handleSelectShipping(id);
    const selectInquiry = (id)=>handleSelectInquiry(id);
    const updateOrder = (id, updates)=>updateOrderStatus(id, updates.status || 'processing');
    const markOrderShipped = (id)=>updateOrderStatus(id, 'shipped');
    const updateShipping = (id, updates)=>updateShippingStatus(id, updates.status || 'processing');
    const markShippingComplete = (id)=>updateShippingStatus(id, 'delivered');
    const sendInquiryResponse = (id, response)=>sendResponse(id, response);
    const markInquiryResolved = (id)=>sendResponse(id, '[解決済み]');
    // currentTab互換
    const currentTab = activeTab;
    const setCurrentTab = setActiveTab;
    // 連動データフック
    const { product, inventory, movements, customer, orderHistory, history, messages, templates, isLoadingProduct, isLoadingInventory, isLoadingCustomer, isLoadingHistory, hasMoreHistory, fetchProduct, fetchInventory, fetchCustomer, fetchHistory, loadMoreHistory, fetchMessages, fetchTemplates } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$hooks$2f$use$2d$linked$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLinkedData"])();
    // 連動パネルステート
    const [linkedPanelType, setLinkedPanelType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [linkedPanelTitle, setLinkedPanelTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // 連動パネルを開く
    const openLinkedPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OperationsN3PageLayout.OperationsN3PageLayout.useCallback[openLinkedPanel]": async (type, item)=>{
            if (!type) return;
            setLinkedPanelType(type);
            switch(type){
                case 'product':
                    var _item_items_;
                    setLinkedPanelTitle('商品情報');
                    const sku = 'items' in item ? (_item_items_ = item.items[0]) === null || _item_items_ === void 0 ? void 0 : _item_items_.sku : item.productSku;
                    if (sku) await fetchProduct(sku);
                    break;
                case 'inventory':
                    var _item_items_1;
                    setLinkedPanelTitle('在庫状況');
                    const invSku = 'items' in item ? (_item_items_1 = item.items[0]) === null || _item_items_1 === void 0 ? void 0 : _item_items_1.sku : item.productSku;
                    if (invSku) await fetchInventory(invSku);
                    break;
                case 'customer':
                    setLinkedPanelTitle('顧客情報');
                    await fetchCustomer(item.customerId || item.customerName);
                    break;
                case 'history':
                    setLinkedPanelTitle('履歴');
                    await fetchHistory(item.id);
                    break;
            }
        }
    }["OperationsN3PageLayout.OperationsN3PageLayout.useCallback[openLinkedPanel]"], [
        fetchProduct,
        fetchInventory,
        fetchCustomer,
        fetchHistory
    ]);
    // 連動パネルを閉じる
    const closeLinkedPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OperationsN3PageLayout.OperationsN3PageLayout.useCallback[closeLinkedPanel]": ()=>{
            setLinkedPanelType(null);
        }
    }["OperationsN3PageLayout.OperationsN3PageLayout.useCallback[closeLinkedPanel]"], []);
    // 受注から連動データを開く
    const handleOrderOpenLinkedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OperationsN3PageLayout.OperationsN3PageLayout.useCallback[handleOrderOpenLinkedData]": (order)=>{
            openLinkedPanel('product', order);
        }
    }["OperationsN3PageLayout.OperationsN3PageLayout.useCallback[handleOrderOpenLinkedData]"], [
        openLinkedPanel
    ]);
    // 出荷から連動データを開く
    const handleShippingOpenLinkedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OperationsN3PageLayout.OperationsN3PageLayout.useCallback[handleShippingOpenLinkedData]": (item)=>{
            openLinkedPanel('product', item);
        }
    }["OperationsN3PageLayout.OperationsN3PageLayout.useCallback[handleShippingOpenLinkedData]"], [
        openLinkedPanel
    ]);
    // 問い合わせから連動データを開く
    const handleInquiryOpenLinkedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OperationsN3PageLayout.OperationsN3PageLayout.useCallback[handleInquiryOpenLinkedData]": (inquiry)=>{
            if (inquiry.orderId) {
                const relatedOrder = orders.find({
                    "OperationsN3PageLayout.OperationsN3PageLayout.useCallback[handleInquiryOpenLinkedData].relatedOrder": (o)=>o.orderId === inquiry.orderId
                }["OperationsN3PageLayout.OperationsN3PageLayout.useCallback[handleInquiryOpenLinkedData].relatedOrder"]);
                if (relatedOrder) {
                    selectOrder(relatedOrder.id);
                    setCurrentTab('orders');
                }
            }
        }
    }["OperationsN3PageLayout.OperationsN3PageLayout.useCallback[handleInquiryOpenLinkedData]"], [
        orders,
        selectOrder,
        setCurrentTab
    ]);
    // AI下書き生成
    const handleGenerateAIDraft = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OperationsN3PageLayout.OperationsN3PageLayout.useCallback[handleGenerateAIDraft]": async (inquiryId)=>{
            var _result_data;
            const response = await fetch('/api/inquiry/generate-draft', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inquiry_id: inquiryId
                })
            });
            const result = await response.json();
            return ((_result_data = result.data) === null || _result_data === void 0 ? void 0 : _result_data.draft) || '';
        }
    }["OperationsN3PageLayout.OperationsN3PageLayout.useCallback[handleGenerateAIDraft]"], []);
    // タブ切替時の処理
    const handleTabChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OperationsN3PageLayout.OperationsN3PageLayout.useCallback[handleTabChange]": (tab)=>{
            setCurrentTab(tab);
            closeLinkedPanel();
        }
    }["OperationsN3PageLayout.OperationsN3PageLayout.useCallback[handleTabChange]"], [
        setCurrentTab,
        closeLinkedPanel
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: 'var(--bg)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3TabsRoot"], {
                value: currentTab,
                onValueChange: handleTabChange,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            borderBottom: '1px solid var(--panel-border)',
                            background: 'var(--panel)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3TabsList"], {
                            style: {
                                padding: '8px 16px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3TabsTrigger"], {
                                    value: "orders",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                            lineNumber: 215,
                                            columnNumber: 15
                                        }, this),
                                        "受注管理",
                                        (stats === null || stats === void 0 ? void 0 : stats.orders.total) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                marginLeft: '8px',
                                                opacity: 0.7
                                            },
                                            children: [
                                                "(",
                                                stats.orders.total,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                            lineNumber: 218,
                                            columnNumber: 17
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3TabsTrigger"], {
                                    value: "shipping",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$truck$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Truck$3e$__["Truck"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                            lineNumber: 224,
                                            columnNumber: 15
                                        }, this),
                                        "出荷管理",
                                        (stats === null || stats === void 0 ? void 0 : stats.shipping.pending) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                marginLeft: '8px',
                                                padding: '2px 6px',
                                                background: 'var(--color-warning)',
                                                color: 'white',
                                                borderRadius: '10px',
                                                fontSize: '10px'
                                            },
                                            children: stats.shipping.pending
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                            lineNumber: 227,
                                            columnNumber: 17
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                    lineNumber: 223,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3TabsTrigger"], {
                                    value: "inquiries",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                            lineNumber: 242,
                                            columnNumber: 15
                                        }, this),
                                        "問い合わせ",
                                        (stats === null || stats === void 0 ? void 0 : stats.inquiries.unread) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                marginLeft: '8px',
                                                padding: '2px 6px',
                                                background: 'var(--color-error)',
                                                color: 'white',
                                                borderRadius: '10px',
                                                fontSize: '10px'
                                            },
                                            children: stats.inquiries.unread
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                            lineNumber: 245,
                                            columnNumber: 17
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                    lineNumber: 241,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                            lineNumber: 213,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                        lineNumber: 207,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            display: 'flex',
                            overflow: 'hidden'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3TabsContent"], {
                                value: "orders",
                                style: {
                                    flex: 1,
                                    display: 'flex',
                                    overflow: 'hidden'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '400px',
                                            minWidth: '320px',
                                            borderRight: '1px solid var(--panel-border)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            overflow: 'hidden'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$l3$2d$tabs$2f$orders$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrdersToolPanel"], {
                                                stats: (stats === null || stats === void 0 ? void 0 : stats.orders) || null,
                                                onRefresh: refresh,
                                                isLoading: isLoading
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                lineNumber: 277,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1,
                                                    overflow: 'auto',
                                                    padding: '8px'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '8px'
                                                    },
                                                    children: [
                                                        orders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$order$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrderCard"], {
                                                                order: order,
                                                                selected: (selectedOrder === null || selectedOrder === void 0 ? void 0 : selectedOrder.id) === order.id,
                                                                onClick: ()=>selectOrder(order.id),
                                                                onOpenLinkedData: handleOrderOpenLinkedData
                                                            }, order.id, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                                lineNumber: 285,
                                                                columnNumber: 21
                                                            }, this)),
                                                        orders.length === 0 && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                padding: '24px',
                                                                textAlign: 'center',
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: "受注がありません"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                            lineNumber: 294,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                lineNumber: 282,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                        lineNumber: 267,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            overflow: 'hidden'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$panels$2f$order$2d$detail$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrderDetailPanel"], {
                                            order: selectedOrder,
                                            onUpdateOrder: updateOrder,
                                            onMarkShipped: markOrderShipped,
                                            onOpenInquiry: (order)=>{
                                                const inquiry = inquiries.find((i)=>i.orderId === order.orderId);
                                                if (inquiry) {
                                                    selectInquiry(inquiry.id);
                                                    setCurrentTab('inquiries');
                                                }
                                            },
                                            onOpenLinkedData: handleOrderOpenLinkedData
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                            lineNumber: 304,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                        lineNumber: 303,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                lineNumber: 265,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3TabsContent"], {
                                value: "shipping",
                                style: {
                                    flex: 1,
                                    display: 'flex',
                                    overflow: 'hidden'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '400px',
                                            minWidth: '320px',
                                            borderRight: '1px solid var(--panel-border)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            overflow: 'hidden'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$l3$2d$tabs$2f$shipping$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShippingToolPanel"], {
                                                stats: (stats === null || stats === void 0 ? void 0 : stats.shipping) || null,
                                                onRefresh: refresh,
                                                isLoading: isLoading
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                lineNumber: 333,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1,
                                                    overflow: 'auto',
                                                    padding: '8px'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '8px'
                                                    },
                                                    children: [
                                                        shippingItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$shipping$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShippingCard"], {
                                                                item: item,
                                                                selected: (selectedShipping === null || selectedShipping === void 0 ? void 0 : selectedShipping.id) === item.id,
                                                                onClick: ()=>selectShipping(item.id)
                                                            }, item.id, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                                lineNumber: 341,
                                                                columnNumber: 21
                                                            }, this)),
                                                        shippingItems.length === 0 && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                padding: '24px',
                                                                textAlign: 'center',
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: "出荷アイテムがありません"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                            lineNumber: 349,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                    lineNumber: 339,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                lineNumber: 338,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                        lineNumber: 323,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            overflow: 'hidden'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$panels$2f$shipping$2d$work$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShippingWorkPanel"], {
                                            item: selectedShipping,
                                            onUpdateItem: updateShipping,
                                            onMarkShipped: markShippingComplete,
                                            onPrintLabel: (id)=>{
                                                console.log('Print label:', id);
                                            },
                                            onOpenLinkedData: handleShippingOpenLinkedData
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                            lineNumber: 359,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                        lineNumber: 358,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                lineNumber: 321,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3TabsContent"], {
                                value: "inquiries",
                                style: {
                                    flex: 1,
                                    display: 'flex',
                                    overflow: 'hidden'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '400px',
                                            minWidth: '320px',
                                            borderRight: '1px solid var(--panel-border)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            overflow: 'hidden'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$l3$2d$tabs$2f$inquiry$2d$tool$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InquiryToolPanel"], {
                                                stats: (stats === null || stats === void 0 ? void 0 : stats.inquiries) || null,
                                                onRefresh: refresh,
                                                isLoading: isLoading
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                lineNumber: 384,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    flex: 1,
                                                    overflow: 'auto',
                                                    padding: '8px'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '8px'
                                                    },
                                                    children: [
                                                        inquiries.map((inquiry)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$cards$2f$inquiry$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InquiryCard"], {
                                                                inquiry: inquiry,
                                                                selected: (selectedInquiry === null || selectedInquiry === void 0 ? void 0 : selectedInquiry.id) === inquiry.id,
                                                                onClick: ()=>{
                                                                    selectInquiry(inquiry.id);
                                                                    fetchMessages(inquiry.id);
                                                                    fetchTemplates(inquiry.aiCategory);
                                                                }
                                                            }, inquiry.id, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                                lineNumber: 392,
                                                                columnNumber: 21
                                                            }, this)),
                                                        inquiries.length === 0 && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                padding: '24px',
                                                                textAlign: 'center',
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: "問い合わせがありません"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                            lineNumber: 404,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                    lineNumber: 390,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                                lineNumber: 389,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                        lineNumber: 374,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            overflow: 'hidden'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$panels$2f$inquiry$2d$response$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InquiryResponsePanel"], {
                                            inquiry: selectedInquiry,
                                            messages: messages,
                                            templates: templates,
                                            onSendResponse: sendInquiryResponse,
                                            onGenerateAIDraft: handleGenerateAIDraft,
                                            onMarkResolved: markInquiryResolved,
                                            onOpenLinkedData: handleInquiryOpenLinkedData
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                            lineNumber: 414,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                        lineNumber: 413,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$side$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3SidePanel"], {
                isOpen: linkedPanelType !== null,
                onClose: closeLinkedPanel,
                title: linkedPanelTitle,
                position: "right",
                width: 380,
                children: [
                    linkedPanelType === 'product' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$product$2d$info$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductInfoPanel"], {
                        product: product,
                        isLoading: isLoadingProduct,
                        onOpenOriginal: (url)=>window.open(url, '_blank'),
                        onOpenStock: ()=>{
                            if (product === null || product === void 0 ? void 0 : product.sku) {
                                openLinkedPanel('inventory', selectedOrder || selectedShipping || selectedInquiry);
                            }
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                        lineNumber: 437,
                        columnNumber: 11
                    }, this),
                    linkedPanelType === 'inventory' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$inventory$2d$status$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InventoryStatusPanel"], {
                        inventory: inventory,
                        movements: movements,
                        isLoading: isLoadingInventory,
                        onRefresh: ()=>{
                            if (product === null || product === void 0 ? void 0 : product.sku) fetchInventory(product.sku);
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                        lineNumber: 450,
                        columnNumber: 11
                    }, this),
                    linkedPanelType === 'customer' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$customer$2d$info$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CustomerInfoPanel"], {
                        customer: customer,
                        orderHistory: orderHistory,
                        isLoading: isLoadingCustomer,
                        onViewOrders: ()=>console.log('View orders'),
                        onViewInquiries: ()=>console.log('View inquiries'),
                        onSendMessage: ()=>console.log('Send message')
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                        lineNumber: 461,
                        columnNumber: 11
                    }, this),
                    linkedPanelType === 'history' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$components$2f$linked$2f$history$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HistoryPanel"], {
                        items: history,
                        isLoading: isLoadingHistory,
                        hasMore: hasMoreHistory,
                        onLoadMore: loadMoreHistory
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                        lineNumber: 472,
                        columnNumber: 11
                    }, this),
                    linkedPanelType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'sticky',
                            bottom: 0,
                            padding: '12px 0',
                            borderTop: '1px solid var(--panel-border)',
                            background: 'var(--panel)',
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>openLinkedPanel('product', selectedOrder || selectedShipping || selectedInquiry),
                                style: {
                                    background: linkedPanelType === 'product' ? 'var(--color-primary)' : 'var(--highlight)',
                                    color: linkedPanelType === 'product' ? 'white' : 'var(--text-muted)',
                                    border: 'none',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                        lineNumber: 509,
                                        columnNumber: 15
                                    }, this),
                                    "商品"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                lineNumber: 494,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>openLinkedPanel('inventory', selectedOrder || selectedShipping || selectedInquiry),
                                style: {
                                    background: linkedPanelType === 'inventory' ? 'var(--color-primary)' : 'var(--highlight)',
                                    color: linkedPanelType === 'inventory' ? 'white' : 'var(--text-muted)',
                                    border: 'none',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                        lineNumber: 527,
                                        columnNumber: 15
                                    }, this),
                                    "在庫"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                lineNumber: 512,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>openLinkedPanel('customer', selectedOrder || selectedShipping || selectedInquiry),
                                style: {
                                    background: linkedPanelType === 'customer' ? 'var(--color-primary)' : 'var(--highlight)',
                                    color: linkedPanelType === 'customer' ? 'white' : 'var(--text-muted)',
                                    border: 'none',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                        lineNumber: 545,
                                        columnNumber: 15
                                    }, this),
                                    "顧客"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                lineNumber: 530,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>openLinkedPanel('history', selectedOrder || selectedShipping || selectedInquiry),
                                style: {
                                    background: linkedPanelType === 'history' ? 'var(--color-primary)' : 'var(--highlight)',
                                    color: linkedPanelType === 'history' ? 'white' : 'var(--text-muted)',
                                    border: 'none',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '11px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        size: 12
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                        lineNumber: 563,
                                        columnNumber: 15
                                    }, this),
                                    "履歴"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                                lineNumber: 548,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                        lineNumber: 482,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                lineNumber: 429,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--color-error)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 10000
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                        lineNumber: 589,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>window.location.reload(),
                        style: {
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer'
                        },
                        children: "再読み込み"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                        lineNumber: 590,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
                lineNumber: 572,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx",
        lineNumber: 196,
        columnNumber: 5
    }, this);
}, "uNUkEKEUSm8ZOtPtMeXt9quduPY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$hooks$2f$use$2d$operations$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsIntegrated"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$hooks$2f$use$2d$linked$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLinkedData"]
    ];
})), "uNUkEKEUSm8ZOtPtMeXt9quduPY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$hooks$2f$use$2d$operations$2d$integrated$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useOperationsIntegrated"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$hooks$2f$use$2d$linked$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLinkedData"]
    ];
});
_c1 = OperationsN3PageLayout;
const __TURBOPACK__default__export__ = OperationsN3PageLayout;
var _c, _c1;
__turbopack_context__.k.register(_c, "OperationsN3PageLayout$memo");
__turbopack_context__.k.register(_c1, "OperationsN3PageLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/layouts/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/layouts/index.ts
/**
 * Operations N3 - レイアウトコンポーネント
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$layouts$2f$operations$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/operations-n3/page.tsx
/**
 * Operations N3 - 統合オペレーション管理ページ
 * 受注・出荷・問い合わせを一元管理
 *
 * N3デザインシステム準拠
 * - 3層アーキテクチャ: Presentational / Container / Layout
 * - パフォーマンス最適化: React.memo, useMemo, useCallback
 * - マルチマーケットプレイス対応
 */ __turbopack_context__.s([
    "default",
    ()=>OperationsN3Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$layouts$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/layouts/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$layouts$2f$operations$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/layouts/operations-n3-page-layout.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$loading$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-loading.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-section.tsx [app-client] (ecmascript)");
;
;
;
;
;
// ローディングコンポーネント（N3Loading使用）
function OperationsLoading() {
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
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/page.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/page.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = OperationsLoading;
function OperationsN3Page() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Flex"], {
        "data-theme": "dark",
        direction: "column",
        gap: "none",
        style: {
            height: 'calc(100vh - 60px)',
            overflow: 'hidden'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OperationsLoading, {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/page.tsx",
                lineNumber: 40,
                columnNumber: 27
            }, void 0),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$operations$2d$n3$2f$layouts$2f$operations$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OperationsN3PageLayout"], {}, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/page.tsx",
                lineNumber: 41,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/page.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/operations-n3/page.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c1 = OperationsN3Page;
var _c, _c1;
__turbopack_context__.k.register(_c, "OperationsLoading");
__turbopack_context__.k.register(_c1, "OperationsN3Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/operations-n3/page.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/n3-frontend_vps/app/tools/operations-n3/page.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_ad3ae1c7._.js.map