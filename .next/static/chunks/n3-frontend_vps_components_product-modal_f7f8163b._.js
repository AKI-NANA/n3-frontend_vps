(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/product-modal/hooks/use-auto-save.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAutoSave",
    ()=>useAutoSave
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useAutoSave(productId, onSave) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    _s();
    const { debounceMs = 2000, showToast = true } = options;
    const [unsavedChanges, setUnsavedChanges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastSavedAt, setLastSavedAt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const changesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const performSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutoSave.useCallback[performSave]": async ()=>{
            if (Object.keys(changesRef.current).length === 0) {
                return;
            }
            setSaving(true);
            try {
                await onSave(changesRef.current);
                setUnsavedChanges(false);
                setLastSavedAt(new Date());
                changesRef.current = {};
                if (showToast) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('自動保存しました', {
                        duration: 1500,
                        style: {
                            background: '#10b981',
                            color: '#ffffff'
                        }
                    });
                }
            } catch (error) {
                console.error('Auto-save error:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("保存に失敗しました: ".concat(error.message), {
                    duration: 3000
                });
            } finally{
                setSaving(false);
            }
        }
    }["useAutoSave.useCallback[performSave]"], [
        onSave,
        showToast
    ]);
    const handleFieldChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutoSave.useCallback[handleFieldChange]": (field, value)=>{
            // 変更を記録
            changesRef.current[field] = value;
            setUnsavedChanges(true);
            // 既存のタイマーをクリア
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            // debounce後に自動保存
            timerRef.current = setTimeout({
                "useAutoSave.useCallback[handleFieldChange]": ()=>{
                    performSave();
                }
            }["useAutoSave.useCallback[handleFieldChange]"], debounceMs);
        }
    }["useAutoSave.useCallback[handleFieldChange]"], [
        debounceMs,
        performSave
    ]);
    const handleBatchChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutoSave.useCallback[handleBatchChange]": (updates)=>{
            // 複数フィールドを一度に変更
            Object.entries(updates).forEach({
                "useAutoSave.useCallback[handleBatchChange]": (param)=>{
                    let [field, value] = param;
                    changesRef.current[field] = value;
                }
            }["useAutoSave.useCallback[handleBatchChange]"]);
            setUnsavedChanges(true);
            // 既存のタイマーをクリア
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            // debounce後に自動保存
            timerRef.current = setTimeout({
                "useAutoSave.useCallback[handleBatchChange]": ()=>{
                    performSave();
                }
            }["useAutoSave.useCallback[handleBatchChange]"], debounceMs);
        }
    }["useAutoSave.useCallback[handleBatchChange]"], [
        debounceMs,
        performSave
    ]);
    const forceSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutoSave.useCallback[forceSave]": async ()=>{
            // タイマーをクリアして即座に保存
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            await performSave();
        }
    }["useAutoSave.useCallback[forceSave]"], [
        performSave
    ]);
    const checkUnsavedChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutoSave.useCallback[checkUnsavedChanges]": ()=>{
            if (unsavedChanges) {
                return window.confirm('未保存の変更があります。保存せずに閉じますか？');
            }
            return true;
        }
    }["useAutoSave.useCallback[checkUnsavedChanges]"], [
        unsavedChanges
    ]);
    const resetChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAutoSave.useCallback[resetChanges]": ()=>{
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            changesRef.current = {};
            setUnsavedChanges(false);
        }
    }["useAutoSave.useCallback[resetChanges]"], []);
    // クリーンアップ
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAutoSave.useEffect": ()=>{
            return ({
                "useAutoSave.useEffect": ()=>{
                    if (timerRef.current) {
                        clearTimeout(timerRef.current);
                    }
                }
            })["useAutoSave.useEffect"];
        }
    }["useAutoSave.useEffect"], []);
    // 保存状態の文字列
    const saveStatus = saving ? '保存中...' : unsavedChanges ? '未保存' : lastSavedAt ? "保存済み (".concat(lastSavedAt.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit'
    }), ")") : '';
    return {
        handleFieldChange,
        handleBatchChange,
        forceSave,
        unsavedChanges,
        saving,
        checkUnsavedChanges,
        resetChanges,
        saveStatus,
        lastSavedAt
    };
}
_s(useAutoSave, "2IjSOzv+DUDpXdHNHkIjFM8h5bw=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModalHeader",
    ()=>ModalHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ModalHeader - V8.4 - 最適化版
// デザインシステムV4準拠、コンパクトヘッダー
// MODAL_BAR_01_HEADER - 情報表示バー
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const ModalHeader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function ModalHeader(param) {
    let { product, onClose, language = 'ja', onLanguageChange } = param;
    var _this, _this1;
    const displayTitle = language === 'en' ? ((_this = product) === null || _this === void 0 ? void 0 : _this.english_title) || ((_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.title_en) || (product === null || product === void 0 ? void 0 : product.title) || 'Loading...' : (product === null || product === void 0 ? void 0 : product.title) || 'データ読み込み中...';
    const sku = (product === null || product === void 0 ? void 0 : product.sku) || '-';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        style: {
            background: '#f1f5f9',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    minWidth: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            padding: '0.125rem 0.5rem',
                            fontSize: '10px',
                            fontWeight: 600,
                            borderRadius: '9999px',
                            background: '#10b98120',
                            color: '#10b981'
                        },
                        children: "Active"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontFamily: 'monospace',
                            fontSize: '11px',
                            color: '#64748b'
                        },
                        children: sku
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontWeight: 600,
                            fontSize: '13px',
                            color: '#1e293b',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '400px'
                        },
                        children: displayTitle
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                },
                children: [
                    onLanguageChange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            padding: '2px',
                            borderRadius: '6px',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onLanguageChange('ja'),
                                style: {
                                    padding: '0.25rem 0.5rem',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: language === 'ja' ? '#1e293b' : 'transparent',
                                    color: language === 'ja' ? '#ffffff' : '#64748b',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                },
                                children: "日本語"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>onLanguageChange('en'),
                                style: {
                                    padding: '0.25rem 0.5rem',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: language === 'en' ? '#1e293b' : 'transparent',
                                    color: language === 'en' ? '#ffffff' : '#64748b',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                },
                                children: "EN"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx",
                                lineNumber: 93,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        "aria-label": "閉じる",
                        style: {
                            padding: '0.375rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            fontSize: '14px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease'
                        },
                        onMouseEnter: (e)=>{
                            e.currentTarget.style.background = '#f1f5f9';
                            e.currentTarget.style.color = '#1e293b';
                        },
                        onMouseLeave: (e)=>{
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#64748b';
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                            className: "fas fa-times"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx",
                            lineNumber: 138,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
});
_c1 = ModalHeader;
var _c, _c1;
__turbopack_context__.k.register(_c, "ModalHeader$memo");
__turbopack_context__.k.register(_c1, "ModalHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DOMESTIC_MARKETPLACE_IDS",
    ()=>DOMESTIC_MARKETPLACE_IDS,
    "MARKETPLACE_CONFIG",
    ()=>MARKETPLACE_CONFIG,
    "MarketplaceSelector",
    ()=>MarketplaceSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// MarketplaceSelector - V8.7 - 最適化版
// デザインシステムV4準拠 + プルダウン形式でコンパクト
// MODAL_BAR_02_CONTEXT - コンテキスト選択バー
// 日本セラー向け越境EC + 国内マーケットプレイス
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
// マーケットプレイス定義
const MARKETPLACE_GROUPS = {
    'eBay': [
        {
            id: 'ebay-us',
            name: 'eBay US',
            color: '#0064d2'
        },
        {
            id: 'ebay-uk',
            name: 'eBay UK',
            color: '#0064d2'
        },
        {
            id: 'ebay-de',
            name: 'eBay DE',
            color: '#0064d2'
        },
        {
            id: 'ebay-au',
            name: 'eBay AU',
            color: '#0064d2'
        }
    ],
    'Amazon': [
        {
            id: 'amazon-us',
            name: 'Amazon US',
            color: '#ff9900'
        },
        {
            id: 'amazon-uk',
            name: 'Amazon UK',
            color: '#ff9900'
        },
        {
            id: 'amazon-de',
            name: 'Amazon DE',
            color: '#ff9900'
        },
        {
            id: 'amazon-fr',
            name: 'Amazon FR',
            color: '#ff9900'
        },
        {
            id: 'amazon-au',
            name: 'Amazon AU',
            color: '#ff9900'
        },
        {
            id: 'amazon-ca',
            name: 'Amazon CA',
            color: '#ff9900'
        }
    ],
    'Shopee': [
        {
            id: 'shopee-sg',
            name: 'Shopee SG',
            color: '#ee4d2d'
        },
        {
            id: 'shopee-my',
            name: 'Shopee MY',
            color: '#ee4d2d'
        },
        {
            id: 'shopee-ph',
            name: 'Shopee PH',
            color: '#ee4d2d'
        },
        {
            id: 'shopee-th',
            name: 'Shopee TH',
            color: '#ee4d2d'
        },
        {
            id: 'shopee-vn',
            name: 'Shopee VN',
            color: '#ee4d2d'
        },
        {
            id: 'shopee-id',
            name: 'Shopee ID',
            color: '#ee4d2d'
        },
        {
            id: 'shopee-tw',
            name: 'Shopee TW',
            color: '#ee4d2d'
        },
        {
            id: 'shopee-br',
            name: 'Shopee BR',
            color: '#ee4d2d'
        }
    ],
    'Lazada': [
        {
            id: 'lazada-sg',
            name: 'Lazada SG',
            color: '#0f146d'
        },
        {
            id: 'lazada-my',
            name: 'Lazada MY',
            color: '#0f146d'
        },
        {
            id: 'lazada-ph',
            name: 'Lazada PH',
            color: '#0f146d'
        },
        {
            id: 'lazada-th',
            name: 'Lazada TH',
            color: '#0f146d'
        },
        {
            id: 'lazada-vn',
            name: 'Lazada VN',
            color: '#0f146d'
        },
        {
            id: 'lazada-id',
            name: 'Lazada ID',
            color: '#0f146d'
        }
    ],
    'Fashion': [
        {
            id: 'etsy',
            name: 'Etsy',
            color: '#f56400'
        },
        {
            id: 'catawiki',
            name: 'Catawiki',
            color: '#ff6b00'
        },
        {
            id: 'grailed',
            name: 'Grailed',
            color: '#000000'
        },
        {
            id: 'stockx',
            name: 'StockX',
            color: '#006340'
        },
        {
            id: 'vinted',
            name: 'Vinted',
            color: '#09b1ba'
        },
        {
            id: 'depop',
            name: 'Depop',
            color: '#ff2300'
        },
        {
            id: 'poshmark',
            name: 'Poshmark',
            color: '#d42b76'
        }
    ],
    'その他': [
        {
            id: 'qoo10-sg',
            name: 'Qoo10 SG',
            color: '#e31937'
        },
        {
            id: 'coupang',
            name: 'Coupang',
            color: '#ff6600'
        },
        {
            id: 'mercari-us',
            name: 'Mercari US',
            color: '#ff0211'
        }
    ],
    '国内': [
        {
            id: 'yahoo-auction',
            name: 'ヤフオク',
            color: '#ff0033'
        },
        {
            id: 'yahoo-shopping',
            name: 'Yahoo!ショッピング',
            color: '#ff0033'
        },
        {
            id: 'yahoo-fleamarket',
            name: 'Yahooフリマ',
            color: '#ff0033'
        },
        {
            id: 'mercari-jp',
            name: 'メルカリ',
            color: '#ff0211'
        },
        {
            id: 'rakuten',
            name: '楽天市場',
            color: '#bf0000'
        },
        {
            id: 'qoo10-jp',
            name: 'Qoo10国内',
            color: '#ff0066'
        },
        {
            id: 'amazon-jp',
            name: 'Amazon日本',
            color: '#ff9900'
        },
        {
            id: 'rakuma',
            name: 'ラクマ',
            color: '#e91e63'
        },
        {
            id: 'base',
            name: 'BASE',
            color: '#000000'
        }
    ]
};
// 全マーケットプレイスをフラット化
const ALL_MARKETPLACES = Object.values(MARKETPLACE_GROUPS).flat();
const MarketplaceSelector = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function MarketplaceSelector(param) {
    let { current, onChange } = param;
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 現在選択中のマーケットプレイス
    const currentMp = ALL_MARKETPLACES.find((mp)=>mp.id === current) || ALL_MARKETPLACES[0];
    // クリック外で閉じる
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MarketplaceSelector.MarketplaceSelector.useEffect": ()=>{
            function handleClickOutside(event) {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            }
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "MarketplaceSelector.MarketplaceSelector.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
            })["MarketplaceSelector.MarketplaceSelector.useEffect"];
        }
    }["MarketplaceSelector.MarketplaceSelector.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: dropdownRef,
        style: {
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.375rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            position: 'relative'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: '9px',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase'
                },
                children: "Marketplace:"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                style: {
                    padding: '0.25rem 0.5rem',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: "2px solid ".concat(currentMp.color),
                    background: '#ffffff',
                    color: currentMp.color,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    minWidth: '140px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: currentMp.color
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    currentMp.name,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas fa-chevron-".concat(isOpen ? 'up' : 'down'),
                        style: {
                            marginLeft: 'auto',
                            fontSize: '9px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: '100%',
                    left: '75px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    minWidth: '500px',
                    maxHeight: '400px',
                    overflow: 'auto',
                    padding: '0.5rem'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.5rem'
                    },
                    children: Object.entries(MARKETPLACE_GROUPS).map((param)=>{
                        let [groupName, items] = param;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '9px',
                                        fontWeight: 700,
                                        color: '#64748b',
                                        textTransform: 'uppercase',
                                        padding: '0.25rem 0.5rem',
                                        borderBottom: '1px solid #e2e8f0',
                                        marginBottom: '0.25rem'
                                    },
                                    children: groupName
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
                                    lineNumber: 162,
                                    columnNumber: 17
                                }, this),
                                items.map((mp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            onChange(mp.id);
                                            setIsOpen(false);
                                        },
                                        style: {
                                            width: '100%',
                                            padding: '0.375rem 0.5rem',
                                            fontSize: '10px',
                                            fontWeight: current === mp.id ? 700 : 500,
                                            borderRadius: '3px',
                                            border: 'none',
                                            background: current === mp.id ? "".concat(mp.color, "15") : 'transparent',
                                            color: current === mp.id ? mp.color : '#374151',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.375rem',
                                            textAlign: 'left'
                                        },
                                        onMouseEnter: (e)=>{
                                            if (current !== mp.id) {
                                                e.currentTarget.style.background = '#f1f5f9';
                                            }
                                        },
                                        onMouseLeave: (e)=>{
                                            if (current !== mp.id) {
                                                e.currentTarget.style.background = 'transparent';
                                            }
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: mp.color,
                                                    flexShrink: 0
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
                                                lineNumber: 206,
                                                columnNumber: 21
                                            }, this),
                                            mp.name
                                        ]
                                    }, mp.id, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
                                        lineNumber: 174,
                                        columnNumber: 19
                                    }, this))
                            ]
                        }, groupName, true, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
                            lineNumber: 161,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
                    lineNumber: 159,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
                lineNumber: 144,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginLeft: '0.5rem',
                    display: 'flex',
                    gap: '0.25rem'
                },
                children: [
                    'ebay-us',
                    'amazon-us',
                    'yahoo-auction',
                    'mercari-jp'
                ].map((id)=>{
                    const mp = ALL_MARKETPLACES.find((m)=>m.id === id);
                    if (!mp) return null;
                    const isActive = current === mp.id;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onChange(mp.id),
                        title: mp.name,
                        style: {
                            padding: '0.2rem 0.4rem',
                            fontSize: '9px',
                            fontWeight: 600,
                            borderRadius: '3px',
                            border: "1px solid ".concat(isActive ? mp.color : '#e2e8f0'),
                            background: isActive ? mp.color : '#ffffff',
                            color: isActive ? '#ffffff' : '#64748b',
                            cursor: 'pointer'
                        },
                        children: mp.name.split(' ').pop()
                    }, mp.id, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
                        lineNumber: 229,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}, "uhOyve9TWk+bvhPJTPlaMsUEQAY=")), "uhOyve9TWk+bvhPJTPlaMsUEQAY=");
_c1 = MarketplaceSelector;
const MARKETPLACE_CONFIG = {
    // eBay
    'ebay-us': {
        name: 'eBay US',
        maxImages: 24,
        region: 'US',
        language: 'en'
    },
    'ebay-uk': {
        name: 'eBay UK',
        maxImages: 24,
        region: 'UK',
        language: 'en'
    },
    'ebay-de': {
        name: 'eBay DE',
        maxImages: 24,
        region: 'DE',
        language: 'en'
    },
    'ebay-au': {
        name: 'eBay AU',
        maxImages: 24,
        region: 'AU',
        language: 'en'
    },
    // Etsy / Catawiki
    'etsy': {
        name: 'Etsy',
        maxImages: 10,
        region: 'global',
        language: 'en'
    },
    'catawiki': {
        name: 'Catawiki',
        maxImages: 15,
        region: 'EU',
        language: 'en'
    },
    // Amazon
    'amazon-us': {
        name: 'Amazon US',
        maxImages: 9,
        region: 'US',
        language: 'en'
    },
    'amazon-uk': {
        name: 'Amazon UK',
        maxImages: 9,
        region: 'UK',
        language: 'en'
    },
    'amazon-de': {
        name: 'Amazon DE',
        maxImages: 9,
        region: 'DE',
        language: 'en'
    },
    'amazon-fr': {
        name: 'Amazon FR',
        maxImages: 9,
        region: 'FR',
        language: 'en'
    },
    'amazon-au': {
        name: 'Amazon AU',
        maxImages: 9,
        region: 'AU',
        language: 'en'
    },
    'amazon-ca': {
        name: 'Amazon CA',
        maxImages: 9,
        region: 'CA',
        language: 'en'
    },
    // Shopee
    'shopee-sg': {
        name: 'Shopee SG',
        maxImages: 9,
        region: 'SG',
        language: 'en'
    },
    'shopee-my': {
        name: 'Shopee MY',
        maxImages: 9,
        region: 'MY',
        language: 'en'
    },
    'shopee-ph': {
        name: 'Shopee PH',
        maxImages: 9,
        region: 'PH',
        language: 'en'
    },
    'shopee-th': {
        name: 'Shopee TH',
        maxImages: 9,
        region: 'TH',
        language: 'en'
    },
    'shopee-vn': {
        name: 'Shopee VN',
        maxImages: 9,
        region: 'VN',
        language: 'en'
    },
    'shopee-id': {
        name: 'Shopee ID',
        maxImages: 9,
        region: 'ID',
        language: 'en'
    },
    'shopee-tw': {
        name: 'Shopee TW',
        maxImages: 9,
        region: 'TW',
        language: 'en'
    },
    'shopee-br': {
        name: 'Shopee BR',
        maxImages: 9,
        region: 'BR',
        language: 'en'
    },
    // Lazada
    'lazada-sg': {
        name: 'Lazada SG',
        maxImages: 8,
        region: 'SG',
        language: 'en'
    },
    'lazada-my': {
        name: 'Lazada MY',
        maxImages: 8,
        region: 'MY',
        language: 'en'
    },
    'lazada-ph': {
        name: 'Lazada PH',
        maxImages: 8,
        region: 'PH',
        language: 'en'
    },
    'lazada-th': {
        name: 'Lazada TH',
        maxImages: 8,
        region: 'TH',
        language: 'en'
    },
    'lazada-vn': {
        name: 'Lazada VN',
        maxImages: 8,
        region: 'VN',
        language: 'en'
    },
    'lazada-id': {
        name: 'Lazada ID',
        maxImages: 8,
        region: 'ID',
        language: 'en'
    },
    // Qoo10
    'qoo10-sg': {
        name: 'Qoo10 SG',
        maxImages: 10,
        region: 'SG',
        language: 'en'
    },
    // 韓国
    'coupang': {
        name: 'Coupang',
        maxImages: 10,
        region: 'KR',
        language: 'en'
    },
    // ファッション
    'grailed': {
        name: 'Grailed',
        maxImages: 20,
        region: 'global',
        language: 'en'
    },
    'stockx': {
        name: 'StockX',
        maxImages: 12,
        region: 'global',
        language: 'en'
    },
    'vinted': {
        name: 'Vinted',
        maxImages: 20,
        region: 'EU',
        language: 'en'
    },
    'depop': {
        name: 'Depop',
        maxImages: 4,
        region: 'global',
        language: 'en'
    },
    'poshmark': {
        name: 'Poshmark',
        maxImages: 16,
        region: 'US',
        language: 'en'
    },
    'mercari-us': {
        name: 'Mercari US',
        maxImages: 12,
        region: 'US',
        language: 'en'
    },
    // 国内
    'yahoo-auction': {
        name: 'ヤフオク',
        maxImages: 10,
        region: 'JP',
        language: 'ja'
    },
    'yahoo-shopping': {
        name: 'Yahoo!ショッピング',
        maxImages: 20,
        region: 'JP',
        language: 'ja'
    },
    'yahoo-fleamarket': {
        name: 'Yahooフリマ',
        maxImages: 10,
        region: 'JP',
        language: 'ja'
    },
    'mercari-jp': {
        name: 'メルカリ',
        maxImages: 10,
        region: 'JP',
        language: 'ja'
    },
    'rakuten': {
        name: '楽天市場',
        maxImages: 20,
        region: 'JP',
        language: 'ja'
    },
    'qoo10-jp': {
        name: 'Qoo10国内',
        maxImages: 10,
        region: 'JP',
        language: 'ja'
    },
    'amazon-jp': {
        name: 'Amazon日本',
        maxImages: 9,
        region: 'JP',
        language: 'ja'
    },
    'rakuma': {
        name: 'ラクマ',
        maxImages: 10,
        region: 'JP',
        language: 'ja'
    },
    'base': {
        name: 'BASE',
        maxImages: 20,
        region: 'JP',
        language: 'ja'
    }
};
const DOMESTIC_MARKETPLACE_IDS = MARKETPLACE_GROUPS['国内'].map(_c2 = (mp)=>mp.id);
_c3 = DOMESTIC_MARKETPLACE_IDS;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "MarketplaceSelector$memo");
__turbopack_context__.k.register(_c1, "MarketplaceSelector");
__turbopack_context__.k.register(_c2, "DOMESTIC_MARKETPLACE_IDS$MARKETPLACE_GROUPS['国内'].map");
__turbopack_context__.k.register(_c3, "DOMESTIC_MARKETPLACE_IDS");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/components/tab-navigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabNavigation",
    ()=>TabNavigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// TabNavigation - V9.0 - 国内/海外タブ完全切り替え版
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$marketplace$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// 海外販路用タブ
const GLOBAL_TABS = [
    {
        id: 'overview',
        labelJa: '概要',
        labelEn: 'Overview',
        icon: 'fa-chart-pie'
    },
    {
        id: 'data',
        labelJa: 'データ',
        labelEn: 'Data',
        icon: 'fa-database'
    },
    {
        id: 'images',
        labelJa: '画像',
        labelEn: 'Images',
        icon: 'fa-images'
    },
    {
        id: 'tools',
        labelJa: 'ツール',
        labelEn: 'Tools',
        icon: 'fa-tools'
    },
    {
        id: 'mirror',
        labelJa: 'SM分析',
        labelEn: 'SM Analysis',
        icon: 'fa-search-dollar'
    },
    {
        id: 'competitors',
        labelJa: '競合',
        labelEn: 'Competitors',
        icon: 'fa-chart-bar'
    },
    {
        id: 'pricing',
        labelJa: '価格',
        labelEn: 'Pricing',
        icon: 'fa-dollar-sign'
    },
    {
        id: 'shipping',
        labelJa: '配送',
        labelEn: 'Shipping',
        icon: 'fa-shipping-fast'
    },
    {
        id: 'html',
        labelJa: 'HTML',
        labelEn: 'HTML',
        icon: 'fa-code'
    },
    {
        id: 'tax',
        labelJa: '関税',
        labelEn: 'Tax/Duty',
        icon: 'fa-balance-scale'
    },
    {
        id: 'final',
        labelJa: '確認',
        labelEn: 'Confirm',
        icon: 'fa-check-circle'
    },
    {
        id: 'multi-listing',
        labelJa: '多販路',
        labelEn: 'Multi',
        icon: 'fa-store'
    }
];
// 国内販路用タブ
const DOMESTIC_TABS = [
    {
        id: 'overview',
        labelJa: '概要',
        labelEn: 'Overview',
        icon: 'fa-chart-pie'
    },
    {
        id: 'data',
        labelJa: 'データ',
        labelEn: 'Data',
        icon: 'fa-database'
    },
    {
        id: 'images',
        labelJa: '画像',
        labelEn: 'Images',
        icon: 'fa-images'
    },
    {
        id: 'pricing',
        labelJa: '価格',
        labelEn: 'Pricing',
        icon: 'fa-yen-sign'
    },
    {
        id: 'qoo10',
        labelJa: 'Qoo10',
        labelEn: 'Qoo10',
        icon: 'fa-shopping-cart',
        marketplaces: [
            'qoo10-jp'
        ]
    },
    {
        id: 'shipping',
        labelJa: '配送',
        labelEn: 'Shipping',
        icon: 'fa-truck'
    },
    {
        id: 'html',
        labelJa: 'HTML',
        labelEn: 'HTML',
        icon: 'fa-code'
    },
    {
        id: 'final',
        labelJa: '確認',
        labelEn: 'Confirm',
        icon: 'fa-check-circle'
    },
    {
        id: 'multi-listing',
        labelJa: '多販路',
        labelEn: 'Multi',
        icon: 'fa-store'
    }
];
const TabNavigation = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function TabNavigation(param) {
    let { current, onChange, marketplace = 'ebay-us', isDomestic: isDomesticProp } = param;
    _s();
    const isDomestic = isDomesticProp !== null && isDomesticProp !== void 0 ? isDomesticProp : __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$marketplace$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DOMESTIC_MARKETPLACE_IDS"].includes(marketplace);
    const visibleTabs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabNavigation.TabNavigation.useMemo[visibleTabs]": ()=>{
            const baseTabs = isDomestic ? DOMESTIC_TABS : GLOBAL_TABS;
            return baseTabs.filter({
                "TabNavigation.TabNavigation.useMemo[visibleTabs]": (tab)=>{
                    var _tab_marketplaces;
                    if ((_tab_marketplaces = tab.marketplaces) === null || _tab_marketplaces === void 0 ? void 0 : _tab_marketplaces.length) return tab.marketplaces.includes(marketplace);
                    return true;
                }
            }["TabNavigation.TabNavigation.useMemo[visibleTabs]"]);
        }
    }["TabNavigation.TabNavigation.useMemo[visibleTabs]"], [
        isDomestic,
        marketplace
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        style: {
            display: 'flex',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            minHeight: '40px',
            maxHeight: '40px',
            overflowX: 'auto',
            overflowY: 'hidden',
            flexShrink: 0,
            padding: '0 0.5rem'
        },
        children: visibleTabs.map((tab)=>{
            const isActive = current === tab.id;
            const isQoo10 = tab.id === 'qoo10';
            const activeColor = isQoo10 ? '#ff0066' : isDomestic ? '#ff0066' : '#3b82f6';
            const label = isDomestic ? tab.labelJa : tab.labelEn;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onChange(tab.id),
                style: {
                    padding: '0.5rem 0.75rem',
                    fontSize: '10px',
                    fontWeight: 600,
                    color: isActive ? activeColor : '#64748b',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: "2px solid ".concat(isActive ? activeColor : 'transparent'),
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.125rem',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap'
                },
                onMouseEnter: (e)=>{
                    if (!isActive) e.currentTarget.style.color = '#1e293b';
                },
                onMouseLeave: (e)=>{
                    if (!isActive) e.currentTarget.style.color = '#64748b';
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas ".concat(tab.icon),
                        style: {
                            fontSize: '12px'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/tab-navigation.tsx",
                        lineNumber: 106,
                        columnNumber: 13
                    }, this),
                    label
                ]
            }, tab.id, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/tab-navigation.tsx",
                lineNumber: 84,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/tab-navigation.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}, "LUZ6uLayvcK0/Mxh7sFoCqhfh7M=")), "LUZ6uLayvcK0/Mxh7sFoCqhfh7M=");
_c1 = TabNavigation;
var _c, _c1;
__turbopack_context__.k.register(_c, "TabNavigation$memo");
__turbopack_context__.k.register(_c1, "TabNavigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModalFooter",
    ()=>ModalFooter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// ModalFooter - V8.4 - 最適化版
// デザインシステムV4準拠、コンパクトフッター
// MODAL_BAR_04_ACTIONS - 操作実行バー
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const ModalFooter = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function ModalFooter(param) {
    let { currentTab, onTabChange, onSave, onClose } = param;
    const tabs = [
        'overview',
        'data',
        'images',
        'tools',
        'mirror',
        'competitors',
        'pricing',
        'listing',
        'shipping',
        'tax',
        'html',
        'final'
    ];
    const currentIndex = tabs.indexOf(currentTab);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === tabs.length - 1;
    const handlePrev = ()=>{
        if (currentIndex > 0) onTabChange(tabs[currentIndex - 1]);
    };
    const handleNext = ()=>{
        if (currentIndex < tabs.length - 1) onTabChange(tabs[currentIndex + 1]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        style: {
            background: '#f1f5f9',
            borderTop: '1px solid #e2e8f0',
            padding: '0.5rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '10px',
                    color: '#94a3b8'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fas fa-clock",
                        style: {
                            marginRight: '0.25rem'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx",
                        lineNumber: 42,
                        columnNumber: 9
                    }, this),
                    "Last updated: ",
                    new Date().toLocaleDateString('ja-JP')
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                },
                children: [
                    !isFirst && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handlePrev,
                        style: {
                            padding: '0.375rem 0.75rem',
                            fontSize: '11px',
                            fontWeight: 500,
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0',
                            background: '#ffffff',
                            color: '#64748b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-chevron-left"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx",
                                lineNumber: 65,
                                columnNumber: 13
                            }, this),
                            " Prev"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this),
                    !isLast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleNext,
                        style: {
                            padding: '0.375rem 0.75rem',
                            fontSize: '11px',
                            fontWeight: 500,
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0',
                            background: '#ffffff',
                            color: '#64748b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        },
                        children: [
                            "Next ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-chevron-right"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx",
                                lineNumber: 86,
                                columnNumber: 18
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        style: {
                            padding: '0.375rem 0.75rem',
                            fontSize: '11px',
                            fontWeight: 500,
                            borderRadius: '4px',
                            border: 'none',
                            background: 'transparent',
                            color: '#64748b',
                            cursor: 'pointer'
                        },
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    onSave && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            console.log('💾 [ModalFooter] Save button clicked');
                            onSave();
                            // 保存後、少し待ってから閉じる
                            setTimeout(()=>{
                                onClose === null || onClose === void 0 ? void 0 : onClose();
                            }, 500);
                        },
                        style: {
                            padding: '0.375rem 0.75rem',
                            fontSize: '11px',
                            fontWeight: 500,
                            borderRadius: '4px',
                            border: 'none',
                            background: '#1e293b',
                            color: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-save"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this),
                            " Save"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
});
_c1 = ModalFooter;
var _c, _c1;
__turbopack_context__.k.register(_c, "ModalFooter$memo");
__turbopack_context__.k.register(_c1, "ModalFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/config/tab-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * タブ設定ファクトリー
 * components/product-modal/config/tab-config.ts
 * 
 * マーケットプレイスに応じてタブセットを動的に生成
 */ // =====================================================
// 型定義
// =====================================================
__turbopack_context__.s([
    "DOMESTIC_TABS",
    ()=>DOMESTIC_TABS,
    "GLOBAL_TABS",
    ()=>GLOBAL_TABS,
    "MARKETPLACE_CONFIGS",
    ()=>MARKETPLACE_CONFIGS,
    "QOO10_SPECIFIC_TAB",
    ()=>QOO10_SPECIFIC_TAB,
    "getMarketplaceConfig",
    ()=>getMarketplaceConfig,
    "getMarketplaceCurrency",
    ()=>getMarketplaceCurrency,
    "getMarketplaceLanguage",
    ()=>getMarketplaceLanguage,
    "getMarketplaceType",
    ()=>getMarketplaceType,
    "getMaxImages",
    ()=>getMaxImages,
    "getTabsForMarketplace",
    ()=>getTabsForMarketplace,
    "isDomesticMarketplace",
    ()=>isDomesticMarketplace
]);
const MARKETPLACE_CONFIGS = {
    // 海外販路（Global）
    'ebay-us': {
        id: 'ebay-us',
        name: 'eBay US',
        type: 'global',
        language: 'en',
        currency: 'USD',
        maxImages: 24,
        color: '#0064d2'
    },
    'ebay-uk': {
        id: 'ebay-uk',
        name: 'eBay UK',
        type: 'global',
        language: 'en',
        currency: 'GBP',
        maxImages: 24,
        color: '#0064d2'
    },
    'ebay-de': {
        id: 'ebay-de',
        name: 'eBay DE',
        type: 'global',
        language: 'en',
        currency: 'EUR',
        maxImages: 24,
        color: '#0064d2'
    },
    'ebay-au': {
        id: 'ebay-au',
        name: 'eBay AU',
        type: 'global',
        language: 'en',
        currency: 'AUD',
        maxImages: 24,
        color: '#0064d2'
    },
    'shopee-sg': {
        id: 'shopee-sg',
        name: 'Shopee SG',
        type: 'global',
        language: 'en',
        currency: 'SGD',
        maxImages: 9,
        color: '#ee4d2d'
    },
    // 国内販路（Domestic）
    'qoo10-jp': {
        id: 'qoo10-jp',
        name: 'Qoo10国内',
        type: 'domestic',
        language: 'ja',
        currency: 'JPY',
        maxImages: 10,
        color: '#ff0066'
    },
    'amazon-jp': {
        id: 'amazon-jp',
        name: 'Amazon JP',
        type: 'domestic',
        language: 'ja',
        currency: 'JPY',
        maxImages: 9,
        color: '#ff9900'
    },
    'yahoo-auction': {
        id: 'yahoo-auction',
        name: 'ヤフオク',
        type: 'domestic',
        language: 'ja',
        currency: 'JPY',
        maxImages: 10,
        color: '#ff0033'
    },
    'mercari': {
        id: 'mercari',
        name: 'メルカリ',
        type: 'domestic',
        language: 'ja',
        currency: 'JPY',
        maxImages: 10,
        color: '#ff2d55'
    }
};
const GLOBAL_TABS = [
    {
        id: 'overview',
        label: 'Overview',
        labelJa: '概要',
        icon: 'fa-home',
        component: 'TabOverview'
    },
    {
        id: 'data',
        label: 'Data',
        labelJa: 'データ',
        icon: 'fa-database',
        component: 'TabData'
    },
    {
        id: 'images',
        label: 'Images',
        labelJa: '画像',
        icon: 'fa-images',
        component: 'TabImages'
    },
    {
        id: 'tools',
        label: 'Tools',
        labelJa: 'ツール',
        icon: 'fa-tools',
        component: 'TabTools'
    },
    {
        id: 'mirror',
        label: 'SM Analysis',
        labelJa: 'SM分析',
        icon: 'fa-search-dollar',
        component: 'TabMirror'
    },
    {
        id: 'competitors',
        label: 'Competitors',
        labelJa: '競合',
        icon: 'fa-chart-line',
        component: 'TabCompetitors'
    },
    {
        id: 'pricing',
        label: 'Pricing',
        labelJa: '価格',
        icon: 'fa-dollar-sign',
        component: 'TabPricingStrategy'
    },
    {
        id: 'shipping',
        label: 'Shipping',
        labelJa: '配送',
        icon: 'fa-truck',
        component: 'TabShipping'
    },
    {
        id: 'html',
        label: 'HTML',
        labelJa: 'HTML',
        icon: 'fa-code',
        component: 'TabHTML'
    },
    {
        id: 'tax',
        label: 'Tax',
        labelJa: '税関',
        icon: 'fa-file-invoice',
        component: 'TabTaxCompliance'
    },
    {
        id: 'final',
        label: 'Confirm',
        labelJa: '確認',
        icon: 'fa-check-circle',
        component: 'TabFinal'
    },
    {
        id: 'multi-listing',
        label: 'Multi',
        labelJa: '多販路',
        icon: 'fa-layer-group',
        component: 'TabMultiListing'
    }
];
const DOMESTIC_TABS = [
    {
        id: 'overview',
        label: '概要',
        labelJa: '概要',
        icon: 'fa-home',
        component: 'TabOverview'
    },
    {
        id: 'data',
        label: 'データ',
        labelJa: 'データ',
        icon: 'fa-database',
        component: 'TabDataDomestic'
    },
    {
        id: 'images',
        label: '画像',
        labelJa: '画像',
        icon: 'fa-images',
        component: 'TabImagesDomestic'
    },
    {
        id: 'pricing',
        label: '価格',
        labelJa: '価格',
        icon: 'fa-yen-sign',
        component: 'TabPricingDomestic'
    },
    {
        id: 'shipping',
        label: '配送',
        labelJa: '配送',
        icon: 'fa-truck',
        component: 'TabShippingDomestic'
    },
    {
        id: 'html',
        label: 'HTML',
        labelJa: 'HTML',
        icon: 'fa-code',
        component: 'TabHTMLDomestic'
    },
    {
        id: 'final',
        label: '確認',
        labelJa: '確認',
        icon: 'fa-check-circle',
        component: 'TabFinalDomestic'
    },
    {
        id: 'multi-listing',
        label: '多販路',
        labelJa: '多販路',
        icon: 'fa-layer-group',
        component: 'TabMultiListing'
    }
];
const QOO10_SPECIFIC_TAB = {
    id: 'qoo10',
    label: 'Qoo10',
    labelJa: 'Qoo10',
    icon: 'fa-shopping-bag',
    component: 'TabQoo10'
};
function getMarketplaceType(marketplaceId) {
    var _MARKETPLACE_CONFIGS_marketplaceId;
    return ((_MARKETPLACE_CONFIGS_marketplaceId = MARKETPLACE_CONFIGS[marketplaceId]) === null || _MARKETPLACE_CONFIGS_marketplaceId === void 0 ? void 0 : _MARKETPLACE_CONFIGS_marketplaceId.type) || 'global';
}
function getTabsForMarketplace(marketplaceId) {
    const type = getMarketplaceType(marketplaceId);
    const baseTabs = type === 'domestic' ? [
        ...DOMESTIC_TABS
    ] : [
        ...GLOBAL_TABS
    ];
    // Qoo10の場合は専用タブを追加
    if (marketplaceId === 'qoo10-jp') {
        // 価格タブの後にQoo10タブを挿入
        const pricingIndex = baseTabs.findIndex((t)=>t.id === 'pricing');
        if (pricingIndex !== -1) {
            baseTabs.splice(pricingIndex + 1, 0, QOO10_SPECIFIC_TAB);
        }
    }
    return baseTabs;
}
function getMarketplaceConfig(marketplaceId) {
    return MARKETPLACE_CONFIGS[marketplaceId] || MARKETPLACE_CONFIGS['ebay-us'];
}
function isDomesticMarketplace(marketplaceId) {
    return getMarketplaceType(marketplaceId) === 'domestic';
}
function getMarketplaceLanguage(marketplaceId) {
    var _MARKETPLACE_CONFIGS_marketplaceId;
    return ((_MARKETPLACE_CONFIGS_marketplaceId = MARKETPLACE_CONFIGS[marketplaceId]) === null || _MARKETPLACE_CONFIGS_marketplaceId === void 0 ? void 0 : _MARKETPLACE_CONFIGS_marketplaceId.language) || 'en';
}
function getMarketplaceCurrency(marketplaceId) {
    var _MARKETPLACE_CONFIGS_marketplaceId;
    return ((_MARKETPLACE_CONFIGS_marketplaceId = MARKETPLACE_CONFIGS[marketplaceId]) === null || _MARKETPLACE_CONFIGS_marketplaceId === void 0 ? void 0 : _MARKETPLACE_CONFIGS_marketplaceId.currency) || 'USD';
}
function getMaxImages(marketplaceId) {
    var _MARKETPLACE_CONFIGS_marketplaceId;
    return ((_MARKETPLACE_CONFIGS_marketplaceId = MARKETPLACE_CONFIGS[marketplaceId]) === null || _MARKETPLACE_CONFIGS_marketplaceId === void 0 ? void 0 : _MARKETPLACE_CONFIGS_marketplaceId.maxImages) || 12;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FullFeaturedModal",
    ()=>FullFeaturedModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// FullFeaturedModal - V9.3 - 国内/海外タブ切り替え対応版
// デザインシステムV4 Sharp & Solid 完全準拠
// 全13タブ + 言語自動切替 + 海外/国内マーケットプレイス対応
// 最適化: タブ遅延ロード + useCallback + 自動保存
// V9.3: 国内販路（Qoo10等）用タブセット追加
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$hooks$2f$use$2d$auto$2d$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/product-modal/hooks/use-auto-save.ts [app-client] (ecmascript)");
// コアコンポーネント（必須）
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$modal$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/product-modal/components/modal-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$marketplace$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/product-modal/components/marketplace-selector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$tab$2d$navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/product-modal/components/tab-navigation.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$modal$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/product-modal/components/modal-footer.tsx [app-client] (ecmascript)");
// タブ設定
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$config$2f$tab$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/product-modal/config/tab-config.ts [app-client] (ecmascript)");
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
// タブの遅延ロード（海外用）
const TabOverview = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-overview.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabOverview
        })));
_c = TabOverview;
const TabData = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabData
        })));
_c1 = TabData;
const TabImages = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabImages
        })));
_c2 = TabImages;
const TabTools = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-tools.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabTools
        })));
_c3 = TabTools;
const TabMirror = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-mirror.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabMirror
        })));
_c4 = TabMirror;
const TabCompetitors = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-competitors.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabCompetitors
        })));
_c5 = TabCompetitors;
const TabPricingStrategy = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-strategy.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabPricingStrategy
        })));
_c6 = TabPricingStrategy;
const TabListing = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-listing.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabListing
        })));
_c7 = TabListing;
const TabShipping = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabShipping
        })));
_c8 = TabShipping;
const TabTaxCompliance = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-tax-compliance.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabTaxCompliance
        })));
_c9 = TabTaxCompliance;
const TabHTML = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabHTML
        })));
_c10 = TabHTML;
const TabFinal = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabFinal
        })));
_c11 = TabFinal;
const TabQoo10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-qoo10.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabQoo10
        })));
_c12 = TabQoo10;
const TabMultiListing = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-multi-listing.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabMultiListing
        })));
_c13 = TabMultiListing;
// タブの遅延ロード（国内用）
const TabDataDomestic = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-data-domestic.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabDataDomestic
        })));
_c14 = TabDataDomestic;
const TabImagesDomestic = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images-domestic.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabImagesDomestic
        })));
_c15 = TabImagesDomestic;
const TabPricingDomestic = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-pricing-domestic.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabPricingDomestic
        })));
_c16 = TabPricingDomestic;
const TabShippingDomestic = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-shipping-domestic.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabShippingDomestic
        })));
_c17 = TabShippingDomestic;
const TabHTMLDomestic = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-html-domestic.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabHTMLDomestic
        })));
_c18 = TabHTMLDomestic;
const TabFinalDomestic = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["lazy"])(()=>__turbopack_context__.A("[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-final-domestic.tsx [app-client] (ecmascript, async loader)").then((m)=>({
            default: m.TabFinalDomestic
        })));
_c19 = TabFinalDomestic;
function FullFeaturedModal(param) {
    let { isOpen, onClose, product, onSave, onRefresh } = param;
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('overview');
    const [marketplace, setMarketplace] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('ebay-us');
    const [language, setLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('en');
    const [refreshKey, setRefreshKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const mpConfig = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$marketplace$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MARKETPLACE_CONFIG"][marketplace] || __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$marketplace$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MARKETPLACE_CONFIG"]['ebay-us'];
    // 国内販路かどうか
    const isDomestic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FullFeaturedModal.useMemo[isDomestic]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$config$2f$tab$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDomesticMarketplace"])(marketplace)
    }["FullFeaturedModal.useMemo[isDomestic]"], [
        marketplace
    ]);
    // 自動保存フック
    const { handleFieldChange, handleBatchChange, forceSave, unsavedChanges, saving, checkUnsavedChanges, saveStatus } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$hooks$2f$use$2d$auto$2d$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutoSave"])((product === null || product === void 0 ? void 0 : product.id) || '', {
        "FullFeaturedModal.useAutoSave": async (updates)=>{
            const response = await fetch('/api/products/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: product === null || product === void 0 ? void 0 : product.id,
                    updates
                })
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.error || '保存に失敗しました');
            onSave === null || onSave === void 0 ? void 0 : onSave(updates);
        }
    }["FullFeaturedModal.useAutoSave"], {
        debounceMs: 2000,
        showToast: true
    });
    // マーケットプレイス変更時に言語を自動切り替え
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FullFeaturedModal.useEffect": ()=>{
            const config = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$marketplace$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MARKETPLACE_CONFIG"][marketplace];
            if (config) setLanguage(config.language);
        }
    }["FullFeaturedModal.useEffect"], [
        marketplace
    ]);
    // 保存ハンドラー
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FullFeaturedModal.useCallback[handleSave]": (updates)=>{
            if (typeof updates === 'object' && Object.keys(updates).length > 1) {
                handleBatchChange(updates);
            } else if (typeof updates === 'object') {
                const [field, value] = Object.entries(updates)[0];
                handleFieldChange(field, value);
            }
        }
    }["FullFeaturedModal.useCallback[handleSave]"], [
        handleFieldChange,
        handleBatchChange
    ]);
    // モーダルを閉じる
    const handleClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FullFeaturedModal.useCallback[handleClose]": ()=>{
            if (checkUnsavedChanges()) onClose();
        }
    }["FullFeaturedModal.useCallback[handleClose]"], [
        checkUnsavedChanges,
        onClose
    ]);
    // データ再読み込み
    const handleRefresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FullFeaturedModal.useCallback[handleRefresh]": ()=>{
            setRefreshKey({
                "FullFeaturedModal.useCallback[handleRefresh]": (prev)=>prev + 1
            }["FullFeaturedModal.useCallback[handleRefresh]"]);
            onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
        }
    }["FullFeaturedModal.useCallback[handleRefresh]"], [
        onRefresh
    ]);
    // タブコンテンツ（国内/海外で切り替え）
    const renderTabContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "FullFeaturedModal.useCallback[renderTabContent]": ()=>{
            const LoadingFallback = {
                "FullFeaturedModal.useCallback[renderTabContent].LoadingFallback": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '2rem',
                            textAlign: 'center',
                            color: '#64748b'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                                lineNumber: 121,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: '1rem',
                                    fontSize: '14px'
                                },
                                children: "読み込み中..."
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                                lineNumber: 122,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 120,
                        columnNumber: 7
                    }, this)
            }["FullFeaturedModal.useCallback[renderTabContent].LoadingFallback"];
            // === 国内販路（Qoo10, Amazon JP等） ===
            if (isDomestic) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                    fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingFallback, {}, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 129,
                        columnNumber: 29
                    }, void 0),
                    children: [
                        activeTab === 'overview' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabOverview, {
                            product: product,
                            marketplace: marketplace
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 130,
                            columnNumber: 40
                        }, this),
                        activeTab === 'data' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabDataDomestic, {
                            product: product,
                            marketplace: marketplace,
                            onSave: handleSave
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 131,
                            columnNumber: 36
                        }, this),
                        activeTab === 'images' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabImagesDomestic, {
                            product: product,
                            marketplace: marketplace,
                            onSave: handleSave
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 132,
                            columnNumber: 38
                        }, this),
                        activeTab === 'pricing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabPricingDomestic, {
                            product: product,
                            marketplace: marketplace,
                            onSave: handleSave
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 133,
                            columnNumber: 39
                        }, this),
                        activeTab === 'qoo10' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabQoo10, {
                            product: product,
                            onSave: handleSave
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 134,
                            columnNumber: 37
                        }, this),
                        activeTab === 'shipping' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabShippingDomestic, {
                            product: product,
                            marketplace: marketplace,
                            onSave: handleSave
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 135,
                            columnNumber: 40
                        }, this),
                        activeTab === 'html' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabHTMLDomestic, {
                            product: product,
                            marketplace: marketplace,
                            onSave: handleSave
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 136,
                            columnNumber: 36
                        }, this),
                        activeTab === 'final' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabFinalDomestic, {
                            product: product,
                            marketplace: marketplace,
                            onSave: handleSave
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 137,
                            columnNumber: 37
                        }, this),
                        activeTab === 'multi-listing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabMultiListing, {
                            product: product,
                            onSave: handleSave,
                            onRefresh: handleRefresh
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 138,
                            columnNumber: 45
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                    lineNumber: 129,
                    columnNumber: 9
                }, this);
            }
            // === 海外販路（eBay US/UK/DE等） ===
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingFallback, {}, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                    lineNumber: 145,
                    columnNumber: 27
                }, void 0),
                children: [
                    activeTab === 'overview' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabOverview, {
                        product: product,
                        marketplace: marketplace
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 146,
                        columnNumber: 38
                    }, this),
                    activeTab === 'data' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabData, {
                        product: product
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 147,
                        columnNumber: 34
                    }, this),
                    activeTab === 'images' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabImages, {
                        product: product,
                        maxImages: mpConfig.maxImages,
                        marketplace: marketplace,
                        onSave: handleSave,
                        onRefresh: handleRefresh
                    }, "images-".concat(refreshKey), false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 148,
                        columnNumber: 36
                    }, this),
                    activeTab === 'tools' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabTools, {
                        product: product,
                        onSave: handleSave,
                        onRefresh: handleRefresh
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 149,
                        columnNumber: 35
                    }, this),
                    activeTab === 'mirror' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabMirror, {
                        product: product
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 150,
                        columnNumber: 36
                    }, this),
                    activeTab === 'competitors' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabCompetitors, {
                        product: product
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 151,
                        columnNumber: 41
                    }, this),
                    activeTab === 'pricing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabPricingStrategy, {
                        product: product,
                        onTabChange: setActiveTab,
                        onSave: handleSave
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 152,
                        columnNumber: 37
                    }, this),
                    activeTab === 'qoo10' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabQoo10, {
                        product: product,
                        onSave: handleSave
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 153,
                        columnNumber: 35
                    }, this),
                    activeTab === 'listing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabListing, {
                        product: product,
                        marketplace: marketplace,
                        marketplaceName: mpConfig.name
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 154,
                        columnNumber: 37
                    }, this),
                    activeTab === 'shipping' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabShipping, {
                        product: product,
                        marketplace: marketplace,
                        marketplaceName: mpConfig.name
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 155,
                        columnNumber: 38
                    }, this),
                    activeTab === 'tax' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabTaxCompliance, {
                        product: product
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 156,
                        columnNumber: 33
                    }, this),
                    activeTab === 'html' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabHTML, {
                        product: product
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 157,
                        columnNumber: 34
                    }, this),
                    activeTab === 'final' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabFinal, {
                        product: product,
                        marketplace: marketplace,
                        marketplaceName: mpConfig.name,
                        onSave: handleSave
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 158,
                        columnNumber: 35
                    }, this),
                    activeTab === 'multi-listing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabMultiListing, {
                        product: product,
                        onSave: handleSave,
                        onRefresh: handleRefresh
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                        lineNumber: 159,
                        columnNumber: 43
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this);
        }
    }["FullFeaturedModal.useCallback[renderTabContent]"], [
        activeTab,
        product,
        marketplace,
        mpConfig.maxImages,
        mpConfig.name,
        handleSave,
        handleRefresh,
        isDomestic,
        refreshKey
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        open: isOpen,
        onOpenChange: (open)=>!open && handleClose(),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
                    style: {
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 9998
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                    lineNumber: 167,
                    columnNumber: 9
                }, this),
                isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                    "aria-describedby": undefined,
                    style: {
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '95vw',
                        maxWidth: '1600px',
                        height: '92vh',
                        maxHeight: '900px',
                        background: '#ffffff',
                        borderRadius: '8px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 9999
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
                            style: {
                                position: 'absolute',
                                width: '1px',
                                height: '1px',
                                padding: 0,
                                margin: '-1px',
                                overflow: 'hidden',
                                clip: 'rect(0, 0, 0, 0)',
                                whiteSpace: 'nowrap',
                                border: 0
                            },
                            children: "商品編集モーダル"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 197,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: 'relative'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$modal$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModalHeader"], {
                                    product: product,
                                    onClose: handleClose,
                                    language: language,
                                    onLanguageChange: setLanguage
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                                    lineNumber: 203,
                                    columnNumber: 15
                                }, this),
                                (saving || unsavedChanges || saveStatus) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        top: '12px',
                                        right: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '4px 12px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: 500,
                                        background: saving ? '#fef3c7' : unsavedChanges ? '#fee2e2' : '#dcfce7',
                                        color: saving ? '#92400e' : unsavedChanges ? '#991b1b' : '#166534',
                                        border: "1px solid ".concat(saving ? '#fcd34d' : unsavedChanges ? '#fca5a5' : '#86efac')
                                    },
                                    children: [
                                        saving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-spinner fa-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                                            lineNumber: 221,
                                            columnNumber: 30
                                        }, this),
                                        !saving && unsavedChanges && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-exclamation-circle"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                                            lineNumber: 222,
                                            columnNumber: 49
                                        }, this),
                                        !saving && !unsavedChanges && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-check-circle"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                                            lineNumber: 223,
                                            columnNumber: 50
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: saveStatus || (unsavedChanges ? '未保存' : '保存済み')
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                                            lineNumber: 224,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                                    lineNumber: 206,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$marketplace$2d$selector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MarketplaceSelector"], {
                            current: marketplace,
                            onChange: setMarketplace
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 229,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$tab$2d$navigation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabNavigation"], {
                            current: activeTab,
                            onChange: setActiveTab,
                            marketplace: marketplace,
                            isDomestic: isDomestic
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: 1,
                                minHeight: 0,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            },
                            children: renderTabContent()
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 232,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$components$2f$modal$2d$footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModalFooter"], {
                            currentTab: activeTab,
                            onTabChange: setActiveTab,
                            onSave: forceSave,
                            onClose: handleClose
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                            lineNumber: 236,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
                    lineNumber: 177,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
            lineNumber: 166,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/full-featured-modal.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
_s(FullFeaturedModal, "LZX38sxSClLPGtu1DVQy30XvJ1c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$product$2d$modal$2f$hooks$2f$use$2d$auto$2d$save$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAutoSave"]
    ];
});
_c20 = FullFeaturedModal;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19, _c20;
__turbopack_context__.k.register(_c, "TabOverview");
__turbopack_context__.k.register(_c1, "TabData");
__turbopack_context__.k.register(_c2, "TabImages");
__turbopack_context__.k.register(_c3, "TabTools");
__turbopack_context__.k.register(_c4, "TabMirror");
__turbopack_context__.k.register(_c5, "TabCompetitors");
__turbopack_context__.k.register(_c6, "TabPricingStrategy");
__turbopack_context__.k.register(_c7, "TabListing");
__turbopack_context__.k.register(_c8, "TabShipping");
__turbopack_context__.k.register(_c9, "TabTaxCompliance");
__turbopack_context__.k.register(_c10, "TabHTML");
__turbopack_context__.k.register(_c11, "TabFinal");
__turbopack_context__.k.register(_c12, "TabQoo10");
__turbopack_context__.k.register(_c13, "TabMultiListing");
__turbopack_context__.k.register(_c14, "TabDataDomestic");
__turbopack_context__.k.register(_c15, "TabImagesDomestic");
__turbopack_context__.k.register(_c16, "TabPricingDomestic");
__turbopack_context__.k.register(_c17, "TabShippingDomestic");
__turbopack_context__.k.register(_c18, "TabHTMLDomestic");
__turbopack_context__.k.register(_c19, "TabFinalDomestic");
__turbopack_context__.k.register(_c20, "FullFeaturedModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_components_product-modal_f7f8163b._.js.map