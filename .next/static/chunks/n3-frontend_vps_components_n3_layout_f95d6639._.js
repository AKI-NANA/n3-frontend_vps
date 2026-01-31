(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/n3/layout/n3-page-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3PageLayout - Layout (View) Component
 *
 * ページ全体の標準レイアウト
 *
 * 設計ルール:
 * - ページ全体の構成を定義
 * - 4領域: Root Layout, Page Header, Content Area, Modal/Overlay
 * - 遅延読み込み（lazy）でモーダル管理
 *
 * @example
 * <N3PageLayout
 *   header={<N3PageHeader title="Editing" />}
 *   toolbar={<N3Toolbar>...</N3Toolbar>}
 * >
 *   <MainContent />
 * </N3PageLayout>
 */ __turbopack_context__.s([
    "N3PageLayout",
    ()=>N3PageLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3PageLayout = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3PageLayout(param) {
    let { header, toolbar, filterBar, leftSidebar, rightSidebar, footer, children, className = '' } = param;
    const classes = [
        'n3-page-layout',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        style: {
            background: 'var(--bg)'
        },
        children: [
            header && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-page-layout__header",
                children: header
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-layout.tsx",
                lineNumber: 66,
                columnNumber: 18
            }, this),
            toolbar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-page-layout__toolbar",
                children: toolbar
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-layout.tsx",
                lineNumber: 69,
                columnNumber: 19
            }, this),
            filterBar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-page-layout__filter-bar",
                children: filterBar
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-layout.tsx",
                lineNumber: 72,
                columnNumber: 21
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-page-layout__body",
                children: [
                    leftSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "n3-page-layout__sidebar n3-page-layout__sidebar--left",
                        children: leftSidebar
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-layout.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "n3-page-layout__content",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-layout.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    rightSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "n3-page-layout__sidebar n3-page-layout__sidebar--right",
                        children: rightSidebar
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-layout.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-layout.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            footer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-page-layout__footer",
                children: footer
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-layout.tsx",
                lineNumber: 95,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-layout.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
});
_c1 = N3PageLayout;
N3PageLayout.displayName = 'N3PageLayout';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3PageLayout$memo");
__turbopack_context__.k.register(_c1, "N3PageLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/layout/n3-page-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3PageHeader - Layout (View) Component
 *
 * ページヘッダー（タイトル + グローバルアクション）
 *
 * 設計ルール:
 * - ページのタイトル、グローバルアクション（保存、新規作成）の配置
 *
 * @example
 * <N3PageHeader
 *   title="Product Editing"
 *   subtitle="Manage your products"
 *   actions={
 *     <>
 *       <N3Button variant="ghost">Cancel</N3Button>
 *       <N3Button variant="primary">Save</N3Button>
 *     </>
 *   }
 * />
 */ __turbopack_context__.s([
    "N3PageHeader",
    ()=>N3PageHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3PageHeader = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3PageHeader(param) {
    let { title, subtitle, leftElement, actions, breadcrumb, className = '' } = param;
    const classes = [
        'n3-page-header',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: classes,
        children: [
            breadcrumb && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-page-header__breadcrumb",
                children: breadcrumb
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-header.tsx",
                lineNumber: 62,
                columnNumber: 22
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-page-header__main",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-page-header__left",
                        children: [
                            leftElement && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-page-header__left-element",
                                children: leftElement
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-header.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-page-header__title-group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "n3-page-header__title",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-header.tsx",
                                        lineNumber: 72,
                                        columnNumber: 13
                                    }, this),
                                    subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "n3-page-header__subtitle",
                                        children: subtitle
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-header.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-header.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-header.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-page-header__actions",
                        children: actions
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-header.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-header.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-page-header.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
});
_c1 = N3PageHeader;
N3PageHeader.displayName = 'N3PageHeader';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3PageHeader$memo");
__turbopack_context__.k.register(_c1, "N3PageHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/layout/n3-content-area.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3ContentArea - Layout (View) Component
 *
 * コンテンツエリア（ツールバー、データリスト、編集フォームの配置）
 *
 * 設計ルール:
 * - ツールバー、主要なデータリストや編集フォームの配置
 *
 * @example
 * <N3ContentArea>
 *   <DataTable />
 * </N3ContentArea>
 */ __turbopack_context__.s([
    "N3ContentArea",
    ()=>N3ContentArea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
'use client';
;
;
const N3ContentArea = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3ContentArea(param) {
    let { children, noPadding = false, className = '' } = param;
    const classes = [
        'n3-content-area',
        noPadding && 'n3-content-area--no-padding',
        className
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        children: children
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-content-area.tsx",
        lineNumber: 49,
        columnNumber: 10
    }, this);
});
_c1 = N3ContentArea;
N3ContentArea.displayName = 'N3ContentArea';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3ContentArea$memo");
__turbopack_context__.k.register(_c1, "N3ContentArea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3EditingLayout - /tools/editing用の共通レイアウトコンポーネント
 * 
 * Design CatalogとEditingページの両方で使用される
 * コンポーネントを修正すれば両方に反映される
 */ __turbopack_context__.s([
    "N3EditingLayout",
    ()=>N3EditingLayout,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/wrench.js [app-client] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/git-branch.js [app-client] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-header-tab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$search$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-header-search.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$header$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-header-tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$pin$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-pin-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$language$2d$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-language-switch.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$world$2d$clock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-world-clock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$currency$2d$display$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-currency-display.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$notification$2d$bell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-notification-bell.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$user$2d$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-user-avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-divider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-toolbar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// ============================================================
// Constants
// ============================================================
const PANEL_TABS = [
    {
        id: 'tools',
        label: 'ツール',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
            lineNumber: 68,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'flow',
        label: 'フロー',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
            lineNumber: 69,
            columnNumber: 37
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        id: 'filter',
        label: 'マーケットプレイス',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
            size: 14
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
            lineNumber: 70,
            columnNumber: 45
        }, ("TURBOPACK compile-time value", void 0))
    }
];
const L2_TABS = [
    {
        id: 'basic-edit',
        label: '基本編集',
        labelEn: 'Basic'
    },
    {
        id: 'logistics',
        label: 'ロジスティクス',
        labelEn: 'Logistics'
    },
    {
        id: 'compliance',
        label: '関税・法令',
        labelEn: 'Compliance'
    },
    {
        id: 'media',
        label: 'メディア',
        labelEn: 'Media'
    },
    {
        id: 'history',
        label: '履歴・監査',
        labelEn: 'History'
    }
];
const CLOCKS_CONFIG = [
    {
        label: "LA",
        tz: "America/Los_Angeles"
    },
    {
        label: "NY",
        tz: "America/New_York"
    },
    {
        label: "DE",
        tz: "Europe/Berlin"
    },
    {
        label: "JP",
        tz: "Asia/Tokyo"
    }
];
const HEADER_HEIGHT = 48;
function N3EditingLayout(param) {
    let { children, userName = 'User', onLogout, onL2TabChange, initialL2Tab = 'basic-edit', language: externalLanguage, onLanguageChange, toolsPanel, flowPanel, filterPanel, demoMode = false, demoHeight = 400 } = param;
    _s();
    // ========================================
    // 状態管理
    // ========================================
    const [pinnedTab, setPinnedTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [hoveredTab, setHoveredTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isHeaderHovered, setIsHeaderHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeL2Tab, setActiveL2Tab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialL2Tab);
    const [internalLanguage, setInternalLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('ja');
    const [showUserMenu, setShowUserMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [times, setTimes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const leaveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const userMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const language = externalLanguage !== null && externalLanguage !== void 0 ? externalLanguage : internalLanguage;
    const isPinned = pinnedTab !== null;
    const activeTab = pinnedTab || hoveredTab;
    // ========================================
    // Effects
    // ========================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3EditingLayout.useEffect": ()=>{
            return ({
                "N3EditingLayout.useEffect": ()=>{
                    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
                }
            })["N3EditingLayout.useEffect"];
        }
    }["N3EditingLayout.useEffect"], []);
    // 時計更新
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3EditingLayout.useEffect": ()=>{
            const update = {
                "N3EditingLayout.useEffect.update": ()=>{
                    const newTimes = {};
                    CLOCKS_CONFIG.forEach({
                        "N3EditingLayout.useEffect.update": (c)=>{
                            newTimes[c.label] = new Date().toLocaleTimeString("en-US", {
                                timeZone: c.tz,
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false
                            });
                        }
                    }["N3EditingLayout.useEffect.update"]);
                    setTimes(newTimes);
                }
            }["N3EditingLayout.useEffect.update"];
            update();
            const interval = setInterval(update, 30000);
            return ({
                "N3EditingLayout.useEffect": ()=>clearInterval(interval)
            })["N3EditingLayout.useEffect"];
        }
    }["N3EditingLayout.useEffect"], []);
    // クリック外側でメニュー閉じる
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3EditingLayout.useEffect": ()=>{
            const handleClickOutside = {
                "N3EditingLayout.useEffect.handleClickOutside": (e)=>{
                    if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                        setShowUserMenu(false);
                    }
                }
            }["N3EditingLayout.useEffect.handleClickOutside"];
            document.addEventListener("mousedown", handleClickOutside);
            return ({
                "N3EditingLayout.useEffect": ()=>document.removeEventListener("mousedown", handleClickOutside)
            })["N3EditingLayout.useEffect"];
        }
    }["N3EditingLayout.useEffect"], []);
    // ========================================
    // ハンドラー
    // ========================================
    const handleMouseEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3EditingLayout.useCallback[handleMouseEnter]": ()=>{
            if (leaveTimeoutRef.current) {
                clearTimeout(leaveTimeoutRef.current);
                leaveTimeoutRef.current = null;
            }
            setIsHeaderHovered(true);
        }
    }["N3EditingLayout.useCallback[handleMouseEnter]"], []);
    const handleMouseLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3EditingLayout.useCallback[handleMouseLeave]": ()=>{
            if (pinnedTab) return;
            leaveTimeoutRef.current = setTimeout({
                "N3EditingLayout.useCallback[handleMouseLeave]": ()=>{
                    setHoveredTab(null);
                    setIsHeaderHovered(false);
                }
            }["N3EditingLayout.useCallback[handleMouseLeave]"], 150);
        }
    }["N3EditingLayout.useCallback[handleMouseLeave]"], [
        pinnedTab
    ]);
    const handleTabMouseEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3EditingLayout.useCallback[handleTabMouseEnter]": (tabId)=>{
            if (leaveTimeoutRef.current) {
                clearTimeout(leaveTimeoutRef.current);
                leaveTimeoutRef.current = null;
            }
            if (!pinnedTab) setHoveredTab(tabId);
            setIsHeaderHovered(true);
        }
    }["N3EditingLayout.useCallback[handleTabMouseEnter]"], [
        pinnedTab
    ]);
    const handleTabClick = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3EditingLayout.useCallback[handleTabClick]": (tabId)=>{
            if (pinnedTab === tabId) {
                setPinnedTab(null);
                setHoveredTab(null);
                setIsHeaderHovered(false);
            } else {
                setPinnedTab(tabId);
                setHoveredTab(null);
            }
        }
    }["N3EditingLayout.useCallback[handleTabClick]"], [
        pinnedTab
    ]);
    const handlePinToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3EditingLayout.useCallback[handlePinToggle]": ()=>{
            if (pinnedTab) {
                setPinnedTab(null);
                setHoveredTab(null);
                setIsHeaderHovered(false);
            } else if (hoveredTab) {
                setPinnedTab(hoveredTab);
                setHoveredTab(null);
            }
        }
    }["N3EditingLayout.useCallback[handlePinToggle]"], [
        pinnedTab,
        hoveredTab
    ]);
    const handleL2TabChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3EditingLayout.useCallback[handleL2TabChange]": (tabId)=>{
            const id = tabId;
            setActiveL2Tab(id);
            onL2TabChange === null || onL2TabChange === void 0 ? void 0 : onL2TabChange(id);
        }
    }["N3EditingLayout.useCallback[handleL2TabChange]"], [
        onL2TabChange
    ]);
    const handleLanguageToggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3EditingLayout.useCallback[handleLanguageToggle]": ()=>{
            const newLang = language === 'ja' ? 'en' : 'ja';
            if (onLanguageChange) {
                onLanguageChange(newLang);
            } else {
                setInternalLanguage(newLang);
            }
        }
    }["N3EditingLayout.useCallback[handleLanguageToggle]"], [
        language,
        onLanguageChange
    ]);
    // ========================================
    // パネルコンテンツ
    // ========================================
    const getPanelContent = (tabId)=>{
        switch(tabId){
            case 'tools':
                return toolsPanel || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Toolbar"], {
                    variant: "default",
                    size: "sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                            variant: "primary",
                            size: "sm",
                            children: "カテゴリ"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                            lineNumber: 236,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                            variant: "secondary",
                            size: "sm",
                            children: "送料"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                            lineNumber: 237,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                            variant: "success",
                            size: "sm",
                            children: "利益"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                            lineNumber: 238,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                    lineNumber: 235,
                    columnNumber: 11
                }, this);
            case 'flow':
                return flowPanel || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3 text-sm",
                    style: {
                        color: 'var(--text-muted)'
                    },
                    children: "FLOWパネル（実装予定）"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                    lineNumber: 243,
                    columnNumber: 11
                }, this);
            case 'filter':
                return filterPanel || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs font-semibold mb-2",
                            style: {
                                color: 'var(--text-muted)'
                            },
                            children: "Marketplaces"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                            lineNumber: 250,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                'eBay',
                                'Amazon',
                                'メルカリ',
                                'ヤフオク'
                            ].map((mp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Badge"], {
                                    variant: "muted",
                                    children: mp
                                }, mp, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                    lineNumber: 253,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                            lineNumber: 251,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                    lineNumber: 249,
                    columnNumber: 11
                }, this);
            default:
                return null;
        }
    };
    const showHoverPanel = !isPinned && hoveredTab !== null && isHeaderHovered;
    const clocksData = CLOCKS_CONFIG.map((c)=>({
            label: c.label,
            time: times[c.label] || '--:--'
        }));
    // ========================================
    // スタイル
    // ========================================
    const containerStyle = demoMode ? {
        display: 'flex',
        flexDirection: 'column',
        height: demoHeight,
        border: '1px solid var(--panel-border)',
        borderRadius: '8px',
        overflow: 'hidden'
    } : {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        marginLeft: 'var(--sidebar-width)',
        paddingTop: HEADER_HEIGHT
    };
    const headerStyle = demoMode ? {
        display: 'flex',
        alignItems: 'stretch',
        height: HEADER_HEIGHT,
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--glass-border)',
        flexShrink: 0
    } : {
        position: 'fixed',
        top: 0,
        left: 'var(--sidebar-width)',
        right: 0,
        height: HEADER_HEIGHT,
        display: 'flex',
        alignItems: 'stretch',
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--glass-border)',
        zIndex: 40
    };
    const hoverPanelStyle = demoMode ? {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        padding: 6,
        background: 'var(--panel)',
        borderBottom: '1px solid var(--panel-border)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 100
    } : {
        position: 'fixed',
        top: HEADER_HEIGHT,
        left: 'var(--sidebar-width)',
        right: 0,
        padding: 6,
        background: 'var(--panel)',
        borderBottom: '1px solid var(--panel-border)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 100
    };
    // ========================================
    // レンダリング
    // ========================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: containerStyle,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: demoMode ? 'relative flex-shrink-0' : '',
                onMouseLeave: handleMouseLeave,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        style: headerStyle,
                        onMouseEnter: handleMouseEnter,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'stretch',
                                    height: '100%'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$pin$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3PinButton"], {
                                        pinned: isPinned,
                                        onClick: handlePinToggle
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                        lineNumber: 348,
                                        columnNumber: 13
                                    }, this),
                                    PANEL_TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3HeaderTab"], {
                                            id: tab.id,
                                            label: tab.label,
                                            icon: tab.icon,
                                            active: activeTab === tab.id,
                                            pinned: pinnedTab === tab.id,
                                            onMouseEnter: ()=>handleTabMouseEnter(tab.id),
                                            onClick: ()=>handleTabClick(tab.id)
                                        }, tab.id, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                            lineNumber: 350,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                lineNumber: 347,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$search$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3HeaderSearchInput"], {
                                    placeholder: "Search...",
                                    shortcut: "⌘K",
                                    width: 240
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                    lineNumber: 365,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    paddingRight: 16
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$language$2d$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3LanguageSwitch"], {
                                        language: language,
                                        onToggle: handleLanguageToggle
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                        lineNumber: 370,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                                        orientation: "vertical"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                        lineNumber: 371,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$world$2d$clock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3WorldClock"], {
                                        clocks: clocksData
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                        lineNumber: 372,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                                        orientation: "vertical"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                        lineNumber: 373,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$currency$2d$display$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3CurrencyDisplay"], {
                                        value: 149.50,
                                        trend: "up"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                        lineNumber: 374,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                                        orientation: "vertical"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                        lineNumber: 375,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$notification$2d$bell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3NotificationBell"], {
                                        count: 3
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                        lineNumber: 376,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        ref: userMenuRef,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$user$2d$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3UserAvatar"], {
                                                name: userName,
                                                onClick: ()=>setShowUserMenu(!showUserMenu)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                                lineNumber: 379,
                                                columnNumber: 15
                                            }, this),
                                            showUserMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute right-0 top-full mt-1 bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg shadow-lg py-1 z-50",
                                                style: {
                                                    width: 160
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-[var(--highlight)]",
                                                    onClick: ()=>{
                                                        setShowUserMenu(false);
                                                        onLogout === null || onLogout === void 0 ? void 0 : onLogout();
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                                            lineNumber: 392,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Sign out"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                                    lineNumber: 385,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                                lineNumber: 381,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                        lineNumber: 378,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                                lineNumber: 369,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                        lineNumber: 345,
                        columnNumber: 9
                    }, this),
                    showHoverPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: hoverPanelStyle,
                        onMouseEnter: handleMouseEnter,
                        children: getPanelContent(hoveredTab)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                        lineNumber: 403,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                lineNumber: 340,
                columnNumber: 7
            }, this),
            isPinned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flexShrink: 0,
                    padding: 6,
                    background: 'var(--panel)',
                    borderBottom: '1px solid var(--panel-border)'
                },
                children: getPanelContent(pinnedTab)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                lineNumber: 411,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$header$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3L2TabNavigation"], {
                        tabs: L2_TABS.map((t)=>({
                                id: t.id,
                                label: t.label,
                                labelEn: t.labelEn
                            })),
                        activeTab: activeL2Tab,
                        onTabChange: handleL2TabChange,
                        language: language
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                        lineNumber: 424,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            overflow: 'auto'
                        },
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                        lineNumber: 432,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
                lineNumber: 422,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-editing-layout.tsx",
        lineNumber: 338,
        columnNumber: 5
    }, this);
}
_s(N3EditingLayout, "QfsF6aFMJdGuuGQTGHH/EYbMW2Y=");
_c = N3EditingLayout;
const __TURBOPACK__default__export__ = N3EditingLayout;
var _c;
__turbopack_context__.k.register(_c, "N3EditingLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/layout/n3-global-header.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3GlobalHeader",
    ()=>N3GlobalHeader,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-header-tab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$search$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-header-search.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$header$2d$tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-header-tabs.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const N3GlobalHeader = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3GlobalHeader(param) {
    let { navTabs = [
        {
            id: 'tools',
            label: 'ツール'
        },
        {
            id: 'flow',
            label: 'FLOW'
        },
        {
            id: 'filter',
            label: 'フィルター'
        }
    ], panels = {}, pageNavigation, searchPlaceholder = '検索...', searchShortcut = '⌘K', searchValue = '', onSearchChange, onSearch, searchWidth = 200, rightActions, size, hideDelay = 150, className = '' } = param;
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isPanelHovered, setIsPanelHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const hideTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // タブにホバーしたら表示
    const handleTabMouseEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3GlobalHeader.N3GlobalHeader.useCallback[handleTabMouseEnter]": (tabId)=>{
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = null;
            }
            setActiveTab(tabId);
        }
    }["N3GlobalHeader.N3GlobalHeader.useCallback[handleTabMouseEnter]"], []);
    // タブから離れたら少し遅延して非表示
    const handleTabMouseLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3GlobalHeader.N3GlobalHeader.useCallback[handleTabMouseLeave]": ()=>{
            hideTimeoutRef.current = setTimeout({
                "N3GlobalHeader.N3GlobalHeader.useCallback[handleTabMouseLeave]": ()=>{
                    if (!isPanelHovered) {
                        setActiveTab(null);
                    }
                }
            }["N3GlobalHeader.N3GlobalHeader.useCallback[handleTabMouseLeave]"], hideDelay);
        }
    }["N3GlobalHeader.N3GlobalHeader.useCallback[handleTabMouseLeave]"], [
        isPanelHovered,
        hideDelay
    ]);
    // パネルにホバー中
    const handlePanelMouseEnter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3GlobalHeader.N3GlobalHeader.useCallback[handlePanelMouseEnter]": ()=>{
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = null;
            }
            setIsPanelHovered(true);
        }
    }["N3GlobalHeader.N3GlobalHeader.useCallback[handlePanelMouseEnter]"], []);
    // パネルから離れたら非表示
    const handlePanelMouseLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3GlobalHeader.N3GlobalHeader.useCallback[handlePanelMouseLeave]": ()=>{
            setIsPanelHovered(false);
            hideTimeoutRef.current = setTimeout({
                "N3GlobalHeader.N3GlobalHeader.useCallback[handlePanelMouseLeave]": ()=>{
                    setActiveTab(null);
                }
            }["N3GlobalHeader.N3GlobalHeader.useCallback[handlePanelMouseLeave]"], hideDelay);
        }
    }["N3GlobalHeader.N3GlobalHeader.useCallback[handlePanelMouseLeave]"], [
        hideDelay
    ]);
    const activePanelContent = activeTab ? panels[activeTab] : null;
    // サイズクラス（個別指定がある場合のみ）
    const sizeClass = size ? "n3-global-header--".concat(size) : '';
    // CSS変数を参照するスタイル（テーマから自動継承）
    const navStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--header-height)',
        minHeight: 'var(--header-height)',
        padding: '0 var(--n3-px)',
        // スタイル変数を参照
        background: 'var(--glass, rgba(255,255,255,0.65))',
        backdropFilter: 'var(--style-backdrop, blur(12px))',
        WebkitBackdropFilter: 'var(--style-backdrop, blur(12px))',
        borderBottom: '1px solid var(--glass-border, rgba(255,255,255,0.5))',
        borderRadius: 'var(--style-panel-radius, 0)',
        boxShadow: 'var(--style-panel-shadow, none)',
        fontSize: 'var(--n3-font)',
        transition: 'var(--style-transition-normal, all 0.15s ease)'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-global-header ".concat(sizeClass, " ").concat(className),
        style: {
            position: 'relative',
            zIndex: 50
        },
        "data-size": size,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-global-header__nav",
                style: navStyle,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-global-header__left",
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0,
                            flex: 1,
                            height: '100%'
                        },
                        children: [
                            pageNavigation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-global-header__page-nav",
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '100%',
                                    borderRight: '1px solid var(--panel-border, #e5e7eb)',
                                    marginRight: 'var(--n3-gap)',
                                    paddingRight: 'var(--n3-gap)'
                                },
                                children: pageNavigation
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-global-header.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-global-header__tabs",
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '100%',
                                    gap: 0
                                },
                                children: navTabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$tab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3HeaderTab"], {
                                        id: tab.id,
                                        label: tab.label,
                                        icon: tab.icon,
                                        active: activeTab === tab.id,
                                        size: size,
                                        onMouseEnter: ()=>handleTabMouseEnter(tab.id),
                                        onMouseLeave: handleTabMouseLeave
                                    }, tab.id, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-global-header.tsx",
                                        lineNumber: 167,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-global-header.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-global-header.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-global-header__right",
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--n3-gap)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$header$2d$search$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3HeaderSearchInput"], {
                                value: searchValue,
                                placeholder: searchPlaceholder,
                                shortcut: searchShortcut,
                                width: searchWidth,
                                size: size,
                                onValueChange: onSearchChange,
                                onSearch: onSearch
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-global-header.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this),
                            rightActions
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-global-header.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-global-header.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            activePanelContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-global-header__panel",
                style: {
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    padding: 'var(--n3-px)',
                    background: 'var(--panel, #ffffff)',
                    borderBottom: '1px solid var(--panel-border, #e5e7eb)',
                    boxShadow: 'var(--style-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.1))',
                    zIndex: 100,
                    maxHeight: '60vh',
                    overflowY: 'auto'
                },
                onMouseEnter: handlePanelMouseEnter,
                onMouseLeave: handlePanelMouseLeave,
                children: activePanelContent
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-global-header.tsx",
                lineNumber: 201,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-global-header.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}, "SfvKnrRGtk3xdjns6fNbB9Zcg4s=")), "SfvKnrRGtk3xdjns6fNbB9Zcg4s=");
_c1 = N3GlobalHeader;
;
;
;
const __TURBOPACK__default__export__ = N3GlobalHeader;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3GlobalHeader$memo");
__turbopack_context__.k.register(_c1, "N3GlobalHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3Sidebar",
    ()=>N3Sidebar,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const N3Sidebar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3Sidebar(param) {
    let { sections, activeItem, onItemClick, collapsed = false, onCollapseChange, header, footer, width = 240, collapsedWidth = 60, className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "n3-sidebar ".concat(collapsed ? 'collapsed' : '', " ").concat(className),
        style: {
            width: collapsed ? collapsedWidth : width
        },
        children: [
            header && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-sidebar-header",
                children: header
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                lineNumber: 58,
                columnNumber: 18
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-sidebar-content",
                children: sections.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3SidebarSectionComponent, {
                        section: section,
                        activeItem: activeItem,
                        onItemClick: onItemClick,
                        collapsed: collapsed
                    }, section.id, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                        lineNumber: 62,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            footer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-sidebar-footer",
                children: footer
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                lineNumber: 72,
                columnNumber: 18
            }, this),
            onCollapseChange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "n3-sidebar-toggle",
                onClick: ()=>onCollapseChange(!collapsed),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    style: {
                        transform: collapsed ? 'rotate(180deg)' : 'none'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                        points: "15 18 9 12 15 6"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                        lineNumber: 88,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                    lineNumber: 79,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                lineNumber: 75,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
});
_c1 = N3Sidebar;
const N3SidebarSectionComponent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s(function N3SidebarSectionComponent(param) {
    let { section, activeItem, onItemClick, collapsed = false } = param;
    _s();
    var _section_defaultCollapsed;
    const [isCollapsed, setIsCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])((_section_defaultCollapsed = section.defaultCollapsed) !== null && _section_defaultCollapsed !== void 0 ? _section_defaultCollapsed : false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-sidebar-section",
        children: [
            section.title && !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-sidebar-section-title ".concat(section.collapsible ? 'collapsible' : ''),
                onClick: ()=>section.collapsible && setIsCollapsed(!isCollapsed),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: section.title
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this),
                    section.collapsible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "12",
                        height: "12",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        style: {
                            transform: isCollapsed ? 'rotate(-90deg)' : 'none'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                            points: "6 9 12 15 18 9"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                            lineNumber: 129,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                        lineNumber: 120,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                lineNumber: 114,
                columnNumber: 9
            }, this),
            (!section.collapsible || !isCollapsed) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "n3-sidebar-items",
                children: section.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3SidebarItemComponent, {
                        item: item,
                        active: activeItem === item.id,
                        onItemClick: onItemClick,
                        collapsed: collapsed
                    }, item.id, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                        lineNumber: 138,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                lineNumber: 136,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}, "/DM8Ie7wUte/5D8bNPHsdcNCgto="));
_c2 = N3SidebarSectionComponent;
const N3SidebarItemComponent = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function N3SidebarItemComponent(param) {
    let { item, active, onItemClick, collapsed = false } = param;
    const handleClick = ()=>{
        var _item_onClick;
        if (item.disabled) return;
        (_item_onClick = item.onClick) === null || _item_onClick === void 0 ? void 0 : _item_onClick.call(item);
        onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(item.id);
    };
    const itemClass = [
        'n3-sidebar-item',
        active && 'active',
        item.disabled && 'disabled'
    ].filter(Boolean).join(' ');
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            item.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "n3-sidebar-item-icon",
                children: item.icon
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                lineNumber: 181,
                columnNumber: 21
            }, this),
            !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-sidebar-item-label",
                        children: item.label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this),
                    item.badge !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-sidebar-item-badge",
                        children: item.badge
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
                        lineNumber: 186,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        children: item.href ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: item.href,
            className: itemClass,
            onClick: handleClick,
            children: content
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
            lineNumber: 196,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            className: itemClass,
            onClick: handleClick,
            disabled: item.disabled,
            children: content
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
            lineNumber: 200,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar.tsx",
        lineNumber: 194,
        columnNumber: 5
    }, this);
});
_c3 = N3SidebarItemComponent;
const __TURBOPACK__default__export__ = N3Sidebar;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "N3Sidebar$memo");
__turbopack_context__.k.register(_c1, "N3Sidebar");
__turbopack_context__.k.register(_c2, "N3SidebarSectionComponent");
__turbopack_context__.k.register(_c3, "N3SidebarItemComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/layout/n3-sidebar-mini.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3SidebarMini - Presentational Component
 * 
 * アイコンのみのシンプルなミニサイドバー
 * - 固定幅48px（展開しない）
 * - ホバーでツールチップ表示
 * - 8個程度のアイコンナビゲーション
 */ __turbopack_context__.s([
    "N3SidebarMini",
    ()=>N3SidebarMini
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const N3SidebarMini = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3SidebarMini(param) {
    let { items, activeId, onItemClick, className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "n3-sidebar-mini ".concat(className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "n3-sidebar-mini__nav",
            children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3SidebarMiniItem, {
                    item: item,
                    active: item.active || activeId === item.id,
                    onClick: ()=>{
                        var _item_onClick;
                        (_item_onClick = item.onClick) === null || _item_onClick === void 0 ? void 0 : _item_onClick.call(item);
                        onItemClick === null || onItemClick === void 0 ? void 0 : onItemClick(item.id);
                    }
                }, item.id, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar-mini.tsx",
                    lineNumber: 41,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar-mini.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar-mini.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
});
_c1 = N3SidebarMini;
const N3SidebarMiniItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s(function N3SidebarMiniItem(param) {
    let { item, active, onClick } = param;
    _s();
    const [showTooltip, setShowTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleClick = ()=>{
        if (item.href) {
            window.location.href = item.href;
        }
        onClick === null || onClick === void 0 ? void 0 : onClick();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleClick,
                onMouseEnter: ()=>setShowTooltip(true),
                onMouseLeave: ()=>setShowTooltip(false),
                className: "n3-sidebar-mini__item ".concat(active ? 'active' : ''),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-sidebar-mini__icon",
                        children: item.icon
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar-mini.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    item.badge !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-sidebar-mini__badge",
                        children: item.badge
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar-mini.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar-mini.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            showTooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-sidebar-mini__tooltip",
                children: item.label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar-mini.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-sidebar-mini.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}, "MlKqB7CDspaiqeinDL2ipSY+OVU="));
_c2 = N3SidebarMiniItem;
N3SidebarMini.displayName = 'N3SidebarMini';
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "N3SidebarMini$memo");
__turbopack_context__.k.register(_c1, "N3SidebarMini");
__turbopack_context__.k.register(_c2, "N3SidebarMiniItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "N3Footer",
    ()=>N3Footer,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
'use client';
;
;
;
const N3Footer = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3Footer(param) {
    let { copyright = '© 2025 N3 Platform', logo, links = [], simple = true, fixed = false, className = '' } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: className,
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: simple ? 'center' : 'space-between',
            gap: '1rem',
            padding: simple ? '0.75rem 1rem' : '1rem 1.5rem',
            fontSize: '12px',
            color: 'var(--text-muted)',
            background: 'var(--panel)',
            borderTop: '1px solid var(--panel-border)',
            ...fixed && {
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100
            }
        },
        children: [
            !simple && logo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                },
                children: logo
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx",
                lineNumber: 58,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: copyright
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    links.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        },
                        children: links.map((link, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                                children: [
                                    index > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--text-subtle)'
                                        },
                                        children: "|"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx",
                                        lineNumber: 80,
                                        columnNumber: 19
                                    }, this),
                                    link.href ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: link.href,
                                        target: link.external ? '_blank' : undefined,
                                        rel: link.external ? 'noopener noreferrer' : undefined,
                                        style: {
                                            color: 'var(--text-muted)',
                                            textDecoration: 'none',
                                            transition: 'color 0.15s ease'
                                        },
                                        onMouseEnter: (e)=>{
                                            e.currentTarget.style.color = 'var(--accent)';
                                        },
                                        onMouseLeave: (e)=>{
                                            e.currentTarget.style.color = 'var(--text-muted)';
                                        },
                                        children: link.label
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx",
                                        lineNumber: 83,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: link.onClick,
                                        style: {
                                            background: 'none',
                                            border: 'none',
                                            padding: 0,
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            fontSize: 'inherit',
                                            transition: 'color 0.15s ease'
                                        },
                                        onMouseEnter: (e)=>{
                                            e.currentTarget.style.color = 'var(--accent)';
                                        },
                                        onMouseLeave: (e)=>{
                                            e.currentTarget.style.color = 'var(--text-muted)';
                                        },
                                        children: link.label
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx",
                                        lineNumber: 102,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, link.id, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx",
                                lineNumber: 78,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            !simple && logo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '1px'
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx",
                lineNumber: 130,
                columnNumber: 27
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-footer.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
});
_c1 = N3Footer;
const __TURBOPACK__default__export__ = N3Footer;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3Footer$memo");
__turbopack_context__.k.register(_c1, "N3Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/layout/n3-collapsible-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3CollapsibleHeader - 折りたたみヘッダーコンポーネント
 * 
 * スクロールダウンで非表示、スクロールアップで再表示
 * 
 * 動作:
 * - position: sticky + top プロパティでスムーズなアニメーション
 * - スクロールダウンで上にスライドアウト
 * - スクロールアップで戻ってくる
 */ __turbopack_context__.s([
    "N3CollapsibleHeader",
    ()=>N3CollapsibleHeader,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const N3CollapsibleHeader = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3CollapsibleHeader(param) {
    let { children, scrollContainerRef, scrollContainerId, threshold = 10, transitionDuration = 300, style, className = '', alwaysVisible = false, zIndex = 40 } = param;
    _s();
    const [scrollDirection, setScrollDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [headerHeight, setHeaderHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const headerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastScrollY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // ヘッダーの高さを測定
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3CollapsibleHeader.N3CollapsibleHeader.useEffect": ()=>{
            if (!headerRef.current) return;
            const updateHeight = {
                "N3CollapsibleHeader.N3CollapsibleHeader.useEffect.updateHeight": ()=>{
                    var _headerRef_current;
                    const height = ((_headerRef_current = headerRef.current) === null || _headerRef_current === void 0 ? void 0 : _headerRef_current.offsetHeight) || 0;
                    setHeaderHeight(height);
                }
            }["N3CollapsibleHeader.N3CollapsibleHeader.useEffect.updateHeight"];
            updateHeight();
            const resizeObserver = new ResizeObserver(updateHeight);
            resizeObserver.observe(headerRef.current);
            return ({
                "N3CollapsibleHeader.N3CollapsibleHeader.useEffect": ()=>resizeObserver.disconnect()
            })["N3CollapsibleHeader.N3CollapsibleHeader.useEffect"];
        }
    }["N3CollapsibleHeader.N3CollapsibleHeader.useEffect"], [
        children
    ]);
    // スクロール監視
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3CollapsibleHeader.N3CollapsibleHeader.useEffect": ()=>{
            if (alwaysVisible) return;
            // スクロールコンテナを取得
            let scrollContainer = null;
            if (scrollContainerRef === null || scrollContainerRef === void 0 ? void 0 : scrollContainerRef.current) {
                scrollContainer = scrollContainerRef.current;
            } else if (scrollContainerId) {
                scrollContainer = document.getElementById(scrollContainerId);
            }
            // コンテナが見つからない場合はwindowを使用
            const useWindow = !scrollContainer;
            const getScrollY = {
                "N3CollapsibleHeader.N3CollapsibleHeader.useEffect.getScrollY": ()=>{
                    if (useWindow) {
                        return window.scrollY;
                    }
                    return (scrollContainer === null || scrollContainer === void 0 ? void 0 : scrollContainer.scrollTop) || 0;
                }
            }["N3CollapsibleHeader.N3CollapsibleHeader.useEffect.getScrollY"];
            const handleScroll = {
                "N3CollapsibleHeader.N3CollapsibleHeader.useEffect.handleScroll": ()=>{
                    const currentScrollY = getScrollY();
                    const delta = currentScrollY - lastScrollY.current;
                    // 閾値を超えた場合のみ方向を更新
                    if (Math.abs(delta) >= threshold) {
                        const direction = delta > 0 ? 'down' : 'up';
                        setScrollDirection(direction);
                        lastScrollY.current = currentScrollY;
                    }
                    // トップに戻った場合は常に表示
                    if (currentScrollY <= 0) {
                        setScrollDirection('up');
                        lastScrollY.current = 0;
                    }
                }
            }["N3CollapsibleHeader.N3CollapsibleHeader.useEffect.handleScroll"];
            const target = useWindow ? window : scrollContainer;
            target === null || target === void 0 ? void 0 : target.addEventListener('scroll', handleScroll, {
                passive: true
            });
            // 初期位置を設定
            lastScrollY.current = getScrollY();
            return ({
                "N3CollapsibleHeader.N3CollapsibleHeader.useEffect": ()=>{
                    target === null || target === void 0 ? void 0 : target.removeEventListener('scroll', handleScroll);
                }
            })["N3CollapsibleHeader.N3CollapsibleHeader.useEffect"];
        }
    }["N3CollapsibleHeader.N3CollapsibleHeader.useEffect"], [
        scrollContainerRef,
        scrollContainerId,
        threshold,
        alwaysVisible
    ]);
    // スクロール方向に基づいてtop位置を計算
    const topPosition = scrollDirection === 'down' ? -headerHeight : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: headerRef,
        className: "n3-collapsible-header ".concat(className),
        style: {
            position: 'sticky',
            top: topPosition,
            zIndex,
            transition: "top ".concat(transitionDuration, "ms ease-in-out"),
            willChange: 'top',
            flexShrink: 0,
            ...style
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/layout/n3-collapsible-header.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}, "S0Vr1MVCFuv7LG8ZnAdknXFCwec=")), "S0Vr1MVCFuv7LG8ZnAdknXFCwec=");
_c1 = N3CollapsibleHeader;
const __TURBOPACK__default__export__ = N3CollapsibleHeader;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3CollapsibleHeader$memo");
__turbopack_context__.k.register(_c1, "N3CollapsibleHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_components_n3_layout_f95d6639._.js.map