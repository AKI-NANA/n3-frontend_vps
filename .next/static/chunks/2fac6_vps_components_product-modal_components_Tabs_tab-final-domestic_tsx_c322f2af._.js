(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabFinalDomestic",
    ()=>TabFinalDomestic,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * TabFinalDomestic - 国内出品確認タブ
 * Qoo10出品前の最終確認
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
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
    accent: '#ff0066',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    blue: '#3b82f6'
};
function TabFinalDomestic(param) {
    let { product, marketplace = 'qoo10-jp', onSave } = param;
    var _product_selectedImages, _product_images_, _product_images, _product_selectedImages1, _product_images_1, _product_images1, _product_stock, _product_selectedImages2, _product_images2, _product_selectedImages3, _product_images3;
    _s();
    const [listing, setListing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // バリデーション
    const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabFinalDomestic.useMemo[validation]": ()=>{
            var _product_selectedImages, _product_images;
            if (!product) return {
                valid: false,
                errors: [
                    '商品が選択されていません'
                ]
            };
            const errors = [];
            const p = product;
            // 必須項目チェック
            if (!p.japanese_title && !p.title_ja && !product.title) errors.push('商品名が未入力');
            if (!p.domestic_price_jpy && !p.price_jpy) errors.push('販売価格が未設定');
            if (!p.qoo10_category_code) errors.push('カテゴリが未選択');
            if (!((_product_selectedImages = product.selectedImages) === null || _product_selectedImages === void 0 ? void 0 : _product_selectedImages.length) && !((_product_images = product.images) === null || _product_images === void 0 ? void 0 : _product_images.length)) errors.push('画像が未設定');
            if (!p.html_description && !p.qoo10_html) errors.push('HTML説明文が未作成');
            // 警告チェック
            const warnings = [];
            const title = p.japanese_title || p.title_ja || product.title || '';
            if (title.length > 50) warnings.push("商品名が長すぎます (".concat(title.length, "文字 / 推奨50文字以内)"));
            if (!p.jan_code) warnings.push('JANコードが未入力');
            if (!p.brand_name && !p.brand) warnings.push('ブランドが未入力');
            return {
                valid: errors.length === 0,
                errors,
                warnings
            };
        }
    }["TabFinalDomestic.useMemo[validation]"], [
        product
    ]);
    // 出品実行
    const handleListing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabFinalDomestic.useCallback[handleListing]": async (asDraft)=>{
            if (!validation.valid) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('必須項目が不足しています');
                return;
            }
            setListing(true);
            try {
                var _product_stock, _product_images;
                const p = product;
                const listingData = {
                    marketplace,
                    listing_type: asDraft ? 'draft' : 'live',
                    item_qty: asDraft ? 0 : (product === null || product === void 0 ? void 0 : (_product_stock = product.stock) === null || _product_stock === void 0 ? void 0 : _product_stock.available) || 1,
                    title: p.japanese_title || p.title_ja || (product === null || product === void 0 ? void 0 : product.title),
                    price: p.domestic_price_jpy || p.price_jpy,
                    category: p.qoo10_category_code,
                    html: p.html_description || p.qoo10_html,
                    images: (product === null || product === void 0 ? void 0 : product.selectedImages) || (product === null || product === void 0 ? void 0 : (_product_images = product.images) === null || _product_images === void 0 ? void 0 : _product_images.map({
                        "TabFinalDomestic.useCallback[handleListing]": (img)=>img.url
                    }["TabFinalDomestic.useCallback[handleListing]"])),
                    listed_at: new Date().toISOString()
                };
                onSave === null || onSave === void 0 ? void 0 : onSave({
                    qoo10_listing: listingData,
                    listing_status: asDraft ? 'draft' : 'pending'
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(asDraft ? '✓ 下書き保存しました（在庫0）' : '✓ 出品キューに追加しました');
            } catch (error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("エラー: ".concat(error.message));
            } finally{
                setListing(false);
            }
        }
    }["TabFinalDomestic.useCallback[handleListing]"], [
        product,
        marketplace,
        validation,
        onSave
    ]);
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '2rem',
                textAlign: 'center',
                color: T.textMuted
            },
            children: "商品を選択してください"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
            lineNumber: 83,
            columnNumber: 12
        }, this);
    }
    const p = product;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '1rem',
            overflow: 'auto',
            background: T.bg
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: "linear-gradient(135deg, ".concat(T.accent, ", #ff6699)"),
                    borderRadius: '6px',
                    textAlign: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas fa-check-circle",
                        style: {
                            color: 'white',
                            fontSize: '24px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '16px',
                            marginTop: '0.5rem'
                        },
                        children: "Qoo10 出品確認"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: T.panel,
                                    borderRadius: '6px',
                                    border: "1px solid ".concat(T.panelBorder),
                                    padding: '0.75rem'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        gap: '1rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                width: '120px',
                                                height: '120px',
                                                borderRadius: '6px',
                                                overflow: 'hidden',
                                                background: T.highlight,
                                                flexShrink: 0
                                            },
                                            children: ((_product_selectedImages = product.selectedImages) === null || _product_selectedImages === void 0 ? void 0 : _product_selectedImages[0]) || ((_product_images = product.images) === null || _product_images === void 0 ? void 0 : (_product_images_ = _product_images[0]) === null || _product_images_ === void 0 ? void 0 : _product_images_.url) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: ((_product_selectedImages1 = product.selectedImages) === null || _product_selectedImages1 === void 0 ? void 0 : _product_selectedImages1[0]) || ((_product_images1 = product.images) === null || _product_images1 === void 0 ? void 0 : (_product_images_1 = _product_images1[0]) === null || _product_images_1 === void 0 ? void 0 : _product_images_1.url),
                                                alt: "",
                                                style: {
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                lineNumber: 105,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: T.textMuted
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fas fa-image",
                                                    style: {
                                                        fontSize: '24px'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                    lineNumber: 107,
                                                    columnNumber: 151
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                lineNumber: 107,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                            lineNumber: 103,
                                            columnNumber: 15
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
                                                        color: T.text,
                                                        marginBottom: '0.5rem'
                                                    },
                                                    children: p.japanese_title || p.title_ja || product.title || '(タイトル未設定)'
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '11px',
                                                        color: T.textMuted,
                                                        marginBottom: '0.25rem'
                                                    },
                                                    children: [
                                                        "SKU: ",
                                                        product.sku || '-'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '11px',
                                                        color: T.textMuted,
                                                        marginBottom: '0.25rem'
                                                    },
                                                    children: [
                                                        "ブランド: ",
                                                        p.brand_name || p.brand || '-'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        fontSize: '20px',
                                                        fontWeight: 700,
                                                        color: T.accent,
                                                        marginTop: '0.5rem'
                                                    },
                                                    children: [
                                                        "¥",
                                                        (p.domestic_price_jpy || p.price_jpy || 0).toLocaleString()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                    lineNumber: 115,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                            lineNumber: 111,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: T.panel,
                                    borderRadius: '6px',
                                    border: "1px solid ".concat(T.panelBorder),
                                    padding: '0.75rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            color: T.textMuted,
                                            marginBottom: '0.5rem'
                                        },
                                        children: "出品情報"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                        lineNumber: 122,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '0.5rem',
                                            fontSize: '11px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: T.textMuted
                                                        },
                                                        children: "カテゴリ:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 20
                                                    }, this),
                                                    " ",
                                                    p.qoo10_category_code || '-'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                lineNumber: 124,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: T.textMuted
                                                        },
                                                        children: "在庫:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                        lineNumber: 125,
                                                        columnNumber: 20
                                                    }, this),
                                                    " ",
                                                    ((_product_stock = product.stock) === null || _product_stock === void 0 ? void 0 : _product_stock.available) || 0,
                                                    "個"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                lineNumber: 125,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: T.textMuted
                                                        },
                                                        children: "JANコード:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 20
                                                    }, this),
                                                    " ",
                                                    p.jan_code || '-'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                lineNumber: 126,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: T.textMuted
                                                        },
                                                        children: "画像:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                        lineNumber: 127,
                                                        columnNumber: 20
                                                    }, this),
                                                    " ",
                                                    ((_product_selectedImages2 = product.selectedImages) === null || _product_selectedImages2 === void 0 ? void 0 : _product_selectedImages2.length) || ((_product_images2 = product.images) === null || _product_images2 === void 0 ? void 0 : _product_images2.length) || 0,
                                                    "枚"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                lineNumber: 127,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: T.textMuted
                                                        },
                                                        children: "HTML説明:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                        lineNumber: 128,
                                                        columnNumber: 20
                                                    }, this),
                                                    " ",
                                                    p.html_description || p.qoo10_html ? '✓ 作成済み' : '✗ 未作成'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                lineNumber: 128,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: T.textMuted
                                                        },
                                                        children: "送料:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                        lineNumber: 129,
                                                        columnNumber: 20
                                                    }, this),
                                                    " 送料無料"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                lineNumber: 129,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                        lineNumber: 123,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                lineNumber: 121,
                                columnNumber: 11
                            }, this),
                            (p.html_description || p.qoo10_html) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: T.panel,
                                    borderRadius: '6px',
                                    border: "1px solid ".concat(T.panelBorder),
                                    padding: '0.75rem',
                                    maxHeight: '200px',
                                    overflow: 'auto'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            color: T.textMuted,
                                            marginBottom: '0.5rem'
                                        },
                                        children: "HTML説明文プレビュー"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            transform: 'scale(0.5)',
                                            transformOrigin: 'top left',
                                            width: '200%'
                                        },
                                        dangerouslySetInnerHTML: {
                                            __html: p.html_description || p.qoo10_html
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                        lineNumber: 137,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                        lineNumber: 98,
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
                                    background: validation.valid ? "".concat(T.success, "10") : "".concat(T.error, "10"),
                                    borderRadius: '6px',
                                    border: "1px solid ".concat(validation.valid ? T.success : T.error),
                                    padding: '0.75rem'
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
                                                className: "fas ".concat(validation.valid ? 'fa-check-circle' : 'fa-exclamation-circle'),
                                                style: {
                                                    color: validation.valid ? T.success : T.error
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                lineNumber: 147,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontWeight: 600,
                                                    fontSize: '12px',
                                                    color: validation.valid ? T.success : T.error
                                                },
                                                children: validation.valid ? '出品可能' : '要修正'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                lineNumber: 148,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this),
                                    validation.errors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: '0.5rem'
                                        },
                                        children: validation.errors.map((err, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: T.error,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fas fa-times"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 132
                                                    }, this),
                                                    " ",
                                                    err
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                lineNumber: 153,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                        lineNumber: 151,
                                        columnNumber: 15
                                    }, this),
                                    validation.warnings && validation.warnings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: validation.warnings.map((warn, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '10px',
                                                    color: T.warning,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fas fa-exclamation-triangle"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                        lineNumber: 160,
                                                        columnNumber: 134
                                                    }, this),
                                                    " ",
                                                    warn
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                lineNumber: 160,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                        lineNumber: 158,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                lineNumber: 145,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: T.panel,
                                    borderRadius: '6px',
                                    border: "1px solid ".concat(T.panelBorder),
                                    padding: '0.75rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            color: T.textMuted,
                                            marginBottom: '0.5rem'
                                        },
                                        children: "チェックリスト"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                        lineNumber: 168,
                                        columnNumber: 13
                                    }, this),
                                    [
                                        {
                                            label: '商品名',
                                            ok: !!(p.japanese_title || p.title_ja || product.title)
                                        },
                                        {
                                            label: '販売価格',
                                            ok: !!(p.domestic_price_jpy || p.price_jpy)
                                        },
                                        {
                                            label: 'カテゴリ',
                                            ok: !!p.qoo10_category_code
                                        },
                                        {
                                            label: '画像',
                                            ok: !!(((_product_selectedImages3 = product.selectedImages) === null || _product_selectedImages3 === void 0 ? void 0 : _product_selectedImages3.length) || ((_product_images3 = product.images) === null || _product_images3 === void 0 ? void 0 : _product_images3.length))
                                        },
                                        {
                                            label: 'HTML説明文',
                                            ok: !!(p.html_description || p.qoo10_html)
                                        },
                                        {
                                            label: 'JANコード',
                                            ok: !!p.jan_code,
                                            optional: true
                                        }
                                    ].map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.25rem 0',
                                                fontSize: '11px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fas ".concat(item.ok ? 'fa-check-circle' : item.optional ? 'fa-minus-circle' : 'fa-times-circle'),
                                                    style: {
                                                        color: item.ok ? T.success : item.optional ? T.warning : T.error
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: item.ok ? T.text : T.textMuted
                                                    },
                                                    children: item.label
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 17
                                                }, this),
                                                item.optional && !item.ok && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: '9px',
                                                        color: T.textSubtle
                                                    },
                                                    children: "(任意)"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 47
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                            lineNumber: 177,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 'auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleListing(true),
                                        disabled: listing,
                                        style: {
                                            padding: '0.75rem',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            borderRadius: '6px',
                                            border: "2px solid ".concat(T.accent),
                                            background: 'white',
                                            color: T.accent,
                                            cursor: 'pointer'
                                        },
                                        children: listing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fas fa-spinner fa-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                    lineNumber: 188,
                                                    columnNumber: 28
                                                }, this),
                                                " 処理中..."
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fas fa-save"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                    lineNumber: 188,
                                                    columnNumber: 85
                                                }, this),
                                                " 下書き保存（在庫0）"
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                        lineNumber: 187,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleListing(false),
                                        disabled: listing || !validation.valid,
                                        style: {
                                            padding: '0.75rem',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: validation.valid ? T.accent : T.textSubtle,
                                            color: 'white',
                                            cursor: validation.valid ? 'pointer' : 'not-allowed'
                                        },
                                        children: listing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fas fa-spinner fa-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 28
                                                }, this),
                                                " 処理中..."
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fas fa-rocket"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 85
                                                }, this),
                                                " 出品する"
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                        lineNumber: 190,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
_s(TabFinalDomestic, "ydmm/3FaHcC2QYONAoMOYGLJGYs=");
_c = TabFinalDomestic;
const __TURBOPACK__default__export__ = TabFinalDomestic;
var _c;
__turbopack_context__.k.register(_c, "TabFinalDomestic");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=2fac6_vps_components_product-modal_components_Tabs_tab-final-domestic_tsx_c322f2af._.js.map