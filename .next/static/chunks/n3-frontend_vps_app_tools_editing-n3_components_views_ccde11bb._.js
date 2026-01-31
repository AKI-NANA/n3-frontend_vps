(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/views/n3-basic-edit-view.tsx
/**
 * N3BasicEditView - 基本編集ビュー（リスト/カード表示）
 * 
 * 責務:
 * - リストビュー表示
 * - カードビュー表示
 * - 商品選択・展開の制御
 * - 🔥 監査パネルへの連携
 * - 🔥 カラムソート機能（Excel風）
 * 
 * 📐 Gemini推奨のデザイン:
 * - カラム幅: COO 85px, HTS/MAT 120px, SCR 70px
 * - 行の高さ: 44-48px
 * - フォントサイズ: 12-13px
 */ __turbopack_context__.s([
    "COLUMN_WIDTHS",
    ()=>COLUMN_WIDTHS,
    "N3BasicEditView",
    ()=>N3BasicEditView,
    "ROW_HEIGHT",
    ()=>ROW_HEIGHT,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$card$2d$grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/n3-card-grid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$product$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/product-row.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$product$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/product/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$product$2f$completeness$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/product/completeness-check.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const COLUMN_WIDTHS = {
    checkbox: 40,
    expand: 32,
    product: 280,
    coo: 70,
    hts: 80,
    mat: 110,
    stk: 50,
    cost: 80,
    profit: 75,
    rate: 60,
    scr: 55,
    st: 40,
    type: 70
};
const ROW_HEIGHT = 48;
function SortableHeader(param) {
    let { label, column, width, align = 'center', sortState, onSort } = param;
    const isActive = sortState.column === column;
    // 常に薄い矢印を表示、アクティブ時は濃く
    const arrow = isActive ? sortState.direction === 'asc' ? '▲' : '▼' : '○'; // 薄いインジケーター
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: (e)=>{
            e.stopPropagation();
            onSort(column);
        },
        style: {
            width,
            textAlign: align,
            flexShrink: 0,
            cursor: 'pointer',
            userSelect: 'none',
            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
            fontWeight: isActive ? 700 : 500,
            transition: 'all 0.15s ease',
            padding: isActive ? '2px 6px' : '0 4px',
            // Gemini推奨: アクティブカラムに背景色
            background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            borderRadius: isActive ? 4 : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
            gap: 4
        },
        title: "".concat(label, "で並び替え"),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: label
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                style: {
                    fontSize: '8px',
                    opacity: isActive ? 1 : 0.3,
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)'
                },
                children: arrow
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
        lineNumber: 112,
        columnNumber: 5
    }, this);
}
_c = SortableHeader;
function N3BasicEditView(param) {
    let { products, loading, error, selectedIds, expandedId, viewMode, fastMode, activeFilter, onToggleSelect, onToggleSelectAll, onToggleExpand, onRowClick, onCellChange, onDelete, onEbaySearch, productToExpandPanelProduct, onOpenAuditPanel } = param;
    _s();
    // 🔥 ソート状態
    const [sortState, setSortState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        column: null,
        direction: null
    });
    // 🔥 ソートハンドラー
    const handleSort = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3BasicEditView.useCallback[handleSort]": (column)=>{
            setSortState({
                "N3BasicEditView.useCallback[handleSort]": (prev)=>{
                    if (prev.column !== column) {
                        return {
                            column,
                            direction: 'asc'
                        };
                    }
                    if (prev.direction === 'asc') {
                        return {
                            column,
                            direction: 'desc'
                        };
                    }
                    return {
                        column: null,
                        direction: null
                    };
                }
            }["N3BasicEditView.useCallback[handleSort]"]);
        }
    }["N3BasicEditView.useCallback[handleSort]"], []);
    // 🔥 リアルタイム監査スコアを計算するヘルパー関数
    const getAuditScore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3BasicEditView.useCallback[getAuditScore]": (product)=>{
            // DBに保存されている場合はそれを使用
            if (product.audit_score !== undefined && product.audit_score !== null) {
                return product.audit_score;
            }
            // リアルタイム計算（簡易版）
            let score = 100;
            if (!product.hts_code) score -= 20;
            if (!product.origin_country) score -= 15;
            if (!product.material) score -= 10;
            if (!product.english_title && !product.title_en) score -= 15;
            if (!product.primary_image_url) score -= 10;
            return Math.max(0, score);
        }
    }["N3BasicEditView.useCallback[getAuditScore]"], []);
    // 🔥 Gemini推奨: ソート済み商品リスト（改善版）
    const sortedProducts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3BasicEditView.useMemo[sortedProducts]": ()=>{
            console.log('[Sort] useMemo called:', {
                column: sortState.column,
                direction: sortState.direction,
                count: products.length
            });
            if (!sortState.column || !sortState.direction) {
                return products;
            }
            const sorted = [
                ...products
            ].sort({
                "N3BasicEditView.useMemo[sortedProducts].sorted": (a, b)=>{
                    const col = sortState.column;
                    // 値の抽出
                    let aValue;
                    let bValue;
                    switch(col){
                        case 'origin_country':
                            aValue = a.origin_country || '';
                            bValue = b.origin_country || '';
                            break;
                        case 'hts_code':
                            aValue = a.hts_duty_rate || a.duty_rate || 0;
                            bValue = b.hts_duty_rate || b.duty_rate || 0;
                            break;
                        case 'material':
                            aValue = a.material || '';
                            bValue = b.material || '';
                            break;
                        case 'current_stock':
                            aValue = a.current_stock || 0;
                            bValue = b.current_stock || 0;
                            break;
                        case 'price_jpy':
                            aValue = a.price_jpy || a.cost_price || 0;
                            bValue = b.price_jpy || b.cost_price || 0;
                            break;
                        case 'profit_amount_usd':
                            aValue = a.profit_amount_usd || 0;
                            bValue = b.profit_amount_usd || 0;
                            break;
                        case 'profit_margin':
                            aValue = a.profit_margin || 0;
                            bValue = b.profit_margin || 0;
                            break;
                        case 'audit_score':
                            // 🔥 リアルタイム計算を使用
                            aValue = getAuditScore(a);
                            bValue = getAuditScore(b);
                            break;
                        case 'product_type':
                            aValue = a.product_type || '';
                            bValue = b.product_type || '';
                            break;
                        default:
                            return 0;
                    }
                    // 数値比較
                    if (typeof aValue === 'number' && typeof bValue === 'number') {
                        const diff = aValue - bValue;
                        return sortState.direction === 'asc' ? diff : -diff;
                    }
                    // 文字列比較
                    const strA = String(aValue);
                    const strB = String(bValue);
                    const cmp = strA.localeCompare(strB, 'ja');
                    return sortState.direction === 'asc' ? cmp : -cmp;
                }
            }["N3BasicEditView.useMemo[sortedProducts].sorted"]);
            console.log('[Sort] Sorted:', sorted.slice(0, 3).map({
                "N3BasicEditView.useMemo[sortedProducts]": (p)=>({
                        id: p.id,
                        score: getAuditScore(p)
                    })
            }["N3BasicEditView.useMemo[sortedProducts]"]));
            return sorted;
        }
    }["N3BasicEditView.useMemo[sortedProducts]"], [
        products,
        sortState,
        getAuditScore
    ]); // sortStateオブジェクト全体を監視
    // ローディング
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "読み込み中..."
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
            lineNumber: 285,
            columnNumber: 7
        }, this);
    }
    // エラー
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                textAlign: 'center',
                color: 'var(--error)'
            },
            children: [
                "エラー: ",
                error
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
            lineNumber: 294,
            columnNumber: 7
        }, this);
    }
    // 空
    if (products.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: activeFilter === 'approval_pending' ? '承認待ちの商品はありません' : '商品がありません'
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
            lineNumber: 303,
            columnNumber: 7
        }, this);
    }
    // リストビュー
    if (viewMode === 'list') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--panel)',
                        borderBottom: '1px solid var(--panel-border)',
                        padding: '0 8px',
                        flexShrink: 0,
                        position: 'sticky',
                        top: 0,
                        zIndex: 10
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: COLUMN_WIDTHS.checkbox,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Checkbox"], {
                                    checked: selectedIds.size === sortedProducts.length && sortedProducts.length > 0,
                                    onChange: onToggleSelectAll
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                    lineNumber: 343,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 342,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: COLUMN_WIDTHS.expand,
                                    textAlign: 'center',
                                    flexShrink: 0
                                },
                                children: "▼"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 348,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    minWidth: COLUMN_WIDTHS.product,
                                    paddingLeft: 8
                                },
                                children: "PRODUCT"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 349,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableHeader, {
                                label: "COO",
                                column: "origin_country",
                                width: COLUMN_WIDTHS.coo,
                                sortState: sortState,
                                onSort: handleSort
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 350,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableHeader, {
                                label: "HTS",
                                column: "hts_code",
                                width: COLUMN_WIDTHS.hts,
                                sortState: sortState,
                                onSort: handleSort
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 351,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableHeader, {
                                label: "MAT",
                                column: "material",
                                width: COLUMN_WIDTHS.mat,
                                sortState: sortState,
                                onSort: handleSort
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 352,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableHeader, {
                                label: "STK",
                                column: "current_stock",
                                width: COLUMN_WIDTHS.stk,
                                sortState: sortState,
                                onSort: handleSort
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 353,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableHeader, {
                                label: "COST",
                                column: "price_jpy",
                                width: COLUMN_WIDTHS.cost,
                                align: "right",
                                sortState: sortState,
                                onSort: handleSort
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 354,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableHeader, {
                                label: "PROFIT",
                                column: "profit_amount_usd",
                                width: COLUMN_WIDTHS.profit,
                                align: "right",
                                sortState: sortState,
                                onSort: handleSort
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 355,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableHeader, {
                                label: "RATE",
                                column: "profit_margin",
                                width: COLUMN_WIDTHS.rate,
                                align: "right",
                                sortState: sortState,
                                onSort: handleSort
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 356,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableHeader, {
                                label: "SCR",
                                column: "audit_score",
                                width: COLUMN_WIDTHS.scr,
                                sortState: sortState,
                                onSort: handleSort
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 357,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: COLUMN_WIDTHS.st,
                                    textAlign: 'center',
                                    flexShrink: 0
                                },
                                children: "ST"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 358,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableHeader, {
                                label: "TYPE",
                                column: "product_type",
                                width: COLUMN_WIDTHS.type,
                                sortState: sortState,
                                onSort: handleSort
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                                lineNumber: 359,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                        lineNumber: 331,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                    lineNumber: 317,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        flexShrink: 0
                    },
                    children: sortedProducts.map((product)=>{
                        const expandProduct = productToExpandPanelProduct(product);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$product$2d$row$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductRow"], {
                            product: product,
                            expandProduct: expandProduct,
                            isSelected: selectedIds.has(String(product.id)),
                            isExpanded: expandedId === String(product.id),
                            fastMode: fastMode,
                            onToggleSelect: onToggleSelect,
                            onToggleExpand: onToggleExpand,
                            onRowClick: onRowClick,
                            onCellChange: onCellChange,
                            onDelete: ()=>onDelete(String(product.id)),
                            onEbaySearch: ()=>onEbaySearch(product),
                            onOpenAuditPanel: onOpenAuditPanel
                        }, product.id, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                            lineNumber: 368,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                    lineNumber: 364,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true);
    }
    // カードビュー
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            flexShrink: 0,
            padding: 12
        },
        children: [
            activeFilter === 'approval_pending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 12,
                    padding: '8px 12px',
                    background: 'var(--highlight)',
                    borderRadius: 4,
                    fontSize: 12,
                    color: 'var(--text-muted)'
                },
                children: [
                    "承認可能な商品: ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        style: {
                            color: 'var(--text)'
                        },
                        children: [
                            products.length,
                            "件"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                        lineNumber: 402,
                        columnNumber: 20
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                lineNumber: 394,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$card$2d$grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3CardGrid"], {
                items: products.map((product)=>{
                    var _product_listing_data, _product_listing_data1, _product_listing_data2;
                    const completeness = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$product$2f$completeness$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkProductCompleteness"])(product);
                    return {
                        id: String(product.id),
                        title: product.english_title || product.title_en || product.title || '',
                        imageUrl: product.primary_image_url || undefined,
                        price: product.ddp_price_usd || ((_product_listing_data = product.listing_data) === null || _product_listing_data === void 0 ? void 0 : _product_listing_data.ddp_price_usd) || product.price_usd || 0,
                        currency: 'USD',
                        profitAmount: product.profit_amount_usd || ((_product_listing_data1 = product.listing_data) === null || _product_listing_data1 === void 0 ? void 0 : _product_listing_data1.profit_amount_usd) || undefined,
                        profitMargin: product.profit_margin || ((_product_listing_data2 = product.listing_data) === null || _product_listing_data2 === void 0 ? void 0 : _product_listing_data2.profit_margin) || undefined,
                        sku: product.sku || undefined,
                        filterPassed: product.filter_passed,
                        filterFailReason: product.filter_passed === false && product.is_vero_brand ? "VERO: ".concat(product.vero_detected_brand || 'ブランド検出') : undefined,
                        veroDetectedBrand: product.vero_detected_brand,
                        humanApproved: product.ready_to_list || product.workflow_status === 'approved',
                        category: product.category_name || product.category || undefined,
                        categoryId: product.category_id || product.ebay_category_id || undefined,
                        htsCode: product.hts_code || undefined,
                        originCountry: product.origin_country || undefined,
                        hasEnglishTitle: completeness.checks.englishTitle,
                        hasHtml: !!product.html_content,
                        hasShipping: !!(product.shipping_cost_usd || product.usa_shipping_policy_name),
                        isVeroBrand: product.is_vero_brand || false,
                        selected: selectedIds.has(String(product.id)),
                        onSelect: onToggleSelect,
                        onDetail: (id)=>{
                            const p = products.find((x)=>String(x.id) === id);
                            if (p) onRowClick(p);
                        }
                    };
                }),
                columns: "auto",
                gap: 8,
                minCardWidth: 160
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
                lineNumber: 405,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx",
        lineNumber: 392,
        columnNumber: 5
    }, this);
}
_s(N3BasicEditView, "gAXCtEsna9zwSYRqr7EkVMmaIRU=");
_c1 = N3BasicEditView;
const __TURBOPACK__default__export__ = N3BasicEditView;
var _c, _c1;
__turbopack_context__.k.register(_c, "SortableHeader");
__turbopack_context__.k.register(_c1, "N3BasicEditView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/views/n3-inventory-view.tsx
/**
 * N3InventoryView - 棚卸しビュー（カード/テーブル表示）v3
 * 
 * 責務:
 * - 棚卸し商品のカード/テーブル表示
 * - 在庫数・原価の編集
 * - 属性（attr_l1/l2/l3）の編集（マスタータブ）
 * - 棚卸し統計表示
 * - 要確認/確定フラグ管理
 * - メモ管理
 */ __turbopack_context__.s([
    "N3InventoryView",
    ()=>N3InventoryView,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/n3-pagination.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$inventory$2d$card$2d$grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/n3-inventory-card-grid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$inventory$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/n3-inventory-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const N3InventoryView = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3InventoryView(param) {
    let { paginatedProducts, filteredProducts, stats, loading, error, selectedIds, viewMode, activeFilter, showCandidatesOnly, showSetsOnly, pagination, onSelect, onDetail, onStockChange, onCostChange, onInventoryTypeChange, onStorageLocationChange, onAttributeChange, onL4Change, onVerifiedChange, onInventoryImageUpload, onRefresh } = param;
    _s();
    const [attributeOptions, setAttributeOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        l1: [],
        l2: [],
        l3: []
    });
    const [flagStats, setFlagStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        needsCheckCount: 0,
        confirmedCount: 0,
        withMemoCount: 0
    });
    const showAttributeColumns = activeFilter === 'in_stock_master';
    const showFlagControls = activeFilter === 'in_stock' || activeFilter === 'in_stock_master';
    // 属性オプションを取得
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3InventoryView.N3InventoryView.useEffect": ()=>{
            if (!showAttributeColumns) return;
            const fetchOptions = {
                "N3InventoryView.N3InventoryView.useEffect.fetchOptions": async ()=>{
                    try {
                        const res = await fetch('/api/inventory/attribute-options');
                        const data = await res.json();
                        if (data.success) {
                            setAttributeOptions({
                                l1: data.l1Options || [],
                                l2: data.l2Options || [],
                                l3: data.l3Options || []
                            });
                        }
                    } catch (err) {
                        console.error('[N3InventoryView] Failed to fetch attribute options:', err);
                    }
                }
            }["N3InventoryView.N3InventoryView.useEffect.fetchOptions"];
            fetchOptions();
        }
    }["N3InventoryView.N3InventoryView.useEffect"], [
        showAttributeColumns
    ]);
    // フラグ統計を取得
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3InventoryView.N3InventoryView.useEffect": ()=>{
            if (!showFlagControls) return;
            const fetchFlagStats = {
                "N3InventoryView.N3InventoryView.useEffect.fetchFlagStats": async ()=>{
                    try {
                        const res = await fetch('/api/inventory/update-flags');
                        const data = await res.json();
                        if (data.success && data.stats) {
                            setFlagStats({
                                needsCheckCount: data.stats.needsCheckCount || 0,
                                confirmedCount: data.stats.confirmedCount || 0,
                                withMemoCount: data.stats.withMemoCount || 0
                            });
                        }
                    } catch (err) {
                        console.error('[N3InventoryView] Failed to fetch flag stats:', err);
                    }
                }
            }["N3InventoryView.N3InventoryView.useEffect.fetchFlagStats"];
            fetchFlagStats();
        }
    }["N3InventoryView.N3InventoryView.useEffect"], [
        showFlagControls
    ]); // paginatedProductsを依存から削除（無限ループ防止）
    // 属性変更ハンドラー
    const handleAttributeChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3InventoryView.N3InventoryView.useCallback[handleAttributeChange]": async (id, level, value)=>{
            if (onAttributeChange) {
                await onAttributeChange(id, level, value);
            } else {
                try {
                    await fetch('/api/inventory/update-attribute', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id,
                            field: "attr_".concat(level),
                            value
                        })
                    });
                } catch (err) {
                    console.error('[N3InventoryView] Attribute update error:', err);
                }
            }
        }
    }["N3InventoryView.N3InventoryView.useCallback[handleAttributeChange]"], [
        onAttributeChange
    ]);
    // L4属性変更ハンドラー
    const handleL4Change = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3InventoryView.N3InventoryView.useCallback[handleL4Change]": async (id, channels)=>{
            if (onL4Change) {
                await onL4Change(id, channels);
            } else {
                try {
                    await fetch('/api/inventory/update-attribute', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id,
                            field: 'attr_l4',
                            value: channels
                        })
                    });
                } catch (err) {
                    console.error('[N3InventoryView] L4 update error:', err);
                }
            }
        }
    }["N3InventoryView.N3InventoryView.useCallback[handleL4Change]"], [
        onL4Change
    ]);
    // 確定フラグ変更ハンドラー
    const handleVerifiedChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3InventoryView.N3InventoryView.useCallback[handleVerifiedChange]": async (id, verified)=>{
            if (onVerifiedChange) {
                await onVerifiedChange(id, verified);
            } else {
                try {
                    await fetch('/api/inventory/update-attribute', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id,
                            field: 'is_verified',
                            value: verified
                        })
                    });
                } catch (err) {
                    console.error('[N3InventoryView] Verified update error:', err);
                }
            }
        }
    }["N3InventoryView.N3InventoryView.useCallback[handleVerifiedChange]"], [
        onVerifiedChange
    ]);
    // 統計再取得関数
    const refetchFlagStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3InventoryView.N3InventoryView.useCallback[refetchFlagStats]": async ()=>{
            try {
                const res = await fetch('/api/inventory/update-flags');
                const data = await res.json();
                if (data.success && data.stats) {
                    setFlagStats({
                        needsCheckCount: data.stats.needsCheckCount || 0,
                        confirmedCount: data.stats.confirmedCount || 0,
                        withMemoCount: data.stats.withMemoCount || 0
                    });
                }
            } catch (err) {
                console.error('[N3InventoryView] Failed to refetch flag stats:', err);
            }
        }
    }["N3InventoryView.N3InventoryView.useCallback[refetchFlagStats]"], []);
    // 要確認フラグ変更ハンドラー
    const handleNeedsCheckChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3InventoryView.N3InventoryView.useCallback[handleNeedsCheckChange]": async (id, value)=>{
            try {
                const res = await fetch('/api/inventory/update-flags', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id,
                        field: 'needs_count_check',
                        value
                    })
                });
                const data = await res.json();
                if (data.success) {
                    // 統計を再取得（APIから正確な値を取得）
                    await refetchFlagStats();
                    onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
                }
            } catch (err) {
                console.error('[N3InventoryView] NeedsCheck update error:', err);
            }
        }
    }["N3InventoryView.N3InventoryView.useCallback[handleNeedsCheckChange]"], [
        onRefresh,
        refetchFlagStats
    ]);
    // stock_confirmed 変更ハンドラー
    const handleConfirmedChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3InventoryView.N3InventoryView.useCallback[handleConfirmedChange]": async (id, value)=>{
            try {
                const res = await fetch('/api/inventory/update-flags', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id,
                        field: 'stock_confirmed',
                        value
                    })
                });
                const data = await res.json();
                if (data.success) {
                    // 統計を再取得
                    await refetchFlagStats();
                    onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
                }
            } catch (err) {
                console.error('[N3InventoryView] Confirmed update error:', err);
            }
        }
    }["N3InventoryView.N3InventoryView.useCallback[handleConfirmedChange]"], [
        onRefresh,
        refetchFlagStats
    ]);
    // メモ変更ハンドラー
    const handleMemoChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3InventoryView.N3InventoryView.useCallback[handleMemoChange]": async (id, memo)=>{
            try {
                const res = await fetch('/api/inventory/update-flags', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id,
                        field: 'stock_memo',
                        value: memo
                    })
                });
                const data = await res.json();
                if (data.success) {
                    onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
                }
            } catch (err) {
                console.error('[N3InventoryView] Memo update error:', err);
            }
        }
    }["N3InventoryView.N3InventoryView.useCallback[handleMemoChange]"], [
        onRefresh
    ]);
    // 一括フラグ更新
    const handleBulkFlagUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3InventoryView.N3InventoryView.useCallback[handleBulkFlagUpdate]": async (updates)=>{
            if (selectedIds.size === 0) return;
            try {
                const res = await fetch('/api/inventory/update-flags', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        ids: Array.from(selectedIds),
                        updates
                    })
                });
                const data = await res.json();
                if (data.success) {
                    // 統計を再取得
                    await refetchFlagStats();
                    onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
                } else {
                    alert("一括更新エラー: ".concat(data.error));
                }
            } catch (err) {
                alert("エラー: ".concat(err.message));
            }
        }
    }["N3InventoryView.N3InventoryView.useCallback[handleBulkFlagUpdate]"], [
        selectedIds,
        onRefresh,
        refetchFlagStats
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: "棚卸しデータ読み込み中..."
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
            lineNumber: 306,
            columnNumber: 7
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                textAlign: 'center',
                color: 'var(--error)'
            },
            children: [
                "エラー: ",
                error
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
            lineNumber: 314,
            columnNumber: 7
        }, this);
    }
    if (paginatedProducts.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: 24,
                textAlign: 'center',
                color: 'var(--text-muted)'
            },
            children: activeFilter === 'variation' && showCandidatesOnly ? 'グルーピング候補がありません' : activeFilter === 'set_products' && showSetsOnly ? 'セット商品がありません' : '棚卸しデータがありません'
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
            lineNumber: 322,
            columnNumber: 7
        }, this);
    }
    const selectedTotal = filteredProducts.filter((p)=>selectedIds.has(String(p.id))).reduce((sum, p)=>sum + (p.cost_jpy || 0) * (p.physical_quantity || 1), 0);
    const verifiedCount = filteredProducts.filter((p)=>p.is_verified === true).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: 12
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 12,
                    padding: '10px 12px',
                    background: 'var(--highlight)',
                    borderRadius: 4,
                    fontSize: 12,
                    border: '1px solid var(--panel-border)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 8,
                            color: 'var(--text-muted)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    activeFilter === 'in_stock' && "有在庫: ".concat(stats.inStockCount, "件"),
                                    activeFilter === 'variation' && "バリエーション: 親".concat(stats.variationParentCount, "件 / 子").concat(stats.variationMemberCount, "件"),
                                    activeFilter === 'set_products' && "セット商品: ".concat(filteredProducts.filter((p)=>p.product_type === 'set').length, "件"),
                                    activeFilter === 'in_stock_master' && "マスター全件: ".concat(stats.totalCount, "件")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                lineNumber: 358,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "ページ ",
                                    pagination.currentPage,
                                    "/",
                                    pagination.totalPages,
                                    "（",
                                    paginatedProducts.length,
                                    "/",
                                    pagination.totalItems,
                                    "件表示）"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                        lineNumber: 351,
                        columnNumber: 9
                    }, this),
                    showFlagControls && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 12,
                            paddingBottom: 8,
                            marginBottom: 8,
                            borderBottom: '1px solid var(--panel-border)',
                            flexWrap: 'wrap',
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '4px 10px',
                                    background: flagStats.needsCheckCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                                    borderRadius: 4,
                                    border: flagStats.needsCheckCount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        size: 12,
                                        style: {
                                            color: '#ef4444'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 390,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 11,
                                            color: '#ef4444'
                                        },
                                        children: [
                                            "要確認: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: flagStats.needsCheckCount
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                                lineNumber: 392,
                                                columnNumber: 22
                                            }, this),
                                            "件"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 391,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                lineNumber: 381,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '4px 10px',
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    borderRadius: 4,
                                    border: '1px solid rgba(34, 197, 94, 0.3)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                        size: 12,
                                        style: {
                                            color: '#22c55e'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 405,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 11,
                                            color: '#22c55e'
                                        },
                                        children: [
                                            "確定: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: flagStats.confirmedCount
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                                lineNumber: 407,
                                                columnNumber: 21
                                            }, this),
                                            "/",
                                            stats.inStockCount,
                                            "件"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 406,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                lineNumber: 396,
                                columnNumber: 13
                            }, this),
                            flagStats.withMemoCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '4px 10px',
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    borderRadius: 4,
                                    border: '1px solid rgba(245, 158, 11, 0.3)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        size: 12,
                                        style: {
                                            color: '#f59e0b'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 421,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 11,
                                            color: '#f59e0b'
                                        },
                                        children: [
                                            "メモ: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: flagStats.withMemoCount
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                                lineNumber: 423,
                                                columnNumber: 23
                                            }, this),
                                            "件"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 422,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                lineNumber: 412,
                                columnNumber: 15
                            }, this),
                            selectedIds.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 1,
                                            height: 24,
                                            background: 'var(--panel-border)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 430,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleBulkFlagUpdate({
                                                needs_count_check: true
                                            }),
                                        style: {
                                            padding: '4px 8px',
                                            fontSize: 10,
                                            fontWeight: 600,
                                            background: '#fef2f2',
                                            border: '1px solid #ef4444',
                                            borderRadius: 4,
                                            color: '#dc2626',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                size: 10
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                                lineNumber: 447,
                                                columnNumber: 19
                                            }, this),
                                            "選択",
                                            selectedIds.size,
                                            "件を要確認"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 431,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleBulkFlagUpdate({
                                                stock_confirmed: true
                                            }),
                                        style: {
                                            padding: '4px 8px',
                                            fontSize: 10,
                                            fontWeight: 600,
                                            background: '#dcfce7',
                                            border: '1px solid #22c55e',
                                            borderRadius: 4,
                                            color: '#16a34a',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 4
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                size: 10
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                                lineNumber: 466,
                                                columnNumber: 19
                                            }, this),
                                            "選択",
                                            selectedIds.size,
                                            "件を確定"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 450,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                        lineNumber: 372,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 24,
                            flexWrap: 'wrap'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--text-muted)',
                                            fontSize: 11
                                        },
                                        children: "商品種類数:"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 481,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 700,
                                            fontFamily: 'monospace',
                                            fontSize: 14,
                                            color: 'var(--text)'
                                        },
                                        children: [
                                            filteredProducts.length.toLocaleString(),
                                            "種類"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 482,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                lineNumber: 480,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--text-muted)',
                                            fontSize: 11
                                        },
                                        children: "総在庫数:"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 488,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 600,
                                            fontFamily: 'monospace',
                                            fontSize: 13,
                                            color: 'var(--success)'
                                        },
                                        children: [
                                            filteredProducts.reduce((sum, p)=>sum + (p.physical_quantity || 0), 0).toLocaleString(),
                                            "個"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 489,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                lineNumber: 487,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--text-muted)',
                                            fontSize: 11
                                        },
                                        children: "原価総額:"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 495,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 700,
                                            fontFamily: 'monospace',
                                            fontSize: 14,
                                            color: 'var(--text)'
                                        },
                                        children: [
                                            "¥",
                                            (stats.totalCostJpy || 0).toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 496,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                lineNumber: 494,
                                columnNumber: 11
                            }, this),
                            selectedIds.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '4px 12px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    borderRadius: 4,
                                    border: '1px solid rgba(59, 130, 246, 0.3)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'rgb(59, 130, 246)',
                                            fontSize: 11
                                        },
                                        children: [
                                            "選択",
                                            selectedIds.size,
                                            "件:"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 511,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontWeight: 700,
                                            fontFamily: 'monospace',
                                            fontSize: 14,
                                            color: 'rgb(59, 130, 246)'
                                        },
                                        children: [
                                            "¥",
                                            selectedTotal.toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                        lineNumber: 514,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                                lineNumber: 502,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                        lineNumber: 475,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                lineNumber: 342,
                columnNumber: 7
            }, this),
            showAttributeColumns && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 12,
                    padding: '8px 12px',
                    background: 'rgba(16, 185, 129, 0.05)',
                    borderRadius: 4,
                    fontSize: 11,
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontWeight: 600
                        },
                        children: "💡 属性入力モード:"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                        lineNumber: 536,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "L1/L2/L3をクリックして属性を設定。✓をクリックで「確定」としてマーク。"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                        lineNumber: 537,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                lineNumber: 524,
                columnNumber: 9
            }, this),
            viewMode === 'list' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$inventory$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3InventoryTable"], {
                items: paginatedProducts,
                selectedIds: selectedIds,
                onSelect: onSelect,
                onDetail: onDetail,
                onStockChange: onStockChange,
                onCostChange: onCostChange,
                onAttributeChange: handleAttributeChange,
                onL4Change: handleL4Change,
                onVerifiedChange: handleVerifiedChange,
                attributeOptions: attributeOptions,
                showAttributeColumns: showAttributeColumns
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                lineNumber: 543,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$n3$2d$inventory$2d$card$2d$grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3InventoryCardGrid"], {
                items: paginatedProducts,
                selectedIds: selectedIds,
                onSelect: onSelect,
                onDetail: onDetail,
                onStockChange: onStockChange,
                onCostChange: onCostChange,
                showInventoryTypeToggle: [
                    'active_listings',
                    'in_stock',
                    'in_stock_master',
                    'back_order_only'
                ].includes(activeFilter),
                onInventoryTypeChange: onInventoryTypeChange,
                onStorageLocationChange: onStorageLocationChange,
                onInventoryImageUpload: onInventoryImageUpload,
                // フラグコントロール
                showFlagControls: showFlagControls,
                onNeedsCheckChange: handleNeedsCheckChange,
                onConfirmedChange: handleConfirmedChange,
                onMemoChange: handleMemoChange,
                columns: "auto",
                gap: 8,
                minCardWidth: 180
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                lineNumber: 557,
                columnNumber: 9
            }, this),
            pagination.totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 16
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$n3$2d$pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Pagination"], {
                    total: pagination.totalItems,
                    pageSize: pagination.itemsPerPage,
                    currentPage: pagination.currentPage,
                    onPageChange: pagination.setCurrentPage,
                    onPageSizeChange: pagination.setItemsPerPage,
                    pageSizeOptions: [
                        10,
                        50,
                        100,
                        500
                    ]
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                    lineNumber: 582,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
                lineNumber: 581,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx",
        lineNumber: 340,
        columnNumber: 5
    }, this);
}, "Q5YtHTnjPuNmY24yHe+DOXNaZjc=")), "Q5YtHTnjPuNmY24yHe+DOXNaZjc=");
_c1 = N3InventoryView;
const __TURBOPACK__default__export__ = N3InventoryView;
var _c, _c1;
__turbopack_context__.k.register(_c, "N3InventoryView$memo");
__turbopack_context__.k.register(_c1, "N3InventoryView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx
/**
 * 仮想スクロール対応棚卸しリスト
 * 
 * Phase 4: パフォーマンス最適化
 * - react-windowによる仮想スクロール
 * - 大量データ（10,000件以上）でもスムーズにスクロール
 * - メモリ使用量を大幅削減
 */ __turbopack_context__.s([
    "N3VirtualInventoryList",
    ()=>N3VirtualInventoryList,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$react$2d$window$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/react-window/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/ellipsis-vertical.js [app-client] (ecmascript) <export default as MoreVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
// 個別行コンポーネント（メモ化）
const InventoryRow = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_s(function InventoryRow(param) {
    let { product, isSelected, onSelect, onDetail, onStockChange, onCostChange, style } = param;
    var _product_images;
    _s();
    const [isEditing, setIsEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editValue, setEditValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleStartEdit = (type)=>{
        setIsEditing(type);
        setEditValue(type === 'stock' ? String(product.physical_quantity || 0) : String(product.cost_jpy || product.cost_price || 0));
    };
    const handleSaveEdit = ()=>{
        if (isEditing === 'stock' && onStockChange) {
            const newQty = parseInt(editValue) || 0;
            onStockChange(newQty);
        } else if (isEditing === 'cost' && onCostChange) {
            const newCost = parseInt(editValue) || 0;
            onCostChange(newCost);
        }
        setIsEditing(null);
    };
    const handleKeyDown = (e)=>{
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            setIsEditing(null);
        }
    };
    // 画像URL
    const imageUrl = product.image_url || ((_product_images = product.images) === null || _product_images === void 0 ? void 0 : _product_images[0]) || null;
    // 在庫ステータスの色
    const stockColor = product.physical_quantity > 5 ? 'var(--success)' : product.physical_quantity > 0 ? 'var(--warning)' : 'var(--danger)';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            ...style,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 12px',
            background: isSelected ? 'var(--highlight)' : 'transparent',
            borderBottom: '1px solid var(--panel-border)',
            cursor: 'pointer'
        },
        onClick: onDetail,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: (e)=>{
                    e.stopPropagation();
                    onSelect();
                },
                style: {
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: "2px solid ".concat(isSelected ? 'var(--accent)' : 'var(--text-muted)'),
                    background: isSelected ? 'var(--accent)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                },
                children: isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                    size: 14,
                    color: "white"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                    lineNumber: 129,
                    columnNumber: 24
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 48,
                    height: 48,
                    borderRadius: 6,
                    background: 'var(--panel)',
                    border: '1px solid var(--panel-border)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                children: imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: imageUrl,
                    alt: "",
                    style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    },
                    loading: "lazy"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                    lineNumber: 148,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                    size: 20,
                    style: {
                        color: 'var(--text-muted)'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                    lineNumber: 155,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 13,
                            fontWeight: 500,
                            color: 'var(--text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        },
                        children: product.product_name || product.title || '（無題）'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 8,
                            marginTop: 2
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 11,
                                    color: 'var(--text-muted)'
                                },
                                children: product.sku || '—'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            product.attr_l1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontSize: 10,
                                    padding: '1px 4px',
                                    background: 'var(--highlight)',
                                    borderRadius: 2,
                                    color: 'var(--text-muted)'
                                },
                                children: product.attr_l1
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                                lineNumber: 178,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 70,
                    textAlign: 'center',
                    flexShrink: 0
                },
                children: isEditing === 'stock' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "number",
                    value: editValue,
                    onChange: (e)=>setEditValue(e.target.value),
                    onBlur: handleSaveEdit,
                    onKeyDown: handleKeyDown,
                    onClick: (e)=>e.stopPropagation(),
                    autoFocus: true,
                    style: {
                        width: '100%',
                        padding: '2px 4px',
                        fontSize: 13,
                        textAlign: 'center',
                        border: '1px solid var(--accent)',
                        borderRadius: 4,
                        background: 'var(--panel)',
                        color: 'var(--text)'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                    lineNumber: 188,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: (e)=>{
                        e.stopPropagation();
                        handleStartEdit('stock');
                    },
                    style: {
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: 'var(--panel)',
                        cursor: 'text'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 14,
                            fontWeight: 600,
                            color: stockColor
                        },
                        children: product.physical_quantity || 0
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 217,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                    lineNumber: 208,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 80,
                    textAlign: 'right',
                    flexShrink: 0
                },
                children: isEditing === 'cost' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "number",
                    value: editValue,
                    onChange: (e)=>setEditValue(e.target.value),
                    onBlur: handleSaveEdit,
                    onKeyDown: handleKeyDown,
                    onClick: (e)=>e.stopPropagation(),
                    autoFocus: true,
                    style: {
                        width: '100%',
                        padding: '2px 4px',
                        fontSize: 12,
                        textAlign: 'right',
                        border: '1px solid var(--accent)',
                        borderRadius: 4,
                        background: 'var(--panel)',
                        color: 'var(--text)'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                    lineNumber: 227,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    onClick: (e)=>{
                        e.stopPropagation();
                        handleStartEdit('cost');
                    },
                    style: {
                        cursor: 'text'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: 12,
                            color: 'var(--text-muted)'
                        },
                        children: [
                            "¥",
                            (product.cost_jpy || product.cost_price || 0).toLocaleString()
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 251,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                    lineNumber: 247,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                lineNumber: 225,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 60,
                    textAlign: 'center',
                    flexShrink: 0
                },
                children: product.storage_location ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize: 11,
                        color: 'var(--text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                            size: 10
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                            lineNumber: 262,
                            columnNumber: 13
                        }, this),
                        product.storage_location
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                    lineNumber: 261,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    style: {
                        fontSize: 11,
                        color: 'var(--text-muted)'
                    },
                    children: "—"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                    lineNumber: 266,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                lineNumber: 259,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: (e)=>{
                    e.stopPropagation();
                    onDetail();
                },
                style: {
                    width: 28,
                    height: 28,
                    borderRadius: 4,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreVertical$3e$__["MoreVertical"], {
                    size: 16
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                    lineNumber: 286,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}, "8yJdrpeh6W7gmJVWMkcWJHteEdA="));
_c = InventoryRow;
const N3VirtualInventoryList = /*#__PURE__*/ _s1((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c1 = _s1(function N3VirtualInventoryList(param) {
    let { products, selectedIds, height = 600, itemSize = 64, onSelect, onDetail, onStockChange, onCostChange } = param;
    _s1();
    const listRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // リサイズ対応
    const [containerHeight, setContainerHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(height);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3VirtualInventoryList.N3VirtualInventoryList.useEffect": ()=>{
            const updateHeight = {
                "N3VirtualInventoryList.N3VirtualInventoryList.useEffect.updateHeight": ()=>{
                    if (containerRef.current) {
                        const rect = containerRef.current.getBoundingClientRect();
                        const availableHeight = window.innerHeight - rect.top - 50; // 50px margin for footer
                        setContainerHeight(Math.max(400, availableHeight));
                    }
                }
            }["N3VirtualInventoryList.N3VirtualInventoryList.useEffect.updateHeight"];
            updateHeight();
            window.addEventListener('resize', updateHeight);
            return ({
                "N3VirtualInventoryList.N3VirtualInventoryList.useEffect": ()=>window.removeEventListener('resize', updateHeight)
            })["N3VirtualInventoryList.N3VirtualInventoryList.useEffect"];
        }
    }["N3VirtualInventoryList.N3VirtualInventoryList.useEffect"], []);
    // 行レンダラー
    const Row = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3VirtualInventoryList.N3VirtualInventoryList.useCallback[Row]": (param)=>{
            let { index, style } = param;
            const product = products[index];
            if (!product) return null;
            const id = String(product.id);
            const isSelected = selectedIds.has(id);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InventoryRow, {
                product: product,
                isSelected: isSelected,
                onSelect: {
                    "N3VirtualInventoryList.N3VirtualInventoryList.useCallback[Row]": ()=>onSelect(id)
                }["N3VirtualInventoryList.N3VirtualInventoryList.useCallback[Row]"],
                onDetail: {
                    "N3VirtualInventoryList.N3VirtualInventoryList.useCallback[Row]": ()=>onDetail(id)
                }["N3VirtualInventoryList.N3VirtualInventoryList.useCallback[Row]"],
                onStockChange: onStockChange ? ({
                    "N3VirtualInventoryList.N3VirtualInventoryList.useCallback[Row]": (qty)=>onStockChange(id, qty)
                })["N3VirtualInventoryList.N3VirtualInventoryList.useCallback[Row]"] : undefined,
                onCostChange: onCostChange ? ({
                    "N3VirtualInventoryList.N3VirtualInventoryList.useCallback[Row]": (cost)=>onCostChange(id, cost)
                })["N3VirtualInventoryList.N3VirtualInventoryList.useCallback[Row]"] : undefined,
                style: style
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                lineNumber: 332,
                columnNumber: 7
            }, this);
        }
    }["N3VirtualInventoryList.N3VirtualInventoryList.useCallback[Row]"], [
        products,
        selectedIds,
        onSelect,
        onDetail,
        onStockChange,
        onCostChange
    ]);
    if (products.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                        size: 48,
                        style: {
                            opacity: 0.3,
                            marginBottom: 8
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 356,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: "商品が見つかりません"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 357,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                lineNumber: 355,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
            lineNumber: 346,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        style: {
            width: '100%'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    background: 'var(--panel)',
                    borderBottom: '1px solid var(--panel-border)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 20
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 380,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 48
                        },
                        children: "画像"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 381,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        },
                        children: "商品名 / SKU"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 382,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 70,
                            textAlign: 'center'
                        },
                        children: "在庫"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 383,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 80,
                            textAlign: 'right'
                        },
                        children: "原価"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 384,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 60,
                            textAlign: 'center'
                        },
                        children: "場所"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 385,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 28
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                        lineNumber: 386,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                lineNumber: 366,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$react$2d$window$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FixedSizeList"], {
                ref: listRef,
                height: containerHeight,
                width: "100%",
                itemCount: products.length,
                itemSize: itemSize,
                overscanCount: 5,
                children: Row
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
                lineNumber: 390,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx",
        lineNumber: 364,
        columnNumber: 5
    }, this);
}, "zNq3QovpDcsV1UgYrziFvh6s9fk=")), "zNq3QovpDcsV1UgYrziFvh6s9fk=");
_c2 = N3VirtualInventoryList;
const __TURBOPACK__default__export__ = N3VirtualInventoryList;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "InventoryRow");
__turbopack_context__.k.register(_c1, "N3VirtualInventoryList$memo");
__turbopack_context__.k.register(_c2, "N3VirtualInventoryList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/views/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/views/index.ts
/**
 * Views - ビューコンポーネントのエクスポート
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$views$2f$n3$2d$basic$2d$edit$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-basic-edit-view.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$views$2f$n3$2d$inventory$2d$view$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-inventory-view.tsx [app-client] (ecmascript)");
// Phase 4: 仮想スクロールリスト
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$views$2f$n3$2d$virtual$2d$inventory$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/views/n3-virtual-inventory-list.tsx [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_editing-n3_components_views_ccde11bb._.js.map