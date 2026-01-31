(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabMirror",
    ()=>TabMirror
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// TabMirror - V11.0 - URL登録機能追加
// デザインシステムV4準拠
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$mirrorSelectionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/mirrorSelectionStore.ts [app-client] (ecmascript)");
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
    error: '#ef4444',
    purple: '#7c3aed',
    conditionNew: '#10b981',
    conditionUsed: '#f59e0b'
};
function TabMirror(param) {
    let { product } = param;
    var _this;
    _s();
    const { selectedItems, setSelectedItem, getSelectedByProduct } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$mirrorSelectionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMirrorSelectionStore"])();
    const [dbSelectedItem, setDbSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // URL登録機能の状態
    const [urlInput, setUrlInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [urlLoading, setUrlLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [manualItems, setManualItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [freshReferenceItems, setFreshReferenceItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // DBから選択済みアイテム + 手動追加アイテムを復元
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabMirror.useEffect": ()=>{
            if (!product) return;
            const loadData = {
                "TabMirror.useEffect.loadData": async ()=>{
                    try {
                        // 選択済みアイテムを復元
                        const selectedResponse = await fetch("/api/products/".concat(product.id, "/sm-selected-item"));
                        const selectedResult = await selectedResponse.json();
                        if (selectedResult.success && selectedResult.data) {
                            setDbSelectedItem(selectedResult.data);
                            console.log('✅ [Mirror] DB復元 (選択):', selectedResult.data.itemId);
                        }
                        // 最新の商品データをAPIから取得（手動追加アイテム含む）
                        const productResponse = await fetch("/api/products/".concat(product.id));
                        const productResult = await productResponse.json();
                        if (productResult.success && productResult.data) {
                            const freshProduct = productResult.data;
                            const ebayData = (freshProduct === null || freshProduct === void 0 ? void 0 : freshProduct.ebay_api_data) || {};
                            const listingRef = (ebayData === null || ebayData === void 0 ? void 0 : ebayData.listing_reference) || {};
                            const refItems = (listingRef === null || listingRef === void 0 ? void 0 : listingRef.referenceItems) || [];
                            // isManual: true のアイテムを手動追加リストに復元
                            const manualFromDb = refItems.filter({
                                "TabMirror.useEffect.loadData.manualFromDb": (item)=>item.isManual === true
                            }["TabMirror.useEffect.loadData.manualFromDb"]);
                            if (manualFromDb.length > 0) {
                                setManualItems(manualFromDb);
                                console.log('✅ [Mirror] DB復元 (手動追加):', manualFromDb.length, '件');
                            }
                            // 最新のreferenceItemsもstateに保存（propsの古いデータを上書き）
                            setFreshReferenceItems(refItems.filter({
                                "TabMirror.useEffect.loadData": (item)=>!item.isManual
                            }["TabMirror.useEffect.loadData"]));
                        }
                    } catch (error) {
                        console.error('❌ [Mirror] DB復元エラー:', error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["TabMirror.useEffect.loadData"];
            loadData();
        }
    }["TabMirror.useEffect"], [
        product === null || product === void 0 ? void 0 : product.id
    ]);
    // eBay URLからItem IDを抽出
    const extractItemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabMirror.useCallback[extractItemId]": (url)=>{
            // パターン1: https://www.ebay.com/itm/123456789
            // パターン2: https://www.ebay.com/itm/title-here/123456789
            // パターン3: https://www.ebay.com/itm/123456789?...
            const patterns = [
                /ebay\.com\/itm\/(\d+)/,
                /ebay\.com\/itm\/[^\/]+\/(\d+)/,
                /ebay\.com\/itm\/(\d+)\?/
            ];
            for (const pattern of patterns){
                const match = url.match(pattern);
                if (match && match[1]) {
                    return match[1];
                }
            }
            return null;
        }
    }["TabMirror.useCallback[extractItemId]"], []);
    // URLから商品情報を取得
    const handleFetchFromUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabMirror.useCallback[handleFetchFromUrl]": async ()=>{
            if (!urlInput.trim()) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('URLを入力してください');
                return;
            }
            const legacyItemId = extractItemId(urlInput.trim());
            if (!legacyItemId) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('有効なeBay URLを入力してください');
                return;
            }
            setUrlLoading(true);
            console.log('🔍 [Mirror] URL取得開始:', legacyItemId);
            try {
                // Browse APIのItem IDフォーマット: v1|{legacyItemId}|0
                const itemId = "v1|".concat(legacyItemId, "|0");
                const response = await fetch('/api/sellermirror/item-details', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        itemId
                    })
                });
                const result = await response.json();
                if (result.success && result.detailedItem) {
                    var _item_seller, _item_seller1, _item_seller2, _item_shippingOptions_, _item_shippingOptions, _item_title;
                    const item = result.detailedItem;
                    // 手動追加アイテムとして追加
                    const newManualItem = {
                        itemId: item.itemId,
                        title: item.title,
                        price: item.price,
                        priceNum: parseFloat(item.price) || 0,
                        currency: item.currency,
                        condition: item.condition,
                        conditionNormalized: (item.condition || 'Used').toLowerCase().includes('new') ? 'New' : 'Used',
                        categoryId: item.categoryId,
                        categoryPath: item.categoryPath,
                        image: item.image,
                        seller: ((_item_seller = item.seller) === null || _item_seller === void 0 ? void 0 : _item_seller.username) || 'Unknown',
                        sellerFeedbackScore: ((_item_seller1 = item.seller) === null || _item_seller1 === void 0 ? void 0 : _item_seller1.feedbackScore) || 0,
                        sellerFeedbackPercentage: ((_item_seller2 = item.seller) === null || _item_seller2 === void 0 ? void 0 : _item_seller2.feedbackPercentage) || 0,
                        shippingCost: ((_item_shippingOptions = item.shippingOptions) === null || _item_shippingOptions === void 0 ? void 0 : (_item_shippingOptions_ = _item_shippingOptions[0]) === null || _item_shippingOptions_ === void 0 ? void 0 : _item_shippingOptions_.shippingCost) || 0,
                        quantityAvailable: item.quantityAvailable,
                        quantitySold: item.quantitySold,
                        itemWebUrl: item.itemWebUrl,
                        itemSpecifics: item.itemSpecifics,
                        hasDetails: true,
                        isManual: true
                    };
                    setManualItems({
                        "TabMirror.useCallback[handleFetchFromUrl]": (prev)=>{
                            // 重複チェック
                            if (prev.some({
                                "TabMirror.useCallback[handleFetchFromUrl]": (i)=>i.itemId === newManualItem.itemId
                            }["TabMirror.useCallback[handleFetchFromUrl]"])) {
                                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].warning('この商品は既に追加されています');
                                return prev;
                            }
                            return [
                                ...prev,
                                newManualItem
                            ];
                        }
                    }["TabMirror.useCallback[handleFetchFromUrl]"]);
                    setUrlInput('');
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("商品を追加・保存しました: ".concat((_item_title = item.title) === null || _item_title === void 0 ? void 0 : _item_title.substring(0, 40), "..."));
                    // DBにも保存（ebay_api_dataに追加）
                    if (product === null || product === void 0 ? void 0 : product.id) {
                        await saveManualItemToDb(product.id, newManualItem);
                    }
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(result.error || '商品情報の取得に失敗しました');
                }
            } catch (error) {
                console.error('❌ [Mirror] URL取得エラー:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("取得エラー: ".concat(error.message));
            } finally{
                setUrlLoading(false);
            }
        }
    }["TabMirror.useCallback[handleFetchFromUrl]"], [
        urlInput,
        extractItemId,
        product === null || product === void 0 ? void 0 : product.id
    ]);
    // 手動追加アイテムをDBに保存
    const saveManualItemToDb = async (productId, item)=>{
        try {
            const response = await fetch("/api/products/".concat(productId, "/sm-add-item"), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    item
                })
            });
            const result = await response.json();
            if (!result.success) {
                console.error('❌ [Mirror] DB保存エラー:', result.error);
            } else {
                console.log('✅ [Mirror] DB保存成功');
            }
        } catch (error) {
            console.error('❌ [Mirror] DB保存例外:', error);
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
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
            lineNumber: 202,
            columnNumber: 12
        }, this);
    }
    const ebayData = ((_this = product) === null || _this === void 0 ? void 0 : _this.ebay_api_data) || {};
    const listingReference = ebayData === null || ebayData === void 0 ? void 0 : ebayData.listing_reference;
    const referenceItems = (listingReference === null || listingReference === void 0 ? void 0 : listingReference.referenceItems) || [];
    const categoryId = (ebayData === null || ebayData === void 0 ? void 0 : ebayData.category_id) || (listingReference === null || listingReference === void 0 ? void 0 : listingReference.suggestedCategory);
    const categoryName = (ebayData === null || ebayData === void 0 ? void 0 : ebayData.category_name) || (listingReference === null || listingReference === void 0 ? void 0 : listingReference.suggestedCategoryPath);
    // Store + DBから選択されたアイテムID
    const selectedItemIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabMirror.useMemo[selectedItemIds]": ()=>{
            return getSelectedByProduct(product.id);
        }
    }["TabMirror.useMemo[selectedItemIds]"], [
        selectedItems,
        product.id,
        getSelectedByProduct
    ]);
    const selectedItemId = (dbSelectedItem === null || dbSelectedItem === void 0 ? void 0 : dbSelectedItem.itemId) || (selectedItemIds.length > 0 ? selectedItemIds[0] : null);
    // 全アイテム = API取得（最新） + 手動追加
    const allItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabMirror.useMemo[allItems]": ()=>{
            // freshReferenceItemsがあればそれを使用（最新データ）
            const apiItems = freshReferenceItems.length > 0 ? freshReferenceItems : referenceItems;
            const combined = [
                ...apiItems,
                ...manualItems
            ];
            return combined;
        }
    }["TabMirror.useMemo[allItems]"], [
        referenceItems,
        freshReferenceItems,
        manualItems
    ]);
    // 価格でソート + コンディション別にグループ化
    const sortedItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabMirror.useMemo[sortedItems]": ()=>{
            const items = allItems.map({
                "TabMirror.useMemo[sortedItems].items": (item)=>{
                    var _item_seller, _item_seller1, _item_seller2;
                    return {
                        ...item,
                        priceNum: parseFloat(item.price) || 0,
                        conditionNormalized: (item.condition || 'Used').toLowerCase().includes('new') ? 'New' : 'Used',
                        feedbackScore: item.sellerFeedbackScore || ((_item_seller = item.seller) === null || _item_seller === void 0 ? void 0 : _item_seller.feedbackScore) || 0,
                        feedbackPercentage: parseFloat(item.sellerFeedbackPercentage || ((_item_seller1 = item.seller) === null || _item_seller1 === void 0 ? void 0 : _item_seller1.feedbackPercentage) || '0'),
                        soldQuantity: item.soldQuantity || 0,
                        quantityAvailable: item.quantityAvailable || null,
                        sellerLocation: ((_item_seller2 = item.seller) === null || _item_seller2 === void 0 ? void 0 : _item_seller2.sellerBusinessType) || item.location || 'Unknown'
                    };
                }
            }["TabMirror.useMemo[sortedItems].items"]);
            items.sort({
                "TabMirror.useMemo[sortedItems]": (a, b)=>a.priceNum - b.priceNum
            }["TabMirror.useMemo[sortedItems]"]);
            return items;
        }
    }["TabMirror.useMemo[sortedItems]"], [
        allItems
    ]);
    const newItems = sortedItems.filter((item)=>item.conditionNormalized === 'New');
    const usedItems = sortedItems.filter((item)=>item.conditionNormalized === 'Used');
    const handleSelect = (item)=>{
        var _item_seller;
        const seller = typeof item.seller === 'string' ? item.seller : ((_item_seller = item.seller) === null || _item_seller === void 0 ? void 0 : _item_seller.username) || 'Unknown';
        console.log('🖱️ [TabMirror] Item selected:', {
            productId: product.id,
            itemId: item.itemId,
            title: item.title,
            price: item.price,
            condition: item.conditionNormalized
        });
        // ✅ 即座にUI状態を更新
        const selectedData = {
            productId: product.id,
            itemId: item.itemId,
            title: item.title,
            price: item.priceNum,
            image: item.image,
            seller: seller,
            condition: item.conditionNormalized,
            hasDetails: item.hasDetails || false,
            itemSpecifics: item.itemSpecifics
        };
        setSelectedItem(product.id, selectedData);
        // ✅ dbSelectedItemも即座に更新（UIが即反映されるように）
        setDbSelectedItem(selectedData);
        // DBにも保存
        saveSelectedItemToDb(product.id, item);
    };
    // 選択アイテムをDBに保存
    const saveSelectedItemToDb = async (productId, item)=>{
        try {
            var _item_seller;
            const response = await fetch("/api/products/".concat(productId, "/sm-select-item"), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemId: item.itemId,
                    title: item.title,
                    price: item.priceNum || item.price,
                    image: item.image,
                    seller: typeof item.seller === 'string' ? item.seller : (_item_seller = item.seller) === null || _item_seller === void 0 ? void 0 : _item_seller.username,
                    condition: item.conditionNormalized,
                    itemSpecifics: item.itemSpecifics
                })
            });
            const result = await response.json();
            if (result.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('✅ SM選択を保存しました');
            }
        } catch (error) {
            console.error('❌ [Mirror] 選択保存エラー:', error);
        }
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
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                    lineNumber: 309,
                    columnNumber: 9
                }, this),
                "読み込み中..."
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
            lineNumber: 308,
            columnNumber: 7
        }, this);
    }
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
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    background: "".concat(T.purple, "10"),
                    border: "1px solid ".concat(T.purple, "40")
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '11px',
                            fontWeight: 700,
                            color: T.purple,
                            marginBottom: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-link",
                                style: {
                                    marginRight: '0.5rem'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 327,
                                columnNumber: 11
                            }, this),
                            "eBay URLから直接登録"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 326,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '10px',
                            color: T.textMuted,
                            marginBottom: '0.5rem'
                        },
                        children: "競合商品が見つからない場合、eBay商品ページのURLを直接入力して参照データを追加できます。"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: urlInput,
                                onChange: (e)=>setUrlInput(e.target.value),
                                placeholder: "https://www.ebay.com/itm/...",
                                style: {
                                    flex: 1,
                                    padding: '0.5rem',
                                    fontSize: '11px',
                                    border: "1px solid ".concat(T.panelBorder),
                                    borderRadius: '4px',
                                    outline: 'none'
                                },
                                onKeyDown: (e)=>{
                                    if (e.key === 'Enter') {
                                        handleFetchFromUrl();
                                    }
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 334,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleFetchFromUrl,
                                disabled: urlLoading,
                                style: {
                                    padding: '0.5rem 1rem',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    background: urlLoading ? T.highlight : T.purple,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: urlLoading ? 'not-allowed' : 'pointer',
                                    whiteSpace: 'nowrap'
                                },
                                children: urlLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-spinner fa-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                            lineNumber: 369,
                                            columnNumber: 17
                                        }, this),
                                        " 取得中..."
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-plus"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                            lineNumber: 371,
                                            columnNumber: 17
                                        }, this),
                                        " 追加"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 353,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 333,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 319,
                columnNumber: 7
            }, this),
            allItems.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 386,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '11px',
                            color: T.warning
                        },
                        children: "Mirror分析データがありません。「ツール」タブからSM分析を実行するか、上のURL入力から直接追加してください。"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 387,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 379,
                columnNumber: 9
            }, this),
            allItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '0.75rem',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            background: "".concat(T.success, "15"),
                            border: "1px solid ".concat(T.success, "40"),
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
                                            color: T.success,
                                            fontWeight: 600
                                        },
                                        children: [
                                            "✅ Mirror分析データ: ",
                                            allItems.length,
                                            "件",
                                            manualItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: T.purple,
                                                    marginLeft: '0.5rem'
                                                },
                                                children: [
                                                    "(手動追加: ",
                                                    manualItems.length,
                                                    "件)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                                lineNumber: 411,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                        lineNumber: 408,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '9px',
                                            color: T.textMuted,
                                            marginTop: '0.25rem'
                                        },
                                        children: [
                                            "New: ",
                                            newItems.length,
                                            "件 / Used: ",
                                            usedItems.length,
                                            "件"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                        lineNumber: 416,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 407,
                                columnNumber: 13
                            }, this),
                            selectedItemId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '9px',
                                    color: T.accent,
                                    fontWeight: 600
                                },
                                children: "✓ SM選択済み"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 421,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 397,
                        columnNumber: 11
                    }, this),
                    (categoryId || categoryName) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '0.75rem',
                            padding: '0.5rem 0.75rem',
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
                                    color: T.textSubtle
                                },
                                children: "Suggested Category"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 430,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: T.text,
                                    marginTop: '0.25rem'
                                },
                                children: [
                                    categoryName || 'Unknown',
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: T.textMuted
                                        },
                                        children: [
                                            "(",
                                            categoryId,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                        lineNumber: 434,
                                        columnNumber: 45
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 433,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 429,
                        columnNumber: 13
                    }, this),
                    newItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: T.conditionNew,
                                    marginBottom: '0.5rem',
                                    padding: '0.25rem 0.5rem',
                                    background: "".concat(T.conditionNew, "15"),
                                    borderRadius: '4px',
                                    display: 'inline-block'
                                },
                                children: [
                                    "✨ New Condition (",
                                    newItems.length,
                                    "件)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 442,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                    gap: '0.75rem',
                                    marginBottom: '1rem'
                                },
                                children: newItems.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CompetitorCard, {
                                        item: item,
                                        isSelected: selectedItemId === item.itemId,
                                        onSelect: ()=>handleSelect(item),
                                        rank: idx + 1
                                    }, item.itemId || "new-".concat(idx), false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                        lineNumber: 456,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 454,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    usedItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: T.conditionUsed,
                                    marginBottom: '0.5rem',
                                    padding: '0.25rem 0.5rem',
                                    background: "".concat(T.conditionUsed, "15"),
                                    borderRadius: '4px',
                                    display: 'inline-block'
                                },
                                children: [
                                    "📦 Used Condition (",
                                    usedItems.length,
                                    "件)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 471,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                    gap: '0.75rem'
                                },
                                children: usedItems.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CompetitorCard, {
                                        item: item,
                                        isSelected: selectedItemId === item.itemId,
                                        onSelect: ()=>handleSelect(item),
                                        rank: newItems.length + idx + 1
                                    }, item.itemId || "used-".concat(idx), false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                        lineNumber: 485,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 483,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true),
                    selectedItemId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginTop: '1rem',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            background: "".concat(T.accent, "10"),
                            border: "2px solid ".concat(T.accent)
                        },
                        children: (()=>{
                            var _selected_title, _selected_seller;
                            const selected = sortedItems.find((item)=>item.itemId === selectedItemId);
                            if (!selected) return null;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            color: T.accent,
                                            marginBottom: '0.5rem'
                                        },
                                        children: "🎯 SM選択商品（詳細データ参照用）:"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                        lineNumber: 512,
                                        columnNumber: 21
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
                                                    color: T.text
                                                },
                                                children: [
                                                    (_selected_title = selected.title) === null || _selected_title === void 0 ? void 0 : _selected_title.substring(0, 50),
                                                    "..."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                                lineNumber: 516,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '14px',
                                                    fontWeight: 700,
                                                    color: T.accent
                                                },
                                                children: [
                                                    "$",
                                                    selected.priceNum.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                                lineNumber: 519,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                        lineNumber: 515,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '9px',
                                            color: T.textMuted,
                                            marginTop: '0.25rem'
                                        },
                                        children: [
                                            "Condition: ",
                                            selected.conditionNormalized,
                                            " | Seller: ",
                                            typeof selected.seller === 'string' ? selected.seller : ((_selected_seller = selected.seller) === null || _selected_seller === void 0 ? void 0 : _selected_seller.username) || 'Unknown'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                        lineNumber: 523,
                                        columnNumber: 21
                                    }, this),
                                    selected.itemSpecifics && Object.keys(selected.itemSpecifics).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginTop: '0.5rem',
                                            paddingTop: '0.5rem',
                                            borderTop: "1px solid ".concat(T.panelBorder)
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '9px',
                                                    fontWeight: 600,
                                                    color: T.textMuted,
                                                    marginBottom: '0.25rem'
                                                },
                                                children: "Item Specifics:"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                                lineNumber: 529,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '0.25rem'
                                                },
                                                children: Object.entries(selected.itemSpecifics).slice(0, 6).map((param)=>{
                                                    let [key, value] = param;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '8px',
                                                            padding: '0.125rem 0.25rem',
                                                            background: T.highlight,
                                                            borderRadius: '2px',
                                                            color: T.text
                                                        },
                                                        children: [
                                                            key,
                                                            ": ",
                                                            String(value)
                                                        ]
                                                    }, key, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                                        lineNumber: 534,
                                                        columnNumber: 29
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                                lineNumber: 532,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                        lineNumber: 528,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 511,
                                columnNumber: 19
                            }, this);
                        })()
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 499,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
        lineNumber: 316,
        columnNumber: 5
    }, this);
}
_s(TabMirror, "VVM8rWS3i9B/h7nlDyb++pK77WQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$mirrorSelectionStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMirrorSelectionStore"]
    ];
});
_c = TabMirror;
// 競合商品カードコンポーネント
function CompetitorCard(param) {
    let { item, isSelected, onSelect, rank } = param;
    var _item_seller, _item_seller1, _item_itemId;
    const seller = typeof item.seller === 'string' ? item.seller : ((_item_seller = item.seller) === null || _item_seller === void 0 ? void 0 : _item_seller.username) || item.seller || 'Unknown';
    const feedbackScore = item.feedbackScore || item.sellerFeedbackScore || 0;
    const feedbackPercentage = item.feedbackPercentage || parseFloat(item.sellerFeedbackPercentage || '0');
    const soldQuantity = item.soldQuantity || 0;
    const quantityAvailable = item.quantityAvailable;
    const sellerLocation = item.sellerLocation || ((_item_seller1 = item.seller) === null || _item_seller1 === void 0 ? void 0 : _item_seller1.sellerBusinessType) || item.location || 'Unknown';
    const conditionColor = item.conditionNormalized === 'New' ? T.conditionNew : T.conditionUsed;
    const isManual = item.isManual;
    // ✅ Item Specifics件数を取得
    const itemSpecificsCount = item.itemSpecificsCount || (item.itemSpecifics ? Object.keys(item.itemSpecifics).length : 0);
    const hasGoodSpecs = itemSpecificsCount >= 5; // 5件以上あれば良好
    // eBay URLを生成
    const ebayUrl = item.itemWebUrl || "https://www.ebay.com/itm/".concat(((_item_itemId = item.itemId) === null || _item_itemId === void 0 ? void 0 : _item_itemId.split('|')[1]) || '');
    // ✅ 枠色: 選択済み（青）> 未選択（グレー）
    // 手動追加かどうかは枠色ではなくバッジで表示
    const borderColor = isSelected ? T.accent : T.panelBorder;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: onSelect,
        style: {
            padding: '0.75rem',
            borderRadius: '6px',
            background: T.panel,
            border: "2px solid ".concat(borderColor),
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            position: 'relative',
            boxShadow: isSelected ? "0 4px 12px ".concat(T.accent, "40") : 'none'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: '0.5rem',
                    left: '0.5rem',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : T.highlight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: rank <= 3 ? '#fff' : T.text,
                    zIndex: 1
                },
                children: rank
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 601,
                columnNumber: 7
            }, this),
            isManual && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: '0.5rem',
                    left: '2.5rem',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '3px',
                    background: T.purple,
                    color: 'white',
                    fontSize: '8px',
                    fontWeight: 600
                },
                children: "手動"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 622,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: '0.5rem',
                    left: isManual ? '4.5rem' : '2.5rem',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '3px',
                    background: hasGoodSpecs ? T.success : itemSpecificsCount > 0 ? T.warning : T.error,
                    color: 'white',
                    fontSize: '8px',
                    fontWeight: 600
                },
                children: [
                    hasGoodSpecs ? '⭐' : '',
                    " Specs: ",
                    itemSpecificsCount
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 638,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: "2px solid ".concat(isSelected ? T.accent : T.panelBorder),
                    background: isSelected ? T.accent : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1
                },
                children: isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#fff'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                    lineNumber: 668,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 653,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    aspectRatio: '4/3',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginBottom: '0.5rem',
                    background: T.highlight
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
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                    lineNumber: 680,
                    columnNumber: 11
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
                            fontSize: '1.5rem',
                            color: T.textSubtle
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 683,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                    lineNumber: 682,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 678,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '10px',
                    fontWeight: 600,
                    color: T.text,
                    marginBottom: '0.5rem',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                },
                children: item.title || 'No title'
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 689,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '14px',
                            fontWeight: 700,
                            color: T.accent
                        },
                        children: [
                            "$",
                            item.priceNum.toFixed(2)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 706,
                        columnNumber: 9
                    }, this),
                    item.shippingCost && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '9px',
                            color: T.textMuted,
                            background: T.highlight,
                            padding: '0.125rem 0.375rem',
                            borderRadius: '3px'
                        },
                        children: [
                            "+$",
                            item.shippingCost,
                            " ship"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 710,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 705,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '9px',
                    fontWeight: 600,
                    color: conditionColor,
                    background: "".concat(conditionColor, "15"),
                    padding: '0.125rem 0.375rem',
                    borderRadius: '3px',
                    display: 'inline-block',
                    marginBottom: '0.5rem'
                },
                children: item.conditionNormalized
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 717,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '9px',
                    color: T.textMuted,
                    marginBottom: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            marginBottom: '0.125rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-user",
                                style: {
                                    width: '12px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 733,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: seller
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 734,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 732,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            marginBottom: '0.125rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-star",
                                style: {
                                    width: '12px',
                                    color: T.warning
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 737,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    feedbackScore.toLocaleString(),
                                    " (",
                                    feedbackPercentage.toFixed(1),
                                    "%)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 738,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 736,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-box",
                                style: {
                                    width: '12px',
                                    color: quantityAvailable > 0 ? T.success : T.textSubtle
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 741,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: quantityAvailable > 0 ? T.text : T.textSubtle
                                },
                                children: quantityAvailable > 0 ? "".concat(quantityAvailable.toLocaleString(), " available") : '- available'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                                lineNumber: 742,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 740,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 731,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: ebayUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                onClick: (e)=>e.stopPropagation(),
                style: {
                    display: 'block',
                    padding: '0.375rem',
                    borderRadius: '4px',
                    background: T.highlight,
                    textAlign: 'center',
                    fontSize: '9px',
                    fontWeight: 600,
                    color: T.accent,
                    textDecoration: 'none',
                    marginBottom: isSelected ? '0.5rem' : 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas fa-external-link-alt",
                        style: {
                            marginRight: '0.25rem'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                        lineNumber: 767,
                        columnNumber: 9
                    }, this),
                    "View on eBay"
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 749,
                columnNumber: 7
            }, this),
            isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '0.375rem',
                    borderRadius: '4px',
                    background: "".concat(T.accent, "20"),
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: T.accent
                },
                children: "🎯 SM選択商品（詳細参照用）"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
                lineNumber: 773,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx",
        lineNumber: 587,
        columnNumber: 5
    }, this);
}
_c1 = CompetitorCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "TabMirror");
__turbopack_context__.k.register(_c1, "CompetitorCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_components_product-modal_components_Tabs_tab-mirror_tsx_e20c0909._.js.map