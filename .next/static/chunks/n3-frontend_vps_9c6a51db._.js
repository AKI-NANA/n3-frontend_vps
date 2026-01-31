(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/lib/supabase.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * @deprecated このファイルは廃止予定です。代わりに '@/lib/supabase/client' を使用してください。
 * このファイルは既存のインポートとの互換性のために残されています。
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/client.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabHTML",
    ()=>TabHTML
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// TabHTML - V8.4
// デザインシステムV4準拠 + 元の機能完全復元
// 機能: DBからテンプレート取得、プレースホルダー置換、生成HTML保存/更新
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/client.ts [app-client] (ecmascript)");
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
    error: '#ef4444'
};
// プレースホルダーを商品データで置換
function replacePlaceholders(template, productData) {
    var _productData_scraped_data;
    const listingData = (productData === null || productData === void 0 ? void 0 : productData.listing_data) || {};
    // 🔥 英語データを優先
    let titleEn = (productData === null || productData === void 0 ? void 0 : productData.english_title) || (productData === null || productData === void 0 ? void 0 : productData.title) || 'N/A';
    let descriptionEn = (productData === null || productData === void 0 ? void 0 : productData.english_description) || (productData === null || productData === void 0 ? void 0 : productData.description) || '';
    let conditionEn = (productData === null || productData === void 0 ? void 0 : productData.english_condition) || listingData.condition || 'Used';
    // 商品説明が空または短い場合は自動生成
    if (!descriptionEn || descriptionEn === 'なし' || descriptionEn.length < 10) {
        var _productData_scraped_data1;
        const parts = [
            titleEn,
            (productData === null || productData === void 0 ? void 0 : (_productData_scraped_data1 = productData.scraped_data) === null || _productData_scraped_data1 === void 0 ? void 0 : _productData_scraped_data1.brand) ? "Brand: ".concat(productData.scraped_data.brand) : '',
            "Condition: ".concat(conditionEn),
            'Authentic product imported from Japan.',
            'Ships worldwide with tracking number.',
            'Please check the photos carefully before purchasing.'
        ].filter(Boolean);
        descriptionEn = parts.join('\n\n');
    }
    return template.replace(/\{\{TITLE\}\}/g, titleEn).replace(/\{\{CONDITION\}\}/g, conditionEn).replace(/\{\{LANGUAGE\}\}/g, 'Japanese').replace(/\{\{RARITY\}\}/g, 'Rare').replace(/\{\{DESCRIPTION\}\}/g, descriptionEn).replace(/\{\{PRICE\}\}/g, String((productData === null || productData === void 0 ? void 0 : productData.price_usd) || (productData === null || productData === void 0 ? void 0 : productData.price) || '0')).replace(/\{\{BRAND\}\}/g, (productData === null || productData === void 0 ? void 0 : productData.brand) || (productData === null || productData === void 0 ? void 0 : (_productData_scraped_data = productData.scraped_data) === null || _productData_scraped_data === void 0 ? void 0 : _productData_scraped_data.brand) || 'N/A').replace(/\{\{SHIPPING_INFO\}\}/g, listingData.shipping_info || 'Standard International Shipping').replace(/\{\{FEATURES\}\}/g, 'See description').replace(/\{\{SPECIFICATIONS\}\}/g, 'See description').replace(/\{\{NOTES\}\}/g, '').replace(/\{\{SERIAL_NUMBER\}\}/g, (productData === null || productData === void 0 ? void 0 : productData.sku) || 'N/A').replace(/\{\{SKU\}\}/g, (productData === null || productData === void 0 ? void 0 : productData.sku) || 'N/A').replace(/\{\{RETURN_POLICY\}\}/g, '30 days money-back guarantee');
}
function TabHTML(param) {
    let { product } = param;
    _s();
    const [htmlContent, setHtmlContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [editMode, setEditMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [template, setTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [generatedHtml, setGeneratedHtml] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [saveStatus, setSaveStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // テンプレート取得 & HTML生成・保存
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabHTML.useEffect": ()=>{
            const generateAndSaveHTML = {
                "TabHTML.useEffect.generateAndSaveHTML": async ()=>{
                    if (!(product === null || product === void 0 ? void 0 : product.id) || !(product === null || product === void 0 ? void 0 : product.sku)) {
                        setIsLoading(false);
                        return;
                    }
                    try {
                        var _template_data_languages_en_US, _template_data_languages;
                        setIsLoading(true);
                        setError('');
                        setSaveStatus('テンプレートを読み込み中...');
                        // ステップ1: 既に生成済みのHTMLがあるか確認
                        let existingHtml = null;
                        try {
                            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('product_html_generated').select('*').eq('products_master_id', product.id).eq('marketplace', 'ebay').maybeSingle();
                            if (data && !error) {
                                existingHtml = data;
                            }
                        } catch (err) {
                            console.log('⚠️ 既存HTML取得時のエラー:', err);
                        }
                        if (existingHtml) {
                            setTemplate(existingHtml);
                            setGeneratedHtml(existingHtml);
                            setHtmlContent(existingHtml.generated_html || '');
                            setSaveStatus('✓ 既存データを読み込みました');
                            setIsLoading(false);
                            return;
                        }
                        // ステップ2: デフォルトテンプレートを取得
                        setSaveStatus('テンプレートを検索中...');
                        let template_data = null;
                        try {
                            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('html_templates').select('*').eq('is_default_preview', true).maybeSingle();
                            if (data && !error) {
                                template_data = data;
                            }
                        } catch (err) {
                            console.log('⚠️ デフォルトテンプレート取得エラー:', err);
                        }
                        // テンプレートが見つからない場合は基本HTMLを使用
                        if (!template_data) {
                            template_data = {
                                id: 'default',
                                name: 'Basic Template',
                                html_content: '\n              <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">\n                <h1 style="color: #333; font-size: 24px;">{{TITLE}}</h1>\n                <div style="margin: 20px 0;">\n                  <h2 style="font-size: 18px;">Product Details</h2>\n                  <p><strong>Condition:</strong> {{CONDITION}}</p>\n                  <p><strong>SKU:</strong> {{SKU}}</p>\n                  <p><strong>Brand:</strong> {{BRAND}}</p>\n                </div>\n                <div style="margin: 20px 0;">\n                  <h2 style="font-size: 18px;">Description</h2>\n                  <p>{{DESCRIPTION}}</p>\n                </div>\n                <div style="margin: 20px 0;">\n                  <h2 style="font-size: 18px;">Shipping Information</h2>\n                  <p>{{SHIPPING_INFO}}</p>\n                </div>\n                <div style="margin: 20px 0;">\n                  <h2 style="font-size: 18px;">Return Policy</h2>\n                  <p>{{RETURN_POLICY}}</p>\n                </div>\n              </div>\n            '
                            };
                        }
                        setTemplate(template_data);
                        // ステップ3: プレースホルダーを置換
                        setSaveStatus('HTMLを生成中...');
                        const htmlToUse = template_data.html_content || ((_template_data_languages = template_data.languages) === null || _template_data_languages === void 0 ? void 0 : (_template_data_languages_en_US = _template_data_languages.en_US) === null || _template_data_languages_en_US === void 0 ? void 0 : _template_data_languages_en_US.html_content) || '<p>No content</p>';
                        const generatedContent = replacePlaceholders(htmlToUse, product);
                        // ステップ4: 生成したHTMLをDBに保存
                        setSaveStatus('HTMLをデータベースに保存中...');
                        const htmlRecord = {
                            products_master_id: product.id,
                            sku: product.sku,
                            marketplace: 'ebay',
                            template_id: template_data.id || template_data.name,
                            template_name: template_data.name,
                            generated_html: generatedContent
                        };
                        const { data: savedHtml, error: saveError } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('product_html_generated').insert(htmlRecord).select().maybeSingle();
                        if (saveError) {
                            // 既に存在する場合は更新
                            const { data: updatedHtml, error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('product_html_generated').update({
                                generated_html: generatedContent,
                                template_id: template_data.id,
                                template_name: template_data.name,
                                updated_at: new Date().toISOString()
                            }).eq('products_master_id', product.id).eq('marketplace', 'ebay').select().maybeSingle();
                            if (updateError) throw updateError;
                            setGeneratedHtml(updatedHtml);
                        } else {
                            setGeneratedHtml(savedHtml);
                        }
                        setHtmlContent(generatedContent);
                        setSaveStatus('✓ HTMLを生成・保存しました');
                    } catch (err) {
                        console.error('❌ HTML生成エラー:', err);
                        setError('HTML生成に失敗しました');
                        setSaveStatus('');
                        setHtmlContent('<div style="padding: 20px; text-align: center; color: #d32f2f;"><h3>⚠️ HTML生成エラー</h3></div>');
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["TabHTML.useEffect.generateAndSaveHTML"];
            generateAndSaveHTML();
        }
    }["TabHTML.useEffect"], [
        product
    ]);
    const validateHtml = ()=>{
        const forbiddenTags = [
            '<script',
            '<iframe',
            '<form',
            '<object',
            '<embed'
        ];
        const forbiddenAttrs = [
            'onclick',
            'onload',
            'onerror',
            'onmouseover'
        ];
        const errors = [];
        forbiddenTags.forEach((tag)=>{
            if (htmlContent.toLowerCase().includes(tag)) errors.push("禁止タグ: ".concat(tag));
        });
        forbiddenAttrs.forEach((attr)=>{
            if (htmlContent.toLowerCase().includes(attr)) errors.push("禁止属性: ".concat(attr));
        });
        alert(errors.length === 0 ? '✓ バリデーション成功' : '✗ エラー:\n' + errors.join('\n'));
    };
    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(htmlContent).then(()=>alert('✓ コピーしました'));
    };
    const saveEditedHTML = async ()=>{
        if (!(product === null || product === void 0 ? void 0 : product.id) || !(generatedHtml === null || generatedHtml === void 0 ? void 0 : generatedHtml.id)) {
            alert('保存できません');
            return;
        }
        try {
            setSaveStatus('保存中...');
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('product_html_generated').update({
                generated_html: htmlContent,
                updated_at: new Date().toISOString()
            }).eq('id', generatedHtml.id);
            if (error) throw error;
            alert('✓ 保存しました');
            setSaveStatus('✓ 保存完了');
            setEditMode(false);
        } catch (err) {
            alert('保存失敗');
            setSaveStatus('');
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
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
            lineNumber: 262,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '1rem',
            background: T.bg,
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
        },
        children: [
            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '0.5rem 0.75rem',
                    background: "".concat(T.warning, "15"),
                    border: "1px solid ".concat(T.warning, "40"),
                    borderRadius: '6px',
                    fontSize: '10px',
                    color: T.warning
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas fa-spinner fa-spin",
                        style: {
                            marginRight: '0.25rem'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 270,
                        columnNumber: 11
                    }, this),
                    " ",
                    saveStatus || 'HTML生成中...'
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                lineNumber: 269,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '0.5rem 0.75rem',
                    background: "".concat(T.error, "15"),
                    border: "1px solid ".concat(T.error, "40"),
                    borderRadius: '6px',
                    fontSize: '10px',
                    color: T.error
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas fa-exclamation-circle",
                        style: {
                            marginRight: '0.25rem'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 275,
                        columnNumber: 11
                    }, this),
                    " ",
                    error
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                lineNumber: 274,
                columnNumber: 9
            }, this),
            saveStatus && !isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '0.5rem 0.75rem',
                    background: "".concat(T.success, "15"),
                    border: "1px solid ".concat(T.success, "40"),
                    borderRadius: '6px',
                    fontSize: '10px',
                    color: T.success
                },
                children: saveStatus
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                lineNumber: 279,
                columnNumber: 9
            }, this),
            !isLoading && template && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '0.5rem 0.75rem',
                    background: "".concat(T.accent, "15"),
                    border: "1px solid ".concat(T.accent, "40"),
                    borderRadius: '6px',
                    fontSize: '10px',
                    color: T.accent
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "📋 Template:"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 287,
                        columnNumber: 11
                    }, this),
                    " ",
                    template.name,
                    " | ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "SKU:"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 287,
                        columnNumber: 59
                    }, this),
                    " ",
                    product === null || product === void 0 ? void 0 : product.sku,
                    " | ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "ID:"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 287,
                        columnNumber: 98
                    }, this),
                    " ",
                    product === null || product === void 0 ? void 0 : product.id,
                    editMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            marginLeft: '0.5rem',
                            fontWeight: 600,
                            color: T.warning
                        },
                        children: "【編集中】"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 288,
                        columnNumber: 24
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                lineNumber: 286,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '0.375rem',
                    flexWrap: 'wrap'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                        onClick: validateHtml,
                        disabled: isLoading,
                        color: T.warning,
                        icon: "fa-check",
                        children: "バリデート"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                        onClick: copyToClipboard,
                        disabled: isLoading,
                        color: T.success,
                        icon: "fa-copy",
                        children: "コピー"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                        onClick: ()=>setEditMode(!editMode),
                        disabled: isLoading,
                        color: editMode ? T.error : T.accent,
                        icon: editMode ? 'fa-eye' : 'fa-edit',
                        children: editMode ? '表示に戻す' : '編集'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this),
                    editMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionBtn, {
                        onClick: saveEditedHTML,
                        disabled: isLoading,
                        color: T.success,
                        icon: "fa-save",
                        children: "保存"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                lineNumber: 293,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    minHeight: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '0.375rem 0.5rem',
                                    background: T.panel,
                                    borderRadius: '6px 6px 0 0',
                                    border: "1px solid ".concat(T.panelBorder),
                                    borderBottom: 'none',
                                    fontSize: '9px',
                                    fontWeight: 600,
                                    color: T.textSubtle
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-code",
                                        style: {
                                            marginRight: '0.25rem'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                                        lineNumber: 309,
                                        columnNumber: 13
                                    }, this),
                                    " ",
                                    editMode ? 'HTML編集' : 'HTMLソース'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                                lineNumber: 308,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: htmlContent,
                                onChange: (e)=>setHtmlContent(e.target.value),
                                readOnly: !editMode,
                                style: {
                                    flex: 1,
                                    padding: '0.5rem',
                                    fontSize: '10px',
                                    fontFamily: 'monospace',
                                    lineHeight: 1.5,
                                    borderRadius: '0 0 6px 6px',
                                    border: "1px solid ".concat(T.panelBorder),
                                    background: editMode ? T.panel : T.highlight,
                                    color: editMode ? T.text : T.textMuted,
                                    resize: 'none',
                                    minHeight: '200px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                                lineNumber: 311,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 307,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '0.375rem 0.5rem',
                                    background: T.panel,
                                    borderRadius: '6px 6px 0 0',
                                    border: "1px solid ".concat(T.panelBorder),
                                    borderBottom: 'none',
                                    fontSize: '9px',
                                    fontWeight: 600,
                                    color: T.textSubtle
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-eye",
                                        style: {
                                            marginRight: '0.25rem'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                                        lineNumber: 334,
                                        columnNumber: 13
                                    }, this),
                                    " プレビュー"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                                lineNumber: 333,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    padding: '0.5rem',
                                    borderRadius: '0 0 6px 6px',
                                    border: "1px solid ".concat(T.panelBorder),
                                    background: '#fff',
                                    overflow: 'auto',
                                    minHeight: '200px'
                                },
                                dangerouslySetInnerHTML: {
                                    __html: htmlContent || '<p style="color: #999; text-align: center;">HTMLが生成されていません</p>'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                lineNumber: 305,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: '0.5rem 0.75rem',
                    background: T.highlight,
                    borderRadius: '6px',
                    fontSize: '9px',
                    color: T.textMuted
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "仕組み:"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                        lineNumber: 353,
                        columnNumber: 9
                    }, this),
                    " products_master_idでマッピング → DBからテンプレート検索 → ",
                    '{{TITLE}}',
                    "等を商品データに置換 → product_html_generatedに保存"
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                lineNumber: 352,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
        lineNumber: 266,
        columnNumber: 5
    }, this);
}
_s(TabHTML, "agTiJb/qW24NuMqlz5FDekE+NV8=");
_c = TabHTML;
function ActionBtn(param) {
    let { onClick, disabled, color, icon, children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        disabled: disabled,
        style: {
            padding: '0.375rem 0.5rem',
            fontSize: '10px',
            fontWeight: 500,
            borderRadius: '4px',
            border: 'none',
            background: color,
            color: '#fff',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                className: "fas ".concat(icon),
                style: {
                    marginRight: '0.25rem'
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
                lineNumber: 376,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx",
        lineNumber: 361,
        columnNumber: 5
    }, this);
}
_c1 = ActionBtn;
var _c, _c1;
__turbopack_context__.k.register(_c, "TabHTML");
__turbopack_context__.k.register(_c1, "ActionBtn");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_9c6a51db._.js.map