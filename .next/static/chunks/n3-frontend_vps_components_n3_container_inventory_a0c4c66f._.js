(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3StatsSection - 統計セクションコンポーネント
 * 
 * 棚卸し画面のStatsHeaderを汎用化
 * 複数の統計カードを横並びで表示し、アカウント別・バリエーション統計に対応
 * 
 * @example
 * <N3StatsSection
 *   stats={[
 *     { label: '総商品数', value: 1234, icon: Package, color: 'primary', subStats: [...] },
 *     { label: '在庫総額', value: '$12,345', icon: DollarSign, color: 'success' }
 *   ]}
 *   columns={5}
 * />
 */ __turbopack_context__.s([
    "AccountCard",
    ()=>AccountCard,
    "N3StatsSection",
    ()=>N3StatsSection,
    "StatCard",
    ()=>StatCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/git-branch.js [app-client] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
'use client';
;
;
;
// ============================================================
// Helper Components
// ============================================================
const StatCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function StatCard(param) {
    let { stat } = param;
    const Icon = stat.icon;
    const colorClass = stat.color || 'primary';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-stat-card n3-stat-card--border-left n3-stat-card--border-left-".concat(colorClass),
        onClick: stat.onClick,
        style: {
            cursor: stat.onClick ? 'pointer' : 'default'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-stat-card__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "n3-stat-card__label",
                                children: stat.label
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "n3-stat-card__value",
                                children: stat.value.toLocaleString()
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-stat-card__icon-wrapper n3-stat-card__icon-wrapper--".concat(colorClass),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                            className: "n3-stat-card__icon"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            stat.subStats && stat.subStats.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-stat-card__sub-stats",
                children: stat.subStats.map((sub, idx)=>{
                    const SubIcon = sub.icon;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-stat-card__sub-stat n3-stat-card__sub-stat--".concat(sub.type || 'default'),
                        children: [
                            SubIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SubIcon, {
                                style: {
                                    width: 12,
                                    height: 12
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 149,
                                columnNumber: 29
                            }, this),
                            sub.label,
                            ": ",
                            sub.value
                        ]
                    }, idx, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                        lineNumber: 145,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                lineNumber: 141,
                columnNumber: 9
            }, this),
            stat.footer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "n3-stat-card__footer",
                children: stat.footer
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                lineNumber: 158,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
        lineNumber: 123,
        columnNumber: 5
    }, this);
});
_c = StatCard;
const AccountCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function AccountCard(param) {
    let { account } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-account-card n3-account-card--".concat(account.type),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-account-card__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-account-card__name",
                        children: [
                            account.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    marginRight: 4
                                },
                                children: account.icon
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 173,
                                columnNumber: 28
                            }, this),
                            account.name
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "n3-account-card__count",
                        children: account.total
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-account-card__details",
                children: account.details.map((detail, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-account-card__detail",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-account-card__detail-label",
                                children: [
                                    detail.label,
                                    ":"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-account-card__detail-value",
                                children: detail.value
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                        lineNumber: 180,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
});
_c1 = AccountCard;
const N3StatsSection = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c2 = function N3StatsSection(param) {
    let { stats, columns = 5, accountStats, variationStats, avgDaysHeld, size, className = '' } = param;
    const sizeClass = size ? "n3-size-".concat(size) : '';
    const classes = [
        'n3-stats-section',
        sizeClass,
        className
    ].filter(Boolean).join(' ');
    // 平均在庫日数のステータス判定
    const getDaysHeldStatus = (value, target)=>{
        if (value <= target) return {
            status: '✅ 良好',
            color: 'var(--color-success)'
        };
        if (value <= target * 2) return {
            status: '⚠️ 警戒',
            color: 'var(--color-warning)'
        };
        return {
            status: '🔴 要注意',
            color: 'var(--color-error)'
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        children: [
            stats && stats.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-stats-grid n3-stats-grid-".concat(columns),
                children: stats.map((stat, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                        stat: stat
                    }, idx, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                        lineNumber: 219,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                lineNumber: 217,
                columnNumber: 9
            }, this),
            accountStats && accountStats.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-account-stats",
                style: {
                    marginTop: stats ? 'var(--n3-px)' : 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-account-stats__header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                                className: "n3-account-stats__icon"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 228,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "n3-account-stats__title",
                                children: "アカウント別統計"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                        lineNumber: 227,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-account-stats__grid",
                        children: accountStats.map((account, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AccountCard, {
                                account: account
                            }, idx, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 233,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                        lineNumber: 231,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                lineNumber: 226,
                columnNumber: 9
            }, this),
            variationStats && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-account-stats",
                style: {
                    marginTop: 'var(--n3-px)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-account-stats__header",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
                                className: "n3-account-stats__icon",
                                style: {
                                    color: 'var(--color-purple)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 243,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "n3-account-stats__title",
                                children: "バリエーション統計"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 244,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                        lineNumber: 242,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-stats-grid n3-stats-grid-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-stat-card",
                                style: {
                                    background: 'var(--color-purple-light)',
                                    borderColor: 'var(--color-purple)',
                                    textAlign: 'center',
                                    padding: 'calc(var(--n3-px) * 0.75)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 'calc(var(--n3-font) * 1.75)',
                                            fontWeight: 700,
                                            color: 'var(--color-purple)'
                                        },
                                        children: variationStats.parentCount
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                        lineNumber: 256,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 'calc(var(--n3-font) * 0.85)',
                                            color: 'var(--color-purple)'
                                        },
                                        children: "👑 バリエーション親"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                        lineNumber: 259,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 247,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-stat-card",
                                style: {
                                    background: 'var(--color-primary-light)',
                                    borderColor: 'var(--color-primary)',
                                    textAlign: 'center',
                                    padding: 'calc(var(--n3-px) * 0.75)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 'calc(var(--n3-font) * 1.75)',
                                            fontWeight: 700,
                                            color: 'var(--color-primary)'
                                        },
                                        children: variationStats.memberCount
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                        lineNumber: 270,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 'calc(var(--n3-font) * 0.85)',
                                            color: 'var(--color-primary)'
                                        },
                                        children: "🔗 メンバーSKU"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                        lineNumber: 273,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 261,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-stat-card",
                                style: {
                                    background: 'var(--highlight)',
                                    borderColor: 'var(--panel-border)',
                                    textAlign: 'center',
                                    padding: 'calc(var(--n3-px) * 0.75)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 'calc(var(--n3-font) * 1.75)',
                                            fontWeight: 700,
                                            color: 'var(--text)'
                                        },
                                        children: variationStats.standaloneCount
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                        lineNumber: 284,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 'calc(var(--n3-font) * 0.85)',
                                            color: 'var(--text-muted)'
                                        },
                                        children: "🔹 単独SKU"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                        lineNumber: 287,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 275,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-stat-card",
                                style: {
                                    background: 'var(--color-warning-light)',
                                    borderColor: 'var(--color-warning)',
                                    textAlign: 'center',
                                    padding: 'calc(var(--n3-px) * 0.75)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 'calc(var(--n3-font) * 1.75)',
                                            fontWeight: 700,
                                            color: 'var(--color-warning)'
                                        },
                                        children: variationStats.groupingCandidates
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                        lineNumber: 298,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 'calc(var(--n3-font) * 0.85)',
                                            color: 'var(--color-warning)'
                                        },
                                        children: "🎯 グルーピング候補"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                        lineNumber: 301,
                                        columnNumber: 15
                                    }, this),
                                    variationStats.groupingCandidates > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: 'calc(var(--n3-font) * 0.75)',
                                            color: 'var(--color-warning)',
                                            marginTop: 4
                                        },
                                        children: "バリエーション化可能"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                        lineNumber: 303,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 289,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                        lineNumber: 246,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                lineNumber: 241,
                columnNumber: 9
            }, this),
            avgDaysHeld && avgDaysHeld.value > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-account-stats",
                style: {
                    marginTop: 'var(--n3-px)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'calc(var(--n3-gap) * 2)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "n3-stat-card__icon-wrapper n3-stat-card__icon-wrapper--primary",
                            style: {
                                width: 'calc(var(--n3-height) * 1.5)',
                                height: 'calc(var(--n3-height) * 1.5)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                style: {
                                    width: 'calc(var(--n3-icon) * 1.5)',
                                    height: 'calc(var(--n3-icon) * 1.5)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                lineNumber: 320,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                            lineNumber: 316,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: 'calc(var(--n3-font) * 0.95)',
                                        color: 'var(--text-muted)'
                                    },
                                    children: "平均在庫日数"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                    lineNumber: 323,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: 'calc(var(--n3-gap))'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 'calc(var(--n3-font) * 1.75)',
                                                fontWeight: 700,
                                                color: 'var(--text)'
                                            },
                                            children: [
                                                avgDaysHeld.value,
                                                "日"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                            lineNumber: 325,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-badge",
                                            style: {
                                                background: getDaysHeldStatus(avgDaysHeld.value, avgDaysHeld.target).color === 'var(--color-success)' ? 'var(--color-success-light)' : getDaysHeldStatus(avgDaysHeld.value, avgDaysHeld.target).color === 'var(--color-warning)' ? 'var(--color-warning-light)' : 'var(--color-error-light)',
                                                color: getDaysHeldStatus(avgDaysHeld.value, avgDaysHeld.target).color
                                            },
                                            children: getDaysHeldStatus(avgDaysHeld.value, avgDaysHeld.target).status
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                            lineNumber: 328,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                    lineNumber: 324,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                            lineNumber: 322,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginLeft: 'auto',
                                textAlign: 'right'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: 'calc(var(--n3-font) * 0.85)',
                                        color: 'var(--text-muted)'
                                    },
                                    children: [
                                        "目標: ",
                                        avgDaysHeld.target,
                                        "日以内"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                    lineNumber: 344,
                                    columnNumber: 15
                                }, this),
                                avgDaysHeld.rotationCount !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: 'calc(var(--n3-font) * 0.85)',
                                        color: 'var(--color-success)'
                                    },
                                    children: [
                                        "回転商品: ",
                                        avgDaysHeld.rotationCount,
                                        "件"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                    lineNumber: 348,
                                    columnNumber: 17
                                }, this),
                                avgDaysHeld.investmentCount !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: 'calc(var(--n3-font) * 0.85)',
                                        color: 'var(--color-purple)'
                                    },
                                    children: [
                                        "投資商品: ",
                                        avgDaysHeld.investmentCount,
                                        "件"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                                    lineNumber: 353,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                            lineNumber: 343,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                    lineNumber: 315,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
                lineNumber: 314,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
});
_c3 = N3StatsSection;
N3StatsSection.displayName = 'N3StatsSection';
;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "StatCard");
__turbopack_context__.k.register(_c1, "AccountCard");
__turbopack_context__.k.register(_c2, "N3StatsSection$memo");
__turbopack_context__.k.register(_c3, "N3StatsSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3AdvancedFilter - 高度なフィルターコンポーネント
 * 
 * 棚卸し画面のFilterPanelを汎用化
 * 複数行フィルター、マーケットプレイス/アカウント選択、バリエーション状態対応
 * 
 * @example
 * <N3AdvancedFilter
 *   rows={[
 *     { columns: 6, items: [...] },
 *     { columns: 6, items: [...] }
 *   ]}
 *   values={filterValues}
 *   onChange={setFilterValues}
 *   onReset={handleReset}
 * />
 */ __turbopack_context__.s([
    "CONDITION_OPTIONS",
    ()=>CONDITION_OPTIONS,
    "DAYS_HELD_OPTIONS",
    ()=>DAYS_HELD_OPTIONS,
    "EBAY_ACCOUNT_OPTIONS",
    ()=>EBAY_ACCOUNT_OPTIONS,
    "INVENTORY_TYPE_OPTIONS",
    ()=>INVENTORY_TYPE_OPTIONS,
    "MARKETPLACE_OPTIONS",
    ()=>MARKETPLACE_OPTIONS,
    "N3AdvancedFilter",
    ()=>N3AdvancedFilter,
    "PRICE_PHASE_OPTIONS",
    ()=>PRICE_PHASE_OPTIONS,
    "PRODUCT_TYPE_OPTIONS",
    ()=>PRODUCT_TYPE_OPTIONS,
    "SITE_OPTIONS",
    ()=>SITE_OPTIONS,
    "STOCK_STATUS_OPTIONS",
    ()=>STOCK_STATUS_OPTIONS,
    "VARIATION_STATUS_OPTIONS",
    ()=>VARIATION_STATUS_OPTIONS,
    "createInventoryFilterRows",
    ()=>createInventoryFilterRows
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/folder.js [app-client] (ecmascript) <export default as Folder>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/award.js [app-client] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/globe.js [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/git-branch.js [app-client] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/lightbulb.js [app-client] (ecmascript) <export default as Lightbulb>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
'use client';
;
;
;
// ============================================================
// Helper Components
// ============================================================
const FilterInput = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function FilterInput(param) {
    let { item, value, onChange } = param;
    const Icon = item.icon;
    switch(item.type){
        case 'text':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-advanced-filter__item",
                style: {
                    gridColumn: item.span ? "span ".concat(item.span) : undefined
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "n3-advanced-filter__label",
                        children: [
                            Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: "n3-advanced-filter__label-icon"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                                lineNumber: 122,
                                columnNumber: 22
                            }, this),
                            item.label
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: value || '',
                        onChange: (e)=>onChange(e.target.value),
                        placeholder: item.placeholder,
                        className: "n3-input"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                        lineNumber: 125,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this);
        case 'select':
            var _item_options;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-advanced-filter__item",
                style: {
                    gridColumn: item.span ? "span ".concat(item.span) : undefined
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "n3-advanced-filter__label",
                        children: [
                            Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                className: "n3-advanced-filter__label-icon"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                                lineNumber: 139,
                                columnNumber: 22
                            }, this),
                            item.label
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: value || '',
                        onChange: (e)=>onChange(e.target.value),
                        className: "n3-select",
                        children: (_item_options = item.options) === null || _item_options === void 0 ? void 0 : _item_options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: opt.value,
                                children: opt.icon ? "".concat(opt.icon, " ").concat(opt.label) : opt.label
                            }, opt.value, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                                lineNumber: 148,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                lineNumber: 137,
                columnNumber: 9
            }, this);
        case 'checkbox':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-advanced-filter__item",
                style: {
                    gridColumn: item.span ? "span ".concat(item.span) : undefined
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "n3-advanced-filter__checkbox-wrapper",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "n3-advanced-filter__checkbox",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: !!value,
                                    onChange: (e)=>onChange(e.target.checked)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                                    lineNumber: 161,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "n3-advanced-filter__checkbox-label",
                                    children: [
                                        Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: "n3-advanced-filter__label-icon"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                                            lineNumber: 167,
                                            columnNumber: 26
                                        }, this),
                                        item.label
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                                    lineNumber: 166,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                            lineNumber: 160,
                            columnNumber: 13
                        }, this),
                        item.hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "n3-advanced-filter__checkbox-hint",
                            children: item.hint
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                            lineNumber: 172,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                    lineNumber: 159,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                lineNumber: 158,
                columnNumber: 9
            }, this);
        case 'custom':
            var _item_render;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-advanced-filter__item",
                style: {
                    gridColumn: item.span ? "span ".concat(item.span) : undefined
                },
                children: (_item_render = item.render) === null || _item_render === void 0 ? void 0 : _item_render.call(item, value, onChange)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                lineNumber: 180,
                columnNumber: 9
            }, this);
        default:
            return null;
    }
});
_c = FilterInput;
const N3AdvancedFilter = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c1 = function N3AdvancedFilter(param) {
    let { rows, values, onChange, onReset, hint, size, className = '' } = param;
    const sizeClass = size ? "n3-size-".concat(size) : '';
    const classes = [
        'n3-advanced-filter',
        sizeClass,
        className
    ].filter(Boolean).join(' ');
    const handleItemChange = (key, value)=>{
        onChange({
            ...values,
            [key]: value
        });
    };
    const HintIcon = (hint === null || hint === void 0 ? void 0 : hint.icon) || __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lightbulb$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lightbulb$3e$__["Lightbulb"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        children: [
            rows.map((row, rowIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, {
                    children: [
                        row.divider && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "n3-advanced-filter__divider"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                            lineNumber: 216,
                            columnNumber: 27
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "n3-advanced-filter__row n3-advanced-filter__row--".concat(row.columns),
                            children: row.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterInput, {
                                    item: item,
                                    value: values[item.key],
                                    onChange: (value)=>handleItemChange(item.key, value)
                                }, item.key, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                                    lineNumber: 219,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                            lineNumber: 217,
                            columnNumber: 11
                        }, this)
                    ]
                }, rowIdx, true, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                    lineNumber: 215,
                    columnNumber: 9
                }, this)),
            (onReset || hint) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-advanced-filter__divider",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'calc(var(--n3-gap) * 2)',
                        flexWrap: 'wrap'
                    },
                    children: [
                        onReset && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "n3-advanced-filter__actions",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onReset,
                                className: "n3-btn n3-btn-ghost",
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'calc(var(--n3-gap) * 0.5)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                        style: {
                                            width: 'var(--n3-icon)',
                                            height: 'var(--n3-icon)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                                        lineNumber: 241,
                                        columnNumber: 19
                                    }, this),
                                    "フィルタークリア"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                                lineNumber: 236,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                            lineNumber: 235,
                            columnNumber: 15
                        }, this),
                        hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "n3-advanced-filter__hint",
                            style: {
                                flex: 1
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HintIcon, {
                                    className: "n3-advanced-filter__hint-icon"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                                    lineNumber: 249,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "ヒント:"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                                            lineNumber: 251,
                                            columnNumber: 19
                                        }, this),
                                        " ",
                                        hint.message
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                                    lineNumber: 250,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                            lineNumber: 248,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                    lineNumber: 233,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
                lineNumber: 232,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx",
        lineNumber: 213,
        columnNumber: 5
    }, this);
});
_c2 = N3AdvancedFilter;
N3AdvancedFilter.displayName = 'N3AdvancedFilter';
const MARKETPLACE_OPTIONS = [
    {
        value: 'all',
        label: 'すべて'
    },
    {
        value: 'ebay',
        label: 'eBay',
        icon: '🛒'
    },
    {
        value: 'mercari',
        label: 'メルカリ',
        icon: '🔴'
    },
    {
        value: 'manual',
        label: '手動登録',
        icon: '✏️'
    }
];
const EBAY_ACCOUNT_OPTIONS = [
    {
        value: 'all',
        label: 'すべて'
    },
    {
        value: 'MJT',
        label: 'MJT',
        icon: '🔵'
    },
    {
        value: 'GREEN',
        label: 'GREEN',
        icon: '🟢'
    },
    {
        value: 'manual',
        label: '手動入力',
        icon: '✏️'
    }
];
const PRODUCT_TYPE_OPTIONS = [
    {
        value: 'all',
        label: 'すべて'
    },
    {
        value: 'stock',
        label: '有在庫'
    },
    {
        value: 'dropship',
        label: '無在庫'
    },
    {
        value: 'set',
        label: 'セット商品'
    },
    {
        value: 'variation',
        label: 'バリエーション'
    },
    {
        value: 'hybrid',
        label: 'ハイブリッド'
    }
];
const STOCK_STATUS_OPTIONS = [
    {
        value: 'all',
        label: 'すべて'
    },
    {
        value: 'in_stock',
        label: '在庫あり'
    },
    {
        value: 'out_of_stock',
        label: '欠品'
    }
];
const CONDITION_OPTIONS = [
    {
        value: 'all',
        label: 'すべて'
    },
    {
        value: 'new',
        label: '新品'
    },
    {
        value: 'used',
        label: '中古'
    },
    {
        value: 'refurbished',
        label: '整備済'
    }
];
const INVENTORY_TYPE_OPTIONS = [
    {
        value: 'all',
        label: 'すべて'
    },
    {
        value: 'ROTATION_90_DAYS',
        label: '回転商品（90日）',
        icon: '⚡'
    },
    {
        value: 'INVESTMENT_10_PERCENT',
        label: '投資商品（10%）',
        icon: '💎'
    }
];
const PRICE_PHASE_OPTIONS = [
    {
        value: 'all',
        label: 'すべて'
    },
    {
        value: 'NORMAL',
        label: '通常販売',
        icon: '✅'
    },
    {
        value: 'WARNING',
        label: '警戒販売',
        icon: '⚠️'
    },
    {
        value: 'LIQUIDATION',
        label: '損切り実行',
        icon: '🔴'
    }
];
const DAYS_HELD_OPTIONS = [
    {
        value: 'all',
        label: 'すべて'
    },
    {
        value: '0-90',
        label: '0-90日（通常）'
    },
    {
        value: '91-180',
        label: '91-180日（警戒）'
    },
    {
        value: '180+',
        label: '180日超（損切り）'
    }
];
const SITE_OPTIONS = [
    {
        value: 'all',
        label: 'すべて'
    },
    {
        value: 'US',
        label: 'USA (eBay.com)',
        icon: '🇺🇸'
    },
    {
        value: 'UK',
        label: 'UK (eBay.co.uk)',
        icon: '🇬🇧'
    },
    {
        value: 'AU',
        label: 'AU (eBay.com.au)',
        icon: '🇦🇺'
    }
];
const VARIATION_STATUS_OPTIONS = [
    {
        value: 'all',
        label: 'すべて'
    },
    {
        value: 'standalone',
        label: '単独SKU',
        icon: '🔹'
    },
    {
        value: 'parent',
        label: 'バリエーション親',
        icon: '👑'
    },
    {
        value: 'member',
        label: 'バリエーションメンバー',
        icon: '🔗'
    }
];
function createInventoryFilterRows() {
    let categories = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    return [
        // 1行目: 検索、マーケットプレイス、アカウント、商品タイプ、在庫状態
        {
            columns: 6,
            items: [
                {
                    key: 'search',
                    label: '商品名・SKU検索',
                    type: 'text',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
                    span: 2,
                    placeholder: '商品名またはSKUを入力...'
                },
                {
                    key: 'marketplace',
                    label: '販売モール',
                    type: 'select',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
                    options: MARKETPLACE_OPTIONS
                },
                {
                    key: 'ebay_account',
                    label: 'eBayアカウント',
                    type: 'select',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"],
                    options: EBAY_ACCOUNT_OPTIONS
                },
                {
                    key: 'product_type',
                    label: '商品タイプ',
                    type: 'select',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"],
                    options: PRODUCT_TYPE_OPTIONS
                },
                {
                    key: 'stock_status',
                    label: '在庫状態',
                    type: 'select',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
                    options: STOCK_STATUS_OPTIONS
                }
            ]
        },
        // 2行目: カテゴリ、コンディション、在庫タイプ、価格フェーズ、経過日数、サイト
        {
            columns: 6,
            items: [
                {
                    key: 'category',
                    label: 'カテゴリ',
                    type: 'select',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__["Folder"],
                    options: [
                        {
                            value: '',
                            label: 'すべて'
                        },
                        ...categories.map((c)=>({
                                value: c,
                                label: c
                            }))
                    ]
                },
                {
                    key: 'condition',
                    label: '商品状態',
                    type: 'select',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"],
                    options: CONDITION_OPTIONS
                },
                {
                    key: 'inventory_type',
                    label: '在庫タイプ',
                    type: 'select',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"],
                    options: INVENTORY_TYPE_OPTIONS
                },
                {
                    key: 'price_phase',
                    label: '価格フェーズ',
                    type: 'select',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"],
                    options: PRICE_PHASE_OPTIONS
                },
                {
                    key: 'days_held',
                    label: '経過日数',
                    type: 'select',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"],
                    options: DAYS_HELD_OPTIONS
                },
                {
                    key: 'site',
                    label: '販売サイト',
                    type: 'select',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"],
                    options: SITE_OPTIONS
                }
            ]
        },
        // 3行目: バリエーション関連
        {
            columns: 6,
            divider: true,
            items: [
                {
                    key: 'grouping_candidate',
                    label: 'バリエーション候補のみ表示',
                    type: 'checkbox',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"],
                    span: 2,
                    hint: '同カテゴリ・類似価格帯の商品をフィルター'
                },
                {
                    key: 'variation_status',
                    label: 'バリエーション状態',
                    type: 'select',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"],
                    options: VARIATION_STATUS_OPTIONS
                }
            ]
        }
    ];
}
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "FilterInput");
__turbopack_context__.k.register(_c1, "N3AdvancedFilter$memo");
__turbopack_context__.k.register(_c2, "N3AdvancedFilter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3GroupingPanel - グルーピングサイドバーコンポーネント
 * 
 * 棚卸し画面のGroupingBoxSidebarを汎用化
 * バリエーション/セット商品作成用のサイドパネル
 * 
 * @example
 * <N3GroupingPanel
 *   selectedItems={selectedProducts}
 *   onClear={clearSelection}
 *   onCreateVariation={handleCreateVariation}
 *   onCreateBundle={handleCreateBundle}
 *   compatibilityChecker={checkCompatibility}
 * />
 */ __turbopack_context__.s([
    "N3GroupingPanel",
    ()=>N3GroupingPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/layers.js [app-client] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// ============================================================
// Helper Components
// ============================================================
const CompatibilityCheckItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function CompatibilityCheckItem(param) {
    let { label, passed, value } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-grouping-panel__compat-item",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-grouping-panel__compat-label",
                children: [
                    passed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                        style: {
                            width: 'var(--n3-icon)',
                            height: 'var(--n3-icon)',
                            color: 'var(--color-success)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                        style: {
                            width: 'var(--n3-icon)',
                            height: 'var(--n3-icon)',
                            color: 'var(--color-error)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontWeight: 500
                        },
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-grouping-panel__compat-value",
                children: value
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
});
_c = CompatibilityCheckItem;
const SelectedItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function SelectedItem(param) {
    let { item, maxCost } = param;
    const cost = item.costPrice || 0;
    const excessProfit = maxCost - cost;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-grouping-panel__item",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "n3-grouping-panel__item-content",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "n3-grouping-panel__item-image",
                    style: {
                        backgroundImage: item.image ? "url(".concat(item.image, ")") : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    children: !item.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                        style: {
                            width: 'var(--n3-icon)',
                            height: 'var(--n3-icon)',
                            color: 'var(--text-muted)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 149,
                        columnNumber: 27
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "n3-grouping-panel__item-info",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "n3-grouping-panel__item-name",
                            children: item.name
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "n3-grouping-panel__item-sku",
                            children: item.sku || 'SKU未設定'
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "n3-grouping-panel__item-badges",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "n3-badge n3-badge-gray",
                                    style: {
                                        fontSize: 'calc(var(--n3-font) * 0.8)'
                                    },
                                    children: [
                                        "$",
                                        cost.toFixed(2)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this),
                                excessProfit > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "n3-badge n3-badge-success",
                                    style: {
                                        fontSize: 'calc(var(--n3-font) * 0.8)'
                                    },
                                    children: [
                                        "+$",
                                        excessProfit.toFixed(2)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                    lineNumber: 159,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
            lineNumber: 137,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
});
_c1 = SelectedItem;
const N3GroupingPanel = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c2 = _s(function N3GroupingPanel(param) {
    let { selectedItems, onClear, onCreateVariation, onCreateBundle, compatibilityChecker, onSearchParentCandidates, canCreateVariation, variationDisabledReason, size, className = '' } = param;
    _s();
    const sizeClass = size ? "n3-size-".concat(size) : '';
    const classes = [
        'n3-grouping-panel',
        sizeClass,
        className
    ].filter(Boolean).join(' ');
    const [compatibility, setCompatibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 最大DDPコスト
    const maxCost = selectedItems.length > 0 ? Math.max(...selectedItems.map((p)=>p.costPrice || 0)) : 0;
    // 追加利益合計
    const totalExcessProfit = selectedItems.reduce((sum, p)=>{
        const cost = p.costPrice || 0;
        return sum + (maxCost - cost);
    }, 0);
    // 適合性チェック
    const runCompatibilityCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3GroupingPanel.N3GroupingPanel.useCallback[runCompatibilityCheck]": async ()=>{
            if (selectedItems.length < 2 || !compatibilityChecker) {
                setCompatibility(null);
                return;
            }
            setLoading(true);
            try {
                const result = await compatibilityChecker(selectedItems);
                setCompatibility(result);
            } catch (error) {
                console.error('適合性チェックエラー:', error);
                setCompatibility(null);
            } finally{
                setLoading(false);
            }
        }
    }["N3GroupingPanel.N3GroupingPanel.useCallback[runCompatibilityCheck]"], [
        selectedItems,
        compatibilityChecker
    ]);
    // 選択が変わったらチェック実行（デバウンス付き）
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3GroupingPanel.N3GroupingPanel.useEffect": ()=>{
            if (selectedItems.length < 2) {
                setCompatibility(null);
                return;
            }
            const timer = setTimeout({
                "N3GroupingPanel.N3GroupingPanel.useEffect.timer": ()=>{
                    runCompatibilityCheck();
                }
            }["N3GroupingPanel.N3GroupingPanel.useEffect.timer"], 500);
            return ({
                "N3GroupingPanel.N3GroupingPanel.useEffect": ()=>clearTimeout(timer)
            })["N3GroupingPanel.N3GroupingPanel.useEffect"];
        }
    }["N3GroupingPanel.N3GroupingPanel.useEffect"], [
        selectedItems,
        runCompatibilityCheck
    ]);
    // バリエーション作成可能判定
    const isVariationEnabled = canCreateVariation !== undefined ? canCreateVariation : (compatibility === null || compatibility === void 0 ? void 0 : compatibility.isCompatible) && selectedItems.length >= 2;
    // 無効理由
    const getDisabledReason = ()=>{
        if (variationDisabledReason) return variationDisabledReason;
        if (selectedItems.length < 2) return '2個以上の商品を選択してください';
        if (compatibility && !compatibility.isCompatible) return '適合性チェックに合格していません';
        return 'バリエーション作成の準備完了';
    };
    // 空状態
    if (selectedItems.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: classes,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-grouping-panel__empty",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                        className: "n3-grouping-panel__empty-icon"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 254,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "n3-grouping-panel__empty-title",
                        children: "商品が選択されていません"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 255,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "n3-grouping-panel__empty-hint",
                        children: "商品カードのチェックボックスをクリックして選択してください"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 256,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                lineNumber: 253,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
            lineNumber: 252,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-grouping-panel__header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-grouping-panel__title-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "n3-grouping-panel__title",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                        style: {
                                            width: 'calc(var(--n3-icon) * 1.25)',
                                            height: 'calc(var(--n3-icon) * 1.25)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                        lineNumber: 270,
                                        columnNumber: 13
                                    }, this),
                                    "Grouping Box"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClear,
                                className: "n3-btn n3-btn-ghost n3-btn-sm",
                                children: "クリア"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "n3-grouping-panel__count",
                        children: [
                            selectedItems.length,
                            "個の商品を選択中"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 280,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                lineNumber: 267,
                columnNumber: 7
            }, this),
            selectedItems.length >= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-grouping-panel__compat",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'center',
                        padding: 'var(--n3-px)',
                        color: 'var(--text-muted)'
                    },
                    children: "チェック中..."
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                    lineNumber: 289,
                    columnNumber: 13
                }, this) : compatibility ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "n3-grouping-panel__compat-status n3-grouping-panel__compat-status--".concat(compatibility.isCompatible ? 'ok' : 'ng'),
                            children: compatibility.isCompatible ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                        style: {
                                            width: 'calc(var(--n3-icon) * 1.25)',
                                            height: 'calc(var(--n3-icon) * 1.25)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                        lineNumber: 297,
                                        columnNumber: 21
                                    }, this),
                                    "バリエーション作成可能"
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                        style: {
                                            width: 'calc(var(--n3-icon) * 1.25)',
                                            height: 'calc(var(--n3-icon) * 1.25)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                        lineNumber: 302,
                                        columnNumber: 21
                                    }, this),
                                    "バリエーション作成不可"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                            lineNumber: 294,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CompatibilityCheckItem, {
                            label: "DDPコスト近接",
                            passed: compatibility.checks.ddp.passed,
                            value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    "範囲: $",
                                    compatibility.checks.ddp.min.toFixed(2),
                                    " - $",
                                    compatibility.checks.ddp.max.toFixed(2),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                        lineNumber: 314,
                                        columnNumber: 21
                                    }, void 0),
                                    "差額: $",
                                    compatibility.checks.ddp.difference.toFixed(2),
                                    " (",
                                    compatibility.checks.ddp.differencePercent.toFixed(1),
                                    "%)"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                            lineNumber: 308,
                            columnNumber: 15
                        }, this),
                        compatibility.checks.weight.max > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CompatibilityCheckItem, {
                            label: "重量許容範囲",
                            passed: compatibility.checks.weight.passed,
                            value: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    "範囲: ",
                                    compatibility.checks.weight.min,
                                    "g - ",
                                    compatibility.checks.weight.max,
                                    "g",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                        lineNumber: 327,
                                        columnNumber: 23
                                    }, void 0),
                                    "比率: ",
                                    (compatibility.checks.weight.ratio * 100).toFixed(0),
                                    "%"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                            lineNumber: 321,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CompatibilityCheckItem, {
                            label: "カテゴリー一致",
                            passed: compatibility.checks.category.passed,
                            value: compatibility.checks.category.categories.length > 0 ? compatibility.checks.category.categories.join(', ') : '未設定'
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                            lineNumber: 334,
                            columnNumber: 15
                        }, this),
                        compatibility.warnings.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "n3-grouping-panel__warnings",
                            children: compatibility.warnings.map((warning, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-grouping-panel__warning",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            className: "n3-grouping-panel__warning-icon"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                            lineNumber: 349,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: warning
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                            lineNumber: 350,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, idx, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                    lineNumber: 348,
                                    columnNumber: 21
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                            lineNumber: 346,
                            columnNumber: 17
                        }, this),
                        compatibility.recommendedPolicy && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "n3-grouping-panel__policy",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "n3-grouping-panel__policy-title",
                                    children: "推薦配送ポリシー"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                    lineNumber: 359,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "n3-grouping-panel__policy-value",
                                    children: [
                                        compatibility.recommendedPolicy.name,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                            lineNumber: 362,
                                            columnNumber: 21
                                        }, this),
                                        "スコア: ",
                                        compatibility.recommendedPolicy.score.toFixed(1)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                    lineNumber: 360,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                            lineNumber: 358,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true) : null
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                lineNumber: 287,
                columnNumber: 9
            }, this),
            selectedItems.length >= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-grouping-panel__simulation",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "n3-grouping-panel__simulation-title",
                        children: "💰 価格シミュレーション"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 375,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-grouping-panel__simulation-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-grouping-panel__simulation-label",
                                children: "統一 Item Price:"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                lineNumber: 377,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-grouping-panel__simulation-value",
                                children: [
                                    "$",
                                    maxCost.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                lineNumber: 378,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 376,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-grouping-panel__simulation-row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-grouping-panel__simulation-label",
                                children: "追加利益合計:"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                lineNumber: 381,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-grouping-panel__simulation-value",
                                children: [
                                    "+$",
                                    totalExcessProfit.toFixed(2)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                lineNumber: 382,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 380,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "n3-grouping-panel__simulation-hint",
                        children: "※ 最大DDPコスト戦略により、構造的に赤字リスクはゼロです"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 384,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                lineNumber: 374,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-grouping-panel__items",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "n3-grouping-panel__items-title",
                        children: "選択中の商品"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 392,
                        columnNumber: 9
                    }, this),
                    selectedItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectedItem, {
                            item: item,
                            maxCost: maxCost
                        }, item.id, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                            lineNumber: 394,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                lineNumber: 391,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-grouping-panel__actions",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onCreateVariation,
                        disabled: !isVariationEnabled,
                        className: "n3-btn n3-btn-primary",
                        style: {
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'calc(var(--n3-gap) * 0.5)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"], {
                                style: {
                                    width: 'var(--n3-icon)',
                                    height: 'var(--n3-icon)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                lineNumber: 416,
                                columnNumber: 11
                            }, this),
                            "バリエーション作成（eBay）"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 404,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onCreateBundle,
                        disabled: selectedItems.length < 1,
                        className: "n3-btn n3-btn-outline-success",
                        style: {
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'calc(var(--n3-gap) * 0.5)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                style: {
                                    width: 'var(--n3-icon)',
                                    height: 'var(--n3-icon)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                                lineNumber: 431,
                                columnNumber: 11
                            }, this),
                            "セット品作成（全モール）"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 419,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "n3-grouping-panel__actions-hint",
                        children: getDisabledReason()
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                        lineNumber: 434,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
                lineNumber: 403,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx",
        lineNumber: 265,
        columnNumber: 5
    }, this);
}, "ezQiCtU4eBDsD0NpkDtBmrXYJQg=")), "ezQiCtU4eBDsD0NpkDtBmrXYJQg=");
_c3 = N3GroupingPanel;
N3GroupingPanel.displayName = 'N3GroupingPanel';
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "CompatibilityCheckItem");
__turbopack_context__.k.register(_c1, "SelectedItem");
__turbopack_context__.k.register(_c2, "N3GroupingPanel$memo");
__turbopack_context__.k.register(_c3, "N3GroupingPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3InventoryCard - 在庫商品カードコンポーネント
 * 
 * 棚卸し画面のProductCardを汎用化
 * フェーズ表示、利益率、経過日数、マーケットプレイスバッジ対応
 * 
 * @example
 * <N3InventoryCard
 *   product={product}
 *   isSelected={isSelected}
 *   onSelect={handleSelect}
 *   onEdit={handleEdit}
 *   marketplace="ebay"
 *   account="MJT"
 * />
 */ __turbopack_context__.s([
    "N3InventoryCard",
    ()=>N3InventoryCard,
    "N3InventoryCardGrid",
    ()=>N3InventoryCardGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
'use client';
;
;
;
// ============================================================
// Helper Functions
// ============================================================
const getPhaseInfo = (phase)=>{
    switch(phase){
        case 'NORMAL':
            return {
                label: '✅ 通常販売',
                color: 'success'
            };
        case 'WARNING':
            return {
                label: '⚠️ 警戒販売',
                color: 'warning'
            };
        case 'LIQUIDATION':
            return {
                label: '🔴 損切り実行',
                color: 'error'
            };
        default:
            return null;
    }
};
const getMarketplaceBadge = (marketplace, account)=>{
    switch(marketplace){
        case 'ebay':
            const accountUpper = (account || 'UNKNOWN').toUpperCase();
            const badgeType = accountUpper === 'GREEN' ? 'success' : accountUpper === 'MJT' ? 'info' : 'gray';
            return {
                label: "eBay ".concat(accountUpper),
                type: badgeType
            };
        case 'mercari':
            return {
                label: '🔴 メルカリ',
                type: 'error'
            };
        case 'manual':
            return {
                label: '✏️ 手動登録',
                type: 'gray'
            };
        default:
            return {
                label: '不明',
                type: 'warning',
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"]
            };
    }
};
const getProductTypeBadge = (productType)=>{
    switch(productType){
        case 'stock':
            return {
                label: '📦 有在庫',
                type: 'success'
            };
        case 'dropship':
            return {
                label: '❓ 未判定',
                type: 'gray'
            };
        case 'set':
            return {
                label: '📦 セット品',
                type: 'primary'
            };
        default:
            return {
                label: '⚠️ 未設定',
                type: 'gray'
            };
    }
};
const getStockBadge = (quantity)=>{
    if (!quantity || quantity === 0) {
        return {
            label: '在庫なし',
            type: 'error'
        };
    } else if (quantity < 5) {
        return {
            label: "少量 (".concat(quantity, ")"),
            type: 'warning'
        };
    }
    return {
        label: "在庫 ".concat(quantity),
        type: 'success'
    };
};
const N3InventoryCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = function N3InventoryCard(param) {
    let { product, isSelected = false, onSelect, onEdit, onDelete, onClick, currency = 'USD', additionalActions, size, className = '' } = param;
    var _product_images;
    const sizeClass = size ? "n3-size-".concat(size) : '';
    const classes = [
        'n3-inventory-card',
        isSelected ? 'n3-inventory-card--selected' : '',
        sizeClass,
        className
    ].filter(Boolean).join(' ');
    const imageUrl = ((_product_images = product.images) === null || _product_images === void 0 ? void 0 : _product_images[0]) || '';
    const phaseInfo = getPhaseInfo(product.pricePhase);
    const marketplaceBadge = getMarketplaceBadge(product.marketplace, product.account);
    const stockBadge = getStockBadge(product.physicalQuantity);
    const formatPrice = (price)=>{
        if (!price || price === 0) return '未設定';
        if (currency === 'JPY' || product.marketplace === 'mercari') {
            return "¥".concat(price.toLocaleString());
        }
        return "$".concat(price.toFixed(2));
    };
    const handleCardClick = (e)=>{
        // ボタンクリック時はカード全体のクリックを無効化
        if (e.target.closest('button')) return;
        if (onSelect) {
            onSelect();
        } else if (onClick) {
            onClick();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        onClick: handleCardClick,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-inventory-card__image-wrapper",
                children: [
                    imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: imageUrl,
                        alt: product.name,
                        className: "n3-inventory-card__image",
                        onError: (e)=>{
                            e.currentTarget.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image';
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--highlight)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                            style: {
                                width: 48,
                                height: 48,
                                color: 'var(--text-muted)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                            lineNumber: 211,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-inventory-card__overlay"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-inventory-card__top-badges",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-badge n3-badge-".concat(marketplaceBadge.type),
                                children: marketplaceBadge.label
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                lineNumber: 218,
                                columnNumber: 11
                            }, this),
                            phaseInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-badge n3-badge-".concat(phaseInfo.color),
                                children: phaseInfo.label
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                lineNumber: 222,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this),
                    product.daysHeld !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-inventory-card__bottom-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-badge",
                                style: {
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    backdropFilter: 'blur(4px)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                        style: {
                                            width: 12,
                                            height: 12,
                                            marginRight: 4
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                        lineNumber: 239,
                                        columnNumber: 15
                                    }, this),
                                    product.daysHeld,
                                    "日経過"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                lineNumber: 231,
                                columnNumber: 13
                            }, this),
                            product.remainingDays !== undefined && product.remainingDays > 0 && product.remainingDays < 90 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-badge",
                                style: {
                                    background: 'rgba(234, 88, 12, 0.7)',
                                    color: 'white',
                                    backdropFilter: 'blur(4px)'
                                },
                                children: [
                                    "残り",
                                    product.remainingDays,
                                    "日"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                lineNumber: 243,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                        lineNumber: 230,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-inventory-card__bottom-right",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "n3-badge n3-badge-".concat(stockBadge.type),
                            children: stockBadge.label
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                            lineNumber: 259,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                        lineNumber: 258,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-inventory-card__body",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "n3-inventory-card__title",
                        children: product.name
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    product.sku && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "n3-inventory-card__sku",
                        children: [
                            "SKU: ",
                            product.sku
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                        lineNumber: 270,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-inventory-card__prices",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-inventory-card__price-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "n3-inventory-card__price-label",
                                        children: "販売価格"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                        lineNumber: 276,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "n3-inventory-card__price-value n3-inventory-card__price-value--".concat(product.marketplace === 'mercari' ? 'mercari' : 'primary'),
                                        children: formatPrice(product.sellingPrice)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                        lineNumber: 277,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                lineNumber: 275,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-inventory-card__price-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "n3-inventory-card__price-label",
                                        children: "出品数"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                        lineNumber: 282,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "n3-inventory-card__price-value",
                                        style: {
                                            color: 'var(--text)'
                                        },
                                        children: product.listingQuantity || 0
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                lineNumber: 281,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-inventory-card__badges",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-badge ".concat(!product.condition ? 'n3-badge-gray' : product.condition.toLowerCase() === 'new' ? 'n3-badge-success' : 'n3-badge-warning'),
                                style: {
                                    fontSize: 'calc(var(--n3-font) * 0.85)'
                                },
                                children: product.condition || '状態不明'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                lineNumber: 291,
                                columnNumber: 11
                            }, this),
                            product.profitMargin !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-badge ".concat(product.profitMargin < 5 ? 'n3-badge-error' : product.profitMargin < 10 ? 'n3-badge-warning' : 'n3-badge-success'),
                                style: {
                                    fontSize: 'calc(var(--n3-font) * 0.85)'
                                },
                                children: [
                                    "利益率 ",
                                    product.profitMargin.toFixed(1),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                lineNumber: 299,
                                columnNumber: 13
                            }, this),
                            product.inventoryType && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-badge ".concat(product.inventoryType === 'ROTATION_90_DAYS' ? 'n3-badge-info' : 'n3-badge-purple'),
                                style: {
                                    fontSize: 'calc(var(--n3-font) * 0.85)'
                                },
                                children: product.inventoryType === 'ROTATION_90_DAYS' ? '⚡ 回転商品' : '💎 投資商品'
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                lineNumber: 308,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-inventory-card__actions",
                        children: [
                            onEdit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onEdit();
                                },
                                className: "n3-btn n3-btn-outline n3-btn-sm",
                                style: {
                                    flex: 1
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                        style: {
                                            width: 'var(--n3-icon)',
                                            height: 'var(--n3-icon)',
                                            marginRight: 4
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                        lineNumber: 324,
                                        columnNumber: 15
                                    }, this),
                                    "詳細"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                lineNumber: 319,
                                columnNumber: 13
                            }, this),
                            product.sellerHubUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    window.open(product.sellerHubUrl, '_blank');
                                },
                                className: "n3-btn n3-btn-ghost n3-btn-sm",
                                title: "Seller Hubで編集",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                    style: {
                                        width: 'var(--n3-icon)',
                                        height: 'var(--n3-icon)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                    lineNumber: 335,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                lineNumber: 330,
                                columnNumber: 13
                            }, this),
                            product.externalUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    window.open(product.externalUrl, '_blank');
                                },
                                className: "n3-btn n3-btn-ghost n3-btn-sm",
                                title: "外部サイトで開く",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                    style: {
                                        width: 'var(--n3-icon)',
                                        height: 'var(--n3-icon)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                    lineNumber: 345,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                                lineNumber: 340,
                                columnNumber: 13
                            }, this),
                            additionalActions
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
                lineNumber: 266,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
        lineNumber: 190,
        columnNumber: 5
    }, this);
});
_c1 = N3InventoryCard;
N3InventoryCard.displayName = 'N3InventoryCard';
const N3InventoryCardGrid = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c2 = function N3InventoryCardGrid(param) {
    let { children, columns = 4, gap = 'md', className = '' } = param;
    const gapSizes = {
        sm: '8px',
        md: '16px',
        lg: '24px'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        style: {
            display: 'grid',
            gridTemplateColumns: "repeat(".concat(columns, ", 1fr)"),
            gap: gapSizes[gap]
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx",
        lineNumber: 378,
        columnNumber: 5
    }, this);
});
_c3 = N3InventoryCardGrid;
N3InventoryCardGrid.displayName = 'N3InventoryCardGrid';
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "N3InventoryCard$memo");
__turbopack_context__.k.register(_c1, "N3InventoryCard");
__turbopack_context__.k.register(_c2, "N3InventoryCardGrid$memo");
__turbopack_context__.k.register(_c3, "N3InventoryCardGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3ApprovalGrid - 承認グリッドコンポーネント
 * 
 * 棚卸し画面のApprovalTabを汎用化
 * 承認ワークフロー、データ完全性チェック、グリッド表示対応
 * 
 * @example
 * <N3ApprovalGrid
 *   items={products}
 *   selectedIds={selectedIds}
 *   onToggleSelect={handleToggleSelect}
 *   onApprove={handleApprove}
 *   onReject={handleReject}
 *   checkCompleteness={checkDataCompleteness}
 * />
 */ __turbopack_context__.s([
    "N3ApprovalGrid",
    ()=>N3ApprovalGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// ============================================================
// Helper Components
// ============================================================
const ScoreBadge = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function ScoreBadge(param) {
    let { score } = param;
    const getScoreClass = (score)=>{
        if (score >= 85) return 'n3-approval-card__score--high';
        if (score >= 55) return 'n3-approval-card__score--medium';
        return 'n3-approval-card__score--low';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "n3-approval-card__score ".concat(getScoreClass(score)),
        children: score
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
});
_c = ScoreBadge;
const ApprovalCard = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function ApprovalCard(param) {
    let { item, isSelected, onToggleSelect, onViewDetail, isComplete } = param;
    const profitColor = (item.profitMargin || 0) >= 10 ? '#4ade80' : (item.profitMargin || 0) > 0 ? '#fbbf24' : '#ef4444';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "n3-approval-card ".concat(isSelected ? 'n3-approval-card--selected' : '', " ").concat(!isComplete ? 'n3-approval-card--incomplete' : ''),
        onClick: onToggleSelect,
        children: [
            !isComplete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-approval-card__badge-top-left",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "n3-badge n3-badge-solid-warning",
                    style: {
                        fontSize: 10,
                        padding: '2px 6px'
                    },
                    children: "不完全"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                    lineNumber: 141,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 140,
                columnNumber: 9
            }, this),
            item.filterPassed === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-approval-card__badge-top-right",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "n3-badge n3-badge-solid-error",
                    style: {
                        fontSize: 10,
                        padding: '2px 6px'
                    },
                    children: "フィルター停止"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                    lineNumber: 150,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 149,
                columnNumber: 9
            }, this),
            item.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: item.image,
                alt: item.title,
                className: "n3-approval-card__image",
                onError: (e)=>{
                    e.currentTarget.src = 'https://placehold.co/300x300/e2e8f0/64748b?text=No+Image';
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 158,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--highlight)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                    style: {
                        width: 32,
                        height: 32,
                        color: 'var(--text-muted)'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                    lineNumber: 175,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 167,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-approval-card__gradient"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            onViewDetail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: (e)=>{
                    e.stopPropagation();
                    onViewDetail();
                },
                className: "n3-approval-card__detail-btn n3-btn n3-btn-primary n3-btn-xs",
                children: "詳細"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 183,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-approval-card__info",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-approval-card__top",
                        children: [
                            item.aiScore !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScoreBadge, {
                                score: item.aiScore
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 194,
                                columnNumber: 42
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-approval-card__sku",
                                children: item.sku
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 195,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-approval-card__bottom",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "n3-approval-card__title",
                                children: item.title
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 199,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-approval-card__meta",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.condition || '不明'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                        lineNumber: 201,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            textAlign: 'right'
                                        },
                                        children: [
                                            item.stockType === 'stock' ? '有' : '無',
                                            "在庫"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                        lineNumber: 202,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 200,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "n3-approval-card__category",
                                children: [
                                    "📁 ",
                                    item.category || 'カテゴリ不明'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "n3-approval-card__profit-row",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: profitColor
                                        },
                                        children: [
                                            (item.profitMargin || 0).toFixed(1),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                        lineNumber: 206,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.originCountry || 'N/A'
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                        lineNumber: 207,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 205,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
});
_c1 = ApprovalCard;
const ConfirmModal = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function ConfirmModal(param) {
    let { title, message, items, confirmLabel, confirmVariant, onConfirm, onCancel } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: 'var(--n3-px)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "n3-card",
            style: {
                maxWidth: 600,
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    padding: 'calc(var(--n3-px) * 1.5)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--n3-gap)',
                            marginBottom: 'var(--n3-px)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                style: {
                                    width: 32,
                                    height: 32,
                                    color: 'var(--color-warning)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 256,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: 'calc(var(--n3-font) * 1.5)',
                                    fontWeight: 700
                                },
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 257,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 255,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: 'var(--color-warning-light)',
                            border: '1px solid var(--color-warning)',
                            borderRadius: 'var(--style-radius-md)',
                            padding: 'var(--n3-px)',
                            marginBottom: 'var(--n3-px)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: 'var(--n3-font)',
                                color: 'var(--color-warning)',
                                marginBottom: 'var(--n3-gap)'
                            },
                            children: message
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                            lineNumber: 269,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 260,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            maxHeight: 300,
                            overflow: 'auto',
                            marginBottom: 'calc(var(--n3-px) * 1.5)'
                        },
                        children: items.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: 'var(--highlight)',
                                    borderRadius: 'var(--style-radius-sm)',
                                    padding: 'var(--n3-px)',
                                    marginBottom: 'var(--n3-gap)',
                                    border: '1px solid var(--panel-border)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontWeight: 600,
                                            fontSize: 'var(--n3-font)',
                                            marginBottom: 'var(--n3-gap)'
                                        },
                                        children: item.name
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                        lineNumber: 286,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 'calc(var(--n3-gap) * 0.5)'
                                        },
                                        children: item.issues.map((issue, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "n3-badge n3-badge-warning",
                                                style: {
                                                    fontSize: 'calc(var(--n3-font) * 0.85)'
                                                },
                                                children: issue
                                            }, i, false, {
                                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                                lineNumber: 291,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                        lineNumber: 289,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, idx, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 276,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 274,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 'var(--n3-gap)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onCancel,
                                className: "n3-btn n3-btn-outline",
                                style: {
                                    flex: 1
                                },
                                children: "キャンセル"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 305,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onConfirm,
                                className: "n3-btn ".concat(confirmVariant === 'danger' ? 'n3-btn-error' : 'n3-btn-warning'),
                                style: {
                                    flex: 1,
                                    fontWeight: 600
                                },
                                children: confirmLabel
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 312,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 304,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 254,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
            lineNumber: 245,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
        lineNumber: 233,
        columnNumber: 5
    }, this);
});
_c2 = ConfirmModal;
const N3ApprovalGrid = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c3 = _s(function N3ApprovalGrid(param) {
    let { items, selectedIds, onToggleSelect, onSelectAll, onApprove, onReject, onUnapprove, onViewDetail, checkCompleteness, loading = false, onRefresh, stats, activeStatus = 'pending', onStatusChange, size, className = '' } = param;
    _s();
    const sizeClass = size ? "n3-size-".concat(size) : '';
    const classes = [
        sizeClass,
        className
    ].filter(Boolean).join(' ');
    const [showConfirmModal, setShowConfirmModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [incompleteItems, setIncompleteItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // データ完全性チェック
    const isItemComplete = (item)=>{
        if (checkCompleteness) {
            return checkCompleteness(item).length === 0;
        }
        return !item.incompleteFields || item.incompleteFields.length === 0;
    };
    // 承認前チェック
    const handleApprove = ()=>{
        const selectedItems = items.filter((i)=>selectedIds.has(i.id));
        const incomplete = selectedItems.map((item)=>({
                name: "".concat(item.sku, " - ").concat(item.title),
                issues: checkCompleteness ? checkCompleteness(item) : item.incompleteFields || []
            })).filter((i)=>i.issues.length > 0);
        if (incomplete.length > 0) {
            setIncompleteItems(incomplete);
            setShowConfirmModal(true);
        } else {
            onApprove(Array.from(selectedIds));
        }
    };
    const executeApprove = ()=>{
        onApprove(Array.from(selectedIds));
        setShowConfirmModal(false);
        setIncompleteItems([]);
    };
    // 却下
    const handleReject = ()=>{
        const reason = prompt('却下理由を入力してください:');
        if (reason) {
            onReject(Array.from(selectedIds), reason);
        }
    };
    // 統計計算
    const computedStats = stats || {
        total: items.length,
        pending: items.filter((i)=>i.approvalStatus === 'pending').length,
        approved: items.filter((i)=>i.approvalStatus === 'approved').length,
        rejected: items.filter((i)=>i.approvalStatus === 'rejected').length,
        complete: items.filter((i)=>isItemComplete(i)).length,
        incomplete: items.filter((i)=>!isItemComplete(i)).length
    };
    // ローディング
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 256
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    textAlign: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                        style: {
                            width: 48,
                            height: 48,
                            color: 'var(--color-primary)',
                            marginBottom: 'var(--n3-px)',
                            animation: 'spin 1s linear infinite'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 409,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: 'calc(var(--n3-font) * 1.25)',
                            color: 'var(--text-muted)'
                        },
                        children: "読み込み中..."
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 418,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 408,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
            lineNumber: 407,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--n3-px)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: 'var(--color-info-light)',
                    border: '1px solid var(--color-info)',
                    borderRadius: 'var(--style-radius-md)',
                    padding: 'calc(var(--n3-px) * 0.75)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'calc(var(--n3-gap) * 2)',
                        fontSize: 'var(--n3-font)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'calc(var(--n3-gap) * 0.5)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                    style: {
                                        width: 'var(--n3-icon)',
                                        height: 'var(--n3-icon)',
                                        color: 'var(--color-success)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                    lineNumber: 437,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: 'var(--color-success)',
                                        fontWeight: 500
                                    },
                                    children: [
                                        "完全: ",
                                        computedStats.complete,
                                        "件"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                    lineNumber: 438,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                            lineNumber: 436,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'calc(var(--n3-gap) * 0.5)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                    style: {
                                        width: 'var(--n3-icon)',
                                        height: 'var(--n3-icon)',
                                        color: 'var(--color-warning)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                    lineNumber: 441,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: 'var(--color-warning)',
                                        fontWeight: 500
                                    },
                                    children: [
                                        "不完全: ",
                                        computedStats.incomplete,
                                        "件"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                    lineNumber: 442,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                            lineNumber: 440,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                marginLeft: 'auto',
                                fontSize: 'calc(var(--n3-font) * 0.9)',
                                color: 'var(--text-muted)'
                            },
                            children: "※不完全なデータも確認後に承認可能です"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                            lineNumber: 444,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                    lineNumber: 435,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 427,
                columnNumber: 7
            }, this),
            onStatusChange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'calc(var(--n3-gap) * 0.5)',
                    fontSize: 'var(--n3-font)'
                },
                children: [
                    [
                        'all',
                        'pending',
                        'approved',
                        'rejected'
                    ].map((status)=>{
                        const labels = {
                            all: "全て: ".concat(computedStats.total),
                            pending: "承認待ち: ".concat(computedStats.pending),
                            approved: "承認済み: ".concat(computedStats.approved),
                            rejected: "却下: ".concat(computedStats.rejected)
                        };
                        const colors = {
                            all: 'primary',
                            pending: 'warning',
                            approved: 'success',
                            rejected: 'error'
                        };
                        const isActive = activeStatus === status;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onStatusChange(status),
                            className: "n3-btn n3-btn-sm ".concat(isActive ? "n3-btn-".concat(colors[status]) : 'n3-btn-outline'),
                            children: labels[status]
                        }, status, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                            lineNumber: 469,
                            columnNumber: 15
                        }, this);
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            marginLeft: 'auto',
                            fontSize: 'calc(var(--n3-font) * 0.9)',
                            color: 'var(--text-muted)'
                        },
                        children: [
                            "選択: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 600,
                                    color: 'var(--color-primary)'
                                },
                                children: selectedIds.size
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 479,
                                columnNumber: 17
                            }, this),
                            " 件"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 478,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 452,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-card",
                style: {
                    padding: 'calc(var(--n3-px) * 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'calc(var(--n3-gap) * 0.5)',
                    flexWrap: 'wrap'
                },
                children: [
                    onSelectAll && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onSelectAll,
                        className: "n3-btn n3-btn-outline n3-btn-sm",
                        children: selectedIds.size === items.length ? '全解除' : '全選択'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 496,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleApprove,
                        disabled: selectedIds.size === 0,
                        className: "n3-btn n3-btn-success n3-btn-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                style: {
                                    width: 'var(--n3-icon)',
                                    height: 'var(--n3-icon)',
                                    marginRight: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 506,
                                columnNumber: 11
                            }, this),
                            "一括承認"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 501,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleReject,
                        disabled: selectedIds.size === 0,
                        className: "n3-btn n3-btn-outline-error n3-btn-sm",
                        children: "一括却下"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 510,
                        columnNumber: 9
                    }, this),
                    onUnapprove && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onUnapprove(Array.from(selectedIds)),
                        disabled: selectedIds.size === 0,
                        className: "n3-btn n3-btn-outline-warning n3-btn-sm",
                        children: "承認取消"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 519,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 528,
                        columnNumber: 9
                    }, this),
                    onRefresh && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onRefresh,
                        className: "n3-btn n3-btn-outline n3-btn-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                style: {
                                    width: 'var(--n3-icon)',
                                    height: 'var(--n3-icon)',
                                    marginRight: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                                lineNumber: 532,
                                columnNumber: 13
                            }, this),
                            "更新"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 531,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 485,
                columnNumber: 7
            }, this),
            items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-card",
                style: {
                    padding: 'calc(var(--n3-px) * 4)',
                    textAlign: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                        style: {
                            width: 64,
                            height: 64,
                            color: 'var(--text-muted)',
                            margin: '0 auto',
                            marginBottom: 'var(--n3-px)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 547,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: 'calc(var(--n3-font) * 1.25)',
                            color: 'var(--text-muted)',
                            marginBottom: 'var(--n3-gap)'
                        },
                        children: activeStatus === 'pending' ? '承認待ちの商品がありません' : '商品がありません'
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 548,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: 'var(--text-subtle)'
                        },
                        children: "フィルターを変更して他の商品を表示できます"
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 551,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 540,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-approval-grid",
                children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ApprovalCard, {
                        item: item,
                        isSelected: selectedIds.has(item.id),
                        onToggleSelect: ()=>onToggleSelect(item.id),
                        onViewDetail: onViewDetail ? ()=>onViewDetail(item) : undefined,
                        isComplete: isItemComplete(item)
                    }, item.id, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                        lineNumber: 558,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 556,
                columnNumber: 9
            }, this),
            showConfirmModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfirmModal, {
                title: "データ不完全な商品の承認確認",
                message: "以下の商品はデータが不完全ですが、承認して出品スケジュールに追加しますか?",
                items: incompleteItems,
                confirmLabel: "不完全なまま承認する",
                confirmVariant: "warning",
                onConfirm: executeApprove,
                onCancel: ()=>{
                    setShowConfirmModal(false);
                    setIncompleteItems([]);
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
                lineNumber: 572,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx",
        lineNumber: 425,
        columnNumber: 5
    }, this);
}, "3QVxV1Y1Ra1ckRF7ZrZj3AZoEOI=")), "3QVxV1Y1Ra1ckRF7ZrZj3AZoEOI=");
_c4 = N3ApprovalGrid;
N3ApprovalGrid.displayName = 'N3ApprovalGrid';
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "ScoreBadge");
__turbopack_context__.k.register(_c1, "ApprovalCard");
__turbopack_context__.k.register(_c2, "ConfirmModal");
__turbopack_context__.k.register(_c3, "N3ApprovalGrid$memo");
__turbopack_context__.k.register(_c4, "N3ApprovalGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-alert.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3InventoryAlert - 在庫アラートコンポーネント
 * 
 * 棚卸し画面のInventoryAlertsを汎用化
 * 警告/損切りフェーズのアラート表示
 * 
 * @example
 * <N3InventoryAlert
 *   type="warning"
 *   title="警戒在庫"
 *   count={15}
 *   description="4-6ヶ月経過した商品"
 *   onAction={handleViewWarningItems}
 *   actionLabel="詳細を見る"
 * />
 */ __turbopack_context__.s([
    "N3InventoryAlert",
    ()=>N3InventoryAlert,
    "N3InventoryAlertGroup",
    ()=>N3InventoryAlertGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
'use client';
;
;
;
const N3InventoryAlert = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(function N3InventoryAlert(param) {
    let { type, title, count, description, icon, onAction, actionLabel = '詳細', size, className = '' } = param;
    const sizeClass = size ? "n3-size-".concat(size) : '';
    const classes = [
        'n3-inventory-alert',
        "n3-inventory-alert--".concat(type),
        sizeClass,
        className
    ].filter(Boolean).join(' ');
    // デフォルトアイコン
    const defaultIcons = {
        warning: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"],
        danger: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
        info: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"]
    };
    const Icon = icon || defaultIcons[type];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: classes,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: "n3-inventory-alert__icon"
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-alert.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "n3-inventory-alert__content",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "n3-inventory-alert__title",
                        children: [
                            title,
                            count !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "n3-inventory-alert__count",
                                style: {
                                    marginLeft: 'var(--n3-gap)'
                                },
                                children: [
                                    count,
                                    "件"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-alert.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-alert.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: 'calc(var(--n3-font) * 0.9)',
                            opacity: 0.9,
                            marginTop: 2
                        },
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-alert.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-alert.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            onAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onAction,
                className: "n3-inventory-alert__action n3-btn n3-btn-ghost n3-btn-sm",
                style: {
                    color: 'inherit'
                },
                children: [
                    actionLabel,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                        style: {
                            width: 'var(--n3-icon)',
                            height: 'var(--n3-icon)',
                            marginLeft: 4
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-alert.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-alert.tsx",
                lineNumber: 108,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-alert.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
});
_c = N3InventoryAlert;
N3InventoryAlert.displayName = 'N3InventoryAlert';
const N3InventoryAlertGroup = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c1 = function N3InventoryAlertGroup(param) {
    let { alerts, size, className = '' } = param;
    if (alerts.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--n3-gap)'
        },
        children: alerts.map((alert, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(N3InventoryAlert, {
                type: alert.type,
                title: alert.title,
                count: alert.count,
                description: alert.description,
                onAction: alert.onAction,
                actionLabel: alert.actionLabel,
                size: size
            }, idx, false, {
                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-alert.tsx",
                lineNumber: 155,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-alert.tsx",
        lineNumber: 150,
        columnNumber: 5
    }, this);
});
_c2 = N3InventoryAlertGroup;
N3InventoryAlertGroup.displayName = 'N3InventoryAlertGroup';
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "N3InventoryAlert");
__turbopack_context__.k.register(_c1, "N3InventoryAlertGroup$memo");
__turbopack_context__.k.register(_c2, "N3InventoryAlertGroup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3SetCreationModal - セット商品作成モーダルコンポーネント
 * 
 * 棚卸し画面のSetProductModalを汎用化
 * DDP計算統合、セット商品プレビュー
 * 
 * @example
 * <N3SetCreationModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   items={selectedItems}
 *   onConfirm={handleCreateSet}
 *   calculateDdp={calculateDdpCost}
 * />
 */ __turbopack_context__.s([
    "N3SetCreationModal",
    ()=>N3SetCreationModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const N3SetCreationModal = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(function N3SetCreationModal(param) {
    let { isOpen, onClose, items, onConfirm, calculateDdp, defaultSetName = '', defaultSetSku = '', exchangeRate = 150, size } = param;
    _s();
    const [setName, setSetName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultSetName);
    const [setSku, setSetSku] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultSetSku);
    const [calculation, setCalculation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [calculating, setCalculating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 簡易計算（calculateDdpが提供されていない場合）
    const simpleCalculation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3SetCreationModal.N3SetCreationModal.useMemo[simpleCalculation]": ()=>{
            const totalCostJpy = items.reduce({
                "N3SetCreationModal.N3SetCreationModal.useMemo[simpleCalculation].totalCostJpy": (sum, item)=>sum + (item.costJpy || 0)
            }["N3SetCreationModal.N3SetCreationModal.useMemo[simpleCalculation].totalCostJpy"], 0);
            const totalCostUsd = items.reduce({
                "N3SetCreationModal.N3SetCreationModal.useMemo[simpleCalculation].totalCostUsd": (sum, item)=>sum + (item.costUsd || (item.costJpy || 0) / exchangeRate)
            }["N3SetCreationModal.N3SetCreationModal.useMemo[simpleCalculation].totalCostUsd"], 0);
            const totalWeight = items.reduce({
                "N3SetCreationModal.N3SetCreationModal.useMemo[simpleCalculation].totalWeight": (sum, item)=>sum + (item.weight || 0)
            }["N3SetCreationModal.N3SetCreationModal.useMemo[simpleCalculation].totalWeight"], 0);
            // 簡易送料計算（$15基本 + $5/500g超過分）
            const baseShipping = 15;
            const extraWeight = Math.max(0, totalWeight - 500);
            const extraShippingCost = Math.ceil(extraWeight / 500) * 5;
            const shippingCost = baseShipping + extraShippingCost;
            // 関税・税金（15%概算）
            const dutiesAndTaxes = totalCostUsd * 0.15;
            // 最終DDP
            const finalDdpCost = totalCostUsd + shippingCost + dutiesAndTaxes;
            // 推奨価格（30%マージン）
            const recommendedPrice = finalDdpCost * 1.3;
            const profitMargin = 30;
            return {
                totalCostJpy,
                totalCostUsd,
                totalWeight,
                shippingCost,
                dutiesAndTaxes,
                finalDdpCost,
                recommendedPrice,
                profitMargin
            };
        }
    }["N3SetCreationModal.N3SetCreationModal.useMemo[simpleCalculation]"], [
        items,
        exchangeRate
    ]);
    // DDP計算を実行
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3SetCreationModal.N3SetCreationModal.useEffect": ()=>{
            if (!isOpen || items.length === 0) return;
            if (calculateDdp) {
                setCalculating(true);
                setError(null);
                calculateDdp(items).then({
                    "N3SetCreationModal.N3SetCreationModal.useEffect": (result)=>{
                        setCalculation(result);
                    }
                }["N3SetCreationModal.N3SetCreationModal.useEffect"]).catch({
                    "N3SetCreationModal.N3SetCreationModal.useEffect": (err)=>{
                        console.error('DDP計算エラー:', err);
                        setError('DDP計算に失敗しました。簡易計算を使用します。');
                        setCalculation(simpleCalculation);
                    }
                }["N3SetCreationModal.N3SetCreationModal.useEffect"]).finally({
                    "N3SetCreationModal.N3SetCreationModal.useEffect": ()=>{
                        setCalculating(false);
                    }
                }["N3SetCreationModal.N3SetCreationModal.useEffect"]);
            } else {
                setCalculation(simpleCalculation);
            }
        }
    }["N3SetCreationModal.N3SetCreationModal.useEffect"], [
        isOpen,
        items,
        calculateDdp,
        simpleCalculation
    ]);
    // 確定
    const handleConfirm = ()=>{
        if (!setName.trim()) {
            alert('セット名を入力してください');
            return;
        }
        if (!setSku.trim()) {
            alert('セットSKUを入力してください');
            return;
        }
        if (!calculation) {
            alert('計算が完了していません');
            return;
        }
        onConfirm({
            items,
            setName: setName.trim(),
            setSku: setSku.trim(),
            calculation
        });
    };
    if (!isOpen) return null;
    const sizeClass = size ? "n3-size-".concat(size) : '';
    const displayCalc = calculation || simpleCalculation;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: 'var(--n3-px)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "n3-card ".concat(sizeClass),
            style: {
                maxWidth: 600,
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'calc(var(--n3-px) * 1.25)',
                        borderBottom: '1px solid var(--panel-border)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--n3-gap)',
                                fontSize: 'calc(var(--n3-font) * 1.25)',
                                fontWeight: 700
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                    style: {
                                        width: 'calc(var(--n3-icon) * 1.25)',
                                        height: 'calc(var(--n3-icon) * 1.25)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this),
                                "セット商品作成"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                            lineNumber: 219,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "n3-btn n3-btn-ghost n3-btn-sm",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                style: {
                                    width: 'var(--n3-icon)',
                                    height: 'var(--n3-icon)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                            lineNumber: 229,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                    lineNumber: 210,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: 'calc(var(--n3-px) * 1.25)'
                    },
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "n3-inventory-alert n3-inventory-alert--warning",
                            style: {
                                marginBottom: 'var(--n3-px)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    className: "n3-inventory-alert__icon"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 242,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-inventory-alert__content",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "n3-inventory-alert__title",
                                        children: error
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                        lineNumber: 244,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 243,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                            lineNumber: 238,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "n3-set-modal__preview",
                            children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-set-modal__preview-item",
                                    children: [
                                        item.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: item.image,
                                            alt: item.name,
                                            className: "n3-set-modal__preview-image",
                                            onError: (e)=>{
                                                e.currentTarget.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=No+Image';
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 254,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "n3-set-modal__preview-image",
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'var(--highlight)'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                style: {
                                                    width: 24,
                                                    height: 24,
                                                    color: 'var(--text-muted)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                                lineNumber: 272,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 263,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "n3-set-modal__preview-name",
                                            children: item.sku || item.name
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 275,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, item.id, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 252,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                            lineNumber: 250,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: 'var(--n3-px)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "n3-form-label n3-form-label-required",
                                            children: "セット名"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 283,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: setName,
                                            onChange: (e)=>setSetName(e.target.value),
                                            placeholder: "例: Golf Club Set - 3 Pieces",
                                            className: "n3-input"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 284,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 282,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-form-group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "n3-form-label n3-form-label-required",
                                            children: "セットSKU"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 293,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: setSku,
                                            onChange: (e)=>setSku(e.target.value),
                                            placeholder: "例: SET-GOLF-001",
                                            className: "n3-input"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 294,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 292,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                            lineNumber: 281,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "n3-set-modal__calculation",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--n3-gap)',
                                        marginBottom: 'var(--n3-gap)',
                                        fontWeight: 600
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                                            style: {
                                                width: 'var(--n3-icon)',
                                                height: 'var(--n3-icon)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 313,
                                            columnNumber: 15
                                        }, this),
                                        "DDP計算結果",
                                        calculating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: 'calc(var(--n3-font) * 0.85)',
                                                color: 'var(--text-muted)',
                                                fontWeight: 400
                                            },
                                            children: "計算中..."
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 316,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 306,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-set-modal__calc-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-label",
                                            children: "原価合計（円）"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 323,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-value",
                                            children: [
                                                "¥",
                                                displayCalc.totalCostJpy.toLocaleString()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 324,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 322,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-set-modal__calc-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-label",
                                            children: "原価合計（USD）"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 327,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-value",
                                            children: [
                                                "$",
                                                displayCalc.totalCostUsd.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 328,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 326,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-set-modal__calc-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-label",
                                            children: "総重量"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 331,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-value",
                                            children: [
                                                displayCalc.totalWeight,
                                                "g"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 332,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 330,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-set-modal__calc-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-label",
                                            children: "送料"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 335,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-value",
                                            children: [
                                                "$",
                                                displayCalc.shippingCost.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 336,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 334,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-set-modal__calc-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-label",
                                            children: "関税・税金"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 339,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-value",
                                            children: [
                                                "$",
                                                displayCalc.dutiesAndTaxes.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 340,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 338,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-set-modal__calc-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-label",
                                            children: "最終DDP原価"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 343,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-value",
                                            children: [
                                                "$",
                                                displayCalc.finalDdpCost.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 344,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 342,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-set-modal__calc-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-label",
                                            children: "推奨販売価格"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 347,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-value",
                                            children: [
                                                "$",
                                                displayCalc.recommendedPrice.toFixed(2)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 348,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 346,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "n3-set-modal__calc-row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-label",
                                            children: "利益率"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 351,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "n3-set-modal__calc-value",
                                            children: [
                                                displayCalc.profitMargin.toFixed(1),
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                            lineNumber: 352,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 350,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                            lineNumber: 305,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                    lineNumber: 235,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        gap: 'var(--n3-gap)',
                        padding: 'calc(var(--n3-px) * 1.25)',
                        borderTop: '1px solid var(--panel-border)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "n3-btn n3-btn-outline",
                            style: {
                                flex: 1
                            },
                            children: "キャンセル"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                            lineNumber: 366,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleConfirm,
                            disabled: calculating || !setName.trim() || !setSku.trim(),
                            className: "n3-btn n3-btn-primary",
                            style: {
                                flex: 1
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                    style: {
                                        width: 'var(--n3-icon)',
                                        height: 'var(--n3-icon)',
                                        marginRight: 4
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                                    lineNumber: 375,
                                    columnNumber: 13
                                }, this),
                                "セット商品を作成"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                            lineNumber: 369,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
                    lineNumber: 358,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
            lineNumber: 200,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx",
        lineNumber: 188,
        columnNumber: 5
    }, this);
}, "kZw1KaQprimBCWVhvekHPo4OWlw=")), "kZw1KaQprimBCWVhvekHPo4OWlw=");
_c1 = N3SetCreationModal;
N3SetCreationModal.displayName = 'N3SetCreationModal';
var _c, _c1;
__turbopack_context__.k.register(_c, "N3SetCreationModal$memo");
__turbopack_context__.k.register(_c1, "N3SetCreationModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/components/n3/container/inventory/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * N3 Inventory Components
 * 
 * 棚卸し・在庫管理向け汎用コンポーネント
 * 
 * @example
 * import { 
 *   N3StatsSection,
 *   N3AdvancedFilter,
 *   N3GroupingPanel,
 *   N3InventoryCard,
 *   N3ApprovalGrid,
 *   N3InventoryAlert,
 *   N3SetCreationModal
 * } from '@/components/n3/container/inventory';
 */ // ============================================================
// Stats Section
// ============================================================
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$inventory$2f$n3$2d$stats$2d$section$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/inventory/n3-stats-section.tsx [app-client] (ecmascript)");
// ============================================================
// Advanced Filter
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$inventory$2f$n3$2d$advanced$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/inventory/n3-advanced-filter.tsx [app-client] (ecmascript)");
// ============================================================
// Grouping Panel
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$inventory$2f$n3$2d$grouping$2d$panel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/inventory/n3-grouping-panel.tsx [app-client] (ecmascript)");
// ============================================================
// Inventory Card
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$inventory$2f$n3$2d$inventory$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-card.tsx [app-client] (ecmascript)");
// ============================================================
// Approval Grid
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$inventory$2f$n3$2d$approval$2d$grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/inventory/n3-approval-grid.tsx [app-client] (ecmascript)");
// ============================================================
// Inventory Alert
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$inventory$2f$n3$2d$inventory$2d$alert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/inventory/n3-inventory-alert.tsx [app-client] (ecmascript)");
// ============================================================
// Set Creation Modal
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$container$2f$inventory$2f$n3$2d$set$2d$creation$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/container/inventory/n3-set-creation-modal.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_components_n3_container_inventory_a0c4c66f._.js.map