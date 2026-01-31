(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/app/tools/editing-n3/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/page.tsx
/**
 * Editing N3 Page - N3デザインシステム版エントリーポイント
 * 
 * ⚠️ P0タスク: 無限ループ停止ガード実装
 * 
 * 設計原則:
 * - Hooks層（ビジネスロジック）: tools/editing からそのまま参照
 * - Services層（API通信）: tools/editing からそのまま参照
 * - Types層（型定義）: tools/editing からそのまま参照
 * - UI層（コンポーネント）: N3コンポーネントで再構築
 * 
 * 無限ループ対策（P0）:
 * - mountCountRef: マウント回数を物理的にカウント
 * - 閾値超過時は即座にレンダリングを停止
 */ __turbopack_context__.s([
    "default",
    ()=>EditingN3Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$layouts$2f$editing$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// ============================================================
// 無限ループ検知設定
// ============================================================
const LOOP_DETECTION = {
    // マウント回数の閾値（10秒以内）
    MOUNT_THRESHOLD: 10,
    // マウントカウントリセット間隔（ms）
    MOUNT_RESET_INTERVAL: 10000
};
// レンダーカウント（デバッグ用）
let renderCount = 0;
function EditingN3Page() {
    _s();
    // デバッグ: レンダー回数をカウント（開発環境のみ）
    renderCount++;
    if ("TURBOPACK compile-time truthy", 1) {
        console.log("[EditingN3Page] RENDER #".concat(renderCount, " at ").concat(new Date().toISOString().substring(11, 23)));
    }
    // 無限ループ検知用
    const mountCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const [blocked, setBlocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditingN3Page.useEffect": ()=>{
            mountCountRef.current++;
            if ("TURBOPACK compile-time truthy", 1) {
                console.log("[EditingN3Page] MOUNT #".concat(mountCountRef.current));
            }
            // 10秒以内に10回以上マウントされたら無限ループと判断
            if (mountCountRef.current > LOOP_DETECTION.MOUNT_THRESHOLD) {
                console.error('[EditingN3Page] 🚨 無限ループ検知! レンダリング停止');
                setBlocked(true);
                return;
            }
            // 10秒後にカウントリセット
            const timer = setTimeout({
                "EditingN3Page.useEffect.timer": ()=>{
                    mountCountRef.current = 0;
                }
            }["EditingN3Page.useEffect.timer"], LOOP_DETECTION.MOUNT_RESET_INTERVAL);
            return ({
                "EditingN3Page.useEffect": ()=>{
                    clearTimeout(timer);
                    if ("TURBOPACK compile-time truthy", 1) {
                        console.log("[EditingN3Page] UNMOUNT");
                    }
                }
            })["EditingN3Page.useEffect"];
        }
    }["EditingN3Page.useEffect"], []);
    if (blocked) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '2rem',
                textAlign: 'center',
                background: '#0a0a0a',
                color: 'white',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    style: {
                        color: '#ff4444',
                        marginBottom: '1rem',
                        fontSize: '1.5rem'
                    },
                    children: "⚠️ 無限ループ検知"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/page.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        marginBottom: '1rem',
                        color: '#ccc'
                    },
                    children: [
                        "マウント回数: ",
                        mountCountRef.current,
                        "回 / 10秒"
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/page.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        marginBottom: '2rem',
                        color: '#888',
                        fontSize: '0.875rem'
                    },
                    children: "ブラウザのDevTools → Consoleでログを確認してください。"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/page.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        gap: '1rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>window.location.reload(),
                            style: {
                                padding: '0.75rem 1.5rem',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            },
                            children: "🔄 リロード"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/page.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                try {
                                    localStorage.removeItem('product-ui-store');
                                    localStorage.removeItem('product-domain-store');
                                } catch (e) {
                                    console.warn('localStorage clear failed:', e);
                                }
                                window.location.reload();
                            },
                            style: {
                                padding: '0.75rem 1.5rem',
                                background: '#444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            },
                            children: "🧹 キャッシュクリア&リロード"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/page.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/page.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/page.tsx",
            lineNumber: 76,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$layouts$2f$editing$2d$n3$2d$page$2d$layout$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EditingN3PageLayout"], {}, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/page.tsx",
        lineNumber: 138,
        columnNumber: 10
    }, this);
}
_s(EditingN3Page, "oWhp1Aw6z0p3TJfFBA7OxTpEG/M=");
_c = EditingN3Page;
var _c;
__turbopack_context__.k.register(_c, "EditingN3Page");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/page.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/page.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_editing-n3_page_tsx_58d13441._.js.map