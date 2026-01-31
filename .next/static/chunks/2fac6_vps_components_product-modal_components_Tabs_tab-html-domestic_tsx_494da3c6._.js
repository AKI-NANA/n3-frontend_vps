(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabHTMLDomestic",
    ()=>TabHTMLDomestic,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * TabHTMLDomestic - 国内販路用HTML説明文タブ
 * Qoo10向けLP風HTML生成
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
// HTMLテンプレート
const TEMPLATES = {
    standard: {
        name: 'スタンダード',
        description: '基本的な商品説明テンプレート'
    },
    premium: {
        name: 'プレミアム',
        description: 'LP風の豪華なデザイン'
    },
    simple: {
        name: 'シンプル',
        description: '最小限の装飾'
    }
};
function TabHTMLDomestic(param) {
    let { product, marketplace = 'qoo10-jp', onSave } = param;
    _s();
    const [htmlContent, setHtmlContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedTemplate, setSelectedTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('standard');
    const [showPreview, setShowPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // 商品データ
    const [productData, setProductData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        description: '',
        brand: '',
        images: [],
        features: [
            '',
            '',
            ''
        ]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabHTMLDomestic.useEffect": ()=>{
            if (product) {
                var _product_images;
                const p = product;
                setProductData({
                    title: p.japanese_title || p.title_ja || product.title || '',
                    description: p.description_ja || product.description || '',
                    brand: p.brand_name || p.brand || '',
                    images: product.selectedImages || ((_product_images = product.images) === null || _product_images === void 0 ? void 0 : _product_images.map({
                        "TabHTMLDomestic.useEffect": (img)=>img.url
                    }["TabHTMLDomestic.useEffect"])) || [],
                    features: p.features || [
                        '',
                        '',
                        ''
                    ]
                });
                setHtmlContent(p.html_description || p.qoo10_html || '');
            }
        }
    }["TabHTMLDomestic.useEffect"], [
        product
    ]);
    // HTML生成
    const generateHtml = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabHTMLDomestic.useCallback[generateHtml]": ()=>{
            const { title, description, brand, images, features } = productData;
            const mainImage = images[0] || '';
            let html = '';
            if (selectedTemplate === 'premium') {
                html = '\n<div style="max-width:800px;margin:0 auto;font-family:\'Hiragino Sans\',\'Yu Gothic\',sans-serif;">\n  <!-- ヒーローセクション -->\n  <div style="background:linear-gradient(135deg,#ff0066,#ff6699);padding:30px;border-radius:12px;margin-bottom:20px;text-align:center;">\n    <h1 style="color:white;font-size:28px;margin:0 0 10px 0;text-shadow:2px 2px 4px rgba(0,0,0,0.2);">'.concat(title, "</h1>\n    ").concat(brand ? '<p style="color:rgba(255,255,255,0.9);font-size:14px;margin:0;">【'.concat(brand, "】</p>") : '', "\n  </div>\n\n  <!-- メイン画像 -->\n  ").concat(mainImage ? '\n  <div style="text-align:center;margin-bottom:25px;">\n    <img src="'.concat(mainImage, '" alt="').concat(title, '" style="max-width:100%;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.15);">\n  </div>\n  ') : '', "\n\n  <!-- 特徴3点 -->\n  ").concat(features.some({
                    "TabHTMLDomestic.useCallback[generateHtml]": (f)=>f
                }["TabHTMLDomestic.useCallback[generateHtml]"]) ? '\n  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-bottom:25px;">\n    '.concat(features.filter({
                    "TabHTMLDomestic.useCallback[generateHtml]": (f)=>f
                }["TabHTMLDomestic.useCallback[generateHtml]"]).map({
                    "TabHTMLDomestic.useCallback[generateHtml]": (feature, i)=>'\n    <div style="background:#fff;padding:20px;border-radius:8px;text-align:center;box-shadow:0 2px 10px rgba(0,0,0,0.08);">\n      <div style="width:50px;height:50px;background:linear-gradient(135deg,#ff0066,#ff6699);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;color:white;font-weight:bold;font-size:20px;">'.concat(i + 1, '</div>\n      <p style="margin:0;font-size:14px;color:#333;">').concat(feature, "</p>\n    </div>\n    ")
                }["TabHTMLDomestic.useCallback[generateHtml]"]).join(''), "\n  </div>\n  ") : '', '\n\n  <!-- 商品説明 -->\n  <div style="background:#f8f9fa;padding:25px;border-radius:12px;margin-bottom:20px;">\n    <h2 style="color:#333;font-size:20px;border-bottom:3px solid #ff0066;padding-bottom:10px;margin:0 0 15px 0;">商品説明</h2>\n    <p style="color:#555;line-height:2;white-space:pre-wrap;margin:0;">').concat(description, '</p>\n  </div>\n\n  <!-- 安心・配送 -->\n  <div style="background:#fff3cd;padding:20px;border-radius:8px;margin-bottom:15px;">\n    <h3 style="color:#856404;margin:0 0 10px 0;font-size:16px;">📦 配送について</h3>\n    <p style="color:#856404;margin:0;font-size:14px;">送料無料でお届けします！ご注文確認後、3〜5営業日以内に発送いたします。</p>\n  </div>\n\n  <div style="background:#d4edda;padding:20px;border-radius:8px;">\n    <h3 style="color:#155724;margin:0 0 10px 0;font-size:16px;">✓ 安心保証</h3>\n    <p style="color:#155724;margin:0;font-size:14px;">商品は全て検品済み。万が一の不具合はお気軽にお問い合わせください。</p>\n  </div>\n</div>').trim();
            } else if (selectedTemplate === 'simple') {
                html = '\n<div style="max-width:700px;margin:0 auto;font-family:\'Hiragino Sans\',sans-serif;">\n  <h2 style="font-size:18px;border-bottom:2px solid #333;padding-bottom:8px;">'.concat(title, "</h2>\n  ").concat(mainImage ? '<img src="'.concat(mainImage, '" style="max-width:100%;margin:15px 0;">') : '', '\n  <p style="line-height:1.8;white-space:pre-wrap;">').concat(description, '</p>\n  <hr style="margin:20px 0;border:none;border-top:1px solid #ddd;">\n  <p style="font-size:12px;color:#666;">※送料無料 ※3〜5営業日以内に発送</p>\n</div>').trim();
            } else {
                // standard
                html = '\n<div style="max-width:800px;margin:0 auto;font-family:\'Hiragino Sans\',\'Yu Gothic\',sans-serif;">\n  <div style="background:linear-gradient(135deg,#ff0066,#ff6699);padding:20px;border-radius:8px;margin-bottom:20px;text-align:center;">\n    <h1 style="color:white;font-size:24px;margin:0;">'.concat(title, "</h1>\n    ").concat(brand ? '<p style="color:rgba(255,255,255,0.9);margin-top:10px;font-size:13px;">【'.concat(brand, "】</p>") : '', "\n  </div>\n  ").concat(mainImage ? '\n  <div style="text-align:center;margin-bottom:20px;">\n    <img src="'.concat(mainImage, '" alt="').concat(title, '" style="max-width:100%;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">\n  </div>\n  ') : '', '\n  <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">\n    <h2 style="color:#333;font-size:18px;border-bottom:2px solid #ff0066;padding-bottom:10px;margin:0 0 15px 0;">商品説明</h2>\n    <p style="color:#555;line-height:1.8;white-space:pre-wrap;margin:0;">').concat(description, '</p>\n  </div>\n  <div style="background:#fff3cd;padding:15px;border-radius:8px;margin-bottom:15px;">\n    <p style="color:#856404;margin:0;font-size:13px;">📦 送料無料でお届け！3〜5営業日以内に発送いたします。</p>\n  </div>\n  <div style="background:#f8f9fa;padding:15px;border-radius:8px;">\n    <p style="color:#666;margin:0;font-size:13px;">📞 返品・交換はお気軽にお問い合わせください。</p>\n  </div>\n</div>').trim();
            }
            setHtmlContent(html);
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('HTMLを生成しました');
        }
    }["TabHTMLDomestic.useCallback[generateHtml]"], [
        productData,
        selectedTemplate
    ]);
    // 保存
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabHTMLDomestic.useCallback[handleSave]": ()=>{
            onSave === null || onSave === void 0 ? void 0 : onSave({
                html_description: htmlContent,
                qoo10_html: htmlContent
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('HTML説明文を保存しました');
        }
    }["TabHTMLDomestic.useCallback[handleSave]"], [
        htmlContent,
        onSave
    ]);
    // コピー
    const handleCopy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabHTMLDomestic.useCallback[handleCopy]": ()=>{
            navigator.clipboard.writeText(htmlContent);
            __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('HTMLをクリップボードにコピーしました');
        }
    }["TabHTMLDomestic.useCallback[handleCopy]"], [
        htmlContent
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
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
            lineNumber: 169,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '1rem',
            overflow: 'auto',
            background: T.bg,
            height: '100%'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: "linear-gradient(135deg, ".concat(T.accent, ", #ff6699)"),
                    borderRadius: '6px'
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
                                className: "fas fa-code",
                                style: {
                                    color: 'white'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '14px'
                                },
                                children: "Qoo10用 HTML説明文"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleCopy,
                                style: {
                                    padding: '0.375rem 0.75rem',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    cursor: 'pointer'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-copy"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                        lineNumber: 181,
                                        columnNumber: 224
                                    }, this),
                                    " コピー"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSave,
                                style: {
                                    padding: '0.375rem 0.75rem',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: 'white',
                                    color: T.accent,
                                    cursor: 'pointer'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-save"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                        lineNumber: 182,
                                        columnNumber: 209
                                    }, this),
                                    " 保存"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    height: 'calc(100% - 70px)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            overflow: 'auto'
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
                                            marginBottom: '0.5rem'
                                        },
                                        children: "テンプレート"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                        lineNumber: 191,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: '0.5rem'
                                        },
                                        children: Object.entries(TEMPLATES).map((param)=>{
                                            let [key, tmpl] = param;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSelectedTemplate(key),
                                                style: {
                                                    flex: 1,
                                                    padding: '0.5rem',
                                                    borderRadius: '4px',
                                                    border: "2px solid ".concat(selectedTemplate === key ? T.accent : T.panelBorder),
                                                    background: selectedTemplate === key ? "".concat(T.accent, "10") : 'white',
                                                    cursor: 'pointer',
                                                    textAlign: 'center'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            color: selectedTemplate === key ? T.accent : T.text
                                                        },
                                                        children: tmpl.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                                        lineNumber: 195,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: '9px',
                                                            color: T.textMuted
                                                        },
                                                        children: tmpl.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, key, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                                lineNumber: 194,
                                                columnNumber: 17
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                        lineNumber: 192,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                lineNumber: 190,
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
                                        children: "特徴ポイント（3点）"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this),
                                    productData.features.map((feature, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: feature,
                                            onChange: (e)=>{
                                                const newFeatures = [
                                                    ...productData.features
                                                ];
                                                newFeatures[i] = e.target.value;
                                                setProductData((prev)=>({
                                                        ...prev,
                                                        features: newFeatures
                                                    }));
                                            },
                                            placeholder: "特徴".concat(i + 1),
                                            style: {
                                                width: '100%',
                                                padding: '0.375rem 0.5rem',
                                                fontSize: '11px',
                                                borderRadius: '4px',
                                                border: "1px solid ".concat(T.panelBorder),
                                                background: T.panel,
                                                color: T.text,
                                                marginBottom: '0.375rem'
                                            }
                                        }, i, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                            lineNumber: 206,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: generateHtml,
                                style: {
                                    padding: '0.75rem',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: T.blue,
                                    color: 'white',
                                    cursor: 'pointer'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-magic"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                        lineNumber: 211,
                                        columnNumber: 200
                                    }, this),
                                    " HTML生成"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    background: T.panel,
                                    borderRadius: '6px',
                                    border: "1px solid ".concat(T.panelBorder),
                                    padding: '0.75rem',
                                    display: 'flex',
                                    flexDirection: 'column'
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
                                        children: "HTMLコード"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                        lineNumber: 215,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: htmlContent,
                                        onChange: (e)=>setHtmlContent(e.target.value),
                                        style: {
                                            flex: 1,
                                            width: '100%',
                                            padding: '0.5rem',
                                            fontSize: '10px',
                                            fontFamily: 'monospace',
                                            borderRadius: '4px',
                                            border: "1px solid ".concat(T.panelBorder),
                                            background: '#1e1e1e',
                                            color: '#d4d4d4',
                                            resize: 'none'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                        lineNumber: 216,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                lineNumber: 214,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: T.panel,
                            borderRadius: '6px',
                            border: "1px solid ".concat(T.panelBorder),
                            padding: '0.75rem',
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
                                children: "プレビュー"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, this),
                            htmlContent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: 'white',
                                    padding: '1rem',
                                    borderRadius: '4px',
                                    border: "1px solid ".concat(T.panelBorder)
                                },
                                dangerouslySetInnerHTML: {
                                    __html: htmlContent
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                lineNumber: 224,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'center',
                                    color: T.textMuted,
                                    padding: '3rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-code",
                                        style: {
                                            fontSize: '32px',
                                            marginBottom: '0.5rem'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                        lineNumber: 227,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: "HTMLを生成してください"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx",
        lineNumber: 173,
        columnNumber: 5
    }, this);
}
_s(TabHTMLDomestic, "tR5bqA8W1lsvgSCv7vOSUA2Fp48=");
_c = TabHTMLDomestic;
const __TURBOPACK__default__export__ = TabHTMLDomestic;
var _c;
__turbopack_context__.k.register(_c, "TabHTMLDomestic");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=2fac6_vps_components_product-modal_components_Tabs_tab-html-domestic_tsx_494da3c6._.js.map