(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabCompetitors",
    ()=>TabCompetitors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// TabCompetitors - V11.0 - 除外機能追加
// デザインシステムV4準拠
// 機能: 除外ワード入力、SM分析再実行、個別除外、統計再計算
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
    conditionNew: '#10b981',
    conditionUsed: '#f59e0b'
};
// デフォルト除外ワード
const DEFAULT_EXCLUDE_WORDS = [
    'PSA',
    'BGS',
    'CGC',
    'Graded',
    'Lot',
    'Bundle',
    'Set of'
];
function TabCompetitors(param) {
    let { product } = param;
    var _ebay_api_data_listing_reference, _ebay_api_data, _this, _this1;
    _s();
    const [selectedItemId, setSelectedItemId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dbSelectedItem, setDbSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // 除外機能の状態
    const [excludeWords, setExcludeWords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [excludedItemIds, setExcludedItemIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [isReanalyzing, setIsReanalyzing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // DBから選択済みアイテムと除外設定を復元
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabCompetitors.useEffect": ()=>{
            if (!product) return;
            const loadData = {
                "TabCompetitors.useEffect.loadData": async ()=>{
                    try {
                        // 価格ターゲット復元
                        const response = await fetch("/api/products/".concat(product.id, "/price-target"));
                        const result = await response.json();
                        if (result.success && result.data) {
                            setDbSelectedItem(result.data);
                            setSelectedItemId(result.data.itemId);
                        }
                        // ✅ 除外設定をAPIから復元（最新データを取得）
                        const excludeResponse = await fetch("/api/products/".concat(product.id, "/exclude-settings"));
                        const excludeResult = await excludeResponse.json();
                        if (excludeResult.success && excludeResult.data) {
                            console.log('✅ [除外設定] 復元:', excludeResult.data);
                            if (excludeResult.data.excludeWords) {
                                setExcludeWords(excludeResult.data.excludeWords);
                            }
                            if (excludeResult.data.excludedItemIds && excludeResult.data.excludedItemIds.length > 0) {
                                setExcludedItemIds(new Set(excludeResult.data.excludedItemIds));
                            }
                        }
                    } catch (error) {
                        console.error('❌ [Competitors] DB復元エラー:', error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["TabCompetitors.useEffect.loadData"];
            loadData();
        }
    }["TabCompetitors.useEffect"], [
        product === null || product === void 0 ? void 0 : product.id
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
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
            lineNumber: 74,
            columnNumber: 12
        }, this);
    }
    const referenceItems = ((_this = product) === null || _this === void 0 ? void 0 : (_ebay_api_data = _this.ebay_api_data) === null || _ebay_api_data === void 0 ? void 0 : (_ebay_api_data_listing_reference = _ebay_api_data.listing_reference) === null || _ebay_api_data_listing_reference === void 0 ? void 0 : _ebay_api_data_listing_reference.referenceItems) || [];
    const myCondition = (((_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.condition) || 'Used').toLowerCase().includes('new') ? 'New' : 'Used';
    // 除外ワードでフィルタ + 個別除外を適用
    const filteredItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabCompetitors.useMemo[filteredItems]": ()=>{
            const words = excludeWords.split(',').map({
                "TabCompetitors.useMemo[filteredItems].words": (w)=>w.trim().toLowerCase()
            }["TabCompetitors.useMemo[filteredItems].words"]).filter({
                "TabCompetitors.useMemo[filteredItems].words": (w)=>w.length > 0
            }["TabCompetitors.useMemo[filteredItems].words"]);
            return referenceItems.filter({
                "TabCompetitors.useMemo[filteredItems]": (item)=>{
                    // 個別除外チェック
                    if (excludedItemIds.has(item.itemId)) return false;
                    // ワード除外チェック
                    const title = (item.title || '').toLowerCase();
                    for (const word of words){
                        if (title.includes(word)) return false;
                    }
                    return true;
                }
            }["TabCompetitors.useMemo[filteredItems]"]);
        }
    }["TabCompetitors.useMemo[filteredItems]"], [
        referenceItems,
        excludeWords,
        excludedItemIds
    ]);
    // 価格でソート + コンディション正規化
    const sortedItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabCompetitors.useMemo[sortedItems]": ()=>{
            const items = filteredItems.map({
                "TabCompetitors.useMemo[sortedItems].items": (item)=>{
                    var _item_seller, _item_seller1;
                    return {
                        ...item,
                        priceNum: parseFloat(item.price) || 0,
                        conditionNormalized: (item.condition || 'Used').toLowerCase().includes('new') ? 'New' : 'Used',
                        feedbackScore: item.sellerFeedbackScore || ((_item_seller = item.seller) === null || _item_seller === void 0 ? void 0 : _item_seller.feedbackScore) || 0,
                        feedbackPercentage: parseFloat(item.sellerFeedbackPercentage || ((_item_seller1 = item.seller) === null || _item_seller1 === void 0 ? void 0 : _item_seller1.feedbackPercentage) || '0'),
                        soldQuantity: item.soldQuantity || 0,
                        quantityAvailable: item.quantityAvailable || null
                    };
                }
            }["TabCompetitors.useMemo[sortedItems].items"]);
            items.sort({
                "TabCompetitors.useMemo[sortedItems]": (a, b)=>a.priceNum - b.priceNum
            }["TabCompetitors.useMemo[sortedItems]"]);
            return items;
        }
    }["TabCompetitors.useMemo[sortedItems]"], [
        filteredItems
    ]);
    // 全アイテム（除外前）をソート
    const allSortedItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabCompetitors.useMemo[allSortedItems]": ()=>{
            return referenceItems.map({
                "TabCompetitors.useMemo[allSortedItems]": (item)=>({
                        ...item,
                        priceNum: parseFloat(item.price) || 0,
                        conditionNormalized: (item.condition || 'Used').toLowerCase().includes('new') ? 'New' : 'Used'
                    })
            }["TabCompetitors.useMemo[allSortedItems]"]).sort({
                "TabCompetitors.useMemo[allSortedItems]": (a, b)=>a.priceNum - b.priceNum
            }["TabCompetitors.useMemo[allSortedItems]"]);
        }
    }["TabCompetitors.useMemo[allSortedItems]"], [
        referenceItems
    ]);
    const newItems = sortedItems.filter((item)=>item.conditionNormalized === 'New');
    const usedItems = sortedItems.filter((item)=>item.conditionNormalized === 'Used');
    // 統計計算（除外後）
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabCompetitors.useMemo[stats]": ()=>{
            const prices = sortedItems.map({
                "TabCompetitors.useMemo[stats].prices": (item)=>item.priceNum
            }["TabCompetitors.useMemo[stats].prices"]).filter({
                "TabCompetitors.useMemo[stats].prices": (p)=>p > 0
            }["TabCompetitors.useMemo[stats].prices"]);
            return {
                count: sortedItems.length,
                lowest: prices.length > 0 ? Math.min(...prices) : 0,
                average: prices.length > 0 ? prices.reduce({
                    "TabCompetitors.useMemo[stats]": (a, b)=>a + b
                }["TabCompetitors.useMemo[stats]"], 0) / prices.length : 0,
                highest: prices.length > 0 ? Math.max(...prices) : 0,
                excludedCount: referenceItems.length - sortedItems.length
            };
        }
    }["TabCompetitors.useMemo[stats]"], [
        sortedItems,
        referenceItems.length
    ]);
    // SM分析再実行（除外ワード適用）
    const handleReanalyze = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabCompetitors.useCallback[handleReanalyze]": async ()=>{
            if (!product) return;
            setIsReanalyzing(true);
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('SM分析を再実行中...');
            try {
                var _this;
                const ebayTitle = ((_this = product) === null || _this === void 0 ? void 0 : _this.english_title) || (product === null || product === void 0 ? void 0 : product.title) || '';
                const response = await fetch('/api/sellermirror/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: product.id,
                        ebayTitle,
                        excludeWords: excludeWords.split(',').map({
                            "TabCompetitors.useCallback[handleReanalyze]": (w)=>w.trim()
                        }["TabCompetitors.useCallback[handleReanalyze]"]).filter({
                            "TabCompetitors.useCallback[handleReanalyze]": (w)=>w
                        }["TabCompetitors.useCallback[handleReanalyze]"])
                    })
                });
                const result = await response.json();
                if (result.success) {
                    var _result_listingData_referenceItems, _result_listingData;
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("SM分析完了: ".concat(((_result_listingData = result.listingData) === null || _result_listingData === void 0 ? void 0 : (_result_listingData_referenceItems = _result_listingData.referenceItems) === null || _result_listingData_referenceItems === void 0 ? void 0 : _result_listingData_referenceItems.length) || 0, "件取得"));
                    // ページリロードして最新データを表示
                    window.location.reload();
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(result.error || 'SM分析に失敗しました');
                }
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("エラー: ".concat(error.message));
            } finally{
                setIsReanalyzing(false);
            }
        }
    }["TabCompetitors.useCallback[handleReanalyze]"], [
        product,
        excludeWords
    ]);
    // ✅ 一括除外（チェックした商品をまとめて除外）
    const [checkedItemIds, setCheckedItemIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const toggleCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabCompetitors.useCallback[toggleCheck]": (itemId)=>{
            setCheckedItemIds({
                "TabCompetitors.useCallback[toggleCheck]": (prev)=>{
                    const next = new Set(prev);
                    if (next.has(itemId)) {
                        next.delete(itemId);
                    } else {
                        next.add(itemId);
                    }
                    return next;
                }
            }["TabCompetitors.useCallback[toggleCheck]"]);
        }
    }["TabCompetitors.useCallback[toggleCheck]"], []);
    const handleBulkExclude = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabCompetitors.useCallback[handleBulkExclude]": async ()=>{
            if (checkedItemIds.size === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning('除外する商品を選択してください');
                return;
            }
            // チェックした商品を除外リストに追加
            const newExcludedIds = new Set(excludedItemIds);
            checkedItemIds.forEach({
                "TabCompetitors.useCallback[handleBulkExclude]": (id)=>newExcludedIds.add(id)
            }["TabCompetitors.useCallback[handleBulkExclude]"]);
            setExcludedItemIds(newExcludedIds);
            setCheckedItemIds(new Set()); // チェックをクリア
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("".concat(checkedItemIds.size, "件を除外しました"));
            // DB保存
            if (product) {
                try {
                    await fetch("/api/products/".concat(product.id, "/exclude-settings"), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            excludeWords,
                            excludedItemIds: Array.from(newExcludedIds)
                        })
                    });
                    console.log('✅ 一括除外を保存しました');
                } catch (error) {
                    console.error('一括除外保存エラー:', error);
                }
            }
        }
    }["TabCompetitors.useCallback[handleBulkExclude]"], [
        checkedItemIds,
        excludedItemIds,
        excludeWords,
        product
    ]);
    const handleSelectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabCompetitors.useCallback[handleSelectAll]": ()=>{
            const allIds = sortedItems.map({
                "TabCompetitors.useCallback[handleSelectAll].allIds": (item)=>item.itemId
            }["TabCompetitors.useCallback[handleSelectAll].allIds"]);
            setCheckedItemIds(new Set(allIds));
        }
    }["TabCompetitors.useCallback[handleSelectAll]"], [
        sortedItems
    ]);
    const handleDeselectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabCompetitors.useCallback[handleDeselectAll]": ()=>{
            setCheckedItemIds(new Set());
        }
    }["TabCompetitors.useCallback[handleDeselectAll]"], []);
    // 個別除外トグル（即座に保存）
    const toggleExclude = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabCompetitors.useCallback[toggleExclude]": async (itemId)=>{
            // 新しい除外IDセットを先に計算
            const newExcludedIds = new Set(excludedItemIds);
            if (newExcludedIds.has(itemId)) {
                newExcludedIds.delete(itemId);
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('除外を解除しました');
            } else {
                newExcludedIds.add(itemId);
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('除外しました');
            }
            // stateを更新
            setExcludedItemIds(newExcludedIds);
            // 即座にDB保存
            if (product) {
                try {
                    await fetch("/api/products/".concat(product.id, "/exclude-settings"), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            excludeWords,
                            excludedItemIds: Array.from(newExcludedIds)
                        })
                    });
                    console.log('✅ 除外設定を保存しました');
                } catch (error) {
                    console.error('除外設定保存エラー:', error);
                }
            }
        }
    }["TabCompetitors.useCallback[toggleExclude]"], [
        product,
        excludeWords,
        excludedItemIds
    ]);
    // 除外設定を保存
    const saveExcludeSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabCompetitors.useCallback[saveExcludeSettings]": async ()=>{
            if (!product) return;
            try {
                const response = await fetch("/api/products/".concat(product.id, "/exclude-settings"), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        excludeWords,
                        excludedItemIds: Array.from(excludedItemIds)
                    })
                });
                if (response.ok) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('除外設定を保存しました');
                }
            } catch (error) {
                console.error('除外設定保存エラー:', error);
            }
        }
    }["TabCompetitors.useCallback[saveExcludeSettings]"], [
        product,
        excludeWords,
        excludedItemIds
    ]);
    // 除外設定変更時に自動保存（初期ロード後のみ）
    const [hasInitialized, setHasInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabCompetitors.useEffect": ()=>{
            if (!isLoading) {
                setHasInitialized(true);
            }
        }
    }["TabCompetitors.useEffect"], [
        isLoading
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabCompetitors.useEffect": ()=>{
            if (hasInitialized && product) {
                const timer = setTimeout({
                    "TabCompetitors.useEffect.timer": ()=>{
                        console.log('🔄 除外設定を自動保存中...');
                        saveExcludeSettings();
                    }
                }["TabCompetitors.useEffect.timer"], 500);
                return ({
                    "TabCompetitors.useEffect": ()=>clearTimeout(timer)
                })["TabCompetitors.useEffect"];
            }
        }
    }["TabCompetitors.useEffect"], [
        excludeWords,
        excludedItemIds,
        hasInitialized,
        product,
        saveExcludeSettings
    ]);
    const saveTargetPrice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabCompetitors.useCallback[saveTargetPrice]": async (item)=>{
            try {
                var _item_seller;
                const response = await fetch("/api/products/".concat(product.id, "/price-target"), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        itemId: item.itemId,
                        title: item.title,
                        price: item.priceNum,
                        condition: item.conditionNormalized,
                        seller: typeof item.seller === 'string' ? item.seller : ((_item_seller = item.seller) === null || _item_seller === void 0 ? void 0 : _item_seller.username) || 'Unknown'
                    })
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setDbSelectedItem({
                            itemId: item.itemId,
                            title: item.title,
                            price: item.priceNum,
                            condition: item.conditionNormalized
                        });
                        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('価格ターゲットを設定しました');
                    }
                }
            } catch (error) {
                console.error('❌ 価格ターゲット保存エラー:', error);
            }
        }
    }["TabCompetitors.useCallback[saveTargetPrice]"], [
        product === null || product === void 0 ? void 0 : product.id
    ]);
    // デフォルト選択
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabCompetitors.useEffect": ()=>{
            if (selectedItemId !== null) return;
            if (sortedItems.length === 0) return;
            if (isLoading) return;
            const sameConditionItems = sortedItems.filter({
                "TabCompetitors.useEffect.sameConditionItems": (item)=>item.conditionNormalized === myCondition
            }["TabCompetitors.useEffect.sameConditionItems"]);
            if (sameConditionItems.length > 0) {
                const cheapest = sameConditionItems[0];
                setSelectedItemId(cheapest.itemId);
                saveTargetPrice(cheapest);
            }
        }
    }["TabCompetitors.useEffect"], [
        sortedItems.length,
        myCondition,
        saveTargetPrice,
        isLoading,
        selectedItemId
    ]);
    const handleSelect = (item)=>{
        setSelectedItemId(item.itemId);
        saveTargetPrice(item);
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '2rem',
                textAlign: 'center',
                color: T.textMuted
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                    className: "fas fa-spinner fa-spin",
                    style: {
                        marginRight: '0.5rem'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                    lineNumber: 365,
                    columnNumber: 9
                }, this),
                "読み込み中..."
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
            lineNumber: 364,
            columnNumber: 7
        }, this);
    }
    if (referenceItems.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '1.5rem',
                background: T.bg,
                height: '100%'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '1rem',
                    borderRadius: '6px',
                    background: "".concat(T.warning, "15"),
                    border: "1px solid ".concat(T.warning, "40"),
                    textAlign: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas fa-exclamation-triangle",
                        style: {
                            color: T.warning,
                            marginRight: '0.5rem'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 381,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '11px',
                            color: T.warning
                        },
                        children: "競合データがありません。「ツール」タブからSM分析を実行してください。"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 382,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 374,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
            lineNumber: 373,
            columnNumber: 7
        }, this);
    }
    const selectedItem = sortedItems.find((item)=>item.itemId === selectedItemId);
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
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '10px',
                            fontWeight: 700,
                            color: T.text,
                            marginBottom: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-filter",
                                style: {
                                    marginRight: '0.5rem',
                                    color: T.accent
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 404,
                                columnNumber: 11
                            }, this),
                            "除外フィルタ"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 403,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: excludeWords,
                                onChange: (e)=>setExcludeWords(e.target.value),
                                placeholder: "除外ワード（カンマ区切り）: PSA, BGS, Lot, Bundle...",
                                style: {
                                    flex: 1,
                                    padding: '0.5rem',
                                    fontSize: '11px',
                                    border: "1px solid ".concat(T.panelBorder),
                                    borderRadius: '4px',
                                    outline: 'none'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 408,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleReanalyze,
                                disabled: isReanalyzing,
                                style: {
                                    padding: '0.5rem 1rem',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    background: isReanalyzing ? T.highlight : T.accent,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: isReanalyzing ? 'not-allowed' : 'pointer',
                                    whiteSpace: 'nowrap'
                                },
                                children: isReanalyzing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-spinner fa-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                            lineNumber: 438,
                                            columnNumber: 17
                                        }, this),
                                        " 分析中..."
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-sync-alt"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                            lineNumber: 440,
                                            columnNumber: 17
                                        }, this),
                                        " 再分析"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 422,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 407,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '9px',
                            color: T.textMuted
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-info-circle",
                                style: {
                                    marginRight: '0.25rem'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 445,
                                columnNumber: 11
                            }, this),
                            "例: PSA, BGS, CGC（鑑定品除外）、Lot, Bundle（セット除外）"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 444,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 396,
                columnNumber: 7
            }, this),
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
                        gridTemplateColumns: 'repeat(6, 1fr)',
                        gap: '0.5rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                            label: "Total",
                            value: stats.count
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                            lineNumber: 453,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                            label: "Excluded",
                            value: stats.excludedCount,
                            color: stats.excludedCount > 0 ? T.error : T.textMuted
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                            lineNumber: 454,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                            label: "Lowest",
                            value: "".concat(stats.lowest.toFixed(2)),
                            color: T.success
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                            lineNumber: 455,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                            label: "Average",
                            value: "".concat(stats.average.toFixed(2))
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                            lineNumber: 456,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                            label: "Highest",
                            value: "".concat(stats.highest.toFixed(2)),
                            color: T.warning
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                            lineNumber: 457,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBox, {
                            label: "Condition",
                            value: myCondition,
                            color: myCondition === 'New' ? T.conditionNew : T.conditionUsed
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                            lineNumber: 458,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                    lineNumber: 452,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 451,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SMAttributesPanel, {
                product: product,
                referenceItems: referenceItems
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 463,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: '0.75rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    background: T.panel,
                    border: "1px solid ".concat(T.panelBorder),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '10px',
                            fontWeight: 600,
                            color: T.text
                        },
                        children: [
                            "選択: ",
                            checkedItemIds.size,
                            "件"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 476,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSelectAll,
                        style: {
                            padding: '0.25rem 0.5rem',
                            fontSize: '9px',
                            background: T.highlight,
                            border: "1px solid ".concat(T.panelBorder),
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: T.text
                        },
                        children: "全選択"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 479,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleDeselectAll,
                        style: {
                            padding: '0.25rem 0.5rem',
                            fontSize: '9px',
                            background: T.highlight,
                            border: "1px solid ".concat(T.panelBorder),
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: T.text
                        },
                        children: "選択解除"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 493,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleBulkExclude,
                        disabled: checkedItemIds.size === 0,
                        style: {
                            padding: '0.25rem 0.75rem',
                            fontSize: '10px',
                            fontWeight: 600,
                            background: checkedItemIds.size > 0 ? T.error : T.highlight,
                            color: checkedItemIds.size > 0 ? 'white' : T.textMuted,
                            border: 'none',
                            borderRadius: '4px',
                            cursor: checkedItemIds.size > 0 ? 'pointer' : 'not-allowed',
                            marginLeft: 'auto'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-ban",
                                style: {
                                    marginRight: '0.25rem'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 522,
                                columnNumber: 11
                            }, this),
                            "一括除外 (",
                            checkedItemIds.size,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 507,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 466,
                columnNumber: 7
            }, this),
            selectedItem && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: "".concat(T.accent, "10"),
                    border: "2px solid ".concat(T.accent)
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '10px',
                            fontWeight: 700,
                            color: T.accent,
                            marginBottom: '0.5rem'
                        },
                        children: [
                            "🎯 価格ターゲット（",
                            myCondition,
                            "の最安値）"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 536,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: T.text,
                                    flex: 1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                },
                                children: selectedItem.title
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 540,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    color: T.accent,
                                    marginLeft: '1rem'
                                },
                                children: [
                                    "$",
                                    selectedItem.priceNum.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 543,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 539,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 529,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: T.conditionNew,
                                    marginBottom: '0.5rem',
                                    padding: '0.375rem 0.5rem',
                                    background: "".concat(T.conditionNew, "15"),
                                    borderRadius: '4px'
                                },
                                children: [
                                    "✨ New (",
                                    newItems.length,
                                    ") ",
                                    myCondition === 'New' && '← Your Condition'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 554,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem'
                                },
                                children: newItems.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CompetitorRow, {
                                        item: item,
                                        isSelected: selectedItemId === item.itemId,
                                        isExcluded: excludedItemIds.has(item.itemId),
                                        isChecked: checkedItemIds.has(item.itemId),
                                        onSelect: ()=>handleSelect(item),
                                        onToggleExclude: ()=>toggleExclude(item.itemId),
                                        onToggleCheck: ()=>toggleCheck(item.itemId),
                                        rank: idx + 1
                                    }, item.itemId || "new-".concat(idx), false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                        lineNumber: 567,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 565,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 553,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: T.conditionUsed,
                                    marginBottom: '0.5rem',
                                    padding: '0.375rem 0.5rem',
                                    background: "".concat(T.conditionUsed, "15"),
                                    borderRadius: '4px'
                                },
                                children: [
                                    "📦 Used (",
                                    usedItems.length,
                                    ") ",
                                    myCondition === 'Used' && '← Your Condition'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 584,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem'
                                },
                                children: usedItems.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CompetitorRow, {
                                        item: item,
                                        isSelected: selectedItemId === item.itemId,
                                        isExcluded: excludedItemIds.has(item.itemId),
                                        isChecked: checkedItemIds.has(item.itemId),
                                        onSelect: ()=>handleSelect(item),
                                        onToggleExclude: ()=>toggleExclude(item.itemId),
                                        onToggleCheck: ()=>toggleCheck(item.itemId),
                                        rank: newItems.length + idx + 1
                                    }, item.itemId || "used-".concat(idx), false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                        lineNumber: 597,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 595,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 583,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 551,
                columnNumber: 7
            }, this),
            stats.excludedCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: '1rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '10px',
                            fontWeight: 700,
                            color: T.error,
                            marginBottom: '0.5rem',
                            padding: '0.375rem 0.5rem',
                            background: "".concat(T.error, "15"),
                            borderRadius: '4px',
                            cursor: 'pointer'
                        },
                        children: [
                            "🚫 除外済み (",
                            stats.excludedCount,
                            "件) - クリックで復元可能"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 616,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem'
                        },
                        children: allSortedItems.filter((item)=>excludedItemIds.has(item.itemId) || excludeWords.split(',').some((w)=>w.trim() && (item.title || '').toLowerCase().includes(w.trim().toLowerCase()))).map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ExcludedRow, {
                                item: item,
                                onRestore: ()=>toggleExclude(item.itemId),
                                isManuallyExcluded: excludedItemIds.has(item.itemId)
                            }, item.itemId || "excluded-".concat(idx), false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 637,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 628,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 615,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
        lineNumber: 393,
        columnNumber: 5
    }, this);
}
_s(TabCompetitors, "xYKFrKWVL0NUOX5f3pJVK1TYoZo=");
_c = TabCompetitors;
// 競合商品行コンポーネント
function CompetitorRow(param) {
    let { item, isSelected, isExcluded, isChecked, onSelect, onToggleExclude, onToggleCheck, rank } = param;
    var _item_seller, _item_itemId;
    const seller = typeof item.seller === 'string' ? item.seller : ((_item_seller = item.seller) === null || _item_seller === void 0 ? void 0 : _item_seller.username) || item.seller || 'Unknown';
    const feedbackScore = item.feedbackScore || item.sellerFeedbackScore || 0;
    const feedbackPercentage = item.feedbackPercentage || parseFloat(item.sellerFeedbackPercentage || '0');
    const quantityAvailable = item.quantityAvailable;
    const ebayUrl = item.itemWebUrl || "https://www.ebay.com/itm/".concat(((_item_itemId = item.itemId) === null || _item_itemId === void 0 ? void 0 : _item_itemId.split('|')[1]) || '');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '0.5rem',
            borderRadius: '6px',
            background: isSelected ? "".concat(T.accent, "15") : isChecked ? "".concat(T.warning, "10") : T.panel,
            border: "2px solid ".concat(isSelected ? T.accent : isChecked ? T.warning : T.panelBorder),
            opacity: isExcluded ? 0.5 : 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>{
                            e.stopPropagation();
                            onToggleCheck();
                        },
                        style: {
                            width: '18px',
                            height: '18px',
                            borderRadius: '3px',
                            border: "2px solid ".concat(isChecked ? T.warning : T.panelBorder),
                            background: isChecked ? T.warning : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0
                        },
                        children: isChecked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                            className: "fas fa-check",
                            style: {
                                fontSize: '10px',
                                color: 'white'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                            lineNumber: 697,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 681,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: onSelect,
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem',
                            cursor: 'pointer'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    border: "2px solid ".concat(isSelected ? T.accent : T.panelBorder),
                                    background: isSelected ? T.accent : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                },
                                children: isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#fff'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                    lineNumber: 723,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 711,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '9px',
                                    fontWeight: 700,
                                    color: rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : T.textMuted
                                },
                                children: [
                                    "#",
                                    rank
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 726,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 701,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: onSelect,
                        style: {
                            width: '50px',
                            height: '50px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            background: T.highlight,
                            flexShrink: 0,
                            cursor: 'pointer'
                        },
                        children: item.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: item.image,
                            alt: "",
                            style: {
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                            lineNumber: 741,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-image",
                                style: {
                                    fontSize: '12px',
                                    color: T.textSubtle
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 744,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                            lineNumber: 743,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 736,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: onSelect,
                        style: {
                            flex: 1,
                            minWidth: 0,
                            cursor: 'pointer'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    color: T.text,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    marginBottom: '0.25rem'
                                },
                                children: item.title || 'No title'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 751,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: T.accent,
                                    marginBottom: '0.25rem'
                                },
                                children: [
                                    "$",
                                    item.priceNum.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 754,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '8px',
                                    color: T.textMuted,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fas fa-user",
                                                style: {
                                                    width: '10px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                                lineNumber: 758,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            seller
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                        lineNumber: 758,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fas fa-star",
                                                style: {
                                                    width: '10px',
                                                    color: T.warning
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                                lineNumber: 759,
                                                columnNumber: 19
                                            }, this),
                                            " ",
                                            feedbackScore.toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                        lineNumber: 759,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: quantityAvailable > 0 ? T.text : T.textSubtle
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fas fa-box",
                                                style: {
                                                    width: '10px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                                lineNumber: 761,
                                                columnNumber: 15
                                            }, this),
                                            " ",
                                            quantityAvailable > 0 ? quantityAvailable : '-'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                        lineNumber: 760,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 757,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 750,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: (e)=>{
                            e.stopPropagation();
                            onToggleExclude();
                        },
                        style: {
                            padding: '0.25rem 0.5rem',
                            fontSize: '9px',
                            background: T.highlight,
                            border: "1px solid ".concat(T.panelBorder),
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: T.error,
                            alignSelf: 'flex-start'
                        },
                        title: "この商品を除外",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                            className: "fas fa-ban"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                            lineNumber: 781,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 767,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 679,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: ebayUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                onClick: (e)=>e.stopPropagation(),
                style: {
                    display: 'block',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    background: T.highlight,
                    textAlign: 'center',
                    fontSize: '8px',
                    fontWeight: 600,
                    color: T.accent,
                    textDecoration: 'none'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas fa-external-link-alt",
                        style: {
                            marginRight: '0.25rem'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 803,
                        columnNumber: 9
                    }, this),
                    "View on eBay"
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 786,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
        lineNumber: 670,
        columnNumber: 5
    }, this);
}
_c1 = CompetitorRow;
// 除外済みアイテム行
function ExcludedRow(param) {
    let { item, onRestore, isManuallyExcluded } = param;
    var _item_priceNum;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '0.375rem 0.5rem',
            borderRadius: '4px',
            background: "".concat(T.error, "10"),
            border: "1px solid ".concat(T.error, "30"),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: 0.7
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    minWidth: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '9px',
                            color: T.text,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        },
                        children: item.title
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 828,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '10px',
                            fontWeight: 600,
                            color: T.error
                        },
                        children: [
                            "$",
                            ((_item_priceNum = item.priceNum) === null || _item_priceNum === void 0 ? void 0 : _item_priceNum.toFixed(2)) || '0.00'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 831,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 827,
                columnNumber: 7
            }, this),
            isManuallyExcluded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onRestore,
                style: {
                    padding: '0.25rem 0.5rem',
                    fontSize: '9px',
                    background: T.success,
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas fa-undo"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 848,
                        columnNumber: 11
                    }, this),
                    " 復元"
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 836,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
        lineNumber: 817,
        columnNumber: 5
    }, this);
}
_c2 = ExcludedRow;
function StatBox(param) {
    let { label, value, color } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '0.375rem',
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
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 858,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '11px',
                    fontWeight: 700,
                    color: color || T.text
                },
                children: value
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 859,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
        lineNumber: 857,
        columnNumber: 5
    }, this);
}
_c3 = StatBox;
// ✅ SM分析の原産国・素材情報パネル + HTS表示
function SMAttributesPanel(param) {
    let { product, referenceItems } = param;
    var _listingData_claude_analysis, _listingData_claude_analysis1, _listingData_claude_analysis2, _listingData_data_sources, _sortedCountries_, _sortedMaterials_, _sortedBrands_;
    const listingData = (product === null || product === void 0 ? void 0 : product.listing_data) || {};
    // ✅ 保存済みのSM分析結果を優先使用（再計算しない）
    const smOriginCountry = listingData.sm_origin_country || null;
    const smMaterial = listingData.sm_material || null;
    const smBrand = listingData.sm_brand || null;
    const smCountryStats = listingData.sm_country_stats || {};
    const smMaterialStats = listingData.sm_material_stats || {};
    const smBrandStats = listingData.sm_brand_stats || {};
    // ✅ HTS・関税情報（AI判定結果）
    const htsCode = (product === null || product === void 0 ? void 0 : product.hts_code) || ((_listingData_claude_analysis = listingData.claude_analysis) === null || _listingData_claude_analysis === void 0 ? void 0 : _listingData_claude_analysis.hts_code) || null;
    const htsDescription = listingData.hts_description || ((_listingData_claude_analysis1 = listingData.claude_analysis) === null || _listingData_claude_analysis1 === void 0 ? void 0 : _listingData_claude_analysis1.hts_description) || null;
    const dutyRate = (product === null || product === void 0 ? void 0 : product.duty_rate) || listingData.duty_rate || null;
    const veroRiskLevel = listingData.vero_risk_level || ((_listingData_claude_analysis2 = listingData.claude_analysis) === null || _listingData_claude_analysis2 === void 0 ? void 0 : _listingData_claude_analysis2.vero_risk_level) || null;
    const htsSource = ((_listingData_data_sources = listingData.data_sources) === null || _listingData_data_sources === void 0 ? void 0 : _listingData_data_sources.hts_code) || null; // 'ai_claude', 'ai_gemini', 'manual'
    // ✅ origin_countryはトップレベルカラムも確認
    const originCountry = (product === null || product === void 0 ? void 0 : product.origin_country) || smOriginCountry || null;
    // 統計をソート（件数降順）
    const sortedCountries = Object.entries(smCountryStats).sort((a, b)=>b[1] - a[1]);
    const sortedMaterials = Object.entries(smMaterialStats).sort((a, b)=>b[1] - a[1]);
    const sortedBrands = Object.entries(smBrandStats).sort((a, b)=>b[1] - a[1]);
    const topCountry = originCountry || ((_sortedCountries_ = sortedCountries[0]) === null || _sortedCountries_ === void 0 ? void 0 : _sortedCountries_[0]) || '-';
    const topMaterial = smMaterial || ((_sortedMaterials_ = sortedMaterials[0]) === null || _sortedMaterials_ === void 0 ? void 0 : _sortedMaterials_[0]) || '-';
    const topBrand = smBrand || ((_sortedBrands_ = sortedBrands[0]) === null || _sortedBrands_ === void 0 ? void 0 : _sortedBrands_[0]) || '-';
    // データが全くない場合はプレースホルダー表示
    const hasSmData = smOriginCountry || smMaterial || Object.keys(smCountryStats).length > 0;
    const hasHtsData = htsCode;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            marginBottom: '0.75rem',
            padding: '0.75rem',
            borderRadius: '6px',
            background: '#f0fdf4',
            border: '1px solid #86efac'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#166534',
                    marginBottom: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas fa-globe",
                        style: {
                            marginRight: '0.5rem'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 908,
                        columnNumber: 9
                    }, this),
                    "原産国・素材・HTS情報"
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 907,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '0.5rem',
                            borderRadius: '4px',
                            background: 'white'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '8px',
                                    color: T.textMuted,
                                    marginBottom: '0.25rem'
                                },
                                children: [
                                    "原産国",
                                    originCountry && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            marginLeft: '0.25rem',
                                            color: smOriginCountry ? '#10b981' : '#3b82f6'
                                        },
                                        children: smOriginCountry ? '(SM)' : '(AI)'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                        lineNumber: 917,
                                        columnNumber: 31
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 915,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: topCountry !== '-' ? T.text : T.textSubtle
                                },
                                children: topCountry
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 921,
                                columnNumber: 11
                            }, this),
                            sortedCountries.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '8px',
                                    color: T.textSubtle,
                                    marginTop: '0.25rem'
                                },
                                children: sortedCountries.slice(0, 3).map((param)=>{
                                    let [c, n] = param;
                                    return "".concat(c, "(").concat(n, ")");
                                }).join(', ')
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 925,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 914,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '0.5rem',
                            borderRadius: '4px',
                            background: 'white'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '8px',
                                    color: T.textMuted,
                                    marginBottom: '0.25rem'
                                },
                                children: [
                                    "素材",
                                    smMaterial && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            marginLeft: '0.25rem',
                                            color: '#10b981'
                                        },
                                        children: "(SM)"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                        lineNumber: 935,
                                        columnNumber: 28
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 933,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: topMaterial !== '-' ? T.text : T.textSubtle
                                },
                                children: topMaterial
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 937,
                                columnNumber: 11
                            }, this),
                            sortedMaterials.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '8px',
                                    color: T.textSubtle,
                                    marginTop: '0.25rem'
                                },
                                children: sortedMaterials.slice(0, 3).map((param)=>{
                                    let [m, n] = param;
                                    return "".concat(m, "(").concat(n, ")");
                                }).join(', ')
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 941,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 932,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '0.5rem',
                            borderRadius: '4px',
                            background: htsCode ? 'white' : '#fef3c7'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '8px',
                                    color: T.textMuted,
                                    marginBottom: '0.25rem'
                                },
                                children: [
                                    "HTSコード",
                                    htsSource && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            marginLeft: '0.25rem',
                                            color: '#f97316'
                                        },
                                        children: [
                                            "(",
                                            htsSource === 'ai_claude' ? 'AI' : htsSource,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                        lineNumber: 951,
                                        columnNumber: 27
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 949,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: htsCode ? '11px' : '10px',
                                    fontWeight: 700,
                                    fontFamily: htsCode ? 'monospace' : 'inherit',
                                    color: htsCode ? T.accent : T.warning
                                },
                                children: htsCode || 'AI判定必要'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 953,
                                columnNumber: 11
                            }, this),
                            htsDescription && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '7px',
                                    color: T.textSubtle,
                                    marginTop: '0.25rem',
                                    lineHeight: 1.3
                                },
                                children: [
                                    htsDescription.substring(0, 50),
                                    "..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 962,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 948,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '0.5rem',
                            borderRadius: '4px',
                            background: 'white'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '8px',
                                    color: T.textMuted,
                                    marginBottom: '0.25rem'
                                },
                                children: "関税率 / VERO"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 970,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            color: dutyRate ? dutyRate > 10 ? T.error : T.success : T.textSubtle
                                        },
                                        children: dutyRate ? "".concat(dutyRate, "%") : '-'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                        lineNumber: 972,
                                        columnNumber: 13
                                    }, this),
                                    veroRiskLevel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '9px',
                                            fontWeight: 600,
                                            padding: '0.125rem 0.375rem',
                                            borderRadius: '4px',
                                            background: veroRiskLevel === 'High' ? '#fee2e2' : veroRiskLevel === 'Medium' ? '#fef3c7' : '#dcfce7',
                                            color: veroRiskLevel === 'High' ? '#dc2626' : veroRiskLevel === 'Medium' ? '#d97706' : '#16a34a'
                                        },
                                        children: [
                                            "VERO: ",
                                            veroRiskLevel
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                        lineNumber: 980,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 971,
                                columnNumber: 11
                            }, this),
                            !htsCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '8px',
                                    color: T.warning,
                                    marginTop: '0.25rem'
                                },
                                children: "→ ToolsタブでAI分析"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                                lineNumber: 993,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 969,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 912,
                columnNumber: 7
            }, this),
            topBrand !== '-' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: '0.5rem',
                    padding: '0.375rem 0.5rem',
                    borderRadius: '4px',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '8px',
                            color: T.textMuted
                        },
                        children: "ブランド:"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 1003,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '11px',
                            fontWeight: 600,
                            color: T.text
                        },
                        children: topBrand
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 1004,
                        columnNumber: 11
                    }, this),
                    sortedBrands.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '8px',
                            color: T.textSubtle
                        },
                        children: [
                            "(他: ",
                            sortedBrands.slice(1, 3).map((param)=>{
                                let [b] = param;
                                return b;
                            }).join(', '),
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                        lineNumber: 1006,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 1002,
                columnNumber: 9
            }, this),
            !hasSmData && !hasHtsData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    background: '#fef3c7',
                    border: '1px solid #fcd34d'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontSize: '9px',
                        color: '#92400e'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                            className: "fas fa-info-circle",
                            style: {
                                marginRight: '0.25rem'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                            lineNumber: 1017,
                            columnNumber: 13
                        }, this),
                        "SM分析を実行すると原産国・素材情報が取得されます。HTSはToolsタブの「Claude AI分析」で判定できます。"
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                    lineNumber: 1016,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
                lineNumber: 1015,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx",
        lineNumber: 900,
        columnNumber: 5
    }, this);
}
_c4 = SMAttributesPanel;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "TabCompetitors");
__turbopack_context__.k.register(_c1, "CompetitorRow");
__turbopack_context__.k.register(_c2, "ExcludedRow");
__turbopack_context__.k.register(_c3, "StatBox");
__turbopack_context__.k.register(_c4, "SMAttributesPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=2fac6_vps_components_product-modal_components_Tabs_tab-competitors_tsx_2347f31d._.js.map