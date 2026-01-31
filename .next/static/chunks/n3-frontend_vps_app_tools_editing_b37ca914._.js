(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/app/tools/editing/components/marketplace-selector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarketplaceSelector",
    ()=>MarketplaceSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
"use client";
;
;
const items = [
    {
        key: "ebay",
        label: "eBay",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
        color: "#E53238"
    },
    {
        key: "shopee",
        label: "Shopee",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"],
        color: "#EE4D2D"
    },
    {
        key: "shopify",
        label: "Shopify",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
        color: "#96BF48"
    }
];
function MarketplaceSelector(param) {
    let { marketplaces, onChange } = param;
    const handleChange = (key)=>{
        onChange({
            ...marketplaces,
            [key]: !marketplaces[key]
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2 mb-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[10px] font-medium",
                style: {
                    color: 'var(--text-muted)'
                },
                children: "Marketplaces:"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing/components/marketplace-selector.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            items.map((mp)=>{
                const Icon = mp.icon;
                const isActive = marketplaces[mp.key];
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>handleChange(mp.key),
                    className: "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-all",
                    style: {
                        border: "1px solid ".concat(isActive ? mp.color : 'var(--panel-border)'),
                        background: isActive ? "".concat(mp.color, "10") : 'transparent',
                        color: isActive ? mp.color : 'var(--text-muted)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            size: 11
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing/components/marketplace-selector.tsx",
                            lineNumber: 45,
                            columnNumber: 13
                        }, this),
                        mp.label
                    ]
                }, mp.key, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing/components/marketplace-selector.tsx",
                    lineNumber: 35,
                    columnNumber: 11
                }, this);
            })
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing/components/marketplace-selector.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c = MarketplaceSelector;
var _c;
__turbopack_context__.k.register(_c, "MarketplaceSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/services/product-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/services/product-api.ts
// エラーログで複数回参照されていたサービスファイルのテンプレートです。
__turbopack_context__.s([
    "productApi",
    ()=>productApi
]);
const productApi = {
    /**
   * 商品リストを取得する
   */ fetchProducts: async (params)=>{
        const { page, pageSize, filters = {}, listFilter } = params;
        // APIパラメータを構築
        const queryParams = new URLSearchParams();
        queryParams.set('page', String(page));
        queryParams.set('limit', String(pageSize));
        queryParams.set('offset', String((page - 1) * pageSize));
        if (listFilter) {
            queryParams.set('list_filter', listFilter);
        }
        if (filters && Object.keys(filters).length > 0) {
            // フィルターをJSON文字列化
            queryParams.set('filters', JSON.stringify(filters));
        }
        const url = "/api/products?".concat(queryParams.toString());
        try {
            var _result_products, _result_pagination, _result_pagination1;
            console.log('[productApi] Fetching:', url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("APIリクエスト失敗: ".concat(response.statusText));
            }
            const result = await response.json();
            // APIレスポンスの構造を確認
            console.log('[productApi] Response:', {
                success: result.success,
                productsCount: (_result_products = result.products) === null || _result_products === void 0 ? void 0 : _result_products.length,
                total: (_result_pagination = result.pagination) === null || _result_pagination === void 0 ? void 0 : _result_pagination.total
            });
            if (!result.success) {
                throw new Error(result.error || 'APIエラー');
            }
            return {
                products: result.products || [],
                total: ((_result_pagination1 = result.pagination) === null || _result_pagination1 === void 0 ? void 0 : _result_pagination1.total) || 0
            };
        } catch (error) {
            console.error('[productApi] Fetch Products Error:', error);
            // エラー発生時は空配列を返す
            return {
                products: [],
                total: 0
            };
        }
    },
    /**
   * 商品情報を更新する
   */ updateProduct: async (id, updateData)=>{
        // 実際にはAPIルート `/api/products/[id]` へPUTリクエストを送信します
        try {
            const response = await fetch("/api/products/".concat(id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });
            if (!response.ok) {
                throw new Error("更新APIリクエスト失敗: ".concat(response.statusText));
            }
            return response.json();
        } catch (error) {
            console.error("Update Product Error (".concat(id, "):"), error);
            throw error;
        }
    },
    /**
   * 商品詳細情報を取得する
   */ getProductDetail: async (id)=>{
        try {
            if (!id || id === 'undefined' || id === 'null') {
                throw new Error('無効な商品IDです');
            }
            console.log('[productApi] Fetching product detail:', id);
            const response = await fetch("/api/products/".concat(id));
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("商品ID ".concat(id, " が見つかりません"));
                }
                throw new Error("商品詳細取得失敗: ".concat(response.status, " ").concat(response.statusText));
            }
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || '商品詳細取得エラー');
            }
            // APIは { success: true, data: {...} } を返す
            return result.data;
        } catch (error) {
            console.error("[productApi] Get Product Detail Error (".concat(id, "):"), error);
            throw error;
        }
    },
    /**
   * 複数商品を一括更新する
   */ bulkUpdate: async (products)=>{
        try {
            console.log('[productApi] Bulk updating products:', products.length);
            console.log('[productApi] First product sample:', products[0]);
            const response = await fetch('/api/products/bulk-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    products
                })
            });
            const result = await response.json();
            console.log('[productApi] Bulk update response:', result);
            if (!response.ok) {
                throw new Error(result.error || "APIエラー: ".concat(response.status));
            }
            // 部分的な成功も許容（updated > 0 でOK）
            if (result.updated === 0 && result.errorCount > 0) {
                var _result_errors;
                const errorDetail = ((_result_errors = result.errors) === null || _result_errors === void 0 ? void 0 : _result_errors.join(', ')) || '不明なエラー';
                throw new Error("一括更新失敗: ".concat(errorDetail));
            }
            // エラーがあっても成功があれば警告だけ
            if (result.errorCount > 0) {
                console.warn('[productApi] Partial errors:', result.errors);
            }
            return result;
        } catch (error) {
            console.error('[productApi] Bulk Update Error:', error);
            throw error;
        }
    },
    /**
   * 商品を削除する
   */ deleteProduct: async (id)=>{
        try {
            const response = await fetch("/api/products/".concat(id), {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error("削除APIリクエスト失敗: ".concat(response.statusText));
            }
            return response.json();
        } catch (error) {
            console.error("[productApi] Delete Product Error (".concat(id, "):"), error);
            throw error;
        }
    },
    /**
   * 複数商品を一括削除する
   */ bulkDelete: async (ids)=>{
        try {
            const response = await fetch('/api/products/bulk-delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ids
                })
            });
            if (!response.ok) {
                throw new Error("一括削除APIリクエスト失敗: ".concat(response.statusText));
            }
            return response.json();
        } catch (error) {
            console.error('[productApi] Bulk Delete Error:', error);
            throw error;
        }
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/components/product-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/components/product-modal.tsx
/**
 * ProductModal - 高速化版
 * 
 * 高速化ポイント:
 * 1. Prefetchデータを信頼（二重API呼び出し削除）
 * 2. React.memo でメモ化
 * 3. 初期表示を即座に行い、詳細は非同期更新
 */ __turbopack_context__.s([
    "ProductModal",
    ()=>ProductModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$full$2d$featured$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/services/product-api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const ProductModal = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function ProductModal(param) {
    let { product, onClose, onSave, onRefresh } = param;
    _s();
    // propsのproductをそのまま使用（Prefetch済みデータを信頼）
    const [currentProduct, setCurrentProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(product);
    // productが変わったら更新（ただしAPI呼び出しなし）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductModal.ProductModal.useEffect": ()=>{
            setCurrentProduct(product);
        }
    }["ProductModal.ProductModal.useEffect"], [
        product
    ]);
    // 保存ハンドラー（services経由）
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProductModal.ProductModal.useCallback[handleSave]": async (updates)=>{
            try {
                // 不正なカラムを除外
                const { product_id, marketplace, ...cleanUpdates } = updates;
                // services経由でAPI呼び出し
                await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].updateProduct(String(currentProduct.id), cleanUpdates);
                // 親に通知
                onSave(cleanUpdates);
                // イベント発行
                window.dispatchEvent(new CustomEvent('product-updated', {
                    detail: {
                        productId: currentProduct.id
                    }
                }));
            } catch (error) {
                console.error('❌ 保存エラー:', error);
            }
        }
    }["ProductModal.ProductModal.useCallback[handleSave]"], [
        currentProduct.id,
        onSave
    ]);
    // リフレッシュハンドラー
    const handleRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ProductModal.ProductModal.useCallback[handleRefresh]": async ()=>{
            try {
                // 最新データを取得（getProductDetail を使用）
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].getProductDetail(String(currentProduct.id));
                if (result.success && result.data) {
                    setCurrentProduct(result.data);
                }
                // 親に通知
                onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
            } catch (error) {
                console.error('❌ リフレッシュエラー:', error);
            }
        }
    }["ProductModal.ProductModal.useCallback[handleRefresh]"], [
        currentProduct.id,
        onRefresh
    ]);
    // ローディング表示なし（即座に表示）
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$full$2d$featured$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FullFeaturedModal"], {
        isOpen: true,
        onClose: onClose,
        product: currentProduct,
        onSave: handleSave,
        onRefresh: handleRefresh
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing/components/product-modal.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}, "w6+KuTxnxXIrSorpwUMZgN3Mt2c=")), "w6+KuTxnxXIrSorpwUMZgN3Mt2c=");
_c1 = ProductModal;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProductModal$memo");
__turbopack_context__.k.register(_c1, "ProductModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-fetch-products.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-fetch-products.ts
/**
 * データフェッチHook V2 - React Query による商品データ取得
 * 
 * 設計原則:
 * - サーバーデータは React Query のみで管理（Source of Truth）
 * - Optimistic Updates対応
 * - 楽観的ロック対応
 * - 監査ログ連携
 */ __turbopack_context__.s([
    "PRODUCT_QUERY_KEYS",
    ()=>PRODUCT_QUERY_KEYS,
    "useDeleteProducts",
    ()=>useDeleteProducts,
    "useFetchProducts",
    ()=>useFetchProducts,
    "usePrefetchNextPage",
    ()=>usePrefetchNextPage,
    "usePrefetchPrevPage",
    ()=>usePrefetchPrevPage,
    "usePrefetchProductDetail",
    ()=>usePrefetchProductDetail,
    "useSaveProduct",
    ()=>useSaveProduct,
    "useSaveProducts",
    ()=>useSaveProducts,
    "useUploadCSV",
    ()=>useUploadCSV
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/services/product-api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/product/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/product/uiStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/product/domainStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$audit$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/audit/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$audit$2f$audit$2d$log$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/audit/audit-log.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature();
;
;
;
;
;
const PRODUCT_QUERY_KEYS = {
    all: [
        'products'
    ],
    list: (params)=>[
            'products',
            'list',
            params
        ],
    detail: (id)=>[
            'products',
            'detail',
            id
        ]
};
function normalizeProducts(products, total) {
    const productMap = {};
    const productIds = [];
    for (const product of products){
        const id = String(product.id);
        productMap[id] = product;
        productIds.push(id);
    }
    return {
        productMap,
        productIds,
        total
    };
}
function useFetchProducts() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const currentPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "useFetchProducts.useProductUIStore[currentPage]": (state)=>state.currentPage
    }["useFetchProducts.useProductUIStore[currentPage]"]);
    const pageSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "useFetchProducts.useProductUIStore[pageSize]": (state)=>state.pageSize
    }["useFetchProducts.useProductUIStore[pageSize]"]);
    const filters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "useFetchProducts.useProductUIStore[filters]": (state)=>state.filters
    }["useFetchProducts.useProductUIStore[filters]"]);
    const sort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "useFetchProducts.useProductUIStore[sort]": (state)=>state.sort
    }["useFetchProducts.useProductUIStore[sort]"]);
    const listFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "useFetchProducts.useProductUIStore[listFilter]": (state)=>state.listFilter
    }["useFetchProducts.useProductUIStore[listFilter]"]);
    const queryParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useFetchProducts.useMemo[queryParams]": ()=>({
                page: currentPage,
                pageSize,
                filters,
                sort,
                listFilter
            })
    }["useFetchProducts.useMemo[queryParams]"], [
        currentPage,
        pageSize,
        filters,
        sort,
        listFilter
    ]);
    var _options_staleTime, _options_gcTime, _options_enabled;
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: PRODUCT_QUERY_KEYS.list(queryParams),
        queryFn: {
            "useFetchProducts.useQuery[query]": async ()=>{
                console.log('[useFetchProducts] Fetching with listFilter:', listFilter);
                console.log('[useFetchProducts] Full queryParams:', queryParams);
                // L3フィルターに応じてAPIパラメータを調整
                const apiFilters = {
                    ...filters
                };
                switch(listFilter){
                    case 'approval_pending':
                        // 承認フローに入る条件を満たした商品
                        // TODO: 実際のビジネスロジックに合わせて調整
                        apiFilters.ready_for_approval = true;
                        break;
                    case 'data_editing':
                        apiFilters.status = 'editing';
                        break;
                    case 'active_listings':
                        apiFilters.is_listed = true;
                        break;
                    case 'in_stock_master':
                        apiFilters.has_inventory = true;
                        break;
                    case 'back_order_only':
                        apiFilters.is_backorder = true;
                        break;
                    case 'delisted_only':
                        apiFilters.is_delisted = true;
                        break;
                }
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].fetchProducts({
                    page: currentPage,
                    pageSize,
                    filters: Object.keys(apiFilters).length > 0 ? apiFilters : undefined,
                    listFilter
                });
                return normalizeProducts(response.products, response.total);
            }
        }["useFetchProducts.useQuery[query]"],
        staleTime: (_options_staleTime = options.staleTime) !== null && _options_staleTime !== void 0 ? _options_staleTime : 5 * 60 * 1000,
        gcTime: (_options_gcTime = options.gcTime) !== null && _options_gcTime !== void 0 ? _options_gcTime : 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        enabled: (_options_enabled = options.enabled) !== null && _options_enabled !== void 0 ? _options_enabled : true
    });
    const invalidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFetchProducts.useCallback[invalidate]": ()=>{
            queryClient.invalidateQueries({
                queryKey: PRODUCT_QUERY_KEYS.all
            });
        }
    }["useFetchProducts.useCallback[invalidate]"], [
        queryClient
    ]);
    const emptyData = {
        productMap: {},
        productIds: [],
        total: 0
    };
    var _query_data;
    const data = (_query_data = query.data) !== null && _query_data !== void 0 ? _query_data : emptyData;
    return {
        productMap: data.productMap,
        productIds: data.productIds,
        total: data.total,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        invalidate
    };
}
_s(useFetchProducts, "N7Vm/J17WZzx+lAsjpt2ujX8hMg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useSaveProducts() {
    _s1();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const currentPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "useSaveProducts.useProductUIStore[currentPage]": (state)=>state.currentPage
    }["useSaveProducts.useProductUIStore[currentPage]"]);
    const pageSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "useSaveProducts.useProductUIStore[pageSize]": (state)=>state.pageSize
    }["useSaveProducts.useProductUIStore[pageSize]"]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useSaveProducts.useMutation": async ()=>{
                const modifiedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModifiedProductsData"])();
                if (modifiedData.length === 0) {
                    return {
                        success: true,
                        updated: 0
                    };
                }
                console.log("[useSaveProducts] Saving ".concat(modifiedData.length, " products"));
                const products = modifiedData.map({
                    "useSaveProducts.useMutation.products": (param)=>{
                        let { id, updates } = param;
                        return {
                            id,
                            ...updates
                        };
                    }
                }["useSaveProducts.useMutation.products"]);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$audit$2f$audit$2d$log$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logProductBulkUpdate"])(modifiedData.map({
                    "useSaveProducts.useMutation": (d)=>d.id
                }["useSaveProducts.useMutation"]));
                return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].bulkUpdate(products);
            }
        }["useSaveProducts.useMutation"],
        // Optimistic Update
        onMutate: {
            "useSaveProducts.useMutation": async ()=>{
                await queryClient.cancelQueries({
                    queryKey: PRODUCT_QUERY_KEYS.all
                });
                const params = {
                    page: currentPage,
                    pageSize
                };
                const previousData = queryClient.getQueryData(PRODUCT_QUERY_KEYS.list(params));
                if (previousData) {
                    const modifiedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getModifiedProductsData"])();
                    const newProductMap = {
                        ...previousData.productMap
                    };
                    for (const { id, updates } of modifiedData){
                        if (newProductMap[id]) {
                            newProductMap[id] = {
                                ...newProductMap[id],
                                ...updates
                            };
                        }
                    }
                    queryClient.setQueryData(PRODUCT_QUERY_KEYS.list(params), {
                        ...previousData,
                        productMap: newProductMap
                    });
                }
                return {
                    previousData,
                    params
                };
            }
        }["useSaveProducts.useMutation"],
        onSuccess: {
            "useSaveProducts.useMutation": (result)=>{
                console.log("✅ 一括保存完了: ".concat(result.updated, "件"));
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productDomainActions"].discardAllChanges();
            }
        }["useSaveProducts.useMutation"],
        onError: {
            "useSaveProducts.useMutation": (error, _, context)=>{
                console.error('❌ 一括保存エラー:', error);
                // ロールバック
                if ((context === null || context === void 0 ? void 0 : context.previousData) && (context === null || context === void 0 ? void 0 : context.params)) {
                    queryClient.setQueryData(PRODUCT_QUERY_KEYS.list(context.params), context.previousData);
                }
                // 競合エラーの場合
                if (error && typeof error === 'object' && 'code' in error && error.code === 409) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductDomainStore"].getState().setSaveError('他のユーザーがこのデータを更新しました。画面をリロードして再試行してください。');
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductDomainStore"].getState().setSaveError(error instanceof Error ? error.message : '保存に失敗しました');
                }
            }
        }["useSaveProducts.useMutation"],
        onSettled: {
            "useSaveProducts.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: PRODUCT_QUERY_KEYS.all
                });
            }
        }["useSaveProducts.useMutation"]
    });
}
_s1(useSaveProducts, "x/rnZKGpb3sIJLs1qZ2OAfBOV2Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDeleteProducts() {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const currentPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "useDeleteProducts.useProductUIStore[currentPage]": (state)=>state.currentPage
    }["useDeleteProducts.useProductUIStore[currentPage]"]);
    const pageSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "useDeleteProducts.useProductUIStore[pageSize]": (state)=>state.pageSize
    }["useDeleteProducts.useProductUIStore[pageSize]"]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useDeleteProducts.useMutation": async (productIds)=>{
                if (productIds.length === 0) {
                    return {
                        success: true,
                        deleted: 0
                    };
                }
                console.log("[useDeleteProducts] Deleting ".concat(productIds.length, " products"));
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$audit$2f$audit$2d$log$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logProductDelete"])(productIds);
                return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].bulkDelete(productIds);
            }
        }["useDeleteProducts.useMutation"],
        // Optimistic Update
        onMutate: {
            "useDeleteProducts.useMutation": async (productIds)=>{
                await queryClient.cancelQueries({
                    queryKey: PRODUCT_QUERY_KEYS.all
                });
                const params = {
                    page: currentPage,
                    pageSize
                };
                const previousData = queryClient.getQueryData(PRODUCT_QUERY_KEYS.list(params));
                if (previousData) {
                    const idsToDelete = new Set(productIds);
                    const newProductMap = {
                        ...previousData.productMap
                    };
                    const newProductIds = previousData.productIds.filter({
                        "useDeleteProducts.useMutation.newProductIds": (id)=>!idsToDelete.has(id)
                    }["useDeleteProducts.useMutation.newProductIds"]);
                    for (const id of productIds){
                        delete newProductMap[id];
                    }
                    queryClient.setQueryData(PRODUCT_QUERY_KEYS.list(params), {
                        productMap: newProductMap,
                        productIds: newProductIds,
                        total: previousData.total - productIds.length
                    });
                }
                return {
                    previousData,
                    params
                };
            }
        }["useDeleteProducts.useMutation"],
        onSuccess: {
            "useDeleteProducts.useMutation": (result, deletedIds)=>{
                console.log("✅ 削除完了: ".concat(result.deleted, "件"));
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productDomainActions"].deselectAll();
                deletedIds.forEach({
                    "useDeleteProducts.useMutation": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productDomainActions"].discardChange(id)
                }["useDeleteProducts.useMutation"]);
            }
        }["useDeleteProducts.useMutation"],
        onError: {
            "useDeleteProducts.useMutation": (error, _, context)=>{
                console.error('❌ 削除エラー:', error);
                if ((context === null || context === void 0 ? void 0 : context.previousData) && (context === null || context === void 0 ? void 0 : context.params)) {
                    queryClient.setQueryData(PRODUCT_QUERY_KEYS.list(context.params), context.previousData);
                }
            }
        }["useDeleteProducts.useMutation"],
        onSettled: {
            "useDeleteProducts.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: PRODUCT_QUERY_KEYS.all
                });
            }
        }["useDeleteProducts.useMutation"]
    });
}
_s2(useDeleteProducts, "x/rnZKGpb3sIJLs1qZ2OAfBOV2Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useUploadCSV() {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useUploadCSV.useMutation": async (param)=>{
                let { data, options } = param;
                console.log("[useUploadCSV] Uploading ".concat(data.length, " items"));
                return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].uploadCSV(data, options);
            }
        }["useUploadCSV.useMutation"],
        onSuccess: {
            "useUploadCSV.useMutation": (result)=>{
                console.log("✅ CSVアップロード完了: ".concat(result.imported, "件"));
                queryClient.invalidateQueries({
                    queryKey: PRODUCT_QUERY_KEYS.all
                });
            }
        }["useUploadCSV.useMutation"],
        onError: {
            "useUploadCSV.useMutation": (error)=>{
                console.error('❌ CSVアップロードエラー:', error);
            }
        }["useUploadCSV.useMutation"]
    });
}
_s3(useUploadCSV, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useSaveProduct() {
    _s4();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useSaveProduct.useMutation": async (param)=>{
                let { productId, product } = param;
                console.log("[useSaveProduct] Saving product ".concat(productId));
                return __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].updateProduct(productId, product);
            }
        }["useSaveProduct.useMutation"],
        onSuccess: {
            "useSaveProduct.useMutation": (_, param)=>{
                let { productId } = param;
                console.log("✅ 保存完了: 商品ID ".concat(productId));
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productDomainActions"].markAsSaved([
                    productId
                ]);
            }
        }["useSaveProduct.useMutation"],
        onError: {
            "useSaveProduct.useMutation": (error, param)=>{
                let { productId } = param;
                console.error("❌ 保存エラー: 商品ID ".concat(productId), error);
            }
        }["useSaveProduct.useMutation"],
        onSettled: {
            "useSaveProduct.useMutation": ()=>{
                queryClient.invalidateQueries({
                    queryKey: PRODUCT_QUERY_KEYS.all
                });
            }
        }["useSaveProduct.useMutation"]
    });
}
_s4(useSaveProduct, "YK0wzM21ECnncaq5SECwU+/SVdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function usePrefetchProductDetail() {
    _s5();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePrefetchProductDetail.useCallback": (productId)=>{
            queryClient.prefetchQuery({
                queryKey: PRODUCT_QUERY_KEYS.detail(productId),
                queryFn: {
                    "usePrefetchProductDetail.useCallback": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].getProductDetail(productId)
                }["usePrefetchProductDetail.useCallback"],
                staleTime: 60 * 1000
            });
        }
    }["usePrefetchProductDetail.useCallback"], [
        queryClient
    ]);
}
_s5(usePrefetchProductDetail, "esWUSkX5QYGu6HykoNvE/x3w070=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"]
    ];
});
function usePrefetchNextPage() {
    _s6();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const currentPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "usePrefetchNextPage.useProductUIStore[currentPage]": (state)=>state.currentPage
    }["usePrefetchNextPage.useProductUIStore[currentPage]"]);
    const pageSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "usePrefetchNextPage.useProductUIStore[pageSize]": (state)=>state.pageSize
    }["usePrefetchNextPage.useProductUIStore[pageSize]"]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePrefetchNextPage.useCallback": (total)=>{
            const hasNextPage = currentPage * pageSize < total;
            if (hasNextPage) {
                const nextPage = currentPage + 1;
                const params = {
                    page: nextPage,
                    pageSize
                };
                queryClient.prefetchQuery({
                    queryKey: PRODUCT_QUERY_KEYS.list(params),
                    queryFn: {
                        "usePrefetchNextPage.useCallback": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].fetchProducts({
                                page: nextPage,
                                pageSize
                            })
                    }["usePrefetchNextPage.useCallback"],
                    staleTime: 30 * 1000
                });
                console.log("[Prefetch] 次ページ ".concat(nextPage, " をプリフェッチ"));
            }
        }
    }["usePrefetchNextPage.useCallback"], [
        queryClient,
        currentPage,
        pageSize
    ]);
}
_s6(usePrefetchNextPage, "pDD2BWIJyNGUPVu+XOnmfsQ1hTs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"]
    ];
});
function usePrefetchPrevPage() {
    _s7();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const currentPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "usePrefetchPrevPage.useProductUIStore[currentPage]": (state)=>state.currentPage
    }["usePrefetchPrevPage.useProductUIStore[currentPage]"]);
    const pageSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "usePrefetchPrevPage.useProductUIStore[pageSize]": (state)=>state.pageSize
    }["usePrefetchPrevPage.useProductUIStore[pageSize]"]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePrefetchPrevPage.useCallback": ()=>{
            if (currentPage > 1) {
                const prevPage = currentPage - 1;
                const params = {
                    page: prevPage,
                    pageSize
                };
                queryClient.prefetchQuery({
                    queryKey: PRODUCT_QUERY_KEYS.list(params),
                    queryFn: {
                        "usePrefetchPrevPage.useCallback": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].fetchProducts({
                                page: prevPage,
                                pageSize
                            })
                    }["usePrefetchPrevPage.useCallback"],
                    staleTime: 30 * 1000
                });
                console.log("[Prefetch] 前ページ ".concat(prevPage, " をプリフェッチ"));
            }
        }
    }["usePrefetchPrevPage.useCallback"], [
        queryClient,
        currentPage,
        pageSize
    ]);
}
_s7(usePrefetchPrevPage, "pDD2BWIJyNGUPVu+XOnmfsQ1hTs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-product-data.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-product-data.ts
/**
 * 商品データ管理フック - 最適化版 V3
 * 
 * 設計原則（Gemini推奨アーキテクチャ）:
 * - サーバーデータ → React Query（Source of Truth）
 * - クライアントドメイン状態 → Zustand (domainStore)
 * - UI状態 → Zustand (uiStore)
 * - このフックは統合インターフェースとして機能
 * 
 * データフロー:
 * 1. React Query がサーバーからデータ取得 + 正規化
 * 2. ローカル変更は domainStore で追跡
 * 3. このフックで両者をマージして返す
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useProductData",
    ()=>useProductData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$fetch$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-fetch-products.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/product/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/product/domainStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/product/uiStore.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
function useProductData() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    _s();
    // ============================================================
    // 1. React Query からサーバーデータ取得（正規化済み）
    // ============================================================
    const { productMap, productIds: serverProductIds, total, isLoading: fetchLoading, isFetching, error: fetchError, refetch } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$fetch$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFetchProducts"])({
        enabled: options.enabled
    });
    // ============================================================
    // 2. Zustand Store からクライアント状態取得
    // ============================================================
    // Domain Store（個別セレクター）
    const modifiedProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductDomainStore"])({
        "useProductData.useProductDomainStore[modifiedProducts]": (state)=>state.modifiedProducts
    }["useProductData.useProductDomainStore[modifiedProducts]"]);
    const selectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductDomainStore"])({
        "useProductData.useProductDomainStore[selectedIds]": (state)=>state.selectedIds
    }["useProductData.useProductDomainStore[selectedIds]"]);
    const saveError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductDomainStore"])({
        "useProductData.useProductDomainStore[saveError]": (state)=>state.saveError
    }["useProductData.useProductDomainStore[saveError]"]);
    // UI Store（個別セレクター）
    const currentPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "useProductData.useProductUIStore[currentPage]": (state)=>state.currentPage
    }["useProductData.useProductUIStore[currentPage]"]);
    const pageSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"])({
        "useProductData.useProductUIStore[pageSize]": (state)=>state.pageSize
    }["useProductData.useProductUIStore[pageSize]"]);
    // ============================================================
    // 3. Mutations
    // ============================================================
    const saveMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$fetch$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSaveProducts"])();
    const deleteMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$fetch$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeleteProducts"])();
    const uploadMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$fetch$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUploadCSV"])();
    const saveProductMutation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$fetch$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSaveProduct"])();
    // ============================================================
    // 4. データ統合（サーバーデータ + ローカル変更をマージ）
    // ============================================================
    const products = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProductData.useMemo[products]": ()=>{
            return serverProductIds.map({
                "useProductData.useMemo[products]": (id)=>{
                    const serverProduct = productMap[id];
                    const localChange = modifiedProducts[id];
                    if (localChange) {
                        // ローカル変更をマージ
                        return {
                            ...serverProduct,
                            ...localChange.current,
                            isModified: true
                        };
                    }
                    return serverProduct;
                }
            }["useProductData.useMemo[products]"]).filter({
                "useProductData.useMemo[products]": (p)=>p !== undefined
            }["useProductData.useMemo[products]"]);
        }
    }["useProductData.useMemo[products]"], [
        serverProductIds,
        productMap,
        modifiedProducts
    ]);
    // 変更済みID
    const modifiedIdsSet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProductData.useMemo[modifiedIdsSet]": ()=>new Set(Object.keys(modifiedProducts))
    }["useProductData.useMemo[modifiedIdsSet]"], [
        modifiedProducts
    ]);
    // 統合ローディング状態
    const loading = fetchLoading || isFetching || saveMutation.isPending || deleteMutation.isPending || uploadMutation.isPending;
    // 統合エラー状態
    const error = (fetchError === null || fetchError === void 0 ? void 0 : fetchError.message) || saveError || null;
    // ============================================================
    // 5. Actions
    // ============================================================
    /**
   * 商品一覧を再読み込み
   */ const loadProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductData.useCallback[loadProducts]": async ()=>{
            console.log('[useProductData] loadProducts triggered');
            await refetch();
        }
    }["useProductData.useCallback[loadProducts]"], [
        refetch
    ]);
    /**
   * ローカル商品データを更新
   */ const updateLocalProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductData.useCallback[updateLocalProduct]": (productId, updates)=>{
            const serverProduct = productMap[productId];
            if (!serverProduct) {
                console.warn("[useProductData] Product ".concat(productId, " not found"));
                return;
            }
            // 元データと変更を追跡
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productDomainActions"].trackChange(productId, serverProduct, updates);
        }
    }["useProductData.useCallback[updateLocalProduct]"], [
        productMap
    ]);
    /**
   * 個別商品を保存
   */ const saveProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductData.useCallback[saveProduct]": async (productId)=>{
            const serverProduct = productMap[productId];
            const localChange = modifiedProducts[productId];
            if (!serverProduct) {
                console.warn("[useProductData] Product ".concat(productId, " not found"));
                return;
            }
            const productToSave = localChange ? {
                ...serverProduct,
                ...localChange.current
            } : serverProduct;
            await saveProductMutation.mutateAsync({
                productId,
                product: productToSave
            });
        }
    }["useProductData.useCallback[saveProduct]"], [
        productMap,
        modifiedProducts,
        saveProductMutation
    ]);
    /**
   * 変更された全商品を一括保存
   */ const saveAllModified = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductData.useCallback[saveAllModified]": async ()=>{
            return saveMutation.mutateAsync();
        }
    }["useProductData.useCallback[saveAllModified]"], [
        saveMutation
    ]);
    /**
   * 商品を削除
   */ const deleteProductsAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductData.useCallback[deleteProductsAction]": async (ids)=>{
            return deleteMutation.mutateAsync(ids);
        }
    }["useProductData.useCallback[deleteProductsAction]"], [
        deleteMutation
    ]);
    /**
   * CSVアップロード
   */ const uploadCSVAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductData.useCallback[uploadCSVAction]": async (data, opts)=>{
            return uploadMutation.mutateAsync({
                data,
                options: opts
            });
        }
    }["useProductData.useCallback[uploadCSVAction]"], [
        uploadMutation
    ]);
    // ============================================================
    // 6. Selection Actions
    // ============================================================
    const selectProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductData.useCallback[selectProduct]": (id)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productDomainActions"].select(id);
        }
    }["useProductData.useCallback[selectProduct]"], []);
    const deselectProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductData.useCallback[deselectProduct]": (id)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productDomainActions"].deselect(id);
        }
    }["useProductData.useCallback[deselectProduct]"], []);
    const toggleSelectProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductData.useCallback[toggleSelectProduct]": (id)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productDomainActions"].toggleSelect(id);
        }
    }["useProductData.useCallback[toggleSelectProduct]"], []);
    const selectAllProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductData.useCallback[selectAllProducts]": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productDomainActions"].selectAll(serverProductIds);
        }
    }["useProductData.useCallback[selectAllProducts]"], [
        serverProductIds
    ]);
    const deselectAllProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductData.useCallback[deselectAllProducts]": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productDomainActions"].deselectAll();
        }
    }["useProductData.useCallback[deselectAllProducts]"], []);
    const setSelectedIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductData.useCallback[setSelectedIds]": (ids)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productDomainActions"].setSelectedIds(ids);
        }
    }["useProductData.useCallback[setSelectedIds]"], []);
    // ============================================================
    // 7. Return
    // ============================================================
    return {
        // Data（マージ済み）
        products,
        productIds: serverProductIds,
        total,
        // State
        loading,
        error,
        modifiedIds: modifiedIdsSet,
        selectedIds,
        // Pagination
        currentPage,
        pageSize,
        setCurrentPage: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productUIActions"].setPage,
        setPageSize: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productUIActions"].setPageSize,
        // Actions
        loadProducts,
        updateLocalProduct,
        saveProduct,
        saveAllModified,
        deleteProducts: deleteProductsAction,
        uploadCSV: uploadCSVAction,
        // Selection
        selectProduct,
        deselectProduct,
        toggleSelectProduct,
        selectAllProducts,
        deselectAllProducts,
        setSelectedIds,
        // Mutation States
        isSaving: saveMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isUploading: uploadMutation.isPending
    };
}
_s(useProductData, "+8sstfocW2lj7ZMMV0h3PXUOq7c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$fetch$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFetchProducts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductDomainStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductDomainStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$domainStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductDomainStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$product$2f$uiStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductUIStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$fetch$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSaveProducts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$fetch$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeleteProducts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$fetch$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUploadCSV"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$fetch$2d$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSaveProduct"]
    ];
});
;
;
const __TURBOPACK__default__export__ = useProductData;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/services/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/services/api-client.ts
/**
 * 統一APIクライアント
 * 全てのAPI呼び出しはこのクライアントを経由する
 */ __turbopack_context__.s([
    "apiClient",
    ()=>apiClient,
    "apiDelete",
    ()=>apiDelete,
    "apiGet",
    ()=>apiGet,
    "apiPost",
    ()=>apiPost,
    "apiPut",
    ()=>apiPut
]);
async function apiClient(path) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const url = path.startsWith('/api/') ? path : "/api/".concat(path);
    const defaultHeaders = {
        'Content-Type': 'application/json'
    };
    const response = await fetch(url, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(()=>({
                message: '不明なAPIエラー'
            }));
        throw new Error(errorData.message || "API Error: ".concat(response.status));
    }
    return response.json();
}
function apiGet(path, options) {
    return apiClient(path, {
        ...options,
        method: 'GET'
    });
}
function apiPost(path, body, options) {
    return apiClient(path, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined
    });
}
function apiPut(path, body, options) {
    return apiClient(path, {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined
    });
}
function apiDelete(path, body, options) {
    return apiClient(path, {
        ...options,
        method: 'DELETE',
        body: body ? JSON.stringify(body) : undefined
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/services/process-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/services/process-api.ts
__turbopack_context__.s([
    "processApi",
    ()=>processApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/services/api-client.ts [app-client] (ecmascript)");
;
const processApi = {
    /**
   * カテゴリ分析バッチ
   */ batchCategory: async (productIds)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/tools/category-analyze', {
            productIds
        });
    },
    /**
   * 送料計算バッチ
   */ batchShipping: async (productIds)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/tools/shipping-calculate', {
            productIds
        });
    },
    /**
   * 利益計算バッチ
   */ batchProfit: async (productIds)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/tools/profit-calculate', {
            productIds
        });
    },
    /**
   * HTML生成
   */ generateHTML: async (productIds)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/tools/html-generate', {
            productIds
        });
    },
    /**
   * SellerMirror分析バッチ
   */ batchSellerMirror: async (productIds)=>{
        // 複数商品を順次処理
        const results = [];
        const errors = [];
        console.log("🔍 SellerMirror分析開始: ".concat(productIds.length, "件"));
        for (const productId of productIds){
            try {
                var _product_ebay_api_data;
                // 商品情報を取得
                console.log("  📦 商品取得中: ".concat(productId));
                const productResponse = await fetch("/api/products/".concat(productId));
                if (!productResponse.ok) {
                    const errorMsg = "商品取得失敗 (".concat(productResponse.status, "): ").concat(productId);
                    console.error("  ❌ ".concat(errorMsg));
                    errors.push(errorMsg);
                    results.push({
                        productId,
                        success: false,
                        error: errorMsg
                    });
                    continue;
                }
                const productResult = await productResponse.json();
                // APIレスポンスから.dataを取得
                if (!productResult.success || !productResult.data) {
                    const errorMsg = "商品データなし: ".concat(productId);
                    console.error("  ❌ ".concat(errorMsg));
                    errors.push(errorMsg);
                    results.push({
                        productId,
                        success: false,
                        error: errorMsg
                    });
                    continue;
                }
                const product = productResult.data;
                // 英語タイトルがない場合はスキップ
                const ebayTitle = product.english_title || product.title_en || product.title;
                if (!ebayTitle) {
                    const errorMsg = "タイトルなし: ".concat(productId);
                    console.warn("  ⚠️ ".concat(errorMsg));
                    errors.push(errorMsg);
                    results.push({
                        productId,
                        success: false,
                        error: errorMsg
                    });
                    continue;
                }
                // SellerMirror分析を実行
                console.log("  🔍 SM分析実行: ".concat(productId, " (").concat(ebayTitle.substring(0, 30), "...)"));
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/sellermirror/analyze', {
                    productId: product.id,
                    ebayTitle: ebayTitle,
                    ebayCategoryId: product.category_id || ((_product_ebay_api_data = product.ebay_api_data) === null || _product_ebay_api_data === void 0 ? void 0 : _product_ebay_api_data.category_id)
                });
                if (result.success) {
                    console.log("  ✅ SM分析成功: ".concat(productId));
                    results.push({
                        productId,
                        success: true
                    });
                } else {
                    console.error("  ❌ SM分析失敗: ".concat(productId), result.error);
                    results.push({
                        productId,
                        success: false,
                        error: result.error
                    });
                }
            } catch (error) {
                const errorMsg = error.message || 'Unknown error';
                console.error("  ❌ SellerMirror分析例外: ".concat(productId), errorMsg);
                errors.push("".concat(productId, ": ").concat(errorMsg));
                results.push({
                    productId,
                    success: false,
                    error: errorMsg
                });
            }
        }
        const successCount = results.filter((r)=>r.success).length;
        console.log("✅ SellerMirror分析完了: ".concat(successCount, "/").concat(productIds.length, "件成功"));
        return {
            success: successCount > 0,
            updated: successCount,
            total: productIds.length,
            errors: errors.length > 0 ? errors : undefined,
            message: "".concat(successCount, "/").concat(productIds.length, "件分析完了").concat(errors.length > 0 ? " (".concat(errors.length, "件エラー)") : '')
        };
    },
    /**
   * スコア計算バッチ
   */ calculateScores: async (productIds)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/score/calculate', {
            productIds
        });
    },
    /**
   * HTS推定
   */ estimateHTS: async (data)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/hts/estimate', data);
    },
    /**
   * 翻訳
   */ translate: async (data)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/tools/translate-product', data);
    },
    /**
   * AI情報強化
   */ enrichWithAI: async (productId)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/tools/editing/ai/enrich', {
            productId
        });
    },
    /**
   * 市場調査
   */ marketResearch: async (productIds)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/research', {
            productIds
        });
    },
    /**
   * フィルター実行
   */ runFilter: async (productIds)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/filter-check', {
            productIds
        });
    },
    /**
   * 最終処理
   */ finalProcess: async (productIds)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])('/api/tools/editing/compliance/final-process', {
            productIds
        });
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-batch-process.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-batch-process.ts
__turbopack_context__.s([
    "useBatchProcess",
    ()=>useBatchProcess
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/services/process-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
const useBatchProcess = (onComplete)=>{
    _s();
    const [processing, setProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    /**
   * カテゴリ分析バッチ
   */ const runBatchCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBatchProcess.useCallback[runBatchCategory]": async (productIds)=>{
            if (productIds.length === 0) return;
            setProcessing(true);
            setCurrentStep('カテゴリ分析中...');
            try {
                console.log('🏷️ カテゴリ分析バッチ開始:', productIds.length);
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processApi"].batchCategory(productIds);
                console.log('✅ カテゴリ分析完了:', result);
                if (onComplete) await onComplete();
                return result;
            } catch (error) {
                console.error('❌ カテゴリ分析エラー:', error);
                throw error;
            } finally{
                setProcessing(false);
                setCurrentStep('');
            }
        }
    }["useBatchProcess.useCallback[runBatchCategory]"], [
        onComplete
    ]);
    /**
   * 送料計算バッチ
   */ const runBatchShipping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBatchProcess.useCallback[runBatchShipping]": async (productIds)=>{
            if (productIds.length === 0) return;
            setProcessing(true);
            setCurrentStep('送料計算中...');
            try {
                console.log('📦 送料計算バッチ開始:', productIds.length);
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processApi"].batchShipping(productIds);
                console.log('✅ 送料計算完了:', result);
                if (onComplete) await onComplete();
                return result;
            } catch (error) {
                console.error('❌ 送料計算エラー:', error);
                throw error;
            } finally{
                setProcessing(false);
                setCurrentStep('');
            }
        }
    }["useBatchProcess.useCallback[runBatchShipping]"], [
        onComplete
    ]);
    /**
   * 利益計算バッチ
   */ const runBatchProfit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBatchProcess.useCallback[runBatchProfit]": async (productIds)=>{
            if (productIds.length === 0) return;
            setProcessing(true);
            setCurrentStep('利益計算中...');
            try {
                console.log('💰 利益計算バッチ開始:', productIds.length);
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processApi"].batchProfit(productIds);
                console.log('✅ 利益計算完了:', result);
                if (onComplete) await onComplete();
                return result;
            } catch (error) {
                console.error('❌ 利益計算エラー:', error);
                throw error;
            } finally{
                setProcessing(false);
                setCurrentStep('');
            }
        }
    }["useBatchProcess.useCallback[runBatchProfit]"], [
        onComplete
    ]);
    /**
   * HTML生成バッチ
   */ const runBatchHTMLGenerate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBatchProcess.useCallback[runBatchHTMLGenerate]": async (productIds)=>{
            if (productIds.length === 0) return;
            setProcessing(true);
            setCurrentStep('HTML生成中...');
            try {
                console.log('📝 HTML生成バッチ開始:', productIds.length);
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processApi"].generateHTML(productIds);
                console.log('✅ HTML生成完了:', result);
                if (onComplete) await onComplete();
                return result;
            } catch (error) {
                console.error('❌ HTML生成エラー:', error);
                throw error;
            } finally{
                setProcessing(false);
                setCurrentStep('');
            }
        }
    }["useBatchProcess.useCallback[runBatchHTMLGenerate]"], [
        onComplete
    ]);
    /**
   * SellerMirror分析バッチ
   */ const runBatchSellerMirror = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBatchProcess.useCallback[runBatchSellerMirror]": async (productIds)=>{
            if (productIds.length === 0) return;
            setProcessing(true);
            setCurrentStep('SellerMirror分析中...');
            try {
                console.log('🔍 SellerMirror分析バッチ開始:', productIds.length);
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processApi"].batchSellerMirror(productIds);
                console.log('✅ SellerMirror分析完了:', result);
                if (onComplete) await onComplete();
                return result;
            } catch (error) {
                console.error('❌ SellerMirror分析エラー:', error);
                throw error;
            } finally{
                setProcessing(false);
                setCurrentStep('');
            }
        }
    }["useBatchProcess.useCallback[runBatchSellerMirror]"], [
        onComplete
    ]);
    /**
   * スコア計算バッチ
   * @param input - 商品ID配列または商品オブジェクト配列
   */ const runBatchScores = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBatchProcess.useCallback[runBatchScores]": async (input)=>{
            // 商品オブジェクト配列の場合はIDを抽出
            const productIds = input.map({
                "useBatchProcess.useCallback[runBatchScores].productIds": (item)=>typeof item === 'string' ? item : String(item.id)
            }["useBatchProcess.useCallback[runBatchScores].productIds"]);
            if (productIds.length === 0) return {
                success: true,
                updated: 0
            };
            setProcessing(true);
            setCurrentStep('スコア計算中...');
            try {
                console.log('📊 スコア計算バッチ開始:', productIds.length);
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processApi"].calculateScores(productIds);
                console.log('✅ スコア計算完了:', result);
                if (onComplete) await onComplete();
                return result;
            } catch (error) {
                console.error('❌ スコア計算エラー:', error);
                throw error;
            } finally{
                setProcessing(false);
                setCurrentStep('');
            }
        }
    }["useBatchProcess.useCallback[runBatchScores]"], [
        onComplete
    ]);
    /**
   * 全処理チェーン実行
   * @param input - 商品ID配列または商品オブジェクト配列
   */ const runAllProcesses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBatchProcess.useCallback[runAllProcesses]": async (input)=>{
            // 商品オブジェクト配列の場合はIDを抽出
            const productIds = input.map({
                "useBatchProcess.useCallback[runAllProcesses].productIds": (item)=>typeof item === 'string' ? item : String(item.id)
            }["useBatchProcess.useCallback[runAllProcesses].productIds"]);
            if (productIds.length === 0) return {
                success: false,
                message: '商品が選択されていません'
            };
            setProcessing(true);
            const errors = [];
            const results = {};
            try {
                console.log('🚀 全処理チェーン開始:', productIds.length);
                // 1. カテゴリ分析
                setCurrentStep('カテゴリ分析中... (1/6)');
                try {
                    results.category = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processApi"].batchCategory(productIds);
                    console.log('✅ カテゴリ分析完了');
                } catch (e) {
                    console.error('❌ カテゴリ分析エラー:', e.message);
                    errors.push("カテゴリ: ".concat(e.message));
                }
                // 2. 送料計算
                setCurrentStep('送料計算中... (2/6)');
                try {
                    results.shipping = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processApi"].batchShipping(productIds);
                    console.log('✅ 送料計算完了');
                } catch (e) {
                    console.error('❌ 送料計算エラー:', e.message);
                    errors.push("送料: ".concat(e.message));
                }
                // 3. 利益計算
                setCurrentStep('利益計算中... (3/6)');
                try {
                    results.profit = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processApi"].batchProfit(productIds);
                    console.log('✅ 利益計算完了');
                } catch (e) {
                    console.error('❌ 利益計算エラー:', e.message);
                    errors.push("利益: ".concat(e.message));
                }
                // 4. HTML生成
                setCurrentStep('HTML生成中... (4/6)');
                try {
                    results.html = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processApi"].generateHTML(productIds);
                    console.log('✅ HTML生成完了');
                } catch (e) {
                    console.error('❌ HTML生成エラー:', e.message);
                    errors.push("HTML: ".concat(e.message));
                }
                // 5. SellerMirror分析
                setCurrentStep('SellerMirror分析中... (5/6)');
                try {
                    var _results_sellerMirror;
                    results.sellerMirror = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processApi"].batchSellerMirror(productIds);
                    console.log('✅ SellerMirror分析完了:', (_results_sellerMirror = results.sellerMirror) === null || _results_sellerMirror === void 0 ? void 0 : _results_sellerMirror.message);
                } catch (e) {
                    console.error('❌ SellerMirror分析エラー:', e.message);
                    errors.push("SM: ".concat(e.message));
                }
                // 6. スコア計算
                setCurrentStep('スコア計算中... (6/6)');
                try {
                    results.scores = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$process$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["processApi"].calculateScores(productIds);
                    console.log('✅ スコア計算完了');
                } catch (e) {
                    console.error('❌ スコア計算エラー:', e.message);
                    errors.push("スコア: ".concat(e.message));
                }
                console.log('✅ 全処理チェーン完了:', productIds.length, "(エラー: ".concat(errors.length, "件)"));
                if (onComplete) await onComplete();
                return {
                    success: errors.length === 0,
                    results,
                    errors: errors.length > 0 ? errors : undefined,
                    message: errors.length === 0 ? "".concat(productIds.length, "件の処理が完了しました") : "".concat(productIds.length, "件処理完了 (").concat(errors.length, "件エラー)")
                };
            } catch (error) {
                console.error('❌ 全処理チェーン致命的エラー:', error);
                return {
                    success: false,
                    errors: [
                        ...errors,
                        error.message
                    ],
                    message: "処理中にエラーが発生しました: ".concat(error.message)
                };
            } finally{
                setProcessing(false);
                setCurrentStep('');
            }
        }
    }["useBatchProcess.useCallback[runAllProcesses]"], [
        onComplete
    ]);
    return {
        processing,
        currentStep,
        runBatchCategory,
        runBatchShipping,
        runBatchProfit,
        runBatchHTMLGenerate,
        runBatchSellerMirror,
        runBatchScores,
        runAllProcesses
    };
};
_s(useBatchProcess, "5SJCZacax57Y5+UWyHnxUNuMLtw=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-taxonomy-operations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-taxonomy-operations.ts
__turbopack_context__.s([
    "useTaxonomyOperations",
    ()=>useTaxonomyOperations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useTaxonomyOperations(param) {
    let { products, selectedIds, onShowToast, onLoadProducts, updateLocalProduct } = param;
    _s();
    const [htsLoading, setHtsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // HTS取得ハンドラー - AIでHTSコードを推定
    const handleHTSFetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTaxonomyOperations.useCallback[handleHTSFetch]": async ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            const selectedProducts = products.filter({
                "useTaxonomyOperations.useCallback[handleHTSFetch].selectedProducts": (p)=>selectedIds.has(String(p.id))
            }["useTaxonomyOperations.useCallback[handleHTSFetch].selectedProducts"]);
            setHtsLoading(true);
            onShowToast("".concat(selectedProducts.length, "件のHTSコードを推定中..."), 'success');
            try {
                let updatedCount = 0;
                let uncertainCount = 0;
                for (const product of selectedProducts){
                    var _product_ebay_api_data, _product_ebay_api_data1;
                    const response = await fetch('/api/hts/estimate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            productId: product.id,
                            title: product.title || product.english_title,
                            categoryName: product.category_name || ((_product_ebay_api_data = product.ebay_api_data) === null || _product_ebay_api_data === void 0 ? void 0 : _product_ebay_api_data.category_name),
                            categoryId: product.category_id || ((_product_ebay_api_data1 = product.ebay_api_data) === null || _product_ebay_api_data1 === void 0 ? void 0 : _product_ebay_api_data1.category_id),
                            material: product.material,
                            description: product.description
                        })
                    });
                    if (!response.ok) continue;
                    const data = await response.json();
                    if (data.success && data.htsCode) {
                        updateLocalProduct(product.id, {
                            hts_code: data.htsCode,
                            hts_description: data.htsDescription || '',
                            hts_duty_rate: data.dutyRate || null,
                            hts_confidence: data.confidence || 'uncertain'
                        });
                        // データベースに保存
                        await fetch('/api/products/update', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id: product.id,
                                updates: {
                                    hts_code: data.htsCode,
                                    hts_description: data.htsDescription || '',
                                    hts_duty_rate: data.dutyRate || null,
                                    hts_confidence: data.confidence || 'uncertain'
                                }
                            })
                        });
                        if (data.confidence === 'uncertain' || data.confidence === 'low') {
                            uncertainCount++;
                        }
                        updatedCount++;
                    } else {
                        updateLocalProduct(product.id, {
                            hts_code: '要確認',
                            hts_confidence: 'uncertain'
                        });
                        uncertainCount++;
                    }
                }
                if (updatedCount > 0) {
                    const message = uncertainCount > 0 ? "".concat(updatedCount, "件更新（うち").concat(uncertainCount, "件は要確認）") : "".concat(updatedCount, "件のHTSコードを更新しました");
                    onShowToast(message, 'success');
                    await onLoadProducts();
                } else {
                    onShowToast('HTSコードを推定できませんでした', 'error');
                }
            } catch (error) {
                onShowToast(error.message || 'HTS取得中にエラーが発生しました', 'error');
            } finally{
                setHtsLoading(false);
            }
        }
    }["useTaxonomyOperations.useCallback[handleHTSFetch]"], [
        selectedIds,
        products,
        onShowToast,
        onLoadProducts,
        updateLocalProduct
    ]);
    // 関税率自動取得ハンドラー
    const handleDutyRatesLookup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTaxonomyOperations.useCallback[handleDutyRatesLookup]": async ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            const selectedArray = Array.from(selectedIds);
            onShowToast("".concat(selectedArray.length, "件の関税率を検索中..."), 'success');
            try {
                const response = await fetch('/api/hts/lookup-duty-rates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productIds: selectedArray
                    })
                });
                if (!response.ok) {
                    throw new Error("HTTP error! status: ".concat(response.status));
                }
                const data = await response.json();
                if (data.success) {
                    onShowToast("✅ ".concat(data.updated, "件の関税率を更新しました"), 'success');
                    await onLoadProducts();
                } else {
                    throw new Error(data.error || '関税率検索に失敗しました');
                }
            } catch (error) {
                onShowToast(error.message || '関税率検索中にエラーが発生しました', 'error');
            }
        }
    }["useTaxonomyOperations.useCallback[handleDutyRatesLookup]"], [
        selectedIds,
        onShowToast,
        onLoadProducts
    ]);
    // 原産国取得ハンドラー（関税率も同時取得）
    const handleOriginCountryFetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTaxonomyOperations.useCallback[handleOriginCountryFetch]": async ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            onShowToast('原産国情報を取得中...', 'success');
            try {
                const selectedArray = Array.from(selectedIds);
                let updatedCount = 0;
                for (const productId of selectedArray){
                    const product = products.find({
                        "useTaxonomyOperations.useCallback[handleOriginCountryFetch].product": (p)=>String(p.id) === productId
                    }["useTaxonomyOperations.useCallback[handleOriginCountryFetch].product"]);
                    if (!product) continue;
                    let originCountry = product.origin_country;
                    if (!originCountry) {
                        var _product_ebay_api_data_listing_reference, _product_ebay_api_data, _product_scraped_data, _Object_entries_sort_;
                        // eBay APIデータから取得
                        let referenceItems = ((_product_ebay_api_data = product.ebay_api_data) === null || _product_ebay_api_data === void 0 ? void 0 : (_product_ebay_api_data_listing_reference = _product_ebay_api_data.listing_reference) === null || _product_ebay_api_data_listing_reference === void 0 ? void 0 : _product_ebay_api_data_listing_reference.referenceItems) || [];
                        // scraped_dataからも確認（Yahoo商品の場合）
                        if (referenceItems.length === 0 && ((_product_scraped_data = product.scraped_data) === null || _product_scraped_data === void 0 ? void 0 : _product_scraped_data.reference_items)) {
                            referenceItems = product.scraped_data.reference_items;
                        }
                        if (referenceItems.length === 0) {
                            console.log("⏭️ ".concat(productId, ": 参照商品なし - Yahoo商品の場合はeBay検索が必要"));
                            // データベースに「参照データなし」を記録
                            updateLocalProduct(productId, {
                                origin_country: '参照データなし'
                            });
                            await fetch('/api/products/update', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    id: productId,
                                    updates: {
                                        origin_country: '参照データなし'
                                    }
                                })
                            });
                            continue;
                        }
                        const countries = referenceItems.map({
                            "useTaxonomyOperations.useCallback[handleOriginCountryFetch].countries": (item)=>{
                                var _item_itemLocation;
                                return (_item_itemLocation = item.itemLocation) === null || _item_itemLocation === void 0 ? void 0 : _item_itemLocation.country;
                            }
                        }["useTaxonomyOperations.useCallback[handleOriginCountryFetch].countries"]).filter({
                            "useTaxonomyOperations.useCallback[handleOriginCountryFetch].countries": (c)=>c
                        }["useTaxonomyOperations.useCallback[handleOriginCountryFetch].countries"]);
                        if (countries.length === 0) continue;
                        const countryCount = {};
                        countries.forEach({
                            "useTaxonomyOperations.useCallback[handleOriginCountryFetch]": (c)=>{
                                countryCount[c] = (countryCount[c] || 0) + 1;
                            }
                        }["useTaxonomyOperations.useCallback[handleOriginCountryFetch]"]);
                        originCountry = (_Object_entries_sort_ = Object.entries(countryCount).sort({
                            "useTaxonomyOperations.useCallback[handleOriginCountryFetch]": (a, b)=>b[1] - a[1]
                        }["useTaxonomyOperations.useCallback[handleOriginCountryFetch]"])[0]) === null || _Object_entries_sort_ === void 0 ? void 0 : _Object_entries_sort_[0];
                    }
                    if (originCountry) {
                        let dutyRate = 0;
                        try {
                            const dutyResponse = await fetch('/api/hts/lookup-duty-rates', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    productIds: [
                                        productId
                                    ],
                                    onlyOriginCountry: true
                                })
                            });
                            if (dutyResponse.ok) {
                                var _dutyData_results__updates, _dutyData_results_, _dutyData_results;
                                const dutyData = await dutyResponse.json();
                                if (dutyData.success && ((_dutyData_results = dutyData.results) === null || _dutyData_results === void 0 ? void 0 : (_dutyData_results_ = _dutyData_results[0]) === null || _dutyData_results_ === void 0 ? void 0 : (_dutyData_results__updates = _dutyData_results_.updates) === null || _dutyData_results__updates === void 0 ? void 0 : _dutyData_results__updates.origin_country_duty_rate) != null) {
                                    dutyRate = dutyData.results[0].updates.origin_country_duty_rate;
                                }
                            }
                        } catch (dutyError) {
                            console.warn('関税率取得スキップ:', dutyError);
                        }
                        updateLocalProduct(productId, {
                            origin_country: originCountry,
                            origin_country_duty_rate: dutyRate
                        });
                        const response = await fetch('/api/products/update', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id: productId,
                                updates: {
                                    origin_country: originCountry,
                                    origin_country_duty_rate: dutyRate
                                }
                            })
                        });
                        if (response.ok) {
                            updatedCount++;
                        }
                    }
                }
                if (updatedCount > 0) {
                    onShowToast("".concat(updatedCount, "件の原産国・関税率を更新しました"), 'success');
                    await onLoadProducts();
                } else {
                    onShowToast('更新する原産国データがありませんでした', 'error');
                }
            } catch (error) {
                onShowToast(error.message || '原産国取得に失敗しました', 'error');
            }
        }
    }["useTaxonomyOperations.useCallback[handleOriginCountryFetch]"], [
        selectedIds,
        products,
        onShowToast,
        onLoadProducts,
        updateLocalProduct
    ]);
    // 素材取得ハンドラー（関税率も同時取得）
    const handleMaterialFetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTaxonomyOperations.useCallback[handleMaterialFetch]": async ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            onShowToast('素材情報を取得中...', 'success');
            try {
                const selectedArray = Array.from(selectedIds);
                let updatedCount = 0;
                let skippedCount = 0;
                let noDataCount = 0;
                for (const productId of selectedArray){
                    var _product_ebay_api_data_listing_reference, _product_ebay_api_data, _product_scraped_data, _Object_entries_sort_;
                    const product = products.find({
                        "useTaxonomyOperations.useCallback[handleMaterialFetch].product": (p)=>String(p.id) === productId
                    }["useTaxonomyOperations.useCallback[handleMaterialFetch].product"]);
                    if (!product) continue;
                    // 既に素材がある場合はスキップ
                    if (product.material) {
                        console.log("⏭️ ".concat(productId, ": 素材既存 (").concat(product.material, ")"));
                        skippedCount++;
                        continue;
                    }
                    // eBay APIデータから取得
                    let referenceItems = ((_product_ebay_api_data = product.ebay_api_data) === null || _product_ebay_api_data === void 0 ? void 0 : (_product_ebay_api_data_listing_reference = _product_ebay_api_data.listing_reference) === null || _product_ebay_api_data_listing_reference === void 0 ? void 0 : _product_ebay_api_data_listing_reference.referenceItems) || [];
                    // scraped_dataからも確認（Yahoo商品の場合）
                    if (referenceItems.length === 0 && ((_product_scraped_data = product.scraped_data) === null || _product_scraped_data === void 0 ? void 0 : _product_scraped_data.reference_items)) {
                        referenceItems = product.scraped_data.reference_items;
                    }
                    // 参照商品がない場合は「データなし」として記録
                    if (referenceItems.length === 0) {
                        console.log("⏭️ ".concat(productId, ": 参照商品なし - Yahoo商品の場合はeBay検索が必要"));
                        noDataCount++;
                        // データベースに「参照データなし」を記録
                        updateLocalProduct(productId, {
                            material: '参照データなし'
                        });
                        await fetch('/api/products/update', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id: productId,
                                updates: {
                                    material: '参照データなし'
                                }
                            })
                        });
                        continue;
                    }
                    const materials = referenceItems.map({
                        "useTaxonomyOperations.useCallback[handleMaterialFetch].materials": (item)=>{
                            var _item_itemSpecifics;
                            return (_item_itemSpecifics = item.itemSpecifics) === null || _item_itemSpecifics === void 0 ? void 0 : _item_itemSpecifics.Material;
                        }
                    }["useTaxonomyOperations.useCallback[handleMaterialFetch].materials"]).filter({
                        "useTaxonomyOperations.useCallback[handleMaterialFetch].materials": (m)=>m
                    }["useTaxonomyOperations.useCallback[handleMaterialFetch].materials"]);
                    if (materials.length === 0) continue;
                    const materialCount = {};
                    materials.forEach({
                        "useTaxonomyOperations.useCallback[handleMaterialFetch]": (m)=>{
                            materialCount[m] = (materialCount[m] || 0) + 1;
                        }
                    }["useTaxonomyOperations.useCallback[handleMaterialFetch]"]);
                    const mostCommonMaterial = (_Object_entries_sort_ = Object.entries(materialCount).sort({
                        "useTaxonomyOperations.useCallback[handleMaterialFetch]": (a, b)=>b[1] - a[1]
                    }["useTaxonomyOperations.useCallback[handleMaterialFetch]"])[0]) === null || _Object_entries_sort_ === void 0 ? void 0 : _Object_entries_sort_[0];
                    if (mostCommonMaterial) {
                        let materialDutyRate = 0;
                        const materialLower = mostCommonMaterial.toLowerCase();
                        if (materialLower.includes('aluminum') || materialLower.includes('アルミ')) {
                            materialDutyRate = 10;
                        } else if (materialLower.includes('steel') || materialLower.includes('stainless') || materialLower.includes('鉄') || materialLower.includes('ステンレス')) {
                            materialDutyRate = 25;
                        }
                        updateLocalProduct(productId, {
                            material: mostCommonMaterial,
                            material_duty_rate: materialDutyRate
                        });
                        const response = await fetch('/api/products/update', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id: productId,
                                updates: {
                                    material: mostCommonMaterial,
                                    material_duty_rate: materialDutyRate
                                }
                            })
                        });
                        if (response.ok) {
                            updatedCount++;
                        }
                    }
                }
                if (updatedCount > 0 || noDataCount > 0) {
                    let message = '';
                    if (updatedCount > 0) {
                        message += "".concat(updatedCount, "件更新");
                    }
                    if (noDataCount > 0) {
                        if (message) message += '、';
                        message += "".concat(noDataCount, "件は参照データなし");
                    }
                    if (skippedCount > 0) {
                        if (message) message += '、';
                        message += "".concat(skippedCount, "件はスキップ");
                    }
                    onShowToast(message, updatedCount > 0 ? 'success' : 'error');
                    await onLoadProducts();
                } else {
                    onShowToast("更新する素材データがありませんでした（".concat(skippedCount, "件は既存）"), 'error');
                }
            } catch (error) {
                onShowToast(error.message || '素材取得に失敗しました', 'error');
            }
        }
    }["useTaxonomyOperations.useCallback[handleMaterialFetch]"], [
        selectedIds,
        products,
        onShowToast,
        onLoadProducts,
        updateLocalProduct
    ]);
    return {
        htsLoading,
        handleHTSFetch,
        handleDutyRatesLookup,
        handleOriginCountryFetch,
        handleMaterialFetch
    };
}
_s(useTaxonomyOperations, "VTutE0ub3cwFhOx3qLbAHGpbNPY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-translation-operations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-translation-operations.ts
__turbopack_context__.s([
    "useTranslationOperations",
    ()=>useTranslationOperations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useTranslationOperations(param) {
    let { products, selectedIds, onShowToast, onLoadProducts, updateLocalProduct } = param;
    _s();
    const [translating, setTranslating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 翻訳ハンドラー（改善版：並列処理 + 進捗表示）
    const handleTranslate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useTranslationOperations.useCallback[handleTranslate]": async ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            const selectedArray = Array.from(selectedIds);
            const targetProducts = products.filter({
                "useTranslationOperations.useCallback[handleTranslate].targetProducts": (p)=>selectedIds.has(String(p.id))
            }["useTranslationOperations.useCallback[handleTranslate].targetProducts"]);
            // 翻訳が必要な商品のみフィルタリング
            const productsNeedingTranslation = targetProducts.filter({
                "useTranslationOperations.useCallback[handleTranslate].productsNeedingTranslation": (p)=>!p.english_title || !p.english_description
            }["useTranslationOperations.useCallback[handleTranslate].productsNeedingTranslation"]);
            if (productsNeedingTranslation.length === 0) {
                onShowToast("".concat(targetProducts.length, "件は既に翻訳済みです"), 'error');
                return;
            }
            console.log("🌍 翻訳開始: ".concat(productsNeedingTranslation.length, "件（").concat(selectedArray.length, "件中）"));
            setTranslating(true);
            onShowToast("".concat(productsNeedingTranslation.length, "件の商品を翻訳中..."), 'success');
            try {
                let translatedCount = 0;
                let failedCount = 0;
                const batchSize = 5 // 5件ずつ並列処理
                ;
                // 5件ずつバッチ処理
                for(let i = 0; i < productsNeedingTranslation.length; i += batchSize){
                    const batch = productsNeedingTranslation.slice(i, i + batchSize);
                    // 進捗表示
                    const progress = Math.min(i + batchSize, productsNeedingTranslation.length);
                    onShowToast("翻訳中... ".concat(progress, "/").concat(productsNeedingTranslation.length, "件"), 'success');
                    // 並列実行
                    const batchPromises = batch.map({
                        "useTranslationOperations.useCallback[handleTranslate].batchPromises": async (product)=>{
                            try {
                                // 翻訳API呼び出し
                                const response = await fetch('/api/tools/translate-product', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        productId: product.id,
                                        title: product.title,
                                        description: product.description,
                                        condition: product.condition_name
                                    })
                                });
                                if (!response.ok) {
                                    throw new Error("HTTP ".concat(response.status));
                                }
                                const result = await response.json();
                                if (result.success) {
                                    console.log("  ✅ ".concat(product.id, ": 翻訳完了"));
                                    // ローカル状態を即座に更新（テーブルに反映）
                                    updateLocalProduct(String(product.id), {
                                        english_title: result.translations.title,
                                        english_description: result.translations.description,
                                        english_condition: result.translations.condition
                                    });
                                    return {
                                        success: true,
                                        productId: product.id
                                    };
                                } else {
                                    throw new Error(result.error || '翻訳失敗');
                                }
                            } catch (error) {
                                console.error("  ❌ ".concat(product.id, ": ").concat(error.message));
                                return {
                                    success: false,
                                    productId: product.id,
                                    error: error.message
                                };
                            }
                        }
                    }["useTranslationOperations.useCallback[handleTranslate].batchPromises"]);
                    // バッチの結果を集計
                    const batchResults = await Promise.all(batchPromises);
                    const successCount = batchResults.filter({
                        "useTranslationOperations.useCallback[handleTranslate]": (r)=>r.success
                    }["useTranslationOperations.useCallback[handleTranslate]"]).length;
                    const failCount = batchResults.filter({
                        "useTranslationOperations.useCallback[handleTranslate]": (r)=>!r.success
                    }["useTranslationOperations.useCallback[handleTranslate]"]).length;
                    translatedCount += successCount;
                    failedCount += failCount;
                    console.log("📊 バッチ".concat(Math.floor(i / batchSize) + 1, "完了: 成功").concat(successCount, "件、失敗").concat(failCount, "件"));
                }
                // データベースから最新データを再読み込み
                await onLoadProducts();
                // 最終結果表示
                if (translatedCount > 0) {
                    const message = failedCount > 0 ? "✅ ".concat(translatedCount, "件の翻訳が完了しました（失敗: ").concat(failedCount, "件）") : "✅ ".concat(translatedCount, "件の翻訳が完了しました");
                    onShowToast(message, 'success');
                } else {
                    onShowToast('翻訳に失敗しました', 'error');
                }
                console.log("🎉 翻訳完了: 成功".concat(translatedCount, "件、失敗").concat(failedCount, "件"));
            } catch (error) {
                console.error('Translation error:', error);
                onShowToast(error.message || '翻訳中にエラーが発生しました', 'error');
            } finally{
                setTranslating(false);
            }
        }
    }["useTranslationOperations.useCallback[handleTranslate]"], [
        selectedIds,
        products,
        onShowToast,
        onLoadProducts,
        updateLocalProduct
    ]);
    return {
        translating,
        handleTranslate
    };
}
_s(useTranslationOperations, "ZUWVeSgNGRTY/VX0WHz5oBvj6DE=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-research-operations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-research-operations.ts
/**
 * useResearchOperations - 競合分析・詳細取得フック
 * 
 * ③詳細ボタンの動作:
 * 1. Mirrorタブで選択された競合商品がある場合 → その詳細を取得
 * 2. 商品がチェック選択されている場合 → SM分析結果から自動的に競合商品を選択
 * 3. Item Specifics、Condition等をDBに自動保存
 * 4. 画面をリロードして反映
 * 
 * ※ モーダルは開かない（データは自動的に保存される）
 */ __turbopack_context__.s([
    "useResearchOperations",
    ()=>useResearchOperations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useResearchOperations(param) {
    let { products, selectedIds, onShowToast, onLoadProducts, getAllSelected, clearAll } = param;
    _s();
    const [researching, setResearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 一括競合分析
    const handleBulkResearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useResearchOperations.useCallback[handleBulkResearch]": async ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            const productIds = Array.from(selectedIds);
            setResearching(true);
            onShowToast("".concat(productIds.length, "件の商品を競合分析します..."), 'success');
            try {
                const response = await fetch('/api/bulk-research', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productIds: productIds,
                        includeFields: {
                            category: true,
                            shipping: true,
                            research: true,
                            sellerMirror: true
                        }
                    })
                });
                if (!response.ok) {
                    throw new Error("HTTP error! status: ".concat(response.status));
                }
                const data = await response.json();
                if (data.success) {
                    const successCount = data.results.filter({
                        "useResearchOperations.useCallback[handleBulkResearch]": (r)=>r.success
                    }["useResearchOperations.useCallback[handleBulkResearch]"]).length;
                    const failCount = data.results.length - successCount;
                    if (failCount > 0) {
                        onShowToast("✅ 完了: 成功".concat(successCount, "件、失敗").concat(failCount, "件"), 'success');
                    } else {
                        onShowToast("✅ 競合分析完了！".concat(successCount, "件の商品を処理しました"), 'success');
                    }
                    await onLoadProducts();
                } else {
                    throw new Error(data.error || '競合分析に失敗しました');
                }
            } catch (error) {
                console.error('Bulk research error:', error);
                onShowToast(error.message || '競合分析中にエラーが発生しました', 'error');
            } finally{
                setResearching(false);
            }
        }
    }["useResearchOperations.useCallback[handleBulkResearch]"], [
        selectedIds,
        onShowToast,
        onLoadProducts
    ]);
    // SellerMirror詳細一括取得（③詳細ボタン）
    // - 競合商品の詳細情報（Item Specifics, Condition等）を取得
    // - DBに自動保存して画面リロード
    // - モーダルは開かない
    const handleBatchFetchDetails = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useResearchOperations.useCallback[handleBatchFetchDetails]": async ()=>{
            // 1. まずMirrorタブで選択された競合商品をチェック
            const selectedMirrorItems = getAllSelected();
            console.log('🔍 handleBatchFetchDetails 呼び出し:');
            console.log('  - selectedMirrorItems:', selectedMirrorItems.length, '件');
            console.log('  - selectedIds (商品選択):', selectedIds.size, '件');
            // 2. Mirrorで選択がある場合はそれを使用
            if (selectedMirrorItems.length > 0) {
                await fetchDetailsFromMirrorSelection(selectedMirrorItems);
                return;
            }
            // 3. 商品がチェック選択されている場合、SM分析結果から自動取得
            if (selectedIds.size > 0) {
                await fetchDetailsFromProductSelection();
                return;
            }
            // 4. どちらも選択されていない場合
            onShowToast('商品を選択するか、Mirrorタブで競合商品を選択してください。', 'error');
        }
    }["useResearchOperations.useCallback[handleBatchFetchDetails]"], [
        getAllSelected,
        selectedIds,
        products,
        onShowToast,
        onLoadProducts,
        clearAll
    ]);
    // Mirrorで選択された競合商品から詳細取得
    const fetchDetailsFromMirrorSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useResearchOperations.useCallback[fetchDetailsFromMirrorSelection]": async (selectedItems)=>{
            setResearching(true);
            onShowToast("".concat(selectedItems.length, "件の詳細情報を取得します..."), 'success');
            try {
                // 商品ごとにグループ化
                const groupedByProduct = {};
                selectedItems.forEach({
                    "useResearchOperations.useCallback[fetchDetailsFromMirrorSelection]": (item)=>{
                        if (!groupedByProduct[item.productId]) {
                            groupedByProduct[item.productId] = [];
                        }
                        groupedByProduct[item.productId].push(item.itemId);
                    }
                }["useResearchOperations.useCallback[fetchDetailsFromMirrorSelection]"]);
                // 各商品の詳細を並行取得（APIがDBに自動保存）
                const fetchPromises = Object.entries(groupedByProduct).map({
                    "useResearchOperations.useCallback[fetchDetailsFromMirrorSelection].fetchPromises": async (param)=>{
                        let [productId, itemIds] = param;
                        const response = await fetch('/api/sellermirror/batch-details', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                itemIds,
                                productId
                            })
                        });
                        if (!response.ok) {
                            throw new Error("商品ID".concat(productId, "の詳細取得失敗"));
                        }
                        return response.json();
                    }
                }["useResearchOperations.useCallback[fetchDetailsFromMirrorSelection].fetchPromises"]);
                const results = await Promise.all(fetchPromises);
                const totalSuccess = results.reduce({
                    "useResearchOperations.useCallback[fetchDetailsFromMirrorSelection].totalSuccess": (sum, r)=>{
                        var _r_summary;
                        return sum + (((_r_summary = r.summary) === null || _r_summary === void 0 ? void 0 : _r_summary.success) || 0);
                    }
                }["useResearchOperations.useCallback[fetchDetailsFromMirrorSelection].totalSuccess"], 0);
                const totalFailed = results.reduce({
                    "useResearchOperations.useCallback[fetchDetailsFromMirrorSelection].totalFailed": (sum, r)=>{
                        var _r_summary;
                        return sum + (((_r_summary = r.summary) === null || _r_summary === void 0 ? void 0 : _r_summary.failed) || 0);
                    }
                }["useResearchOperations.useCallback[fetchDetailsFromMirrorSelection].totalFailed"], 0);
                // 取得したItem Specificsの数を集計
                let totalItemSpecifics = 0;
                results.forEach({
                    "useResearchOperations.useCallback[fetchDetailsFromMirrorSelection]": (r)=>{
                        if (r.itemSpecificsCount) {
                            totalItemSpecifics += r.itemSpecificsCount;
                        }
                    }
                }["useResearchOperations.useCallback[fetchDetailsFromMirrorSelection]"]);
                // 選択をクリア
                clearAll();
                // 成功メッセージ
                if (totalFailed > 0) {
                    onShowToast("✅ 詳細取得完了: 成功".concat(totalSuccess, "件、失敗").concat(totalFailed, "件"), 'success');
                } else if (totalItemSpecifics > 0) {
                    onShowToast("✅ 詳細取得完了！Item Specifics ".concat(totalItemSpecifics, "件を自動保存しました"), 'success');
                } else {
                    onShowToast("✅ 詳細取得完了！".concat(totalSuccess, "件の商品詳細をDBに保存しました"), 'success');
                }
                // 画面をリロードして最新データを表示
                await onLoadProducts();
            } catch (error) {
                console.error('Batch fetch error:', error);
                onShowToast(error.message || '詳細取得中にエラーが発生しました', 'error');
            } finally{
                setResearching(false);
            }
        }
    }["useResearchOperations.useCallback[fetchDetailsFromMirrorSelection]"], [
        onShowToast,
        onLoadProducts,
        clearAll
    ]);
    // 商品選択からSM分析結果を使用して詳細取得
    const fetchDetailsFromProductSelection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useResearchOperations.useCallback[fetchDetailsFromProductSelection]": async ()=>{
            const selectedProductIds = Array.from(selectedIds);
            const selectedProducts = products.filter({
                "useResearchOperations.useCallback[fetchDetailsFromProductSelection].selectedProducts": (p)=>selectedIds.has(String(p.id))
            }["useResearchOperations.useCallback[fetchDetailsFromProductSelection].selectedProducts"]);
            console.log('📦 商品選択から競合情報を自動取得:');
            console.log('  - 選択商品数:', selectedProducts.length);
            // SM分析結果から競合商品のitemIdを抽出
            const itemsToFetch = [];
            for (const product of selectedProducts){
                var _ebayData_listing_reference;
                // ✅ 修正: sm_selected_itemはトップレベルカラム
                const smSelectedItem = product.sm_selected_item;
                // SM分析結果から競合商品を取得
                const ebayData = product.ebay_api_data || {};
                const referenceItems = ((_ebayData_listing_reference = ebayData.listing_reference) === null || _ebayData_listing_reference === void 0 ? void 0 : _ebayData_listing_reference.referenceItems) || [];
                let itemIds = [];
                if (smSelectedItem === null || smSelectedItem === void 0 ? void 0 : smSelectedItem.itemId) {
                    // ✅ 明示的に選択された競合商品がある
                    itemIds = [
                        smSelectedItem.itemId
                    ];
                    console.log("  - ".concat(product.id, ": SM選択済み商品を使用 (").concat(smSelectedItem.itemId, ")"));
                } else if (referenceItems.length > 0) {
                    // SM分析結果からItem Specificsが多い商品を選択
                    const sortedItems = [
                        ...referenceItems
                    ].sort({
                        "useResearchOperations.useCallback[fetchDetailsFromProductSelection].sortedItems": (a, b)=>{
                            // Item Specifics件数でソート（降順）
                            const aCount = a.itemSpecificsCount || (a.itemSpecifics ? Object.keys(a.itemSpecifics).length : 0);
                            const bCount = b.itemSpecificsCount || (b.itemSpecifics ? Object.keys(b.itemSpecifics).length : 0);
                            return bCount - aCount;
                        }
                    }["useResearchOperations.useCallback[fetchDetailsFromProductSelection].sortedItems"]);
                    itemIds = [
                        sortedItems[0].itemId
                    ];
                    const specsCount = sortedItems[0].itemSpecificsCount || 0;
                    console.log("  - ".concat(product.id, ": SM分析結果から自動選択 (").concat(itemIds[0], ", Specs: ").concat(specsCount, "件)"));
                } else {
                    console.log("  - ".concat(product.id, ": 競合商品なし（SM分析未実行?）"));
                }
                if (itemIds.length > 0) {
                    itemsToFetch.push({
                        productId: String(product.id),
                        itemIds
                    });
                }
            }
            if (itemsToFetch.length === 0) {
                onShowToast('選択した商品にSM分析結果がありません。先に①SM分析を実行してください。', 'error');
                return;
            }
            setResearching(true);
            onShowToast("".concat(itemsToFetch.length, "件の商品詳細を取得します..."), 'success');
            try {
                // 各商品の詳細を並行取得
                const fetchPromises = itemsToFetch.map({
                    "useResearchOperations.useCallback[fetchDetailsFromProductSelection].fetchPromises": async (param)=>{
                        let { productId, itemIds } = param;
                        const response = await fetch('/api/sellermirror/batch-details', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                itemIds,
                                productId
                            })
                        });
                        if (!response.ok) {
                            throw new Error("商品ID".concat(productId, "の詳細取得失敗"));
                        }
                        return response.json();
                    }
                }["useResearchOperations.useCallback[fetchDetailsFromProductSelection].fetchPromises"]);
                const results = await Promise.all(fetchPromises);
                const totalSuccess = results.reduce({
                    "useResearchOperations.useCallback[fetchDetailsFromProductSelection].totalSuccess": (sum, r)=>{
                        var _r_summary;
                        return sum + (((_r_summary = r.summary) === null || _r_summary === void 0 ? void 0 : _r_summary.success) || 0);
                    }
                }["useResearchOperations.useCallback[fetchDetailsFromProductSelection].totalSuccess"], 0);
                const totalFailed = results.reduce({
                    "useResearchOperations.useCallback[fetchDetailsFromProductSelection].totalFailed": (sum, r)=>{
                        var _r_summary;
                        return sum + (((_r_summary = r.summary) === null || _r_summary === void 0 ? void 0 : _r_summary.failed) || 0);
                    }
                }["useResearchOperations.useCallback[fetchDetailsFromProductSelection].totalFailed"], 0);
                let totalItemSpecifics = 0;
                results.forEach({
                    "useResearchOperations.useCallback[fetchDetailsFromProductSelection]": (r)=>{
                        if (r.itemSpecificsCount) {
                            totalItemSpecifics += r.itemSpecificsCount;
                        }
                    }
                }["useResearchOperations.useCallback[fetchDetailsFromProductSelection]"]);
                // 成功メッセージ
                if (totalFailed > 0) {
                    onShowToast("✅ 詳細取得完了: 成功".concat(totalSuccess, "件、失敗").concat(totalFailed, "件"), 'success');
                } else if (totalItemSpecifics > 0) {
                    onShowToast("✅ Item Specifics ".concat(totalItemSpecifics, "件を自動保存しました"), 'success');
                } else {
                    onShowToast("✅ 詳細取得完了！".concat(itemsToFetch.length, "件処理"), 'success');
                }
                await onLoadProducts();
            } catch (error) {
                console.error('Batch fetch error:', error);
                onShowToast(error.message || '詳細取得中にエラーが発生しました', 'error');
            } finally{
                setResearching(false);
            }
        }
    }["useResearchOperations.useCallback[fetchDetailsFromProductSelection]"], [
        selectedIds,
        products,
        onShowToast,
        onLoadProducts
    ]);
    return {
        researching,
        handleBulkResearch,
        handleBatchFetchDetails
    };
}
_s(useResearchOperations, "W860ludT9SVmmWlmfByHSVqDkCQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-flow-logic.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-flow-logic.ts
__turbopack_context__.s([
    "useFlowLogic",
    ()=>useFlowLogic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useFlowLogic(param) {
    let { selectedIds, onShowToast, onLoadProducts } = param;
    _s();
    const [processing, setProcessing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // フィルターチェック
    const handleFilterCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFlowLogic.useCallback[handleFilterCheck]": async ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            const productIds = Array.from(selectedIds);
            setProcessing(true);
            onShowToast("".concat(productIds.length, "件の商品をフィルターチェック中..."), 'success');
            try {
                const response = await fetch('/api/filter-check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productIds
                    })
                });
                if (!response.ok) {
                    const errorData = await response.json().catch({
                        "useFlowLogic.useCallback[handleFilterCheck]": ()=>({})
                    }["useFlowLogic.useCallback[handleFilterCheck]"]);
                    console.error('❌ APIエラー:', errorData);
                    throw new Error("HTTP error! status: ".concat(response.status));
                }
                const data = await response.json();
                if (data.success) {
                    const summary = data.summary || {};
                    onShowToast("✅ フィルターチェック完了！\n通過: ".concat(summary.passed || 0, "件 / 不合格: ").concat(summary.failed || 0, "件"), 'success');
                    await onLoadProducts();
                } else {
                    throw new Error(data.error || 'フィルターチェックに失敗しました');
                }
            } catch (error) {
                console.error('Filter check error:', error);
                onShowToast(error.message || 'フィルターチェック中にエラーが発生しました', 'error');
            } finally{
                setProcessing(false);
            }
        }
    }["useFlowLogic.useCallback[handleFilterCheck]"], [
        selectedIds,
        onShowToast,
        onLoadProducts
    ]);
    // 最終処理チェーン
    const handleFinalProcessChain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFlowLogic.useCallback[handleFinalProcessChain]": async ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            const selectedArray = Array.from(selectedIds);
            if (!confirm("".concat(selectedArray.length, "件の商品に対して最終処理（送料/利益/HTML/スコア/フィルター）を実行しますか？"))) {
                return;
            }
            setProcessing(true);
            onShowToast("".concat(selectedArray.length, "件の最終処理を開始します..."), 'success');
            try {
                const response = await fetch('/api/final-process-chain', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productIds: selectedArray,
                        baseUrl: window.location.origin
                    })
                });
                if (!response.ok) {
                    throw new Error('最終処理に失敗しました');
                }
                const data = await response.json();
                if (data.success) {
                    const summary = data.summary;
                    onShowToast("✅ 最終処理完了！\n通過: ".concat(summary.passed_filter, "件 / 不合格: ").concat(summary.failed_filter, "件\n\n承認ツールに移動してください。"), 'success');
                    await onLoadProducts();
                    // 承認ツールへの自動遷移確認
                    if (summary.passed_filter > 0) {
                        if (confirm('承認ツールに移動しますか？')) {
                            window.location.href = '/tools/approval';
                        }
                    }
                }
            } catch (error) {
                onShowToast(error.message || '最終処理中にエラーが発生しました', 'error');
            } finally{
                setProcessing(false);
            }
        }
    }["useFlowLogic.useCallback[handleFinalProcessChain]"], [
        selectedIds,
        onShowToast,
        onLoadProducts
    ]);
    // Geminiプロンプト生成（AI解析用CSVエクスポート）
    const handleGenerateGeminiPrompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFlowLogic.useCallback[handleGenerateGeminiPrompt]": ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            // Note: この機能は BasicEditTab で直接モーダルを開くため、
            // ここではフラグのみ返す
            return true;
        }
    }["useFlowLogic.useCallback[handleGenerateGeminiPrompt]"], [
        selectedIds,
        onShowToast
    ]);
    return {
        processing,
        handleFilterCheck,
        handleFinalProcessChain,
        handleGenerateGeminiPrompt
    };
}
_s(useFlowLogic, "QCIRndJ/ttNBpibh9WLSKECUCTc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-basic-edit.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-basic-edit.ts
__turbopack_context__.s([
    "useBasicEdit",
    ()=>useBasicEdit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$taxonomy$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-taxonomy-operations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$translation$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-translation-operations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$research$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-research-operations.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$flow$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/hooks/use-flow-logic.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function useBasicEdit(param) {
    let { products, selectedIds, onShowToast, onLoadProducts, updateLocalProduct, getAllSelected, clearAll, runBatchCategory, runBatchShipping, runBatchProfit, runBatchHTMLGenerate, runBatchSellerMirror, runBatchScores, runAllProcesses } = param;
    _s();
    // 専門フックを統合
    const taxonomyOps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$taxonomy$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTaxonomyOperations"])({
        products,
        selectedIds,
        onShowToast,
        onLoadProducts,
        updateLocalProduct
    });
    const translationOps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$translation$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslationOperations"])({
        products,
        selectedIds,
        onShowToast,
        onLoadProducts,
        updateLocalProduct
    });
    const researchOps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$research$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useResearchOperations"])({
        products,
        selectedIds,
        onShowToast,
        onLoadProducts,
        getAllSelected,
        clearAll
    });
    const flowLogic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$flow$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFlowLogic"])({
        selectedIds,
        onShowToast,
        onLoadProducts
    });
    // 状態管理
    const [showHTMLPanel, setShowHTMLPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPricingPanel, setShowPricingPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAIEnrichModal, setShowAIEnrichModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showMarketResearchModal, setShowMarketResearchModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showGeminiBatchModal, setShowGeminiBatchModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showHTSClassificationModal, setShowHTSClassificationModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [enrichTargetProduct, setEnrichTargetProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [htsTargetProduct, setHTSTargetProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 派生データ
    const selectedProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useBasicEdit.useMemo[selectedProducts]": ()=>{
            return products.filter({
                "useBasicEdit.useMemo[selectedProducts]": (p)=>selectedIds.has(String(p.id))
            }["useBasicEdit.useMemo[selectedProducts]"]);
        }
    }["useBasicEdit.useMemo[selectedProducts]"], [
        products,
        selectedIds
    ]);
    const readyCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useBasicEdit.useMemo[readyCount]": ()=>{
            return products.filter({
                "useBasicEdit.useMemo[readyCount]": (p)=>p.ready_to_list
            }["useBasicEdit.useMemo[readyCount]"]).length;
        }
    }["useBasicEdit.useMemo[readyCount]"], [
        products
    ]);
    const filterPassedCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useBasicEdit.useMemo[filterPassedCount]": ()=>{
            return products.filter({
                "useBasicEdit.useMemo[filterPassedCount]": (p)=>p.filter_passed
            }["useBasicEdit.useMemo[filterPassedCount]"]).length;
        }
    }["useBasicEdit.useMemo[filterPassedCount]"], [
        products
    ]);
    // Run All（全処理実行）
    const handleRunAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBasicEdit.useCallback[handleRunAll]": async ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            const selectedProductIds = Array.from(selectedIds);
            onShowToast("".concat(selectedProductIds.length, "件の商品に対して全処理を開始します..."), 'success');
            try {
                // ステップ1: カテゴリ分析
                onShowToast('1/6: カテゴリ分析中...', 'success');
                const categoryResult = await runBatchCategory(selectedProductIds);
                if (!categoryResult.success) {
                    throw new Error("カテゴリ分析失敗: ".concat(categoryResult.error));
                }
                // ステップ2: 送料計算
                onShowToast('2/6: 送料計算中...', 'success');
                const shippingResult = await runBatchShipping(selectedProductIds);
                if (!shippingResult.success) {
                    throw new Error("送料計算失敗: ".concat(shippingResult.error));
                }
                // ステップ3: 利益計算
                onShowToast('3/6: 利益計算中...', 'success');
                const profitResult = await runBatchProfit(selectedProductIds);
                if (!profitResult.success) {
                    throw new Error("利益計算失敗: ".concat(profitResult.error));
                }
                // ステップ4: SellerMirror分析
                onShowToast('4/6: SellerMirror分析中...', 'success');
                const smResult = await runBatchSellerMirror(selectedProductIds);
                if (!smResult.success) {
                    throw new Error("SellerMirror分析失敗: ".concat(smResult.error));
                }
                // ステップ5: HTML生成
                onShowToast('5/6: HTML生成中...', 'success');
                const htmlResult = await runBatchHTMLGenerate(selectedProductIds);
                if (!htmlResult.success) {
                    throw new Error("HTML生成失敗: ".concat(htmlResult.error));
                }
                // ステップ6: スコア計算
                onShowToast('6/6: スコア計算中...', 'success');
                const scoresResult = await runBatchScores(selectedProducts);
                if (!scoresResult.success) {
                    throw new Error("スコア計算失敗: ".concat(scoresResult.error));
                }
                onShowToast("✅ 全処理完了！".concat(selectedProductIds.length, "件の商品を処理しました"), 'success');
                await onLoadProducts();
            } catch (error) {
                onShowToast(error.message || '処理中にエラーが発生しました', 'error');
            }
        }
    }["useBasicEdit.useCallback[handleRunAll]"], [
        selectedIds,
        selectedProducts,
        onShowToast,
        onLoadProducts,
        runBatchCategory,
        runBatchShipping,
        runBatchProfit,
        runBatchHTMLGenerate,
        runBatchSellerMirror,
        runBatchScores
    ]);
    // カテゴリ分析
    const handleCategory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBasicEdit.useCallback[handleCategory]": async ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            const productIds = Array.from(selectedIds);
            onShowToast("📋 ".concat(productIds.length, "件のカテゴリ分析を開始..."), 'success');
            const result = await runBatchCategory(productIds);
            if (result.success) {
                onShowToast("✅ カテゴリ分析完了: ".concat(result.updated, "件"), 'success');
                await onLoadProducts();
            } else {
                onShowToast("❌ ".concat(result.error || 'カテゴリ分析に失敗しました'), 'error');
            }
        }
    }["useBasicEdit.useCallback[handleCategory]"], [
        selectedIds,
        onShowToast,
        onLoadProducts,
        runBatchCategory
    ]);
    // 送料計算
    const handleShipping = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBasicEdit.useCallback[handleShipping]": async ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            const productIds = Array.from(selectedIds);
            onShowToast("🚚 ".concat(productIds.length, "件の送料計算を開始..."), 'success');
            const result = await runBatchShipping(productIds);
            if (result.success) {
                onShowToast("✅ ".concat(result.message || "送料計算完了: ".concat(result.updated, "件")), 'success');
                await onLoadProducts();
            } else {
                onShowToast("❌ ".concat(result.error || '送料計算に失敗しました'), 'error');
            }
        }
    }["useBasicEdit.useCallback[handleShipping]"], [
        selectedIds,
        onShowToast,
        onLoadProducts,
        runBatchShipping
    ]);
    // 利益計算
    const handleProfit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBasicEdit.useCallback[handleProfit]": async ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            const productIds = Array.from(selectedIds);
            onShowToast("💰 ".concat(productIds.length, "件の利益計算を開始..."), 'success');
            const result = await runBatchProfit(productIds);
            if (result.success) {
                onShowToast("✅ 利益計算完了: ".concat(result.updated, "件"), 'success');
                await onLoadProducts();
            } else {
                onShowToast("❌ ".concat(result.error || '利益計算に失敗しました'), 'error');
            }
        }
    }["useBasicEdit.useCallback[handleProfit]"], [
        selectedIds,
        onShowToast,
        onLoadProducts,
        runBatchProfit
    ]);
    // HTML生成パネルを開く
    const handleHTML = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBasicEdit.useCallback[handleHTML]": ()=>{
            setShowHTMLPanel(true);
        }
    }["useBasicEdit.useCallback[handleHTML]"], []);
    // AI強化モーダルを開く
    const handleAIEnrich = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBasicEdit.useCallback[handleAIEnrich]": ()=>{
            if (selectedIds.size === 0) {
                onShowToast('商品を選択してください', 'error');
                return;
            }
            const firstId = Array.from(selectedIds)[0];
            const product = products.find({
                "useBasicEdit.useCallback[handleAIEnrich].product": (p)=>String(p.id) === firstId
            }["useBasicEdit.useCallback[handleAIEnrich].product"]);
            if (product) {
                setEnrichTargetProduct(product);
                setShowAIEnrichModal(true);
            }
        }
    }["useBasicEdit.useCallback[handleAIEnrich]"], [
        selectedIds,
        products,
        onShowToast
    ]);
    return {
        // データ
        selectedProducts,
        readyCount,
        filterPassedCount,
        // モーダル状態
        showHTMLPanel,
        showPricingPanel,
        showAIEnrichModal,
        showMarketResearchModal,
        showGeminiBatchModal,
        showHTSClassificationModal,
        enrichTargetProduct,
        htsTargetProduct,
        // モーダル制御
        setShowHTMLPanel,
        setShowPricingPanel,
        setShowAIEnrichModal,
        setShowMarketResearchModal,
        setShowGeminiBatchModal,
        setShowHTSClassificationModal,
        // アクション
        handleRunAll,
        handleCategory,
        handleShipping,
        handleProfit,
        handleHTML,
        handleAIEnrich,
        // 専門フックの機能を公開
        ...taxonomyOps,
        ...translationOps,
        ...researchOps,
        ...flowLogic
    };
}
_s(useBasicEdit, "crXvcDYYp4J5tndVetU41mhkkBE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$taxonomy$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTaxonomyOperations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$translation$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslationOperations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$research$2d$operations$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useResearchOperations"],
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$hooks$2f$use$2d$flow$2d$logic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFlowLogic"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-ui-state.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-ui-state.ts
/**
 * UI状態管理フック
 * 
 * 責務:
 * - 表示モード（リスト/カード）
 * - テキスト折り返し
 * - 言語設定
 * - 仮想スクロール
 * - L2タブ状態
 */ __turbopack_context__.s([
    "useUIState",
    ()=>useUIState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useUIState() {
    let productCount = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    _s();
    const [activeL2Tab, setActiveL2Tab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('basic-edit');
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('list');
    const [wrapText, setWrapText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [language, setLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('ja');
    const [useVirtualScroll, setUseVirtualScroll] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [listFilter, setListFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    // 商品数が多い場合は自動で仮想スクロールを有効化
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useUIState.useEffect": ()=>{
            if (productCount > 100 && !useVirtualScroll) {
                setUseVirtualScroll(true);
            }
        }
    }["useUIState.useEffect"], [
        productCount,
        useVirtualScroll
    ]);
    return {
        activeL2Tab,
        setActiveL2Tab,
        viewMode,
        setViewMode,
        wrapText,
        setWrapText,
        language,
        setLanguage,
        useVirtualScroll,
        setUseVirtualScroll,
        listFilter,
        setListFilter
    };
}
_s(useUIState, "4wEJkYXMr86xB6Feh8KBFBEbpPE=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-toast.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-toast.ts
/**
 * トースト通知管理フック
 * 
 * 責務:
 * - トースト表示/非表示
 * - 自動消去
 */ __turbopack_context__.s([
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useToast() {
    let duration = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 3000;
    _s();
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const showToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useToast.useCallback[showToast]": function(message) {
            let type = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 'success';
            setToast({
                message,
                type
            });
            setTimeout({
                "useToast.useCallback[showToast]": ()=>setToast(null)
            }["useToast.useCallback[showToast]"], duration);
        }
    }["useToast.useCallback[showToast]"], [
        duration
    ]);
    const hideToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useToast.useCallback[hideToast]": ()=>{
            setToast(null);
        }
    }["useToast.useCallback[hideToast]"], []);
    return {
        toast,
        showToast,
        hideToast
    };
}
_s(useToast, "MXt/530GHE00Hv521G9IqSMOnck=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-modals.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-modals.ts
/**
 * モーダル管理フック
 * 
 * 責務:
 * - 全モーダルの開閉状態
 * - モーダル関連の操作
 */ __turbopack_context__.s([
    "useModals",
    ()=>useModals
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useModals() {
    _s();
    // 商品モーダル
    const [selectedProduct, setSelectedProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const openProductModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[openProductModal]": (product)=>setSelectedProduct(product)
    }["useModals.useCallback[openProductModal]"], []);
    const closeProductModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[closeProductModal]": ()=>setSelectedProduct(null)
    }["useModals.useCallback[closeProductModal]"], []);
    // ペーストモーダル
    const [showPasteModal, setShowPasteModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const openPasteModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[openPasteModal]": ()=>setShowPasteModal(true)
    }["useModals.useCallback[openPasteModal]"], []);
    const closePasteModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[closePasteModal]": ()=>setShowPasteModal(false)
    }["useModals.useCallback[closePasteModal]"], []);
    // CSVモーダル
    const [showCSVModal, setShowCSVModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const openCSVModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[openCSVModal]": ()=>setShowCSVModal(true)
    }["useModals.useCallback[openCSVModal]"], []);
    const closeCSVModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[closeCSVModal]": ()=>setShowCSVModal(false)
    }["useModals.useCallback[closeCSVModal]"], []);
    // AIエンリッチモーダル
    const [showAIEnrichModal, setShowAIEnrichModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [enrichTargetProduct, setEnrichTargetProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const openAIEnrichModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[openAIEnrichModal]": (product)=>{
            setEnrichTargetProduct(product);
            setShowAIEnrichModal(true);
        }
    }["useModals.useCallback[openAIEnrichModal]"], []);
    const closeAIEnrichModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[closeAIEnrichModal]": ()=>{
            setShowAIEnrichModal(false);
            setEnrichTargetProduct(null);
        }
    }["useModals.useCallback[closeAIEnrichModal]"], []);
    // 市場調査モーダル
    const [showMarketResearchModal, setShowMarketResearchModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const openMarketResearchModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[openMarketResearchModal]": ()=>setShowMarketResearchModal(true)
    }["useModals.useCallback[openMarketResearchModal]"], []);
    const closeMarketResearchModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[closeMarketResearchModal]": ()=>setShowMarketResearchModal(false)
    }["useModals.useCallback[closeMarketResearchModal]"], []);
    // Geminiバッチモーダル
    const [showGeminiBatchModal, setShowGeminiBatchModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const openGeminiBatchModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[openGeminiBatchModal]": ()=>setShowGeminiBatchModal(true)
    }["useModals.useCallback[openGeminiBatchModal]"], []);
    const closeGeminiBatchModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[closeGeminiBatchModal]": ()=>setShowGeminiBatchModal(false)
    }["useModals.useCallback[closeGeminiBatchModal]"], []);
    // HTMLパネル
    const [showHTMLPanel, setShowHTMLPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const openHTMLPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[openHTMLPanel]": ()=>setShowHTMLPanel(true)
    }["useModals.useCallback[openHTMLPanel]"], []);
    const closeHTMLPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[closeHTMLPanel]": ()=>setShowHTMLPanel(false)
    }["useModals.useCallback[closeHTMLPanel]"], []);
    // 価格戦略パネル
    const [showPricingPanel, setShowPricingPanel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const openPricingPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[openPricingPanel]": ()=>setShowPricingPanel(true)
    }["useModals.useCallback[openPricingPanel]"], []);
    const closePricingPanel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[closePricingPanel]": ()=>setShowPricingPanel(false)
    }["useModals.useCallback[closePricingPanel]"], []);
    // 競合選択モーダル
    const [showCompetitorSelectionModal, setShowCompetitorSelectionModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [competitorSelectionProduct, setCompetitorSelectionProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const openCompetitorSelectionModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[openCompetitorSelectionModal]": (product)=>{
            setCompetitorSelectionProduct(product);
            setShowCompetitorSelectionModal(true);
        }
    }["useModals.useCallback[openCompetitorSelectionModal]"], []);
    const closeCompetitorSelectionModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[closeCompetitorSelectionModal]": ()=>{
            setShowCompetitorSelectionModal(false);
            setCompetitorSelectionProduct(null);
        }
    }["useModals.useCallback[closeCompetitorSelectionModal]"], []);
    // 商品強化フローモーダル
    const [showEnrichmentFlowModal, setShowEnrichmentFlowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [enrichmentFlowProduct, setEnrichmentFlowProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const openEnrichmentFlowModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[openEnrichmentFlowModal]": (product)=>{
            setEnrichmentFlowProduct(product);
            setShowEnrichmentFlowModal(true);
        }
    }["useModals.useCallback[openEnrichmentFlowModal]"], []);
    const closeEnrichmentFlowModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useModals.useCallback[closeEnrichmentFlowModal]": ()=>{
            setShowEnrichmentFlowModal(false);
            setEnrichmentFlowProduct(null);
        }
    }["useModals.useCallback[closeEnrichmentFlowModal]"], []);
    return {
        selectedProduct,
        openProductModal,
        closeProductModal,
        showPasteModal,
        openPasteModal,
        closePasteModal,
        showCSVModal,
        openCSVModal,
        closeCSVModal,
        showAIEnrichModal,
        enrichTargetProduct,
        openAIEnrichModal,
        closeAIEnrichModal,
        showMarketResearchModal,
        openMarketResearchModal,
        closeMarketResearchModal,
        showGeminiBatchModal,
        openGeminiBatchModal,
        closeGeminiBatchModal,
        showHTMLPanel,
        openHTMLPanel,
        closeHTMLPanel,
        showPricingPanel,
        openPricingPanel,
        closePricingPanel,
        showCompetitorSelectionModal,
        competitorSelectionProduct,
        openCompetitorSelectionModal,
        closeCompetitorSelectionModal,
        showEnrichmentFlowModal,
        enrichmentFlowProduct,
        openEnrichmentFlowModal,
        closeEnrichmentFlowModal
    };
}
_s(useModals, "+JoRto2eViZoQ1obog0BE/lw1cs=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-selection.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-selection.ts
/**
 * 選択状態管理フック
 * 
 * 責務:
 * - 商品の選択/解除
 * - 全選択/全解除
 * - 選択商品の取得
 */ __turbopack_context__.s([
    "useSelection",
    ()=>useSelection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useSelection() {
    _s();
    const [selectedIds, setSelectedIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const selectProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSelection.useCallback[selectProduct]": (id)=>{
            setSelectedIds({
                "useSelection.useCallback[selectProduct]": (prev)=>new Set(prev).add(id)
            }["useSelection.useCallback[selectProduct]"]);
        }
    }["useSelection.useCallback[selectProduct]"], []);
    const deselectProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSelection.useCallback[deselectProduct]": (id)=>{
            setSelectedIds({
                "useSelection.useCallback[deselectProduct]": (prev)=>{
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                }
            }["useSelection.useCallback[deselectProduct]"]);
        }
    }["useSelection.useCallback[deselectProduct]"], []);
    const toggleProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSelection.useCallback[toggleProduct]": (id)=>{
            setSelectedIds({
                "useSelection.useCallback[toggleProduct]": (prev)=>{
                    const newSet = new Set(prev);
                    if (newSet.has(id)) {
                        newSet.delete(id);
                    } else {
                        newSet.add(id);
                    }
                    return newSet;
                }
            }["useSelection.useCallback[toggleProduct]"]);
        }
    }["useSelection.useCallback[toggleProduct]"], []);
    const selectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSelection.useCallback[selectAll]": (products)=>{
            setSelectedIds(new Set(products.map({
                "useSelection.useCallback[selectAll]": (p)=>String(p.id)
            }["useSelection.useCallback[selectAll]"])));
        }
    }["useSelection.useCallback[selectAll]"], []);
    const deselectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSelection.useCallback[deselectAll]": ()=>{
            setSelectedIds(new Set());
        }
    }["useSelection.useCallback[deselectAll]"], []);
    const isSelected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSelection.useCallback[isSelected]": (id)=>{
            return selectedIds.has(id);
        }
    }["useSelection.useCallback[isSelected]"], [
        selectedIds
    ]);
    const selectedCount = selectedIds.size;
    const getSelectedProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSelection.useCallback[getSelectedProducts]": (products)=>{
            return products.filter({
                "useSelection.useCallback[getSelectedProducts]": (p)=>selectedIds.has(String(p.id))
            }["useSelection.useCallback[getSelectedProducts]"]);
        }
    }["useSelection.useCallback[getSelectedProducts]"], [
        selectedIds
    ]);
    return {
        selectedIds,
        setSelectedIds,
        selectProduct,
        deselectProduct,
        toggleProduct,
        selectAll,
        deselectAll,
        isSelected,
        selectedCount,
        getSelectedProducts
    };
}
_s(useSelection, "ZeJNhPIbSc+HvyhoNT5pJow6Sso=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-marketplace.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-marketplace.ts
/**
 * マーケットプレイス選択管理フック
 * 
 * 責務:
 * - マーケットプレイスの選択状態
 */ __turbopack_context__.s([
    "useMarketplace",
    ()=>useMarketplace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const DEFAULT_MARKETPLACES = {
    all: true,
    ebay: true,
    shopee: true,
    shopify: true
};
function useMarketplace() {
    _s();
    const [marketplaces, setMarketplaces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_MARKETPLACES);
    const toggleMarketplace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMarketplace.useCallback[toggleMarketplace]": (key)=>{
            setMarketplaces({
                "useMarketplace.useCallback[toggleMarketplace]": (prev)=>({
                        ...prev,
                        [key]: !prev[key]
                    })
            }["useMarketplace.useCallback[toggleMarketplace]"]);
        }
    }["useMarketplace.useCallback[toggleMarketplace]"], []);
    const toggleAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useMarketplace.useCallback[toggleAll]": ()=>{
            setMarketplaces({
                "useMarketplace.useCallback[toggleAll]": (prev)=>{
                    const newAll = !prev.all;
                    return {
                        all: newAll,
                        ebay: newAll,
                        shopee: newAll,
                        shopify: newAll
                    };
                }
            }["useMarketplace.useCallback[toggleAll]"]);
        }
    }["useMarketplace.useCallback[toggleAll]"], []);
    return {
        marketplaces,
        setMarketplaces,
        toggleMarketplace,
        toggleAll
    };
}
_s(useMarketplace, "6IjRToWwT72z+Vuq0C9kNBi8UAA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-product-interaction.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-product-interaction.ts
/**
 * 商品インタラクション管理フック - 高速化版
 * 
 * 高速化ポイント:
 * 1. Prefetching（ホバー時に先読み）- React Query のキャッシュを活用
 * 2. Optimistic UI（クリック時に即時表示）
 * 3. Debounce でホバー時の過剰なリクエストを防止
 * 4. 商品詳細取得
 */ __turbopack_context__.s([
    "useBulkPrefetch",
    ()=>useBulkPrefetch,
    "useProductInteraction",
    ()=>useProductInteraction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing/services/product-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
// Query Keys（useProductDataV2 と共通）
const QUERY_KEYS = {
    productDetail: (id)=>[
            'product',
            id
        ]
};
// Debounce 設定
const HOVER_DEBOUNCE_MS = 150;
function useProductInteraction() {
    _s();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    // Prefetching 中のIDを追跡（重複リクエスト防止）
    const prefetchingIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    // Debounce 用タイマー
    const hoverTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastHoveredId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    /**
   * 商品詳細をプリフェッチ（直接呼び出し用）
   */ const prefetchProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductInteraction.useCallback[prefetchProduct]": (productId)=>{
            // 既に prefetching 中またはキャッシュにあればスキップ
            if (prefetchingIds.current.has(productId)) {
                return;
            }
            // React Query のキャッシュをチェック
            const cachedData = queryClient.getQueryData(QUERY_KEYS.productDetail(productId));
            if (cachedData) {
                return;
            }
            prefetchingIds.current.add(productId);
            // React Query の prefetchQuery を使用
            queryClient.prefetchQuery({
                queryKey: QUERY_KEYS.productDetail(productId),
                queryFn: {
                    "useProductInteraction.useCallback[prefetchProduct]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].getProductDetail(productId)
                }["useProductInteraction.useCallback[prefetchProduct]"],
                staleTime: 60 * 1000
            }).finally({
                "useProductInteraction.useCallback[prefetchProduct]": ()=>{
                    prefetchingIds.current.delete(productId);
                }
            }["useProductInteraction.useCallback[prefetchProduct]"]);
        }
    }["useProductInteraction.useCallback[prefetchProduct]"], [
        queryClient
    ]);
    /**
   * ホバー時に商品詳細を先読み（Debounce付き）
   * マウスが素早く移動した場合は無視
   */ const handleProductHover = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductInteraction.useCallback[handleProductHover]": (product)=>{
            const productId = String(product.id);
            // 同じ商品への連続ホバーは無視
            if (lastHoveredId.current === productId) {
                return;
            }
            // 前のタイマーをクリア
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
            }
            lastHoveredId.current = productId;
            // Debounce: 一定時間ホバーが続いた場合のみプリフェッチ
            hoverTimerRef.current = setTimeout({
                "useProductInteraction.useCallback[handleProductHover]": ()=>{
                    prefetchProduct(productId);
                }
            }["useProductInteraction.useCallback[handleProductHover]"], HOVER_DEBOUNCE_MS);
        }
    }["useProductInteraction.useCallback[handleProductHover]"], [
        prefetchProduct
    ]);
    /**
   * クリック時に商品詳細を取得（Optimistic UI）
   */ const handleProductClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductInteraction.useCallback[handleProductClick]": async (product, onOpen)=>{
            const productId = String(product.id);
            // まず現在のデータで即時表示（Optimistic UI）
            onOpen(product);
            try {
                // React Query のキャッシュを確認
                let cachedData = queryClient.getQueryData(QUERY_KEYS.productDetail(productId));
                let result;
                if (cachedData && cachedData.success && cachedData.data) {
                    // キャッシュがあれば使用
                    result = cachedData;
                } else {
                    // キャッシュがなければ新規取得（React Query 経由）
                    result = await queryClient.fetchQuery({
                        queryKey: QUERY_KEYS.productDetail(productId),
                        queryFn: {
                            "useProductInteraction.useCallback[handleProductClick]": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].getProductDetail(productId)
                        }["useProductInteraction.useCallback[handleProductClick]"],
                        staleTime: 60 * 1000
                    });
                }
                // 詳細データで更新
                if (result && result.success && result.data) {
                    onOpen(result.data);
                }
            } catch (error) {
                console.error('商品データ取得エラー:', error);
            // エラー時は最初に表示したデータを維持
            }
        }
    }["useProductInteraction.useCallback[handleProductClick]"], [
        queryClient
    ]);
    /**
   * Prefetch キャッシュをクリア
   */ const clearPrefetchCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProductInteraction.useCallback[clearPrefetchCache]": ()=>{
            prefetchingIds.current.clear();
            lastHoveredId.current = null;
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
                hoverTimerRef.current = null;
            }
            // React Query のキャッシュは invalidateQueries で管理
            queryClient.invalidateQueries({
                queryKey: [
                    'product'
                ]
            });
        }
    }["useProductInteraction.useCallback[clearPrefetchCache]"], [
        queryClient
    ]);
    return {
        handleProductHover,
        handleProductClick,
        clearPrefetchCache,
        prefetchProduct
    };
}
_s(useProductInteraction, "MKP/fDZ25rye9wpJl+xqpgDoEPs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"]
    ];
});
function useBulkPrefetch() {
    _s1();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useBulkPrefetch.useCallback": function(productIds) {
            let maxConcurrent = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 5;
            // 最大同時リクエスト数を制限
            const idsToFetch = productIds.slice(0, maxConcurrent);
            idsToFetch.forEach({
                "useBulkPrefetch.useCallback": (productId)=>{
                    const cachedData = queryClient.getQueryData(QUERY_KEYS.productDetail(productId));
                    if (!cachedData) {
                        queryClient.prefetchQuery({
                            queryKey: QUERY_KEYS.productDetail(productId),
                            queryFn: {
                                "useBulkPrefetch.useCallback": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2f$services$2f$product$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["productApi"].getProductDetail(productId)
                            }["useBulkPrefetch.useCallback"],
                            staleTime: 60 * 1000
                        });
                    }
                }
            }["useBulkPrefetch.useCallback"]);
        }
    }["useBulkPrefetch.useCallback"], [
        queryClient
    ]);
}
_s1(useBulkPrefetch, "esWUSkX5QYGu6HykoNvE/x3w070=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/lib/ai-export-prompt.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/lib/ai-export-prompt.ts
/**
 * AI解析用プロンプト生成ユーティリティ（完全版）
 * 
 * 取得項目:
 * 1. 原産国（SellerMirrorデータ照合 + 新規調査）
 * 2. 市場調査データ（最安値、平均価格、競合数、販売数）
 * 3. サイズ3辺（width_cm, length_cm, height_cm）
 * 4. 重量（weight_g）
 * 5. 英語タイトルリライト（eBay SEO最適化、80文字以内）
 * 6. HTS推測（既存ツールの結果を含む）
 * 7. 素材（material）
 * 8. その他必要項目
 * 
 * 🔥 v2.0: AI監査用JSONエクスポート機能追加
 */ __turbopack_context__.s([
    "generateAIAuditData",
    ()=>generateAIAuditData,
    "generateAIAuditPrompt",
    ()=>generateAIAuditPrompt,
    "generateAIExportPrompt",
    ()=>generateAIExportPrompt
]);
function generateAIAuditData(products) {
    return products.map((p)=>{
        var _listingData_item_specifics, _listingData_item_specifics1, _listingData_shipping_policy_id, _listingData_item_specifics2;
        const listingData = p.listing_data || {};
        const ebayData = p.ebay_api_data || {};
        // コスト計算
        const purchasePrice = p.purchase_price_jpy || p.cost_price || p.price_jpy || 0;
        const exchangeRate = listingData.exchange_rate || 150;
        const finalPrice = listingData.ddp_price_usd || 0;
        const ebayFee = finalPrice * 0.132;
        const paypalFee = finalPrice * 0.029 + 0.30;
        const shippingCost = listingData.shipping_cost_usd || 0;
        const purchasePriceUsd = purchasePrice / exchangeRate;
        const estimatedProfit = finalPrice - purchasePriceUsd - ebayFee - paypalFee - shippingCost;
        return {
            // 1. 商品基本情報
            basicInfo: {
                sku: p.sku || '',
                productId: p.id,
                title: p.english_title || p.title_en || p.title || '',
                titleJa: p.title || '',
                categoryId: ebayData.category_id || p.ebay_category_id || p.category_id || '',
                categoryName: p.category_name || '',
                material: ((_listingData_item_specifics = listingData.item_specifics) === null || _listingData_item_specifics === void 0 ? void 0 : _listingData_item_specifics.Material) || p.material || 'Not specified',
                countryOfOrigin: ((_listingData_item_specifics1 = listingData.item_specifics) === null || _listingData_item_specifics1 === void 0 ? void 0 : _listingData_item_specifics1['Country/Region of Manufacture']) || p.origin_country || 'Unknown',
                condition: listingData.condition || listingData.condition_en || p.condition_name || p.condition || 'Used',
                conditionId: listingData.condition_id || 3000,
                conditionDescriptors: listingData.condition_descriptors || null
            },
            // 2. コスト計算の根拠
            costBreakdown: {
                purchasePriceJpy: purchasePrice,
                exchangeRate: exchangeRate,
                purchasePriceUsd: Math.round(purchasePriceUsd * 100) / 100,
                finalPriceUsd: finalPrice,
                ebayFeeUsd: Math.round(ebayFee * 100) / 100,
                ebayFeePercent: 13.2,
                paymentFeeUsd: Math.round(paypalFee * 100) / 100,
                shippingCostUsd: shippingCost,
                estimatedProfitUsd: Math.round(estimatedProfit * 100) / 100,
                profitMarginPercent: finalPrice > 0 ? Math.round(estimatedProfit / finalPrice * 10000) / 100 : 0
            },
            // 3. 物流データ
            logistics: {
                weightGrams: listingData.weight_g || p.weight_g || 0,
                dimensions: {
                    lengthCm: listingData.length_cm || p.length_cm || 0,
                    widthCm: listingData.width_cm || p.width_cm || 0,
                    heightCm: listingData.height_cm || p.height_cm || 0
                },
                shippingPolicyId: ((_listingData_shipping_policy_id = listingData.shipping_policy_id) === null || _listingData_shipping_policy_id === void 0 ? void 0 : _listingData_shipping_policy_id.toString()) || '',
                shippingPolicyName: listingData.shipping_policy_name || '',
                carrierCode: listingData.carrier_code || 'JAPANPOST'
            },
            // 4. 税務データ
            taxCompliance: {
                htsCode: listingData.hts_code || p.hts_code || '',
                htsDescription: listingData.hts_description || '',
                dutyRatePercent: listingData.duty_rate || p.hts_duty_rate || 0,
                confidenceLevel: p.hts_confidence || 'unknown'
            },
            // 5. 市場データ
            marketData: {
                lowestPriceUsd: p.sm_lowest_price || listingData.sm_lowest_price || null,
                averagePriceUsd: p.sm_average_price || listingData.sm_average_price || null,
                competitorCount: p.sm_competitor_count || listingData.sm_competitor_count || null,
                salesCount: p.sm_sales_count || listingData.sm_sales_count || null
            },
            // 6. 在庫情報
            inventory: {
                quantity: p.stock_quantity || p.current_stock || 1
            },
            // 7. Item Specifics
            itemSpecifics: listingData.item_specifics || {},
            // 8. eBay API送信予定データ
            ebayApiPayload: {
                inventoryItem: {
                    sku: p.sku,
                    condition: listingData.condition || 'USED_EXCELLENT',
                    conditionId: listingData.condition_id || 4000,
                    conditionDescriptors: listingData.condition_descriptors || null
                },
                offer: {
                    categoryId: ebayData.category_id || p.ebay_category_id || '',
                    price: finalPrice,
                    quantity: p.stock_quantity || p.current_stock || 1
                }
            },
            // 9. データ品質フラグ
            dataQuality: {
                hasPurchasePrice: purchasePrice > 0,
                hasFinalPrice: finalPrice > 0,
                hasWeight: (listingData.weight_g || p.weight_g || 0) > 0,
                hasDimensions: (listingData.length_cm || p.length_cm || 0) > 0,
                hasHtsCode: !!(listingData.hts_code || p.hts_code),
                hasOriginCountry: !!(((_listingData_item_specifics2 = listingData.item_specifics) === null || _listingData_item_specifics2 === void 0 ? void 0 : _listingData_item_specifics2['Country/Region of Manufacture']) || p.origin_country),
                hasConditionDescriptors: !!listingData.condition_descriptors,
                isProfitable: estimatedProfit > 0
            }
        };
    });
}
function generateAIAuditPrompt(products) {
    const auditData = generateAIAuditData(products);
    // 警告が必要な商品をカウント
    const warnings = {
        noHts: products.filter((p)=>{
            var _p_listing_data;
            return !(((_p_listing_data = p.listing_data) === null || _p_listing_data === void 0 ? void 0 : _p_listing_data.hts_code) || p.hts_code);
        }).length,
        noOrigin: products.filter((p)=>{
            var _p_listing_data_item_specifics, _p_listing_data;
            return !(((_p_listing_data = p.listing_data) === null || _p_listing_data === void 0 ? void 0 : (_p_listing_data_item_specifics = _p_listing_data.item_specifics) === null || _p_listing_data_item_specifics === void 0 ? void 0 : _p_listing_data_item_specifics['Country/Region of Manufacture']) || p.origin_country);
        }).length,
        noWeight: products.filter((p)=>{
            var _p_listing_data;
            return !(((_p_listing_data = p.listing_data) === null || _p_listing_data === void 0 ? void 0 : _p_listing_data.weight_g) || p.weight_g);
        }).length,
        noProfit: auditData.filter((d)=>!d.dataQuality.isProfitable).length,
        noConditionDescriptors: products.filter((p)=>{
            var _p_listing_data;
            return !((_p_listing_data = p.listing_data) === null || _p_listing_data === void 0 ? void 0 : _p_listing_data.condition_descriptors);
        }).length
    };
    return "あなたはeBay輸出の専門コンサルタント、および国際物流・税関のスペシャリストです。\n以下のJSONデータを分析し、出品の「安全性」と「利益の妥当性」を多角的に検証してください。\n\n【対象商品】".concat(products.length, "件\n\n【警告サマリー】\n- HTSコード未設定: ").concat(warnings.noHts, "件\n- 原産国未設定: ").concat(warnings.noOrigin, "件\n- 重量未設定: ").concat(warnings.noWeight, "件\n- 赤字の可能性: ").concat(warnings.noProfit, "件\n- Condition Descriptors未設定: ").concat(warnings.noConditionDescriptors, "件\n\n【検証ステップ】\n\n1. **HTSコードの整合性**: \n   - 商品タイトルと素材から判断して、設定されたHTSコード（関税番号）は米国税関の基準で適切か？\n   - トレカ: 4911.91.40 (紙製) または 9504.40.00 (カードゲーム)\n   - フィギュア: 9503.00.00\n   - カメラ: 9006.59\n   - 時計: 9102.xx\n\n2. **関税リスクの評価**: \n   - このHTSコードに基づき、バイヤーが支払うべき想定関税率は正しいか？\n   - アンチダンピング税等のリスクはないか？\n\n3. **価格計算の正確性**: \n   - 為替、手数料、送料、原価から計算された「最終利益」に計算ミスはないか？\n   - eBay手数料: 13.2%\n   - 決済手数料: 2.9% + $0.30\n\n4. **物流の妥当性**: \n   - 商品重量に対し、選択された配送ポリシーの料金設定は赤字のリスクがないか？\n\n5. **eBay規約遵守**: \n   - このカテゴリで必須とされるAspects（属性）は全て網羅されているか？\n\n6. **Condition設定**: \n   - conditionIdとconditionDescriptorsは、カテゴリに対して適切か？\n   - トレカカテゴリ(183454等)は conditionId: 4000 + conditionDescriptors が必須\n\n【入力データ (JSON)】\n").concat(JSON.stringify(auditData, null, 2), "\n\n【出力形式】\n各商品について以下の形式でレポートしてください：\n\n## [SKU: xxx] 商品名\n- ✅ 正常: [項目]\n- ⚠️ 警告: [項目] - 理由\n- ❌ エラー: [項目] - 理由と修正方法\n\n最後に全体のサマリーを記載してください。");
}
function generateAIExportPrompt(products) {
    // CSV生成
    const headers = [
        'SKU',
        '商品ID',
        '商品名(日本語)',
        '現在の英語タイトル',
        '仕入価格(円)',
        '定価(円)',
        'カテゴリ名',
        '現在の長さ(cm)',
        '現在の幅(cm)',
        '現在の高さ(cm)',
        '現在の重さ(g)',
        '状態',
        '画像URL',
        'ブランド',
        '既存HTSコード',
        'HTS信頼度',
        '既存原産国',
        '素材',
        'SM最安値($)',
        'SM平均価格($)',
        'SM競合数',
        'SM販売数'
    ];
    const csvRows = [
        headers.join(',')
    ];
    products.forEach((p)=>{
        var _p_listing_data, _p_listing_data1, _p_listing_data2, _p_listing_data3, _p_listing_data4, _p_listing_data5, _p_listing_data6, _p_listing_data7;
        const row = [
            p.sku || '',
            p.id || '',
            '"'.concat((p.title || '').replace(/"/g, '""'), '"'),
            '"'.concat((p.title_en || p.english_title || '').replace(/"/g, '""'), '"'),
            p.cost_price || p.purchase_price_jpy || '',
            p.msrp || p.price_jpy || '',
            '"'.concat((p.category_name || '').replace(/"/g, '""'), '"'),
            p.length_cm || ((_p_listing_data = p.listing_data) === null || _p_listing_data === void 0 ? void 0 : _p_listing_data.length_cm) || '',
            p.width_cm || ((_p_listing_data1 = p.listing_data) === null || _p_listing_data1 === void 0 ? void 0 : _p_listing_data1.width_cm) || '',
            p.height_cm || ((_p_listing_data2 = p.listing_data) === null || _p_listing_data2 === void 0 ? void 0 : _p_listing_data2.height_cm) || '',
            p.weight_g || ((_p_listing_data3 = p.listing_data) === null || _p_listing_data3 === void 0 ? void 0 : _p_listing_data3.weight_g) || '',
            '"'.concat((p.condition || '').replace(/"/g, '""'), '"'),
            '"'.concat((p.primary_image_url || (Array.isArray(p.gallery_images) ? p.gallery_images[0] : '') || '').replace(/"/g, '""'), '"'),
            '"'.concat((p.brand || '').replace(/"/g, '""'), '"'),
            p.hts_code || '',
            p.hts_confidence || 'uncertain',
            p.origin_country || '',
            '"'.concat((p.material || '').replace(/"/g, '""'), '"'),
            p.sm_lowest_price || ((_p_listing_data4 = p.listing_data) === null || _p_listing_data4 === void 0 ? void 0 : _p_listing_data4.sm_lowest_price) || '',
            p.sm_average_price || ((_p_listing_data5 = p.listing_data) === null || _p_listing_data5 === void 0 ? void 0 : _p_listing_data5.sm_average_price) || '',
            p.sm_competitor_count || ((_p_listing_data6 = p.listing_data) === null || _p_listing_data6 === void 0 ? void 0 : _p_listing_data6.sm_competitor_count) || '',
            p.sm_sales_count || ((_p_listing_data7 = p.listing_data) === null || _p_listing_data7 === void 0 ? void 0 : _p_listing_data7.sm_sales_count) || ''
        ];
        csvRows.push(row.join(','));
    });
    const csvContent = csvRows.join('\n');
    // HTS/原産国が不明な商品をリストアップ
    const needsHTSCheck = products.filter((p)=>!p.hts_code || p.hts_confidence === 'uncertain' || p.hts_confidence === 'low');
    const needsOriginCheck = products.filter((p)=>!p.origin_country || p.origin_country === 'UNKNOWN');
    const needsSizeCheck = products.filter((p)=>!p.length_cm || !p.width_cm || !p.height_cm || !p.weight_g);
    return "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🤖 AI商品データ完全分析 - 一括取得プロンプト\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n📦 対象商品: ".concat(products.length, "件\n⚠️ HTS要確認: ").concat(needsHTSCheck.length, "件\n⚠️ 原産国要確認: ").concat(needsOriginCheck.length, "件\n⚠️ サイズ要確認: ").concat(needsSizeCheck.length, "件\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📊 商品データ（CSV形式）\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n").concat(csvContent, '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📋 取得すべきデータ項目（各商品について以下を全て取得）\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n各商品について、以下の順番で処理してください：\n\n┌─────────────────────────────────────────────────────────────────┐\n│ ✅ 【1】原産国の確定（最重要・赤字リスクあり）                    │\n└─────────────────────────────────────────────────────────────────┘\n\n**手順:**\n1. **既存データの確認**\n   - CSVの「既存原産国」列にデータがある場合 → それを使用（信頼度: high）\n   - SellerMirror（SM）データに原産国情報がある場合 → それを使用（信頼度: medium）\n   \n2. **新規調査（既存データがない/UNKNOWNの場合）**\n   以下の方法で必ず実データを確認：\n   \n   a) メーカー公式サイト\n      - 商品ページで "Made in XX" を確認\n      - 製品仕様書で "Country of Origin" を確認\n   \n   b) Amazon Japan / 楽天市場\n      - 商品詳細ページで原産国表記を確認\n      - レビューコメントで「〇〇製」の記載を探す\n   \n   c) 商品パッケージ画像\n      - 画像URLから商品画像を確認\n      - パッケージや本体の表記を読み取る\n   \n   d) 信頼できる小売店\n      - ヨドバシ、ビックカメラなどの商品情報\n   \n   **❌ 禁止事項:**\n   - ブランド名からの推測（例: SONYだから日本製 → 実際は中国製の可能性大）\n   - カテゴリからの推測（例: アニメグッズだから日本製 → 中国製が多い）\n   \n   **原産国コード（ISO 3166-1 alpha-2）:**\n   \n   **主要アジア:**\n   - JP: 日本\n   - CN: 中国\n   - KR: 韓国\n   - TW: 台湾\n   - HK: 香港\n   - VN: ベトナム\n   - TH: タイ\n   - SG: シンガポール\n   - MY: マレーシア\n   - ID: インドネシア\n   - PH: フィリピン\n   - IN: インド\n   - PK: パキスタン\n   - BD: バングラデシュ\n   \n   **北米・南米:**\n   - US: アメリカ\n   - CA: カナダ\n   - MX: メキシコ\n   - BR: ブラジル\n   - AR: アルゼンチン\n   - CL: チリ\n   \n   **ヨーロッパ:**\n   - GB: イギリス\n   - DE: ドイツ\n   - FR: フランス\n   - IT: イタリア\n   - ES: スペイン\n   - NL: オランダ\n   - BE: ベルギー\n   - SE: スウェーデン\n   - PL: ポーランド\n   - CZ: チェコ\n   - HU: ハンガリー\n   - RO: ルーマニア\n   - PT: ポルトガル\n   - AT: オーストリア\n   - CH: スイス\n   \n   **オセアニア:**\n   - AU: オーストラリア\n   - NZ: ニュージーランド\n   \n   **中東・アフリカ:**\n   - AE: アラブ首長国連邦\n   - SA: サウジアラビア\n   - IL: イスラエル\n   - TR: トルコ\n   - ZA: 南アフリカ\n   - EG: エジプト\n   \n   **その他:**\n   - UNKNOWN: どうしても確認できない場合のみ\n   - NEEDS_MANUAL_CHECK: 断定できない場合（手動確認必要）\n   \n   ⚠️ 不明な場合は「NEEDS_MANUAL_CHECK」として、赤字リスクを回避してください。\n\n┌─────────────────────────────────────────────────────────────────┐\n│ ✅ 【2】市場調査データの取得（SellerMirrorデータ活用）            │\n└─────────────────────────────────────────────────────────────────┘\n\n**既存データの確認:**\nCSVの以下の列にデータがある場合、それを優先使用：\n- SM最安値($): SellerMirrorから取得済みの最安値\n- SM平均価格($): SellerMirrorから取得済みの平均価格\n- SM競合数: SellerMirrorから取得済みの競合出品者数\n- SM販売数: SellerMirrorから取得済みの販売実績\n\n**新規調査（既存データがない場合）:**\n以下のサイトで検索して取得：\n- eBay（英語タイトルまたは型番で検索）\n- Amazon.com\n- 専門マーケットプレイス\n\n取得項目:\n- 最安値（USD）\n- 平均価格（USD）\n- 競合出品者数\n- 過去30日の販売数（推定可）\n\n┌─────────────────────────────────────────────────────────────────┐\n│ ✅ 【3】サイズ・重量の推定/確認                                   │\n└─────────────────────────────────────────────────────────────────┘\n\n**既存データの確認:**\nCSVの「現在の〇〇」列にデータがある場合、妥当性をチェック：\n- 明らかに間違っている場合（例: フィギュアなのに100cm）→ 修正\n- 合理的な範囲内 → そのまま使用\n\n**新規取得/推定:**\n1. メーカー公式サイトで製品仕様を確認\n2. Amazon/楽天の商品情報を確認\n3. 類似商品の平均値から推定\n4. カテゴリの典型的なサイズから推定\n\n**目安:**\n- トレカ: 6cm × 9cm × 0.1cm, 5g\n- フィギュア(小): 10cm × 8cm × 15cm, 200g\n- フィギュア(大): 20cm × 15cm × 30cm, 1000g\n- ゲームソフト: 13.5cm × 19cm × 1.5cm, 150g\n- 書籍: 15cm × 21cm × 2cm, 300g\n\n┌─────────────────────────────────────────────────────────────────┐\n│ ✅ 【4】英語タイトルのリライト（eBay SEO最適化）                 │\n└─────────────────────────────────────────────────────────────────┘\n\n**要件:**\n- 80文字以内（eBay推奨）\n- 主要キーワードを前方配置\n- ブランド名・型番・商品タイプを含む\n- 自然な英語表現\n\n**構造:**\n`[Brand] [Product Type] [Key Features] [Condition] [Additional Info]`\n\n**例:**\n- ❌ 悪い: "Japanese Anime Figure Collectible Item"\n- ✅ 良い: "Bandai One Piece Luffy Gear 5 Figure 1/7 Scale Limited Edition New"\n\n**VERO対応（オプション）:**\n- ブランド名なし版も生成（中古品用）\n- 例: "One Piece Luffy Gear 5 Figure 1/7 Scale Collectible Pre-Owned"\n\n┌─────────────────────────────────────────────────────────────────┐\n│ ✅ 【5】HTSコードの推定/確認                                      │\n└─────────────────────────────────────────────────────────────────┘\n\n**既存データの確認:**\nCSVの「既存HTSコード」列にデータがあり、信頼度が "high" または "medium" の場合:\n- そのまま使用\n- ただし明らかに間違っている場合は修正\n\n**新規推定（既存データがない/uncertainの場合）:**\n\n**判定優先順位:**\n1. **カテゴリー優先品**\n   - 9503: 玩具・フィギュア・プラモデル\n   - 4911.91: トレーディングカード\n   - 9102: 腕時計\n   - 9006: カメラ・光学機器\n   - 9208: オルゴール\n   - 8523: ゲームソフト（物理メディア）\n\n2. **機能優先品**\n   - 8471: コンピュータ・周辺機器\n   - 8517: 通信機器\n   - 8528: モニター・ディスプレイ\n\n3. **素材優先品**\n   - 3926: プラスチック製品\n   - 7326: 鉄鋼製品\n   - 4901: 書籍\n\n**主要HTSコード参考表:**\n- 4911.91.40: トレーディングカード（紙製）\n- 9503.00.00: 玩具（フィギュア、プラモデル含む）\n- 9504.40.00: トランプ・カードゲーム\n- 9102.11: 腕時計（自動巻）\n- 9006.59: デジタルカメラ\n- 8523.49: ゲームソフト（ディスク）\n- 4901.99: 書籍・雑誌\n\n不明な場合: "9999.99.9999" + 理由を記載\n\n┌─────────────────────────────────────────────────────────────────┐\n│ ✅ 【6】素材（Material）の特定                                    │\n└─────────────────────────────────────────────────────────────────┘\n\n商品の主要素材を特定：\n- Plastic（プラスチック、PVC、ABS）\n- Metal（金属、合金）\n- Paper（紙、カードボード）\n- Textile（布、繊維）\n- Wood（木材）\n- Glass（ガラス）\n- Mixed（複合素材）\n\n┌─────────────────────────────────────────────────────────────────┐\n│ ✅ 【7】その他の補足情報                                          │\n└─────────────────────────────────────────────────────────────────┘\n\n┌─────────────────────────────────────────────────────────────────┐\n│ ✅ 【７】市場分析データ（スコア計算用）                          │\n└─────────────────────────────────────────────────────────────────┘\n\n**廃盤状況 (discontinued_status):**\n- ACTIVE: 現行品（通常販売中）\n- DISCONTINUED_RECENT: 廃盤（1年以内）\n- DISCONTINUED_OLD: 廃盤（1年以上）\n- LIMITED_EDITION: 限定品（生産数が限られている）\n- UNKNOWN: 不明\n\n**プレミア率 (premium_rate):**\n- 定価に対する現在価格の比率\n- 例: 定価$100の商品が$150 → premium_rate: 150%\n- 計算式: (current_price / msrp) * 100\n\n**国内流通量 (domestic_availability):**\n- ABUNDANT: 豊富（100+在庫）\n- MODERATE: 中程度（20-99在庫）\n- SCARCE: 少ない（5-19在庫）\n- RARE: 希少（1-4在庫）\n- OUT_OF_STOCK: 在庫なし\n\n**コミュニティスコア (community_score):**\n- レビュー数、評価、フォーラムでの人気度\n- 0-100点で評価\n- 計算方法: \n  * レビュー数 > 100 → +30点\n  * 平均評価 > 4.5 → +40点\n  * フォーラム言及数 > 50 → +30点\n\n**将来価値予測 (future_value_trend):**\n- INCREASING: 上昇傾向（コレクター需要增、価格上昇中）\n- STABLE: 安定（価格変動少）\n- DECREASING: 下降傾向（人気低下、価格下落中）\n- UNKNOWN: 不明\n\n**人気キャラクター/シリーズ (popular_character_series):**\n- 例: "Pokemon", "One Piece", "Star Wars", "Marvel"\n- 人気度: HIGH / MEDIUM / LOW / NONE\n\n**商品特性 (product_characteristics):**\n- is_easy_to_ship: 発送しやすい（小型・軽量・壊れにくい）\n- bulk_order_potential: 大量注文されやすい\n- turnover_rate: 回転率（HIGH / MEDIUM / LOW）\n- price_stability: 価格安定性（STABLE / VOLATILE）\n\n**サイズ・重量評価 (size_weight_rating):**\n- COMPACT: コンパクト（<15cm, <200g） → 高スコア\n- MEDIUM: 中型（15-30cm, 200-1000g） → 中スコア\n- LARGE: 大型（>30cm, >1000g） → 低スコア\n\n┌─────────────────────────────────────────────────────────────────┐\n│ ✅ 【８】その他の補足情報                                          │\n└─────────────────────────────────────────────────────────────────┘\n\n以下も可能な範囲で取得：\n- 発売日（release_date）\n- メーカー名（manufacturer）\n- 型番（model_number）\n- JAN/UPC/EAN（barcode）\n- VERO該当の可能性（is_vero_risk）\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📤 出力フォーマット（JSON配列 - 必須）\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n以下のJSON形式で全商品のデータを返してください：\n\n```json\n[\n  {\n    "product_id": "商品UUID",\n    "sku": "SKU",\n    \n    "origin_country": {\n      "code": "2文字ISOコード (JP/CN/US/KR/TW/HK/VN/TH/SG/MY/ID/PH/IN/GB/DE/FR/IT/ES/NL/BE/AU/NZ/MX/BR/AE/TR/ZA/NEEDS_MANUAL_CHECK/UNKNOWN)",\n      "confidence": "confirmed|suspected|unknown",\n      "source": "データ取得元（例: Package marking/Official site/Amazon listing/MANUAL_CHECK_REQUIRED）",\n      "manual_verification_required": true/false,\n      "notes": "補足情報（例: パッケージに\'Made in China\'表記あり）"\n    },\n    \n    "market_data": {\n      "lowest_price_usd": 最安値,\n      "average_price_usd": 平均価格,\n      "competitor_count": 競合数,\n      "sales_count": 販売数,\n      "data_source": "SellerMirror|eBay|Amazon|推定"\n    },\n    \n    "dimensions": {\n      "length_cm": 長さ,\n      "width_cm": 幅,\n      "height_cm": 高さ,\n      "weight_g": 重量,\n      "confidence": "confirmed|estimated",\n      "source": "メーカー公式|Amazon|推定"\n    },\n    \n    "title_rewrite": {\n      "optimized_title": "最適化された英語タイトル（80文字以内）",\n      "title_no_brand": "ブランド名なし版（VERO対応、オプション）",\n      "keywords": ["主要", "キーワード", "リスト"]\n    },\n    \n    "hts_classification": {\n      "hts_code": "HTSコード（例: 9503.00.00）",\n      "confidence": "high|medium|low|uncertain",\n      "description": "HTSコード説明",\n      "duty_rate": 関税率,\n      "source": "既存データ|新規推定"\n    },\n    \n    "material": {\n      "primary": "主要素材",\n      "secondary": "副次素材（オプション）",\n      "details": "詳細（例: PVC + ABS樹脂）"\n    },\n    \n    "market_analysis": {\n      "discontinued_status": "ACTIVE|DISCONTINUED_RECENT|DISCONTINUED_OLD|LIMITED_EDITION|UNKNOWN",\n      "premium_rate": プレミア率(%),\n      "domestic_availability": "ABUNDANT|MODERATE|SCARCE|RARE|OUT_OF_STOCK",\n      "community_score": 0-100点,\n      "future_value_trend": "INCREASING|STABLE|DECREASING|UNKNOWN",\n      "popular_character_series": "人気キャラ/シリーズ名",\n      "popularity_level": "HIGH|MEDIUM|LOW|NONE"\n    },\n    \n    "product_characteristics": {\n      "is_easy_to_ship": true/false,\n      "bulk_order_potential": true/false,\n      "turnover_rate": "HIGH|MEDIUM|LOW",\n      "price_stability": "STABLE|VOLATILE",\n      "size_weight_rating": "COMPACT|MEDIUM|LARGE"\n    },\n    \n    "additional_info": {\n      "release_date": "発売日（YYYY-MM-DD）",\n      "manufacturer": "メーカー名",\n      "model_number": "型番",\n      "barcode": "JAN/UPC/EAN",\n      "vero_risk": true/false\n    },\n    \n    "data_quality": {\n      "origin_confirmed": true/false,\n      "market_data_available": true/false,\n      "dimensions_confirmed": true/false,\n      "hts_reliable": true/false\n    },\n    \n    "notes": "特記事項・注意点"\n  }\n]\n```\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🚀 処理手順\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n1. 上記のCSVデータを1商品ずつ処理\n2. 各商品について【1】〜【7】の全項目を取得\n3. 取得完了ごとに "✅ [SKU] 完了" と表示\n4. 全商品処理完了後、JSON配列を出力\n5. **重要**: JSON出力後、必ず以下を実行\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n⚡ データベース自動更新（MCP Supabaseツール使用）\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nJSON出力完了後、MCPツール `supabase` を使って以下のSQLを自動実行：\n\n```sql\nUPDATE products\nSET \n  title_en = \'[最適化タイトル]\',\n  origin_country = \'[原産国コード]\',\n  hts_code = \'[HTSコード]\',\n  hts_confidence = \'[信頼度]\',\n  material = \'[素材]\',\n  listing_data = COALESCE(listing_data, \'{}\'::jsonb) || jsonb_build_object(\n    \'length_cm\', [長さ],\n    \'width_cm\', [幅],\n    \'height_cm\', [高さ],\n    \'weight_g\', [重量],\n    \'sm_lowest_price\', [最安値],\n    \'sm_average_price\', [平均価格],\n    \'sm_competitor_count\', [競合数],\n    \'sm_sales_count\', [販売数],\n    \'title_no_brand\', \'[ブランドなしタイトル]\',\n    \'origin_source\', \'[原産国ソース]\',\n    \'dimensions_source\', \'[サイズソース]\',\n    \'ai_updated_at\', NOW()\n  ),\n  updated_at = NOW()\nWHERE id = \'[商品UUID]\';\n```\n\n各商品の更新完了ごとに "✅ DB更新完了: [SKU]" と表示\n\n全商品更新完了後:\n"🎉 データベース更新完了: ').concat(products.length, '件"\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📊 処理開始 - 全自動モード\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n上記の手順で、全').concat(products.length, '件の商品データを取得し、JSON出力後に自動でSupabaseに保存してください。\n\n⚠️ 重要な注意事項:\n1. 原産国は必ず実データで確認（推測禁止）\n2. SellerMirrorデータがあれば優先使用\n3. 不明なデータは "UNKNOWN" または null\n4. HTSコードの誤りは関税追加請求のリスクあり\n5. 全商品処理後、必ずSupabase更新を実行\n\nそれでは処理を開始してください！\n');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-export-operations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-export-operations.ts
/**
 * エクスポート操作フック
 * 
 * 責務:
 * - 各種エクスポート機能
 * - AIエクスポート（プロンプト生成）
 * - 🔥 AI監査用JSONエクスポート
 */ __turbopack_context__.s([
    "useExportOperations",
    ()=>useExportOperations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useExportOperations(param) {
    let { products, selectedIds, showToast } = param;
    _s();
    const handleExport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useExportOperations.useCallback[handleExport]": ()=>{
            showToast('エクスポート機能は実装予定です');
        }
    }["useExportOperations.useCallback[handleExport]"], [
        showToast
    ]);
    const handleExportEbay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useExportOperations.useCallback[handleExportEbay]": ()=>{
            showToast('eBayエクスポート機能は実装予定です');
        }
    }["useExportOperations.useCallback[handleExportEbay]"], [
        showToast
    ]);
    const handleExportYahoo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useExportOperations.useCallback[handleExportYahoo]": ()=>{
            showToast('Yahooエクスポート機能は実装予定です');
        }
    }["useExportOperations.useCallback[handleExportYahoo]"], [
        showToast
    ]);
    const handleExportMercari = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useExportOperations.useCallback[handleExportMercari]": ()=>{
            showToast('メルカリエクスポート機能は実装予定です');
        }
    }["useExportOperations.useCallback[handleExportMercari]"], [
        showToast
    ]);
    /**
   * 🔥 AI監査用エクスポート
   * - 選択商品の監査用JSONデータ + 検証プロンプトをコピー
   * - HTSコード、利益計算、配送設定の妥当性をAIがチェック
   */ const handleAIExport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useExportOperations.useCallback[handleAIExport]": ()=>{
            if (selectedIds.size === 0) {
                showToast('商品を選択してください', 'error');
                return;
            }
            const selectedProducts = products.filter({
                "useExportOperations.useCallback[handleAIExport].selectedProducts": (p)=>selectedIds.has(String(p.id))
            }["useExportOperations.useCallback[handleAIExport].selectedProducts"]);
            try {
                // 🔥 AI監査用プロンプトを生成（新機能）
                const { generateAIAuditPrompt } = __turbopack_context__.r("[project]/n3-frontend_vps/app/tools/editing/lib/ai-export-prompt.ts [app-client] (ecmascript)");
                const prompt = generateAIAuditPrompt(selectedProducts);
                navigator.clipboard.writeText(prompt).then({
                    "useExportOperations.useCallback[handleAIExport]": ()=>{
                        showToast("✅ ".concat(selectedProducts.length, "件のAI監査データをコピーしました！Gemini/Claudeに貼り付けてください。"), 'success');
                    }
                }["useExportOperations.useCallback[handleAIExport]"]).catch({
                    "useExportOperations.useCallback[handleAIExport]": (err)=>{
                        console.error('コピーエラー:', err);
                        showToast('コピーに失敗しました', 'error');
                    }
                }["useExportOperations.useCallback[handleAIExport]"]);
            } catch (error) {
                console.error('AIエクスポートエラー:', error);
                showToast('AIエクスポートに失敗しました', 'error');
            }
        }
    }["useExportOperations.useCallback[handleAIExport]"], [
        selectedIds,
        products,
        showToast
    ]);
    const handleList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useExportOperations.useCallback[handleList]": ()=>{
            showToast('出品機能は実装予定です');
        }
    }["useExportOperations.useCallback[handleList]"], [
        showToast
    ]);
    return {
        handleExport,
        handleExportEbay,
        handleExportYahoo,
        handleExportMercari,
        handleAIExport,
        handleList
    };
}
_s(useExportOperations, "8k43Goy9lCFtJ2PLewgjj+1EQ8o=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing/hooks/use-crud-operations.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing/hooks/use-crud-operations.ts
/**
 * CRUD操作フック
 * 
 * 責務:
 * - 保存操作
 * - 削除操作
 * - モーダル保存操作
 */ __turbopack_context__.s([
    "useCRUDOperations",
    ()=>useCRUDOperations
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useCRUDOperations(param) {
    let { selectedIds, saveAllModified, deleteProducts, updateLocalProduct, showToast, deselectAll } = param;
    _s();
    const handleSaveAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCRUDOperations.useCallback[handleSaveAll]": async ()=>{
            try {
                await saveAllModified();
                showToast('保存しました', 'success');
            } catch (error) {
                showToast('保存に失敗しました', 'error');
            }
        }
    }["useCRUDOperations.useCallback[handleSaveAll]"], [
        saveAllModified,
        showToast
    ]);
    const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCRUDOperations.useCallback[handleDelete]": async ()=>{
            if (selectedIds.size === 0) {
                showToast('削除する商品を選択してください', 'error');
                return;
            }
            try {
                await deleteProducts(Array.from(selectedIds));
                deselectAll();
                showToast('削除しました', 'success');
            } catch (error) {
                showToast('削除に失敗しました', 'error');
            }
        }
    }["useCRUDOperations.useCallback[handleDelete]"], [
        selectedIds,
        deleteProducts,
        deselectAll,
        showToast
    ]);
    const handleModalSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCRUDOperations.useCallback[handleModalSave]": (product, updates, closeModal)=>{
            updateLocalProduct(String(product.id), updates);
            closeModal();
        }
    }["useCRUDOperations.useCallback[handleModalSave]"], [
        updateLocalProduct
    ]);
    return {
        handleSaveAll,
        handleDelete,
        handleModalSave
    };
}
_s(useCRUDOperations, "u2RG5eEwHRJs/h+Da4UTOmDhCvA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_editing_b37ca914._.js.map