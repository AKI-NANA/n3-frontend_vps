(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/store/n3/listingUIStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// store/n3/listingUIStore.ts
/**
 * Listing N3 UI Store - 出品管理用UI状態
 *
 * 責務:
 * - ページネーション
 * - フィルター状態
 * - ソート状態
 * - 選択状態
 * - タブ状態
 *
 * ゴールドスタンダード準拠:
 * - サーバーデータは React Query で管理（このStoreには持たない）
 * - 各セレクターは値ごとに分離
 */ __turbopack_context__.s([
    "listingUIActions",
    ()=>listingUIActions,
    "useListingActiveTab",
    ()=>useListingActiveTab,
    "useListingCurrentPage",
    ()=>useListingCurrentPage,
    "useListingFilters",
    ()=>useListingFilters,
    "useListingPageSize",
    ()=>useListingPageSize,
    "useListingSelectedIds",
    ()=>useListingSelectedIds,
    "useListingShowStats",
    ()=>useListingShowStats,
    "useListingSortField",
    ()=>useListingSortField,
    "useListingSortOrder",
    ()=>useListingSortOrder,
    "useListingUIStore",
    ()=>useListingUIStore,
    "useListingViewMode",
    ()=>useListingViewMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware/immer.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature();
;
;
;
// ============================================================
// 初期状態
// ============================================================
const initialState = {
    activeTab: 'seo',
    currentPage: 1,
    pageSize: 50,
    filters: {},
    sortField: 'updatedAt',
    sortOrder: 'desc',
    selectedIds: [],
    viewMode: 'list',
    showStats: true
};
const useListingUIStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["immer"])((set)=>({
        ...initialState,
        // ========================================
        // タブ
        // ========================================
        setActiveTab: (tab)=>{
            set((state)=>{
                state.activeTab = tab;
                state.currentPage = 1;
                state.selectedIds = [];
            });
        },
        // ========================================
        // ページネーション
        // ========================================
        setPage: (page)=>{
            set((state)=>{
                state.currentPage = Math.max(1, page);
            });
        },
        setPageSize: (size)=>{
            set((state)=>{
                state.pageSize = size;
                state.currentPage = 1;
            });
        },
        // ========================================
        // フィルター
        // ========================================
        setFilters: (filters)=>{
            set((state)=>{
                state.filters = filters;
                state.currentPage = 1;
            });
        },
        updateFilter: (key, value)=>{
            set((state)=>{
                if (value === undefined || value === null || Array.isArray(value) && value.length === 0) {
                    delete state.filters[key];
                } else {
                    state.filters[key] = value;
                }
                state.currentPage = 1;
            });
        },
        clearFilters: ()=>{
            set((state)=>{
                state.filters = {};
                state.currentPage = 1;
            });
        },
        // ========================================
        // ソート
        // ========================================
        setSort: (field, order)=>{
            set((state)=>{
                if (state.sortField === field && !order) {
                    state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    state.sortField = field;
                    state.sortOrder = order || 'desc';
                }
            });
        },
        // ========================================
        // 選択
        // ========================================
        selectItem: (id)=>{
            set((state)=>{
                const index = state.selectedIds.indexOf(id);
                if (index === -1) {
                    state.selectedIds.push(id);
                } else {
                    state.selectedIds.splice(index, 1);
                }
            });
        },
        selectItems: (ids)=>{
            set((state)=>{
                ids.forEach((id)=>{
                    if (!state.selectedIds.includes(id)) {
                        state.selectedIds.push(id);
                    }
                });
            });
        },
        deselectItem: (id)=>{
            set((state)=>{
                const index = state.selectedIds.indexOf(id);
                if (index !== -1) {
                    state.selectedIds.splice(index, 1);
                }
            });
        },
        selectAll: (ids)=>{
            set((state)=>{
                state.selectedIds = [
                    ...ids
                ];
            });
        },
        clearSelection: ()=>{
            set((state)=>{
                state.selectedIds = [];
            });
        },
        // ========================================
        // 表示設定
        // ========================================
        setViewMode: (mode)=>{
            set((state)=>{
                state.viewMode = mode;
            });
        },
        toggleStats: ()=>{
            set((state)=>{
                state.showStats = !state.showStats;
            });
        },
        // ========================================
        // リセット
        // ========================================
        reset: ()=>{
            set(initialState);
        }
    })), {
    name: 'listing-n3-ui-store',
    partialize: (state)=>({
            pageSize: state.pageSize,
            viewMode: state.viewMode,
            showStats: state.showStats,
            sortField: state.sortField,
            sortOrder: state.sortOrder
        })
}), {
    name: 'ListingUIStore'
}));
const useListingActiveTab = ()=>{
    _s();
    return useListingUIStore({
        "useListingActiveTab.useListingUIStore": (state)=>state.activeTab
    }["useListingActiveTab.useListingUIStore"]);
};
_s(useListingActiveTab, "Du41lcjKBTGJWJyB0D7IaNu4/gw=", false, function() {
    return [
        useListingUIStore
    ];
});
const useListingCurrentPage = ()=>{
    _s1();
    return useListingUIStore({
        "useListingCurrentPage.useListingUIStore": (state)=>state.currentPage
    }["useListingCurrentPage.useListingUIStore"]);
};
_s1(useListingCurrentPage, "Du41lcjKBTGJWJyB0D7IaNu4/gw=", false, function() {
    return [
        useListingUIStore
    ];
});
const useListingPageSize = ()=>{
    _s2();
    return useListingUIStore({
        "useListingPageSize.useListingUIStore": (state)=>state.pageSize
    }["useListingPageSize.useListingUIStore"]);
};
_s2(useListingPageSize, "Du41lcjKBTGJWJyB0D7IaNu4/gw=", false, function() {
    return [
        useListingUIStore
    ];
});
const useListingFilters = ()=>{
    _s3();
    return useListingUIStore({
        "useListingFilters.useListingUIStore": (state)=>state.filters
    }["useListingFilters.useListingUIStore"]);
};
_s3(useListingFilters, "Du41lcjKBTGJWJyB0D7IaNu4/gw=", false, function() {
    return [
        useListingUIStore
    ];
});
const useListingSortField = ()=>{
    _s4();
    return useListingUIStore({
        "useListingSortField.useListingUIStore": (state)=>state.sortField
    }["useListingSortField.useListingUIStore"]);
};
_s4(useListingSortField, "Du41lcjKBTGJWJyB0D7IaNu4/gw=", false, function() {
    return [
        useListingUIStore
    ];
});
const useListingSortOrder = ()=>{
    _s5();
    return useListingUIStore({
        "useListingSortOrder.useListingUIStore": (state)=>state.sortOrder
    }["useListingSortOrder.useListingUIStore"]);
};
_s5(useListingSortOrder, "Du41lcjKBTGJWJyB0D7IaNu4/gw=", false, function() {
    return [
        useListingUIStore
    ];
});
const useListingSelectedIds = ()=>{
    _s6();
    return useListingUIStore({
        "useListingSelectedIds.useListingUIStore": (state)=>state.selectedIds
    }["useListingSelectedIds.useListingUIStore"]);
};
_s6(useListingSelectedIds, "Du41lcjKBTGJWJyB0D7IaNu4/gw=", false, function() {
    return [
        useListingUIStore
    ];
});
const useListingViewMode = ()=>{
    _s7();
    return useListingUIStore({
        "useListingViewMode.useListingUIStore": (state)=>state.viewMode
    }["useListingViewMode.useListingUIStore"]);
};
_s7(useListingViewMode, "Du41lcjKBTGJWJyB0D7IaNu4/gw=", false, function() {
    return [
        useListingUIStore
    ];
});
const useListingShowStats = ()=>{
    _s8();
    return useListingUIStore({
        "useListingShowStats.useListingUIStore": (state)=>state.showStats
    }["useListingShowStats.useListingUIStore"]);
};
_s8(useListingShowStats, "Du41lcjKBTGJWJyB0D7IaNu4/gw=", false, function() {
    return [
        useListingUIStore
    ];
});
const listingUIActions = {
    setActiveTab: (tab)=>useListingUIStore.getState().setActiveTab(tab),
    setPage: (page)=>useListingUIStore.getState().setPage(page),
    setFilters: (filters)=>useListingUIStore.getState().setFilters(filters),
    clearFilters: ()=>useListingUIStore.getState().clearFilters(),
    selectItem: (id)=>useListingUIStore.getState().selectItem(id),
    selectAll: (ids)=>useListingUIStore.getState().selectAll(ids),
    clearSelection: ()=>useListingUIStore.getState().clearSelection(),
    reset: ()=>useListingUIStore.getState().reset()
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/store/n3/analyticsUIStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// store/n3/analyticsUIStore.ts
/**
 * Analytics N3 UI Store - 分析用UI状態
 *
 * ゴールドスタンダード準拠:
 * - サーバーデータは React Query で管理
 * - 各セレクターは値ごとに分離
 */ __turbopack_context__.s([
    "useAnalyticsActiveTab",
    ()=>useAnalyticsActiveTab,
    "useAnalyticsChartType",
    ()=>useAnalyticsChartType,
    "useAnalyticsComparison",
    ()=>useAnalyticsComparison,
    "useAnalyticsCurrency",
    ()=>useAnalyticsCurrency,
    "useAnalyticsDateRange",
    ()=>useAnalyticsDateRange,
    "useAnalyticsGranularity",
    ()=>useAnalyticsGranularity,
    "useAnalyticsMarketplace",
    ()=>useAnalyticsMarketplace,
    "useAnalyticsUIStore",
    ()=>useAnalyticsUIStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware/immer.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react/shallow.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
;
;
// ============================================================
// 初期状態
// ============================================================
const initialState = {
    activeTab: 'sales',
    dateRangePreset: '30days',
    customDateRange: null,
    marketplace: [],
    category: [],
    productType: [],
    comparisonEnabled: false,
    comparisonPeriod: 'prev_period',
    chartType: 'line',
    showLegend: true,
    showDataLabels: false,
    granularity: 'day',
    currency: 'JPY'
};
const useAnalyticsUIStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["immer"])((set)=>({
        ...initialState,
        setActiveTab: (tab)=>{
            set((state)=>{
                state.activeTab = tab;
            });
        },
        setDateRangePreset: (preset)=>{
            set((state)=>{
                state.dateRangePreset = preset;
                if (preset !== 'custom') {
                    state.customDateRange = null;
                }
            });
        },
        setCustomDateRange: (range)=>{
            set((state)=>{
                state.dateRangePreset = 'custom';
                state.customDateRange = range;
            });
        },
        setMarketplace: (marketplaces)=>{
            set((state)=>{
                state.marketplace = marketplaces;
            });
        },
        setCategory: (categories)=>{
            set((state)=>{
                state.category = categories;
            });
        },
        setProductType: (types)=>{
            set((state)=>{
                state.productType = types;
            });
        },
        toggleComparison: ()=>{
            set((state)=>{
                state.comparisonEnabled = !state.comparisonEnabled;
            });
        },
        setComparisonPeriod: (period)=>{
            set((state)=>{
                state.comparisonPeriod = period;
            });
        },
        setChartType: (type)=>{
            set((state)=>{
                state.chartType = type;
            });
        },
        setGranularity: (granularity)=>{
            set((state)=>{
                state.granularity = granularity;
            });
        },
        setCurrency: (currency)=>{
            set((state)=>{
                state.currency = currency;
            });
        },
        clearFilters: ()=>{
            set((state)=>{
                state.marketplace = [];
                state.category = [];
                state.productType = [];
            });
        },
        reset: ()=>{
            set(initialState);
        }
    })), {
    name: 'analytics-n3-ui-store',
    partialize: (state)=>({
            granularity: state.granularity,
            currency: state.currency,
            chartType: state.chartType,
            showLegend: state.showLegend,
            showDataLabels: state.showDataLabels
        })
}), {
    name: 'AnalyticsUIStore'
}));
const useAnalyticsActiveTab = ()=>{
    _s();
    return useAnalyticsUIStore({
        "useAnalyticsActiveTab.useAnalyticsUIStore": (state)=>state.activeTab
    }["useAnalyticsActiveTab.useAnalyticsUIStore"]);
};
_s(useAnalyticsActiveTab, "15Lu2spfKWJxkoq6NmzdMrAMpYk=", false, function() {
    return [
        useAnalyticsUIStore
    ];
});
const useAnalyticsDateRange = ()=>{
    _s1();
    return useAnalyticsUIStore((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"])({
        "useAnalyticsDateRange.useAnalyticsUIStore.useShallow": (state)=>({
                preset: state.dateRangePreset,
                custom: state.customDateRange
            })
    }["useAnalyticsDateRange.useAnalyticsUIStore.useShallow"]));
};
_s1(useAnalyticsDateRange, "HQ3J5ymvd59f9MT4vU5zbS2l92w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"],
        useAnalyticsUIStore
    ];
});
const useAnalyticsMarketplace = ()=>{
    _s2();
    return useAnalyticsUIStore({
        "useAnalyticsMarketplace.useAnalyticsUIStore": (state)=>state.marketplace
    }["useAnalyticsMarketplace.useAnalyticsUIStore"]);
};
_s2(useAnalyticsMarketplace, "15Lu2spfKWJxkoq6NmzdMrAMpYk=", false, function() {
    return [
        useAnalyticsUIStore
    ];
});
const useAnalyticsChartType = ()=>{
    _s3();
    return useAnalyticsUIStore({
        "useAnalyticsChartType.useAnalyticsUIStore": (state)=>state.chartType
    }["useAnalyticsChartType.useAnalyticsUIStore"]);
};
_s3(useAnalyticsChartType, "15Lu2spfKWJxkoq6NmzdMrAMpYk=", false, function() {
    return [
        useAnalyticsUIStore
    ];
});
const useAnalyticsGranularity = ()=>{
    _s4();
    return useAnalyticsUIStore({
        "useAnalyticsGranularity.useAnalyticsUIStore": (state)=>state.granularity
    }["useAnalyticsGranularity.useAnalyticsUIStore"]);
};
_s4(useAnalyticsGranularity, "15Lu2spfKWJxkoq6NmzdMrAMpYk=", false, function() {
    return [
        useAnalyticsUIStore
    ];
});
const useAnalyticsCurrency = ()=>{
    _s5();
    return useAnalyticsUIStore({
        "useAnalyticsCurrency.useAnalyticsUIStore": (state)=>state.currency
    }["useAnalyticsCurrency.useAnalyticsUIStore"]);
};
_s5(useAnalyticsCurrency, "15Lu2spfKWJxkoq6NmzdMrAMpYk=", false, function() {
    return [
        useAnalyticsUIStore
    ];
});
const useAnalyticsComparison = ()=>{
    _s6();
    return useAnalyticsUIStore((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"])({
        "useAnalyticsComparison.useAnalyticsUIStore.useShallow": (state)=>({
                enabled: state.comparisonEnabled,
                period: state.comparisonPeriod
            })
    }["useAnalyticsComparison.useAnalyticsUIStore.useShallow"]));
};
_s6(useAnalyticsComparison, "HQ3J5ymvd59f9MT4vU5zbS2l92w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2f$shallow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useShallow"],
        useAnalyticsUIStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/store/n3/financeUIStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// store/n3/financeUIStore.ts
/**
 * Finance N3 UI Store - 会計用UI状態
 *
 * ゴールドスタンダード準拠:
 * - サーバーデータは React Query で管理
 * - 各セレクターは値ごとに分離
 */ __turbopack_context__.s([
    "useFinanceActiveTab",
    ()=>useFinanceActiveTab,
    "useFinanceCurrency",
    ()=>useFinanceCurrency,
    "useFinanceExpenseCategory",
    ()=>useFinanceExpenseCategory,
    "useFinanceJournalPage",
    ()=>useFinanceJournalPage,
    "useFinanceJournalStatus",
    ()=>useFinanceJournalStatus,
    "useFinanceKobutsuSearch",
    ()=>useFinanceKobutsuSearch,
    "useFinanceSelectedJournalIds",
    ()=>useFinanceSelectedJournalIds,
    "useFinanceUIStore",
    ()=>useFinanceUIStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware/immer.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
;
// ============================================================
// 初期状態
// ============================================================
const initialState = {
    activeTab: 'journal',
    journalStatus: 'all',
    journalDateRange: null,
    journalCurrentPage: 1,
    journalPageSize: 50,
    expenseCategory: 'all',
    expenseDateRange: null,
    expenseCurrentPage: 1,
    kobutsuDateRange: null,
    kobutsuSearch: '',
    kobutsuCurrentPage: 1,
    selectedJournalIds: [],
    selectedExpenseIds: [],
    selectedKobutsuIds: [],
    showApprovedOnly: false,
    autoRefresh: true,
    currency: 'JPY'
};
const useFinanceUIStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["immer"])((set)=>({
        ...initialState,
        setActiveTab: (tab)=>{
            set((state)=>{
                state.activeTab = tab;
            });
        },
        // 仕訳
        setJournalStatus: (status)=>{
            set((state)=>{
                state.journalStatus = status;
                state.journalCurrentPage = 1;
            });
        },
        setJournalDateRange: (range)=>{
            set((state)=>{
                state.journalDateRange = range;
                state.journalCurrentPage = 1;
            });
        },
        setJournalPage: (page)=>{
            set((state)=>{
                state.journalCurrentPage = page;
            });
        },
        selectJournal: (id)=>{
            set((state)=>{
                const index = state.selectedJournalIds.indexOf(id);
                if (index === -1) {
                    state.selectedJournalIds.push(id);
                } else {
                    state.selectedJournalIds.splice(index, 1);
                }
            });
        },
        clearJournalSelection: ()=>{
            set((state)=>{
                state.selectedJournalIds = [];
            });
        },
        // 経費
        setExpenseCategory: (category)=>{
            set((state)=>{
                state.expenseCategory = category;
                state.expenseCurrentPage = 1;
            });
        },
        setExpenseDateRange: (range)=>{
            set((state)=>{
                state.expenseDateRange = range;
                state.expenseCurrentPage = 1;
            });
        },
        setExpensePage: (page)=>{
            set((state)=>{
                state.expenseCurrentPage = page;
            });
        },
        selectExpense: (id)=>{
            set((state)=>{
                const index = state.selectedExpenseIds.indexOf(id);
                if (index === -1) {
                    state.selectedExpenseIds.push(id);
                } else {
                    state.selectedExpenseIds.splice(index, 1);
                }
            });
        },
        clearExpenseSelection: ()=>{
            set((state)=>{
                state.selectedExpenseIds = [];
            });
        },
        // 古物台帳
        setKobutsuDateRange: (range)=>{
            set((state)=>{
                state.kobutsuDateRange = range;
                state.kobutsuCurrentPage = 1;
            });
        },
        setKobutsuSearch: (search)=>{
            set((state)=>{
                state.kobutsuSearch = search;
                state.kobutsuCurrentPage = 1;
            });
        },
        setKobutsuPage: (page)=>{
            set((state)=>{
                state.kobutsuCurrentPage = page;
            });
        },
        selectKobutsu: (id)=>{
            set((state)=>{
                const index = state.selectedKobutsuIds.indexOf(id);
                if (index === -1) {
                    state.selectedKobutsuIds.push(id);
                } else {
                    state.selectedKobutsuIds.splice(index, 1);
                }
            });
        },
        clearKobutsuSelection: ()=>{
            set((state)=>{
                state.selectedKobutsuIds = [];
            });
        },
        // 設定
        toggleShowApprovedOnly: ()=>{
            set((state)=>{
                state.showApprovedOnly = !state.showApprovedOnly;
            });
        },
        toggleAutoRefresh: ()=>{
            set((state)=>{
                state.autoRefresh = !state.autoRefresh;
            });
        },
        setCurrency: (currency)=>{
            set((state)=>{
                state.currency = currency;
            });
        },
        reset: ()=>{
            set(initialState);
        }
    })), {
    name: 'finance-n3-ui-store',
    partialize: (state)=>({
            journalPageSize: state.journalPageSize,
            showApprovedOnly: state.showApprovedOnly,
            autoRefresh: state.autoRefresh,
            currency: state.currency
        })
}), {
    name: 'FinanceUIStore'
}));
const useFinanceActiveTab = ()=>{
    _s();
    return useFinanceUIStore({
        "useFinanceActiveTab.useFinanceUIStore": (state)=>state.activeTab
    }["useFinanceActiveTab.useFinanceUIStore"]);
};
_s(useFinanceActiveTab, "q+K/LLbuxBz3GD4mFoAAjeCOl+w=", false, function() {
    return [
        useFinanceUIStore
    ];
});
const useFinanceJournalStatus = ()=>{
    _s1();
    return useFinanceUIStore({
        "useFinanceJournalStatus.useFinanceUIStore": (state)=>state.journalStatus
    }["useFinanceJournalStatus.useFinanceUIStore"]);
};
_s1(useFinanceJournalStatus, "q+K/LLbuxBz3GD4mFoAAjeCOl+w=", false, function() {
    return [
        useFinanceUIStore
    ];
});
const useFinanceJournalPage = ()=>{
    _s2();
    return useFinanceUIStore({
        "useFinanceJournalPage.useFinanceUIStore": (state)=>state.journalCurrentPage
    }["useFinanceJournalPage.useFinanceUIStore"]);
};
_s2(useFinanceJournalPage, "q+K/LLbuxBz3GD4mFoAAjeCOl+w=", false, function() {
    return [
        useFinanceUIStore
    ];
});
const useFinanceSelectedJournalIds = ()=>{
    _s3();
    return useFinanceUIStore({
        "useFinanceSelectedJournalIds.useFinanceUIStore": (state)=>state.selectedJournalIds
    }["useFinanceSelectedJournalIds.useFinanceUIStore"]);
};
_s3(useFinanceSelectedJournalIds, "q+K/LLbuxBz3GD4mFoAAjeCOl+w=", false, function() {
    return [
        useFinanceUIStore
    ];
});
const useFinanceExpenseCategory = ()=>{
    _s4();
    return useFinanceUIStore({
        "useFinanceExpenseCategory.useFinanceUIStore": (state)=>state.expenseCategory
    }["useFinanceExpenseCategory.useFinanceUIStore"]);
};
_s4(useFinanceExpenseCategory, "q+K/LLbuxBz3GD4mFoAAjeCOl+w=", false, function() {
    return [
        useFinanceUIStore
    ];
});
const useFinanceKobutsuSearch = ()=>{
    _s5();
    return useFinanceUIStore({
        "useFinanceKobutsuSearch.useFinanceUIStore": (state)=>state.kobutsuSearch
    }["useFinanceKobutsuSearch.useFinanceUIStore"]);
};
_s5(useFinanceKobutsuSearch, "q+K/LLbuxBz3GD4mFoAAjeCOl+w=", false, function() {
    return [
        useFinanceUIStore
    ];
});
const useFinanceCurrency = ()=>{
    _s6();
    return useFinanceUIStore({
        "useFinanceCurrency.useFinanceUIStore": (state)=>state.currency
    }["useFinanceCurrency.useFinanceUIStore"]);
};
_s6(useFinanceCurrency, "q+K/LLbuxBz3GD4mFoAAjeCOl+w=", false, function() {
    return [
        useFinanceUIStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/store/n3/settingsUIStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// store/n3/settingsUIStore.ts
/**
 * Settings N3 UI Store - 設定用UI状態
 *
 * ゴールドスタンダード準拠:
 * - サーバーデータは React Query で管理
 * - 各セレクターは値ごとに分離
 */ __turbopack_context__.s([
    "useSettingsActiveSection",
    ()=>useSettingsActiveSection,
    "useSettingsActiveTab",
    ()=>useSettingsActiveTab,
    "useSettingsCredentialFilter",
    ()=>useSettingsCredentialFilter,
    "useSettingsHasUnsavedChanges",
    ()=>useSettingsHasUnsavedChanges,
    "useSettingsHtsSearch",
    ()=>useSettingsHtsSearch,
    "useSettingsHtsSelectedCategory",
    ()=>useSettingsHtsSelectedCategory,
    "useSettingsUIStore",
    ()=>useSettingsUIStore,
    "useSettingsValidationErrors",
    ()=>useSettingsValidationErrors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware/immer.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
;
// ============================================================
// 初期状態
// ============================================================
const initialState = {
    activeTab: 'hts',
    activeSection: 'general',
    htsSearch: '',
    htsSelectedCategory: null,
    htsExpandedNodes: [],
    ebayActiveAccount: null,
    ebayShowAdvanced: false,
    automationActiveRule: null,
    automationShowDisabled: false,
    credentialFilter: 'all',
    credentialSearch: '',
    hasUnsavedChanges: false,
    lastSavedAt: null,
    validationErrors: {}
};
const useSettingsUIStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["immer"])((set)=>({
        ...initialState,
        setActiveTab: (tab)=>{
            set((state)=>{
                state.activeTab = tab;
                state.activeSection = 'general';
            });
        },
        setActiveSection: (section)=>{
            set((state)=>{
                state.activeSection = section;
            });
        },
        // HTS
        setHtsSearch: (search)=>{
            set((state)=>{
                state.htsSearch = search;
            });
        },
        setHtsSelectedCategory: (category)=>{
            set((state)=>{
                state.htsSelectedCategory = category;
            });
        },
        toggleHtsNode: (nodeId)=>{
            set((state)=>{
                const index = state.htsExpandedNodes.indexOf(nodeId);
                if (index === -1) {
                    state.htsExpandedNodes.push(nodeId);
                } else {
                    state.htsExpandedNodes.splice(index, 1);
                }
            });
        },
        // eBay
        setEbayActiveAccount: (account)=>{
            set((state)=>{
                state.ebayActiveAccount = account;
            });
        },
        toggleEbayAdvanced: ()=>{
            set((state)=>{
                state.ebayShowAdvanced = !state.ebayShowAdvanced;
            });
        },
        // 自動化
        setAutomationActiveRule: (rule)=>{
            set((state)=>{
                state.automationActiveRule = rule;
            });
        },
        toggleAutomationShowDisabled: ()=>{
            set((state)=>{
                state.automationShowDisabled = !state.automationShowDisabled;
            });
        },
        // 認証情報
        setCredentialFilter: (filter)=>{
            set((state)=>{
                state.credentialFilter = filter;
            });
        },
        setCredentialSearch: (search)=>{
            set((state)=>{
                state.credentialSearch = search;
            });
        },
        // UI状態
        setHasUnsavedChanges: (has)=>{
            set((state)=>{
                state.hasUnsavedChanges = has;
            });
        },
        setLastSavedAt: (time)=>{
            set((state)=>{
                state.lastSavedAt = time;
                state.hasUnsavedChanges = false;
            });
        },
        setValidationError: (field, error)=>{
            set((state)=>{
                if (error === null) {
                    delete state.validationErrors[field];
                } else {
                    state.validationErrors[field] = error;
                }
            });
        },
        clearValidationErrors: ()=>{
            set((state)=>{
                state.validationErrors = {};
            });
        },
        reset: ()=>{
            set(initialState);
        }
    })), {
    name: 'settings-n3-ui-store',
    partialize: (state)=>({
            htsExpandedNodes: state.htsExpandedNodes,
            ebayShowAdvanced: state.ebayShowAdvanced,
            automationShowDisabled: state.automationShowDisabled
        })
}), {
    name: 'SettingsUIStore'
}));
const useSettingsActiveTab = ()=>{
    _s();
    return useSettingsUIStore({
        "useSettingsActiveTab.useSettingsUIStore": (state)=>state.activeTab
    }["useSettingsActiveTab.useSettingsUIStore"]);
};
_s(useSettingsActiveTab, "h7LvBnJ1N6PnllmoyJahWhF1f/w=", false, function() {
    return [
        useSettingsUIStore
    ];
});
const useSettingsActiveSection = ()=>{
    _s1();
    return useSettingsUIStore({
        "useSettingsActiveSection.useSettingsUIStore": (state)=>state.activeSection
    }["useSettingsActiveSection.useSettingsUIStore"]);
};
_s1(useSettingsActiveSection, "h7LvBnJ1N6PnllmoyJahWhF1f/w=", false, function() {
    return [
        useSettingsUIStore
    ];
});
const useSettingsHtsSearch = ()=>{
    _s2();
    return useSettingsUIStore({
        "useSettingsHtsSearch.useSettingsUIStore": (state)=>state.htsSearch
    }["useSettingsHtsSearch.useSettingsUIStore"]);
};
_s2(useSettingsHtsSearch, "h7LvBnJ1N6PnllmoyJahWhF1f/w=", false, function() {
    return [
        useSettingsUIStore
    ];
});
const useSettingsHtsSelectedCategory = ()=>{
    _s3();
    return useSettingsUIStore({
        "useSettingsHtsSelectedCategory.useSettingsUIStore": (state)=>state.htsSelectedCategory
    }["useSettingsHtsSelectedCategory.useSettingsUIStore"]);
};
_s3(useSettingsHtsSelectedCategory, "h7LvBnJ1N6PnllmoyJahWhF1f/w=", false, function() {
    return [
        useSettingsUIStore
    ];
});
const useSettingsHasUnsavedChanges = ()=>{
    _s4();
    return useSettingsUIStore({
        "useSettingsHasUnsavedChanges.useSettingsUIStore": (state)=>state.hasUnsavedChanges
    }["useSettingsHasUnsavedChanges.useSettingsUIStore"]);
};
_s4(useSettingsHasUnsavedChanges, "h7LvBnJ1N6PnllmoyJahWhF1f/w=", false, function() {
    return [
        useSettingsUIStore
    ];
});
const useSettingsValidationErrors = ()=>{
    _s5();
    return useSettingsUIStore({
        "useSettingsValidationErrors.useSettingsUIStore": (state)=>state.validationErrors
    }["useSettingsValidationErrors.useSettingsUIStore"]);
};
_s5(useSettingsValidationErrors, "h7LvBnJ1N6PnllmoyJahWhF1f/w=", false, function() {
    return [
        useSettingsUIStore
    ];
});
const useSettingsCredentialFilter = ()=>{
    _s6();
    return useSettingsUIStore({
        "useSettingsCredentialFilter.useSettingsUIStore": (state)=>state.credentialFilter
    }["useSettingsCredentialFilter.useSettingsUIStore"]);
};
_s6(useSettingsCredentialFilter, "h7LvBnJ1N6PnllmoyJahWhF1f/w=", false, function() {
    return [
        useSettingsUIStore
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/store/n3/operationsUIStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// store/n3/operationsUIStore.ts
/**
 * Operations N3 UI Store - オペレーション管理用UI状態
 *
 * 責務:
 * - タブ状態
 * - フィルター状態
 * - 選択状態
 * - 表示設定
 *
 * ゴールドスタンダード準拠:
 * - サーバーデータは React Query で管理（このStoreには持たない）
 * - 各セレクターは値ごとに分離
 */ __turbopack_context__.s([
    "operationsUIActions",
    ()=>operationsUIActions,
    "useOperationsActiveTab",
    ()=>useOperationsActiveTab,
    "useOperationsCurrentPage",
    ()=>useOperationsCurrentPage,
    "useOperationsFilters",
    ()=>useOperationsFilters,
    "useOperationsPageSize",
    ()=>useOperationsPageSize,
    "useOperationsSelectedIds",
    ()=>useOperationsSelectedIds,
    "useOperationsSelectedInquiryId",
    ()=>useOperationsSelectedInquiryId,
    "useOperationsSelectedOrderId",
    ()=>useOperationsSelectedOrderId,
    "useOperationsSelectedShippingId",
    ()=>useOperationsSelectedShippingId,
    "useOperationsShowLinkedPanel",
    ()=>useOperationsShowLinkedPanel,
    "useOperationsShowStats",
    ()=>useOperationsShowStats,
    "useOperationsSortField",
    ()=>useOperationsSortField,
    "useOperationsSortOrder",
    ()=>useOperationsSortOrder,
    "useOperationsUIStore",
    ()=>useOperationsUIStore,
    "useOperationsViewMode",
    ()=>useOperationsViewMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware/immer.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature(), _s11 = __turbopack_context__.k.signature(), _s12 = __turbopack_context__.k.signature();
;
;
;
// ============================================================
// 初期状態
// ============================================================
const initialState = {
    activeTab: 'orders',
    currentPage: 1,
    pageSize: 50,
    filters: {
        marketplace: 'all'
    },
    sortField: 'orderDate',
    sortOrder: 'desc',
    selectedOrderId: null,
    selectedShippingId: null,
    selectedInquiryId: null,
    selectedIds: [],
    viewMode: 'list',
    showStats: true,
    showLinkedPanel: true
};
const useOperationsUIStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["immer"])((set)=>({
        ...initialState,
        // ========================================
        // タブ
        // ========================================
        setActiveTab: (tab)=>{
            set((state)=>{
                state.activeTab = tab;
                state.currentPage = 1;
                state.selectedOrderId = null;
                state.selectedShippingId = null;
                state.selectedInquiryId = null;
                state.selectedIds = [];
            });
        },
        // ========================================
        // ページネーション
        // ========================================
        setPage: (page)=>{
            set((state)=>{
                state.currentPage = Math.max(1, page);
            });
        },
        setPageSize: (size)=>{
            set((state)=>{
                state.pageSize = size;
                state.currentPage = 1;
            });
        },
        // ========================================
        // フィルター
        // ========================================
        setFilters: (filters)=>{
            set((state)=>{
                state.filters = filters;
                state.currentPage = 1;
            });
        },
        updateFilter: (key, value)=>{
            set((state)=>{
                if (value === undefined || value === null || value === '') {
                    delete state.filters[key];
                } else {
                    state.filters[key] = value;
                }
                state.currentPage = 1;
            });
        },
        clearFilters: ()=>{
            set((state)=>{
                state.filters = {
                    marketplace: 'all'
                };
                state.currentPage = 1;
            });
        },
        // ========================================
        // ソート
        // ========================================
        setSort: (field, order)=>{
            set((state)=>{
                if (state.sortField === field && !order) {
                    state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    state.sortField = field;
                    state.sortOrder = order || 'desc';
                }
            });
        },
        // ========================================
        // 選択
        // ========================================
        selectOrder: (id)=>{
            set((state)=>{
                state.selectedOrderId = id;
                state.selectedShippingId = null;
                state.selectedInquiryId = null;
            });
        },
        selectShipping: (id)=>{
            set((state)=>{
                state.selectedShippingId = id;
                state.selectedOrderId = null;
                state.selectedInquiryId = null;
            });
        },
        selectInquiry: (id)=>{
            set((state)=>{
                state.selectedInquiryId = id;
                state.selectedOrderId = null;
                state.selectedShippingId = null;
            });
        },
        selectItem: (id)=>{
            set((state)=>{
                const index = state.selectedIds.indexOf(id);
                if (index === -1) {
                    state.selectedIds.push(id);
                } else {
                    state.selectedIds.splice(index, 1);
                }
            });
        },
        selectItems: (ids)=>{
            set((state)=>{
                state.selectedIds = [
                    ...ids
                ];
            });
        },
        clearSelection: ()=>{
            set((state)=>{
                state.selectedIds = [];
                state.selectedOrderId = null;
                state.selectedShippingId = null;
                state.selectedInquiryId = null;
            });
        },
        // ========================================
        // 表示設定
        // ========================================
        setViewMode: (mode)=>{
            set((state)=>{
                state.viewMode = mode;
            });
        },
        toggleStats: ()=>{
            set((state)=>{
                state.showStats = !state.showStats;
            });
        },
        toggleLinkedPanel: ()=>{
            set((state)=>{
                state.showLinkedPanel = !state.showLinkedPanel;
            });
        },
        // ========================================
        // リセット
        // ========================================
        reset: ()=>{
            set(initialState);
        }
    })), {
    name: 'operations-n3-ui-store',
    partialize: (state)=>({
            pageSize: state.pageSize,
            viewMode: state.viewMode,
            showStats: state.showStats,
            showLinkedPanel: state.showLinkedPanel,
            sortField: state.sortField,
            sortOrder: state.sortOrder
        })
}), {
    name: 'OperationsUIStore'
}));
const useOperationsActiveTab = ()=>{
    _s();
    return useOperationsUIStore({
        "useOperationsActiveTab.useOperationsUIStore": (state)=>state.activeTab
    }["useOperationsActiveTab.useOperationsUIStore"]);
};
_s(useOperationsActiveTab, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsCurrentPage = ()=>{
    _s1();
    return useOperationsUIStore({
        "useOperationsCurrentPage.useOperationsUIStore": (state)=>state.currentPage
    }["useOperationsCurrentPage.useOperationsUIStore"]);
};
_s1(useOperationsCurrentPage, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsPageSize = ()=>{
    _s2();
    return useOperationsUIStore({
        "useOperationsPageSize.useOperationsUIStore": (state)=>state.pageSize
    }["useOperationsPageSize.useOperationsUIStore"]);
};
_s2(useOperationsPageSize, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsFilters = ()=>{
    _s3();
    return useOperationsUIStore({
        "useOperationsFilters.useOperationsUIStore": (state)=>state.filters
    }["useOperationsFilters.useOperationsUIStore"]);
};
_s3(useOperationsFilters, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsSortField = ()=>{
    _s4();
    return useOperationsUIStore({
        "useOperationsSortField.useOperationsUIStore": (state)=>state.sortField
    }["useOperationsSortField.useOperationsUIStore"]);
};
_s4(useOperationsSortField, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsSortOrder = ()=>{
    _s5();
    return useOperationsUIStore({
        "useOperationsSortOrder.useOperationsUIStore": (state)=>state.sortOrder
    }["useOperationsSortOrder.useOperationsUIStore"]);
};
_s5(useOperationsSortOrder, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsSelectedOrderId = ()=>{
    _s6();
    return useOperationsUIStore({
        "useOperationsSelectedOrderId.useOperationsUIStore": (state)=>state.selectedOrderId
    }["useOperationsSelectedOrderId.useOperationsUIStore"]);
};
_s6(useOperationsSelectedOrderId, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsSelectedShippingId = ()=>{
    _s7();
    return useOperationsUIStore({
        "useOperationsSelectedShippingId.useOperationsUIStore": (state)=>state.selectedShippingId
    }["useOperationsSelectedShippingId.useOperationsUIStore"]);
};
_s7(useOperationsSelectedShippingId, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsSelectedInquiryId = ()=>{
    _s8();
    return useOperationsUIStore({
        "useOperationsSelectedInquiryId.useOperationsUIStore": (state)=>state.selectedInquiryId
    }["useOperationsSelectedInquiryId.useOperationsUIStore"]);
};
_s8(useOperationsSelectedInquiryId, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsSelectedIds = ()=>{
    _s9();
    return useOperationsUIStore({
        "useOperationsSelectedIds.useOperationsUIStore": (state)=>state.selectedIds
    }["useOperationsSelectedIds.useOperationsUIStore"]);
};
_s9(useOperationsSelectedIds, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsViewMode = ()=>{
    _s10();
    return useOperationsUIStore({
        "useOperationsViewMode.useOperationsUIStore": (state)=>state.viewMode
    }["useOperationsViewMode.useOperationsUIStore"]);
};
_s10(useOperationsViewMode, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsShowStats = ()=>{
    _s11();
    return useOperationsUIStore({
        "useOperationsShowStats.useOperationsUIStore": (state)=>state.showStats
    }["useOperationsShowStats.useOperationsUIStore"]);
};
_s11(useOperationsShowStats, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const useOperationsShowLinkedPanel = ()=>{
    _s12();
    return useOperationsUIStore({
        "useOperationsShowLinkedPanel.useOperationsUIStore": (state)=>state.showLinkedPanel
    }["useOperationsShowLinkedPanel.useOperationsUIStore"]);
};
_s12(useOperationsShowLinkedPanel, "b/exYHKWSW6IziaV6CRqfsPY2jk=", false, function() {
    return [
        useOperationsUIStore
    ];
});
const operationsUIActions = {
    setActiveTab: (tab)=>useOperationsUIStore.getState().setActiveTab(tab),
    setPage: (page)=>useOperationsUIStore.getState().setPage(page),
    setFilters: (filters)=>useOperationsUIStore.getState().setFilters(filters),
    clearFilters: ()=>useOperationsUIStore.getState().clearFilters(),
    selectOrder: (id)=>useOperationsUIStore.getState().selectOrder(id),
    selectShipping: (id)=>useOperationsUIStore.getState().selectShipping(id),
    selectInquiry: (id)=>useOperationsUIStore.getState().selectInquiry(id),
    clearSelection: ()=>useOperationsUIStore.getState().clearSelection(),
    reset: ()=>useOperationsUIStore.getState().reset()
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/store/n3/researchUIStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// store/n3/researchUIStore.ts
/**
 * Research N3 UI Store - リサーチ管理用UI状態
 *
 * 責務:
 * - タブ状態
 * - フィルター状態
 * - 選択状態
 * - 表示設定
 *
 * ゴールドスタンダード準拠:
 * - サーバーデータは React Query で管理（このStoreには持たない）
 * - 各セレクターは値ごとに分離
 */ __turbopack_context__.s([
    "researchUIActions",
    ()=>researchUIActions,
    "useResearchActiveTab",
    ()=>useResearchActiveTab,
    "useResearchCurrentPage",
    ()=>useResearchCurrentPage,
    "useResearchFilters",
    ()=>useResearchFilters,
    "useResearchPageSize",
    ()=>useResearchPageSize,
    "useResearchSelectedIds",
    ()=>useResearchSelectedIds,
    "useResearchSelectedItemId",
    ()=>useResearchSelectedItemId,
    "useResearchShowProfitCalculator",
    ()=>useResearchShowProfitCalculator,
    "useResearchShowStats",
    ()=>useResearchShowStats,
    "useResearchSortField",
    ()=>useResearchSortField,
    "useResearchSortOrder",
    ()=>useResearchSortOrder,
    "useResearchUIStore",
    ()=>useResearchUIStore,
    "useResearchViewMode",
    ()=>useResearchViewMode
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/zustand/esm/middleware/immer.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature(), _s7 = __turbopack_context__.k.signature(), _s8 = __turbopack_context__.k.signature(), _s9 = __turbopack_context__.k.signature(), _s10 = __turbopack_context__.k.signature();
;
;
;
// ============================================================
// 初期状態
// ============================================================
const initialState = {
    activeTab: 'research',
    currentPage: 1,
    pageSize: 50,
    filters: {},
    sortField: 'created_at',
    sortOrder: 'desc',
    selectedIds: [],
    selectedItemId: null,
    viewMode: 'table',
    showStats: true,
    showProfitCalculator: false
};
const useResearchUIStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["devtools"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2f$immer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["immer"])((set)=>({
        ...initialState,
        // ========================================
        // タブ
        // ========================================
        setActiveTab: (tab)=>{
            set((state)=>{
                state.activeTab = tab;
                state.currentPage = 1;
                state.selectedIds = [];
                state.selectedItemId = null;
            });
        },
        // ========================================
        // ページネーション
        // ========================================
        setPage: (page)=>{
            set((state)=>{
                state.currentPage = Math.max(1, page);
            });
        },
        setPageSize: (size)=>{
            set((state)=>{
                state.pageSize = size;
                state.currentPage = 1;
            });
        },
        // ========================================
        // フィルター
        // ========================================
        setFilters: (filters)=>{
            set((state)=>{
                state.filters = filters;
                state.currentPage = 1;
            });
        },
        updateFilter: (key, value)=>{
            set((state)=>{
                if (value === undefined || value === null || value === '') {
                    delete state.filters[key];
                } else {
                    state.filters[key] = value;
                }
                state.currentPage = 1;
            });
        },
        clearFilters: ()=>{
            set((state)=>{
                state.filters = {};
                state.currentPage = 1;
            });
        },
        // ========================================
        // ソート
        // ========================================
        setSort: (field, order)=>{
            set((state)=>{
                if (state.sortField === field && !order) {
                    state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    state.sortField = field;
                    state.sortOrder = order || 'desc';
                }
            });
        },
        // ========================================
        // 選択
        // ========================================
        selectItem: (id)=>{
            set((state)=>{
                state.selectedItemId = id;
            });
        },
        toggleSelect: (id)=>{
            set((state)=>{
                const index = state.selectedIds.indexOf(id);
                if (index === -1) {
                    state.selectedIds.push(id);
                } else {
                    state.selectedIds.splice(index, 1);
                }
            });
        },
        selectAll: (ids)=>{
            set((state)=>{
                state.selectedIds = [
                    ...ids
                ];
            });
        },
        clearSelection: ()=>{
            set((state)=>{
                state.selectedIds = [];
                state.selectedItemId = null;
            });
        },
        // ========================================
        // 表示設定
        // ========================================
        setViewMode: (mode)=>{
            set((state)=>{
                state.viewMode = mode;
            });
        },
        toggleStats: ()=>{
            set((state)=>{
                state.showStats = !state.showStats;
            });
        },
        toggleProfitCalculator: ()=>{
            set((state)=>{
                state.showProfitCalculator = !state.showProfitCalculator;
            });
        },
        // ========================================
        // リセット
        // ========================================
        reset: ()=>{
            set(initialState);
        }
    })), {
    name: 'research-n3-ui-store',
    partialize: (state)=>({
            pageSize: state.pageSize,
            viewMode: state.viewMode,
            showStats: state.showStats,
            sortField: state.sortField,
            sortOrder: state.sortOrder
        })
}), {
    name: 'ResearchUIStore'
}));
const useResearchActiveTab = ()=>{
    _s();
    return useResearchUIStore({
        "useResearchActiveTab.useResearchUIStore": (state)=>state.activeTab
    }["useResearchActiveTab.useResearchUIStore"]);
};
_s(useResearchActiveTab, "x/4M+HVgqvSltRkPCi+19t34Ics=", false, function() {
    return [
        useResearchUIStore
    ];
});
const useResearchCurrentPage = ()=>{
    _s1();
    return useResearchUIStore({
        "useResearchCurrentPage.useResearchUIStore": (state)=>state.currentPage
    }["useResearchCurrentPage.useResearchUIStore"]);
};
_s1(useResearchCurrentPage, "x/4M+HVgqvSltRkPCi+19t34Ics=", false, function() {
    return [
        useResearchUIStore
    ];
});
const useResearchPageSize = ()=>{
    _s2();
    return useResearchUIStore({
        "useResearchPageSize.useResearchUIStore": (state)=>state.pageSize
    }["useResearchPageSize.useResearchUIStore"]);
};
_s2(useResearchPageSize, "x/4M+HVgqvSltRkPCi+19t34Ics=", false, function() {
    return [
        useResearchUIStore
    ];
});
const useResearchFilters = ()=>{
    _s3();
    return useResearchUIStore({
        "useResearchFilters.useResearchUIStore": (state)=>state.filters
    }["useResearchFilters.useResearchUIStore"]);
};
_s3(useResearchFilters, "x/4M+HVgqvSltRkPCi+19t34Ics=", false, function() {
    return [
        useResearchUIStore
    ];
});
const useResearchSortField = ()=>{
    _s4();
    return useResearchUIStore({
        "useResearchSortField.useResearchUIStore": (state)=>state.sortField
    }["useResearchSortField.useResearchUIStore"]);
};
_s4(useResearchSortField, "x/4M+HVgqvSltRkPCi+19t34Ics=", false, function() {
    return [
        useResearchUIStore
    ];
});
const useResearchSortOrder = ()=>{
    _s5();
    return useResearchUIStore({
        "useResearchSortOrder.useResearchUIStore": (state)=>state.sortOrder
    }["useResearchSortOrder.useResearchUIStore"]);
};
_s5(useResearchSortOrder, "x/4M+HVgqvSltRkPCi+19t34Ics=", false, function() {
    return [
        useResearchUIStore
    ];
});
const useResearchSelectedIds = ()=>{
    _s6();
    return useResearchUIStore({
        "useResearchSelectedIds.useResearchUIStore": (state)=>state.selectedIds
    }["useResearchSelectedIds.useResearchUIStore"]);
};
_s6(useResearchSelectedIds, "x/4M+HVgqvSltRkPCi+19t34Ics=", false, function() {
    return [
        useResearchUIStore
    ];
});
const useResearchSelectedItemId = ()=>{
    _s7();
    return useResearchUIStore({
        "useResearchSelectedItemId.useResearchUIStore": (state)=>state.selectedItemId
    }["useResearchSelectedItemId.useResearchUIStore"]);
};
_s7(useResearchSelectedItemId, "x/4M+HVgqvSltRkPCi+19t34Ics=", false, function() {
    return [
        useResearchUIStore
    ];
});
const useResearchViewMode = ()=>{
    _s8();
    return useResearchUIStore({
        "useResearchViewMode.useResearchUIStore": (state)=>state.viewMode
    }["useResearchViewMode.useResearchUIStore"]);
};
_s8(useResearchViewMode, "x/4M+HVgqvSltRkPCi+19t34Ics=", false, function() {
    return [
        useResearchUIStore
    ];
});
const useResearchShowStats = ()=>{
    _s9();
    return useResearchUIStore({
        "useResearchShowStats.useResearchUIStore": (state)=>state.showStats
    }["useResearchShowStats.useResearchUIStore"]);
};
_s9(useResearchShowStats, "x/4M+HVgqvSltRkPCi+19t34Ics=", false, function() {
    return [
        useResearchUIStore
    ];
});
const useResearchShowProfitCalculator = ()=>{
    _s10();
    return useResearchUIStore({
        "useResearchShowProfitCalculator.useResearchUIStore": (state)=>state.showProfitCalculator
    }["useResearchShowProfitCalculator.useResearchUIStore"]);
};
_s10(useResearchShowProfitCalculator, "x/4M+HVgqvSltRkPCi+19t34Ics=", false, function() {
    return [
        useResearchUIStore
    ];
});
const researchUIActions = {
    setActiveTab: (tab)=>useResearchUIStore.getState().setActiveTab(tab),
    setPage: (page)=>useResearchUIStore.getState().setPage(page),
    setFilters: (filters)=>useResearchUIStore.getState().setFilters(filters),
    clearFilters: ()=>useResearchUIStore.getState().clearFilters(),
    selectItem: (id)=>useResearchUIStore.getState().selectItem(id),
    toggleSelect: (id)=>useResearchUIStore.getState().toggleSelect(id),
    selectAll: (ids)=>useResearchUIStore.getState().selectAll(ids),
    clearSelection: ()=>useResearchUIStore.getState().clearSelection(),
    reset: ()=>useResearchUIStore.getState().reset()
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/store/n3/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// store/n3/index.ts
/**
 * N3 UI Stores エクスポート
 *
 * 各N3ページ用のUI状態管理ストア
 * ゴールドスタンダード準拠: サーバーデータはReact Queryで管理
 */ // Listing N3
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$listingUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/n3/listingUIStore.ts [app-client] (ecmascript)");
// Analytics N3
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$analyticsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/n3/analyticsUIStore.ts [app-client] (ecmascript)");
// Finance N3
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$financeUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/n3/financeUIStore.ts [app-client] (ecmascript)");
// Settings N3
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$settingsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/n3/settingsUIStore.ts [app-client] (ecmascript)");
// Operations N3
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$operationsUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/n3/operationsUIStore.ts [app-client] (ecmascript)");
// Research N3
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$store$2f$n3$2f$researchUIStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/store/n3/researchUIStore.ts [app-client] (ecmascript)");
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
"[project]/n3-frontend_vps/hooks/useProductImages.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * useProductImages - 商品画像の共通取得フック
 * 
 * 複数のソースから画像URLを取得し、優先順位に従って返す
 * 優先順位: gallery_images > scraped_data.images > image_urls > listing_data.images
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getProductImages",
    ()=>getProductImages,
    "useProductImages",
    ()=>useProductImages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useProductImages(product) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useProductImages.useMemo": ()=>{
            if (!product) {
                return {
                    mainImage: null,
                    allImages: [],
                    imageCount: 0,
                    hasImages: false,
                    source: 'none'
                };
            }
            // 1. gallery_images（最優先）
            if (product.gallery_images && Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
                const filtered = product.gallery_images.filter(isValidImageUrl);
                if (filtered.length > 0) {
                    return {
                        mainImage: filtered[0],
                        allImages: filtered,
                        imageCount: filtered.length,
                        hasImages: true,
                        source: 'gallery_images'
                    };
                }
            }
            // 2. scraped_data.images
            if (product.scraped_data) {
                const scrapedImages = product.scraped_data.images;
                if (scrapedImages && Array.isArray(scrapedImages) && scrapedImages.length > 0) {
                    const filtered = scrapedImages.filter(isValidImageUrl);
                    if (filtered.length > 0) {
                        return {
                            mainImage: filtered[0],
                            allImages: filtered,
                            imageCount: filtered.length,
                            hasImages: true,
                            source: 'scraped_data'
                        };
                    }
                }
                // scraped_data.image_url（単一）
                if (product.scraped_data.image_url && isValidImageUrl(product.scraped_data.image_url)) {
                    return {
                        mainImage: product.scraped_data.image_url,
                        allImages: [
                            product.scraped_data.image_url
                        ],
                        imageCount: 1,
                        hasImages: true,
                        source: 'scraped_data'
                    };
                }
            }
            // 3. image_urls
            if (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
                const filtered = product.image_urls.filter(isValidImageUrl);
                if (filtered.length > 0) {
                    return {
                        mainImage: filtered[0],
                        allImages: filtered,
                        imageCount: filtered.length,
                        hasImages: true,
                        source: 'image_urls'
                    };
                }
            }
            // 4. image_url（単一）
            if (product.image_url && isValidImageUrl(product.image_url)) {
                return {
                    mainImage: product.image_url,
                    allImages: [
                        product.image_url
                    ],
                    imageCount: 1,
                    hasImages: true,
                    source: 'image_urls'
                };
            }
            // 5. listing_data.images / listing_data.gallery_images
            if (product.listing_data) {
                const listingImages = product.listing_data.images || product.listing_data.gallery_images;
                if (listingImages && Array.isArray(listingImages) && listingImages.length > 0) {
                    const filtered = listingImages.filter(isValidImageUrl);
                    if (filtered.length > 0) {
                        return {
                            mainImage: filtered[0],
                            allImages: filtered,
                            imageCount: filtered.length,
                            hasImages: true,
                            source: 'listing_data'
                        };
                    }
                }
                // listing_data.picture_url（単一）
                if (product.listing_data.picture_url && isValidImageUrl(product.listing_data.picture_url)) {
                    return {
                        mainImage: product.listing_data.picture_url,
                        allImages: [
                            product.listing_data.picture_url
                        ],
                        imageCount: 1,
                        hasImages: true,
                        source: 'listing_data'
                    };
                }
            }
            // 画像なし
            return {
                mainImage: null,
                allImages: [],
                imageCount: 0,
                hasImages: false,
                source: 'none'
            };
        }
    }["useProductImages.useMemo"], [
        product
    ]);
}
_s(useProductImages, "nwk+m61qLgjDVUp4IGV/072DDN4=");
/**
 * 画像URLが有効かどうかをチェック
 */ function isValidImageUrl(url) {
    if (typeof url !== 'string' || !url.trim()) {
        return false;
    }
    // 基本的なURL形式チェック
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('//')) {
        return false;
    }
    // 画像拡張子またはクエリパラメータがある場合はOK
    const imageExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.webp',
        '.svg'
    ];
    const lowerUrl = url.toLowerCase();
    const hasImageExtension = imageExtensions.some((ext)=>lowerUrl.includes(ext));
    const hasImageIndicator = lowerUrl.includes('image') || lowerUrl.includes('img') || lowerUrl.includes('photo');
    // プレースホルダー画像を除外
    if (lowerUrl.includes('placeholder') || lowerUrl.includes('no-image') || lowerUrl.includes('noimage')) {
        return false;
    }
    return hasImageExtension || hasImageIndicator || url.includes('?');
}
function getProductImages(product) {
    var _product_gallery_images, _product_scraped_data_images, _product_scraped_data, _product_scraped_data1, _product_image_urls, _product_listing_data, _product_listing_data1, _product_listing_data2;
    if (!product) {
        return {
            mainImage: null,
            allImages: [],
            imageCount: 0,
            hasImages: false,
            source: 'none'
        };
    }
    // 同じロジックを関数として実行
    // 1. gallery_images
    if ((_product_gallery_images = product.gallery_images) === null || _product_gallery_images === void 0 ? void 0 : _product_gallery_images.length) {
        const filtered = product.gallery_images.filter(isValidImageUrl);
        if (filtered.length > 0) {
            return {
                mainImage: filtered[0],
                allImages: filtered,
                imageCount: filtered.length,
                hasImages: true,
                source: 'gallery_images'
            };
        }
    }
    // 2. scraped_data.images
    if ((_product_scraped_data = product.scraped_data) === null || _product_scraped_data === void 0 ? void 0 : (_product_scraped_data_images = _product_scraped_data.images) === null || _product_scraped_data_images === void 0 ? void 0 : _product_scraped_data_images.length) {
        const filtered = product.scraped_data.images.filter(isValidImageUrl);
        if (filtered.length > 0) {
            return {
                mainImage: filtered[0],
                allImages: filtered,
                imageCount: filtered.length,
                hasImages: true,
                source: 'scraped_data'
            };
        }
    }
    if (((_product_scraped_data1 = product.scraped_data) === null || _product_scraped_data1 === void 0 ? void 0 : _product_scraped_data1.image_url) && isValidImageUrl(product.scraped_data.image_url)) {
        return {
            mainImage: product.scraped_data.image_url,
            allImages: [
                product.scraped_data.image_url
            ],
            imageCount: 1,
            hasImages: true,
            source: 'scraped_data'
        };
    }
    // 3. image_urls
    if ((_product_image_urls = product.image_urls) === null || _product_image_urls === void 0 ? void 0 : _product_image_urls.length) {
        const filtered = product.image_urls.filter(isValidImageUrl);
        if (filtered.length > 0) {
            return {
                mainImage: filtered[0],
                allImages: filtered,
                imageCount: filtered.length,
                hasImages: true,
                source: 'image_urls'
            };
        }
    }
    if (product.image_url && isValidImageUrl(product.image_url)) {
        return {
            mainImage: product.image_url,
            allImages: [
                product.image_url
            ],
            imageCount: 1,
            hasImages: true,
            source: 'image_urls'
        };
    }
    // 4. listing_data
    const listingImages = ((_product_listing_data = product.listing_data) === null || _product_listing_data === void 0 ? void 0 : _product_listing_data.images) || ((_product_listing_data1 = product.listing_data) === null || _product_listing_data1 === void 0 ? void 0 : _product_listing_data1.gallery_images);
    if (listingImages === null || listingImages === void 0 ? void 0 : listingImages.length) {
        const filtered = listingImages.filter(isValidImageUrl);
        if (filtered.length > 0) {
            return {
                mainImage: filtered[0],
                allImages: filtered,
                imageCount: filtered.length,
                hasImages: true,
                source: 'listing_data'
            };
        }
    }
    if (((_product_listing_data2 = product.listing_data) === null || _product_listing_data2 === void 0 ? void 0 : _product_listing_data2.picture_url) && isValidImageUrl(product.listing_data.picture_url)) {
        return {
            mainImage: product.listing_data.picture_url,
            allImages: [
                product.listing_data.picture_url
            ],
            imageCount: 1,
            hasImages: true,
            source: 'listing_data'
        };
    }
    return {
        mainImage: null,
        allImages: [],
        imageCount: 0,
        hasImages: false,
        source: 'none'
    };
}
const __TURBOPACK__default__export__ = useProductImages;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_f229f838._.js.map