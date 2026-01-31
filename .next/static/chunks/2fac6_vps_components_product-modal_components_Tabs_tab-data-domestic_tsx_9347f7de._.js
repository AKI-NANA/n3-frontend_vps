(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabDataDomestic",
    ()=>TabDataDomestic,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * TabDataDomestic - 国内販路用データタブ
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
const QOO10_CATEGORIES = [
    {
        code: '001',
        name: 'ファッション'
    },
    {
        code: '002',
        name: 'ビューティー・コスメ'
    },
    {
        code: '003',
        name: 'デジタル・家電'
    },
    {
        code: '004',
        name: 'スポーツ・アウトドア'
    },
    {
        code: '005',
        name: '生活雑貨・日用品'
    },
    {
        code: '006',
        name: 'ベビー・キッズ'
    },
    {
        code: '007',
        name: '食品・飲料'
    },
    {
        code: '008',
        name: 'ホビー・コレクション'
    },
    {
        code: '009',
        name: 'インテリア・家具'
    }
];
function TabDataDomestic(param) {
    let { product, marketplace = 'qoo10-jp', onSave } = param;
    _s();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        titleJa: '',
        descriptionJa: '',
        sku: '',
        janCode: '',
        modelNumber: '',
        brand: '',
        manufacturer: '',
        qoo10Category: '',
        costPrice: 0,
        sellingPrice: 0,
        stockQuantity: 1,
        weightG: 0,
        lengthCm: 0,
        widthCm: 0,
        heightCm: 0,
        supplierUrl: '',
        supplierName: '',
        condition: '新品'
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabDataDomestic.useEffect": ()=>{
            if (product) {
                var _product_stock, _p_reference_urls_, _p_reference_urls;
                const p = product;
                setFormData({
                    titleJa: p.japanese_title || p.title_ja || product.title || '',
                    descriptionJa: p.description_ja || product.description || '',
                    sku: product.sku || '',
                    janCode: p.jan_code || '',
                    modelNumber: p.model_number || '',
                    brand: p.brand_name || p.brand || '',
                    manufacturer: p.manufacturer || '',
                    qoo10Category: p.qoo10_category_code || '',
                    costPrice: p.purchase_price_jpy || p.cost_price || 0,
                    sellingPrice: p.domestic_price_jpy || p.price_jpy || 0,
                    stockQuantity: ((_product_stock = product.stock) === null || _product_stock === void 0 ? void 0 : _product_stock.available) || 1,
                    weightG: p.weight_g || 0,
                    lengthCm: p.length_cm || 0,
                    widthCm: p.width_cm || 0,
                    heightCm: p.height_cm || 0,
                    supplierUrl: ((_p_reference_urls = p.reference_urls) === null || _p_reference_urls === void 0 ? void 0 : (_p_reference_urls_ = _p_reference_urls[0]) === null || _p_reference_urls_ === void 0 ? void 0 : _p_reference_urls_.url) || p.supplier_url || '',
                    supplierName: p.supplier_name || '',
                    condition: p.condition || '新品'
                });
            }
        }
    }["TabDataDomestic.useEffect"], [
        product
    ]);
    const updateField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabDataDomestic.useCallback[updateField]": (field, value)=>{
            setFormData({
                "TabDataDomestic.useCallback[updateField]": (prev)=>({
                        ...prev,
                        [field]: value
                    })
            }["TabDataDomestic.useCallback[updateField]"]);
        }
    }["TabDataDomestic.useCallback[updateField]"], []);
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabDataDomestic.useCallback[handleSave]": ()=>{
            onSave === null || onSave === void 0 ? void 0 : onSave({
                japanese_title: formData.titleJa,
                description_ja: formData.descriptionJa,
                sku: formData.sku,
                jan_code: formData.janCode,
                model_number: formData.modelNumber,
                brand_name: formData.brand,
                manufacturer: formData.manufacturer,
                qoo10_category_code: formData.qoo10Category,
                purchase_price_jpy: formData.costPrice,
                domestic_price_jpy: formData.sellingPrice,
                weight_g: formData.weightG,
                length_cm: formData.lengthCm,
                width_cm: formData.widthCm,
                height_cm: formData.heightCm,
                supplier_url: formData.supplierUrl,
                supplier_name: formData.supplierName,
                condition: formData.condition
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('商品データを保存しました');
        }
    }["TabDataDomestic.useCallback[handleSave]"], [
        formData,
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
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
            lineNumber: 81,
            columnNumber: 12
        }, this);
    }
    const inputStyle = {
        width: '100%',
        padding: '0.375rem 0.5rem',
        fontSize: '11px',
        borderRadius: '4px',
        border: "1px solid ".concat(T.panelBorder),
        background: T.panel,
        color: T.text
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '1rem',
            overflow: 'auto',
            background: T.bg
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: T.panel,
                    borderRadius: '6px',
                    border: "1px solid ".concat(T.panelBorder)
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-database",
                                style: {
                                    color: T.blue
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    color: T.text
                                },
                                children: "商品データ（国内販売用）"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSave,
                        style: {
                            padding: '0.5rem 1rem',
                            fontSize: '11px',
                            fontWeight: 600,
                            borderRadius: '4px',
                            border: 'none',
                            background: T.success,
                            color: 'white',
                            cursor: 'pointer'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-save"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                lineNumber: 97,
                                columnNumber: 11
                            }, this),
                            " 保存"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
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
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            color: T.textMuted,
                                            marginBottom: '0.5rem',
                                            paddingBottom: '0.375rem',
                                            borderBottom: "1px solid ".concat(T.panelBorder)
                                        },
                                        children: "基本情報"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            marginBottom: '0.5rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: 'block',
                                                    fontSize: '10px',
                                                    fontWeight: 600,
                                                    color: T.textMuted,
                                                    marginBottom: '0.25rem'
                                                },
                                                children: "商品名（日本語）*"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 107,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: formData.titleJa,
                                                onChange: (e)=>updateField('titleJa', e.target.value),
                                                placeholder: "商品名を入力",
                                                style: inputStyle
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 108,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    textAlign: 'right',
                                                    fontSize: '9px',
                                                    color: formData.titleJa.length > 100 ? T.error : T.textSubtle
                                                },
                                                children: [
                                                    formData.titleJa.length,
                                                    " / 100"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 109,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 106,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: 'block',
                                                    fontSize: '10px',
                                                    fontWeight: 600,
                                                    color: T.textMuted,
                                                    marginBottom: '0.25rem'
                                                },
                                                children: "商品説明（日本語）"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 112,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                value: formData.descriptionJa,
                                                onChange: (e)=>updateField('descriptionJa', e.target.value),
                                                rows: 4,
                                                placeholder: "商品の特徴、使い方、スペックなど",
                                                style: {
                                                    ...inputStyle,
                                                    resize: 'vertical'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 113,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 111,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                lineNumber: 104,
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
                                            marginBottom: '0.5rem',
                                            paddingBottom: '0.375rem',
                                            borderBottom: "1px solid ".concat(T.panelBorder)
                                        },
                                        children: "識別情報"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 119,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '0.75rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "SKU"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: formData.sku,
                                                        onChange: (e)=>updateField('sku', e.target.value),
                                                        placeholder: "SKU-12345",
                                                        style: inputStyle
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 147
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 121,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "JANコード"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 122,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: formData.janCode,
                                                        onChange: (e)=>updateField('janCode', e.target.value),
                                                        placeholder: "4901234567890",
                                                        style: inputStyle
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 122,
                                                        columnNumber: 150
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 122,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "型番"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: formData.modelNumber,
                                                        onChange: (e)=>updateField('modelNumber', e.target.value),
                                                        placeholder: "ABC-123",
                                                        style: inputStyle
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 146
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 123,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 120,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                lineNumber: 118,
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
                                            marginBottom: '0.5rem',
                                            paddingBottom: '0.375rem',
                                            borderBottom: "1px solid ".concat(T.panelBorder)
                                        },
                                        children: "ブランド・カテゴリ"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 129,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 1fr)',
                                            gap: '0.75rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "ブランド"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 131,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: formData.brand,
                                                        onChange: (e)=>updateField('brand', e.target.value),
                                                        placeholder: "ブランド名",
                                                        style: inputStyle
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 131,
                                                        columnNumber: 148
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 131,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "メーカー"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: formData.manufacturer,
                                                        onChange: (e)=>updateField('manufacturer', e.target.value),
                                                        placeholder: "メーカー名",
                                                        style: inputStyle
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 148
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 132,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "Qoo10カテゴリ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 133,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: formData.qoo10Category,
                                                        onChange: (e)=>updateField('qoo10Category', e.target.value),
                                                        style: inputStyle,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "選択してください"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 133,
                                                                columnNumber: 274
                                                            }, this),
                                                            QOO10_CATEGORIES.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: cat.code,
                                                                    children: cat.name
                                                                }, cat.code, false, {
                                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                    lineNumber: 133,
                                                                    columnNumber: 337
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 133,
                                                        columnNumber: 153
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 133,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 130,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                lineNumber: 128,
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
                                            marginBottom: '0.5rem',
                                            paddingBottom: '0.375rem',
                                            borderBottom: "1px solid ".concat(T.panelBorder)
                                        },
                                        children: "仕入れ先情報"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 139,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: '2fr 1fr',
                                            gap: '0.75rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "仕入れ先URL"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "url",
                                                        value: formData.supplierUrl,
                                                        onChange: (e)=>updateField('supplierUrl', e.target.value),
                                                        placeholder: "https://www.amazon.co.jp/dp/...",
                                                        style: inputStyle
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 151
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 141,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "仕入れ先名"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: formData.supplierName,
                                                        onChange: (e)=>updateField('supplierName', e.target.value),
                                                        placeholder: "Amazon JP",
                                                        style: inputStyle
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 149
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 142,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 140,
                                        columnNumber: 13
                                    }, this),
                                    formData.supplierUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: formData.supplierUrl,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        style: {
                                            fontSize: '10px',
                                            color: T.blue,
                                            marginTop: '0.25rem',
                                            display: 'inline-block'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fas fa-external-link-alt"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 144,
                                                columnNumber: 202
                                            }, this),
                                            " 仕入れ先を開く"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 144,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                        lineNumber: 102,
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
                                            marginBottom: '0.5rem',
                                            paddingBottom: '0.375rem',
                                            borderBottom: "1px solid ".concat(T.panelBorder)
                                        },
                                        children: "価格・在庫"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "仕入れ価格"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            position: 'relative'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    position: 'absolute',
                                                                    left: '8px',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)',
                                                                    color: T.textMuted,
                                                                    fontSize: '11px'
                                                                },
                                                                children: "¥"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 153,
                                                                columnNumber: 187
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: formData.costPrice,
                                                                onChange: (e)=>updateField('costPrice', Number(e.target.value)),
                                                                style: {
                                                                    ...inputStyle,
                                                                    paddingLeft: '20px'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 153,
                                                                columnNumber: 328
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 149
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 153,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "販売価格"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 154,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            position: 'relative'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    position: 'absolute',
                                                                    left: '8px',
                                                                    top: '50%',
                                                                    transform: 'translateY(-50%)',
                                                                    color: T.textMuted,
                                                                    fontSize: '11px'
                                                                },
                                                                children: "¥"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 154,
                                                                columnNumber: 186
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: formData.sellingPrice,
                                                                onChange: (e)=>updateField('sellingPrice', Number(e.target.value)),
                                                                style: {
                                                                    ...inputStyle,
                                                                    paddingLeft: '20px'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 154,
                                                                columnNumber: 327
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 154,
                                                        columnNumber: 148
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 154,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "在庫数"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: formData.stockQuantity,
                                                        onChange: (e)=>updateField('stockQuantity', Number(e.target.value)),
                                                        min: 0,
                                                        style: inputStyle
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 147
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 155,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "商品状態"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 156,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: formData.condition,
                                                        onChange: (e)=>updateField('condition', e.target.value),
                                                        style: inputStyle,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "新品",
                                                                children: "新品"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 156,
                                                                columnNumber: 261
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "中古（ほぼ新品）",
                                                                children: "中古（ほぼ新品）"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 156,
                                                                columnNumber: 291
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "中古（良い）",
                                                                children: "中古（良い）"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 156,
                                                                columnNumber: 333
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "中古（可）",
                                                                children: "中古（可）"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 156,
                                                                columnNumber: 371
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 156,
                                                        columnNumber: 148
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 156,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                lineNumber: 150,
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
                                            marginBottom: '0.5rem',
                                            paddingBottom: '0.375rem',
                                            borderBottom: "1px solid ".concat(T.panelBorder)
                                        },
                                        children: "サイズ・重量"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 162,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        style: {
                                                            display: 'block',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: T.textMuted,
                                                            marginBottom: '0.25rem'
                                                        },
                                                        children: "重量 (g)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: formData.weightG,
                                                        onChange: (e)=>updateField('weightG', Number(e.target.value)),
                                                        style: inputStyle
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 150
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 164,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'grid',
                                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                                    gap: '0.5rem'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: 'block',
                                                                    fontSize: '9px',
                                                                    fontWeight: 600,
                                                                    color: T.textMuted,
                                                                    marginBottom: '0.25rem'
                                                                },
                                                                children: "縦"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 166,
                                                                columnNumber: 22
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: formData.lengthCm,
                                                                onChange: (e)=>updateField('lengthCm', Number(e.target.value)),
                                                                style: inputStyle
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 166,
                                                                columnNumber: 146
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: 'block',
                                                                    fontSize: '9px',
                                                                    fontWeight: 600,
                                                                    color: T.textMuted,
                                                                    marginBottom: '0.25rem'
                                                                },
                                                                children: "横"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 167,
                                                                columnNumber: 22
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: formData.widthCm,
                                                                onChange: (e)=>updateField('widthCm', Number(e.target.value)),
                                                                style: inputStyle
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 167,
                                                                columnNumber: 146
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 167,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                style: {
                                                                    display: 'block',
                                                                    fontSize: '9px',
                                                                    fontWeight: 600,
                                                                    color: T.textMuted,
                                                                    marginBottom: '0.25rem'
                                                                },
                                                                children: "高さ"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 168,
                                                                columnNumber: 22
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: formData.heightCm,
                                                                onChange: (e)=>updateField('heightCm', Number(e.target.value)),
                                                                style: inputStyle
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                                lineNumber: 168,
                                                                columnNumber: 147
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 168,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 165,
                                                columnNumber: 15
                                            }, this),
                                            formData.lengthCm > 0 && formData.widthCm > 0 && formData.heightCm > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    padding: '0.5rem',
                                                    background: T.highlight,
                                                    borderRadius: '4px',
                                                    fontSize: '10px',
                                                    color: T.textMuted
                                                },
                                                children: [
                                                    "3辺合計: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: [
                                                            formData.lengthCm + formData.widthCm + formData.heightCm,
                                                            " cm"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 172,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 163,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this),
                            formData.costPrice > 0 && formData.sellingPrice > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            marginBottom: '0.5rem',
                                            paddingBottom: '0.375rem',
                                            borderBottom: "1px solid ".concat(T.panelBorder)
                                        },
                                        children: "概算"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 181,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '0.5rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    padding: '0.5rem',
                                                    background: T.highlight,
                                                    borderRadius: '4px',
                                                    textAlign: 'center'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '8px',
                                                            color: T.textMuted
                                                        },
                                                        children: "粗利"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '14px',
                                                            fontWeight: 700,
                                                            color: formData.sellingPrice - formData.costPrice > 0 ? T.success : T.error
                                                        },
                                                        children: [
                                                            "¥",
                                                            (formData.sellingPrice - formData.costPrice).toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 185,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 183,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    padding: '0.5rem',
                                                    background: T.highlight,
                                                    borderRadius: '4px',
                                                    textAlign: 'center'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '8px',
                                                            color: T.textMuted
                                                        },
                                                        children: "粗利率"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 188,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '14px',
                                                            fontWeight: 700,
                                                            color: T.text
                                                        },
                                                        children: [
                                                            ((formData.sellingPrice - formData.costPrice) / formData.sellingPrice * 100).toFixed(1),
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                        lineNumber: 189,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                                lineNumber: 187,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                                lineNumber: 180,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_s(TabDataDomestic, "AZqZ70Zp+bppFdUPnf1Drz0onwI=");
_c = TabDataDomestic;
const __TURBOPACK__default__export__ = TabDataDomestic;
var _c;
__turbopack_context__.k.register(_c, "TabDataDomestic");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=2fac6_vps_components_product-modal_components_Tabs_tab-data-domestic_tsx_9347f7de._.js.map