(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/lib/condition-mapping.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Yahoo状態 → eBay状態のマッピング
__turbopack_context__.s([
    "EBAY_CONDITION_NAMES",
    ()=>EBAY_CONDITION_NAMES,
    "YAHOO_TO_EBAY_CONDITION_MAPPING",
    ()=>YAHOO_TO_EBAY_CONDITION_MAPPING,
    "convertYahooToEbayCondition",
    ()=>convertYahooToEbayCondition
]);
const YAHOO_TO_EBAY_CONDITION_MAPPING = {
    // 新品系
    '新品': {
        ebayCondition: 'New',
        conditionId: 1000
    },
    '未使用': {
        ebayCondition: 'New',
        conditionId: 1000
    },
    '未使用に近い': {
        ebayCondition: 'Like New',
        conditionId: 1500
    },
    // 中古系
    '目立った傷や汚れなし': {
        ebayCondition: 'Very Good',
        conditionId: 4000
    },
    'やや傷や汚れあり': {
        ebayCondition: 'Good',
        conditionId: 5000
    },
    '傷や汚れあり': {
        ebayCondition: 'Acceptable',
        conditionId: 6000
    },
    '全体的に状態が悪い': {
        ebayCondition: 'For Parts',
        conditionId: 7000
    },
    // デフォルト（中古）
    '中古': {
        ebayCondition: 'Used',
        conditionId: 3000
    }
};
const EBAY_CONDITION_NAMES = {
    1000: 'New (新品)',
    1500: 'Like New (未使用に近い)',
    3000: 'Used (中古)',
    4000: 'Very Good (目立った傷なし)',
    5000: 'Good (やや傷あり)',
    6000: 'Acceptable (傷あり)',
    7000: 'For Parts (ジャンク)'
};
function convertYahooToEbayCondition(yahooCondition) {
    // 完全一致を試みる
    if (YAHOO_TO_EBAY_CONDITION_MAPPING[yahooCondition]) {
        return YAHOO_TO_EBAY_CONDITION_MAPPING[yahooCondition];
    }
    // 部分一致で判定
    if (yahooCondition.includes('新品') || yahooCondition.includes('未使用')) {
        if (yahooCondition.includes('近い')) {
            return {
                ebayCondition: 'Like New',
                conditionId: 1500
            };
        }
        return {
            ebayCondition: 'New',
            conditionId: 1000
        };
    }
    if (yahooCondition.includes('目立った傷') && yahooCondition.includes('なし')) {
        return {
            ebayCondition: 'Very Good',
            conditionId: 4000
        };
    }
    if (yahooCondition.includes('やや傷')) {
        return {
            ebayCondition: 'Good',
            conditionId: 5000
        };
    }
    if (yahooCondition.includes('傷') || yahooCondition.includes('汚れ')) {
        return {
            ebayCondition: 'Acceptable',
            conditionId: 6000
        };
    }
    if (yahooCondition.includes('状態が悪い') || yahooCondition.includes('ジャンク')) {
        return {
            ebayCondition: 'For Parts',
            conditionId: 7000
        };
    }
    // デフォルト: Used
    return {
        ebayCondition: 'Used',
        conditionId: 3000
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// components/product-modal/components/Tabs/components/ai-audit-panel.tsx
/**
 * AI監査用JSONエクスポートパネル
 * 
 * 機能:
 * - 出品データを監査用JSONとして出力
 * - ワンクリックでクリップボードにコピー
 * - AI（Gemini/Claude）に直接渡せる形式
 */ __turbopack_context__.s([
    "AIAuditPanel",
    ()=>AIAuditPanel,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
// カラー定数
const T = {
    bg: '#F1F5F9',
    panel: '#ffffff',
    panelBorder: '#e2e8f0',
    text: '#1e293b',
    textMuted: '#64748b',
    accent: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b'
};
/**
 * 商品データからAI監査用JSONを生成
 */ function generateAuditData(product) {
    var _listingData_item_specifics, _listingData_item_specifics1, _listingData_shipping_policy_id;
    if (!product) return null;
    const p = product;
    const listingData = p.listing_data || {};
    const ebayData = p.ebay_api_data || {};
    const productDetails = p.product_details || {};
    // 基本情報
    const basicInfo = {
        sku: p.sku || '',
        title: p.english_title || p.title_en || p.title || '',
        titleJa: p.title || '',
        categoryId: ebayData.category_id || p.ebay_category_id || listingData.ebay_category_id || '',
        categoryName: listingData.ebay_category_name || '',
        material: productDetails.material || ((_listingData_item_specifics = listingData.item_specifics) === null || _listingData_item_specifics === void 0 ? void 0 : _listingData_item_specifics.Material) || 'Not specified',
        countryOfOrigin: ((_listingData_item_specifics1 = listingData.item_specifics) === null || _listingData_item_specifics1 === void 0 ? void 0 : _listingData_item_specifics1['Country/Region of Manufacture']) || 'Japan',
        condition: listingData.condition || listingData.condition_en || p.condition_name || 'Used',
        conditionId: listingData.condition_id || 3000,
        conditionDescriptors: listingData.condition_descriptors || null
    };
    // コスト計算
    const purchasePrice = p.purchase_price_jpy || p.cost_jpy || listingData.purchase_price_jpy || 0;
    const exchangeRate = listingData.exchange_rate || 150;
    const finalPrice = listingData.ddp_price_usd || p.ddp_price_usd || p.price_usd || 0;
    const ebayFee = finalPrice * 0.132; // 13.2%概算
    const paypalFee = finalPrice * 0.029 + 0.30; // 2.9% + $0.30
    const shippingCost = listingData.shipping_cost_usd || 0;
    const purchasePriceUsd = purchasePrice / exchangeRate;
    const estimatedProfit = finalPrice - purchasePriceUsd - ebayFee - paypalFee - shippingCost;
    const costBreakdown = {
        purchasePriceJpy: purchasePrice,
        exchangeRate: exchangeRate,
        profitMarginPercent: finalPrice > 0 ? estimatedProfit / finalPrice * 100 : 0,
        ebayFeePercent: 13.2,
        paypalFeePercent: 2.9,
        finalPriceUsd: finalPrice,
        estimatedProfitUsd: Math.round(estimatedProfit * 100) / 100
    };
    // 物流データ
    const logistics = {
        weightGrams: listingData.weight_g || p.weight_g || 100,
        dimensions: {
            lengthCm: listingData.length_cm || p.length_cm || 15,
            widthCm: listingData.width_cm || p.width_cm || 10,
            heightCm: listingData.height_cm || p.height_cm || 1
        },
        shippingPolicyId: ((_listingData_shipping_policy_id = listingData.shipping_policy_id) === null || _listingData_shipping_policy_id === void 0 ? void 0 : _listingData_shipping_policy_id.toString()) || '',
        shippingPolicyName: listingData.shipping_policy_name || '',
        shippingCostUsd: shippingCost,
        carrierCode: listingData.carrier_code || 'JAPANPOST'
    };
    // 税務データ
    const taxCompliance = {
        htsCode: listingData.hts_code || p.hts_code || '',
        htsDescription: listingData.hts_description || '',
        dutyRatePercent: listingData.duty_rate || 0,
        vatApplicable: listingData.vat_applicable || false,
        gprsRequired: listingData.gprs_required || false
    };
    // eBay API送信データ
    const inventoryItem = {
        sku: basicInfo.sku,
        product: {
            title: basicInfo.title,
            aspects: listingData.item_specifics || {},
            imageUrls: p.gallery_images || [
                p.primary_image_url
            ].filter(Boolean)
        },
        condition: basicInfo.condition,
        conditionDescriptors: basicInfo.conditionDescriptors,
        availability: {
            shipToLocationAvailability: {
                quantity: p.stock_quantity || p.current_stock || 1
            }
        },
        packageWeightAndSize: {
            weight: {
                value: logistics.weightGrams,
                unit: 'GRAM'
            },
            dimensions: {
                length: logistics.dimensions.lengthCm,
                width: logistics.dimensions.widthCm,
                height: logistics.dimensions.heightCm,
                unit: 'CENTIMETER'
            }
        }
    };
    const offer = {
        sku: basicInfo.sku,
        marketplaceId: 'EBAY_US',
        format: 'FIXED_PRICE',
        categoryId: basicInfo.categoryId,
        conditionId: basicInfo.conditionId,
        conditionDescriptors: basicInfo.conditionDescriptors,
        pricingSummary: {
            price: {
                currency: 'USD',
                value: finalPrice.toFixed(2)
            }
        },
        listingPolicies: {
            fulfillmentPolicyId: logistics.shippingPolicyId
        }
    };
    return {
        basicInfo,
        costBreakdown,
        logistics,
        taxCompliance,
        ebayApiPayload: {
            inventoryItem,
            offer
        },
        metadata: {
            generatedAt: new Date().toISOString(),
            systemVersion: 'N3 v2.0',
            marketplace: 'eBay US'
        }
    };
}
/**
 * AI監査用プロンプトを生成
 */ function generateAuditPrompt(data) {
    return "あなたはeBay輸出の専門コンサルタント、および国際物流・税関のスペシャリストです。\n以下のJSONデータを分析し、出品の「安全性」と「利益の妥当性」を多角的に検証してください。\n\n【検証ステップ】\n1. **HTSコードの整合性**: 商品タイトルと素材から判断して、設定されたHTSコード（関税番号）は米国税関の基準で適切か？\n2. **関税リスクの評価**: このHTSコードに基づき、バイヤーが支払うべき想定関税率は正しいか？（アンチダンピング税等のリスクはないか？）\n3. **価格計算の正確性**: 為替、手数料、送料、原価から計算された「最終利益」に計算ミスはないか？\n4. **物流の妥当性**: 商品重量に対し、選択された配送ポリシーの料金設定は赤字のリスクがないか？\n5. **eBay規約遵守**: このカテゴリで必須とされるAspects（属性）は全て網羅されているか？\n6. **Condition設定**: conditionIdとconditionDescriptorsは、カテゴリ".concat(data.basicInfo.categoryId, "に対して適切か？\n\n【入力データ (JSON)】\n").concat(JSON.stringify(data, null, 2));
}
function AIAuditPanel(param) {
    let { product } = param;
    _s();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showPreview, setShowPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const auditData = generateAuditData(product);
    const handleCopyJson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AIAuditPanel.useCallback[handleCopyJson]": async ()=>{
            if (!auditData) return;
            try {
                await navigator.clipboard.writeText(JSON.stringify(auditData, null, 2));
                setCopied('json');
                setTimeout({
                    "AIAuditPanel.useCallback[handleCopyJson]": ()=>setCopied(null)
                }["AIAuditPanel.useCallback[handleCopyJson]"], 2000);
            } catch (err) {
                console.error('コピー失敗:', err);
            }
        }
    }["AIAuditPanel.useCallback[handleCopyJson]"], [
        auditData
    ]);
    const handleCopyPrompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "AIAuditPanel.useCallback[handleCopyPrompt]": async ()=>{
            if (!auditData) return;
            try {
                const prompt = generateAuditPrompt(auditData);
                await navigator.clipboard.writeText(prompt);
                setCopied('prompt');
                setTimeout({
                    "AIAuditPanel.useCallback[handleCopyPrompt]": ()=>setCopied(null)
                }["AIAuditPanel.useCallback[handleCopyPrompt]"], 2000);
            } catch (err) {
                console.error('コピー失敗:', err);
            }
        }
    }["AIAuditPanel.useCallback[handleCopyPrompt]"], [
        auditData
    ]);
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 16,
                color: T.textMuted,
                textAlign: 'center'
            },
            children: "商品を選択してください"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
            lineNumber: 270,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            backgroundColor: T.panel,
            border: "1px solid ".concat(T.panelBorder),
            borderRadius: 8,
            padding: 16,
            marginTop: 16
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 18
                                },
                                children: "🤖"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 600,
                                    color: T.text
                                },
                                children: "AI監査データ"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                                lineNumber: 293,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowPreview(!showPreview),
                        style: {
                            padding: '4px 8px',
                            fontSize: 12,
                            backgroundColor: 'transparent',
                            border: "1px solid ".concat(T.panelBorder),
                            borderRadius: 4,
                            cursor: 'pointer',
                            color: T.textMuted
                        },
                        children: showPreview ? '閉じる' : 'プレビュー'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                lineNumber: 285,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    fontSize: 12,
                    color: T.textMuted,
                    marginBottom: 12
                },
                children: "出品データをAI（Gemini/Claude）で検証するためのJSONデータを生成します。 HTSコード、利益計算、配送設定の妥当性をAIがチェックします。"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                lineNumber: 312,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleCopyJson,
                        style: {
                            flex: 1,
                            minWidth: 140,
                            padding: '10px 16px',
                            backgroundColor: copied === 'json' ? T.success : T.accent,
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            transition: 'background-color 0.2s'
                        },
                        children: copied === 'json' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: "✓ コピー完了"
                        }, void 0, false) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: "📋 JSONをコピー"
                        }, void 0, false)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                        lineNumber: 319,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleCopyPrompt,
                        style: {
                            flex: 1,
                            minWidth: 140,
                            padding: '10px 16px',
                            backgroundColor: copied === 'prompt' ? T.success : T.warning,
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            transition: 'background-color 0.2s'
                        },
                        children: copied === 'prompt' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: "✓ コピー完了"
                        }, void 0, false) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: "🧠 AI用プロンプトをコピー"
                        }, void 0, false)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                lineNumber: 318,
                columnNumber: 7
            }, this),
            showPreview && auditData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 12,
                    padding: 12,
                    backgroundColor: T.bg,
                    borderRadius: 6,
                    maxHeight: 300,
                    overflow: 'auto'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                    style: {
                        fontSize: 11,
                        fontFamily: 'Monaco, Consolas, monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        margin: 0,
                        color: T.text
                    },
                    children: JSON.stringify(auditData, null, 2)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                    lineNumber: 384,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                lineNumber: 376,
                columnNumber: 9
            }, this),
            auditData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 12,
                    padding: 12,
                    backgroundColor: T.bg,
                    borderRadius: 6,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: 8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryItem, {
                        label: "SKU",
                        value: auditData.basicInfo.sku
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                        lineNumber: 408,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryItem, {
                        label: "カテゴリ",
                        value: auditData.basicInfo.categoryId
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                        lineNumber: 409,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryItem, {
                        label: "価格",
                        value: "$".concat(auditData.costBreakdown.finalPriceUsd.toFixed(2))
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                        lineNumber: 410,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryItem, {
                        label: "予想利益",
                        value: "$".concat(auditData.costBreakdown.estimatedProfitUsd.toFixed(2)),
                        highlight: auditData.costBreakdown.estimatedProfitUsd > 0
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                        lineNumber: 411,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryItem, {
                        label: "重量",
                        value: "".concat(auditData.logistics.weightGrams, "g")
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                        lineNumber: 412,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryItem, {
                        label: "HTS",
                        value: auditData.taxCompliance.htsCode || '未設定',
                        warn: !auditData.taxCompliance.htsCode
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                        lineNumber: 413,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryItem, {
                        label: "Condition ID",
                        value: auditData.basicInfo.conditionId.toString()
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                        lineNumber: 414,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SummaryItem, {
                        label: "Descriptors",
                        value: auditData.basicInfo.conditionDescriptors ? '設定済' : '未設定',
                        warn: !auditData.basicInfo.conditionDescriptors
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                        lineNumber: 415,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                lineNumber: 399,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
        lineNumber: 277,
        columnNumber: 5
    }, this);
}
_s(AIAuditPanel, "137/kG9W1fqYiKg4mAliFO7lQTY=");
_c = AIAuditPanel;
function SummaryItem(param) {
    let { label, value, highlight, warn } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 10,
                    color: T.textMuted
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                lineNumber: 430,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: 12,
                    fontWeight: 500,
                    color: warn ? T.warning : highlight ? T.success : T.text
                },
                children: value
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
                lineNumber: 431,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx",
        lineNumber: 429,
        columnNumber: 5
    }, this);
}
_c1 = SummaryItem;
const __TURBOPACK__default__export__ = AIAuditPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "AIAuditPanel");
__turbopack_context__.k.register(_c1, "SummaryItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabListing",
    ()=>TabListing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// TabListing - V8.4
// デザインシステムV4準拠
// 機能: 基本情報編集、Item Specifics、EU GPSR、🔥 AI監査パネル
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$condition$2d$mapping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/condition-mapping.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$Tabs$2f$components$2f$ai$2d$audit$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/product-modal/components/Tabs/components/ai-audit-panel.tsx [app-client] (ecmascript)");
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
function TabListing(param) {
    let { product, marketplace, marketplaceName } = param;
    var _this, _this1;
    _s();
    const listingData = ((_this = product) === null || _this === void 0 ? void 0 : _this.listing_data) || {};
    const ebayData = ((_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.ebay_api_data) || {};
    const [basicForm, setBasicForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        price: 0,
        quantity: 1,
        condition: 'Used',
        conditionId: 3000,
        categoryId: ''
    });
    const [euForm, setEuForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        companyName: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [itemSpecifics, setItemSpecifics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabListing.useEffect": ()=>{
            if (product) {
                var _this, _this1, _this2, _product_stock;
                const yahooCondition = listingData.condition || ((_this = product) === null || _this === void 0 ? void 0 : _this.condition_name) || 'Used';
                const converted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$condition$2d$mapping$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["convertYahooToEbayCondition"])(yahooCondition);
                setBasicForm({
                    title: ((_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.english_title) || (product === null || product === void 0 ? void 0 : product.title) || '',
                    price: listingData.ddp_price_usd || ((_this2 = product) === null || _this2 === void 0 ? void 0 : _this2.price_usd) || 0,
                    quantity: (product === null || product === void 0 ? void 0 : (_product_stock = product.stock) === null || _product_stock === void 0 ? void 0 : _product_stock.available) || 1,
                    condition: converted.ebayCondition,
                    conditionId: converted.conditionId,
                    categoryId: ebayData.category_id || ''
                });
                setEuForm({
                    companyName: listingData.eu_responsible_company_name || '',
                    address: listingData.eu_responsible_address_line1 || '',
                    city: listingData.eu_responsible_city || '',
                    postalCode: listingData.eu_responsible_postal_code || '',
                    country: listingData.eu_responsible_country || ''
                });
                // Item Specifics: 優先順位
                // 1. listing_data.item_specifics (APIが保存した確定データ)
                // 2. referenceItemsから集計した最頻値 (フォールバック)
                const savedSpecs = listingData.item_specifics;
                if (savedSpecs && Object.keys(savedSpecs).length > 0) {
                    // listing_dataに保存済みのItem Specificsを使用
                    console.log('📦 listing_data.item_specifics から読み込み:', Object.keys(savedSpecs).length, '件');
                    setItemSpecifics(savedSpecs);
                } else {
                    var _ebayData_listing_reference;
                    // フォールバック: referenceItemsから集計
                    const mirrorItems = ((_ebayData_listing_reference = ebayData.listing_reference) === null || _ebayData_listing_reference === void 0 ? void 0 : _ebayData_listing_reference.referenceItems) || [];
                    const allSpecs = {};
                    mirrorItems.forEach({
                        "TabListing.useEffect": (item)=>{
                            if (item.itemSpecifics) {
                                Object.entries(item.itemSpecifics).forEach({
                                    "TabListing.useEffect": (param)=>{
                                        let [k, v] = param;
                                        if (!allSpecs[k]) allSpecs[k] = {};
                                        allSpecs[k][v] = (allSpecs[k][v] || 0) + 1;
                                    }
                                }["TabListing.useEffect"]);
                            }
                        }
                    }["TabListing.useEffect"]);
                    const mostCommon = {};
                    Object.entries(allSpecs).forEach({
                        "TabListing.useEffect": (param)=>{
                            let [k, counts] = param;
                            const sorted = Object.entries(counts).sort({
                                "TabListing.useEffect.sorted": (a, b)=>b[1] - a[1]
                            }["TabListing.useEffect.sorted"]);
                            if (sorted.length > 0) mostCommon[k] = sorted[0][0];
                        }
                    }["TabListing.useEffect"]);
                    console.log('📦 referenceItems から集計:', Object.keys(mostCommon).length, '件');
                    setItemSpecifics(mostCommon);
                }
            }
        }
    }["TabListing.useEffect"], [
        product
    ]);
    const handleSave = async ()=>{
        alert('保存機能は実装中です');
    };
    const isEuComplete = euForm.companyName && euForm.address && euForm.city && euForm.postalCode && euForm.country;
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '2rem',
                textAlign: 'center',
                color: T.textMuted
            },
            children: "商品データがありません"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
            lineNumber: 110,
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
                gridTemplateColumns: '280px 1fr',
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
                            title: "Basic Info",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Title *",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextArea, {
                                            value: basicForm.title,
                                            onChange: (v)=>setBasicForm((p)=>({
                                                        ...p,
                                                        title: v
                                                    })),
                                            rows: 2,
                                            maxLength: 80
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                            lineNumber: 122,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '8px',
                                                color: T.textMuted,
                                                marginTop: '0.125rem'
                                            },
                                            children: [
                                                basicForm.title.length,
                                                "/80"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                            lineNumber: 123,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                    lineNumber: 121,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0.5rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                            label: "Price (USD) *",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                type: "number",
                                                value: basicForm.price,
                                                onChange: (v)=>setBasicForm((p)=>({
                                                            ...p,
                                                            price: Number(v)
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                                lineNumber: 128,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                            lineNumber: 127,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                            label: "Quantity *",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                type: "number",
                                                value: basicForm.quantity,
                                                onChange: (v)=>setBasicForm((p)=>({
                                                            ...p,
                                                            quantity: Number(v)
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                                lineNumber: 131,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                            lineNumber: 130,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Condition *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Select, {
                                        value: basicForm.condition,
                                        onChange: (v)=>setBasicForm((p)=>({
                                                    ...p,
                                                    condition: v
                                                })),
                                        options: [
                                            'New',
                                            'Like New',
                                            'Used',
                                            'Very Good',
                                            'Good',
                                            'Acceptable',
                                            'For Parts'
                                        ]
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                    lineNumber: 135,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Category ID *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                        value: basicForm.categoryId,
                                        onChange: (v)=>setBasicForm((p)=>({
                                                    ...p,
                                                    categoryId: v
                                                }))
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                            lineNumber: 120,
                            columnNumber: 11
                        }, this),
                        marketplace === 'ebay' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                            title: "EU GPSR",
                            accent: !isEuComplete ? T.warning : undefined,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Company Name *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                        value: euForm.companyName,
                                        onChange: (v)=>setEuForm((p)=>({
                                                    ...p,
                                                    companyName: v
                                                }))
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                        lineNumber: 152,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                    lineNumber: 151,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Address *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                        value: euForm.address,
                                        onChange: (v)=>setEuForm((p)=>({
                                                    ...p,
                                                    address: v
                                                }))
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                        lineNumber: 155,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                    lineNumber: 154,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '0.5rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                            label: "City *",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                value: euForm.city,
                                                onChange: (v)=>setEuForm((p)=>({
                                                            ...p,
                                                            city: v
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                                lineNumber: 159,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                            lineNumber: 158,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                            label: "Postal *",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                                value: euForm.postalCode,
                                                onChange: (v)=>setEuForm((p)=>({
                                                            ...p,
                                                            postalCode: v
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                                lineNumber: 162,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                            lineNumber: 161,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                    lineNumber: 157,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                    label: "Country *",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                        value: euForm.country,
                                        onChange: (v)=>setEuForm((p)=>({
                                                    ...p,
                                                    country: v
                                                })),
                                        placeholder: "e.g. DE, FR"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                        lineNumber: 166,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '0.375rem',
                                        borderRadius: '4px',
                                        background: isEuComplete ? "".concat(T.success, "15") : "".concat(T.warning, "15"),
                                        fontSize: '9px',
                                        color: isEuComplete ? T.success : T.warning,
                                        textAlign: 'center'
                                    },
                                    children: isEuComplete ? '✓ EU info complete' : '⚠ Required for EU'
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                            lineNumber: 150,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                            title: "Item Specifics",
                            children: Object.keys(itemSpecifics).length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '1rem',
                                    textAlign: 'center',
                                    color: T.textMuted,
                                    fontSize: '11px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-info-circle",
                                        style: {
                                            marginRight: '0.375rem'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                        lineNumber: 187,
                                        columnNumber: 17
                                    }, this),
                                    "Run Mirror Analysis to auto-fill"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                lineNumber: 186,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.5rem'
                                },
                                children: Object.entries(itemSpecifics).map((param)=>{
                                    let [key, value] = param;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Field, {
                                        label: key,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Input, {
                                            value: value,
                                            onChange: (v)=>setItemSpecifics((p)=>({
                                                        ...p,
                                                        [key]: v
                                                    }))
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                            lineNumber: 194,
                                            columnNumber: 21
                                        }, this)
                                    }, key, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                        lineNumber: 193,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                lineNumber: 191,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '0.5rem'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setBasicForm({
                                            title: '',
                                            price: 0,
                                            quantity: 1,
                                            condition: 'Used',
                                            conditionId: 3000,
                                            categoryId: ''
                                        });
                                        setItemSpecifics({});
                                    },
                                    style: {
                                        padding: '0.375rem 0.75rem',
                                        fontSize: '10px',
                                        fontWeight: 500,
                                        borderRadius: '4px',
                                        border: "1px solid ".concat(T.panelBorder),
                                        background: T.panel,
                                        color: T.textMuted,
                                        cursor: 'pointer'
                                    },
                                    children: "Reset"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSave,
                                    style: {
                                        padding: '0.375rem 1rem',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        borderRadius: '4px',
                                        border: 'none',
                                        background: '#1e293b',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-save",
                                            style: {
                                                marginRight: '0.25rem'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                            lineNumber: 237,
                                            columnNumber: 15
                                        }, this),
                                        " Save"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                                    lineNumber: 224,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                            lineNumber: 205,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$Tabs$2f$components$2f$ai$2d$audit$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AIAuditPanel"], {
                            product: product
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                            lineNumber: 242,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                    lineNumber: 183,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
            lineNumber: 116,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
}
_s(TabListing, "wCp23SxfadxhvMkfWrrp20daR6A=");
_c = TabListing;
// 小コンポーネント
function Card(param) {
    let { title, children, accent } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '0.75rem',
            borderRadius: '6px',
            background: T.panel,
            border: "1px solid ".concat(accent || T.panelBorder)
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    color: accent || T.textSubtle,
                    marginBottom: '0.5rem'
                },
                children: title
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                lineNumber: 258,
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
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                lineNumber: 261,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
        lineNumber: 252,
        columnNumber: 5
    }, this);
}
_c1 = Card;
function Field(param) {
    let { label, children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                style: {
                    display: 'block',
                    fontSize: '9px',
                    fontWeight: 600,
                    color: T.textMuted,
                    marginBottom: '0.125rem'
                },
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
        lineNumber: 270,
        columnNumber: 5
    }, this);
}
_c2 = Field;
function Input(param) {
    let { value, onChange, type = 'text', placeholder } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        value: value,
        onChange: onChange ? (e)=>onChange(e.target.value) : undefined,
        placeholder: placeholder,
        style: {
            width: '100%',
            padding: '0.375rem 0.5rem',
            fontSize: '11px',
            borderRadius: '4px',
            border: "1px solid ".concat(T.panelBorder),
            background: T.panel,
            color: T.text,
            outline: 'none'
        }
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
        lineNumber: 281,
        columnNumber: 5
    }, this);
}
_c3 = Input;
function TextArea(param) {
    let { value, onChange, rows = 2, maxLength } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        value: value,
        onChange: onChange ? (e)=>onChange(e.target.value) : undefined,
        rows: rows,
        maxLength: maxLength,
        style: {
            width: '100%',
            padding: '0.375rem 0.5rem',
            fontSize: '11px',
            borderRadius: '4px',
            border: "1px solid ".concat(T.panelBorder),
            background: T.panel,
            color: T.text,
            outline: 'none',
            resize: 'vertical'
        }
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
        lineNumber: 302,
        columnNumber: 5
    }, this);
}
_c4 = TextArea;
function Select(param) {
    let { value, onChange, options } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
        value: value,
        onChange: (e)=>onChange(e.target.value),
        style: {
            width: '100%',
            padding: '0.375rem 0.5rem',
            fontSize: '11px',
            borderRadius: '4px',
            border: "1px solid ".concat(T.panelBorder),
            background: T.panel,
            color: T.text,
            outline: 'none'
        },
        children: options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                value: opt,
                children: opt
            }, opt, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
                lineNumber: 338,
                columnNumber: 27
            }, this))
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx",
        lineNumber: 324,
        columnNumber: 5
    }, this);
}
_c5 = Select;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "TabListing");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "Field");
__turbopack_context__.k.register(_c3, "Input");
__turbopack_context__.k.register(_c4, "TextArea");
__turbopack_context__.k.register(_c5, "Select");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_485e21ce._.js.map