(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/docs-n3/page.tsx
/**
 * N3 ドキュメント管理ページ
 * 
 * 機能:
 * - タブでカテゴリ別にドキュメント管理
 * - Markdownプレビュー
 * - ドキュメント一覧テーブル
 * - 新規ドキュメント追加
 */ __turbopack_context__.s([
    "default",
    ()=>DocsN3Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Book$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/book.js [app-client] (ecmascript) <export default as Book>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rocket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rocket$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/rocket.js [app-client] (ecmascript) <export default as Rocket>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [app-client] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/remark-gfm/lib/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// ============================================================
// 定数
// ============================================================
const TABS = [
    {
        id: 'errors',
        label: 'エラー集',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
            lineNumber: 54,
            columnNumber: 40
        }, ("TURBOPACK compile-time value", void 0)),
        color: '#ef4444'
    },
    {
        id: 'guides',
        label: 'ガイド',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Book$3e$__["Book"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
            lineNumber: 55,
            columnNumber: 39
        }, ("TURBOPACK compile-time value", void 0)),
        color: '#3b82f6'
    },
    {
        id: 'api',
        label: 'API仕様',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
            lineNumber: 56,
            columnNumber: 38
        }, ("TURBOPACK compile-time value", void 0)),
        color: '#8b5cf6'
    },
    {
        id: 'architecture',
        label: 'アーキテクチャ',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
            lineNumber: 57,
            columnNumber: 49
        }, ("TURBOPACK compile-time value", void 0)),
        color: '#06b6d4'
    },
    {
        id: 'deployment',
        label: 'デプロイ',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rocket$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Rocket$3e$__["Rocket"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
            lineNumber: 58,
            columnNumber: 44
        }, ("TURBOPACK compile-time value", void 0)),
        color: '#22c55e'
    }
];
function DocsN3Page() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('errors');
    const [docs, setDocs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [tabCounts, setTabCounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [selectedDoc, setSelectedDoc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showAddModal, setShowAddModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // カテゴリ別件数を初回のみ取得（一括取得API使用）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DocsN3Page.useEffect": ()=>{
            const loadAllCounts = {
                "DocsN3Page.useEffect.loadAllCounts": async ()=>{
                    try {
                        const res = await fetch('/api/docs/counts');
                        if (res.ok) {
                            const data = await res.json();
                            setTabCounts(data.counts || {});
                        }
                    } catch (error) {
                        console.error('カウント取得エラー:', error);
                    }
                }
            }["DocsN3Page.useEffect.loadAllCounts"];
            loadAllCounts();
        }
    }["DocsN3Page.useEffect"], []); // 初回のみ
    // ドキュメント読み込み
    const loadDocs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DocsN3Page.useCallback[loadDocs]": async ()=>{
            setLoading(true);
            try {
                const res = await fetch("/api/docs/list?category=".concat(activeTab));
                if (res.ok) {
                    const data = await res.json();
                    setDocs(data.docs || []);
                } else {
                    // APIがない場合はモックデータ
                    setDocs(getMockDocs(activeTab));
                }
            } catch (error) {
                console.error('ドキュメント読み込みエラー:', error);
                setDocs(getMockDocs(activeTab));
            } finally{
                setLoading(false);
            }
        }
    }["DocsN3Page.useCallback[loadDocs]"], [
        activeTab
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DocsN3Page.useEffect": ()=>{
            loadDocs();
            setSelectedDoc(null);
        }
    }["DocsN3Page.useEffect"], [
        loadDocs
    ]);
    // ドキュメント選択
    const handleSelectDoc = async (doc)=>{
        if (doc.content) {
            setSelectedDoc(doc);
            return;
        }
        try {
            const res = await fetch("/api/docs/content?path=".concat(encodeURIComponent(doc.path)));
            if (res.ok) {
                const data = await res.json();
                setSelectedDoc({
                    ...doc,
                    content: data.content
                });
            } else {
                // フォールバック：ファイルシステムから読み込む
                const content = await fetchLocalContent(doc.path);
                setSelectedDoc({
                    ...doc,
                    content
                });
            }
        } catch (error) {
            console.error('コンテンツ読み込みエラー:', error);
            const content = await fetchLocalContent(doc.path);
            setSelectedDoc({
                ...doc,
                content
            });
        }
    };
    // フィルタリング
    const filteredDocs = docs.filter((doc)=>{
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return doc.title.toLowerCase().includes(query) || doc.description.toLowerCase().includes(query) || doc.tags.some((tag)=>tag.toLowerCase().includes(query));
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-793a3d18e8f26634" + " " + "docs-n3-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "jsx-793a3d18e8f26634" + " " + "docs-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-793a3d18e8f26634" + " " + "docs-header-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "jsx-793a3d18e8f26634",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                        size: 24
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this),
                                    "N3 ドキュメント"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-793a3d18e8f26634" + " " + "docs-count",
                                children: [
                                    docs.length,
                                    " 件"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-793a3d18e8f26634" + " " + "docs-header-right",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-793a3d18e8f26634" + " " + "docs-search",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                        lineNumber: 163,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "ドキュメントを検索...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        className: "jsx-793a3d18e8f26634"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                        lineNumber: 164,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowAddModal(true),
                                className: "jsx-793a3d18e8f26634" + " " + "docs-btn primary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                        lineNumber: 172,
                                        columnNumber: 13
                                    }, this),
                                    "追加"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: loadDocs,
                                className: "jsx-793a3d18e8f26634" + " " + "docs-btn",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                    lineNumber: 176,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "jsx-793a3d18e8f26634" + " " + "docs-tabs",
                children: TABS.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab(tab.id),
                        style: {
                            '--tab-color': tab.color
                        },
                        className: "jsx-793a3d18e8f26634" + " " + "docs-tab ".concat(activeTab === tab.id ? 'active' : ''),
                        children: [
                            tab.icon,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-793a3d18e8f26634",
                                children: tab.label
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "jsx-793a3d18e8f26634" + " " + "tab-count",
                                children: activeTab === tab.id ? docs.length : tabCounts[tab.id] || 0
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this)
                        ]
                    }, tab.id, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-793a3d18e8f26634" + " " + "docs-content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "jsx-793a3d18e8f26634" + " " + "docs-list",
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-793a3d18e8f26634" + " " + "docs-loading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                    className: "spin",
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                    lineNumber: 205,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "jsx-793a3d18e8f26634",
                                    children: "読み込み中..."
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 204,
                            columnNumber: 13
                        }, this) : filteredDocs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-793a3d18e8f26634" + " " + "docs-empty",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                    size: 32
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                    lineNumber: 210,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-793a3d18e8f26634",
                                    children: "ドキュメントがありません"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                    lineNumber: 211,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 209,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "jsx-793a3d18e8f26634" + " " + "docs-table",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    className: "jsx-793a3d18e8f26634",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "jsx-793a3d18e8f26634",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "jsx-793a3d18e8f26634",
                                                children: "タイトル"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                lineNumber: 217,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "jsx-793a3d18e8f26634",
                                                children: "ステータス"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                lineNumber: 218,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "jsx-793a3d18e8f26634",
                                                children: "更新日"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                lineNumber: 219,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "jsx-793a3d18e8f26634",
                                                children: "タグ"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                lineNumber: 220,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                        lineNumber: 216,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                    lineNumber: 215,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "jsx-793a3d18e8f26634",
                                    children: filteredDocs.map((doc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            onClick: ()=>handleSelectDoc(doc),
                                            className: "jsx-793a3d18e8f26634" + " " + (((selectedDoc === null || selectedDoc === void 0 ? void 0 : selectedDoc.id) === doc.id ? 'selected' : '') || ""),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "jsx-793a3d18e8f26634" + " " + "doc-title-cell",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                            size: 14,
                                                            className: "doc-arrow"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                            lineNumber: 231,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-793a3d18e8f26634" + " " + "doc-title",
                                                            children: doc.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                            lineNumber: 232,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-793a3d18e8f26634" + " " + "doc-desc",
                                                            children: doc.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                            lineNumber: 233,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                    lineNumber: 230,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "jsx-793a3d18e8f26634",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "jsx-793a3d18e8f26634" + " " + "doc-status ".concat(doc.status),
                                                        children: doc.status === 'active' ? '有効' : doc.status === 'deprecated' ? '非推奨' : '下書き'
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                    lineNumber: 235,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "jsx-793a3d18e8f26634" + " " + "doc-date",
                                                    children: formatDate(doc.updatedAt)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                    lineNumber: 240,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "jsx-793a3d18e8f26634" + " " + "doc-tags",
                                                    children: [
                                                        doc.tags.slice(0, 2).map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "jsx-793a3d18e8f26634" + " " + "doc-tag",
                                                                children: tag
                                                            }, tag, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                                lineNumber: 243,
                                                                columnNumber: 25
                                                            }, this)),
                                                        doc.tags.length > 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-793a3d18e8f26634" + " " + "doc-tag more",
                                                            children: [
                                                                "+",
                                                                doc.tags.length - 2
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                            lineNumber: 246,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, doc.id, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                            lineNumber: 225,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                    lineNumber: 223,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 214,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "jsx-793a3d18e8f26634" + " " + "docs-preview",
                        children: selectedDoc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-793a3d18e8f26634" + " " + "preview-header",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "jsx-793a3d18e8f26634",
                                            children: selectedDoc.title
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                            lineNumber: 261,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-793a3d18e8f26634" + " " + "preview-actions",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CopyButton, {
                                                    content: selectedDoc.content || ''
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                    lineNumber: 263,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    title: "編集",
                                                    className: "jsx-793a3d18e8f26634" + " " + "docs-btn",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                        lineNumber: 265,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "vscode://file".concat(selectedDoc.path),
                                                    title: "VSCodeで開く",
                                                    className: "jsx-793a3d18e8f26634" + " " + "docs-btn",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                        size: 16
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                        lineNumber: 272,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                    lineNumber: 267,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                            lineNumber: 262,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                    lineNumber: 260,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-793a3d18e8f26634" + " " + "preview-meta",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-793a3d18e8f26634",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                    lineNumber: 277,
                                                    columnNumber: 23
                                                }, this),
                                                " ",
                                                formatDate(selectedDoc.updatedAt)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                            lineNumber: 277,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-793a3d18e8f26634",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                    size: 12
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 23
                                                }, this),
                                                " ",
                                                selectedDoc.tags.join(', ')
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                            lineNumber: 278,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                    lineNumber: 276,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "jsx-793a3d18e8f26634" + " " + "preview-content markdown-body",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                                        remarkPlugins: [
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$remark$2d$gfm$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
                                        ],
                                        children: selectedDoc.content || '読み込み中...'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                        lineNumber: 281,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                    lineNumber: 280,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "jsx-793a3d18e8f26634" + " " + "preview-empty",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                    size: 48
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                    lineNumber: 288,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "jsx-793a3d18e8f26634",
                                    children: "ドキュメントを選択してプレビュー"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                                    lineNumber: 289,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 287,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                        lineNumber: 257,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this),
            showAddModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AddDocModal, {
                category: activeTab,
                onClose: ()=>setShowAddModal(false),
                onSave: ()=>{
                    setShowAddModal(false);
                    loadDocs();
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                lineNumber: 297,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "793a3d18e8f26634",
                children: ".docs-n3-page.jsx-793a3d18e8f26634{background:var(--bg);height:100vh;color:var(--text);flex-direction:column;display:flex}.docs-header.jsx-793a3d18e8f26634{border-bottom:1px solid var(--panel-border);background:var(--glass);justify-content:space-between;align-items:center;padding:16px 24px;display:flex}.docs-header-left.jsx-793a3d18e8f26634{align-items:center;gap:12px;display:flex}.docs-header-left.jsx-793a3d18e8f26634 h1.jsx-793a3d18e8f26634{align-items:center;gap:8px;margin:0;font-size:20px;font-weight:600;display:flex}.docs-count.jsx-793a3d18e8f26634{background:var(--accent);color:#fff;border-radius:12px;padding:2px 8px;font-size:12px;font-weight:500}.docs-header-right.jsx-793a3d18e8f26634{align-items:center;gap:12px;display:flex}.docs-search.jsx-793a3d18e8f26634{background:var(--panel);border:1px solid var(--panel-border);border-radius:8px;align-items:center;gap:8px;width:280px;padding:8px 12px;display:flex}.docs-search.jsx-793a3d18e8f26634 input.jsx-793a3d18e8f26634{color:var(--text);background:0 0;border:none;outline:none;flex:1;font-size:14px}.docs-btn.jsx-793a3d18e8f26634{border:1px solid var(--panel-border);background:var(--panel);color:var(--text);cursor:pointer;border-radius:8px;align-items:center;gap:6px;padding:8px 12px;font-size:13px;transition:all .2s;display:flex}.docs-btn.jsx-793a3d18e8f26634:hover{background:var(--panel-hover);border-color:var(--accent)}.docs-btn.primary.jsx-793a3d18e8f26634{background:var(--accent);border-color:var(--accent);color:#fff}.docs-btn.primary.jsx-793a3d18e8f26634:hover{opacity:.9}.docs-tabs.jsx-793a3d18e8f26634{background:var(--panel);border-bottom:1px solid var(--panel-border);gap:4px;padding:12px 24px;display:flex}.docs-tab.jsx-793a3d18e8f26634{color:var(--text-muted);cursor:pointer;background:0 0;border:none;border-radius:8px;align-items:center;gap:8px;padding:10px 16px;font-size:13px;font-weight:500;transition:all .2s;display:flex}.docs-tab.jsx-793a3d18e8f26634:hover{background:var(--panel-hover);color:var(--text)}.docs-tab.active.jsx-793a3d18e8f26634{background:var(--tab-color);color:#fff}.tab-count.jsx-793a3d18e8f26634{background:rgba(255,255,255,.2);border-radius:10px;padding:2px 6px;font-size:11px}.docs-tab.jsx-793a3d18e8f26634:not(.active) .tab-count.jsx-793a3d18e8f26634{background:var(--panel-border)}.docs-content.jsx-793a3d18e8f26634{flex:1;grid-template-columns:1fr 1fr;gap:0;display:grid;overflow:hidden}.docs-list.jsx-793a3d18e8f26634{border-right:1px solid var(--panel-border);overflow:auto}.docs-table.jsx-793a3d18e8f26634{border-collapse:collapse;width:100%}.docs-table.jsx-793a3d18e8f26634 th.jsx-793a3d18e8f26634{background:var(--panel);text-align:left;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid var(--panel-border);padding:12px 16px;font-size:12px;font-weight:600;position:-webkit-sticky;position:sticky;top:0}.docs-table.jsx-793a3d18e8f26634 td.jsx-793a3d18e8f26634{border-bottom:1px solid var(--panel-border);padding:12px 16px;font-size:13px}.docs-table.jsx-793a3d18e8f26634 tr.jsx-793a3d18e8f26634{cursor:pointer;transition:background .2s}.docs-table.jsx-793a3d18e8f26634 tr.jsx-793a3d18e8f26634:hover{background:var(--panel-hover)}.docs-table.jsx-793a3d18e8f26634 tr.selected.jsx-793a3d18e8f26634{background:rgba(var(--accent-rgb),.1)}.doc-title-cell.jsx-793a3d18e8f26634{flex-direction:column;gap:4px;display:flex}.doc-arrow.jsx-793a3d18e8f26634{color:var(--accent);display:none}.docs-table.jsx-793a3d18e8f26634 tr.selected.jsx-793a3d18e8f26634 .doc-arrow.jsx-793a3d18e8f26634{display:inline}.doc-title.jsx-793a3d18e8f26634{color:var(--text);font-weight:500}.doc-desc.jsx-793a3d18e8f26634{color:var(--text-muted);font-size:12px}.doc-status.jsx-793a3d18e8f26634{border-radius:4px;padding:2px 8px;font-size:11px;font-weight:500}.doc-status.active.jsx-793a3d18e8f26634{color:#22c55e;background:rgba(34,197,94,.2)}.doc-status.deprecated.jsx-793a3d18e8f26634{color:#ef4444;background:rgba(239,68,68,.2)}.doc-status.draft.jsx-793a3d18e8f26634{color:#eab308;background:rgba(234,179,8,.2)}.doc-date.jsx-793a3d18e8f26634{color:var(--text-muted);font-size:12px}.doc-tags.jsx-793a3d18e8f26634{flex-wrap:wrap;gap:4px;display:flex}.doc-tag.jsx-793a3d18e8f26634{background:var(--panel-border);color:var(--text-muted);border-radius:4px;padding:2px 6px;font-size:10px}.doc-tag.more.jsx-793a3d18e8f26634{background:var(--accent);color:#fff}.docs-preview.jsx-793a3d18e8f26634{background:var(--bg);flex-direction:column;display:flex;overflow:hidden}.preview-header.jsx-793a3d18e8f26634{border-bottom:1px solid var(--panel-border);justify-content:space-between;align-items:center;padding:16px 24px;display:flex}.preview-header.jsx-793a3d18e8f26634 h2.jsx-793a3d18e8f26634{margin:0;font-size:18px;font-weight:600}.preview-actions.jsx-793a3d18e8f26634{gap:8px;display:flex}.preview-meta.jsx-793a3d18e8f26634{color:var(--text-muted);border-bottom:1px solid var(--panel-border);gap:16px;padding:12px 24px;font-size:12px;display:flex}.preview-meta.jsx-793a3d18e8f26634 span.jsx-793a3d18e8f26634{align-items:center;gap:4px;display:flex}.preview-content.jsx-793a3d18e8f26634{flex:1;padding:24px;overflow:auto}.preview-empty.jsx-793a3d18e8f26634{color:var(--text-muted);flex-direction:column;flex:1;justify-content:center;align-items:center;gap:12px;display:flex}.docs-loading.jsx-793a3d18e8f26634,.docs-empty.jsx-793a3d18e8f26634{color:var(--text-muted);flex-direction:column;justify-content:center;align-items:center;gap:12px;padding:48px;display:flex}.spin.jsx-793a3d18e8f26634{animation:1s linear infinite spin}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.markdown-body.jsx-793a3d18e8f26634{font-size:14px;line-height:1.7}.markdown-body.jsx-793a3d18e8f26634 h1.jsx-793a3d18e8f26634,.markdown-body.jsx-793a3d18e8f26634 h2.jsx-793a3d18e8f26634,.markdown-body.jsx-793a3d18e8f26634 h3.jsx-793a3d18e8f26634{border-bottom:1px solid var(--panel-border);margin-top:24px;margin-bottom:16px;padding-bottom:8px;font-weight:600}.markdown-body.jsx-793a3d18e8f26634 h1.jsx-793a3d18e8f26634{font-size:24px}.markdown-body.jsx-793a3d18e8f26634 h2.jsx-793a3d18e8f26634{font-size:20px}.markdown-body.jsx-793a3d18e8f26634 h3.jsx-793a3d18e8f26634{border-bottom:none;font-size:16px}.markdown-body.jsx-793a3d18e8f26634 pre.jsx-793a3d18e8f26634{background:var(--panel);border:1px solid var(--panel-border);border-radius:8px;padding:16px;overflow-x:auto}.markdown-body.jsx-793a3d18e8f26634 code.jsx-793a3d18e8f26634{background:var(--panel);border-radius:4px;padding:2px 6px;font-family:JetBrains Mono,monospace;font-size:13px}.markdown-body.jsx-793a3d18e8f26634 pre.jsx-793a3d18e8f26634 code.jsx-793a3d18e8f26634{background:0 0;padding:0}.markdown-body.jsx-793a3d18e8f26634 table.jsx-793a3d18e8f26634{border-collapse:collapse;width:100%;margin:16px 0}.markdown-body.jsx-793a3d18e8f26634 th.jsx-793a3d18e8f26634,.markdown-body.jsx-793a3d18e8f26634 td.jsx-793a3d18e8f26634{border:1px solid var(--panel-border);text-align:left;padding:8px 12px}.markdown-body.jsx-793a3d18e8f26634 th.jsx-793a3d18e8f26634{background:var(--panel);font-weight:600}.markdown-body.jsx-793a3d18e8f26634 blockquote.jsx-793a3d18e8f26634{border-left:4px solid var(--accent);color:var(--text-muted);margin-left:0;padding-left:16px}.markdown-body.jsx-793a3d18e8f26634 ul.jsx-793a3d18e8f26634,.markdown-body.jsx-793a3d18e8f26634 ol.jsx-793a3d18e8f26634{padding-left:24px}.markdown-body.jsx-793a3d18e8f26634 li.jsx-793a3d18e8f26634{margin:8px 0}.markdown-body.jsx-793a3d18e8f26634 a.jsx-793a3d18e8f26634{color:var(--accent);text-decoration:none}.markdown-body.jsx-793a3d18e8f26634 a.jsx-793a3d18e8f26634:hover{text-decoration:underline}.markdown-body.jsx-793a3d18e8f26634 hr.jsx-793a3d18e8f26634{border:none;border-top:1px solid var(--panel-border);margin:24px 0}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
        lineNumber: 151,
        columnNumber: 5
    }, this);
}
_s(DocsN3Page, "W5otC8wZucWiNpgua1OQN2LtYRY=");
_c = DocsN3Page;
// ============================================================
// サブコンポーネント
// ============================================================
function CopyButton(param) {
    let { content } = param;
    _s1();
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleCopy = async ()=>{
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: "docs-btn",
        onClick: handleCopy,
        title: "コピー",
        children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
            lineNumber: 750,
            columnNumber: 17
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
            size: 16
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
            lineNumber: 750,
            columnNumber: 39
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
        lineNumber: 749,
        columnNumber: 5
    }, this);
}
_s1(CopyButton, "NE86rL3vg4NVcTTWDavsT0hUBJs=");
_c1 = CopyButton;
function AddDocModal(param) {
    let { category, onClose, onSave } = param;
    _s2();
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [tags, setTags] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSave = async ()=>{
        if (!title.trim()) return;
        setSaving(true);
        try {
            const res = await fetch('/api/docs/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description,
                    content,
                    category,
                    tags: tags.split(',').map((t)=>t.trim()).filter(Boolean)
                })
            });
            if (res.ok) {
                onSave();
            } else {
                alert('保存に失敗しました');
            }
        } catch (error) {
            console.error('保存エラー:', error);
            alert('保存に失敗しました');
        } finally{
            setSaving(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "modal-overlay",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            onClick: (e)=>e.stopPropagation(),
            className: "jsx-5e7abe9f3f9eb826" + " " + "modal-content",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "jsx-5e7abe9f3f9eb826",
                    children: "新規ドキュメント追加"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                    lineNumber: 803,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-5e7abe9f3f9eb826" + " " + "form-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "jsx-5e7abe9f3f9eb826",
                            children: "タイトル"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 806,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: title,
                            onChange: (e)=>setTitle(e.target.value),
                            placeholder: "ERR-003: エラー名",
                            className: "jsx-5e7abe9f3f9eb826"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 807,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                    lineNumber: 805,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-5e7abe9f3f9eb826" + " " + "form-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "jsx-5e7abe9f3f9eb826",
                            children: "説明"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 816,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: description,
                            onChange: (e)=>setDescription(e.target.value),
                            placeholder: "エラーの概要",
                            className: "jsx-5e7abe9f3f9eb826"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 817,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                    lineNumber: 815,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-5e7abe9f3f9eb826" + " " + "form-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "jsx-5e7abe9f3f9eb826",
                            children: "タグ（カンマ区切り）"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 826,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: tags,
                            onChange: (e)=>setTags(e.target.value),
                            placeholder: "Next.js, webpack, 無限ループ",
                            className: "jsx-5e7abe9f3f9eb826"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 827,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                    lineNumber: 825,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-5e7abe9f3f9eb826" + " " + "form-group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "jsx-5e7abe9f3f9eb826",
                            children: "内容（Markdown）"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 836,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: content,
                            onChange: (e)=>setContent(e.target.value),
                            placeholder: "## 症状  ## 原因  ## 解決策",
                            rows: 12,
                            className: "jsx-5e7abe9f3f9eb826"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 837,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                    lineNumber: 835,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-5e7abe9f3f9eb826" + " " + "modal-actions",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "jsx-5e7abe9f3f9eb826" + " " + "docs-btn",
                            children: "キャンセル"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 846,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSave,
                            disabled: saving || !title.trim(),
                            className: "jsx-5e7abe9f3f9eb826" + " " + "docs-btn primary",
                            children: saving ? '保存中...' : '保存'
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                            lineNumber: 847,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
                    lineNumber: 845,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    id: "5e7abe9f3f9eb826",
                    children: ".modal-overlay.jsx-5e7abe9f3f9eb826{z-index:1000;background:rgba(0,0,0,.6);justify-content:center;align-items:center;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.modal-content.jsx-5e7abe9f3f9eb826{background:var(--panel);border:1px solid var(--panel-border);border-radius:12px;width:600px;max-height:80vh;padding:24px;overflow:auto}.modal-content.jsx-5e7abe9f3f9eb826 h3.jsx-5e7abe9f3f9eb826{margin:0 0 20px;font-size:18px}.form-group.jsx-5e7abe9f3f9eb826{margin-bottom:16px}.form-group.jsx-5e7abe9f3f9eb826 label.jsx-5e7abe9f3f9eb826{color:var(--text-muted);margin-bottom:6px;font-size:13px;font-weight:500;display:block}.form-group.jsx-5e7abe9f3f9eb826 input.jsx-5e7abe9f3f9eb826,.form-group.jsx-5e7abe9f3f9eb826 textarea.jsx-5e7abe9f3f9eb826{background:var(--bg);border:1px solid var(--panel-border);width:100%;color:var(--text);border-radius:8px;padding:10px 12px;font-family:inherit;font-size:14px}.form-group.jsx-5e7abe9f3f9eb826 textarea.jsx-5e7abe9f3f9eb826{resize:vertical;font-family:JetBrains Mono,monospace;font-size:13px}.form-group.jsx-5e7abe9f3f9eb826 input.jsx-5e7abe9f3f9eb826:focus,.form-group.jsx-5e7abe9f3f9eb826 textarea.jsx-5e7abe9f3f9eb826:focus{border-color:var(--accent);outline:none}.modal-actions.jsx-5e7abe9f3f9eb826{justify-content:flex-end;gap:12px;margin-top:24px;display:flex}"
                }, void 0, false, void 0, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
            lineNumber: 802,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx",
        lineNumber: 801,
        columnNumber: 5
    }, this);
}
_s2(AddDocModal, "NO1+rw2RjFIxF+73FB2dZZXhufI=");
_c2 = AddDocModal;
// ============================================================
// ユーティリティ
// ============================================================
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}
async function fetchLocalContent(path) {
    // ローカルファイルの内容を取得（デモ用）
    const mockContents = {
        'docs/errors/ERROR_CATALOG.md': "# N3 開発エラーカタログ\n\n## ERR-001: 無限コンパイル/リロードループ\n\n### 症状\nターミナルに同じページへのGETリクエストが無限に出続け、Macが重くなる。\n\n### 原因\n1. Webpack watchOptionsの`poll: 5000`設定\n2. useEffectの依存配列に関数が含まれている\n3. Supabaseクライアントの重複生成\n\n### 解決策\n```typescript\n// next.config.ts\nconfig.watchOptions = {\n  poll: false,\n  aggregateTimeout: 500,\n};\n```\n\n---\n\n## ERR-002: Turbopack CSSパースエラー\n\n### 症状\nTurbopackでビルド時にCSSパースエラーが発生。\n\n### 解決策\n`--webpack`オプションで起動する。\n"
    };
    return mockContents[path] || '# ドキュメントが見つかりません';
}
function getMockDocs(category) {
    const mockData = {
        errors: [
            {
                id: 'err-001',
                title: 'ERR-001: 無限コンパイル/リロードループ',
                description: 'ページが無限にリロードされる問題',
                category: 'errors',
                path: 'docs/errors/ERROR_CATALOG.md',
                createdAt: '2024-12-22T00:00:00Z',
                updatedAt: '2024-12-22T00:00:00Z',
                tags: [
                    'Next.js',
                    'webpack',
                    '無限ループ',
                    'HMR'
                ],
                status: 'active'
            },
            {
                id: 'err-002',
                title: 'ERR-002: Turbopack CSSパースエラー',
                description: 'Turbopackでビルド時にCSSエラー',
                category: 'errors',
                path: 'docs/errors/ERROR_CATALOG.md',
                createdAt: '2024-12-22T00:00:00Z',
                updatedAt: '2024-12-22T00:00:00Z',
                tags: [
                    'Turbopack',
                    'CSS',
                    'Tailwind'
                ],
                status: 'active'
            }
        ],
        guides: [
            {
                id: 'guide-001',
                title: 'トラブルシューティングガイド',
                description: '緊急時のクイックガイド',
                category: 'guides',
                path: 'TROUBLESHOOTING.md',
                createdAt: '2024-12-22T00:00:00Z',
                updatedAt: '2024-12-22T00:00:00Z',
                tags: [
                    '緊急対応',
                    'キャッシュ'
                ],
                status: 'active'
            }
        ],
        api: [],
        architecture: [],
        deployment: [
            {
                id: 'deploy-001',
                title: 'Vercelデプロイマニュアル',
                description: '本番環境への反映手順',
                category: 'deployment',
                path: 'DEPLOYMENT_MANUAL.md',
                createdAt: '2024-12-22T00:00:00Z',
                updatedAt: '2024-12-22T00:00:00Z',
                tags: [
                    'Vercel',
                    'デプロイ',
                    'CI/CD'
                ],
                status: 'active'
            }
        ]
    };
    return mockData[category] || [];
}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "DocsN3Page");
__turbopack_context__.k.register(_c1, "CopyButton");
__turbopack_context__.k.register(_c2, "AddDocModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/n3-frontend_vps/app/tools/docs-n3/page.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_docs-n3_page_tsx_aefb43e1._.js.map